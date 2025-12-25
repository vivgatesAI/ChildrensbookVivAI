'use client'

import { useState, useEffect } from 'react'
import { Icon } from './Icons'

interface GeneratingGameProps {
  progress?: number
}

const FUN_FACTS = [
  "Did you know? The first children's picture book was published in 1658!",
  "Fun fact: Kids who read for 20 minutes a day are exposed to 1.8 million words per year!",
  "Magic happening: Your story is being written by AI trained on thousands of children's books!",
  "Story time: The best children's books have been read millions of times around the world!",
  "Creating wonder: Every illustration is being crafted just for your story!",
  "Book magic: Reading together builds stronger bonds between children and parents!",
  "Did you know? Children's books help develop empathy and emotional intelligence!",
  "Fun fact: Picture books help children learn to read by connecting words to images!",
  "Story magic: Your unique story has never existed before in the whole world!",
  "Creating memories: This book could become a treasured keepsake for years to come!",
]

const GENERATING_STEPS = [
  { icon: 'auto_awesome', text: 'Dreaming up your story...', color: 'text-purple-500' },
  { icon: 'edit_note', text: 'Writing magical words...', color: 'text-blue-500' },
  { icon: 'palette', text: 'Painting beautiful pictures...', color: 'text-pink-500' },
  { icon: 'auto_stories', text: 'Binding your book together...', color: 'text-amber-500' },
]

export function GeneratingGame({ progress = 0 }: GeneratingGameProps) {
  const [currentFact, setCurrentFact] = useState(0)
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; x: number; delay: number }>>([])

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Create floating emojis
  useEffect(() => {
    const emojis = ['✨', '⭐', '🌟', '💫', '📚', '🎨', '🦋', '🌈', '💖', '🎭']
    const initial = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setFloatingEmojis(initial)
  }, [])

  // Determine current step based on progress
  const currentStep = Math.min(Math.floor(progress / 25), GENERATING_STEPS.length - 1)

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/95 dark:bg-gray-800/95 rounded-3xl p-8 shadow-2xl backdrop-blur-md border-2 border-purple-200 dark:border-purple-700">
        
        {/* Animated Book Icon */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Floating emojis background */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {floatingEmojis.map((item) => (
              <span
                key={item.id}
                className="absolute text-2xl animate-float opacity-60"
                style={{
                  left: `${item.x}%`,
                  animationDelay: `${item.delay}s`,
                  animationDuration: '4s',
                }}
              >
                {item.emoji}
              </span>
            ))}
          </div>
          
          {/* Main animated icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-6 shadow-lg">
                <Icon 
                  name="auto_stories" 
                  className="text-white animate-bounce" 
                  size={48} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Creating Your Story
        </h2>
        
        {/* Current Step */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Icon 
            name={GENERATING_STEPS[currentStep].icon} 
            className={`${GENERATING_STEPS[currentStep].color} animate-pulse`} 
            size={20} 
          />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            {GENERATING_STEPS[currentStep].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${Math.max(progress, 5)}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8 px-2">
          {GENERATING_STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                <Icon name={step.icon} size={20} />
              </div>
              {index < GENERATING_STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mt-5 -mr-8 absolute ${
                  index < currentStep ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Fun Fact */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-500">
              {FUN_FACTS[currentFact]}
            </p>
          </div>
        </div>

        {/* Reassuring message */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          This usually takes 1-2 minutes. Your magical story is worth the wait! ✨
        </p>
      </div>
    </div>
  )
}
