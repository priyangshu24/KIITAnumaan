'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkspaceMainPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/workspace/academic')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
        <div className="w-5 h-5 border-2 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
        <span>Loading KIIT Workspace...</span>
      </div>
    </div>
  )
}
