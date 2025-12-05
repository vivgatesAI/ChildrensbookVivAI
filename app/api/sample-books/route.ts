import { NextResponse } from 'next/server'
import { getAllSampleBooks, ensureSampleBooksLoaded } from '@/lib/storage'

export async function GET() {
  try {
    // Explicitly ensure sample books are loaded
    ensureSampleBooksLoaded()
    const sampleBooks = getAllSampleBooks()
    
    // Return books with minimal data for gallery display
    const galleryBooks = sampleBooks.map(book => ({
      id: book.id,
      title: book.title,
      description: book.description,
      category: book.category,
      heroType: book.heroType,
      setting: book.setting,
      ageRange: book.ageRange,
      illustrationStyle: book.illustrationStyle,
      titlePage: book.titlePage,
      pageCount: book.pages.length,
    }))
    
    return NextResponse.json(galleryBooks)
  } catch (error: any) {
    console.error('Error fetching sample books:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sample books' },
      { status: 500 }
    )
  }
}

