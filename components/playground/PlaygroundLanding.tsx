'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Search, X, Play, Check, ChevronDown, CheckCircle2,
  FileText, Building2, Boxes, SlidersHorizontal, Sparkles, Circle,
  Grid3x3, Type, Link2, GitBranch, Share2, Repeat, Layers, Hash, Gauge,
  ArrowLeftRight, Zap, Network, Database, Triangle, Brackets, BarChart2,
  type LucideIcon,
} from 'lucide-react'
import CompanyLogo from '@/components/shared/CompanyLogo'
import {
  Problem, PracticeSession, PracticeSessionConfig, PROBLEMS,
  difficultyColors, type Difficulty,
} from '@/lib/playground-data'
import { readSolvedIds } from '@/lib/playground-stats'
import { ALL_TRACKS_STATS } from '@/lib/interview-tracks'
import TrackGrid from '@/components/playground/TrackGrid'

interface PlaygroundLandingProps {
  solvedCount: number
  activePracticeSession: PracticeSession | null
  onStartTopicPractice: () => void
  onStartCompanyInterviews: () => void
  onStartCustomPractice: (config?: PracticeSessionConfig) => void
  onContinuePractice: () => void
  problems: Problem[]
}

// -- derivations over the real catalogue --------------------------------

// A broad interview-question taxonomy covering SWE, data and AI/ML tracks.
// Each problem is classified into one or more of these buckets; buckets with
// no questions yet still show as a roadmap of what the directory will cover.
const QUESTION_TYPES = [
  'Algorithms & Data Structures',
  'SQL & Databases',
  'System Design (HLD)',
  'Low-Level Design (OOD)',
  'Data Engineering',
  'Big Data & Streaming',
  'Machine Learning',
  'Deep Learning',
  'LLM & Generative AI',
  'MLOps & Deployment',
  'NLP & Information Retrieval',
  'Statistics & A/B Testing',
  'Data Analysis & Product Sense',
  'Computer Science Fundamentals',
  'DevOps & Cloud Infra',
  'Behavioral & Leadership',
  'Aptitude & Quantitative',
  'ML Theory & Research',
] as const
type QType = (typeof QUESTION_TYPES)[number]

const qTypesOf = (p: Problem): QType[] => {
  const out = new Set<QType>()
  const topics = p.topics as string[]
  const has = (t: string) => topics.includes(t)

  if (has('SQL')) { out.add('SQL & Databases'); out.add('Data Engineering') }
  else if (has('Design')) { out.add('System Design (HLD)'); out.add('Low-Level Design (OOD)') }
  else out.add('Algorithms & Data Structures')

  if (has('Trees') || has('Graphs') || has('Hashing')) out.add('Computer Science Fundamentals')
  if (has('Dynamic Programming') || has('Recursion & Backtracking') || has('Math')) out.add('ML Theory & Research')
  if (out.size === 0) out.add('Algorithms & Data Structures')
  return [...out]
}

const TOPIC_CAT: Record<string, string> = {
  Arrays: 'DSA', Strings: 'DSA', 'Linked Lists': 'DSA', 'Stacks & Queues': 'DSA',
  Trees: 'DSA', Graphs: 'DSA', Hashing: 'DSA', 'Dynamic Programming': 'DSA',
  'Sliding Window': 'DSA', 'Monotonic Stack': 'DSA', 'Heap / Priority Queue': 'DSA',
  Intervals: 'DSA', 'Two Pointers': 'DSA', Greedy: 'DSA', 'Recursion & Backtracking': 'DSA',
  'Binary Search': 'DSA', 'Bit Manipulation': 'DSA', Math: 'DSA',
  Design: 'System Design', SQL: 'Databases',
}
const catFor = (t: string) => TOPIC_CAT[t] ?? 'Other'

const TOPIC_ICON: Record<string, LucideIcon> = {
  Arrays: Grid3x3, Strings: Type, 'Linked Lists': Link2, 'Stacks & Queues': Layers,
  Trees: GitBranch, Graphs: Share2, Hashing: Hash, 'Dynamic Programming': Boxes,
  'Sliding Window': Gauge, 'Monotonic Stack': BarChart2, 'Heap / Priority Queue': Triangle,
  Intervals: Brackets, 'Two Pointers': ArrowLeftRight, Greedy: Zap,
  'Recursion & Backtracking': Repeat, 'Binary Search': Search, Design: Network, SQL: Database,
}
const iconFor = (t: string): LucideIcon => TOPIC_ICON[t] ?? Circle

const GOAL_OPTIONS = [3, 5, 10, 15, 20]

// -- pieces -----------------------------------------------------------

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D] shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-lg font-bold text-white leading-none">{value}</div>
        <div className="text-[10px] font-mono text-[#6B7280] mt-1">{label}</div>
      </div>
    </div>
  )
}

function CheckRow({ label, count, checked, onToggle, muted }: {
  label: string; count: number; checked: boolean; onToggle: () => void; muted?: boolean
}) {
  return (
    <button onClick={onToggle} className={`w-full flex items-center gap-2.5 py-1.5 group cursor-pointer ${muted ? 'opacity-45 hover:opacity-80 transition-opacity' : ''}`}>
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-[#FF4D4D] border-[#FF4D4D]' : 'border-white/20 group-hover:border-white/40'
      }`}>
        {checked && <Check size={11} className="text-white" />}
      </span>
      <span className="flex-1 text-left text-[12px] text-[#D1D5DB] group-hover:text-white transition-colors truncate">{label}</span>
      {muted
        ? <span className="text-[8px] font-mono uppercase tracking-wider text-[#4B5563] shrink-0">soon</span>
        : <span className="text-[10px] font-mono text-[#4B5563] shrink-0">{count}</span>}
    </button>
  )
}

// -- main -----------------------------------------------------------

export default function PlaygroundLanding({
  activePracticeSession,
  onStartTopicPractice,
  onStartCompanyInterviews,
  onStartCustomPractice,
  onContinuePractice,
  problems,
}: PlaygroundLandingProps) {
  const [tab, setTab] = useState<'topics' | 'companies'>('topics')
  const [topicSearch, setTopicSearch] = useState('')
  const [topicCat, setTopicCat] = useState('All Categories')
  const [catOpen, setCatOpen] = useState(false)

  const [headerQuery, setHeaderQuery] = useState('')
  const [showAllTracks, setShowAllTracks] = useState(false)
  const [dailyGoal, setDailyGoal] = useState(10)
  const [goalOpen, setGoalOpen] = useState(false)
  const [diffFilter, setDiffFilter] = useState<Set<Difficulty>>(new Set())
  const [typeFilter, setTypeFilter] = useState<Set<QType>>(new Set())
  const [companyFilter, setCompanyFilter] = useState<Set<string>>(new Set())
  const [companySearch, setCompanySearch] = useState('')
  const [showMoreCompanies, setShowMoreCompanies] = useState(false)

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState('All Topics')
  const [customDifficulty, setCustomDifficulty] = useState<'All' | Difficulty>('All')
  const [customCount, setCustomCount] = useState(10)
  const [customMode, setCustomMode] = useState<'practice' | 'interview'>('practice')

  // live solved set (re-reads when the tab regains focus)
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())
  useEffect(() => {
    const load = () => setSolvedIds(new Set(readSolvedIds()))
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  // ---- catalogue-wide facts (real) ----
  const facts = useMemo(() => {
    const companies = new Set<string>()
    const topics = new Set<string>()
    const diffCount: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 }
    const typeCount = Object.fromEntries(QUESTION_TYPES.map((t) => [t, 0])) as Record<QType, number>
    for (const p of PROBLEMS) {
      p.companies.forEach((c) => companies.add(c))
      p.topics.forEach((t) => { if (t !== 'All') topics.add(t) })
      diffCount[p.difficulty] += 1
      qTypesOf(p).forEach((t) => { typeCount[t] += 1 })
    }
    // populated types first, roadmap (0) types after — each group alphabetical-ish by definition order
    const typeRows = [...QUESTION_TYPES].sort((a, b) => (typeCount[b] > 0 ? 1 : 0) - (typeCount[a] > 0 ? 1 : 0))
    return {
      total: PROBLEMS.length, companies: companies.size, topics: topics.size,
      diffCount, typeCount, typeRows,
      categories: ['All Categories', ...new Set([...topics].map(catFor))],
    }
  }, [])

  // companies with real question / solved counts
  const companyRows = useMemo(() => {
    const map = new Map<string, { total: number; solved: number }>()
    for (const p of PROBLEMS) {
      for (const c of p.companies) {
        const e = map.get(c) ?? { total: 0, solved: 0 }
        e.total += 1
        if (solvedIds.has(p.id)) e.solved += 1
        map.set(c, e)
      }
    }
    return [...map.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total)
  }, [solvedIds])

  // ---- problems after all active filters ----
  const filtered = useMemo(() => {
    const q = topicSearch.trim().toLowerCase()
    const hq = headerQuery.trim().toLowerCase()
    return PROBLEMS.filter((p) => {
      if (diffFilter.size && !diffFilter.has(p.difficulty)) return false
      if (typeFilter.size && !qTypesOf(p).some((t) => typeFilter.has(t))) return false
      if (companyFilter.size && !p.companies.some((c) => companyFilter.has(c))) return false
      if (topicCat !== 'All Categories' && !p.topics.some((t) => catFor(t) === topicCat)) return false
      if (q && !p.title.toLowerCase().includes(q) && !p.topics.some((t) => t.toLowerCase().includes(q))) return false
      if (hq && !p.title.toLowerCase().includes(hq) && !p.topics.some((t) => t.toLowerCase().includes(hq)) && !p.companies.some((c) => c.toLowerCase().includes(hq))) return false
      return true
    })
  }, [diffFilter, typeFilter, companyFilter, topicCat, topicSearch, headerQuery])

  // topic rows derived from the *filtered* set
  const topicRows = useMemo(() => {
    const map = new Map<string, { total: number; solved: number }>()
    for (const p of filtered) {
      for (const t of p.topics) {
        if (t === 'All') continue
        const e = map.get(t) ?? { total: 0, solved: 0 }
        e.total += 1
        if (solvedIds.has(p.id)) e.solved += 1
        map.set(t, e)
      }
    }
    return [...map.entries()]
      .map(([topic, v]) => ({ topic, ...v, ratio: v.total ? v.solved / v.total : 0 }))
      .sort((a, b) => b.total - a.total || a.topic.localeCompare(b.topic))
  }, [filtered, solvedIds])

  // filter-panel company list (real counts, searchable)
  const filterCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase()
    const list = q ? companyRows.filter((c) => c.name.toLowerCase().includes(q)) : companyRows
    return showMoreCompanies || q ? list : list.slice(0, 6)
  }, [companyRows, companySearch, showMoreCompanies])

  // global search results
  const headerResults = useMemo(() => {
    const q = headerQuery.trim().toLowerCase()
    if (!q) return []
    return PROBLEMS.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.topics.some((t) => t.toLowerCase().includes(q)) ||
      p.companies.some((c) => c.toLowerCase().includes(q)),
    ).slice(0, 8)
  }, [headerQuery])

  const activeFilterCount = diffFilter.size + typeFilter.size + companyFilter.size + (topicCat !== 'All Categories' ? 1 : 0)

  // ---- actions ----
  const buildConfig = (extra?: Partial<PracticeSessionConfig>): PracticeSessionConfig => ({
    companyId: 'general',
    companyName: companyFilter.size ? [...companyFilter][0] : 'General Practice',
    role: 'Software Engineer',
    experience: '0–2 Years',
    topic: 'All Topics',
    difficulty: diffFilter.size === 1 ? [...diffFilter][0] : 'All',
    source: 'all',
    questionCount: Math.max(1, Math.min(dailyGoal, PROBLEMS.length)),
    mode: 'practice',
    ...extra,
  })
  const startPracticing = () => onStartCustomPractice(buildConfig())
  const openTopic = (topic: string) => onStartCustomPractice(buildConfig({ topic, companyName: `${topic} Practice` }))
  const openCompany = (name: string) => onStartCustomPractice(buildConfig({ companyId: name, companyName: name }))

  const clearFilters = () => {
    setDiffFilter(new Set()); setTypeFilter(new Set()); setCompanyFilter(new Set())
    setCompanySearch(''); setTopicCat('All Categories'); setTopicSearch('')
  }
  const toggle = <T,>(set: Set<T>, v: T, apply: (s: Set<T>) => void) => {
    const next = new Set(set)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    apply(next)
  }

  const continueTitle = activePracticeSession && !activePracticeSession.isComplete
    ? problems.find((p) => p.id === activePracticeSession.questionIds[activePracticeSession.currentIndex])?.title || 'Current Problem'
    : null

  const handleLaunchCustom = () => {
    setIsCustomModalOpen(false)
    onStartCustomPractice({
      companyId: 'general', companyName: 'General Practice', role: 'Software Engineer', experience: '0–2 Years',
      topic: customTopic, difficulty: customDifficulty, source: 'all', questionCount: customCount, mode: customMode,
    })
  }

  const allTopicNames = useMemo(() => [...new Set(PROBLEMS.flatMap((p) => p.topics).filter((t) => t !== 'All'))].sort(), [])

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
      <header className="px-5 sm:px-8 py-3 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30 gap-4">
        <Link href="/workspace/playground" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group shrink-0">
          <ArrowLeft size={13} className="text-[#FF4D4D] group-hover:-translate-x-0.5 transition-transform" /> Playground Dashboard
        </Link>
        <div className="relative w-full max-w-[340px] hidden sm:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            value={headerQuery}
            onChange={(e) => setHeaderQuery(e.target.value)}
            placeholder="Search questions, topics, companies…"
            className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors"
          />
          {headerQuery && (
            <button onClick={() => setHeaderQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white"><X size={12} /></button>
          )}
          {headerResults.length > 0 && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setHeaderQuery('')} />
              <div className="absolute right-0 left-0 top-full mt-1.5 z-50 bg-[#141418] border border-white/[0.08] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-1 max-h-[320px] overflow-y-auto scrollbar-thin">
                {headerResults.map((p) => {
                  const c = difficultyColors[p.difficulty]
                  return (
                    <Link
                      key={p.id}
                      href={`/workspace/playground/solve?problem=${p.id}`}
                      onClick={() => setHeaderQuery('')}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
                    >
                      <span className="flex-1 text-[12px] text-[#D1D5DB] group-hover:text-white truncate">{p.title}</span>
                      {solvedIds.has(p.id) && <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />}
                      <span className="text-[8px] font-bold uppercase px-1 py-px rounded shrink-0" style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}>{p.difficulty}</span>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 w-full px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
        <div className="grid xl:grid-cols-[1fr_320px] gap-6">
          {/* ============ MAIN ============ */}
          <div className="min-w-0 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Directory</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5">Browse the full question catalogue — practice real interview questions by topic or company.</p>
            </div>

            {activePracticeSession && !activePracticeSession.isComplete && continueTitle && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#FF4D4D]/25 bg-gradient-to-br from-[#FF4D4D]/[0.08] to-transparent p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30">
                    <Zap size={10} /> Continue Practice
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5 truncate">{continueTitle}</h3>
                  <p className="text-[10px] font-mono text-[#8A8A8A] mt-0.5">
                    {activePracticeSession.companyName} · Question {activePracticeSession.currentIndex + 1} of {activePracticeSession.questionIds.length}
                  </p>
                </div>
                <button onClick={onContinuePractice} className="px-4 py-2 rounded-xl glass-raised glass-accent [--acc:#FF4D4D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0">
                  Continue <ArrowRight size={13} />
                </button>
              </motion.div>
            )}

            {/* ===== INTERVIEW TRACKS (scrollable) ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#FF4D4D]" /> Interview Tracks
                  </h2>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {ALL_TRACKS_STATS.questions} graded questions across {ALL_TRACKS_STATS.tracks} tracks — freshers through SDE III.
                  </p>
                </div>
                <button
                  onClick={() => setShowAllTracks((v) => !v)}
                  className="text-[11px] font-mono text-[#8A8A8A] hover:text-white flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  {showAllTracks ? 'Show Less' : 'View All'}
                  <ChevronDown size={12} className={`transition-transform ${showAllTracks ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <TrackGrid variant={showAllTracks ? 'grid' : 'strip'} />
            </div>

            {/* stat tiles (real) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={<FileText size={17} />} value={facts.total} label="Total Questions" />
              <StatTile icon={<Building2 size={17} />} value={facts.companies} label="Companies" />
              <StatTile icon={<Boxes size={17} />} value={facts.topics} label="Topics" />
              <StatTile icon={<CheckCircle2 size={17} />} value={solvedIds.size} label="Solved by You" />
            </div>

            {/* tabs */}
            <div className="flex items-center gap-1 border-b border-white/[0.06]">
              {(['topics', 'companies'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-semibold capitalize transition-colors relative cursor-pointer ${
                    tab === t ? 'text-white' : 'text-[#6B7280] hover:text-white'
                  }`}>
                  {t}
                  {tab === t && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#FF4D4D] rounded-full" />}
                </button>
              ))}
            </div>

            {tab === 'topics' && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Popular Topics
                      <span className="ml-2 text-[10px] font-mono text-[#6B7280]">
                        {filtered.length} of {facts.total} questions
                        {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Explore questions by data structure, algorithms, databases and system design.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                      <input value={topicSearch} onChange={(e) => setTopicSearch(e.target.value)} placeholder="Search topics…"
                        className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 w-40" />
                    </div>
                    <div className="relative">
                      <button onClick={() => setCatOpen((v) => !v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#D1D5DB] hover:text-white cursor-pointer min-w-[130px] justify-between">
                        {topicCat} <ChevronDown size={12} className={catOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                      </button>
                      {catOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                          <div className="absolute right-0 top-full mt-1 z-50 w-[160px] bg-[#141418] border border-white/[0.08] rounded-xl shadow-2xl p-1">
                            {facts.categories.map((c) => (
                              <button key={c} onClick={() => { setTopicCat(c); setCatOpen(false) }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                                  topicCat === c ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]' : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.05]'
                                }`}>
                                {c}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {topicRows.map((t) => {
                    const Icon = iconFor(t.topic)
                    return (
                      <button key={t.topic} onClick={() => openTopic(t.topic)}
                        className="group flex items-start gap-3 glass rounded-2xl p-3.5 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                        <span className="w-9 h-9 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D] shrink-0">
                          <Icon size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[12px] font-semibold text-white leading-tight">{t.topic}</span>
                          <div className="text-[9px] font-mono text-[#6B7280] mt-0.5">
                            {t.total} question{t.total > 1 ? 's' : ''}{t.solved > 0 && ` · ${t.solved} solved`}
                          </div>
                          {t.solved > 0 && (
                            <div className="mt-1.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                              <div className="h-full rounded-full bg-[#10B981]" style={{ width: `${t.ratio * 100}%` }} />
                            </div>
                          )}
                        </div>
                        <ArrowRight size={13} className="text-[#4B5563] group-hover:text-[#FF4D4D] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                      </button>
                    )
                  })}
                  {topicRows.length === 0 && (
                    <p className="col-span-full text-[11px] text-[#6B7280] py-8 text-center">
                      No questions tagged with the selected type yet — it&apos;s on the directory roadmap. Clear it to browse what&apos;s available.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h2 className="text-sm font-bold text-white">Top Companies</h2>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Practice company-wise questions and prepare for your interviews.</p>
                  </div>
                  <button onClick={() => setTab('companies')} className="text-[11px] font-mono text-[#8A8A8A] hover:text-white flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {companyRows.slice(0, 10).map((co) => (
                    <button key={co.name} onClick={() => openCompany(co.name)}
                      className="group flex items-center gap-2.5 glass rounded-2xl p-3 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                      <CompanyLogo company={co.name} size={30} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-white truncate">{co.name}</div>
                        <div className="text-[9px] font-mono text-[#6B7280]">{co.total} question{co.total > 1 ? 's' : ''}</div>
                      </div>
                      <ArrowRight size={12} className="text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-3 pt-2">
                  <button onClick={onStartTopicPractice} className="group glass rounded-2xl p-4 text-left hover:border-[#FF4D4D]/30 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D]"><Boxes size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Practice by Topic</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Topic-wise questions to build fundamentals.</p>
                  </button>
                  <button onClick={onStartCompanyInterviews} className="group glass rounded-2xl p-4 text-left hover:border-white/20 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white"><Building2 size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Company Interviews</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Real interview sets from top companies.</p>
                  </button>
                  <button onClick={() => setIsCustomModalOpen(true)} className="group glass rounded-2xl p-4 text-left hover:border-white/20 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white"><SlidersHorizontal size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Custom Practice</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Pick topic, difficulty, count and mode.</p>
                  </button>
                </div>
              </>
            )}

            {tab === 'companies' && (
              <div>
                <h2 className="text-sm font-bold text-white mb-3">All Companies <span className="text-[10px] font-mono text-[#6B7280]">({companyRows.length})</span></h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {companyRows.map((co) => (
                    <button key={co.name} onClick={() => openCompany(co.name)}
                      className="group flex items-center gap-3 glass rounded-2xl p-3.5 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                      <CompanyLogo company={co.name} size={34} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold text-white truncate">{co.name}</div>
                        <div className="text-[9px] font-mono text-[#6B7280]">
                          {co.total} question{co.total > 1 ? 's' : ''}{co.solved > 0 && ` · ${co.solved} solved`}
                        </div>
                      </div>
                      <ArrowRight size={13} className="text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============ RIGHT RAIL ============ */}
          <aside className="space-y-4 xl:sticky xl:top-[60px] self-start xl:max-h-[calc(100vh-76px)] xl:overflow-y-auto scrollbar-thin xl:pr-1">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={13} className="text-[#FF4D4D]" /> Your Practice Plan</h3>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A8A] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">Free Plan</span>
              </div>
              <p className="text-[11px] text-[#8A8A8A] leading-relaxed">Pick a session size, then start with your current filters applied.</p>

              <div className="mt-3">
                <label className="text-[10px] font-mono text-[#6B7280] uppercase">Session Size</label>
                <div className="relative mt-1">
                  <button onClick={() => setGoalOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[12px] text-white cursor-pointer">
                    {dailyGoal} questions <ChevronDown size={12} className={goalOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  {goalOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setGoalOpen(false)} />
                      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#141418] border border-white/[0.08] rounded-xl shadow-2xl p-1">
                        {GOAL_OPTIONS.map((g) => (
                          <button key={g} onClick={() => { setDailyGoal(g); setGoalOpen(false) }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                              dailyGoal === g ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]' : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.05]'
                            }`}>
                            {g} questions
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button onClick={startPracticing}
                className="mt-3 w-full py-2.5 rounded-xl glass-raised glass-accent [--acc:#FF4D4D] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-[0_8px_24px_-6px_rgba(255,77,77,0.5)]">
                Start Practicing <ArrowRight size={13} />
              </button>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><SlidersHorizontal size={13} className="text-[#FF4D4D]" /> Filters</h3>
                <button onClick={clearFilters} className={`text-[10px] font-mono transition-colors ${activeFilterCount ? 'text-[#FF4D4D] hover:text-[#E03A3A]' : 'text-[#4B5563]'}`} disabled={!activeFilterCount}>Clear All</button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Difficulty</div>
                  {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                    <CheckRow key={d} label={d} count={facts.diffCount[d]}
                      checked={diffFilter.has(d)} onToggle={() => toggle(diffFilter, d, setDiffFilter)} />
                  ))}
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Question Type</div>
                  <div className="max-h-[220px] overflow-y-auto scrollbar-thin -mr-1 pr-1">
                    {facts.typeRows.map((t) => (
                      <CheckRow key={t} label={t} count={facts.typeCount[t]} muted={facts.typeCount[t] === 0}
                        checked={typeFilter.has(t)} onToggle={() => toggle(typeFilter, t, setTypeFilter)} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Company</div>
                  <div className="relative mb-1.5">
                    <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} placeholder="Search companies…"
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40" />
                  </div>
                  {filterCompanies.map((c) => (
                    <CheckRow key={c.name} label={c.name} count={c.total}
                      checked={companyFilter.has(c.name)} onToggle={() => toggle(companyFilter, c.name, setCompanyFilter)} />
                  ))}
                  {!companySearch && companyRows.length > 6 && (
                    <button onClick={() => setShowMoreCompanies((v) => !v)} className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors">
                      {showMoreCompanies ? 'Show less' : `Show ${companyRows.length - 6} more`} <ChevronDown size={10} className={showMoreCompanies ? 'rotate-180' : ''} />
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={startPracticing}
                disabled={filtered.length === 0}
                className="mt-4 w-full py-2.5 rounded-xl border border-white/[0.1] hover:border-[#FF4D4D]/40 hover:bg-[#FF4D4D]/[0.05] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/[0.1] disabled:hover:bg-transparent">
                {filtered.length > 0 ? `Practice ${filtered.length} Filtered` : 'No questions match — clear a filter'}
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* CUSTOM PRACTICE MODAL */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={() => setIsCustomModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#121217] border border-white/[0.12] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-[#FF4D4D]" /><h3 className="text-sm font-bold text-white">Create Custom Practice</h3></div>
                <button onClick={() => setIsCustomModalOpen(false)} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer transition-colors"><X size={14} /></button>
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Topic</label>
                  <select value={customTopic} onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/50 cursor-pointer">
                    <option value="All Topics" className="bg-[#121217] text-white">All Topics</option>
                    {allTopicNames.map((t) => (
                      <option key={t} value={t} className="bg-[#121217] text-white">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Difficulty</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                      <button key={d} type="button" onClick={() => setCustomDifficulty(d)}
                        className={`py-1.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                          customDifficulty === d ? 'bg-[#FF4D4D] text-white border-[#FF4D4D]' : 'bg-white/[0.04] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                        }`}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Question Count</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20].map((cnt) => (
                      <button key={cnt} type="button" onClick={() => setCustomCount(cnt)}
                        className={`py-2 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer border ${
                          customCount === cnt ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]' : 'bg-white/[0.03] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                        }`}>{cnt} Questions</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setCustomMode('practice')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${customMode === 'practice' ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white' : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'}`}>
                      <div className="font-bold flex items-center justify-between"><span>🎯 Practice</span>{customMode === 'practice' && <Check size={12} className="text-[#FF4D4D]" />}</div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">Untimed, hints available.</p>
                    </button>
                    <button type="button" onClick={() => setCustomMode('interview')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${customMode === 'interview' ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white' : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'}`}>
                      <div className="font-bold flex items-center justify-between"><span>⏱ Timed</span>{customMode === 'interview' && <Check size={12} className="text-[#FF4D4D]" />}</div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">45m simulation.</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button type="button" onClick={() => setIsCustomModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={handleLaunchCustom} className="flex-1 px-4 py-2.5 rounded-lg glass-raised glass-accent [--acc:#FF4D4D] text-white font-bold text-xs shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5">
                  <Play size={13} fill="currentColor" /><span>Start Practice Session</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
