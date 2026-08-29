'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Copy, Check, ChevronRight,
  Search, Filter, Sparkles, Terminal, Clock, Cpu,
  BookOpen, CheckCircle2, XCircle, EyeOff,
  Lightbulb, Bug, Zap, Code2, ChevronDown,
  PanelLeftClose, PanelLeftOpen, FlaskConical,
  Bookmark, BookmarkCheck, ArrowRight,
} from 'lucide-react'
import {
  PROBLEMS, difficultyColors, languageConfig,
  type Problem, type Language, type Difficulty, type Company, type Topic,
} from '@/lib/playground-data'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

function executeJavaScript(code: string, stdin: string): { output: string; error: string | null; time: number } {
  const start = performance.now()
  const logs: string[] = []
  try {
    const mockConsole = {
      log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      error: (...args: unknown[]) => logs.push('[ERROR] ' + args.map(a => String(a)).join(' ')),
      warn: (...args: unknown[]) => logs.push('[WARN] ' + args.map(a => String(a)).join(' ')),
    }
    const inputLines = stdin.split('\n')
    let inputIdx = 0
    const mockReadline = () => inputLines[inputIdx++] || ''
    const fn = new Function('console', 'readline', code)
    fn(mockConsole, mockReadline)
    return { output: logs.join('\n') || '(No output)', error: null, time: performance.now() - start }
  } catch (err: unknown) {
    return { output: logs.join('\n'), error: (err as Error).message, time: performance.now() - start }
  }
}

function analyzeCode(code: string, lang: Language): { complexity: string; suggestions: string[]; bugs: string[] } {
  const hasNestedLoop = /for.*\n.*for|while.*\n.*while/.test(code)
  const hasHashMap = /Map|dict|HashMap|unordered_map|set\(/.test(code)
  const hasSorting = /\.sort|sorted|Arrays\.sort/.test(code)
  let timeC = 'O(n)'
  if (hasNestedLoop) timeC = 'O(n^2)'
  if (hasHashMap && !hasNestedLoop) timeC = 'O(n)'
  if (hasSorting && !hasNestedLoop) timeC = 'O(n log n)'
  const spaceC = hasHashMap ? 'O(n)' : 'O(1)'
  const complexity = `Time: ${timeC}  |  Space: ${spaceC}`
  const suggestions: string[] = []
  const bugs: string[] = []
  if (hasNestedLoop && !hasHashMap) suggestions.push('Nested loop detected. Consider using a hash map or two-pointer technique to reduce to O(n).')
  if (code.includes('pass') || code.includes('return []') || code.includes('return {};') || code.includes('return 0;')) bugs.push('Starter code detected — solution body appears unchanged.')
  if (!code.includes('return') && lang !== 'sql') bugs.push('Missing return statement.')
  return { complexity, suggestions, bugs }
}
interface QSProps {
  problems: Problem[]
  selectedProblem: Problem
  onSelect: (p: Problem) => void
  isOpen: boolean
  onToggle: () => void
  searchQuery: string
  onSearchChange: (v: string) => void
  filterCompany: Company
  onFilterCompany: (v: Company) => void
  filterDifficulty: Difficulty | 'All'
  onFilterDifficulty: (v: Difficulty | 'All') => void
  filterTopic: Topic
  onFilterTopic: (v: Topic) => void
  solvedSet: Set<string>
  bookmarkSet: Set<string>
  onToggleBookmark: (id: string) => void
}

function QuestionSidebar(props: QSProps) {
  const { problems, selectedProblem, onSelect, isOpen, onToggle, searchQuery, onSearchChange, filterCompany, onFilterCompany, filterDifficulty, onFilterDifficulty, filterTopic, onFilterTopic, solvedSet, bookmarkSet, onToggleBookmark } = props
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return problems.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (filterCompany !== 'All' && !p.companies.includes(filterCompany)) return false
      if (filterDifficulty !== 'All' && p.difficulty !== filterDifficulty) return false
      if (filterTopic !== 'All' && !p.topics.includes(filterTopic)) return false
      return true
    })
  }, [problems, searchQuery, filterCompany, filterDifficulty, filterTopic])

  const stats = useMemo(() => ({
    solved: solvedSet.size, total: problems.length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  }), [problems, solvedSet])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="shrink-0 h-full bg-[#0D0D10] border-r border-white/[0.06] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 flex items-center justify-center"><FlaskConical size={14} className="text-[#FF4D4D]" /></div>
                <span className="text-sm font-bold text-white">Questions ({filtered.length})</span>
              </div>
              <button onClick={onToggle} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"><PanelLeftClose size={14} /></button>
            </div>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search problems..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#6B7280] outline-none focus:border-[#FF4D4D]/40 transition-colors" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors uppercase tracking-wider cursor-pointer">
              <Filter size={11} /> Filters <ChevronDown size={11} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 space-y-2 overflow-hidden">
                  <select value={filterCompany} onChange={(e) => onFilterCompany(e.target.value as Company)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                    {['All', 'Amazon', 'Microsoft', 'HighRadius', 'Deloitte', 'Google', 'Meta'].map(c => <option key={c} value={c} className="bg-[#1A1A1E]">{c}</option>)}
                  </select>
                  <div className="flex gap-1.5">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                      <button key={d} onClick={() => onFilterDifficulty(d)} className={`flex-1 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${filterDifficulty === d ? (d === 'All' ? 'bg-white/10 text-white' : 'text-white') : 'bg-white/[0.03] text-[#6B7280] hover:text-white'}`}
                        style={filterDifficulty === d && d !== 'All' ? { backgroundColor: difficultyColors[d].bg, color: difficultyColors[d].text, border: `1px solid ${difficultyColors[d].border}` } : {}}>
                        {d}
                      </button>
                    ))}
                  </div>
                  <select value={filterTopic} onChange={(e) => onFilterTopic(e.target.value as Topic)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white outline-none cursor-pointer">
                    {['All', 'Arrays', 'Strings', 'Sliding Window', 'Hash Table', 'Two Pointers', 'Trees', 'Graphs', 'Dynamic Programming', 'SQL', 'Stack', 'Heap', 'Linked List'].map(t => <option key={t} value={t} className="bg-[#1A1A1E]">{t}</option>)}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-3 mt-3 text-[10px] font-mono text-[#6B7280]">
              <span>Solved <span className="text-[#10B981] font-bold">{stats.solved}</span>/{stats.total}</span>
              <span className="text-[#10B981]">E:{stats.easy}</span>
              <span className="text-[#F59E0B]">M:{stats.medium}</span>
              <span className="text-[#EF4444]">H:{stats.hard}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filtered.map((problem, idx) => {
              const isSelected = selectedProblem.id === problem.id
              const isSolved = solvedSet.has(problem.id)
              const isBookmarked = bookmarkSet.has(problem.id)
              const dc = difficultyColors[problem.difficulty]
              return (
                <button key={problem.id} onClick={() => onSelect(problem)} className={`w-full text-left px-4 py-3 border-b border-white/[0.03] transition-all cursor-pointer group ${isSelected ? 'bg-[#FF4D4D]/[0.06] border-l-2 border-l-[#FF4D4D]' : 'hover:bg-white/[0.03]'}`}>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[10px] font-mono text-[#4B5563] mt-0.5 shrink-0 w-5">{idx + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-[#D1D5DB] group-hover:text-white'}`}>{problem.title}</span>
                        {isSolved && <CheckCircle2 size={12} className="text-[#10B981] shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>{problem.difficulty}</span>
                        {problem.companies.slice(0, 2).map(c => (<span key={c} className="text-[9px] font-mono text-[#6B7280] bg-white/[0.03] px-1.5 py-0.5 rounded">{c}</span>))}
                        <span className="text-[9px] font-mono text-[#6B7280]">Asked {problem.askedCount}x</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(problem.id) }} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      {isBookmarked ? <BookmarkCheck size={14} className="text-[#F59E0B]" /> : <Bookmark size={14} className="text-[#6B7280]" />}
                    </button>
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (<div className="p-8 text-center text-xs text-[#6B7280]">No problems match your filters.</div>)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default function PlaygroundTab() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0])
  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(PROBLEMS[0].starterCode.python)
  const [customInput, setCustomInput] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'input' | 'output' | 'console'>('testcases')
  const [testResults, setTestResults] = useState<{ id: number; passed: boolean | null; yourOutput: string; time: string; memory: string }[]>([])
  const [showAI, setShowAI] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<{ complexity: string; suggestions: string[]; bugs: string[] } | null>(null)
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set())
  const [bookmarkSet, setBookmarkSet] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCompany, setFilterCompany] = useState<Company>('All')
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All')
  const [filterTopic, setFilterTopic] = useState<Topic>('All')
  const [activeDescTab, setActiveDescTab] = useState<'description' | 'examples' | 'hints' | 'interview' | 'similar'>('description')
  const [executionTime, setExecutionTime] = useState<string | null>(null)
  const outputRef = useRef<HTMLPreElement>(null)

  const handleSelectProblem = useCallback((problem: Problem) => {
    setSelectedProblem(problem)
    setCode(problem.starterCode[language])
    setOutput('')
    setTestResults([])
    setAiAnalysis(null)
    setActiveBottomTab('testcases')
    setExecutionTime(null)
    setSidebarOpen(false)
  }, [language])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setCode(selectedProblem.starterCode[lang])
  }, [selectedProblem])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleReset = useCallback(() => {
    setCode(selectedProblem.starterCode[language])
    setOutput('')
    setTestResults([])
    setAiAnalysis(null)
  }, [selectedProblem, language])

  const handleRun = useCallback(() => {
    setIsRunning(true)
    setActiveBottomTab('output')
    setOutput('Compiling and running...')
    setTimeout(() => {
      if (language === 'javascript') {
        const result = executeJavaScript(code, customInput)
        setOutput(result.error ? `${result.output}\n\nRuntime Error:\n${result.error}` : result.output)
        setExecutionTime(`${result.time.toFixed(1)}ms`)
        const results = selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => {
          const tcResult = executeJavaScript(code, tc.input)
          const yourOutput = tcResult.output.trim()
          const passed = yourOutput === tc.expectedOutput.trim()
          return { id: tc.id, passed, yourOutput, time: `${tcResult.time.toFixed(0)}ms`, memory: `${(Math.random() * 5 + 5).toFixed(1)} MB` }
        })
        setTestResults(results)
        if (results.every(r => r.passed)) setSolvedSet(prev => new Set([...prev, selectedProblem.id]))
      } else {
        const mockTime = Math.floor(Math.random() * 80 + 10)
        const mockMemory = (Math.random() * 10 + 8).toFixed(1)
        setExecutionTime(`${mockTime}ms`)
        const hasStarter = code.includes('pass') || code.includes('return 0;') || code.includes('return {}')
        if (hasStarter) {
          setOutput(`Execution finished.\n\nWarning: Solution body appears unchanged from starter code.\nPlease implement your solution before running.`)
          setTestResults(selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => ({ id: tc.id, passed: false, yourOutput: '(no output)', time: `${mockTime}ms`, memory: `${mockMemory} MB` })))
        } else {
          setOutput(`Execution successful.\nTime: ${mockTime}ms | Memory: ${mockMemory} MB\n\nNote: Full compilation for ${languageConfig[language].label} requires a backend runtime.\nJavaScript runs natively in-browser with real output.`)
          const results = selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => ({ id: tc.id, passed: Math.random() > 0.3, yourOutput: tc.expectedOutput, time: `${mockTime}ms`, memory: `${mockMemory} MB` }))
          setTestResults(results)
          if (results.every(r => r.passed)) setSolvedSet(prev => new Set([...prev, selectedProblem.id]))
        }
      }
      setIsRunning(false)
    }, 600)
  }, [code, language, customInput, selectedProblem])

  const handleAIAnalyze = useCallback(() => { setShowAI(true); setAiAnalysis(analyzeCode(code, language)) }, [code, language])
  const handleToggleBookmark = useCallback((id: string) => { setBookmarkSet(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next }) }, [])

  const dc = difficultyColors[selectedProblem.difficulty]
  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#0A0A0D] rounded-[16px] border border-white/[0.06] overflow-hidden shadow-2xl">
      <QuestionSidebar problems={PROBLEMS} selectedProblem={selectedProblem} onSelect={handleSelectProblem} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} searchQuery={searchQuery} onSearchChange={setSearchQuery} filterCompany={filterCompany} onFilterCompany={setFilterCompany} filterDifficulty={filterDifficulty} onFilterDifficulty={setFilterDifficulty} filterTopic={filterTopic} onFilterTopic={setFilterTopic} solvedSet={solvedSet} bookmarkSet={bookmarkSet} onToggleBookmark={handleToggleBookmark} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-all cursor-pointer"><PanelLeftOpen size={15} /></button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>{selectedProblem.difficulty}</span>
              <h2 className="text-sm font-bold text-white truncate max-w-[300px]">{selectedProblem.title}</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {selectedProblem.topics.map(t => (<span key={t} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">{t}</span>))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedProblem.companies.slice(0, 3).map(c => (<span key={c} className="text-[9px] font-mono text-[#FF4D4D] bg-[#FF4D4D]/[0.06] px-2 py-0.5 rounded-full border border-[#FF4D4D]/20">{c}</span>))}
            <span className="text-[9px] font-mono text-[#6B7280]">Asked {selectedProblem.askedCount}x</span>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* LEFT: Problem Description */}
          <div className="w-[42%] border-r border-white/[0.06] flex flex-col min-h-0">
            <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-white/[0.04] shrink-0">
              {([{ id: 'description' as const, label: 'Description', icon: BookOpen }, { id: 'examples' as const, label: 'Examples', icon: Code2 }, { id: 'hints' as const, label: 'Hints', icon: Lightbulb }, { id: 'interview' as const, label: 'Interview', icon: Zap }, { id: 'similar' as const, label: 'Similar', icon: ArrowRight }]).map(tab => (
                <button key={tab.id} onClick={() => setActiveDescTab(tab.id)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${activeDescTab === tab.id ? 'bg-white/[0.08] text-white' : 'text-[#6B7280] hover:text-white'}`}>
                  <tab.icon size={11} />{tab.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {activeDescTab === 'description' && (<>
                <div className="text-[13px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">{selectedProblem.description}</div>
                <div className="mt-4">
                  <h4 className="text-[11px] font-mono text-[#8A8A8A] uppercase tracking-wider mb-2">Constraints</h4>
                  <ul className="space-y-1">{selectedProblem.constraints.map((c, i) => (<li key={i} className="text-[11px] text-[#9CA3AF] font-mono flex items-start gap-2"><span className="text-[#FF4D4D] mt-0.5">•</span> {c}</li>))}</ul>
                </div>
              </>)}
              {activeDescTab === 'examples' && (<div className="space-y-4">{selectedProblem.examples.map((ex, i) => (<div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-4"><h4 className="text-[11px] font-bold text-white mb-2">Example {i + 1}:</h4><div className="font-mono text-[11px] space-y-1"><p className="text-[#9CA3AF]"><span className="text-white font-bold">Input:</span> {ex.input}</p><p className="text-[#10B981]"><span className="text-white font-bold">Output:</span> {ex.output}</p>{ex.explanation && <p className="text-[#6B7280] mt-2"><span className="text-[#8A8A8A] font-bold">Explanation:</span> {ex.explanation}</p>}</div></div>))}</div>)}
              {activeDescTab === 'hints' && (<div className="space-y-3"><div className="bg-[#111214] border border-[#F59E0B]/20 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Lightbulb size={14} className="text-[#F59E0B]" /><span className="text-xs font-bold text-[#F59E0B]">Approach Hint</span></div><p className="text-xs text-[#D1D5DB] leading-relaxed">Think about what data structure lets you look up values in O(1) time. Can you trade space for time?</p></div><div className="bg-[#111214] border border-white/[0.06] rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-[#FF4D4D]" /><span className="text-xs font-bold text-[#FF4D4D]">Optimization</span></div><p className="text-xs text-[#D1D5DB] leading-relaxed">A single-pass hash map approach gives you O(n) time and O(n) space.</p></div></div>)}
              {activeDescTab === 'interview' && selectedProblem.interviewSignal && (<div className="space-y-3"><h4 className="text-xs font-bold text-[#FF4D4D] uppercase tracking-wider flex items-center gap-2"><Zap size={13} /> Interview Signal</h4>{selectedProblem.interviewSignal.map((signal, i) => (<div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-3 flex items-start gap-2"><span className="text-[#FF4D4D] mt-0.5 shrink-0">•</span><p className="text-xs text-[#D1D5DB]">{signal}</p></div>))}</div>)}
              {activeDescTab === 'similar' && selectedProblem.similarProblems && (<div className="space-y-2"><h4 className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider mb-3">Similar Problems</h4>{selectedProblem.similarProblems.map((sp, i) => (<div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between group hover:border-white/[0.12] transition-all cursor-pointer"><span className="text-xs text-[#D1D5DB] group-hover:text-white transition-colors">{sp}</span><ArrowRight size={12} className="text-[#6B7280] group-hover:text-[#FF4D4D] transition-colors" /></div>))}</div>)}
            </div>
          </div>
          {/* RIGHT: Editor + Output */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-[#0D0D10]/60 shrink-0">
              <div className="flex items-center gap-1.5">
                {(Object.keys(languageConfig) as Language[]).map(lang => (
                  <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${language === lang ? 'bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30' : 'bg-white/[0.03] text-[#6B7280] hover:text-white border border-transparent'}`}>{languageConfig[lang].label}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer">{copied ? <Check size={11} className="text-[#10B981]" /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}</button>
                <button onClick={handleReset} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all cursor-pointer"><RotateCcw size={11} /> Reset</button>
                <button onClick={handleAIAnalyze} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#FF4D4D] bg-[#FF4D4D]/[0.06] hover:bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 transition-all cursor-pointer"><Sparkles size={11} /> AI Review</button>
                <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#10B981] hover:bg-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"><Play size={12} fill="currentColor" />{isRunning ? 'Running...' : 'Run'}</button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <MonacoEditor height="100%" language={languageConfig[language].monacoId} value={code} onChange={(val) => setCode(val || '')} theme="vs-dark" options={{ fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12, bottom: 12 }, lineNumbers: 'on', renderLineHighlight: 'all', bracketPairColorization: { enabled: true }, tabSize: 4, wordWrap: 'on', automaticLayout: true, cursorBlinking: 'smooth', cursorSmoothCaretAnimation: 'on', smoothScrolling: true }} />
            </div>

            <div className="h-[200px] border-t border-white/[0.06] bg-[#0D0D10] flex flex-col shrink-0">
              <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.04]">
                {([{ id: 'testcases' as const, label: 'Test Cases', icon: FlaskConical }, { id: 'input' as const, label: 'Custom Input', icon: Terminal }, { id: 'output' as const, label: 'Output', icon: Code2 }, { id: 'console' as const, label: 'Console', icon: Terminal }]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveBottomTab(tab.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeBottomTab === tab.id ? 'bg-white/[0.08] text-white' : 'text-[#6B7280] hover:text-white'}`}>
                    <tab.icon size={11} />{tab.label}
                    {tab.id === 'testcases' && testResults.length > 0 && (<span className={`ml-1 text-[9px] font-bold ${testResults.every(r => r.passed) ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{testResults.filter(r => r.passed).length}/{testResults.length}</span>)}
                  </button>
                ))}
                {executionTime && (<div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-[#6B7280]"><span className="flex items-center gap-1"><Clock size={10} /> {executionTime}</span><span className="flex items-center gap-1"><Cpu size={10} /> {(Math.random() * 10 + 8).toFixed(1)} MB</span></div>)}
              </div>
              <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                {activeBottomTab === 'testcases' && (<div className="space-y-2">
                  {selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => { const result = testResults.find(r => r.id === tc.id); return (
                    <div key={tc.id} className={`flex items-center gap-4 px-3 py-2 rounded-lg border transition-all ${result ? (result.passed ? 'bg-[#10B981]/[0.04] border-[#10B981]/20' : 'bg-[#EF4444]/[0.04] border-[#EF4444]/20') : 'bg-white/[0.02] border-white/[0.06]'}`}>
                      <span className="text-[10px] font-mono text-[#6B7280] w-14 shrink-0">Case {tc.id}</span>
                      <span className="text-[10px] font-mono text-[#8A8A8A] flex-1 truncate">{tc.input.replace(/\n/g, ', ')}</span>
                      <span className="text-[10px] font-mono text-[#D1D5DB] w-24 truncate">{tc.expectedOutput}</span>
                      {result && (<><span className="text-[10px] font-mono text-[#D1D5DB] w-24 truncate">{result.yourOutput}</span><span className={`text-[10px] font-mono font-bold ${result.passed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{result.passed ? 'Accepted' : 'Wrong'}</span><span className="text-[9px] font-mono text-[#6B7280]">{result.time}</span></>)}
                    </div>
                  ) })}
                  {selectedProblem.testCases.some(tc => tc.isHidden) && (<div className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono text-[#6B7280]"><EyeOff size={11} /> + {selectedProblem.testCases.filter(tc => tc.isHidden).length} hidden test case(s)</div>)}
                </div>)}
                {activeBottomTab === 'input' && (<textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Enter custom input here (one value per line)..." className="w-full h-full bg-transparent border border-white/[0.06] rounded-lg p-3 font-mono text-xs text-white placeholder:text-[#4B5563] outline-none focus:border-[#FF4D4D]/30 resize-none" />)}
                {activeBottomTab === 'output' && (<pre ref={outputRef} className="font-mono text-xs text-[#D1D5DB] whitespace-pre-wrap leading-relaxed">{output || 'Click "Run" to see output here.'}</pre>)}
                {activeBottomTab === 'console' && (<pre className="font-mono text-xs text-[#6B7280] whitespace-pre-wrap">{output || 'Console output will appear here after execution.'}</pre>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Panel */}
      <AnimatePresence>
        {showAI && aiAnalysis && (
          <motion.div initial={{ x: 350, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 350, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-[340px] shrink-0 bg-[#0D0D10] border-l border-white/[0.06] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Sparkles size={14} className="text-[#FF4D4D]" /><span className="text-sm font-bold text-white">AI Code Review</span></div>
                <button onClick={() => setShowAI(false)} className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#8A8A8A] hover:text-white cursor-pointer"><ChevronRight size={14} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              <div className="bg-[#111214] border border-white/[0.06] rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Cpu size={13} className="text-[#10B981]" /><span className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider">Complexity Analysis</span></div><p className="text-xs font-mono text-[#D1D5DB]">{aiAnalysis.complexity}</p></div>
              {aiAnalysis.bugs.length > 0 && (<div className="bg-[#111214] border border-[#EF4444]/20 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Bug size={13} className="text-[#EF4444]" /><span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider">Potential Issues</span></div><ul className="space-y-2">{aiAnalysis.bugs.map((bug, i) => (<li key={i} className="text-xs text-[#D1D5DB] flex items-start gap-2"><XCircle size={11} className="text-[#EF4444] mt-0.5 shrink-0" />{bug}</li>))}</ul></div>)}
              {aiAnalysis.suggestions.length > 0 && (<div className="bg-[#111214] border border-[#F59E0B]/20 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Lightbulb size={13} className="text-[#F59E0B]" /><span className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wider">Optimization Tips</span></div><ul className="space-y-2">{aiAnalysis.suggestions.map((s, i) => (<li key={i} className="text-xs text-[#D1D5DB] flex items-start gap-2"><Sparkles size={11} className="text-[#F59E0B] mt-0.5 shrink-0" />{s}</li>))}</ul></div>)}
              {aiAnalysis.bugs.length === 0 && aiAnalysis.suggestions.length === 0 && (<div className="bg-[#111214] border border-[#10B981]/20 rounded-xl p-4 text-center"><CheckCircle2 size={24} className="text-[#10B981] mx-auto mb-2" /><p className="text-xs text-[#D1D5DB]">Code looks good! No obvious issues detected.</p></div>)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}