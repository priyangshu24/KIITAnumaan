// ---------------------------------------------------------------------------
// Supabase client for Server Components, Route Handlers and Server Actions.
// Carries the caller's session via cookies, so RLS policies see auth.uid().
// ---------------------------------------------------------------------------

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createRawClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component with no request/response to write
            // cookies on — safe to ignore as long as middleware refreshes the
            // session on every request (see middleware.ts).
          }
        },
      },
    },
  )
}

// Service-role client — bypasses RLS entirely. Server-only: never import this
// from a Client Component or anywhere that ships to the browser. Used for
// trusted admin operations (seeding/managing content tables) and the judge
// route's own bookkeeping.
export function createServiceClient() {
  return createRawClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key',
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
