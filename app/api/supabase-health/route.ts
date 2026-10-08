import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SUPABASE_URL, isSupabaseConfigured } from '@/lib/supabase/env'

export async function GET() {
  const checkTime = new Date().toISOString()

  try {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.getSession()

    return NextResponse.json({
      status: 'connected',
      configured: isSupabaseConfigured,
      supabaseUrl: SUPABASE_URL,
      authStatus: authError ? `auth_error: ${authError.message}` : 'auth_service_reachable',
      hasActiveSession: Boolean(authData.session),
      timestamp: checkTime,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      {
        status: 'connection_failed',
        configured: isSupabaseConfigured,
        supabaseUrl: SUPABASE_URL,
        error: message,
        timestamp: checkTime,
      },
      { status: 500 },
    )
  }
}
