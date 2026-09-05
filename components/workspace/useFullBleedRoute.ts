'use client'

import { usePathname } from 'next/navigation'

// Routes that take over the full viewport (e.g. the coding Playground IDE).
// On these, the workspace chrome (sidebar rail, top navbar, floating AI
// assistant) is hidden so the page can use the entire screen.
// NOTE: the Playground *dashboard* at /workspace/playground keeps the normal
// chrome — only the editor at /workspace/playground/solve is full-bleed.
export const FULL_BLEED_ROUTES = ['/workspace/playground/solve']

export function useFullBleedRoute(): boolean {
  const pathname = usePathname()
  return FULL_BLEED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}
