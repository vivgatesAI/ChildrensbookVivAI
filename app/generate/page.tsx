'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const AGE_RANGES = [
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: '1st', label: '1st Grade' },
  { value: '2nd', label: '2nd Grade' },
  { value: '3rd', label: '3rd Grade' },
  { value: '4th', label: '4th Grade' },
  { value: '5th', label: '5th Grade' },
]

const ILLUSTRATION_STYLES = [
  'Studio Ghibli',
  'Hayao Miyazaki style',
  'Midcentury American cartoon',
  'Amar Chitra Katha',
  'Chacha Chaudhary',
]

export default function GeneratePage() {
  const router = useRouter()
  const [storyIdea, setStoryIdea] = useState('')
  const [ageRange, setAgeRange] = useState('2nd')
  const [illustrationStyle, setIllustrationStyle] = useState('Studio Ghibli')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!storyIdea.trim()) {
      alert('Please enter a story idea!')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyIdea,
          ageRange,
          illustrationStyle,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate book')
      }

      const data = await response.json()
      router.push(`/book/${data.bookId}`)
    } catch (error) {
      console.error('Error generating book:', error)
      alert('Failed to generate book. Please try again.')
      setIsGenerating(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-soft-cream dark:bg-dark-navy font-display">
      <div className="flex items-center justify-between p-4 pb-2">
        <button
          onClick={() => router.back()}
          className="flex size-12 shrink-0 items-center justify-center text-dark-navy dark:text-soft-cream"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back</span>
        </button>
        <h2 className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-dark-navy dark:text-soft-cream">
          Create Your Story
        </h2>
        <div className="w-12" />
      </div>

      <main className="flex grow flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto w-full max-w-sm">
          <div
            className="aspect-square w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgxAGWRCcBULUnJqgvIcpUDARPA6HA7Jb_Z7cn000bl7LhpJaR1tBxt1fQWawCmnHktpfoYxghCRPlScKpEASscjupGf2qyw7977OD8DfGtKx4x951NC9lcOP1NJCRH1Kz7bUfFD8DM83wqgdp1p6tZysZVzVx53nHdI90YRbv93DH-Zzw-M49l3Rj47z3GYwx5qB3I42dznDYBXX8tH4b_B4ki_jLaygEa7ila4gWFMlbAa-5pbPnIlpel_16bbI0MQJ7LNRHxw")',
            }}
          />
        </div>

        <h1 className="pt-6 pb-3 text-[32px] font-bold leading-tight tracking-light text-dark-navy dark:text-soft-cream">
          Dream Up a Story
        </h1>

        <div className="flex w-full max-w-lg flex-wrap items-end gap-4 py-3">
          <label className="flex min-w-40 flex-1 flex-col">
            <p className="sr-only pb-2 text-base font-medium leading-normal text-dark-navy/80 dark:text-soft-cream/80">
              Your story idea
            </p>
            <textarea
              value={storyIdea}
              onChange={(e) => setStoryIdea(e.target.value)}
              className="form-input min-h-36 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border-2 border-dark-navy/20 bg-white/70 p-[15px] text-base font-normal leading-normal text-dark-navy shadow-md placeholder:text-dark-navy/50 focus:border-coral focus:outline-0 focus:ring-2 focus:ring-coral dark:border-soft-cream/40 dark:bg-soft-cream/90 dark:text-dark-navy dark:placeholder:text-dark-navy/60"
              placeholder="A brave knight who is afraid of spiders, or a magical treehouse that travels through time..."
              disabled={isGenerating}
            />
          </label>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="pb-3 pt-1 text-sm font-medium leading-normal text-dark-navy/90 underline dark:text-soft-cream/90"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="w-full max-w-lg space-y-4 rounded-lg bg-white/70 p-4 shadow-md dark:bg-soft-cream/90">
            <div className="flex flex-col gap-2">
              <label className="text-left text-sm font-medium text-dark-navy dark:text-dark-navy">
                Age Range
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="rounded-lg border-2 border-dark-navy/20 bg-white p-3 text-base text-dark-navy focus:border-coral focus:outline-0 focus:ring-2 focus:ring-coral dark:border-soft-cream/40 dark:bg-soft-cream"
                disabled={isGenerating}
              >
                {AGE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-left text-sm font-medium text-dark-navy dark:text-dark-navy">
                Illustration Style
              </label>
              <select
                value={illustrationStyle}
                onChange={(e) => setIllustrationStyle(e.target.value)}
                className="rounded-lg border-2 border-dark-navy/20 bg-white p-3 text-base text-dark-navy focus:border-coral focus:outline-0 focus:ring-2 focus:ring-coral dark:border-soft-cream/40 dark:bg-soft-cream"
                disabled={isGenerating}
              >
                {ILLUSTRATION_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="w-full max-w-lg px-4 pt-6 pb-12">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-sunny-yellow px-8 py-4 text-base font-bold leading-6 text-dark-navy shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate My Book!'}
          </button>
        </div>
      </main>
    </div>
  )
}

