import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { fetchAllQuestions } from './questions'
import { fetchUserStreak } from './streaks'
import { fetchUserActivity } from './activity'
import { type Difficulty } from '@/lib/playground-data'
import {
  type ProgressStats,
  type SolvedEntry,
  type HeatCell,
  dayKey,
} from '@/lib/playground-stats'

const XP_PER_DIFFICULTY: Record<Difficulty, number> = { Easy: 10, Medium: 25, Hard: 50 }
const XP_PER_LEVEL = 120

export interface DashboardStatsResult {
  stats: ProgressStats
  solvedLog: SolvedEntry[]
  activity: Record<string, number>
  totalSubmissions: number
  recentProblems: SolvedEntry[]
}

const addDays = (d: Date, n: number): Date => {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

const parseKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

/**
 * Builds a GitHub-style heatmap grid from an activity map.
 */
export function buildHeatmapFromActivity(
  activity: Record<string, number>,
  year: number = new Date().getFullYear(),
): { cells: HeatCell[][]; monthLabels: string[]; total: number; year: number } {
  const jan1 = new Date(year, 0, 1)
  const dec31 = new Date(year, 11, 31)
  const start = addDays(jan1, -jan1.getDay())
  const end = addDays(dec31, 6 - dec31.getDay())
  const weeks = Math.round((end.getTime() - start.getTime()) / (7 * 86400000)) + 1

  const counts = Object.values(activity)
  const max = counts.length ? Math.max(...counts) : 0
  const intensityFor = (c: number): HeatCell['intensity'] => {
    if (c <= 0) return 0
    if (max <= 1) return 4
    const r = c / max
    if (r > 0.75) return 4
    if (r > 0.5) return 3
    if (r > 0.25) return 2
    return 1
  }

  const cells: HeatCell[][] = []
  const monthLabels: string[] = []
  let lastMonth = -1
  let total = 0

  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = []
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d)
      const key = dayKey(date)
      const count = activity[key] ?? 0
      const inYear = date.getFullYear() === year
      if (inYear) total += count
      col.push({ date: key, count, intensity: intensityFor(count), inYear })
    }
    const monthOwner = col.find((c) => parseKey(c.date).getFullYear() === year)
    const m = monthOwner ? parseKey(monthOwner.date).getMonth() : -1
    if (m !== -1 && m !== lastMonth) {
      monthLabels.push(parseKey(monthOwner!.date).toLocaleString('en-US', { month: 'short' }))
      lastMonth = m
    } else {
      monthLabels.push('')
    }
    cells.push(col)
  }

  return { cells, monthLabels, total, year }
}

/**
 * Fetches and calculates all user statistics dynamically from Supabase.
 */
export async function fetchUserDashboardStats(userId?: string | null): Promise<DashboardStatsResult> {
  const emptyResult: DashboardStatsResult = {
    stats: {
      totalXp: 0,
      level: 1,
      xpInLevel: 0,
      xpForLevel: XP_PER_LEVEL,
      totalSolved: 0,
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null,
    },
    solvedLog: [],
    activity: {},
    totalSubmissions: 0,
    recentProblems: [],
  }

  if (!isSupabaseConfigured || !userId) {
    return emptyResult
  }

  try {
    const supabase = createClient()

    // 1. Fetch user progress, questions, streak, activity, and submissions in parallel
    const [progressRes, streakRes, activityMap, submissionsCountRes, allProblems] = await Promise.all([
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('solved_at', { ascending: false }),
      fetchUserStreak(userId),
      fetchUserActivity(userId),
      supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      fetchAllQuestions(),
    ])

    const progressRows = progressRes.data || []
    const totalSubmissions = submissionsCountRes.count || 0

    // Map questions for quick lookup
    const problemMap = new Map(allProblems.map((p) => [p.id, p]))

    const byDifficulty: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
    const solvedLog: SolvedEntry[] = []

    for (const row of progressRows) {
      if (row.status === 'solved') {
        const prob = problemMap.get(row.question_id)
        const difficulty = (prob?.difficulty || 'Easy') as Difficulty
        byDifficulty[difficulty] = (byDifficulty[difficulty] || 0) + 1

        const solvedDate = row.solved_at ? row.solved_at.split('T')[0] : dayKey()
        const epochMs = row.solved_at ? new Date(row.solved_at).getTime() : Date.now()

        solvedLog.push({
          id: row.question_id,
          title: prob?.title || row.question_id,
          difficulty,
          language: 'python',
          date: solvedDate,
          at: epochMs,
        })
      }
    }

    const totalSolved = solvedLog.length
    const totalXp =
      byDifficulty.Easy * XP_PER_DIFFICULTY.Easy +
      byDifficulty.Medium * XP_PER_DIFFICULTY.Medium +
      byDifficulty.Hard * XP_PER_DIFFICULTY.Hard

    const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
    const xpInLevel = totalXp % XP_PER_LEVEL

    const activeDates = Object.keys(activityMap).filter((k) => (activityMap[k] ?? 0) > 0).sort()

    return {
      stats: {
        totalXp,
        level,
        xpInLevel,
        xpForLevel: XP_PER_LEVEL,
        totalSolved,
        byDifficulty,
        currentStreak: streakRes.currentStreak,
        longestStreak: streakRes.longestStreak,
        totalActiveDays: activeDates.length,
        lastActiveDate: streakRes.lastActiveDate,
      },
      solvedLog,
      activity: activityMap,
      totalSubmissions,
      recentProblems: solvedLog.slice(0, 10),
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[supabase] fetchUserDashboardStats exception:', err)
    return emptyResult
  }
}
