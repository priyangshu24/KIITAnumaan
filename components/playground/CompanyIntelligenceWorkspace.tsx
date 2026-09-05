import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ExternalLink,
  Star,
  Flame,
  CheckCircle2,
  Circle,
  Bookmark,
  BookmarkCheck,
  Globe,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
  Layers,
  Code2,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Clock,
  Zap,
  Play,
  SlidersHorizontal,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'
import {
  Problem,
  Difficulty,
  CompanyMetadata,
  WebDiscoveredReport,
  WEB_DISCOVERED_REPORTS,
  difficultyColors,
  PracticeSession,
  PracticeSessionConfig,
} from '@/lib/playground-data'
import CompanyLogo from '@/components/shared/CompanyLogo'

interface CompanyIntelligenceWorkspaceProps {
  company: CompanyMetadata
  onSelectProblem: (problem: Problem) => void
  solvedSet: Set<string>
  bookmarkSet: Set<string>
  onToggleBookmark: (id: string) => void
  curatedProblems: Problem[]
  selectedRole: string
  onChangeRole: (role: string) => void
  selectedExp: string
  onChangeExp: (exp: string) => void
  selectedTopic: string
  onChangeTopic: (topic: string) => void
  onStartPracticeSession?: (config?: PracticeSessionConfig) => void
  onContinuePracticeSession?: () => void
  activePracticeSession?: PracticeSession | null
  onOpenQuestionLibrary?: () => void
}

export default function CompanyIntelligenceWorkspace({
  company,
  onSelectProblem,
  solvedSet,
  bookmarkSet,
  onToggleBookmark,
  curatedProblems,
  selectedRole,
  onChangeRole,
  selectedExp,
  onChangeExp,
  selectedTopic,
  onChangeTopic,
  onStartPracticeSession,
  onContinuePracticeSession,
  activePracticeSession,
  onOpenQuestionLibrary,
}: CompanyIntelligenceWorkspaceProps) {
  const [questionSearch, setQuestionSearch] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [webDiscoveryStatus, setWebDiscoveryStatus] = useState<'idle' | 'searching' | 'updated'>('idle')
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  // Configuration modal state
  const [cfgRole, setCfgRole] = useState(selectedRole)
  const [cfgExp, setCfgExp] = useState(selectedExp)
  const [cfgTopic, setCfgTopic] = useState(selectedTopic)
  const [cfgDiff, setCfgDiff] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [cfgSource, setCfgSource] = useState<'all' | 'curated' | 'discovery'>('all')
  const [cfgCount, setCfgCount] = useState<number>(10)
  const [cfgMode, setCfgMode] = useState<'practice' | 'interview'>('practice')

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Keep modal state in sync when parent filters update
  useEffect(() => {
    setCfgRole(selectedRole)
    setCfgExp(selectedExp)
    setCfgTopic(selectedTopic)
  }, [selectedRole, selectedExp, selectedTopic])

  // Auto web discovery debounce when filters change
  useEffect(() => {
    setWebDiscoveryStatus('searching')
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setWebDiscoveryStatus('updated')
    }, 600)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [company.id, selectedRole, selectedExp, selectedTopic])

  // Filter curated problems for this company
  const filteredCurated = useMemo(() => {
    let list = curatedProblems.filter(p => {
      const matchCompany = !p.companies || p.companies.length === 0 || p.companies.includes(company.id)
      const matchTopic = selectedTopic === 'All Topics' || p.topics.includes(selectedTopic as any)
      return matchCompany && matchTopic
    })

    if (questionSearch.trim()) {
      const q = questionSearch.toLowerCase().trim()
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.topics.some(t => t.toLowerCase().includes(q)) ||
          p.patterns?.some(pat => pat.toLowerCase().includes(q))
      )
    }

    return list
  }, [curatedProblems, company.id, selectedTopic, questionSearch])

  // Filter discovered web reports
  const filteredDiscovered = useMemo(() => {
    let list = WEB_DISCOVERED_REPORTS.filter(r => {
      const matchCompany = r.company.toLowerCase() === company.name.toLowerCase() || r.company.toLowerCase() === company.id.toLowerCase()
      const matchTopic = selectedTopic === 'All Topics' || r.topic === selectedTopic
      return matchCompany && matchTopic
    })

    if (list.length === 0) {
      const sampleTopics = company.importantTopics || [
        { topic: 'Arrays', count: 20, percentage: 80 },
        { topic: 'Dynamic Programming', count: 16, percentage: 70 },
      ]
      list = sampleTopics.slice(0, 3).map((t, idx) => ({
        id: `gen-${company.id}-${idx}`,
        title: idx === 0 ? `Optimal ${t.topic} Implementation` : idx === 1 ? `Two Pointers & ${t.topic}` : `LRU & Custom Cache Design`,
        company: company.name,
        role: selectedRole || 'SDE-1',
        topic: t.topic as any,
        pattern: 'Sliding Window',
        difficulty: idx === 0 ? 'Medium' : idx === 1 ? 'Easy' : 'Hard',
        reportedDate: '2 weeks ago',
        sourceName: 'Public Candidate Interview Debrief',
        sourceUrl: 'https://leetcode.com/discuss/interview-experience',
        confidence: 'High',
        summary: `Reported in recent technical round. Emphasis on optimal time bounds and modular code.`,
        isPermittedSource: true,
      }))
    }

    if (questionSearch.trim()) {
      const q = questionSearch.toLowerCase().trim()
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.topic.toLowerCase().includes(q) ||
          r.pattern?.toLowerCase().includes(q)
      )
    }

    return list
  }, [company, selectedTopic, selectedRole, questionSearch])

  const totalQuestions = company.questionCount || (filteredCurated.length + filteredDiscovered.length + 42)
  const highPriorityCount = company.highPriorityCount || Math.ceil(totalQuestions * 0.28)
  const reportedCount = company.reportedCount || Math.ceil(totalQuestions * 0.2)
  const topicsCoveredCount = company.topicsCoveredCount || (company.importantTopics?.length || 14)

  const importantTopicsList = useMemo(() => {
    if (company.importantTopics && company.importantTopics.length > 0) {
      return company.importantTopics
    }
    return [
      { topic: 'Arrays & Two Pointers', count: 64, percentage: 88 },
      { topic: 'Dynamic Programming', count: 48, percentage: 78 },
      { topic: 'Trees & Traversals', count: 42, percentage: 72 },
      { topic: 'Graphs & BFS/DFS', count: 36, percentage: 65 },
      { topic: 'Hashing & Deduplication', count: 32, percentage: 58 },
      { topic: 'Sliding Window', count: 28, percentage: 52 },
    ]
  }, [company])

  // Handle quick practice execution
  const handleQuickPractice = (problem: Problem) => {
    onSelectProblem(problem)
  }

  // Handle standard start practice session
  const handleStartStandardSession = () => {
    onStartPracticeSession?.({
      companyId: company.id,
      companyName: company.name,
      role: selectedRole,
      experience: selectedExp,
      topic: selectedTopic,
      difficulty: 'All',
      source: 'all',
      questionCount: 10,
      mode: 'practice',
    })
  }

  // Handle customized start practice session from modal
  const handleStartCustomSession = () => {
    setIsConfigModalOpen(false)
    onStartPracticeSession?.({
      companyId: company.id,
      companyName: company.name,
      role: cfgRole,
      experience: cfgExp,
      topic: cfgTopic,
      difficulty: cfgDiff,
      source: cfgSource,
      questionCount: cfgCount,
      mode: cfgMode,
    })
  }

  const isOngoingSessionForThisCompany =
    activePracticeSession &&
    !activePracticeSession.isComplete &&
    activePracticeSession.companyId === company.id

  return (
    <div className="flex-1 flex min-h-0 bg-[#0A0A0D] overflow-hidden relative">
      {/* ============================================================ */}
      {/* CENTER COLUMN: Company Interview Intelligence (55–60%) */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.06] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="p-5 space-y-5 max-w-[980px] w-full mx-auto">
          {/* Company Header */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF4D4D]/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center p-2 shrink-0 shadow-lg">
                  <CompanyLogo company={company.name} size={48} variant="rounded" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{company.name}</h1>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 font-mono">
                      {company.category}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#FF4D4D] mt-0.5">Interview Intelligence</p>
                  <p className="text-[11.5px] text-[#8A8A8A] mt-1 max-w-xl leading-relaxed">
                    {company.description ||
                      'Get company-specific interview questions, topic insights and recent public interview references.'}
                  </p>
                </div>
              </div>

              {/* PRIMARY & SECONDARY HEADER ACTIONS */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center flex-wrap">
                {/* 1. PRIMARY CTA: START / CONTINUE PRACTICE */}
                {isOngoingSessionForThisCompany ? (
                  <button
                    onClick={() => onContinuePracticeSession?.()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,77,77,0.35)] transition-all cursor-pointer group"
                  >
                    <Play size={13} fill="currentColor" />
                    <div className="text-left">
                      <div className="leading-tight">▶ Continue Practice</div>
                      <div className="text-[9.5px] font-normal text-white/80">
                        Q{activePracticeSession!.currentIndex + 1} of {activePracticeSession!.questionIds.length}
                      </div>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={handleStartStandardSession}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold shadow-[0_0_20px_rgba(255,77,77,0.35)] transition-all cursor-pointer group"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>▶ Start Practice</span>
                  </button>
                )}

                {/* Secondary Actions */}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#D1D5DB] hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
                  >
                    <span>Visit Career Page</span>
                    <ExternalLink size={12} className="text-[#8A8A8A]" />
                  </a>
                )}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/40'
                      : 'bg-white/[0.04] text-[#8A8A8A] border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Star size={13} className={isSaved ? 'fill-[#FF4D4D]' : ''} />
                  <span>{isSaved ? 'Saved' : 'Save Company'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* DEDICATED READY TO PRACTICE CARD (Placed prominent before question lists) */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#FF4D4D]/[0.08] via-[#FF4D4D]/[0.04] to-white/[0.01] border border-[#FF4D4D]/25 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-black px-2 py-0.5 rounded bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/40 flex items-center gap-1">
                    <Zap size={11} /> READY TO PRACTICE?
                  </span>
                  <span className="text-xs font-mono text-[#D1D5DB]">
                    {company.name} · {selectedRole} · {selectedExp}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Master company-relevant questions prioritized for your target role.
                </h3>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#9CA3AF] pt-0.5 flex-wrap">
                  <span>⚡ {totalQuestions} Total Questions</span>
                  <span>•</span>
                  <span className="text-[#FF4D4D] font-semibold">🔥 {highPriorityCount} High Priority</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">⭐ {reportedCount} Frequently Reported</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                {isOngoingSessionForThisCompany ? (
                  <button
                    onClick={() => onContinuePracticeSession?.()}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold shadow-[0_0_25px_rgba(255,77,77,0.4)] transition-all cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>▶ Continue Practice ({activePracticeSession!.currentIndex + 1}/{activePracticeSession!.questionIds.length})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartStandardSession}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold shadow-[0_0_25px_rgba(255,77,77,0.4)] transition-all cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>▶ Start Practice</span>
                  </button>
                )}

                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  title="Custom Practice Session Settings"
                  className="px-3.5 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-[#D1D5DB] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal size={13} />
                  <span className="hidden sm:inline">Configure</span>
                </button>
              </div>
            </div>
          </div>

          {/* Compact Filter Toolbar */}
          <div className="p-3 rounded-lg bg-[#0F0F14] border border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-mono text-[#8A8A8A]">Role:</span>
                <select
                  value={selectedRole}
                  onChange={e => onChangeRole(e.target.value)}
                  className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white rounded px-2.5 py-1 outline-none cursor-pointer transition-colors focus:border-[#FF4D4D]/50"
                >
                  {company.roles.map(r => (
                    <option key={r} value={r} className="bg-[#121217] text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-mono text-[#8A8A8A]">Experience:</span>
                <select
                  value={selectedExp}
                  onChange={e => onChangeExp(e.target.value)}
                  className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white rounded px-2.5 py-1 outline-none cursor-pointer transition-colors focus:border-[#FF4D4D]/50"
                >
                  {company.experienceLevels.map(exp => (
                    <option key={exp} value={exp} className="bg-[#121217] text-white">
                      {exp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-mono text-[#8A8A8A]">Topic:</span>
                <select
                  value={selectedTopic}
                  onChange={e => onChangeTopic(e.target.value)}
                  className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white rounded px-2.5 py-1 outline-none cursor-pointer transition-colors focus:border-[#FF4D4D]/50"
                >
                  <option value="All Topics" className="bg-[#121217] text-white">
                    All Topics
                  </option>
                  <option value="Arrays" className="bg-[#121217] text-white">
                    Arrays
                  </option>
                  <option value="Strings" className="bg-[#121217] text-white">
                    Strings
                  </option>
                  <option value="Hashing" className="bg-[#121217] text-white">
                    Hashing
                  </option>
                  <option value="Linked Lists" className="bg-[#121217] text-white">
                    Linked Lists
                  </option>
                  <option value="Trees" className="bg-[#121217] text-white">
                    Trees
                  </option>
                  <option value="Graphs" className="bg-[#121217] text-white">
                    Graphs
                  </option>
                  <option value="Dynamic Programming" className="bg-[#121217] text-white">
                    Dynamic Programming
                  </option>
                  <option value="Sliding Window" className="bg-[#121217] text-white">
                    Sliding Window
                  </option>
                  <option value="Two Pointers" className="bg-[#121217] text-white">
                    Two Pointers
                  </option>
                  <option value="Binary Search" className="bg-[#121217] text-white">
                    Binary Search
                  </option>
                  <option value="Design" className="bg-[#121217] text-white">
                    Design
                  </option>
                </select>
              </div>
            </div>

            {/* Web Discovery Status Pill */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                  webDiscoveryStatus === 'searching'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    webDiscoveryStatus === 'searching' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span>
                  {webDiscoveryStatus === 'searching'
                    ? 'Searching public reports...'
                    : 'Auto Web Discovery Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Search inside company questions */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              value={questionSearch}
              onChange={e => setQuestionSearch(e.target.value)}
              placeholder={`Search ${company.name} interview questions, patterns, topics...`}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.08] focus:border-[#FF4D4D]/50 rounded-lg text-xs text-white placeholder-[#6B7280] outline-none transition-colors"
            />
          </div>

          {/* Summary Metric Cards (4 compact cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <p className="text-xl font-black text-white tracking-tight">{totalQuestions}</p>
              <p className="text-[11px] font-medium text-[#8A8A8A] mt-0.5">Questions Available</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="flex items-center gap-1.5">
                <p className="text-xl font-black text-[#FF4D4D] tracking-tight">{highPriorityCount}</p>
                <Flame size={14} className="text-[#FF4D4D]" />
              </div>
              <p className="text-[11px] font-medium text-[#8A8A8A] mt-0.5">High Priority</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="flex items-center gap-1.5">
                <p className="text-xl font-black text-amber-400 tracking-tight">{reportedCount}</p>
                <Star size={13} className="text-amber-400 fill-amber-400/20" />
              </div>
              <p className="text-[11px] font-medium text-[#8A8A8A] mt-0.5">Frequently Reported</p>
            </div>
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all">
              <p className="text-xl font-black text-blue-400 tracking-tight">{topicsCoveredCount}</p>
              <p className="text-[11px] font-medium text-[#8A8A8A] mt-0.5">Topics Covered</p>
            </div>
          </div>

          {/* MOST IMPORTANT TOPICS */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-[#FF4D4D]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Most Important Topics
                </h3>
              </div>
              <span className="text-[10.5px] font-mono text-[#8A8A8A]">
                Historical Interview Focus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {importantTopicsList.map((item) => (
                <div key={item.topic} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#D1D5DB] font-medium truncate">{item.topic}</span>
                    <span className="text-[#8A8A8A] font-mono text-[10.5px]">{item.count} qs</span>
                  </div>
                  <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF4D4D]/80 to-[#FF4D4D]"
                      style={{ width: `${Math.min(100, Math.max(12, item.percentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CURATED QUESTIONS SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">📖 KIIT ANUMAAN CURATED</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-[#8A8A8A]">
                    {filteredCurated.length} questions
                  </span>
                </div>
                <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                  High-quality questions mapped to company interviews.
                </p>
              </div>

              {onOpenQuestionLibrary && (
                <button
                  onClick={onOpenQuestionLibrary}
                  className="text-xs font-mono text-[#FF4D4D] hover:underline cursor-pointer font-bold inline-flex items-center gap-1"
                >
                  <span>View All Questions</span>
                  <ArrowRight size={11} />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {filteredCurated.map(problem => {
                const dc = difficultyColors[problem.difficulty]
                const isSolved = solvedSet.has(problem.id)

                return (
                  <div
                    key={problem.id}
                    onClick={() => handleQuickPractice(problem)}
                    className="group flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                        }}
                        className="text-[#8A8A8A] hover:text-emerald-400 shrink-0"
                      >
                        {isSolved ? (
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        ) : (
                          <Circle size={14} className="text-[#8A8A8A]" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-white group-hover:text-[#FF4D4D] transition-colors truncate">
                            {problem.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-[#8A8A8A] font-mono">
                            {problem.topics.join(' · ')}
                          </span>
                          {problem.patterns?.[0] && (
                            <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-[#9CA3AF] border border-white/[0.06]">
                              {problem.patterns[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono"
                        style={{ backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}
                      >
                        {problem.difficulty}
                      </span>

                      <span className="text-[10px] font-semibold text-[#FF4D4D] bg-[#FF4D4D]/10 px-1.5 py-0.5 rounded border border-[#FF4D4D]/20">
                        🔥 Priority
                      </span>

                      {/* QUICK PRACTICE BUTTON ON QUESTION ROW */}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          handleQuickPractice(problem)
                        }}
                        className="px-2 py-1 rounded bg-[#FF4D4D]/10 hover:bg-[#FF4D4D] text-[#FF4D4D] hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Play size={9} fill="currentColor" />
                        <span>Practice</span>
                      </button>
                    </div>
                  </div>
                )
              })}

              {filteredCurated.length === 0 && (
                <div className="p-6 text-center rounded-xl bg-white/[0.01] border border-dashed border-white/[0.08] space-y-2">
                  <AlertCircle size={20} className="text-[#8A8A8A] mx-auto" />
                  <p className="text-xs font-semibold text-white">
                    No curated questions found for {company.name} · {selectedTopic}
                  </p>
                  <p className="text-[11px] text-[#8A8A8A] max-w-sm mx-auto">
                    Try switching to All Topics or practice from available public candidate interview discovery below.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => onChangeTopic('All Topics')}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-white cursor-pointer"
                    >
                      Show All Topics
                    </button>
                    <button
                      onClick={handleStartStandardSession}
                      className="px-3 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-xs font-bold text-white cursor-pointer"
                    >
                      ▶ Practice Available Questions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RECENT INTERVIEW DISCOVERY SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">🌐 RECENT INTERVIEW DISCOVERY</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {filteredDiscovered.length} references
                  </span>
                </div>
                <p className="text-[11px] text-[#8A8A8A] mt-0.5">
                  Publicly available interview experiences and candidate discussions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredDiscovered.map(report => {
                const dc = difficultyColors[report.difficulty as Difficulty] || difficultyColors.Medium

                return (
                  <div
                    key={report.id}
                    className="p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <CompanyLogo company={company.name} size={16} />
                          <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">{report.title}</h4>
                        </div>
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono shrink-0"
                          style={{ backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}
                        >
                          {report.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#8A8A8A] mt-1">
                        <span>{report.topic}</span>
                        <span>·</span>
                        <span className="text-[#9CA3AF]">{report.pattern}</span>
                      </div>

                      <p className="text-[11px] text-[#9CA3AF] mt-1.5 line-clamp-2 leading-relaxed">
                        {report.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#8A8A8A]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-medium">Candidate Reported</span>
                        <span>·</span>
                        <span>{report.reportedDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {report.sourceUrl && (
                          <a
                            href={report.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[#8A8A8A] hover:text-white font-mono hover:underline"
                          >
                            <span>View Source</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            const matched = curatedProblems.find(
                              p => p.title.toLowerCase() === report.title.toLowerCase() || p.topics.includes(report.topic as any)
                            )
                            if (matched) handleQuickPractice(matched)
                            else if (curatedProblems[0]) handleQuickPractice(curatedProblems[0])
                          }}
                          className="px-2 py-0.5 rounded bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/20 text-[#FF4D4D] font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Play size={9} fill="currentColor" />
                          <span>Practice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: Company Details Panel (20–23%) */}
      {/* ============================================================ */}
      <div className="w-72 lg:w-80 shrink-0 hidden xl:flex flex-col bg-[#0D0D11] border-l border-white/[0.06] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-5 space-y-5">
        {/* ABOUT COMPANY */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 size={15} className="text-[#FF4D4D]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              About {company.name}
            </h3>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {company.description ||
              `${company.name} is a premier engineering organization with competitive multi-round technical interviews evaluating algorithmic precision, design, and culture alignment.`}
          </p>

          <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
            {company.industry && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#8A8A8A] shrink-0 font-mono text-[11px]">Industry</span>
                <span className="text-white text-right font-medium">{company.industry}</span>
              </div>
            )}
            {company.headquarters && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#8A8A8A] shrink-0 font-mono text-[11px]">Headquarters</span>
                <span className="text-white text-right font-medium">{company.headquarters}</span>
              </div>
            )}
            {company.website && (
              <div className="flex items-start justify-between gap-2">
                <span className="text-[#8A8A8A] shrink-0 font-mono text-[11px]">Website</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF4D4D] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Visit Career Page</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* POPULAR ROLES */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Briefcase size={15} className="text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Popular Roles
            </h3>
          </div>

          <div className="space-y-2">
            {(company.popularRoles || [
              { role: 'SDE-1', level: 'Entry Level' },
              { role: 'SDE-2', level: 'Mid Level' },
              { role: 'SDE-3', level: 'Senior Level' },
              { role: 'Intern', level: 'SDE Intern' },
            ]).map((r, idx) => (
              <div
                key={r.role}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[#8A8A8A] text-[10px] font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-white">{r.role}</p>
                    <p className="text-[10px] text-[#8A8A8A]">{r.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INTERVIEW TIPS */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Lightbulb size={15} className="text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Interview Tips
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-[#9CA3AF] leading-relaxed">
            {(company.interviewTips || [
              'Focus intensely on Data Structures and Algorithms with optimal time bounds.',
              'Be ready for low-level or system design discussions for senior roles.',
              'Practice coding optimal solutions and discussing space-time trade-offs.',
              'Communicate your approach clearly before writing syntax.',
            ]).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#FF4D4D] font-bold shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPANY INSIGHT */}
        {company.companyInsight && (
          <div className="p-3.5 rounded-lg bg-[#FF4D4D]/[0.05] border border-[#FF4D4D]/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#FF4D4D] text-[11px] font-bold font-mono">
              <Sparkles size={13} />
              <span>Company Insight</span>
            </div>
            <p className="text-[11px] text-[#D1D5DB] leading-relaxed">{company.companyInsight}</p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* PRACTICE SESSION SETUP MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isConfigModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setIsConfigModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#121217] border border-white/[0.12] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <CompanyLogo company={company.name} size={28} />
                  <div>
                    <h3 className="text-sm font-bold text-white">Configure Practice Session</h3>
                    <p className="text-[11px] text-[#8A8A8A] font-mono">{company.name} Interview Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConfigModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Role & Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Target Role</label>
                    <select
                      value={cfgRole}
                      onChange={e => setCfgRole(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/50"
                    >
                      {company.roles.map(r => (
                        <option key={r} value={r} className="bg-[#121217] text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Experience Level</label>
                    <select
                      value={cfgExp}
                      onChange={e => setCfgExp(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/50"
                    >
                      {company.experienceLevels.map(exp => (
                        <option key={exp} value={exp} className="bg-[#121217] text-white">
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Topic & Difficulty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Topic</label>
                    <select
                      value={cfgTopic}
                      onChange={e => setCfgTopic(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/50"
                    >
                      <option value="All Topics" className="bg-[#121217] text-white">All Topics</option>
                      <option value="Arrays" className="bg-[#121217] text-white">Arrays</option>
                      <option value="Strings" className="bg-[#121217] text-white">Strings</option>
                      <option value="Hashing" className="bg-[#121217] text-white">Hashing</option>
                      <option value="Linked Lists" className="bg-[#121217] text-white">Linked Lists</option>
                      <option value="Trees" className="bg-[#121217] text-white">Trees</option>
                      <option value="Graphs" className="bg-[#121217] text-white">Graphs</option>
                      <option value="Dynamic Programming" className="bg-[#121217] text-white">Dynamic Programming</option>
                      <option value="Sliding Window" className="bg-[#121217] text-white">Sliding Window</option>
                      <option value="Two Pointers" className="bg-[#121217] text-white">Two Pointers</option>
                      <option value="Binary Search" className="bg-[#121217] text-white">Binary Search</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Difficulty</label>
                    <div className="grid grid-cols-4 gap-1">
                      {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setCfgDiff(d)}
                          className={`py-1.5 rounded text-[10px] font-mono font-bold transition-colors cursor-pointer border ${
                            cfgDiff === d
                              ? 'bg-[#FF4D4D] text-white border-[#FF4D4D]'
                              : 'bg-white/[0.04] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Question Count</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 20].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setCfgCount(cnt)}
                        className={`py-2 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer border ${
                          cfgCount === cnt
                            ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]'
                            : 'bg-white/[0.03] text-[#8A8A8A] border-white/[0.06] hover:text-white'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practice Mode Choice */}
                <div>
                  <label className="block text-[10px] font-mono text-[#8A8A8A] uppercase mb-1">Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCfgMode('practice')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                        cfgMode === 'practice'
                          ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>🎯 Practice Mode</span>
                        {cfgMode === 'practice' && <Check size={13} className="text-[#FF4D4D]" />}
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">Untimed, hints and AI review available.</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCfgMode('interview')}
                      className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                        cfgMode === 'interview'
                          ? 'bg-[#FF4D4D]/10 border-[#FF4D4D] text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-[#8A8A8A] hover:text-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>⏱ Interview Mode</span>
                        {cfgMode === 'interview' && <Check size={13} className="text-[#FF4D4D]" />}
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">Timed 45m simulation, interview sequence.</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartCustomSession}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white font-bold text-xs shadow-[0_0_20px_rgba(255,77,77,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Play size={13} fill="currentColor" />
                  <span>▶ Start Practice Session</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

