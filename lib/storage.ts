import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { getAdminDb } from './firebase-admin'
import { 
  getBookFromSQLite, 
  setBookInSQLite, 
  getUserBooksFromSQLite,
  deleteBookFromSQLite,
  toggleFavoriteInSQLite,
  getFavoritesFromSQLite,
  recordReadingInSQLite,
  getReadingStatsFromSQLite,
  getParentSettingsFromSQLite,
  setParentSettingsInSQLite,
} from './sqlite-storage'

interface BookPage {
  pageNumber: number
  text: string
  image: string
}

interface TitlePage {
  image: string
  title: string
}

interface Character {
  name: string
  type: string
  traits: string[]
}

interface Book {
  id: string
  title: string
  titlePage?: TitlePage
  pages: BookPage[]
  ageRange: string
  illustrationStyle: string
  status: 'generating' | 'completed' | 'error'
  audioUrl?: string
  createdAt: string
  expectedPages?: number
  generationProgress?: number // 0-100 percentage of image generation
  description?: string
  category?: string
  heroType?: 'animal' | 'person' | 'fantasy'
  setting?: string
  isSample?: boolean
  ownerId?: string // New field for user ownership
  narratorVoice?: string
  character?: Character
  prompts?: {
    story: string
    images: Array<{ pageNumber: number | 'cover'; prompt: string }>
  }
}

const sampleBooks: Map<string, Book> = new Map()

// Load sample books on initialization
function loadSampleBooks() {
  try {
    const sampleBooksPath = join(process.cwd(), 'data', 'sample-books', 'index.json')
    if (existsSync(sampleBooksPath)) {
      const sampleBooksData = readFileSync(sampleBooksPath, 'utf-8')
      const loadedBooks: Book[] = JSON.parse(sampleBooksData)

      loadedBooks.forEach(book => {
        book.isSample = true
        sampleBooks.set(book.id, book)
      })

      console.log(`Loaded ${loadedBooks.length} sample books`)
    }
  } catch (error) {
    console.warn('Could not load sample books:', error)
  }
}

// Initialize sample books (server-side only)
let sampleBooksLoaded = false

// Ensure sample books are loaded (call this from API routes)
export function ensureSampleBooksLoaded() {
  if (typeof window === 'undefined' && !sampleBooksLoaded) {
    try {
      loadSampleBooks()
      sampleBooksLoaded = true
    } catch (error) {
      console.error('Failed to load sample books:', error)
    }
  }
}

export async function getBook(bookId: string): Promise<Book | undefined> {
  // Ensure sample books are loaded when getting a book
  ensureSampleBooksLoaded()

  // Check sample books first (fast, in-memory)
  if (sampleBooks.has(bookId)) {
    return sampleBooks.get(bookId)
  }

  // Check in-memory books (for when Firebase is not configured)
  if (inMemoryBooks.has(bookId)) {
    return inMemoryBooks.get(bookId)
  }

  // Try SQLite first (persistent local storage)
  try {
    const sqliteBook = await getBookFromSQLite(bookId)
    if (sqliteBook) return sqliteBook
  } catch (error) {
    console.log('SQLite not available, trying Firestore...')
  }

  // Check Firestore (if configured)
  try {
    const db = getAdminDb()
    if (!db) {
      // Firebase not configured, only sample/in-memory books available
      return undefined
    }
    const doc = await db.collection('books').doc(bookId).get()

    if (doc.exists) {
      return doc.data() as Book
    }
  } catch (error) {
    console.error(`Error fetching book ${bookId} from Firestore:`, error)
  }

  return undefined
}

// In-memory storage for books when Firestore is not configured
const inMemoryBooks: Map<string, Book> = new Map()

export async function setBook(bookId: string, book: Book): Promise<void> {
  // If it's a sample book, update in memory (shouldn't really happen for creating new books)
  if (book.isSample) {
    sampleBooks.set(bookId, book)
    return
  }

  // Try SQLite first (persistent local storage)
  try {
    await setBookInSQLite(book)
    console.log(`Stored book ${bookId} in SQLite`)
    return
  } catch (error) {
    console.log('SQLite storage failed, trying Firestore...')
  }

  try {
    const db = getAdminDb()
    if (!db) {
      // Firebase not configured, store in memory (will be lost on restart)
      inMemoryBooks.set(bookId, book)
      console.log(`Stored book ${bookId} in memory (Firebase not configured)`)
      return
    }
    // Convert to plain object if needed, but Firestore handles JSON-like objects
    // Careful with undefined values, Firestore ignores them but it's good practice to clean
    const bookData = JSON.parse(JSON.stringify(book))
    await db.collection('books').doc(bookId).set(bookData, { merge: true })
  } catch (error) {
    console.error(`Error saving book ${bookId} to Firestore:`, error)
    throw error
  }
}

export async function hasBook(bookId: string): Promise<boolean> {
  if (sampleBooks.has(bookId)) return true
  if (inMemoryBooks.has(bookId)) return true

  try {
    const db = getAdminDb()
    if (!db) {
      return false
    }
    const doc = await db.collection('books').doc(bookId).get()
    return doc.exists
  } catch (error) {
    return false
  }
}

export function getAllSampleBooks(): Book[] {
  // Ensure sample books are loaded before returning
  ensureSampleBooksLoaded()
  return Array.from(sampleBooks.values())
}

// New: Get books for a specific user
export async function getUserBooks(userId: string): Promise<Book[]> {
  // Try SQLite first
  try {
    const sqliteBooks = await getUserBooksFromSQLite(userId)
    if (sqliteBooks.length > 0) return sqliteBooks
  } catch (error) {
    console.log('SQLite query failed, trying Firestore...')
  }

  try {
    const db = getAdminDb()
    if (!db) {
      // Firebase not configured, return in-memory books for this user
      return Array.from(inMemoryBooks.values()).filter(book => book.ownerId === userId)
    }
    const snapshot = await db.collection('books')
      .where('ownerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get()

    return snapshot.docs.map(doc => doc.data() as Book)
  } catch (error) {
    console.error(`Error fetching books for user ${userId}:`, error)
    return []
  }
}

// New: Library/Favorites functions
export async function toggleFavorite(userId: string, bookId: string): Promise<boolean> {
  try {
    return await toggleFavoriteInSQLite(userId, bookId)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return false
  }
}

export async function getFavorites(userId: string): Promise<string[]> {
  try {
    return await getFavoritesFromSQLite(userId)
  } catch (error) {
    console.error('Error getting favorites:', error)
    return []
  }
}

export async function recordReading(userId: string, bookId: string, durationSeconds: number = 0, completed: boolean = true): Promise<void> {
  try {
    await recordReadingInSQLite(userId, bookId, durationSeconds, completed)
  } catch (error) {
    console.error('Error recording reading:', error)
  }
}

export async function getReadingStats(userId: string) {
  try {
    return await getReadingStatsFromSQLite(userId)
  } catch (error) {
    console.error('Error getting reading stats:', error)
    return {
      totalBooksRead: 0,
      totalReadingTime: 0,
      favoriteBooks: [],
      recentBooks: [],
    }
  }
}

export async function getParentSettings(userId: string) {
  try {
    return await getParentSettingsFromSQLite(userId)
  } catch (error) {
    console.error('Error getting parent settings:', error)
    return undefined
  }
}

export async function setParentSettings(userId: string, settings: {
  contentFilterEnabled?: boolean
  maxBooksPerDay?: number
  allowSharing?: boolean
  requireApproval?: boolean
}) {
  try {
    await setParentSettingsInSQLite(userId, settings)
  } catch (error) {
    console.error('Error setting parent settings:', error)
  }
}

export { sampleBooks as books }
export type { Book, BookPage, TitlePage }
