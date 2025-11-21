import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KinderQuill - Create Magical Storybooks',
  description: 'Create magical, personalized storybooks for your little ones.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-display">{children}</body>
    </html>
  )
}

