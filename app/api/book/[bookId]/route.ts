import { NextRequest, NextResponse } from 'next/server'
import { getBook } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const book = await getBook(params.bookId)

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.status !== 'completed') {
      return NextResponse.json(
        { error: 'Book is still being generated' },
        { status: 202 }
      )
    }

    // Return book without internal status
    const { status, ...bookData } = book
    return NextResponse.json(bookData)
  } catch (error: any) {
    console.error('Error getting book:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get book' },
      { status: 500 }
    )
  }
}

