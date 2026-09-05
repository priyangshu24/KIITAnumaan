'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Search, X, Play, Check, ChevronDown,
  FileText, Building2, Boxes, Users, SlidersHorizontal,
  Grid3x3, Type, Link2, GitBranch, Share2, Repeat, Layers, Hash,
  Binary, ArrowUpDown, ArrowLeftRight, Gauge, Sigma, Zap, Network,
  Server, Database, BrainCircuit, ShieldCheck, ClipboardCheck,
  Cpu, Calculator, Puzzle, Sparkles, Workflow,
  type LucideIcon,
} from 'lucide-react'
import CompanyLogo from '@/components/shared/CompanyLogo'
import {
  Problem, PracticeSession, PracticeSessionConfig, PROBLEMS, type Difficulty,
} from '@/lib/playground-data'

interface PlaygroundLandingProps {
  solvedCount: number
  activePracticeSession: PracticeSession | null
  onStartTopicPractice: () => void
  onStartCompanyInterviews: () => void
  onStartCustomPractice: (config?: PracticeSessionConfig) => void
  onContinuePractice: () => void
  problems: Problem[]
}

// -- catalogue ----------------------------------------------------------

const CATEGORIES = ['All Categories', 'DSA', 'System Design', 'AI/ML', 'Databases', 'CS Core', 'Aptitude'] as const

interface TopicItem {
  name: string
  count: string
  cat: Exclude<(typeof CATEGORIES)[number], 'All Categories'>
  icon: LucideIcon
  key?: string
  hot?: boolean
}

const TOPICS: TopicItem[] = [
  { name: 'Arrays', count: '1,240', cat: 'DSA', icon: Grid3x3, key: 'Arrays' },
  { name: 'Strings', count: '980', cat: 'DSA', icon: Type, key: 'Strings' },
  { name: 'Linked Lists', count: '720', cat: 'DSA', icon: Link2, key: 'Linked Lists' },
  { name: 'Trees', count: '860', cat: 'DSA', icon: GitBranch, key: 'Trees' },
  { name: 'Graphs', count: '670', cat: 'DSA', icon: Share2, key: 'Graphs' },
  { name: 'Dynamic Programming', count: '1,120', cat: 'DSA', icon: Boxes, key: 'Dynamic Programming', hot: true },
  { name: 'Recursion & Backtracking', count: '640', cat: 'DSA', icon: Repeat, key: 'Recursion & Backtracking' },
  { name: 'Stack & Queue', count: '540', cat: 'DSA', icon: Layers, key: 'Stacks & Queues' },
  { name: 'Hashing', count: '520', cat: 'DSA', icon: Hash, key: 'Hashing' },
  { name: 'Binary Search', count: '430', cat: 'DSA', icon: Search, key: 'Binary Search' },
  { name: 'Sorting', count: '620', cat: 'DSA', icon: ArrowUpDown, key: 'Math' },
  { name: 'Two Pointers', count: '410', cat: 'DSA', icon: ArrowLeftRight, key: 'Two Pointers' },
  { name: 'Sliding Window', count: '380', cat: 'DSA', icon: Gauge, key: 'Sliding Window' },
  { name: 'Greedy', count: '320', cat: 'DSA', icon: Zap, key: 'Greedy' },
  { name: 'Maths', count: '450', cat: 'DSA', icon: Sigma, key: 'Math' },
  { name: 'Bit Manipulation', count: '360', cat: 'DSA', icon: Binary, key: 'Bit Manipulation' },

  { name: 'System Design', count: '520', cat: 'System Design', icon: Network, key: 'Design' },
  { name: 'Scalability & Load Balancing', count: '260', cat: 'System Design', icon: Server },
  { name: 'Caching & CDNs', count: '190', cat: 'System Design', icon: Database },
  { name: 'Message Queues & Streaming', count: '150', cat: 'System Design', icon: Workflow },

  { name: 'LLM Fine-tuning', count: '150', cat: 'AI/ML', icon: BrainCircuit, hot: true },
  { name: 'LLM Evaluation', count: '120', cat: 'AI/ML', icon: ClipboardCheck },
  { name: 'Guardrails & Safety', count: '80', cat: 'AI/ML', icon: ShieldCheck },
  { name: 'RAG & Vector Search', count: '110', cat: 'AI/ML', icon: Database },
  { name: 'Prompt Engineering', count: '95', cat: 'AI/ML', icon: Sparkles },

  { name: 'Databases (SQL)', count: '1,080', cat: 'Databases', icon: Database, key: 'SQL' },
  { name: 'SQL Joins & Subqueries', count: '420', cat: 'Databases', icon: Database, key: 'SQL' },
  { name: 'Indexing & Optimization', count: '180', cat: 'Databases', icon: Gauge },
  { name: 'NoSQL & Data Modeling', count: '140', cat: 'Databases', icon: Boxes },

  { name: 'Operating Systems', count: '340', cat: 'CS Core', icon: Cpu },
  { name: 'Computer Networks', count: '280', cat: 'CS Core', icon: Network },
  { name: 'DBMS Concepts', count: '310', cat: 'CS Core', icon: Database },
  { name: 'OOP & Design Patterns', count: '250', cat: 'CS Core', icon: Boxes },

  { name: 'Quantitative Aptitude', count: '260', cat: 'Aptitude', icon: Calculator },
  { name: 'Logical Reasoning', count: '220', cat: 'Aptitude', icon: Puzzle },
  { name: 'Verbal Ability', count: '180', cat: 'Aptitude', icon: Type },
]

const COMPANIES = [
  { name: 'Amazon', count: '1,240' }, { name: 'Microsoft', count: '980' },
  { name: 'Google', count: '860' }, { name: 'Meta', count: '620' },
  { name: 'Netflix', count: '420' }, { name: 'Apple', count: '380' },
  { name: 'Uber', count: '340' }, { name: 'Amazon Web Services', count: '320' },
  { name: 'Adobe', count: '260' }, { name: 'Flipkart', count: '260' },
  { name: 'HighRadius', count: '210' }, { name: 'Deloitte', count: '190' },
]

const DIFFICULTY_ROWS: { d: Difficulty; count: string }[] = [
  { d: 'Easy', count: '4,320' }, { d: 'Medium', count: '5,600' }, { d: 'Hard', count: '2,560' },
]
const TYPE_ROWS = [
  { t: 'Multiple Choice', count: '1,240' }, { t: 'Coding', count: '9,120' },
  { t: 'SQL', count: '1,080' }, { t: 'System Design', count: '520' }, { t: 'Conceptual', count: '540' },
]
const GOAL_OPTIONS = [3, 5, 10, 15, 20]

// -- pieces -----------------------------------------------------------

function StatTile({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D] shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-lg font-bold text-white leading-none">{value}</div>
        <div className="text-[10px] font-mono text-[#6B7280] mt-1">{label}</div>
      </div>
    </div>
  )
}

function CheckRow({ label, count, checked, onToggle }: {
  label: string; count: string; checked: boolean; onToggle: () => void
}) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-2.5 py-1.5 group cursor-pointer">
      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-[#FF4D4D] border-[#FF4D4D]' : 'border-white/20 group-hover:border-white/40'
      }`}>
        {checked && <Check size={11} className="text-white" />}
      </span>
      <span className="flex-1 text-left text-[12px] text-[#D1D5DB] group-hover:text-white transition-colors">{label}</span>
      <span className="text-[10px] font-mono text-[#4B5563]">{count}</span>
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
  const [topicCat, setTopicCat] = useState<(typeof CATEGORIES)[number]>('All Categories')
  const [catOpen, setCatOpen] = useState(false)

  const [dailyGoal, setDailyGoal] = useState(5)
  const [goalOpen, setGoalOpen] = useState(false)
  const [diffFilter, setDiffFilter] = useState<Set<Difficulty>>(new Set())
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set())
  const [companyFilter, setCompanyFilter] = useState<Set<string>>(new Set())
  const [companySearch, setCompanySearch] = useState('')
  const [showMoreCompanies, setShowMoreCompanies] = useState(false)

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [customTopic, setCustomTopic] = useState('All Topics')
  const [customDifficulty, setCustomDifficulty] = useState<'All' | Difficulty>('All')
  const [customCount, setCustomCount] = useState(10)
  const [customMode, setCustomMode] = useState<'practice' | 'interview'>('practice')

  // catalogue stats (real)
  const catStats = useMemo(() => {
    const comp = new Set<string>()
    const top = new Set<string>()
    PROBLEMS.forEach((p) => { p.companies.forEach((c) => comp.add(c)); p.topics.forEach((t) => { if (t !== 'All') top.add(t) }) })
    return { questions: PROBLEMS.length, companies: comp.size, topics: top.size }
  }, [])

  const shownTopics = useMemo(() => {
    const q = topicSearch.trim().toLowerCase()
    return TOPICS.filter((t) => {
      if (topicCat !== 'All Categories' && t.cat !== topicCat) return false
      if (q && !t.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [topicSearch, topicCat])

  const shownCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase()
    const list = q ? COMPANIES.filter((c) => c.name.toLowerCase().includes(q)) : COMPANIES
    return showMoreCompanies ? list : list.slice(0, 6)
  }, [companySearch, showMoreCompanies])

  const buildConfig = (extra?: Partial<PracticeSessionConfig>): PracticeSessionConfig => {
    const difficulty: 'All' | Difficulty = diffFilter.size === 1 ? [...diffFilter][0] : 'All'
    const companyName = companyFilter.size ? [...companyFilter].join(', ') : 'General Practice'
    return {
      companyId: 'general', companyName, role: 'Software Engineer', experience: '0–2 Years',
      topic: 'All Topics', difficulty, source: 'curated', questionCount: dailyGoal, mode: 'practice',
      ...extra,
    }
  }

  const startPracticing = () => onStartCustomPractice(buildConfig())

  const openTopic = (t: TopicItem) => {
    if (t.key) onStartCustomPractice(buildConfig({ topic: t.key, companyName: `${t.name} Practice` }))
    else onStartTopicPractice()
  }

  const clearFilters = () => {
    setDiffFilter(new Set()); setTypeFilter(new Set()); setCompanyFilter(new Set()); setCompanySearch('')
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
      topic: customTopic, difficulty: customDifficulty, source: 'curated', questionCount: customCount, mode: customMode,
    })
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
      <header className="px-5 sm:px-8 py-3 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
        <Link href="/workspace/playground" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group">
          <ArrowLeft size={13} className="text-[#FF4D4D] group-hover:-translate-x-0.5 transition-transform" /> Playground Dashboard
        </Link>
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input placeholder="Search questions, topics…" className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors w-48 focus:w-64" />
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-6 sm:py-8">
        <div className="grid xl:grid-cols-[1fr_300px] gap-6">
          {/* ============ MAIN ============ */}
          <div className="min-w-0 space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Directory</h1>
              <p className="text-sm text-[#9CA3AF] mt-1.5">Browse the full question catalogue — practice real interview questions by topic or company.</p>
            </div>

            {/* continue banner */}
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
                <button onClick={onContinuePractice} className="px-4 py-2 rounded-xl bg-[#FF4D4D] hover:bg-[#E03A3A] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0">
                  Continue <ArrowRight size={13} />
                </button>
              </motion.div>
            )}

            {/* stat tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={<FileText size={17} />} value={catStats.questions.toLocaleString()} label="Total Questions" />
              <StatTile icon={<Building2 size={17} />} value={`${catStats.companies}+`} label="Companies" />
              <StatTile icon={<Boxes size={17} />} value={`${catStats.topics}+`} label="Topics" />
              <StatTile icon={<Users size={17} />} value="14" label="Languages" />
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
                {/* popular topics header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-white">Popular Topics</h2>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Explore questions by data structure, algorithms, databases, system design and more.</p>
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
                          <div className="absolute right-0 top-full mt-1 z-50 w-[150px] bg-[#141418] border border-white/[0.08] rounded-xl shadow-2xl p-1">
                            {CATEGORIES.map((c) => (
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

                {/* topic grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {shownTopics.map((t) => {
                    const Icon = t.icon
                    return (
                      <button key={t.name} onClick={() => openTopic(t)}
                        className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-3.5 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                        <span className="w-9 h-9 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D] shrink-0">
                          <Icon size={16} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-semibold text-white leading-tight">{t.name}</span>
                            {t.hot && <span className="text-[7px] font-bold uppercase tracking-wider text-[#FF4D4D] bg-[#FF4D4D]/10 border border-[#FF4D4D]/25 px-1 py-px rounded shrink-0">Hot</span>}
                          </div>
                          <div className="text-[9px] font-mono text-[#6B7280] mt-0.5">{t.count} questions</div>
                        </div>
                        <ArrowRight size={13} className="text-[#4B5563] group-hover:text-[#FF4D4D] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    )
                  })}
                  {shownTopics.length === 0 && (
                    <p className="col-span-full text-[11px] text-[#6B7280] py-6 text-center">No topics match your search.</p>
                  )}
                </div>

                {/* top companies */}
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
                  {COMPANIES.slice(0, 10).map((co) => (
                    <button key={co.name} onClick={onStartCompanyInterviews}
                      className="group flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-3 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                      <CompanyLogo company={co.name} size={30} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-white truncate">{co.name}</div>
                        <div className="text-[9px] font-mono text-[#6B7280]">{co.count} questions</div>
                      </div>
                      <ArrowRight size={12} className="text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>

                {/* 3 modes */}
                <div className="grid md:grid-cols-3 gap-3 pt-2">
                  <button onClick={onStartTopicPractice} className="group rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 text-left hover:border-[#FF4D4D]/30 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center text-[#FF4D4D]"><Boxes size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Practice by Topic</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Topic-wise questions to build fundamentals.</p>
                  </button>
                  <button onClick={onStartCompanyInterviews} className="group rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 text-left hover:border-white/20 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white"><Building2 size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Company Interviews</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Real interview sets from top companies.</p>
                  </button>
                  <button onClick={() => setIsCustomModalOpen(true)} className="group rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 text-left hover:border-white/20 transition-all cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white"><SlidersHorizontal size={16} /></span>
                    <h3 className="text-[12px] font-bold text-white mt-2.5">Custom Practice</h3>
                    <p className="text-[10px] text-[#8A8A8A] mt-1">Pick topic, difficulty, count and mode.</p>
                  </button>
                </div>
              </>
            )}

            {tab === 'companies' && (
              <div>
                <h2 className="text-sm font-bold text-white mb-3">All Companies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {COMPANIES.map((co) => (
                    <button key={co.name} onClick={onStartCompanyInterviews}
                      className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-3.5 hover:border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.03] transition-all text-left cursor-pointer">
                      <CompanyLogo company={co.name} size={34} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold text-white truncate">{co.name}</div>
                        <div className="text-[9px] font-mono text-[#6B7280]">{co.count} questions</div>
                      </div>
                      <ArrowRight size={13} className="text-[#4B5563] group-hover:text-[#FF4D4D] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============ RIGHT RAIL ============ */}
          <aside className="space-y-4 xl:sticky xl:top-4 self-start">
            {/* practice plan */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Sparkles size={13} className="text-[#FF4D4D]" /> Your Practice Plan</h3>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A8A8A] bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">Free Plan</span>
              </div>
              <p className="text-[11px] text-[#8A8A8A] leading-relaxed">Set your goal and track your progress.</p>

              <div className="mt-3">
                <label className="text-[10px] font-mono text-[#6B7280] uppercase">Daily Goal</label>
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
                className="mt-3 w-full py-2.5 rounded-xl bg-[#FF4D4D] hover:bg-[#E03A3A] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-[0_8px_24px_-6px_rgba(255,77,77,0.5)]">
                Start Practicing <ArrowRight size={13} />
              </button>
            </div>

            {/* filters */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><SlidersHorizontal size={13} className="text-[#FF4D4D]" /> Filters</h3>
                <button onClick={clearFilters} className="text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors">Clear All</button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Difficulty</div>
                  {DIFFICULTY_ROWS.map((r) => (
                    <CheckRow key={r.d} label={r.d} count={r.count}
                      checked={diffFilter.has(r.d)} onToggle={() => toggle(diffFilter, r.d, setDiffFilter)} />
                  ))}
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Question Type</div>
                  {TYPE_ROWS.map((r) => (
                    <CheckRow key={r.t} label={r.t} count={r.count}
                      checked={typeFilter.has(r.t)} onToggle={() => toggle(typeFilter, r.t, setTypeFilter)} />
                  ))}
                </div>

                <div>
                  <div className="text-[10px] font-mono text-[#6B7280] uppercase mb-1">Company</div>
                  <div className="relative mb-1.5">
                    <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                    <input value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} placeholder="Search companies…"
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40" />
                  </div>
                  {shownCompanies.map((c) => (
                    <CheckRow key={c.name} label={c.name} count={c.count}
                      checked={companyFilter.has(c.name)} onToggle={() => toggle(companyFilter, c.name, setCompanyFilter)} />
                  ))}
                  {!companySearch && COMPANIES.length > 6 && (
                    <button onClick={() => setShowMoreCompanies((v) => !v)} className="mt-1 flex items-center gap-1 text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors">
                      {showMoreCompanies ? 'Show less' : 'Show more'} <ChevronDown size={10} className={showMoreCompanies ? 'rotate-180' : ''} />
                    </button>
                  )}
                </div>
              </div>

              <button onClick={startPracticing}
                className="mt-4 w-full py-2.5 rounded-xl border border-white/[0.1] hover:border-[#FF4D4D]/40 hover:bg-[#FF4D4D]/[0.05] text-white text-xs font-semibold transition-all">
                Apply Filters
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
                    {['All Topics', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Sliding Window', 'Recursion & Backtracking', 'SQL'].map((t) => (
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
                <button type="button" onClick={handleLaunchCustom} className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E03A3A] text-white font-bold text-xs shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5">
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
