import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

export type ProfileRow = Database['public']['Tables']['profiles']['Row']

/**
 * Fetches user profile from Supabase.
 */
export async function fetchUserProfile(userId: string): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured || !userId) return null

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

/**
 * Ensures a profile row exists for the authenticated user.
 */
export async function ensureUserProfile(user: User): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured || !user) return null

  try {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (existing) return existing

    const fullName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email?.split('@')[0] ||
      'Student'

    const avatarUrl = (user.user_metadata?.avatar_url as string) || null

    const { data: inserted, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        user_id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .select('*')
      .single()

    if (error) return null
    return inserted
  } catch {
    return null
  }
}

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Updates the user's profile information.
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate,
): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured || !userId) return null

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single()

    if (error) return null
    return data
  } catch {
    return null
  }
}
