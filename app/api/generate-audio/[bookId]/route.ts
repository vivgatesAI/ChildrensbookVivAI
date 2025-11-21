import { NextRequest, NextResponse } from 'next/server'
import { getBook, setBook } from '@/lib/storage'

export async function POST(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const book = getBook(params.bookId)

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.status !== 'completed') {
      return NextResponse.json(
        { error: 'Book is not ready yet' },
        { status: 400 }
      )
    }

    // Combine all page texts into a single narrative
    const fullText = book.pages
      .map((page: any) => page.text)
      .join(' ')
      .trim()

    if (!fullText) {
      return NextResponse.json(
        { error: 'No text content found' },
        { status: 400 }
      )
    }

    // Generate audio using Venice API
    const audioResponse = await fetch(
      'https://api.venice.ai/api/v1/audio/speech',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VENICE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: fullText,
          model: 'tts-kokoro',
          voice: 'af_sky', // Child-friendly voice
          response_format: 'mp3',
          speed: 1.0,
          streaming: false,
        }),
      }
    )

    if (!audioResponse.ok) {
      const errorText = await audioResponse.text()
      console.error('Audio generation error:', errorText)
      throw new Error(`Audio generation failed: ${audioResponse.statusText}`)
    }

    // Convert audio to base64
    const audioBuffer = await audioResponse.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mpeg;base64,${audioBase64}`

    // Update book with audio URL
    book.audioUrl = audioUrl
    setBook(params.bookId, book)

    return NextResponse.json({ audioUrl })
  } catch (error: any) {
    console.error('Error generating audio:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate audio' },
      { status: 500 }
    )
  }
}

