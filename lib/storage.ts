// In-memory storage for books
// In production, replace this with a database (PostgreSQL, MongoDB, etc.)

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
}

const books: Map<string, Book> = new Map()

export function getBook(bookId: string): Book | undefined {
  return books.get(bookId)
}

export function setBook(bookId: string, book: Book): void {
  books.set(bookId, book)
}

export function hasBook(bookId: string): boolean {
  return books.has(bookId)
}

export { books }
export type { Book, BookPage, TitlePage }

