// ---------------------------------------------------------------------------
// System Design board persistence for signed-in users.
// GET  -> the caller's saved board for this prompt, or null if signed out /
//         never saved (never an error — the client falls back to localStorage).
// PUT  -> upsert the caller's board for this prompt. 401 if signed out.
// RLS on `boards` (user_id = auth.uid()) is the real access control here;
// this route just shapes the request/response.
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ board: null })

  const { data, error } = await supabase
    .from('boards')
    .select('nodes, edges, notes, checked, updated_at')
    .eq('user_id', user.id)
    .eq('prompt_id', promptId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ board: data ?? null })
}

export async function PUT(request: Request, { params }: { params: Promise<{ promptId: string }> }) {
  const { promptId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to save your board to your account.' }, { status: 401 })

  let body: { nodes?: unknown; edges?: unknown; notes?: string; checked?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { error } = await supabase.from('boards').upsert(
    {
      user_id: user.id,
      prompt_id: promptId,
      nodes: body.nodes ?? [],
      edges: body.edges ?? [],
      notes: body.notes ?? '',
      checked: body.checked ?? [],
    },
    { onConflict: 'user_id,prompt_id' },
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
