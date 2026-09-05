'use client'

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Flame,
  Star,
  Building2,
  Layers,
  Code2,
  Hash,
  Binary,
  Workflow,
  Network,
  Cpu,
  Boxes,
  Split,
  ListOrdered,
  Tag,
  BarChart3,
  TrendingUp,
  ArrowRight,
  Globe,
  ExternalLink,
  Command,
  ArrowLeft,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react'
import {
  Problem,
  Difficulty,
  Company,
  CompanyRole,
  ExperienceLevel,
  Topic,
  TargetProfile,
  ScoredProblem,
  HIERARCHICAL_TOPICS,
  TOP_COMPANIES,
  CompanyMetadata,
  WEB_DISCOVERED_REPORTS,
  difficultyColors,
  calculateJobRelevance,
} from '@/lib/playground-data'
import CompanyLogo from '@/components/shared/CompanyLogo'

export type ExplorerNavView = 'topics' | 'important' | 'recommended' | 'companies'
export type CompanySubView = 'catalog' | 'drilldown'

interface QuestionExplorerProps {
  problems: Problem[]
  selectedProblem: Problem
  onSelect: (problem: Problem) => void
  isOpen: boolean
  onToggle: () => void
  solvedSet: Set<string>
  bookmarkSet: Set<string>
  onToggleBookmark: (id: string) => void
  recentProblems?: Problem[]
  targetProfile: TargetProfile
  onUpdateTargetProfile: (profile: TargetProfile) => void
  attemptedSet?: Set<string>
  activeView?: ExplorerNavView
  onViewChange?: (view: ExplorerNavView) => void
  selectedCompanyId?: string
  onSelectCompanyId?: (id: string) => void
}

// Clean developer-style topic icons
function getTopicIcon(topicLabel: string) {
  switch (topicLabel) {
    case 'Arrays':
    case 'Intervals':
    case 'Matrix':
      return Layers
    case 'Strings':
      return Code2
    case 'Linked Lists':
      return Split
    case 'Stacks & Queues':
      return ListOrdered
    case 'Trees':
      return Workflow
    case 'Graphs':
      return Network
    case 'Hashing':
      return Hash
    case 'Dynamic Programming':
      return Cpu
    case 'Greedy':
      return TrendingUp
    case 'Binary Search':
      return Search
    case 'Two Pointers':
    case 'Sliding Window':
      return ArrowRight
    case 'Recursion':
    case 'Backtracking':
      return Workflow
    case 'Bit Manipulation':
      return Binary
    case 'Math':
      return Hash
    case 'Heaps':
    case 'Heaps / Priority Queue':
      return BarChart3
    case 'Tries':
      return Tag
    case 'Advanced DS':
    case 'Design':
      return Boxes
    default:
      return Tag
  }
}

export default function QuestionExplorer({
  problems,
  selectedProblem,
  onSelect,
  isOpen,
  onToggle,
  solvedSet,
  bookmarkSet,
  onToggleBookmark,
  recentProblems = [],
  targetProfile,
  attemptedSet = new Set(),
  activeView: controlledActiveView,
  onViewChange,
  selectedCompanyId,
  onSelectCompanyId,
}: QuestionExplorerProps) {
  // Main view: 'topics' is primary & active by default
  const [internalActiveView, setInternalActiveView] = useState<ExplorerNavView>('topics')
  const activeView = controlledActiveView !== undefined ? controlledActiveView : internalActiveView

  const handleSetActiveView = (view: ExplorerNavView) => {
    setInternalActiveView(view)
    onViewChange?.(view)
  }

  const [companySubView, setCompanySubView] = useState<CompanySubView>('catalog')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [companySearchQuery, setCompanySearchQuery] = useState('')
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState<'All' | 'FAANG' | 'Product' | 'Finance' | 'India' | 'Startups' | 'Services' | 'Other'>('All')

  // Autocomplete & search input focus
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const companySearchInputRef = useRef<HTMLInputElement>(null)

  // Topic tree expansion state (Level 1: Topics, Level 2: Subtopics)
  const [isDsaRootOpen, setIsDsaRootOpen] = useState(true)
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(['arrays']))
  const [expandedSubtopics, setExpandedSubtopics] = useState<Set<string>>(new Set(['arrays-basic']))

  // Secondary Company Mode drill-down state
  const initialCompany = useMemo(() => {
    if (selectedCompanyId) {
      return TOP_COMPANIES.find(c => c.id === selectedCompanyId) || TOP_COMPANIES[0]
    }
    return TOP_COMPANIES[0]
  }, [selectedCompanyId])

  const [selectedCompany, setSelectedCompany] = useState<CompanyMetadata>(initialCompany)
  const [selectedCompanyRole, setSelectedCompanyRole] = useState<string>('SDE-1')
  const [selectedCompanyExp, setSelectedCompanyExp] = useState<string>('0–2 Years')
  const [selectedCompanyTopic, setSelectedCompanyTopic] = useState<string>('All')
  const [isWebDiscoveryLoading, setIsWebDiscoveryLoading] = useState(false)

  useEffect(() => {
    if (selectedCompanyId) {
      const match = TOP_COMPANIES.find(c => c.id === selectedCompanyId)
      if (match) setSelectedCompany(match)
    }
  }, [selectedCompanyId])

  // Global ⌘K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (activeView === 'companies' && companySubView === 'catalog') {
          companySearchInputRef.current?.focus()
        } else {
          searchInputRef.current?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeView, companySubView])

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic job relevance scoring
  const scoredProblemsMap = useMemo(() => {
    const map = new Map<string, ScoredProblem>()
    problems.forEach(p => {
      map.set(p.id, calculateJobRelevance(p, targetProfile, solvedSet, attemptedSet))
    })
    return map
  }, [problems, targetProfile, solvedSet, attemptedSet])

  // Toggle helpers
  const toggleSetItem = useCallback((setFn: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) => {
    setFn(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const handleExpandAll = useCallback(() => {
    const allTopicKeys = new Set(HIERARCHICAL_TOPICS.map(t => t.key))
    const allSubKeys = new Set(HIERARCHICAL_TOPICS.flatMap(t => t.subtopics.map(s => s.id)))
    setExpandedTopics(allTopicKeys)
    setExpandedSubtopics(allSubKeys)
    setIsDsaRootOpen(true)
  }, [])

  const handleCollapseAll = useCallback(() => {
    setExpandedTopics(new Set())
    setExpandedSubtopics(new Set())
  }, [])

  // Autocomplete suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q || q.length < 2) return []

    const suggestions: { label: string; type: 'topic' | 'problem'; actionQuery: string }[] = []

    HIERARCHICAL_TOPICS.forEach(t => {
      if (t.label.toLowerCase().includes(q)) {
        suggestions.push({ label: t.label, type: 'topic', actionQuery: t.label })
      }
    })

    problems.forEach(p => {
      if (p.title.toLowerCase().includes(q) && suggestions.length < 5) {
        suggestions.push({ label: p.title, type: 'problem', actionQuery: p.title })
      }
    })

    return suggestions.slice(0, 5)
  }, [searchQuery, problems])

  // Filtered problems based on universal search
  const filteredProblems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return problems
    return problems.filter(p => {
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchTopics = p.topics.some(t => t.toLowerCase().includes(q))
      const matchPatterns = (p.patterns ?? []).some(pat => pat.toLowerCase().includes(q))
      const matchDesc = p.description.toLowerCase().includes(q)
      return matchTitle || matchTopics || matchPatterns || matchDesc
    })
  }, [problems, searchQuery])

  // Most Important priority questions (general job preparation)
  const mostImportantProblems = useMemo(() => {
    return problems
      .filter(p => {
        const scored = scoredProblemsMap.get(p.id)
        return scored?.priorityTier === 'must-practice' || scored?.priorityTier === 'high-priority'
      })
      .sort((a, b) => {
        const scoreA = scoredProblemsMap.get(a.id)?.jobRelevanceScore || 0
        const scoreB = scoredProblemsMap.get(b.id)?.jobRelevanceScore || 0
        return scoreB - scoreA
      })
  }, [problems, scoredProblemsMap])

  // Recommended next questions
  const recommendedProblems = useMemo(() => {
    return problems
      .filter(p => !solvedSet.has(p.id))
      .slice(0, 10)
  }, [problems, solvedSet])

  // Secondary Company list filtering with categories & instant search
  const filteredCompanyList = useMemo(() => {
    let list = TOP_COMPANIES
    if (companyCategoryFilter !== 'All') {
      list = list.filter(c => c.category === companyCategoryFilter)
    }
    const q = companySearchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    }
    return list
  }, [companySearchQuery, companyCategoryFilter])

  // Curated questions for the selected company
  const companyCuratedProblems = useMemo(() => {
    return problems.filter(p => {
      const matchCompany = p.companies.some(
        c => c.toLowerCase() === selectedCompany.id.toLowerCase() || c.toLowerCase() === selectedCompany.name.toLowerCase()
      )
      if (!matchCompany) return false
      if (selectedCompanyTopic !== 'All' && !p.topics.includes(selectedCompanyTopic as Topic)) {
        return false
      }
      return true
    })
  }, [problems, selectedCompany, selectedCompanyTopic])

  // Automated Web Discovery Reports for Selected Company
  const companyWebReports = useMemo(() => {
    return WEB_DISCOVERED_REPORTS.filter(r => {
      const matchComp = r.company.toLowerCase() === selectedCompany.id.toLowerCase() ||
        r.company.toLowerCase() === selectedCompany.name.toLowerCase()
      if (!matchComp) return false
      if (selectedCompanyTopic !== 'All' && !r.topic.toLowerCase().includes(selectedCompanyTopic.toLowerCase())) {
        return false
      }
      return true
    })
  }, [selectedCompany, selectedCompanyTopic])

  // Trigger brief debounced automated web discovery query state
  useEffect(() => {
    if (activeView === 'companies' && companySubView === 'drilldown') {
      setIsWebDiscoveryLoading(true)
      const timer = setTimeout(() => setIsWebDiscoveryLoading(false), 320)
      return () => clearTimeout(timer)
    }
  }, [activeView, companySubView, selectedCompany, selectedCompanyRole, selectedCompanyExp, selectedCompanyTopic])

  // Handle switching to Company Mode
  const handleOpenCompanyMode = useCallback(() => {
    handleSetActiveView('companies')
    setCompanySubView('catalog')
    setCompanySearchQuery('')
  }, [])

  // Handle selecting a company from the catalog
  const handleSelectCompany = useCallback((comp: CompanyMetadata) => {
    setSelectedCompany(comp)
    setSelectedCompanyRole(comp.roles[0] || 'SDE-1')
    setSelectedCompanyExp('0–2 Years')
    setSelectedCompanyTopic('All')
    setCompanySubView('drilldown')
  }, [])

  // Render Compact Question Row (VS Code / LeetCode style)
  const renderQuestionRow = (p: Problem) => {
    const isSelected = selectedProblem.id === p.id
    const isSolved = solvedSet.has(p.id)
    const dc = difficultyColors[p.difficulty]

    return (
      <div
        key={p.id}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(p)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(p)
          }
        }}
        className={`group px-2.5 py-1.5 rounded transition-all cursor-pointer select-none my-0.5 border-l-2 ${
          isSelected
            ? 'bg-[#FF4D4D]/[0.08] border-[#FF4D4D] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
            : 'border-transparent hover:bg-white/[0.04] text-[#D1D5DB] hover:text-white'
        }`}
      >
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            {isSolved ? (
              <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />
            ) : (
              <Circle size={8} className="text-[#4B5563] shrink-0 group-hover:text-[#9CA3AF]" />
            )}
            <span className={`text-[11.5px] truncate ${isSelected ? 'font-semibold text-white' : 'text-[#D1D5DB]'}`}>
              {p.title}
            </span>
          </div>

          <span
            className="text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 font-mono"
            style={{ backgroundColor: dc.bg, color: dc.text }}
          >
            {p.difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#71717A] pl-4 pt-0.5">
          <span className="truncate">{p.topics[0]} {p.patterns?.[0] ? `· ${p.patterns[0]}` : ''}</span>
          <span className="text-[#52525B]">Asked {p.askedCount}x</span>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 310, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="shrink-0 h-full bg-[#0D0D10] border-r border-white/[0.06] flex flex-col overflow-hidden select-none z-20"
        >
          {/* 1. TOP HEADER: Topics View vs Company Mode */}
          {activeView !== 'companies' ? (
            <div className="p-3 border-b border-white/[0.06] bg-[#0E0E12] shrink-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Code2 size={15} className="text-[#FF4D4D]" />
                  <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
                    QUESTIONS
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7280]">
                    1000+
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleBookmark(selectedProblem.id)}
                    title="Bookmark current problem"
                    className="w-6 h-6 rounded bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
                  >
                    {bookmarkSet.has(selectedProblem.id) ? (
                      <BookmarkCheck size={13} className="text-[#FF4D4D]" />
                    ) : (
                      <Bookmark size={13} />
                    )}
                  </button>
                  <button
                    onClick={onToggle}
                    title="Close Question Explorer"
                    className="w-6 h-6 rounded bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
                  >
                    <PanelLeftClose size={13} />
                  </button>
                </div>
              </div>

              {/* UNIVERSAL SEARCH BAR + ⌘K */}
              <div ref={searchContainerRef} className="relative">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={e => {
                      setSearchQuery(e.target.value)
                      setIsSearchFocused(true)
                    }}
                    placeholder="Search questions, topics, patterns..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md pl-8 pr-12 py-1.5 text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {!searchQuery ? (
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 text-[8.5px] font-mono text-[#6B7280] bg-white/[0.04] border border-white/[0.06] rounded">
                        <Command size={8} />K
                      </kbd>
                    ) : (
                      <button onClick={() => setSearchQuery('')} className="text-[#6B7280] hover:text-white p-0.5 cursor-pointer">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {isSearchFocused && searchSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#121216] border border-white/10 rounded-md shadow-2xl z-50 overflow-hidden py-1">
                    {searchSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(sug.actionQuery)
                          setIsSearchFocused(false)
                        }}
                        className="w-full text-left px-2.5 py-1 text-xs hover:bg-white/[0.06] text-[#D1D5DB] hover:text-white flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{sug.label}</span>
                        <span className="text-[8.5px] font-mono text-[#6B7280] uppercase">{sug.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
                           {/* PRIMARY VIEW BUTTONS: 🔥 Most Important | 📚 Topics (Dominant) | ⭐ Recommended */}
              <div className="grid grid-cols-3 gap-1 p-0.5 bg-black/40 rounded-md border border-white/[0.04]">
                <button
                  onClick={() => handleSetActiveView('important')}
                  className={`py-1 text-[10px] rounded transition-all cursor-pointer text-center truncate ${
                    activeView === 'important'
                      ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 font-bold shadow-sm'
                      : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.02] font-medium'
                  }`}
                >
                  🔥 Most Important
                </button>
                <button
                  onClick={() => handleSetActiveView('topics')}
                  className={`py-1 text-[10px] rounded transition-all cursor-pointer text-center truncate ${
                    activeView === 'topics'
                      ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 font-bold shadow-sm'
                      : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.02] font-medium'
                  }`}
                >
                  📚 Topics
                </button>
                <button
                  onClick={() => handleSetActiveView('recommended')}
                  className={`py-1 text-[10px] rounded transition-all cursor-pointer text-center truncate ${
                    activeView === 'recommended'
                      ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 font-bold shadow-sm'
                      : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.02] font-medium'
                  }`}
                >
                  ⭐ Recommended
                </button>
              </div>
            </div>
          ) : (
            /* COMPANY MODE HEADER */
            <div className="p-3.5 border-b border-white/[0.06] bg-[#0E0E12] shrink-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wider text-white uppercase font-mono">
                    💼 COMPANY INTERVIEWS
                  </span>
                </div>

                <button
                  onClick={onToggle}
                  title="Collapse Sidebar"
                  className="w-6 h-6 rounded bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all cursor-pointer"
                >
                  <PanelLeftClose size={13} />
                </button>
              </div>

              <p className="text-[11px] text-[#8A8A8A] leading-tight">
                Explore coding interview questions by company, role and experience.
              </p>

              <div>
                <button
                  onClick={() => handleSetActiveView('topics')}
                  className="text-xs font-mono text-[#FF4D4D] hover:underline cursor-pointer font-bold inline-flex items-center"
                >
                  ← Back to Topics
                </button>
              </div>
            </div>
          )}

          {/* 2. MAIN SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin py-1.5 px-2">
            {/* VIEW A: PRIMARY TOPICS TREE (DEFAULT & DOMINANT) */}
            {activeView === 'topics' && (
              <div className="space-y-1">
                {/* DSA ROOT HEADER + EXPAND/COLLAPSE ALL */}
                <div className="flex items-center justify-between px-1 py-1 text-xs font-semibold text-white">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsDsaRootOpen(!isDsaRootOpen)}
                    className="flex items-center gap-1.5 cursor-pointer group"
                  >
                    {isDsaRootOpen ? (
                      <ChevronDown size={12} className="text-[#FF4D4D]" />
                    ) : (
                      <ChevronRight size={12} className="text-[#8A8A8A] group-hover:text-white" />
                    )}
                    <Workflow size={12} className="text-[#FF4D4D]" />
                    <span className="text-[10.5px] font-bold text-white uppercase tracking-wider">
                      DATA STRUCTURES & ALGORITHMS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#6B7280]">1000+</span>
                </div>

                {/* Subtle Expand/Collapse All controls */}
                <div className="flex items-center justify-end gap-2 px-2 pb-1 text-[9px] font-mono text-[#6B7280] border-b border-white/[0.04]">
                  <button
                    onClick={handleExpandAll}
                    className="hover:text-white hover:underline cursor-pointer transition-colors"
                  >
                    Expand All
                  </button>
                  <span>·</span>
                  <button
                    onClick={handleCollapseAll}
                    className="hover:text-white hover:underline cursor-pointer transition-colors"
                  >
                    Collapse All
                  </button>
                </div>

                {/* HIERARCHICAL TOPICS */}
                <AnimatePresence>
                  {isDsaRootOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-0.5 pt-0.5"
                    >
                      {HIERARCHICAL_TOPICS.map(topicDef => {
                        const isTopicExpanded = expandedTopics.has(topicDef.key)
                        const TopicIcon = getTopicIcon(topicDef.label)

                        return (
                          <div key={topicDef.key} className="space-y-0.5">
                            {/* LEVEL 1: TOPIC ROOT */}
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleSetItem(setExpandedTopics, topicDef.key)}
                              className={`flex items-center justify-between px-2 py-1 rounded text-xs transition-colors cursor-pointer group select-none ${
                                isTopicExpanded ? 'bg-white/[0.04] text-white font-semibold' : 'text-[#D1D5DB] hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                {isTopicExpanded ? (
                                  <ChevronDown size={11} className="text-[#FF4D4D] shrink-0" />
                                ) : (
                                  <ChevronRight size={11} className="text-[#6B7280] group-hover:text-white shrink-0" />
                                )}
                                <TopicIcon size={12} className={isTopicExpanded ? 'text-[#FF4D4D]' : 'text-[#8A8A8A]'} />
                                <span className="truncate">{topicDef.label}</span>
                              </div>
                              <span className="text-[9.5px] font-mono text-[#6B7280] ml-2 shrink-0">
                                {topicDef.totalCount}
                              </span>
                            </div>

                            {/* LEVEL 2: SUBTOPICS */}
                            {isTopicExpanded && (
                              <div className="pl-4 space-y-0.5 border-l border-white/[0.04] ml-3.5 my-0.5">
                                {topicDef.subtopics.map(subtopic => {
                                  const isSubExpanded = expandedSubtopics.has(subtopic.id)
                                  const subProblems = filteredProblems.filter(
                                    p => subtopic.problemIds.includes(p.id) || p.subtopic === subtopic.id
                                  )

                                  return (
                                    <div key={subtopic.id} className="space-y-0.5">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => toggleSetItem(setExpandedSubtopics, subtopic.id)}
                                        className={`flex items-center justify-between px-2 py-0.5 rounded text-[10.5px] transition-colors cursor-pointer ${
                                          isSubExpanded ? 'text-white font-medium bg-white/[0.02]' : 'text-[#8A8A8A] hover:text-white'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1 min-w-0">
                                          {isSubExpanded ? (
                                            <ChevronDown size={10} className="text-[#FF4D4D]" />
                                          ) : (
                                            <ChevronRight size={10} className="text-[#6B7280]" />
                                          )}
                                          <span className="truncate">{subtopic.label}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-[#6B7280]">
                                          {subProblems.length}
                                        </span>
                                      </div>

                                      {/* LEVEL 3: QUESTIONS (Disclosed ONLY when subtopic is expanded) */}
                                      {isSubExpanded && (
                                        <div className="pl-3 space-y-0.5 border-l border-white/[0.03] ml-2.5 my-0.5">
                                          {subProblems.length > 0 ? (
                                            subProblems.map(p => renderQuestionRow(p))
                                          ) : (
                                            <div className="p-1 text-[9.5px] text-[#6B7280] italic">
                                              No questions in this pattern.
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* VIEW B: MOST IMPORTANT QUESTIONS */}
            {activeView === 'important' && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-[#8A8A8A] flex items-center justify-between border-b border-white/[0.04]">
                  <span>Essential Interview Questions</span>
                  <span className="text-[#FF4D4D] font-bold">{mostImportantProblems.length} High-Yield</span>
                </div>
                {mostImportantProblems.map(p => renderQuestionRow(p))}
              </div>
            )}

            {/* VIEW C: RECOMMENDED QUESTIONS */}
            {activeView === 'recommended' && (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-[#8A8A8A] flex items-center justify-between border-b border-white/[0.04]">
                  <span>Recommended Next Steps</span>
                  <span className="text-[#10B981] font-bold">{recommendedProblems.length} Queued</span>
                </div>
                {recommendedProblems.map(p => renderQuestionRow(p))}
              </div>
            )}

            {/* VIEW D: SECONDARY COMPANY INTERVIEWS MODE (CATALOG) */}
            {activeView === 'companies' && (
              <div className="space-y-2.5 pt-0.5">
                {/* Search Field */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    ref={companySearchInputRef}
                    type="text"
                    value={companySearchQuery}
                    onChange={e => setCompanySearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-md pl-8 pr-10 py-1.5 text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {!companySearchQuery ? (
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 text-[8.5px] font-mono text-[#6B7280] bg-white/[0.04] border border-white/[0.06] rounded">
                        ⌘K
                      </kbd>
                    ) : (
                      <button
                        onClick={() => setCompanySearchQuery('')}
                        className="text-[#6B7280] hover:text-white p-0.5 cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1">
                  {(['All', 'FAANG', 'Product', 'Finance', 'India', 'Startups', 'Services', 'Other'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCompanyCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded text-[9.5px] font-mono transition-colors cursor-pointer border ${
                        companyCategoryFilter === cat
                          ? 'bg-[#FF4D4D]/15 text-[#FF4D4D] border-[#FF4D4D]/40 font-bold'
                          : 'bg-white/[0.02] text-[#8A8A8A] border-white/[0.04] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Clean Compact Company List */}
                <div className="space-y-0.5 pt-1">
                  {filteredCompanyList.map(comp => {
                    const isSelected = selectedCompanyId === comp.id || selectedCompany.id === comp.id
                    return (
                      <div
                        key={comp.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setSelectedCompany(comp)
                          onSelectCompanyId?.(comp.id)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedCompany(comp)
                            onSelectCompanyId?.(comp.id)
                          }
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded transition-all cursor-pointer group select-none ${
                          isSelected
                            ? 'bg-[#FF4D4D]/10 text-white border-l-2 border-[#FF4D4D]'
                            : 'hover:bg-white/[0.04] text-[#D1D5DB] hover:text-white border-l-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CompanyLogo company={comp.name} size={24} />
                          <span className="text-xs font-semibold truncate text-white">{comp.name}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-[#8A8A8A]">
                            {comp.questionCount || 64}
                          </span>
                          <ChevronRight size={12} className="text-[#6B7280] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    )
                  })}

                  {filteredCompanyList.length === 0 && (
                    <div className="p-3 text-center text-xs text-[#6B7280] italic">
                      No companies match &quot;{companySearchQuery}&quot;.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. SECONDARY COMPANY INTERVIEWS ACTION (AT THE BOTTOM OF EXPLORER) */}
          {activeView !== 'companies' && (
            <div className="p-2 border-t border-white/[0.06] bg-[#0E0E12] shrink-0 space-y-1.5">
              <button
                onClick={handleOpenCompanyMode}
                className="w-full py-1.5 px-2.5 rounded text-[11px] font-mono text-[#D1D5DB] hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Building2 size={12} className="text-[#FF4D4D]" />
                  Company Interviews
                </span>
                <span className="text-[11px] text-[#FF4D4D] group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              {/* RECENTLY VIEWED */}
              {recentProblems.length > 0 && (
                <div className="pt-1 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1 px-1 mb-0.5 text-[8.5px] font-mono text-[#6B7280] uppercase tracking-wider">
                    <Clock size={9} /> Recently Viewed
                  </div>
                  {recentProblems.slice(0, 3).map(p => (
                    <div
                      key={p.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelect(p)}
                      className="px-1.5 py-0.5 rounded text-[10px] text-[#9CA3AF] hover:text-white hover:bg-white/[0.03] cursor-pointer truncate"
                    >
                      {p.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
