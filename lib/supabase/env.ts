// ---------------------------------------------------------------------------
// Resolves the Supabase URL/anon key with a harmless placeholder fallback so
// the app builds, prerenders and runs in "signed-out, no backend" mode
// before a real Supabase project is wired up — instead of hard-crashing the
// whole build the moment @supabase/ssr's client constructors run.
// ---------------------------------------------------------------------------

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl || !rawUrl.trim()) return 'https://placeholder.supabase.co'
  const trimmed = rawUrl.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return 'https://placeholder.supabase.co'
}

export const SUPABASE_URL = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key'

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http://') ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_SUPABASE_URL') &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.includes('YOUR_SUPABASE') &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('YOUR_SUPABASE'),
)

if (!isSupabaseConfigured && typeof window === 'undefined') {
  // Server-side only, once per process — avoids spamming the browser console.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set — ' +
    'running with auth/backend features disabled. Copy .env.local.example to .env.local and fill them in.',
  )
}
