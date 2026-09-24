// ---------------------------------------------------------------------------
// Resolves the Supabase URL/anon key with a harmless placeholder fallback so
// the app builds, prerenders and runs in "signed-out, no backend" mode
// before a real Supabase project is wired up — instead of hard-crashing the
// whole build the moment @supabase/ssr's client constructors run. Every
// server route that actually needs data (judge logging, boards, auth) is
// written to fail soft (network/auth error) rather than assume success, so
// this fallback never masks a real outage — it only prevents a missing
// .env.local from taking the entire app down.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

if (!isSupabaseConfigured && typeof window === 'undefined') {
  // Server-side only, once per process — avoids spamming the browser console.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — ' +
    'running with auth/backend features disabled. Copy .env.local.example to .env.local and fill them in.',
  )
}
