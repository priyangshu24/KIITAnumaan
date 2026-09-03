'use client'

import WorkspaceNavbar from '@/components/workspace/WorkspaceNavbar'
import { useFullBleedRoute } from '@/components/workspace/useFullBleedRoute'

export default function WorkspaceNavbarSlot() {
  const isFullBleed = useFullBleedRoute()
  if (isFullBleed) return null
  return <WorkspaceNavbar />
}
