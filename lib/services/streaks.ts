import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { dayKey } from '@/lib/playground-stats'
import type { Database } from '@/lib/supabase/types'

type StreakRow = Database['public']['Tables']['streaks']['Row']

export interface StreakInfo {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
}

function getYesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dayKey(d)
}

/**
 * Fetches user streak details from Supabase.
 */
export async function fetchUserStreak(userId: string): Promise<StreakInfo> {
  if (!isSupabaseConfigured || !userId) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_active_date')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data) {
      return { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
    }

    return {
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      lastActiveDate: data.last_active_date || null,
    }
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
  }
}

/**
 * Updates or advances the user's streak when they perform an activity today.
 */
export async function updateUserStreakOnActivity(userId: string): Promise<StreakInfo> {
  if (!isSupabaseConfigured || !userId) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null }
  }

  const today = dayKey()
  const yesterday = getYesterdayKey()

  try {
    const supabase = createClient()
    const { data: existing } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    let current = 1
    let longest = 1

    if (existing) {
      const lastDate = existing.last_active_date
      if (lastDate === today) {
        // Already active today — preserve streak
        return {
          currentStreak: existing.current_streak,
          longestStreak: existing.longest_streak,
          lastActiveDate: today,
        }
      } else if (lastDate === yesterday) {
        // Consecutive day streak increment
        current = (existing.current_streak || 0) + 1
        longest = Math.max(existing.longest_streak || 0, current)
      } else {
        // Gap in streak, reset to 1
        current = 1
        longest = Math.max(existing.longest_streak || 0, 1)
      }

      await supabase
        .from('streaks')
        .update({
          current_streak: current,
          longest_streak: longest,
          last_active_date: today,
        })
        .eq('user_id', userId)
    } else {
      // First time streak record
      await supabase
        .from('streaks')
        .insert({
          user_id: userId,
          current_streak: current,
          longest_streak: longest,
          last_active_date: today,
        })
    }

    return { currentStreak: current, longestStreak: longest, lastActiveDate: today }
  } catch {
    return { currentStreak: 1, longestStreak: 1, lastActiveDate: today }
  }
}
