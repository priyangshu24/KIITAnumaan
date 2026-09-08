'use client'

import { useEffect } from 'react'
import AimlPlayground from '@/components/playground/AimlPlayground'

export default function AimlPlaygroundPage() {
  useEffect(() => {
    const { body, documentElement: html } = document
    const prev = { body: body.style.overflow, html: html.style.overflow }
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    return () => { body.style.overflow = prev.body; html.style.overflow = prev.html }
  }, [])

  return (
    <div className="fixed inset-0 z-40 bg-[#0A0A0D] overflow-hidden">
      <AimlPlayground />
    </div>
  )
}
