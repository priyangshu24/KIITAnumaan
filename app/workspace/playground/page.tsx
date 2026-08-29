'use client'

import { Suspense } from 'react'
import PlaygroundTab from '@/components/playground/PlaygroundTab'

function PlaygroundLoader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-140px)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center animate-pulse">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        </div>
        <p className="text-xs font-mono text-[#6B7280]">Loading Playground...</p>
      </div>
    </div>
  )
}

export default function PlaygroundPage() {
  return (
    <div className="-mx-4 lg:-mx-6 -my-4">
      <Suspense fallback={<PlaygroundLoader />}>
        <PlaygroundTab />
      </Suspense>
    </div>
  )
}