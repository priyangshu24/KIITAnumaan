'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/workspace')
  }, [router])

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
        <div className="w-5 h-5 border-2 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to KIIT Workspace...</span>
      </div>
    </div>
  )
}
