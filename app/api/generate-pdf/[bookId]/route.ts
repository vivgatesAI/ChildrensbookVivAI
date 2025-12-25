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
        { error: 'Book is not ready yet' },
        { status: 400 }
      )
    }

    // Redirect to the PDF view page which allows browser print-to-PDF
    // This is more reliable and doesn't require server-side dependencies
    return NextResponse.redirect(new URL(`/pdf/${params.bookId}`, request.url))
  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

