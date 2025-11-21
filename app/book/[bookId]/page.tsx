'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface BookPage {
  text: string
  image: string
}

interface Book {
  id: string
  title: string
  pages: BookPage[]
  ageRange: string
  illustrationStyle: string
  audioUrl?: string
}

export default function BookViewerPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.bookId as string
  const [book, setBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/book/${bookId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch book')
        }
        const data = await response.json()
        setBook(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching book:', error)
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  const handleGenerateAudio = async () => {
    if (!book) return

    setIsGeneratingAudio(true)
    try {
      const response = await fetch(`/api/generate-audio/${bookId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate audio')
      }

      const data = await response.json()
      setBook({ ...book, audioUrl: data.audioUrl })
    } catch (error) {
      console.error('Error generating audio:', error)
      alert('Failed to generate audio. Please try again.')
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading book...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Book not found</p>
      </div>
    )
  }

  const page = book.pages[currentPage]
  const totalPages = book.pages.length

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-2 backdrop-blur-sm dark:bg-background-dark/80">
        <button
          onClick={() => router.back()}
          className="flex size-12 shrink-0 items-center justify-start text-[#121c0d] dark:text-background-light"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#121c0d] dark:text-background-light">
          {book.title}
        </h2>
        <div className="flex w-12 items-center justify-end">
          {book.audioUrl ? (
            <audio controls className="h-8">
              <source src={book.audioUrl} type="audio/mpeg" />
            </audio>
          ) : (
            <button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="flex h-12 min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-transparent p-0 text-base font-bold leading-normal tracking-[0.015em] text-[#121c0d] dark:text-background-light disabled:opacity-50"
            >
              <span className="material-symbols-outlined">
                {isGeneratingAudio ? 'hourglass_empty' : 'volume_up'}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="h-1 bg-background-light dark:bg-background-dark" />

      <main className="flex flex-1 flex-col px-4">
        <div className="min-h-80 w-full flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center bg-no-repeat">
          {page.image && (
            <Image
              src={page.image}
              alt={`Page ${currentPage + 1} illustration`}
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <p className="flex-grow px-0 pb-3 pt-4 text-base font-normal leading-relaxed text-[#121c0d] dark:text-gray-300">
          {page.text}
        </p>
      </main>

      <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
        {book.pages.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentPage
                ? 'bg-primary'
                : 'bg-primary/20 dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="sticky bottom-0 bg-background-light/80 backdrop-blur-sm dark:bg-background-dark/80">
        <div className="flex flex-1 flex-wrap justify-between gap-3 px-4 py-4">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="flex h-12 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary/20 text-base font-bold leading-normal tracking-[0.015em] text-[#121c0d] disabled:opacity-50 dark:bg-primary/30 dark:text-background-light"
          >
            <span className="material-symbols-outlined">chevron_left</span>
            <span className="truncate">Previous</span>
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="flex h-12 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-primary text-base font-bold leading-normal tracking-[0.015em] text-[#121c0d] disabled:opacity-50 dark:bg-background-dark"
          >
            <span className="truncate">Next</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}

