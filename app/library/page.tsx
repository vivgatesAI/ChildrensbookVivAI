'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icons'
import { useAuth } from '@/components/AuthContext'
import { Header } from '@/components/Header'
import { LoginModal } from '@/components/LoginModal'

interface Book {
  id: string
  title: string
  titlePage?: { image: string; title: string }
  ageRange: string
  illustrationStyle: string
  status: 'generating' | 'completed' | 'error'
  createdAt: string
  isFavorite?: boolean
}

export default function LibraryPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true)
      return
    }

    if (user) {
      fetchBooks()
    }
  }, [user, loading])

  const fetchBooks = async () => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch('/api/library', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error fetching library:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (bookId: string) => {
    try {
      const token = await user?.getIdToken()
      const response = await fetch(`/api/library/favorite/${bookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const { isFavorite } = await response.json()
        if (isFavorite) {
          setFavorites([...favorites, bookId])
        } else {
          setFavorites(favorites.filter(id => id !== bookId))
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const filteredBooks = activeTab === 'favorites' 
    ? books.filter(book => favorites.includes(book.id))
    : books

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <Icon name="auto_awesome" className="animate-spin text-purple-500" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <Header title="My Library" />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => router.push('/')} 
        message="Sign in to view your library and save your favorite stories!"
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon name="menu_book" className="inline mr-2" size={20} />
            All Books ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon name="favorite" className="inline mr-2" size={20} />
            Favorites ({favorites.length})
          </button>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="menu_book" className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {activeTab === 'favorites' ? 'No favorites yet' : 'No books yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'favorites' 
                ? 'Mark books as favorites to see them here!'
                : 'Start creating your first magical story!'
              }
            </p>
            <button
              onClick={() => router.push('/generate')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Create a Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
              >
                {/* Book Cover */}
                <div 
                  className="aspect-[4/3] bg-gray-100 relative cursor-pointer"
                  onClick={() => router.push(`/book/${book.id}`)}
                >
                  {book.titlePage ? (
                    <img
                      src={book.titlePage.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
                      <Icon name="auto_stories" className="text-white/50" size={48} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {book.status === 'generating' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-800 text-xs font-semibold rounded-full">
                      Creating...
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(book.id)
                    }}
                    className="absolute top-2 left-2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all shadow-md"
                  >
                    <Icon 
                      name={favorites.includes(book.id) ? 'favorite' : 'favorite_border'} 
                      className={favorites.includes(book.id) ? 'text-pink-500' : 'text-gray-400'}
                      size={24}
                    />
                  </button>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {book.ageRange} grade • {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => router.push(`/book/${book.id}`)}
                    className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-all"
                  >
                    {book.status === 'generating' ? 'Creating...' : 'Read Book'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
