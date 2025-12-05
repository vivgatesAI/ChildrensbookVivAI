import { NextRequest, NextResponse } from 'next/server'
import { getBook } from '@/lib/storage'
import puppeteer from 'puppeteer-core'
import chromium from 'chrome-aws-lambda'

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  let browser = null
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

    // Get the base URL for generating absolute URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   request.headers.get('host') ? 
                   `https://${request.headers.get('host')}` : 
                   'http://localhost:3000'

    // Launch browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || undefined,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    
    // Navigate to the PDF view page
    await page.goto(`${baseUrl}/pdf/${params.bookId}`, {
      waitUntil: 'networkidle0',
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    })

    await browser.close()

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
      },
    })
  } catch (error: any) {
    if (browser) {
      await browser.close()
    }
    console.error('Error generating PDF:', error)
    
    // Fallback: redirect to print page if puppeteer fails
    return NextResponse.redirect(new URL(`/pdf/${params.bookId}`, request.url))
  }
}

