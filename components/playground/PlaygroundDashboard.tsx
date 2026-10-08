'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Flame, Zap, CheckCircle2,
  CalendarDays, BookOpen, Building2, SlidersHorizontal, Trophy, Sparkles,
  ChevronRight, ChevronLeft, Target, Terminal, ListChecks, Briefcase, TrendingUp,
  Database, Network, FlaskConical,
  Swords, Bookmark,
} from 'lucide-react'
import { PROBLEMS, difficultyColors, type Difficulty, type PracticeSession } from '@/lib/playground-data'
import {
  computeStats, buildHeatmap, readSolvedLog, readSolvedIds, prettyDate,
  type ProgressStats, type SolvedEntry, type HeatCell,
} from '@/lib/playground-stats'
import { analyzeProfile, type TopicMastery } from '@/lib/playground-profile'
import TechnicalProfile from '@/components/playground/TechnicalProfile'
import { createClient } from '@/lib/supabase/client'
import {
  fetchUserDashboardStats,
  buildHeatmapFromActivity,
} from '@/lib/services'

const SOLVE = '/workspace/playground/solve'

const EMPTY_STATS: ProgressStats = {
  totalXp: 0, level: 1, xpInLevel: 0, xpForLevel: 120, totalSolved: 0,
  byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
  currentStreak: 0, longestStreak: 0, totalActiveDays: 0, lastActiveDate: null,
}

function toneFor(ratio: number, solved: number): string {
  if (solved === 0) return '#3F3F46'
  if (ratio >= 0.6) return '#10B981'
  if (ratio > 0) return '#F59E0B'
  return '#3F3F46'
}

const INTENSITY = [
  'bg-white/[0.04]', 'bg-[#FF4D4D]/25', 'bg-[#FF4D4D]/45', 'bg-[#FF4D4D]/70', 'bg-[#FF4D4D]',
]

function ago(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`
  const w = Math.floor(d / 7); if (w < 5) return `${w}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

function readPracticeSession(): PracticeSession | null {
  try {
    const raw = window.localStorage.getItem('kiit:pg:practice_session')
    if (!raw) return null
    const s = JSON.parse(raw) as PracticeSession
    return s && Array.isArray(s.questionIds) ? s : null
  } catch {
    return null
  }
}

function readBookmarkIds(): string[] {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('kiit:pg:bookmarks') : null
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

// ---- small pieces -------------------------------------------------------

function Panel({ title, action, children }: { title: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

function StatTile({ icon, value, label, sub }: {
  icon: React.ReactNode; value: React.ReactNode; label: string; sub?: React.ReactNode
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2.5">
        <span className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">{icon}</span>
        <div className="min-w-0">
          <div className="text-xl font-bold text-white leading-none">{value}</div>
          <div className="text-[10px] font-mono text-[#6B7280] mt-1">{label}</div>
        </div>
      </div>
      {sub && <div className="mt-2.5 text-[10px] font-mono text-[#8A8A8A]">{sub}</div>}
    </div>
  )
}

function ModeCard({ icon, title, desc, href, soon }: {
  icon: React.ReactNode; title: string; desc: string; href?: string; soon?: boolean
}) {
  const inner = (
    <>
      <span className="w-10 h-10 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center mb-3">{icon}</span>
      <div className="flex items-center gap-2">
        <h4 className="text-[13px] font-bold text-white">{title}</h4>
        {soon && <span className="text-[8px] font-bold uppercase tracking-wider text-[#8A8A8A] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">Soon</span>}
      </div>
      <p className="text-[11px] text-[#8A8A8A] mt-1 leading-relaxed">{desc}</p>
      {!soon && <ArrowRight size={13} className="text-[#6B7280] group-hover:text-[#FF4D4D] group-hover:translate-x-0.5 transition-all mt-3" />}
    </>
  )
  const cls = `group rounded-2xl border p-4 transition-all ${
    soon
      ? 'border-white/[0.05] bg-[#0D0D10] opacity-60'
      : 'border-white/[0.06] bg-[#0D0D10] hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] cursor-pointer'
  }`
  return href && !soon ? <Link href={href} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>
}

function GoalRow({ icon, label, cur, target }: { icon: React.ReactNode; label: string; cur: number; target: number }) {
  const pct = Math.min(100, Math.round((cur / target) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1.5 text-[#D1D5DB]">{icon}{label}</span>
        <span className="font-mono text-[10px] text-[#6B7280]">{cur}/{target}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full bg-[#FF4D4D] transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ---- page --------------------------------------------------------------

export default function PlaygroundDashboard() {
  const CURRENT_YEAR = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<ProgressStats>(EMPTY_STATS)
  const [log, setLog] = useState<SolvedEntry[]>([])
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [topics, setTopics] = useState<TopicMastery[]>([])
  const [solvedIdList, setSolvedIdList] = useState<string[]>([])
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([])
  const [year, setYear] = useState(CURRENT_YEAR)
  const [heatmap, setHeatmap] = useState<{ cells: HeatCell[][]; monthLabels: string[]; total: number; year: number }>({
    cells: [], monthLabels: [], total: 0, year: CURRENT_YEAR,
  })
  // Bumped on mount + whenever the tab regains focus/visibility, so the
  // dashboard re-reads everything the editor may have written in the meantime.
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    const onVisible = () => { if (document.visibilityState === 'visible') bump() }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', bump)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', bump)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user
      if (user) {
        const dbStats = await fetchUserDashboardStats(user.id)
        setStats(dbStats.stats)
        setLog(dbStats.solvedLog)
        setSolvedIdList(dbStats.solvedLog.map((s) => s.id))
        setHeatmap(buildHeatmapFromActivity(dbStats.activity, year))
      } else {
        setStats(computeStats())
        setLog(readSolvedLog())
        setSolvedIdList(readSolvedIds())
        setHeatmap(buildHeatmap(year))
      }
      setSession(readPracticeSession())
      setTopics(analyzeProfile().topics)
      setBookmarkIds(readBookmarkIds())
      setMounted(true)
    })
  }, [tick, year])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user
      if (user) {
        const dbStats = await fetchUserDashboardStats(user.id)
        setHeatmap(buildHeatmapFromActivity(dbStats.activity, year))
      } else {
        setHeatmap(buildHeatmap(year))
      }
    })
  }, [year, tick])

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const totalProblems = PROBLEMS.length

  const solvesThisWeek = useMemo(() => {
    const cut = Date.now() - 7 * 86400000
    return log.filter((e) => e.at >= cut).length
  }, [log])

  const solvedIds = useMemo(() => new Set(solvedIdList), [solvedIdList])

  // Deterministic "problem of the day"
  const daily = useMemo(() => {
    const start = new Date(new Date().getFullYear(), 0, 0).getTime()
    const doy = Math.floor((Date.now() - start) / 86400000)
    return PROBLEMS[doy % PROBLEMS.length]
  }, [])
  const dailyDone = solvedIds.has(daily.id)

  // Pinned / bookmarked problems
  const bookmarks = useMemo(
    () => bookmarkIds.map((id) => PROBLEMS.find((p) => p.id === id)).filter(Boolean) as typeof PROBLEMS,
    [bookmarkIds],
  )

  // This-week rollup
  const week = useMemo(() => {
    const cut = Date.now() - 7 * 86400000
    const days = new Set<string>()
    let solves = 0
    for (const e of log) {
      if (e.at >= cut) { solves += 1; days.add(e.date) }
    }
    return { solves, activeDays: days.size }
  }, [log])

  // Adaptive goal targets — advance to the next tier once cleared.
  const goals = useMemo(() => {
    const nextTier = (v: number, steps: number[]) => steps.find((s) => v < s) ?? steps[steps.length - 1]
    return {
      solve: nextTier(stats.totalSolved, [10, 25, 50, 100, 250]),
      streak: nextTier(Math.max(stats.currentStreak, stats.longestStreak), [3, 7, 14, 30, 60]),
      level: nextTier(stats.level, [3, 5, 10, 20, 40]),
    }
  }, [stats.totalSolved, stats.currentStreak, stats.longestStreak, stats.level])

  // "Continue practising" target
  const resume = useMemo(() => {
    if (session && !session.isComplete && session.questionIds.length) {
      const idx = Math.min(session.currentIndex, session.questionIds.length - 1)
      const problem = PROBLEMS.find((p) => p.id === session.questionIds[idx])
      const solvedInSession = Object.values(session.results ?? {}).filter((r) => r?.solved).length
      return problem
        ? {
            problem,
            label: 'Continue Practising',
            meta: [session.companyName, session.role].filter(Boolean),
            index: idx + 1,
            total: session.questionIds.length,
            pct: Math.round((solvedInSession / session.questionIds.length) * 100),
            href: SOLVE,
          }
        : null
    }
    const next = PROBLEMS.find((p) => !solvedIds.has(p.id))
    return next
      ? {
          problem: next,
          label: 'Pick Up Where You Left Off',
          meta: next.companies.slice(0, 2),
          index: (stats.totalSolved % totalProblems) + 1,
          total: totalProblems,
          pct: Math.round((stats.totalSolved / totalProblems) * 100),
          href: `${SOLVE}?problem=${next.id}`,
        }
      : null
  }, [session, solvedIds, stats.totalSolved, totalProblems])

  const topTopics = useMemo(() => [...topics].sort((a, b) => b.total - a.total).slice(0, 6), [topics])
  const recent = useMemo(() => log.slice(0, 6), [log])

  return (
    <div className="max-w-[1600px] mx-auto pb-10 space-y-4">
      {/* ============ HERO BANNER ============ */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)] min-h-[150px] flex items-center">
        <img
          src="/kiit-campus-dotted.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-90 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/75 to-transparent pointer-events-none z-10 rounded-[24px]" />
        <div className="relative z-20 flex flex-wrap items-end justify-between gap-4 w-full">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF453A] font-mono block drop-shadow">
              Coding Playground
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-white tracking-tight leading-none drop-shadow-md">
              Practice Hub &amp; Progress
            </h1>
            <p className="text-xs text-[#A0A0A0] mt-2 leading-relaxed drop-shadow max-w-md">
              Track your streak, level and everything you&apos;ve solved — then jump into FORCE to keep improving.
            </p>
          </div>
          <div className="text-right shrink-0 hidden sm:block drop-shadow">
            <div className="text-[11px] font-mono text-[#D1D5DB]">{today}</div>
            <div className="text-[11px] text-[#6B7280]">Good to see you again</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        {/* ============ MAIN COLUMN ============ */}
        <div className="min-w-0 space-y-4">
          {/* Stat tiles */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <StatTile
              icon={<CheckCircle2 size={16} className="text-[#10B981]" />}
              value={stats.totalSolved}
              label="Questions Solved"
              sub={<span className="text-[#10B981]">▲ +{solvesThisWeek} this week</span>}
            />
            <StatTile
              icon={<Flame size={16} className="text-[#F59E0B]" />}
              value={`${stats.currentStreak}d`}
              label="Current Streak"
              sub={`Best: ${stats.longestStreak} days`}
            />
            <StatTile
              icon={<Zap size={16} className="text-[#FF4D4D]" />}
              value={`Lv ${stats.level}`}
              label="Level"
              sub={`${stats.xpInLevel}/${stats.xpForLevel} XP`}
            />
            <StatTile
              icon={<CalendarDays size={16} className="text-[#8B5CF6]" />}
              value={stats.totalActiveDays}
              label="Active Days"
              sub={stats.lastActiveDate ? `last ${prettyDate(stats.lastActiveDate)}` : 'no activity yet'}
            />
          </div>

          {/* Continue practising */}
          {resume && (
            <div className="rounded-2xl border border-[#FF4D4D]/20 bg-gradient-to-br from-[#FF4D4D]/[0.08] to-transparent p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#FF4D4D] bg-[#FF4D4D]/10 border border-[#FF4D4D]/25 px-2 py-0.5 rounded">
                    <Flame size={10} /> {resume.label}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{resume.problem.title}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {[...resume.meta, ...resume.problem.topics.slice(0, 2)].map((t, i) => (
                      <span key={i} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-[#6B7280]">
                    <span>Question {resume.index} of {resume.total}</span>
                    <span className="flex-1 min-w-[80px] h-1.5 rounded-full bg-white/[0.06] overflow-hidden max-w-[160px]">
                      <span className="block h-full rounded-full bg-[#FF4D4D]" style={{ width: `${resume.pct}%` }} />
                    </span>
                    <span>{resume.pct}%</span>
                    <span
                      className="px-1.5 py-0.5 rounded font-bold uppercase"
                      style={{
                        color: difficultyColors[resume.problem.difficulty].text,
                        backgroundColor: difficultyColors[resume.problem.difficulty].bg,
                        border: `1px solid ${difficultyColors[resume.problem.difficulty].border}`,
                      }}
                    >
                      {resume.problem.difficulty}
                    </span>
                  </div>
                </div>
                <Link
                  href={resume.href}
                  className="glass-raised glass-accent [--acc:#FF4D4D] flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shrink-0"
                >
                  Resume <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Activity — full year contribution heatmap */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp size={14} className="text-[#FF4D4D]" /> Activity
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setYear((y) => y - 1)}
                  disabled={year <= CURRENT_YEAR - 5}
                  aria-label="Previous year"
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-[11px] font-mono font-bold text-[#D1D5DB] tabular-nums w-[34px] text-center">{year}</span>
                <button
                  onClick={() => setYear((y) => y + 1)}
                  disabled={year >= CURRENT_YEAR}
                  aria-label="Next year"
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#6B7280] mb-2">{heatmap.total} solves in {heatmap.year}</div>

            <div className="overflow-x-auto scrollbar-thin pb-1">
              <div className="min-w-[640px]">
                <div
                  className="grid gap-[3px] pl-[32px] mb-1.5 text-[9px] font-mono text-[#6B7280]"
                  style={{ gridTemplateColumns: `repeat(${heatmap.cells.length}, minmax(0, 1fr))` }}
                >
                  {heatmap.monthLabels.map((m, i) => (
                    <span key={i} className="overflow-visible whitespace-nowrap">{m}</span>
                  ))}
                </div>
                <div className="flex items-stretch gap-1.5">
                  <div className="flex flex-col justify-between shrink-0 w-[26px] text-[9px] font-mono text-[#6B7280] py-[1px]">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                      <span key={i} className="flex-1 flex items-center leading-none">{d}</span>
                    ))}
                  </div>
                  <div
                    className="flex-1 grid grid-rows-7 grid-flow-col gap-[3px]"
                    style={{ gridTemplateColumns: `repeat(${heatmap.cells.length}, minmax(0, 1fr))` }}
                  >
                    {heatmap.cells.flatMap((col) => col).map((cell) => (
                      <div
                        key={cell.date}
                        title={cell.inYear ? `${cell.count} solve${cell.count === 1 ? '' : 's'} · ${prettyDate(cell.date)}` : undefined}
                        className={`aspect-square rounded-full ${cell.inYear ? INTENSITY[cell.intensity] : 'bg-white/[0.015]'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 mt-3 text-[9px] font-mono text-[#6B7280]">
              Less
              {INTENSITY.map((c, i) => <span key={i} className={`w-[11px] h-[11px] rounded-full ${c}`} />)}
              More
            </div>
          </div>

          {/* Start practising */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-white">Start Practising</h2>
                <p className="text-[11px] text-[#6B7280] mt-0.5">Choose a mode that fits your goal.</p>
              </div>
              <Link href={SOLVE} className="text-[11px] font-mono text-[#8A8A8A] hover:text-white flex items-center gap-1 transition-colors">
                Browse All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <ModeCard icon={<BookOpen size={18} className="text-[#FF4D4D]" />} title="Practice by Topic" desc="Solve questions topic-wise and strengthen your fundamentals." href={`${SOLVE}?mode=topics`} />
              <ModeCard icon={<Building2 size={18} className="text-[#FF4D4D]" />} title="Company Interviews" desc="Practice real interview questions from top tech companies." href={`${SOLVE}?mode=companies`} />
              <ModeCard icon={<SlidersHorizontal size={18} className="text-[#FF4D4D]" />} title="Custom Practice" desc="Build a session with your preferred topics, difficulty and count." href={SOLVE} />
              <ModeCard icon={<Database size={18} className="text-[#FF4D4D]" />} title="SQL Playground" desc="Run real SQLite queries against a seeded schema, graded live." href="/workspace/playground/sql" />
              <ModeCard icon={<Network size={18} className="text-[#FF4D4D]" />} title="System Design" desc="Draw architecture diagrams on a canvas with requirements and estimates." href="/workspace/playground/design" />
              <ModeCard icon={<FlaskConical size={18} className="text-[#FF4D4D]" />} title="AI / ML Lab" desc="Drill LLM interview questions, run sizing calculators and algorithm sims." href="/workspace/playground/aiml" />
              <ModeCard icon={<Trophy size={18} className="text-[#FF4D4D]" />} title="Contests" desc="Compete in timed challenges against other learners." soon />
            </div>
          </div>

          {/* Topic progress + Recent activity */}
          <div className="grid md:grid-cols-2 gap-3">
            <Panel
              title="Topic Progress"
              action={<Link href={SOLVE} className="text-[10px] font-mono text-[#8A8A8A] hover:text-white flex items-center gap-1">View All <ChevronRight size={11} /></Link>}
            >
              {topTopics.length === 0 ? (
                <p className="text-[11px] text-[#6B7280] py-2">Solve a problem to see topic progress.</p>
              ) : (
                <div className="space-y-3">
                  {topTopics.map((t) => (
                    <div key={t.topic}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[#D1D5DB]">{t.topic}</span>
                        <span className="font-mono text-[10px] text-[#6B7280]">{t.solved}/{t.total} · {Math.round(t.ratio * 100)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${Math.max(t.ratio * 100, t.solved > 0 ? 6 : 0)}%`, backgroundColor: toneFor(t.ratio, t.solved) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title="Recent Activity"
              action={recent.length > 0 ? <span className="text-[10px] font-mono text-[#6B7280]">{log.length} total</span> : undefined}
            >
              {!mounted ? (
                <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-9 rounded-lg bg-white/[0.02] animate-pulse" />)}</div>
              ) : recent.length === 0 ? (
                <p className="text-[11px] text-[#6B7280] py-2">No activity yet — solve your first problem.</p>
              ) : (
                <ul className="space-y-1">
                  {recent.map((e) => {
                    const c = difficultyColors[e.difficulty as Difficulty]
                    return (
                      <li key={`${e.id}-${e.at}`}>
                        <Link href={`${SOLVE}?problem=${e.id}`} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors group">
                          <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] text-[#D1D5DB] group-hover:text-white truncate">{e.title}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[8px] font-bold uppercase px-1 py-px rounded" style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}>{e.difficulty}</span>
                              <span className="text-[9px] font-mono text-[#6B7280]">{e.language}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-[#6B7280] shrink-0">{ago(e.at)}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Panel>
          </div>

          {/* deep analysis */}
          <TechnicalProfile key={tick} />
        </div>

        {/* ============ RIGHT RAIL ============ */}
        <aside className="space-y-4 lg:sticky lg:top-2 self-start">
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={13} className="text-[#FF4D4D]" /> Your Plan</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A8A] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">Free</span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] leading-relaxed">Unlimited practice, deeper analytics and contest mode are on the way.</p>
            <Link href="/workspace/profile" className="glass mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-xs font-semibold hover:border-white/20 transition-colors">
              Manage Account <ArrowRight size={13} />
            </Link>
          </div>

          {/* Daily challenge */}
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Swords size={13} className="text-[#FF4D4D]" /> Daily Challenge</h3>
              <span className="text-[9px] font-mono text-[#6B7280]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded"
                style={{
                  color: difficultyColors[daily.difficulty].text,
                  backgroundColor: difficultyColors[daily.difficulty].bg,
                  border: `1px solid ${difficultyColors[daily.difficulty].border}`,
                }}
              >
                {daily.difficulty}
              </span>
              {dailyDone && <span className="text-[9px] font-mono text-[#10B981] flex items-center gap-1"><CheckCircle2 size={10} /> Solved</span>}
            </div>
            <p className="text-[13px] font-semibold text-white leading-tight">{daily.title}</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {daily.topics.slice(0, 3).map((t) => (
                <span key={t} className="text-[8px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
            <Link
              href={`${SOLVE}?problem=${daily.id}`}
              className={`mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold ${
                dailyDone
                  ? 'glass text-[#D1D5DB] hover:text-white hover:border-white/25 transition-colors'
                  : 'glass-raised glass-accent [--acc:#F59E0B] text-white'
              }`}
            >
              {dailyDone ? 'Review' : 'Solve Today'} <ArrowRight size={13} />
            </Link>
          </div>

          {/* This week */}
          <Panel title={<span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-[#8B5CF6]" /> This Week</span>}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-white leading-none">{week.solves}</div>
                <div className="text-[9px] font-mono text-[#6B7280] mt-1">solves</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{week.activeDays}<span className="text-[#6B7280] text-xs">/7</span></div>
                <div className="text-[9px] font-mono text-[#6B7280] mt-1">active days</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white leading-none">{stats.currentStreak}</div>
                <div className="text-[9px] font-mono text-[#6B7280] mt-1">day streak</div>
              </div>
            </div>
          </Panel>

          {/* Bookmarked */}
          <Panel title={<span className="flex items-center gap-1.5"><Bookmark size={13} className="text-[#F59E0B]" /> Bookmarked</span>}>
            {bookmarks.length === 0 ? (
              <p className="text-[11px] text-[#6B7280]">Bookmark problems in the editor to pin them here for quick access.</p>
            ) : (
              <ul className="space-y-0.5">
                {bookmarks.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link href={`${SOLVE}?problem=${p.id}`} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
                      <Bookmark size={11} className="text-[#F59E0B] shrink-0" />
                      <span className="flex-1 text-[11px] text-[#D1D5DB] group-hover:text-white truncate">{p.title}</span>
                      <span
                        className="text-[8px] font-bold uppercase px-1 py-px rounded shrink-0"
                        style={{
                          color: difficultyColors[p.difficulty].text,
                          backgroundColor: difficultyColors[p.difficulty].bg,
                          border: `1px solid ${difficultyColors[p.difficulty].border}`,
                        }}
                      >
                        {p.difficulty}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title={<span className="flex items-center gap-1.5"><Target size={13} className="text-[#FF4D4D]" /> Goals</span>}>
            <div className="space-y-3">
              <GoalRow icon={<CheckCircle2 size={11} className="text-[#10B981]" />} label={`Solve ${goals.solve} problems`} cur={stats.totalSolved} target={goals.solve} />
              <GoalRow icon={<Flame size={11} className="text-[#F59E0B]" />} label={`${goals.streak}-day streak`} cur={stats.currentStreak} target={goals.streak} />
              <GoalRow icon={<Zap size={11} className="text-[#FF4D4D]" />} label={`Reach Level ${goals.level}`} cur={stats.level} target={goals.level} />
            </div>
          </Panel>

          <Panel title="Quick Links">
            <div className="space-y-1">
              {[
                { icon: <Terminal size={13} />, label: 'Open FORCE', href: `${SOLVE}?mode=topics` },
                { icon: <ListChecks size={13} />, label: 'Browse Problems', href: SOLVE },
                { icon: <Briefcase size={13} />, label: 'Career Workspace', href: '/workspace/career' },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] text-[#D1D5DB] hover:text-white hover:bg-white/[0.03] transition-colors group">
                  <span className="text-[#8A8A8A] group-hover:text-[#FF4D4D] transition-colors">{l.icon}</span>
                  {l.label}
                  <ChevronRight size={12} className="ml-auto text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors" />
                </Link>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}
