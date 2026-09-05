// ---------------------------------------------------------------------------
// Playground activity + progression stats
//
// All state lives in localStorage so it works without a backend. The coding
// IDE (PlaygroundTab) writes here on every accepted submission; the Playground
// Dashboard reads and derives streaks / level / a GitHub-style heatmap.
// ---------------------------------------------------------------------------

import { PROBLEMS, type Difficulty } from '@/lib/playground-data'

export const PG_STATS_KEYS = {
  solved: 'kiit:pg:solved', // string[] of solved problem ids (shared with PlaygroundTab)
  activity: 'kiit:pg:activity', // Record<YYYY-MM-DD, number> — accepted submissions per day
  solvedLog: 'kiit:pg:solved_log', // SolvedEntry[] — first-solve record per problem
}

export interface SolvedEntry {
  id: string
  title: string
  difficulty: Difficulty
  language: string
  date: string // YYYY-MM-DD (local)
  at: number // epoch ms
}

export interface ProgressStats {
  totalXp: number
  level: number
  xpInLevel: number
  xpForLevel: number
  totalSolved: number
  byDifficulty: Record<Difficulty, number>
  currentStreak: number
  longestStreak: number
  totalActiveDays: number
  lastActiveDate: string | null
}

export interface HeatCell {
  date: string // YYYY-MM-DD
  count: number
  intensity: 0 | 1 | 2 | 3 | 4
}

const XP_PER_DIFFICULTY: Record<Difficulty, number> = { Easy: 10, Medium: 25, Hard: 50 }
const XP_PER_LEVEL = 120

// ---- low level -------------------------------------------------------------

const read = (key: string): string | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
  } catch {
    return null
  }
}
const write = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* quota / private mode — non-fatal */
  }
}

const parse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/** Local calendar day key, e.g. "2026-09-05". */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

const addDays = (d: Date, n: number): Date => {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

/** Parse a "YYYY-MM-DD" key as a LOCAL date (avoids UTC off-by-one). */
const parseKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

// ---- readers -------------------------------------------------------------

export function readSolvedIds(): string[] {
  return parse<string[]>(read(PG_STATS_KEYS.solved), [])
}

export function readActivity(): Record<string, number> {
  return parse<Record<string, number>>(read(PG_STATS_KEYS.activity), {})
}

export function readSolvedLog(): SolvedEntry[] {
  return parse<SolvedEntry[]>(read(PG_STATS_KEYS.solvedLog), [])
}

// ---- writer -------------------------------------------------------------

/**
 * Call once per accepted submission. Increments today's activity count and,
 * the first time a problem is solved, appends a SolvedEntry + keeps the shared
 * `kiit:pg:solved` id list in sync.
 */
export function recordSolve(problemId: string, language: string): void {
  const problem = PROBLEMS.find((p) => p.id === problemId)
  if (!problem) return

  const today = dayKey()

  const activity = readActivity()
  activity[today] = (activity[today] ?? 0) + 1
  write(PG_STATS_KEYS.activity, JSON.stringify(activity))

  const solvedIds = readSolvedIds()
  if (!solvedIds.includes(problemId)) {
    write(PG_STATS_KEYS.solved, JSON.stringify([...solvedIds, problemId]))
  }

  const log = readSolvedLog()
  if (!log.some((e) => e.id === problemId)) {
    const entry: SolvedEntry = {
      id: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      language,
      date: today,
      at: Date.now(),
    }
    write(PG_STATS_KEYS.solvedLog, JSON.stringify([entry, ...log]))
  }
}

// ---- derivations -------------------------------------------------------------

function streaksFromActivity(activity: Record<string, number>): {
  current: number
  longest: number
} {
  const activeDays = new Set(Object.keys(activity).filter((k) => (activity[k] ?? 0) > 0))
  if (activeDays.size === 0) return { current: 0, longest: 0 }

  // current streak: walk back from today (grace: if today is empty but
  // yesterday is active, the streak is still counted from yesterday).
  let current = 0
  let cursor = new Date()
  if (!activeDays.has(dayKey(cursor))) cursor = addDays(cursor, -1)
  while (activeDays.has(dayKey(cursor))) {
    current += 1
    cursor = addDays(cursor, -1)
  }

  // longest streak: scan sorted unique days.
  const sorted = [...activeDays].sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = parseKey(sorted[i - 1])
    const expected = dayKey(addDays(prev, 1))
    if (sorted[i] === expected) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }

  return { current, longest }
}

export function computeStats(): ProgressStats {
  const log = readSolvedLog()
  const activity = readActivity()
  const solvedIds = readSolvedIds()

  const byDifficulty: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
  // Prefer the rich log; fall back to the id list for pre-existing progress.
  const counted = new Set<string>()
  for (const e of log) {
    byDifficulty[e.difficulty] += 1
    counted.add(e.id)
  }
  for (const id of solvedIds) {
    if (counted.has(id)) continue
    const p = PROBLEMS.find((x) => x.id === id)
    if (p) {
      byDifficulty[p.difficulty] += 1
      counted.add(id)
    }
  }

  const totalSolved = counted.size
  const totalXp =
    byDifficulty.Easy * XP_PER_DIFFICULTY.Easy +
    byDifficulty.Medium * XP_PER_DIFFICULTY.Medium +
    byDifficulty.Hard * XP_PER_DIFFICULTY.Hard

  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpInLevel = totalXp % XP_PER_LEVEL

  const { current, longest } = streaksFromActivity(activity)
  const activeDates = Object.keys(activity).filter((k) => (activity[k] ?? 0) > 0).sort()

  return {
    totalXp,
    level,
    xpInLevel,
    xpForLevel: XP_PER_LEVEL,
    totalSolved,
    byDifficulty,
    currentStreak: current,
    longestStreak: Math.max(longest, current),
    totalActiveDays: activeDates.length,
    lastActiveDate: activeDates.length ? activeDates[activeDates.length - 1] : null,
  }
}

/**
 * GitHub-style contribution grid: `weeks` columns of 7 days, ending on the
 * Saturday of the current week. Returns cells in column-major order plus the
 * month label for each column (empty string when it repeats).
 */
export function buildHeatmap(weeks = 26): { cells: HeatCell[][]; monthLabels: string[]; total: number } {
  const activity = readActivity()

  const today = new Date()
  // end on Saturday of this week
  const end = addDays(today, 6 - today.getDay())
  const start = addDays(end, -(weeks * 7 - 1))

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
      total += count
      col.push({ date: key, count, intensity: intensityFor(count) })
    }
    const firstOfCol = parseKey(col[0].date)
    const m = firstOfCol.getMonth()
    if (m !== lastMonth) {
      monthLabels.push(firstOfCol.toLocaleString('en-US', { month: 'short' }))
      lastMonth = m
    } else {
      monthLabels.push('')
    }
    cells.push(col)
  }

  return { cells, monthLabels, total }
}

/** "Sep 5, 2026" */
export function prettyDate(key: string): string {
  return parseKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
