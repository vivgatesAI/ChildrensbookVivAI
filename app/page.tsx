'use client'

import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#1A237E] font-display">
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-50"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuqyg_Asjsvty0tzYyB8sHQMgmo8HxFMLBQkGxQ-YWrQd1H1C1hxlO9XQItRXtU3EqZsQREdO9LJ1Ie7H7WYMP5aY0A31jbZ9fsQVUWafv3bcsJ2whAAhxcmp7zZRKazVaD0ztLi_Pa-WeiXQeu9dpTFGKAvYwQLkCSfGZsKpVYIV2_LJnapPvyM_ynHNh5ZLTEyFXmqQ7qiPO0r69pIRPgGl0Hvol7tSFTSihOnxUAMj6kg-mJc-LWCdbo2kREVe5bROQ3mGCNA")',
        }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-between px-4 py-8 text-center text-[#FFF8E1]">
        <div className="flex-shrink-0" />
        <div className="flex flex-grow flex-col items-center justify-center">
          <div className="mb-4">
            <span className="material-symbols-outlined text-6xl text-[#FFD600]">
              auto_stories
            </span>
          </div>
          <h1 className="px-4 pb-3 pt-2 text-center font-display text-[40px] font-bold leading-tight tracking-light text-[#FFF8E1]">
            KinderQuill
          </h1>
          <p className="max-w-md px-4 pb-3 pt-1 text-center font-display text-lg font-normal leading-normal text-[#FFF8E1]">
            Create magical, personalized storybooks for your little ones.
          </p>
        </div>
        <div className="flex w-full max-w-sm flex-shrink-0">
          <div className="flex px-4 py-3">
            <button
              onClick={() => router.push('/generate')}
              className="flex h-14 min-w-[84px] max-w-[480px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#FFD600] px-5 font-display text-lg font-bold leading-normal tracking-[0.015em] text-[#1A237E] transition-opacity hover:opacity-90"
            >
              <span className="truncate">Start Your Story</span>
            </button>
          </div>
          <p className="cursor-pointer px-4 pb-3 pt-1 text-center font-display text-sm font-normal leading-normal text-[#FFF8E1] underline opacity-80 hover:opacity-100">
            How does it work?
          </p>
        </div>
      </div>
    </div>
  )
}

