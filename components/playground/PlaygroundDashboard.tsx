'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, Flame, Trophy, CalendarDays, Code2, CheckCircle2,
  Zap, Sparkles, TrendingUp,
} from 'lucide-react'
import { PROBLEMS, difficultyColors, type Difficulty } from '@/lib/playground-data'
import {
  computeStats, buildHeatmap, readSolvedLog, readSolvedIds, prettyDate,
  type ProgressStats, type SolvedEntry, type HeatCell,
} from '@/lib/playground-stats'

const EMPTY_STATS: ProgressStats = {
  totalXp: 0, level: 1, xpInLevel: 0, xpForLevel: 120, totalSolved: 0,
  byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
  currentStreak: 0, longestStreak: 0, totalActiveDays: 0, lastActiveDate: null,
}

const INTENSITY = [
  'bg-white/[0.04]',
  'bg-[#FF4D4D]/25',
  'bg-[#FF4D4D]/45',
  'bg-[#FF4D4D]/70',
  'bg-[#FF4D4D]',
]

const SOLVE_HREF = '/workspace/playground/solve'

interface SolvedRow {
  id: string
  title: string
  difficulty: Difficulty
  language?: string
  date?: string
}

function StatCard({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">
        {icon}{label}
      </div>
      {children}
    </div>
  )
}

export default function PlaygroundDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<ProgressStats>(EMPTY_STATS)
  const [heatmap, setHeatmap] = useState<{ cells: HeatCell[][]; monthLabels: string[]; total: number }>({
    cells: [], monthLabels: [], total: 0,
  })
  const [solvedLog, setSolvedLog] = useState<SolvedEntry[]>([])

  useEffect(() => {
    setStats(computeStats())
    setHeatmap(buildHeatmap(26))
    setSolvedLog(readSolvedLog())
    setMounted(true)
  }, [])

  const totalProblems = PROBLEMS.length
  const xpPct = Math.min(100, Math.round((stats.xpInLevel / stats.xpForLevel) * 100))
  const xpToNext = Math.max(0, stats.xpForLevel - stats.xpInLevel)

  const solvedRows = useMemo<SolvedRow[]>(() => {
    const byId = new Map(solvedLog.map((e) => [e.id, e]))
    const rows: SolvedRow[] = solvedLog.map((e) => ({
      id: e.id, title: e.title, difficulty: e.difficulty, language: e.language, date: e.date,
    }))
    for (const id of readSolvedIds()) {
      if (byId.has(id)) continue
      const p = PROBLEMS.find((x) => x.id === id)
      if (p) rows.push({ id: p.id, title: p.title, difficulty: p.difficulty })
    }
    return rows
  }, [solvedLog])

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center">
              <Code2 size={16} className="text-[#FF4D4D]" />
            </span>
            Playground
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1.5">
            Your coding streak, level and everything you&apos;ve solved.
          </p>
        </div>
        <Link
          href={SOLVE_HREF}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4D4D] hover:bg-[#E03A3A] text-white text-sm font-semibold shadow-[0_8px_24px_-6px_rgba(255,77,77,0.55)] transition-all"
        >
          Open Playground
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard icon={<Zap size={11} className="text-[#FF4D4D]" />} label="Level">
          <div className="text-2xl font-bold text-white leading-none">Lv {stats.level}</div>
          <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-[#FF4D4D] transition-[width] duration-500" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="mt-1.5 text-[10px] font-mono text-[#6B7280]">{xpToNext} XP to Lv {stats.level + 1}</div>
        </StatCard>

        <StatCard icon={<Flame size={11} className="text-[#F59E0B]" />} label="Current streak">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-white leading-none">{stats.currentStreak}</span>
            <span className="text-xs text-[#8A8A8A] mb-0.5">day{stats.currentStreak === 1 ? '' : 's'}</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-[#6B7280]">
            {stats.lastActiveDate ? `Last active ${prettyDate(stats.lastActiveDate)}` : 'Solve one to start'}
          </div>
        </StatCard>

        <StatCard icon={<Trophy size={11} className="text-[#FBBF24]" />} label="Longest streak">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-white leading-none">{stats.longestStreak}</span>
            <span className="text-xs text-[#8A8A8A] mb-0.5">day{stats.longestStreak === 1 ? '' : 's'}</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-[#6B7280]">Personal best</div>
        </StatCard>

        <StatCard icon={<CheckCircle2 size={11} className="text-[#10B981]" />} label="Solved">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-white leading-none">{stats.totalSolved}</span>
            <span className="text-xs text-[#8A8A8A] mb-0.5">/ {totalProblems}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono">
            <span className="text-[#10B981]">E {stats.byDifficulty.Easy}</span>
            <span className="text-[#F59E0B]">M {stats.byDifficulty.Medium}</span>
            <span className="text-[#EF4444]">H {stats.byDifficulty.Hard}</span>
          </div>
        </StatCard>

        <StatCard icon={<CalendarDays size={11} className="text-[#8B5CF6]" />} label="Active days">
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-white leading-none">{stats.totalActiveDays}</span>
            <span className="text-xs text-[#8A8A8A] mb-0.5">total</span>
          </div>
          <div className="mt-2 text-[10px] font-mono text-[#6B7280]">{heatmap.total} solves in 6 months</div>
        </StatCard>
      </div>

      {/* Contribution heatmap */}
      <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp size={14} className="text-[#FF4D4D]" /> Activity
          </h2>
          <span className="text-[10px] font-mono text-[#6B7280]">last 6 months</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin pb-1">
          <div className="inline-flex flex-col gap-1.5 min-w-max">
            {/* month labels */}
            <div className="flex gap-[3px] pl-[24px] text-[9px] font-mono text-[#6B7280]">
              {heatmap.monthLabels.map((m, i) => (
                <span key={i} className="w-[12px] shrink-0 overflow-visible whitespace-nowrap">{m}</span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {/* weekday labels */}
              <div className="flex flex-col gap-[3px] pr-1 text-[9px] font-mono text-[#6B7280]">
                {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
                  <span key={i} className="h-[12px] leading-[12px]">{d}</span>
                ))}
              </div>
              {/* grid */}
              {heatmap.cells.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-[3px]">
                  {col.map((cell) => (
                    <div
                      key={cell.date}
                      title={`${cell.count} solve${cell.count === 1 ? '' : 's'} · ${prettyDate(cell.date)}`}
                      className={`w-[12px] h-[12px] rounded-[3px] ${INTENSITY[cell.intensity]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-3 text-[9px] font-mono text-[#6B7280]">
          Less
          {INTENSITY.map((c, i) => <span key={i} className={`w-[12px] h-[12px] rounded-[3px] ${c}`} />)}
          More
        </div>
      </div>

      {/* Solved problems list */}
      <div className="mt-6">
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-[#FF4D4D]" />
          Solved Problems
          <span className="text-[#6B7280] font-mono font-normal">({mounted ? solvedRows.length : 0})</span>
        </h2>

        {!mounted ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] divide-y divide-white/[0.04]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[46px] animate-pulse bg-white/[0.015]" />
            ))}
          </div>
        ) : solvedRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-[#0D0D10] px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center mx-auto mb-3">
              <Code2 size={20} className="text-[#FF4D4D]" />
            </div>
            <p className="text-sm text-[#D1D5DB] font-medium">No problems solved yet</p>
            <p className="text-xs text-[#6B7280] mt-1 mb-4">Solve your first problem to start a streak.</p>
            <Link href={SOLVE_HREF} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF4D4D] hover:bg-[#E03A3A] text-white text-xs font-semibold transition-all">
              Start solving <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] divide-y divide-white/[0.04] overflow-hidden">
            {solvedRows.map((r, i) => {
              const c = difficultyColors[r.difficulty]
              return (
                <Link
                  key={r.id}
                  href={SOLVE_HREF}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group"
                >
                  <span className="w-5 text-[11px] font-mono text-[#4B5563] shrink-0">{i + 1}</span>
                  <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />
                  <span className="flex-1 text-[13px] text-[#D1D5DB] group-hover:text-white truncate">{r.title}</span>
                  {r.language && (
                    <span className="hidden sm:inline text-[9px] font-mono uppercase text-[#8A8A8A] bg-white/[0.04] px-1.5 py-0.5 rounded shrink-0">{r.language}</span>
                  )}
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                    style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    {r.difficulty}
                  </span>
                  {r.date && (
                    <span className="hidden md:block text-[10px] font-mono text-[#6B7280] w-[92px] text-right shrink-0">{prettyDate(r.date)}</span>
                  )}
                  <ArrowRight size={13} className="text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
