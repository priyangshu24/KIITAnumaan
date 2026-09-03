'use client'

import FloatingAIAssistant from '@/components/workspace/FloatingAIAssistant'
import { useFullBleedRoute } from '@/components/workspace/useFullBleedRoute'

export default function FloatingAIAssistantSlot() {
  const isFullBleed = useFullBleedRoute()
  if (isFullBleed) return null
  return <FloatingAIAssistant />
}
