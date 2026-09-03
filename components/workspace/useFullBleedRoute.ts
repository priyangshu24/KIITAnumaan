'use client'

import { usePathname } from 'next/navigation'

// Routes that take over the full viewport (e.g. the coding Playground IDE).
// On these, the workspace chrome (sidebar rail, top navbar, floating AI
// assistant) is hidden so the page can use the entire screen.
export const FULL_BLEED_ROUTES = ['/workspace/playground']

export function useFullBleedRoute(): boolean {
  const pathname = usePathname()
  return FULL_BLEED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}
