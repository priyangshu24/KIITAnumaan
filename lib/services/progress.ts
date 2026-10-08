import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { recordDailyActivity } from './activity'
import { updateUserStreakOnActivity } from './streaks'
import type { Database } from '@/lib/supabase/types'

export type ProgressRow = Database['public']['Tables']['user_progress']['Row']

/**
 * Fetches all progress rows (solved & attempted) for a user.
 */
export async function fetchUserProgress(userId: string): Promise<ProgressRow[]> {
  if (!isSupabaseConfigured || !userId) return []

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Fetches the list of solved problem IDs for a user.
 */
export async function fetchSolvedProblemIds(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured || !userId) return []

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_progress')
      .select('question_id')
      .eq('user_id', userId)
      .eq('status', 'solved')

    if (error || !data) return []
    return data.map((r) => r.question_id)
  } catch {
    return []
  }
}

/**
 * Records that a problem was solved by the user.
 * Performs an UPSERT on `user_progress`, increments `activity`, and updates `streaks`.
 */
export async function recordProblemSolved(
  userId: string,
  questionId: string,
  runtime?: number,
  memory?: number,
): Promise<ProgressRow | null> {
  if (!isSupabaseConfigured || !userId) return null

  try {
    const supabase = createClient()

    // Check existing progress
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle()

    let progress: ProgressRow | null = null

    if (existing) {
      const bestRuntime = runtime
        ? existing.best_runtime
          ? Math.min(existing.best_runtime, runtime)
          : runtime
        : existing.best_runtime

      const bestMemory = memory
        ? existing.best_memory
          ? Math.min(existing.best_memory, memory)
          : memory
        : existing.best_memory

      const { data: updated, error } = await supabase
        .from('user_progress')
        .update({
          status: 'solved',
          attempts: (existing.attempts || 0) + 1,
          best_runtime: bestRuntime,
          best_memory: bestMemory,
          solved_at: existing.solved_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      if (!error) progress = updated
    } else {
      const { data: inserted, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          question_id: questionId,
          status: 'solved',
          attempts: 1,
          best_runtime: runtime ?? null,
          best_memory: memory ?? null,
          solved_at: new Date().toISOString(),
        })
        .select('*')
        .single()

      if (!error) progress = inserted
    }

    // Simultaneously update daily activity and user streak
    await Promise.allSettled([
      recordDailyActivity(userId, 1, 1),
      updateUserStreakOnActivity(userId),
    ])

    return progress
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[supabase] recordProblemSolved exception:', err)
    return null
  }
}

/**
 * Records an attempt (without solve) for a problem.
 */
export async function recordProblemAttempt(
  userId: string,
  questionId: string,
): Promise<ProgressRow | null> {
  if (!isSupabaseConfigured || !userId) return null

  try {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle()

    if (existing) {
      const { data: updated } = await supabase
        .from('user_progress')
        .update({
          attempts: (existing.attempts || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      return updated
    } else {
      const { data: inserted } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          question_id: questionId,
          status: 'attempted',
          attempts: 1,
        })
        .select('*')
        .single()

      return inserted
    }
  } catch {
    return null
  }
}
