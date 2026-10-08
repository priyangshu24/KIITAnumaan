import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { dayKey } from '@/lib/playground-stats'
import type { Database } from '@/lib/supabase/types'

type ActivityRow = Database['public']['Tables']['activity']['Row']

/**
 * Fetches the user's activity map { 'YYYY-MM-DD': count } from Supabase.
 */
export async function fetchUserActivity(userId: string): Promise<Record<string, number>> {
  if (!isSupabaseConfigured || !userId) return {}

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('activity')
      .select('activity_date, problems_solved, submissions_count')
      .eq('user_id', userId)

    if (error || !data) return {}

    const map: Record<string, number> = {}
    for (const row of data) {
      // Use sum of problems solved & submissions, or problems solved
      const count = (row.problems_solved || 0) + (row.submissions_count || 0)
      map[row.activity_date] = count > 0 ? count : (row.problems_solved || 0)
    }
    return map
  } catch {
    return {}
  }
}

/**
 * Records activity for today's date in Supabase.
 */
export async function recordDailyActivity(
  userId: string,
  solvedDelta = 1,
  submissionDelta = 1,
): Promise<ActivityRow | null> {
  if (!isSupabaseConfigured || !userId) return null

  const today = dayKey()

  try {
    const supabase = createClient()
    // Fetch existing row for today
    const { data: existing } = await supabase
      .from('activity')
      .select('*')
      .eq('user_id', userId)
      .eq('activity_date', today)
      .maybeSingle()

    if (existing) {
      const { data: updated, error } = await supabase
        .from('activity')
        .update({
          problems_solved: (existing.problems_solved || 0) + solvedDelta,
          submissions_count: (existing.submissions_count || 0) + submissionDelta,
        })
        .eq('id', existing.id)
        .select('*')
        .single()

      if (error) return null
      return updated
    } else {
      const { data: inserted, error } = await supabase
        .from('activity')
        .insert({
          user_id: userId,
          activity_date: today,
          problems_solved: solvedDelta,
          submissions_count: submissionDelta,
        })
        .select('*')
        .single()

      if (error) return null
      return inserted
    }
  } catch {
    return null
  }
}
