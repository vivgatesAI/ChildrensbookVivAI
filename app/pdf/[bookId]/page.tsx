'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Icon } from '@/components/Icons'

interface BookPage {
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
}

export default function PDFViewPage() {
  const params = useParams()
  const bookId = params.bookId as string
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        
        // Trigger print dialog after a short delay to ensure page is loaded
        setTimeout(() => {
          window.print()
        }, 500)
      } catch (error) {
        console.error('Error fetching book:', error)
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading book...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Book not found</p>
      </div>
    )
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/generate-pdf/${bookId}`)
      if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        window.print()
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      window.print()
    }
  }

  return (
    <>
      {/* Download/Print Controls - Hidden when printing */}
      <div className="print-controls">
        <style jsx>{`
          .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
          }
          
          .print-controls button {
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.2s;
          }
          
          .print-controls button:hover {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.2);
          }
          
          @media print {
            .print-controls {
              display: none;
            }
          }
        `}</style>
        <button onClick={handleDownload}>
          <Icon name="download" size={20} />
          Download PDF
        </button>
        <button onClick={() => window.print()}>
          <span style={{ fontSize: '20px' }}>🖨️</span>
          Print
        </button>
      </div>
      
      <div className="pdf-container">
        <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .pdf-container {
            width: 100%;
            margin: 0;
            padding: 0;
          }
          
          .page {
            page-break-after: always;
            page-break-inside: avoid;
            width: 100%;
            min-height: 100vh;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            background: white;
          }
          
          .title-page {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
          }
          
          .title-page img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .content-page {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100vh;
            padding: 40px;
            box-sizing: border-box;
          }
          
          .page-image {
            width: 100%;
            max-height: 60vh;
            object-fit: contain;
            margin-bottom: 30px;
          }
          
          .page-text {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 18px;
            line-height: 1.8;
            color: #2d2d2d;
            flex: 1;
            text-align: left;
          }
          
          .page-number {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 12px;
            color: #999;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        }
        
        @media screen {
          body {
            background: #f5f5f5;
            padding: 20px;
          }
          
          .pdf-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          
          .page {
            margin-bottom: 20px;
            background: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }
          
          .title-page {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
          }
          
          .title-page img {
            max-width: 100%;
            max-height: 100vh;
            object-fit: contain;
          }
          
          .content-page {
            display: flex;
            flex-direction: column;
            padding: 40px;
            min-height: 100vh;
            position: relative;
          }
          
          .page-image {
            width: 100%;
            max-height: 60vh;
            object-fit: contain;
            margin-bottom: 30px;
          }
          
          .page-text {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 18px;
            line-height: 1.8;
            color: #2d2d2d;
            flex: 1;
          }
          
          .page-number {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 12px;
            color: #999;
          }
        }
      `}</style>
      
      {/* Title Page */}
      {book.titlePage && (
        <div className="page title-page">
          <img src={book.titlePage.image} alt={book.title} />
        </div>
      )}
      
      {/* Content Pages */}
      {book.pages.map((page, index) => (
        <div key={index} className="page content-page">
          <img src={page.image} alt={`Page ${page.pageNumber}`} className="page-image" />
          <div className="page-text">{page.text}</div>
          <div className="page-number">Page {page.pageNumber}</div>
        </div>
      ))}
    </div>
  )
}

