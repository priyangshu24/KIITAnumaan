'use client'

// ---------------------------------------------------------------------------
// Supabase client for use in Client Components ('use client').
// Reads the public URL/anon key — safe to ship to the browser; access to
// user data is enforced by Postgres Row Level Security, not by this key.
// ---------------------------------------------------------------------------

import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)
}
