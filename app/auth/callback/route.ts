import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Handles the redirect back from Supabase after email confirmation, a
// magic-link, or an OAuth provider — exchanges the one-time `code` for a
// real session (sets the auth cookies), then sends the user on.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/workspace'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
