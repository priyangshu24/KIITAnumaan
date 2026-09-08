'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, ChevronDown, Search, Sparkles, BookOpen, Target, ExternalLink,
  Check, Cpu, SlidersHorizontal, ClipboardCheck, ShieldCheck, Database, Bot,
  Workflow, Boxes, Trophy, ScanLine, GitBranch, Network, Circle, Terminal,
  Grid3x3, Hash, ArrowUpDown, Ruler, Gauge, BarChart2, Users, Briefcase,
  Phone, Coins, Binary, Calculator, Puzzle,
  type LucideIcon,
} from 'lucide-react'
import {
  TRACKS, trackStats, AIML_LEVELS, LEVEL_POINTS,
  type InterviewTrack, type AimlLevel,
} from '@/lib/interview-tracks'
import { LEVEL_COLOR } from '@/lib/aiml-interview-data'

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu, sliders: SlidersHorizontal, clipboard: ClipboardCheck, shield: ShieldCheck,
  database: Database, bot: Bot, workflow: Workflow, boxes: Boxes, trophy: Trophy,
  scan: ScanLine, gitbranch: GitBranch, network: Network, sparkles: Sparkles,
  grid: Grid3x3, hash: Hash, sort: ArrowUpDown, ruler: Ruler, gauge: Gauge,
  chart: BarChart2, users: Users, briefcase: Briefcase, phone: Phone,
  coins: Coins, target: Target, binary: Binary, calculator: Calculator, puzzle: Puzzle,
}
const iconFor = (k: string): LucideIcon => ICONS[k] ?? Circle

function LevelPill({ level }: { level: AimlLevel }) {
  const c = LEVEL_COLOR[level]
  return (
    <span
      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
      style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}
    >
      {level}
    </span>
  )
}

export default function TrackHub({ track }: { track: InterviewTrack }) {
  const stats = useMemo(() => trackStats(track), [track])
  const accent = track.accent

  const [level, setLevel] = useState<'All' | AimlLevel>('All')
  const [query, setQuery] = useState('')
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set([track.subtopics[0].id]))
  const [openQs, setOpenQs] = useState<Set<string>>(new Set())
  const [done, setDone] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)

  const storageKey = `kiit:track:readiness:${track.slug}`

  useEffect(() => {
    setDone(new Set())
    setOpenTopics(new Set([track.subtopics[0].id]))
    setOpenQs(new Set())
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) setDone(new Set(JSON.parse(raw)))
    } catch { /* private mode */ }
    setMounted(true)
  }, [storageKey, track])

  useEffect(() => {
    if (!mounted) return
    try { window.localStorage.setItem(storageKey, JSON.stringify([...done])) } catch { /* quota */ }
  }, [done, mounted, storageKey])

  const toggleSet = (s: Set<string>, v: string, apply: (n: Set<string>) => void) => {
    const next = new Set(s)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    apply(next)
  }

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    return track.subtopics.map((s) => {
      const questions = s.questions.filter((item) => {
        if (level !== 'All' && item.level !== level) return false
        if (!q) return true
        return (
          item.q.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          item.outline.some((o) => o.toLowerCase().includes(q))
        )
      })
      return { ...s, questions }
    }).filter((s) => s.questions.length > 0)
  }, [track, level, query])

  const shownCount = sections.reduce((n, s) => n + s.questions.length, 0)
  const totalPoints = sections.reduce(
    (n, s) => n + s.questions.reduce((m, q) => m + LEVEL_POINTS[q.level], 0), 0,
  )

  const readinessRows = useMemo(
    () => (level === 'All' ? track.readiness : track.readiness.filter((r) => r.level === level)),
    [track, level],
  )
  const readyPct = readinessRows.length
    ? Math.round((readinessRows.filter((r) => done.has(r.id)).length / readinessRows.length) * 100)
    : 0

  return (
    <div className="max-w-[1600px] mx-auto pb-12 space-y-5">
      {/* ============ TRACK SWITCHER ============ */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {TRACKS.map((t) => {
          const Icon = iconFor(t.icon)
          const active = t.slug === track.slug
          return (
            <Link
              key={t.slug}
              href={`/workspace/playground/track/${t.slug}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
                active ? 'text-white' : 'bg-white/[0.03] text-[#8A8A8A] hover:text-white border-transparent'
              }`}
              style={active ? { backgroundColor: `${t.accent}1A`, borderColor: `${t.accent}55`, color: t.accent } : undefined}
            >
              <Icon size={13} /> {t.short}
            </Link>
          )
        })}
      </div>

      {/* ============ HERO ============ */}
      <div className="relative overflow-hidden w-full bg-[#0B0B0D] border border-white/[0.08] rounded-[24px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
        <img
          src="/kiit-campus-dotted.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] opacity-80 pointer-events-none z-0 rounded-[24px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/85 to-transparent pointer-events-none z-10 rounded-[24px]" />
        <div className="relative z-20 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono drop-shadow"
              style={{ color: accent }}
            >
              <Sparkles size={11} /> Interview Track
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-tight leading-none mt-2 drop-shadow-md">
              {track.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-3 leading-relaxed drop-shadow max-w-xl">
              {track.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <Link
                href={track.practiceHref ?? '/workspace/playground/solve?mode=topics'}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent, boxShadow: `0 8px 24px -6px ${accent}8C` }}
              >
                Start Practising <ArrowRight size={13} />
              </Link>
              <Link
                href="/workspace/playground/tracks"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/[0.14] hover:border-white/30 text-white text-xs font-semibold transition-colors backdrop-blur-sm"
              >
                All Tracks
              </Link>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-3 gap-2 shrink-0">
            {AIML_LEVELS.map((l) => (
              <div key={l} className="rounded-xl border border-white/[0.1] bg-black/40 backdrop-blur-sm px-3 py-2 text-center">
                <div className="text-lg font-bold text-white leading-none">{stats.byLevel[l]}</div>
                <div className="text-[9px] font-mono mt-1" style={{ color: LEVEL_COLOR[l].text }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: <Boxes size={17} />, v: stats.subtopics, l: 'Subtopics' },
          { icon: <ClipboardCheck size={17} />, v: stats.questions, l: 'Interview Questions' },
          { icon: <BookOpen size={17} />, v: stats.readings, l: 'Primary Sources' },
          { icon: <Target size={17} />, v: `${readyPct}%`, l: 'Your Readiness' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}33` }}
            >{s.icon}</span>
            <div className="min-w-0">
              <div className="text-lg font-bold text-white leading-none">{s.v}</div>
              <div className="text-[10px] font-mono text-[#6B7280] mt-1">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1fr_330px] gap-5">
        {/* ============ MAIN ============ */}
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-3">
            <div className="flex items-center gap-1.5">
              {(['All', ...AIML_LEVELS] as const).map((l) => {
                const active = level === l
                return (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border ${
                      active ? 'text-white' : 'bg-white/[0.03] text-[#8A8A8A] hover:text-white border-transparent'
                    }`}
                    style={active ? { backgroundColor: `${accent}26`, borderColor: `${accent}4D`, color: accent } : undefined}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions…"
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white placeholder:text-[#6B7280] outline-none focus:border-white/25 w-44"
                />
              </div>
              <button onClick={() => setOpenTopics(new Set(sections.map((s) => s.id)))} className="text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors">Expand all</button>
              <span className="text-[#3F3F46]">·</span>
              <button onClick={() => { setOpenTopics(new Set()); setOpenQs(new Set()) }} className="text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors">Collapse</button>
            </div>
          </div>

          <p className="text-[11px] font-mono text-[#6B7280] px-1">
            {shownCount} question{shownCount === 1 ? '' : 's'} · {sections.length} subtopic{sections.length === 1 ? '' : 's'} · {totalPoints} pts
          </p>

          <div className="space-y-3">
            {sections.map((s) => {
              const Icon = iconFor(s.icon)
              const open = openTopics.has(s.id)
              return (
                <div key={s.id} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] overflow-hidden">
                  <button
                    onClick={() => toggleSet(openTopics, s.id, setOpenTopics)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}33` }}
                    >
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-[13px] font-bold text-white">{s.title}</h3>
                        <span className="text-[9px] font-mono text-[#6B7280] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">
                          {s.questions.length} Q
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8A8A8A] mt-0.5 truncate">{s.tagline}</p>
                    </div>
                    <ChevronDown size={16} className={`text-[#6B7280] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>

                  {open && (
                    <div className="px-4 pb-4 space-y-3 border-t border-white/[0.05] pt-3">
                      <p className="text-[12px] text-[#9CA3AF] leading-relaxed">{s.definition}</p>

                      <div className="space-y-2">
                        {s.questions.map((item, i) => {
                          const qOpen = openQs.has(item.id)
                          return (
                            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-[#111214] overflow-hidden">
                              <button
                                onClick={() => toggleSet(openQs, item.id, setOpenQs)}
                                className="w-full flex items-start gap-2.5 p-3 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                              >
                                <span className="text-[10px] font-mono text-[#4B5563] mt-0.5 shrink-0 w-4">{i + 1}.</span>
                                <span className="flex-1 text-[12.5px] text-[#D1D5DB] leading-snug">{item.q}</span>
                                <LevelPill level={item.level} />
                                <ChevronDown size={13} className={`text-[#4B5563] shrink-0 mt-0.5 transition-transform ${qOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {qOpen && (
                                <div className="px-3 pb-3 pl-9 space-y-2 border-t border-white/[0.05] pt-2.5">
                                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#6B7280]">Answer outline</div>
                                  <ul className="space-y-1.5">
                                    {item.outline.map((o, oi) => (
                                      <li key={oi} className="flex gap-2 text-[12px] text-[#9CA3AF] leading-relaxed">
                                        <span className="shrink-0" style={{ color: accent }}>›</span>
                                        <span>{o}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {item.followUp && (
                                    <p className="text-[11px] text-[#6B7280] italic pt-1">Likely follow-up: {item.followUp}</p>
                                  )}
                                  {(item.source ?? s.reading[0]) && (
                                    <a
                                      href={(item.source ?? s.reading[0]).url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors pt-1"
                                    >
                                      Reference: {(item.source ?? s.reading[0]).label} <ExternalLink size={9} />
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div className="pt-1">
                        <div className="text-[9px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5 flex items-center gap-1.5">
                          <BookOpen size={10} /> Recommended reading
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {s.reading.map((r) => (
                            <a
                              key={r.url}
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] px-2 py-1 rounded-lg transition-colors"
                            >
                              {r.label} <ExternalLink size={9} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {sections.length === 0 && (
              <p className="text-[12px] text-[#6B7280] py-12 text-center rounded-2xl border border-dashed border-white/[0.1]">
                No questions match that search at this level.
              </p>
            )}
          </div>
        </div>

        {/* ============ RIGHT RAIL ============ */}
        <aside className="space-y-4 xl:sticky xl:top-2 self-start">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Target size={13} style={{ color: accent }} /> Readiness Check
              </h3>
              <span className="text-[11px] font-mono font-bold" style={{ color: accent }}>{readyPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${readyPct}%`, backgroundColor: accent }} />
            </div>
            <div className="space-y-0.5 max-h-[340px] overflow-y-auto scrollbar-thin -mr-1 pr-1">
              {readinessRows.map((r) => {
                const checked = done.has(r.id)
                return (
                  <button
                    key={r.id}
                    onClick={() => toggleSet(done, r.id, setDone)}
                    className="w-full flex items-start gap-2.5 py-1.5 group cursor-pointer text-left"
                  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      checked ? 'bg-[#10B981] border-[#10B981]' : 'border-white/20 group-hover:border-white/40'
                    }`}>
                      {checked && <Check size={11} className="text-white" />}
                    </span>
                    <span className={`flex-1 text-[11.5px] leading-snug transition-colors ${
                      checked ? 'text-[#6B7280] line-through' : 'text-[#D1D5DB] group-hover:text-white'
                    }`}>
                      {r.label}
                    </span>
                    <LevelPill level={r.level} />
                  </button>
                )
              })}
            </div>
          </div>

          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: `${accent}33`, background: `linear-gradient(135deg, ${accent}14, transparent)` }}
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles size={13} style={{ color: accent }} /> Put it into practice
            </h3>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed mt-1.5">
              Reading outlines is not the same as answering out loud. Pair each subtopic with a timed mock.
            </p>
            <div className="mt-3 space-y-1.5">
              {[
                { icon: <Terminal size={13} />, label: track.practiceHref ? 'Open this track’s workspace' : 'Open FORCE editor', href: track.practiceHref ?? '/workspace/playground/solve?mode=topics' },
                { icon: <Boxes size={13} />, label: 'Browse the Directory', href: '/workspace/playground/solve' },
                { icon: <Trophy size={13} />, label: 'Company interview sets', href: '/workspace/playground/solve?mode=companies' },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] text-[#D1D5DB] hover:text-white hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="text-[#8A8A8A] transition-colors">{l.icon}</span>
                  {l.label}
                  <ArrowRight size={12} className="ml-auto text-[#4B5563] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
            <h3 className="text-sm font-bold text-white mb-2.5">Level guide</h3>
            <div className="space-y-2">
              {([
                ['Fresher', 'Campus / entry level — definitions, the happy path, and clean fundamentals.'],
                ['SDE II', 'Trade-offs, debugging, and designing a component end to end.'],
                ['SDE III', 'Scale, rollout safety, cost architecture, and influence beyond your code.'],
              ] as [AimlLevel, string][]).map(([l, d]) => (
                <div key={l} className="flex items-start gap-2">
                  <LevelPill level={l} />
                  <p className="text-[11px] text-[#8A8A8A] leading-snug flex-1">{d}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-[#4B5563] mt-3 pt-3 border-t border-white/[0.06]">
              Points: Fresher {LEVEL_POINTS.Fresher} · SDE II {LEVEL_POINTS['SDE II']} · SDE III {LEVEL_POINTS['SDE III']}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
