'use client'

import { Suspense, useEffect } from 'react'
import PlaygroundTab from '@/components/playground/PlaygroundTab'

function PlaygroundLoader() {
  return (
    <div className="flex items-center justify-center h-full">
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
  // The playground is a fixed full-viewport surface with its own internal
  // scrolling — lock the document so no page-level scrollbar appears behind it.
  useEffect(() => {
    const { body, documentElement: html } = document
    const prev = { body: body.style.overflow, html: html.style.overflow }
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev.body
      html.style.overflow = prev.html
    }
  }, [])

  return (
    <div className="fixed inset-0 z-40 bg-[#0A0A0D] overflow-hidden">
      <Suspense fallback={<PlaygroundLoader />}>
        <PlaygroundTab />
      </Suspense>
    </div>
  )
}
