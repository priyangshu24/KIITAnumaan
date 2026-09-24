// ---------------------------------------------------------------------------
// Refreshes the Supabase auth session on every request. Server Components
// can't write cookies, so without this a session silently expires — this is
// the one place allowed to persist the refreshed tokens back to the browser.
// ---------------------------------------------------------------------------

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env'
import type { Database } from './types'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // Touches the session so an expiring token gets refreshed and re-set above.
  // Do not remove — deleting this call is the #1 cause of "logged out
  // randomly" bugs with Supabase SSR auth.
  await supabase.auth.getUser()

  return response
}
