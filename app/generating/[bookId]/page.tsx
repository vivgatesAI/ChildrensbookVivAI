'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function GeneratingPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.bookId as string

  useEffect(() => {
    // Poll for book completion
    const checkBookStatus = async () => {
      try {
        const response = await fetch(`/api/book-status/${bookId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'completed') {
            router.push(`/book/${bookId}`)
          }
        }
      } catch (error) {
        console.error('Error checking book status:', error)
      }
    }

    const interval = setInterval(checkBookStatus, 2000)
    return () => clearInterval(interval)
  }, [bookId, router])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-blue-100 p-4 font-display dark:bg-slate-900">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm text-gray-700 transition-colors hover:bg-white/50 dark:bg-black/30 dark:text-gray-300 dark:hover:bg-black/50">
          <span className="material-symbols-outlined text-2xl">volume_up</span>
        </button>
      </div>

      <div className="mt-12 w-full max-w-md text-center sm:mt-16">
        <h2 className="font-display text-3xl font-bold leading-tight tracking-light text-[#1e3a8a] dark:text-blue-200 sm:text-4xl">
          Mixing the magic...
        </h2>
      </div>

      <div className="relative mb-4 mt-8 flex max-w-sm flex-grow items-end justify-center">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-bottom object-contain opacity-20 dark:opacity-10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPefRPga_iFGmdwrUpNGUlM1IPtgS7kKBTI26TfUUe0LtS6CZfjsGWd4y0sxinCV4ilV4gHi0qUTNKyE8CB-UlCw3RI1Y92E0Ya8PfnHioyuQvZRYNK8DAO1PSTGH6Pcw680UGFKVervahwP2P277pERJuscfKe98q6ku9t5UegC8xcK-ovZEC2kk4GUiQz1lOZyaELz-TSKho6F9RynfVZNSAEBtr-YNeL3D_8CIKHV8BA4xWc2T1Lt03Yd5Wlbc53U9B1mz3TQ"
            alt="A large, whimsical tree with many branches"
          />
        </div>

        <div className="absolute bottom-0 left-1/2 h-full w-full -translate-x-1/2">
          <div className="absolute bottom-[75%] left-[60%] h-16 w-16 -translate-x-1/2">
            <span
              className="material-symbols-outlined text-5xl text-pink-400 drop-shadow-lg dark:text-pink-500"
              style={{ transform: 'rotate(15deg)' }}
            >
              filter_vintage
            </span>
          </div>
          <div className="absolute bottom-[60%] right-[65%] h-12 w-12">
            <span
              className="material-symbols-outlined text-4xl text-purple-400 drop-shadow-lg dark:text-purple-500"
              style={{ transform: 'rotate(-25deg)' }}
            >
              local_florist
            </span>
          </div>
        </div>

        <div className="absolute bottom-[75%] left-1/2 mb-4 -translate-x-1/2">
          <div className="relative h-20 w-20">
            <img
              className="h-full w-full object-contain drop-shadow-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoUqt16DwM9LYqi669g9_oh0m5Km4_2DFQYbMninxdLX082Byou8X88oRzWJM16gEeZbRc0rTbeaCR6YZy0m7sE5RWt-ELkWy71T2R2avxHZXx07z4JtOLiHMEWB9a0MYDyoV-p37_ovATNJsmVh2bPrYAzp2SvgBN8Bhm_KJdjsmOnzM_isoTmQCoorxfg5gunjOyoZy_YGds639lxfjYLpFPWEJkZxF9KKzfR7qssC91wIST0FtHCtzrSk4WV57YfUuKbfasMg"
              alt="A cute, cartoon squirrel climbing the tree"
            />
          </div>
        </div>
      </div>

      <div className="mb-8 w-full max-w-md rounded-lg bg-white/30 p-4 shadow-lg backdrop-blur-sm sm:mb-12 dark:bg-black/30">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between gap-6">
            <p className="text-base font-medium leading-normal text-[#1e3a8a] dark:text-blue-200">
              Stirring up your story...
            </p>
          </div>
          <div className="h-2 rounded-full bg-primary/20 dark:bg-primary/30">
            <div className="h-2 rounded-full bg-primary" style={{ width: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

