'use client'

import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar'
import { useFullBleedRoute } from '@/components/workspace/useFullBleedRoute'

export default function WorkspaceSidebarSlot() {
  const isFullBleed = useFullBleedRoute()

  // Full-bleed routes (Playground) render their own chrome + exit control.
  if (isFullBleed) return null

  return (
    <>
      <WorkspaceSidebar />
      {/* Layout spacer for the fixed sidebar (88px width + 16px offset) */}
      <div className="w-[104px] shrink-0 hidden sm:block" />
    </>
  )
}
