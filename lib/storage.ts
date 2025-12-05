// In-memory storage for books
// In production, replace this with a database (PostgreSQL, MongoDB, etc.)

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface BookPage {
  pageNumber: number
  text: string
  image: string
}

interface TitlePage {
  image: string
  title: string
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
  description?: string
  category?: string
  heroType?: 'animal' | 'person' | 'fantasy'
  setting?: string
  isSample?: boolean
}

const books: Map<string, Book> = new Map()

// Load sample books on initialization
function loadSampleBooks() {
  try {
    const sampleBooksPath = join(process.cwd(), 'data', 'sample-books', 'index.json')
    if (existsSync(sampleBooksPath)) {
      const sampleBooksData = readFileSync(sampleBooksPath, 'utf-8')
      const sampleBooks: Book[] = JSON.parse(sampleBooksData)
      
      sampleBooks.forEach(book => {
        book.isSample = true
        books.set(book.id, book)
      })
      
      console.log(`Loaded ${sampleBooks.length} sample books`)
    }
  } catch (error) {
    console.warn('Could not load sample books:', error)
  }
}

// Initialize sample books (server-side only)
let sampleBooksLoaded = false
if (typeof window === 'undefined' && !sampleBooksLoaded) {
  try {
    loadSampleBooks()
    sampleBooksLoaded = true
  } catch (error) {
    // Silently fail if sample books can't be loaded
  }
}

export function getBook(bookId: string): Book | undefined {
  return books.get(bookId)
}

export function setBook(bookId: string, book: Book): void {
  books.set(bookId, book)
}

export function hasBook(bookId: string): boolean {
  return books.has(bookId)
}

export function getAllSampleBooks(): Book[] {
  return Array.from(books.values()).filter(book => book.isSample === true)
}

export { books }
export type { Book, BookPage, TitlePage }

