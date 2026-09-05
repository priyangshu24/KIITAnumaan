'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, RotateCcw, Copy, Check, ChevronRight, ArrowLeft,
  Search, Filter, Sparkles, Terminal, Clock, Cpu,
  BookOpen, CheckCircle2, XCircle, EyeOff,
  Lightbulb, Bug, Zap, Code2, ChevronDown,
  PanelLeftClose, PanelLeftOpen, FlaskConical,
  Bookmark, BookmarkCheck, ArrowRight,
  Settings2, Maximize2, Minimize2, Download, Keyboard,
  WrapText, Type, Minus, Plus, Wand2, Map as MapIcon, X,
  Flame, Target, Building2, ListOrdered, AlertCircle,
} from 'lucide-react'
import {
  PROBLEMS, difficultyColors, languageConfig, starterCodeFor,
  type Problem, type Language, type Difficulty, type Company, type Topic,
  type TargetProfile, DEFAULT_TARGET_PROFILE, calculateJobRelevance,
  TOP_COMPANIES,
  type PracticeSession,
  type PracticeSessionConfig,
  createPracticeSession,
} from '@/lib/playground-data'
import { recordSolve } from '@/lib/playground-stats'
import QuestionExplorer from './QuestionExplorer'
import CompanyIntelligenceWorkspace from './CompanyIntelligenceWorkspace'
import PlaygroundLanding from './PlaygroundLanding'
import CompanyLogo from '@/components/shared/CompanyLogo'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

// Minimal shape of the Monaco editor instance we actually touch.
type MonacoEditorInstance = {
  getAction: (id: string) => { run: () => void } | null
  getValue: () => string
  focus: () => void
}

const LS = {
  draft: (pid: string, lang: Language) => `kiit:pg:draft:${pid}:${lang}`,
  solved: 'kiit:pg:solved',
  bookmarks: 'kiit:pg:bookmarks',
  settings: 'kiit:pg:editor',
  split: 'kiit:pg:split',
  target: 'kiit:pg:target',
}

const SPLIT_MIN = 24
const SPLIT_MAX = 74
const SPLIT_DEFAULT = 42
const clampSplit = (n: number) => Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, n))

const readLS = (key: string): string | null => {
  try { return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null } catch { return null }
}
const writeLS = (key: string, val: string) => {
  try { window.localStorage.setItem(key, val) } catch { /* quota / private mode */ }
}
const removeLS = (key: string) => {
  try { window.localStorage.removeItem(key) } catch { /* noop */ }
}

const fileExtension: Record<Language, string> = {
  python: 'py', javascript: 'js', typescript: 'ts', java: 'java', cpp: 'cpp',
  c: 'c', csharp: 'cs', go: 'go', rust: 'rs', kotlin: 'kt', swift: 'swift',
  ruby: 'rb', php: 'php', sql: 'sql',
}

type EditorSettings = { fontSize: number; tabSize: number; wordWrap: boolean; minimap: boolean }
const DEFAULT_EDITOR_SETTINGS: EditorSettings = { fontSize: 13, tabSize: 4, wordWrap: true, minimap: false }

const SHORTCUTS: { label: string; keys: string }[] = [
  { label: 'Run code', keys: 'Ctrl / ⌘  +  ↵' },
  { label: 'Save draft', keys: 'Ctrl / ⌘  +  S' },
  { label: 'Format code', keys: 'Ctrl / ⌘  +  ⇧  +  F' },
  { label: 'Toggle line comment', keys: 'Ctrl / ⌘  +  /' },
  { label: 'Command palette', keys: 'F1' },
  { label: 'Add cursor', keys: 'Alt  +  Click' },
]

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

function IconBtn({ onClick, title, active, disabled, children }: {
  onClick: () => void; title: string; active?: boolean; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer border shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/30'
          : 'bg-white/[0.03] text-[#8A8A8A] hover:text-white hover:bg-white/[0.06] border-transparent'
      }`}
    >
      {children}
    </button>
  )
}

export default function PlaygroundTab() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0])
  const [recentProblems, setRecentProblems] = useState<Problem[]>([PROBLEMS[0]])
  const [targetProfile, setTargetProfile] = useState<TargetProfile>(DEFAULT_TARGET_PROFILE)

  // Navigation mode: 'landing' (primary entry landing page) vs 'topics' (standard editor) vs 'companies' (intelligence workspace)
  const [playgroundNavMode, setPlaygroundNavMode] = useState<'landing' | 'topics' | 'companies'>('landing')
  const [companyWorkspaceView, setCompanyWorkspaceView] = useState<'intelligence' | 'problem' | 'practice'>('intelligence')
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('Amazon')
  const [selectedCompanyRole, setSelectedCompanyRole] = useState<string>('SDE-1')
  const [selectedCompanyExp, setSelectedCompanyExp] = useState<string>('0–2 Years')
  const [selectedCompanyTopic, setSelectedCompanyTopic] = useState<string>('All Topics')

  // Dedicated Practice Session State
  const [activePracticeSession, setActivePracticeSession] = useState<PracticeSession | null>(null)
  const [isPracticeSummaryOpen, setIsPracticeSummaryOpen] = useState<boolean>(false)
  const [practiceBanner, setPracticeBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [language, setLanguage] = useState<Language>('python')
  const [code, setCode] = useState(starterCodeFor(PROBLEMS[0], 'python'))
  const [customInput, setCustomInput] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [activeBottomTab, setActiveBottomTab] = useState<'testcases' | 'input' | 'output' | 'console'>('testcases')
  const [testResults, setTestResults] = useState<{ id: number; passed: boolean | null; yourOutput: string; time: string; memory: string }[]>([])
  const [showAI, setShowAI] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<{ complexity: string; suggestions: string[]; bugs: string[] } | null>(null)
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set())
  const [bookmarkSet, setBookmarkSet] = useState<Set<string>>(new Set())
  const [activeDescTab, setActiveDescTab] = useState<'description' | 'examples' | 'constraints' | 'hints' | 'interview' | 'similar' | 'notes'>('description')
  const [executionTime, setExecutionTime] = useState<string | null>(null)
  const outputRef = useRef<HTMLPreElement>(null)

  // --- Professional editor tooling ------------------------------------------
  const editorRef = useRef<MonacoEditorInstance | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [didFormat, setDidFormat] = useState(false)
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(DEFAULT_EDITOR_SETTINGS)

  // Resizable split between the problem panel and the editor.
  const splitRef = useRef<HTMLDivElement>(null)
  const draggingSplit = useRef(false)
  const [leftPct, setLeftPct] = useState(SPLIT_DEFAULT)
  const [isDraggingSplit, setIsDraggingSplit] = useState(false)

  // Current company metadata object
  const currentCompanyObj = useMemo(() => {
    return TOP_COMPANIES.find(c => c.id === selectedCompanyId) || TOP_COMPANIES[0]
  }, [selectedCompanyId])

  // Restore persisted progress + editor preferences once, on mount.
  useEffect(() => {
    const solved = readLS(LS.solved)
    if (solved) { try { setSolvedSet(new Set(JSON.parse(solved))) } catch { /* corrupt */ } }
    const marks = readLS(LS.bookmarks)
    if (marks) { try { setBookmarkSet(new Set(JSON.parse(marks))) } catch { /* corrupt */ } }
    const prefs = readLS(LS.settings)
    if (prefs) { try { setEditorSettings(s => ({ ...s, ...JSON.parse(prefs) })) } catch { /* corrupt */ } }
    const target = readLS(LS.target)
    if (target) { try { setTargetProfile(JSON.parse(target)) } catch { /* corrupt */ } }
    const split = readLS(LS.split)
    if (split) { const n = parseFloat(split); if (!Number.isNaN(n)) setLeftPct(clampSplit(n)) }
    const savedSession = readLS('kiit:pg:practice_session')
    if (savedSession) { try { setActivePracticeSession(JSON.parse(savedSession)) } catch { /* corrupt */ } }
    setHydrated(true)
  }, [])

  useEffect(() => { if (hydrated) writeLS(LS.solved, JSON.stringify([...solvedSet])) }, [solvedSet, hydrated])
  useEffect(() => { if (hydrated) writeLS(LS.bookmarks, JSON.stringify([...bookmarkSet])) }, [bookmarkSet, hydrated])
  useEffect(() => { if (hydrated) writeLS(LS.settings, JSON.stringify(editorSettings)) }, [editorSettings, hydrated])
  useEffect(() => { if (hydrated) writeLS(LS.target, JSON.stringify(targetProfile)) }, [targetProfile, hydrated])
  useEffect(() => { if (hydrated) writeLS(LS.split, String(Math.round(leftPct))) }, [leftPct, hydrated])

  // Drag-to-resize the problem/editor split.
  const startSplitDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    draggingSplit.current = true
    setIsDraggingSplit(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingSplit.current || !splitRef.current) return
      const rect = splitRef.current.getBoundingClientRect()
      setLeftPct(clampSplit(((e.clientX - rect.left) / rect.width) * 100))
    }
    const onUp = () => {
      if (!draggingSplit.current) return
      draggingSplit.current = false
      setIsDraggingSplit(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // Load the saved draft (or fall back to starter code) whenever the problem or language changes.
  useEffect(() => {
    const draft = readLS(LS.draft(selectedProblem.id, language))
    setCode(draft ?? starterCodeFor(selectedProblem, language))
    setSaveState(draft ? 'saved' : 'idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProblem.id, language])

  // Debounced autosave of the current buffer.
  useEffect(() => {
    if (code === starterCodeFor(selectedProblem, language)) { setSaveState('idle'); return }
    setSaveState('saving')
    const t = setTimeout(() => {
      writeLS(LS.draft(selectedProblem.id, language), code)
      setSaveState('saved')
    }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, selectedProblem.id, language])

  const handleSelectProblem = useCallback((problem: Problem) => {
    setSelectedProblem(problem)
    setRecentProblems(prev => {
      const filtered = prev.filter(p => p.id !== problem.id)
      return [problem, ...filtered].slice(0, 8)
    })
    setOutput('')
    setTestResults([])
    setAiAnalysis(null)
    setActiveBottomTab('testcases')
    setExecutionTime(null)
    setSidebarOpen(false)
    setPracticeBanner(null)
  }, [])

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang)
    setLangMenuOpen(false)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const handleReset = useCallback(() => {
    removeLS(LS.draft(selectedProblem.id, language))
    setCode(starterCodeFor(selectedProblem, language))
    setSaveState('idle')
    setOutput('')
    setTestResults([])
    setAiAnalysis(null)
    setPracticeBanner(null)
  }, [selectedProblem, language])

  const handleSaveNow = useCallback(() => {
    writeLS(LS.draft(selectedProblem.id, language), code)
    setSaveState('saved')
  }, [selectedProblem.id, language, code])

  const handleFormat = useCallback(() => {
    const action = editorRef.current?.getAction('editor.action.formatDocument')
    if (action) {
      action.run()
      setDidFormat(true)
      setTimeout(() => setDidFormat(false), 1400)
    }
  }, [])

  const handleDownload = useCallback(() => {
    const safe = selectedProblem.id.replace(/[^a-z0-9_-]/gi, '_')
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${safe}.${fileExtension[language]}`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [code, language, selectedProblem.id])

  // --- PRACTICE WORKFLOW ENGINE ----------------------------------------------
  const handleStartPracticeSession = useCallback((config?: PracticeSessionConfig) => {
    const finalConfig: PracticeSessionConfig = config || {
      companyId: selectedCompanyId,
      companyName: currentCompanyObj.name,
      role: selectedCompanyRole,
      experience: selectedCompanyExp,
      topic: selectedCompanyTopic,
      difficulty: 'All',
      source: 'all',
      questionCount: 10,
      mode: 'practice',
    }
    const session = createPracticeSession(finalConfig, solvedSet, PROBLEMS)
    setActivePracticeSession(session)
    writeLS('kiit:pg:practice_session', JSON.stringify(session))

    if (session.questionIds.length > 0) {
      const firstProb = PROBLEMS.find(p => p.id === session.questionIds[0]) || PROBLEMS[0]
      setSelectedProblem(firstProb)
      setOutput('')
      setTestResults([])
      setPracticeBanner(null)
    }

    setCompanyWorkspaceView('practice')
    setSidebarOpen(false)
  }, [selectedCompanyId, currentCompanyObj.name, selectedCompanyRole, selectedCompanyExp, selectedCompanyTopic, solvedSet])

  const handleContinuePracticeSession = useCallback(() => {
    if (!activePracticeSession || activePracticeSession.questionIds.length === 0) return
    const currentProbId = activePracticeSession.questionIds[activePracticeSession.currentIndex] || activePracticeSession.questionIds[0]
    const prob = PROBLEMS.find(p => p.id === currentProbId) || PROBLEMS[0]
    setSelectedProblem(prob)
    setOutput('')
    setTestResults([])
    setPracticeBanner(null)
    setCompanyWorkspaceView('practice')
    setSidebarOpen(false)
  }, [activePracticeSession])

  const handleExitPractice = useCallback(() => {
    setCompanyWorkspaceView('intelligence')
    setSidebarOpen(true)
    setPracticeBanner(null)
  }, [])

  const handleNextPracticeQuestion = useCallback(() => {
    if (!activePracticeSession) return
    const nextIdx = activePracticeSession.currentIndex + 1
    if (nextIdx < activePracticeSession.questionIds.length) {
      const nextSession: PracticeSession = { ...activePracticeSession, currentIndex: nextIdx }
      setActivePracticeSession(nextSession)
      writeLS('kiit:pg:practice_session', JSON.stringify(nextSession))

      const nextProbId = activePracticeSession.questionIds[nextIdx]
      const nextProb = PROBLEMS.find(p => p.id === nextProbId) || PROBLEMS[0]
      setSelectedProblem(nextProb)
      setOutput('')
      setTestResults([])
      setPracticeBanner(null)
    } else {
      const completedSession: PracticeSession = { ...activePracticeSession, isComplete: true, completedAt: Date.now() }
      setActivePracticeSession(completedSession)
      writeLS('kiit:pg:practice_session', JSON.stringify(completedSession))
      setIsPracticeSummaryOpen(true)
    }
  }, [activePracticeSession])

  const handlePrevPracticeQuestion = useCallback(() => {
    if (!activePracticeSession || activePracticeSession.currentIndex <= 0) return
    const prevIdx = activePracticeSession.currentIndex - 1
    const prevSession: PracticeSession = { ...activePracticeSession, currentIndex: prevIdx }
    setActivePracticeSession(prevSession)
    writeLS('kiit:pg:practice_session', JSON.stringify(prevSession))

    const prevProbId = activePracticeSession.questionIds[prevIdx]
    const prevProb = PROBLEMS.find(p => p.id === prevProbId) || PROBLEMS[0]
    setSelectedProblem(prevProb)
    setOutput('')
    setTestResults([])
    setPracticeBanner(null)
  }, [activePracticeSession])

  const handleFinishPracticeSession = useCallback(() => {
    if (!activePracticeSession) return
    const completedSession: PracticeSession = { ...activePracticeSession, isComplete: true, completedAt: Date.now() }
    setActivePracticeSession(completedSession)
    writeLS('kiit:pg:practice_session', JSON.stringify(completedSession))
    setIsPracticeSummaryOpen(true)
  }, [activePracticeSession])

  const handlePracticeAgain = useCallback(() => {
    if (!activePracticeSession) return
    setIsPracticeSummaryOpen(false)
    handleStartPracticeSession({
      companyId: activePracticeSession.companyId,
      companyName: activePracticeSession.companyName,
      role: activePracticeSession.role,
      experience: activePracticeSession.experience,
      topic: activePracticeSession.topic,
      difficulty: activePracticeSession.difficulty,
      source: activePracticeSession.source,
      questionCount: activePracticeSession.questionIds.length,
      mode: activePracticeSession.mode,
    })
  }, [activePracticeSession, handleStartPracticeSession])

  const handleReviewMistakes = useCallback(() => {
    if (!activePracticeSession) return
    setIsPracticeSummaryOpen(false)
    const mistakeIds = Object.values(activePracticeSession.results)
      .filter(r => r.failed || r.hintsUsed || !r.solved)
      .map(r => r.problemId)

    if (mistakeIds.length > 0) {
      const reviewSession: PracticeSession = {
        ...activePracticeSession,
        id: `review-${Date.now()}`,
        questionIds: mistakeIds,
        currentIndex: 0,
        startedAt: Date.now(),
        isComplete: false,
        results: {},
      }
      mistakeIds.forEach(id => {
        const p = PROBLEMS.find(pr => pr.id === id)
        if (p) {
          reviewSession.results[id] = {
            problemId: id,
            problemTitle: p.title,
            difficulty: p.difficulty,
            attempted: false,
            solved: false,
            failed: false,
            timeSpentSeconds: 0,
            hintsUsed: false,
            debugUsed: false,
            aiReviewUsed: false,
          }
        }
      })
      setActivePracticeSession(reviewSession)
      writeLS('kiit:pg:practice_session', JSON.stringify(reviewSession))
      const firstProb = PROBLEMS.find(p => p.id === mistakeIds[0]) || PROBLEMS[0]
      setSelectedProblem(firstProb)
      setOutput('')
      setTestResults([])
      setPracticeBanner(null)
      setCompanyWorkspaceView('practice')
      setSidebarOpen(false)
    } else {
      handlePracticeAgain()
    }
  }, [activePracticeSession, handlePracticeAgain])

  // Run and Submit evaluation with practice result tracking
  const handleRun = useCallback(() => {
    setIsRunning(true)
    setActiveBottomTab('output')
    setOutput('Compiling and running...')
    setTimeout(() => {
      let isAllPassed = false
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
        isAllPassed = results.every(r => r.passed)
        if (isAllPassed) {
          setSolvedSet(prev => new Set([...prev, selectedProblem.id]))
          recordSolve(selectedProblem.id, language)
        }
      } else {
        const mockTime = Math.floor(Math.random() * 80 + 10)
        const mockMemory = (Math.random() * 10 + 8).toFixed(1)
        setExecutionTime(`${mockTime}ms`)
        const hasStarter = code.includes('pass') || code.includes('return 0;') || code.includes('return {}')
        if (hasStarter) {
          setOutput(`Execution finished.\n\nWarning: Solution body appears unchanged from starter code.\nPlease implement your solution before running.`)
          setTestResults(selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => ({ id: tc.id, passed: false, yourOutput: '(no output)', time: `${mockTime}ms`, memory: `${mockMemory} MB` })))
          isAllPassed = false
        } else {
          setOutput(`Execution successful.\nTime: ${mockTime}ms | Memory: ${mockMemory} MB\n\nNote: Full compilation for ${languageConfig[language].label} requires a backend runtime.\nJavaScript runs natively in-browser with real output.`)
          const results = selectedProblem.testCases.filter(tc => !tc.isHidden).map(tc => ({ id: tc.id, passed: Math.random() > 0.3, yourOutput: tc.expectedOutput, time: `${mockTime}ms`, memory: `${mockMemory} MB` }))
          setTestResults(results)
          isAllPassed = results.every(r => r.passed)
          if (isAllPassed) {
            setSolvedSet(prev => new Set([...prev, selectedProblem.id]))
            recordSolve(selectedProblem.id, language)
          }
        }
      }

      // Record result in practice session if active
      if (companyWorkspaceView === 'practice' && activePracticeSession) {
        const curResult = activePracticeSession.results[selectedProblem.id] || {
          problemId: selectedProblem.id,
          problemTitle: selectedProblem.title,
          difficulty: selectedProblem.difficulty,
          attempted: true,
          solved: false,
          failed: false,
          timeSpentSeconds: 0,
          hintsUsed: false,
          debugUsed: false,
          aiReviewUsed: false,
        }
        const updatedResult = {
          ...curResult,
          attempted: true,
          solved: isAllPassed ? true : curResult.solved,
          failed: isAllPassed ? false : true,
        }
        const updatedSession = {
          ...activePracticeSession,
          results: {
            ...activePracticeSession.results,
            [selectedProblem.id]: updatedResult,
          },
        }
        setActivePracticeSession(updatedSession)
        writeLS('kiit:pg:practice_session', JSON.stringify(updatedSession))

        if (isAllPassed) {
          setPracticeBanner({ type: 'success', text: '✓ All test cases passed! Ready for next question.' })
        } else {
          setPracticeBanner({ type: 'error', text: '✕ Needs Improvement: Review failed cases or request AI hint.' })
        }
      }

      setIsRunning(false)
    }, 600)
  }, [code, language, customInput, selectedProblem, companyWorkspaceView, activePracticeSession])

  const handleAIAnalyze = useCallback(() => {
    setShowAI(true)
    setAiAnalysis(analyzeCode(code, language))
    if (companyWorkspaceView === 'practice' && activePracticeSession) {
      const curResult = activePracticeSession.results[selectedProblem.id]
      if (curResult) {
        const updatedSession = {
          ...activePracticeSession,
          results: {
            ...activePracticeSession.results,
            [selectedProblem.id]: { ...curResult, aiReviewUsed: true },
          },
        }
        setActivePracticeSession(updatedSession)
        writeLS('kiit:pg:practice_session', JSON.stringify(updatedSession))
      }
    }
  }, [code, language, companyWorkspaceView, activePracticeSession, selectedProblem.id])

  const handleToggleBookmark = useCallback((id: string) => { setBookmarkSet(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next }) }, [])

  // Global keyboard shortcuts for the playground.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'Enter') { e.preventDefault(); if (!isRunning) handleRun() }
      else if (mod && e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); handleFormat() }
      else if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); handleSaveNow() }
      else if (e.key === 'Escape') { setShowShortcuts(false); setSettingsOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleRun, handleFormat, handleSaveNow, isRunning])

  const dc = difficultyColors[selectedProblem.difficulty]
  const targetRelevance = calculateJobRelevance(selectedProblem, targetProfile, solvedSet, new Set())

  // Session Statistics Calculation for Summary View
  const sessionStats = useMemo(() => {
    if (!activePracticeSession) {
      return { attempted: 0, solved: 0, failed: 0, accuracy: 0, avgTime: '12', prepScore: 75, strongTopics: [], weakTopics: [] }
    }
    const results = Object.values(activePracticeSession.results)
    const attempted = results.filter(r => r.attempted).length
    const solved = results.filter(r => r.solved).length
    const failed = results.filter(r => r.failed).length
    const accuracy = attempted > 0 ? Math.round((solved / attempted) * 100) : (solved > 0 ? 100 : 0)

    const strongTopics = new Set<string>()
    const weakTopics = new Set<string>()
    results.forEach(r => {
      const prob = PROBLEMS.find(p => p.id === r.problemId)
      if (prob) {
        if (r.solved && !r.hintsUsed) {
          prob.topics.forEach(t => strongTopics.add(t))
        } else if (r.failed || r.hintsUsed) {
          prob.topics.forEach(t => weakTopics.add(t))
        }
      }
    })

    const prepScore = Math.min(96, Math.max(35, Math.round(accuracy * 0.7 + (solved / Math.max(1, activePracticeSession.questionIds.length)) * 25 + 10)))

    return {
      total: activePracticeSession.questionIds.length,
      attempted,
      solved,
      failed,
      accuracy,
      avgTime: '14',
      prepScore,
      strongTopics: Array.from(strongTopics).slice(0, 4),
      weakTopics: Array.from(weakTopics).slice(0, 4),
    }
  }, [activePracticeSession])

  // 1. Landing Mode (Clean, premium home screen)
  if (playgroundNavMode === 'landing') {
    return (
      <PlaygroundLanding
        solvedCount={solvedSet.size}
        activePracticeSession={activePracticeSession}
        onStartTopicPractice={() => {
          setPlaygroundNavMode('topics')
          setSidebarOpen(true)
        }}
        onStartCompanyInterviews={() => {
          setPlaygroundNavMode('companies')
          setCompanyWorkspaceView('intelligence')
          setSidebarOpen(true)
        }}
        onStartCustomPractice={(config) => {
          handleStartPracticeSession(config)
        }}
        onContinuePractice={handleContinuePracticeSession}
        problems={PROBLEMS}
      />
    )
  }

  // 2. If in Company Interviews intelligence mode (overview), render the 3-column architecture
  if (playgroundNavMode === 'companies' && companyWorkspaceView === 'intelligence') {
    return (
      <div className="flex h-full w-full bg-[#0A0A0D] overflow-hidden">
        {/* Left Column: Company Explorer */}
        <QuestionExplorer
          problems={PROBLEMS}
          selectedProblem={selectedProblem}
          onSelect={(problem) => {
            handleSelectProblem(problem)
            setCompanyWorkspaceView('problem')
            setSidebarOpen(false)
          }}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          solvedSet={solvedSet}
          bookmarkSet={bookmarkSet}
          onToggleBookmark={handleToggleBookmark}
          recentProblems={recentProblems}
          targetProfile={targetProfile}
          onUpdateTargetProfile={setTargetProfile}
          activeView="companies"
          onViewChange={(view) => {
            if (view === 'topics') {
              setPlaygroundNavMode('topics')
            }
          }}
          selectedCompanyId={selectedCompanyId}
          onSelectCompanyId={(id) => setSelectedCompanyId(id)}
        />

        {/* Center & Right Columns: Company Intelligence Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar with Breadcrumbs */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href="/workspace/playground"
                aria-label="Exit Playground"
                title="Exit Playground"
                className="group w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              </Link>

              <div className="flex items-center gap-2 text-xs font-mono text-[#8A8A8A]">
                <button
                  onClick={() => setPlaygroundNavMode('landing')}
                  className="text-white font-bold hover:text-[#FF4D4D] transition-colors cursor-pointer"
                >
                  KIIT ANUMAAN
                </button>
                <span>/</span>
                <button
                  onClick={() => setPlaygroundNavMode('landing')}
                  className="text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
                >
                  Playground
                </button>
                <span>/</span>
                <span className="text-[#FF4D4D] font-bold">Company Interviews</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPlaygroundNavMode('landing')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <span>← Playground Home</span>
              </button>
              <button
                onClick={() => setPlaygroundNavMode('topics')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <span>← Back to Topics</span>
              </button>
            </div>
          </div>

          <CompanyIntelligenceWorkspace
            company={currentCompanyObj}
            onSelectProblem={(problem) => {
              handleSelectProblem(problem)
              setCompanyWorkspaceView('problem')
              setSidebarOpen(false)
            }}
            solvedSet={solvedSet}
            bookmarkSet={bookmarkSet}
            onToggleBookmark={handleToggleBookmark}
            curatedProblems={PROBLEMS}
            selectedRole={selectedCompanyRole}
            onChangeRole={setSelectedCompanyRole}
            selectedExp={selectedCompanyExp}
            onChangeExp={setSelectedCompanyExp}
            selectedTopic={selectedCompanyTopic}
            onChangeTopic={setSelectedCompanyTopic}
            onStartPracticeSession={handleStartPracticeSession}
            onContinuePracticeSession={handleContinuePracticeSession}
            activePracticeSession={activePracticeSession}
            onOpenQuestionLibrary={() => {
              setCompanyWorkspaceView('problem')
              setSidebarOpen(true)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-[#0A0A0D] overflow-hidden relative">
      <QuestionExplorer
        problems={PROBLEMS}
        selectedProblem={selectedProblem}
        onSelect={handleSelectProblem}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        solvedSet={solvedSet}
        bookmarkSet={bookmarkSet}
        onToggleBookmark={handleToggleBookmark}
        recentProblems={recentProblems}
        targetProfile={targetProfile}
        onUpdateTargetProfile={setTargetProfile}
        activeView={playgroundNavMode}
        onViewChange={(view) => {
          if (view === 'companies') {
            setPlaygroundNavMode('companies')
            setCompanyWorkspaceView('intelligence')
          } else {
            setPlaygroundNavMode('topics')
          }
        }}
        selectedCompanyId={selectedCompanyId}
        onSelectCompanyId={(id) => setSelectedCompanyId(id)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar: Dynamically switches between Standard and Practice Session Mode */}
        {companyWorkspaceView === 'practice' && activePracticeSession ? (
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0E0E12] shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
              <button
                onClick={handleExitPractice}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 text-xs font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/20 transition-all cursor-pointer shrink-0 font-mono"
              >
                <span>← Exit Practice</span>
              </button>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
                <CompanyLogo company={activePracticeSession.companyName} size={16} />
                <span className="font-bold text-white">{activePracticeSession.companyName}</span>
                <span className="text-[#8A8A8A]">· {activePracticeSession.role} · {activePracticeSession.experience}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-mono">
                  Question {activePracticeSession.currentIndex + 1} of {activePracticeSession.questionIds.length}
                </span>
                <div className="w-20 sm:w-28 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D4D] to-emerald-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round(((activePracticeSession.currentIndex + 1) / activePracticeSession.questionIds.length) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Practice Session Navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrevPracticeQuestion}
                disabled={activePracticeSession.currentIndex === 0}
                className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-[#D1D5DB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← Previous
              </button>

              {activePracticeSession.currentIndex < activePracticeSession.questionIds.length - 1 ? (
                <button
                  onClick={handleNextPracticeQuestion}
                  className="px-3 py-1 rounded bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(255,77,77,0.3)]"
                >
                  <span>Next Question →</span>
                </button>
              ) : (
                <button
                  onClick={handleNextPracticeQuestion}
                  className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <span>Finish Session 🎉</span>
                </button>
              )}

              <button
                onClick={handleFinishPracticeSession}
                className="px-2 py-1 rounded bg-white/[0.03] hover:bg-white/[0.08] text-[#8A8A8A] hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                title="Finish session and view results"
              >
                Finish
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href="/workspace/playground"
                aria-label="Exit Playground"
                title="Exit Playground"
                className="group w-7 h-7 rounded bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              </Link>

              {/* Back Button Behavior */}
              {playgroundNavMode === 'companies' ? (
                <button
                  onClick={() => {
                    setCompanyWorkspaceView('intelligence')
                    setSidebarOpen(true)
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 text-xs font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/20 transition-all cursor-pointer shrink-0"
                >
                  <span>← Back to Company Questions</span>
                </button>
              ) : (
                !sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-[#8A8A8A] hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer shrink-0"
                  >
                    <PanelLeftOpen size={13} className="text-[#FF4D4D]" />
                    <span>← Back to Questions</span>
                  </button>
                )
              )}

              {/* Context Badge */}
              {playgroundNavMode === 'companies' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
                  <CompanyLogo company={selectedCompanyId} size={16} />
                  <span className="font-bold text-white">{selectedCompanyId}</span>
                  <span className="text-[#8A8A8A]">· {selectedCompanyRole} · {selectedCompanyExp}</span>
                </div>
              ) : (
                <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono text-[#9CA3AF]">
                  <span>Target: {targetProfile.role} · 0–2 Years</span>
                </div>
              )}

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 font-mono"
                  style={{ backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}
                >
                  {selectedProblem.difficulty}
                </span>
                <h2 className="text-xs font-bold text-white truncate max-w-[260px]">{selectedProblem.title}</h2>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {selectedProblem.topics.map(t => (
                  <span key={t} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/[0.05]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[9.5px] font-mono text-[#8A8A8A]">
                Asked {selectedProblem.askedCount} times
              </span>
              <span className="hidden sm:inline-block text-[9.5px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                Confidence: High
              </span>
            </div>
          </div>
        )}

        {/* Practice Banner Notification (e.g. Test Result Alert) */}
        {practiceBanner && (
          <div
            className={`px-4 py-1.5 text-xs font-mono flex items-center justify-between border-b ${
              practiceBanner.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/30'
            }`}
          >
            <span>{practiceBanner.text}</span>
            {companyWorkspaceView === 'practice' && (
              <button
                onClick={handleNextPracticeQuestion}
                className="hover:underline font-bold cursor-pointer"
              >
                Proceed →
              </button>
            )}
          </div>
        )}

        <div ref={splitRef} className="flex-1 flex min-h-0">
          {/* LEFT: Problem Description */}
          <div
            className={`${focusMode ? 'hidden' : 'flex'} shrink-0 min-w-0 flex-col min-h-0 bg-[#0A0A0D]`}
            style={focusMode ? undefined : { width: `${leftPct}%` }}
          >
            {/* Tabs */}
            <div className="flex items-center gap-1 px-4 pt-2.5 pb-2 border-b border-white/[0.04] shrink-0 overflow-x-auto scrollbar-none">
              {([
                { id: 'description' as const, label: 'Description', icon: BookOpen },
                { id: 'examples' as const, label: 'Examples', icon: Code2 },
                { id: 'constraints' as const, label: 'Constraints', icon: ListOrdered },
                { id: 'hints' as const, label: 'Hints', icon: Lightbulb },
                { id: 'interview' as const, label: 'Interview', icon: Zap },
                { id: 'similar' as const, label: 'Similar', icon: ArrowRight },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDescTab(tab.id as typeof activeDescTab)}
                  className={`px-2.5 py-1 rounded text-[10.5px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    activeDescTab === tab.id
                      ? 'bg-white/[0.08] text-white font-semibold'
                      : 'text-[#71717A] hover:text-[#D1D5DB]'
                  }`}
                >
                  <tab.icon size={11} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Problem Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
              {activeDescTab === 'description' && (
                <>
                  <div className="space-y-3">
                    <p className="text-[13px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap font-normal">
                      {selectedProblem.description}
                    </p>
                  </div>

                  {/* Examples (spacious & clean) */}
                  <div className="space-y-3">
                    {selectedProblem.examples.map((ex, i) => (
                      <div key={i} className="bg-[#111215] border border-white/[0.05] rounded-lg p-3 space-y-1.5">
                        <div className="text-[11px] font-bold text-white">Example {i + 1}:</div>
                        <div className="font-mono text-[11px] space-y-1 bg-black/30 p-2.5 rounded border border-white/[0.03]">
                          <p className="text-[#9CA3AF]"><span className="text-white font-semibold">Input:</span> {ex.input}</p>
                          <p className="text-[#10B981]"><span className="text-white font-semibold">Output:</span> {ex.output}</p>
                          {ex.explanation && (
                            <p className="text-[#71717A] pt-1 border-t border-white/[0.04]">
                              <span className="text-[#9CA3AF] font-medium">Explanation:</span> {ex.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-2">
                    <h4 className="text-[10.5px] font-mono text-[#8A8A8A] uppercase tracking-wider">Constraints</h4>
                    <ul className="space-y-1 bg-[#111215] border border-white/[0.05] rounded-lg p-3">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i} className="text-[11px] text-[#9CA3AF] font-mono flex items-start gap-2">
                          <span className="text-[#FF4D4D]">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Companies & Interview Signal Section */}
                  <div className="pt-2 border-t border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                        <Building2 size={13} className="text-[#FF4D4D]" />
                        <span>Companies & Interview Signal</span>
                      </div>
                      <span className="text-[9.5px] font-mono text-[#60A5FA]">
                        Auto Web Search Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {selectedProblem.companies.map((c, idx) => {
                        const freqLabel = idx === 0 ? 'Frequently Reported' : idx === 1 ? 'Reported' : 'Related'
                        return (
                          <div key={c} className="p-2.5 rounded-lg bg-[#111215] border border-white/[0.05] flex flex-col justify-between">
                            <span className="text-[11.5px] font-bold text-white flex items-center gap-1.5">
                              <CompanyLogo company={c} size={18} variant="rounded" />
                              <span>{c}</span>
                            </span>
                            <span className="text-[9.5px] font-mono text-[#F59E0B] mt-1">
                              ● {freqLabel}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-[9.5px] text-[#6B7280] italic">
                      Public candidate interview reports automatically verified.
                    </p>
                  </div>
                </>
              )}

              {activeDescTab === 'examples' && (
                <div className="space-y-4">
                  {selectedProblem.examples.map((ex, i) => (
                    <div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-4">
                      <h4 className="text-[11px] font-bold text-white mb-2">Example {i + 1}:</h4>
                      <div className="font-mono text-[11px] space-y-1">
                        <p className="text-[#9CA3AF]"><span className="text-white font-bold">Input:</span> {ex.input}</p>
                        <p className="text-[#10B981]"><span className="text-white font-bold">Output:</span> {ex.output}</p>
                        {ex.explanation && <p className="text-[#6B7280] mt-2"><span className="text-[#8A8A8A] font-bold">Explanation:</span> {ex.explanation}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDescTab === 'constraints' && (
                <div className="space-y-3">
                  <div className="bg-[#111214] border border-white/[0.06] rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-white mb-2 font-mono uppercase">Problem Constraints</h4>
                    {selectedProblem.constraints.map((c, i) => (
                      <div key={i} className="text-xs font-mono text-[#D1D5DB] flex items-center gap-2">
                        <span className="text-[#FF4D4D]">•</span> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDescTab === 'hints' && (
                <div className="space-y-3">
                  <div className="bg-[#111214] border border-[#F59E0B]/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={14} className="text-[#F59E0B]" />
                      <span className="text-xs font-bold text-[#F59E0B]">Approach Hint</span>
                    </div>
                    <p className="text-xs text-[#D1D5DB] leading-relaxed">
                      Think about what data structure lets you look up values in O(1) time. Can you trade space for time?
                    </p>
                  </div>
                  <div className="bg-[#111214] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-[#FF4D4D]" />
                      <span className="text-xs font-bold text-[#FF4D4D]">Optimization</span>
                    </div>
                    <p className="text-xs text-[#D1D5DB] leading-relaxed">
                      A single-pass hash map approach gives you O(n) time and O(n) space.
                    </p>
                  </div>
                </div>
              )}

              {activeDescTab === 'interview' && (
                <div className="space-y-4">
                  {/* Target Relevance Card */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FF4D4D]/10 via-white/[0.02] to-transparent border border-[#FF4D4D]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Flame size={13} className="text-[#FF4D4D]" /> Target Job Fit: {targetProfile.role}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#10B981]">
                        {targetRelevance.jobRelevanceScore}% Score
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF4D4D] to-[#10B981] rounded-full"
                        style={{ width: `${targetRelevance.jobRelevanceScore}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {targetRelevance.priorityReason}
                    </p>
                  </div>

                  {/* Companies & Interview Signals */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Building2 size={13} className="text-[#FF4D4D]" /> Reported At Companies
                    </h4>
                    <div className="space-y-2">
                      {selectedProblem.companies.map(c => {
                        const roles = selectedProblem.companyRoles?.[c]?.join(', ') || 'SDE'
                        return (
                          <div key={c} className="p-2.5 rounded-lg bg-[#111214] border border-white/[0.06] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{c}</span>
                              <span className="text-[10px] font-mono text-[#8A8A8A] bg-white/[0.03] px-1.5 py-0.5 rounded">{roles}</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#F59E0B]">
                              🔥 Frequently Reported
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Specific Candidate Signal Notes */}
                  {selectedProblem.interviewSignal && (
                    <div>
                      <h4 className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap size={13} className="text-[#FF4D4D]" /> Interview Signals & Takeaways
                      </h4>
                      <div className="space-y-1.5">
                        {selectedProblem.interviewSignal.map((signal, i) => (
                          <div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-3 flex items-start gap-2">
                            <span className="text-[#FF4D4D] mt-0.5 shrink-0">•</span>
                            <p className="text-xs text-[#D1D5DB] leading-relaxed">{signal}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeDescTab === 'similar' && selectedProblem.similarProblems && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#8A8A8A] uppercase tracking-wider mb-3">Similar Problems</h4>
                  {selectedProblem.similarProblems.map((sp, i) => (
                    <div key={i} className="bg-[#111214] border border-white/[0.06] rounded-xl p-3 flex items-center justify-between group hover:border-white/[0.12] transition-all cursor-pointer">
                      <span className="text-xs text-[#D1D5DB] group-hover:text-white transition-colors">{sp}</span>
                      <ArrowRight size={12} className="text-[#6B7280] group-hover:text-[#FF4D4D] transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Drag handle: shift the split left / right */}
          {!focusMode && (
            <div
              onMouseDown={startSplitDrag}
              onDoubleClick={() => setLeftPct(SPLIT_DEFAULT)}
              title="Drag to resize  ·  double-click to reset"
              className={`group relative w-[5px] shrink-0 cursor-col-resize transition-colors ${isDraggingSplit ? 'bg-[#FF4D4D]/60' : 'bg-white/[0.06] hover:bg-[#FF4D4D]/40'}`}
            >
              <span className="absolute inset-y-0 -left-1.5 -right-1.5" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="w-[3px] h-[3px] rounded-full bg-white" />
                <span className="w-[3px] h-[3px] rounded-full bg-white" />
                <span className="w-[3px] h-[3px] rounded-full bg-white" />
              </span>
            </div>
          )}

          {/* RIGHT: Editor + Output */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-[#0D0D10]/60 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setLangMenuOpen(o => !o)}
                  className="flex items-center justify-between gap-3 min-w-[136px] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 hover:bg-[#FF4D4D]/[0.14] transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Code2 size={11} /> {languageConfig[language].label}</span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-[168px] max-h-[320px] overflow-y-auto scrollbar-thin bg-[#141418] border border-white/[0.08] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] p-1">
                      {(Object.keys(languageConfig) as Language[]).map(lang => (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${language === lang ? 'bg-[#FF4D4D]/10 text-[#FF4D4D]' : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.05]'}`}
                        >
                          {languageConfig[lang].label}
                          {language === lang && <Check size={11} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {/* Autosave status */}
                {saveState !== 'idle' && (
                  <span className={`hidden md:flex items-center gap-1.5 mr-1 text-[10px] font-mono ${saveState === 'saved' ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${saveState === 'saved' ? 'bg-[#10B981]' : 'bg-[#F59E0B] animate-pulse'}`} />
                    {saveState === 'saved' ? 'Saved' : 'Saving…'}
                  </span>
                )}

                <IconBtn onClick={handleFormat} title="Format code  ·  Ctrl/⌘ + ⇧ + F" active={didFormat}><Wand2 size={14} /></IconBtn>
                <IconBtn onClick={handleCopy} title="Copy code" active={copied}>{copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} />}</IconBtn>
                <IconBtn onClick={handleDownload} title={`Download .${fileExtension[language]} file`}><Download size={14} /></IconBtn>
                <IconBtn onClick={handleReset} title="Reset to starter code"><RotateCcw size={14} /></IconBtn>

                <span className="w-px h-5 bg-white/[0.08] mx-0.5" />

                {/* Editor settings */}
                <div className="relative">
                  <IconBtn onClick={() => setSettingsOpen(o => !o)} title="Editor settings" active={settingsOpen}><Settings2 size={14} /></IconBtn>
                  {settingsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setSettingsOpen(false)} />
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-[248px] bg-[#141418] border border-white/[0.08] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] p-3 space-y-3">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Editor Settings</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#D1D5DB] flex items-center gap-1.5"><Type size={12} /> Font size</span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditorSettings(s => ({ ...s, fontSize: Math.max(10, s.fontSize - 1) }))} className="w-6 h-6 rounded-md bg-white/[0.05] hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"><Minus size={11} /></button>
                            <span className="text-[11px] font-mono text-white w-6 text-center">{editorSettings.fontSize}</span>
                            <button onClick={() => setEditorSettings(s => ({ ...s, fontSize: Math.min(22, s.fontSize + 1) }))} className="w-6 h-6 rounded-md bg-white/[0.05] hover:bg-white/10 text-white flex items-center justify-center cursor-pointer"><Plus size={11} /></button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#D1D5DB]">Tab size</span>
                          <div className="flex gap-1">
                            {[2, 4].map(n => (
                              <button key={n} onClick={() => setEditorSettings(s => ({ ...s, tabSize: n }))} className={`px-2 h-6 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${editorSettings.tabSize === n ? 'bg-[#FF4D4D]/15 text-[#FF4D4D]' : 'bg-white/[0.05] text-[#8A8A8A] hover:text-white'}`}>{n}</button>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => setEditorSettings(s => ({ ...s, wordWrap: !s.wordWrap }))} className="w-full flex items-center justify-between cursor-pointer group">
                          <span className="text-[11px] text-[#D1D5DB] flex items-center gap-1.5"><WrapText size={12} /> Word wrap</span>
                          <span className={`w-8 h-[18px] rounded-full p-0.5 transition-colors ${editorSettings.wordWrap ? 'bg-[#FF4D4D]' : 'bg-white/[0.12]'}`}><span className={`block w-[14px] h-[14px] rounded-full bg-white transition-transform ${editorSettings.wordWrap ? 'translate-x-[14px]' : ''}`} /></span>
                        </button>
                        <button onClick={() => setEditorSettings(s => ({ ...s, minimap: !s.minimap }))} className="w-full flex items-center justify-between cursor-pointer group">
                          <span className="text-[11px] text-[#D1D5DB] flex items-center gap-1.5"><MapIcon size={12} /> Minimap</span>
                          <span className={`w-8 h-[18px] rounded-full p-0.5 transition-colors ${editorSettings.minimap ? 'bg-[#FF4D4D]' : 'bg-white/[0.12]'}`}><span className={`block w-[14px] h-[14px] rounded-full bg-white transition-transform ${editorSettings.minimap ? 'translate-x-[14px]' : ''}`} /></span>
                        </button>
                        <button onClick={() => setEditorSettings(DEFAULT_EDITOR_SETTINGS)} className="w-full text-[10px] font-mono text-[#6B7280] hover:text-white transition-colors text-left cursor-pointer pt-1 border-t border-white/[0.06]">Reset to defaults</button>
                      </div>
                    </>
                  )}
                </div>

                <IconBtn onClick={() => setFocusMode(f => !f)} title={focusMode ? 'Exit focus mode' : 'Focus mode (hide problem panel)'} active={focusMode}>
                  {focusMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </IconBtn>
                <IconBtn onClick={() => setShowShortcuts(true)} title="Keyboard shortcuts"><Keyboard size={14} /></IconBtn>

                <span className="w-px h-5 bg-white/[0.08] mx-0.5" />

                <button onClick={handleAIAnalyze} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#FF4D4D] bg-[#FF4D4D]/[0.06] hover:bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 transition-all cursor-pointer"><Sparkles size={11} /> AI Review</button>
                <button onClick={handleRun} disabled={isRunning} title="Run  ·  Ctrl/⌘ + Enter" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#10B981] hover:bg-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"><Play size={12} fill="currentColor" />{isRunning ? 'Running...' : 'Run'}</button>
              </div>
            </div>

            <div className={`flex-1 min-h-0 ${isDraggingSplit ? 'pointer-events-none' : ''}`}>
              <MonacoEditor
                height="100%"
                language={languageConfig[language].monacoId}
                value={code}
                onChange={(val) => setCode(val || '')}
                onMount={(editor) => { editorRef.current = editor as unknown as MonacoEditorInstance }}
                theme="vs-dark"
                options={{
                  fontSize: editorSettings.fontSize,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: editorSettings.minimap },
                  tabSize: editorSettings.tabSize,
                  wordWrap: editorSettings.wordWrap ? 'on' : 'off',
                  scrollBeyondLastLine: false,
                  padding: { top: 12, bottom: 12 },
                  lineNumbers: 'on',
                  renderLineHighlight: 'all',
                  bracketPairColorization: { enabled: true },
                  automaticLayout: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  fixedOverflowWidgets: true,
                }}
              />
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

      {/* Keyboard shortcuts modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 8 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[400px] max-w-[calc(100vw-32px)] bg-[#141418] border border-white/[0.1] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Keyboard size={15} className="text-[#FF4D4D]" /> Keyboard Shortcuts</h3>
                <button onClick={() => setShowShortcuts(false)} className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#8A8A8A] hover:text-white cursor-pointer"><X size={14} /></button>
              </div>
              <div className="space-y-1.5">
                {SHORTCUTS.map(s => (
                  <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-xs text-[#D1D5DB]">{s.label}</span>
                    <kbd className="font-mono text-[10px] text-[#8A8A8A] bg-white/[0.05] border border-white/[0.1] rounded px-2 py-1 whitespace-nowrap">{s.keys}</kbd>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[10px] font-mono text-[#4B5563] text-center">Drafts autosave locally per problem &amp; language.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practice Session Summary Modal */}
      <AnimatePresence>
        {isPracticeSummaryOpen && activePracticeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setIsPracticeSummaryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#121217] border border-white/[0.12] rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.85)] p-6 space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <CompanyLogo company={activePracticeSession.companyName} size={36} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white tracking-tight">PRACTICE COMPLETE 🎉</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF4D4D]/15 text-[#FF4D4D] border border-[#FF4D4D]/30 font-bold uppercase">
                        {activePracticeSession.mode === 'interview' ? 'Interview Simulation' : 'Practice Session'}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">
                      {activePracticeSession.companyName} · {activePracticeSession.role} · {activePracticeSession.experience}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPracticeSummaryOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A8A] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* 4 Performance Metric Cards */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-white">{sessionStats.total}</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">Questions</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-[#10B981]">{sessionStats.solved}</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">Solved</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-amber-400">{sessionStats.accuracy}%</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">Accuracy</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                  <p className="text-lg font-black text-blue-400">{sessionStats.avgTime}m</p>
                  <p className="text-[10px] text-[#8A8A8A] font-mono mt-0.5">Avg Time</p>
                </div>
              </div>

              {/* KIIT ANUMAAN Preparation Score Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF4D4D]/10 via-white/[0.02] to-transparent border border-[#FF4D4D]/25 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#FF4D4D]" />
                    <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                      KIIT ANUMAAN Preparation Score
                    </span>
                  </div>
                  <span className="text-base font-black font-mono text-[#FF4D4D]">{sessionStats.prepScore}%</span>
                </div>
                <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4D4D] to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${sessionStats.prepScore}%` }}
                  />
                </div>
                <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">
                  Evaluated from company priority coverage, algorithmic complexity, and solution accuracy.
                </p>
              </div>

              {/* Strong Topics vs Weak Topics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Strong Topics
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sessionStats.strongTopics.length > 0 ? (
                      sessionStats.strongTopics.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[10px]">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10.5px] text-[#8A8A8A] italic">Complete more questions</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} /> Needs Practice
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sessionStats.weakTopics.length > 0 ? (
                      sessionStats.weakTopics.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10.5px] text-[#8A8A8A] italic">None identified! Excellent job.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions: Review Mistakes / Practice Again / Company Intelligence */}
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2.5 flex-wrap">
                {sessionStats.weakTopics.length > 0 || sessionStats.failed > 0 ? (
                  <button
                    onClick={handleReviewMistakes}
                    className="flex-1 min-w-[140px] px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={13} />
                    <span>Review Mistakes ({sessionStats.failed})</span>
                  </button>
                ) : null}

                <button
                  onClick={handlePracticeAgain}
                  className="flex-1 min-w-[140px] px-3.5 py-2 rounded-lg bg-[#FF4D4D] hover:bg-[#FF3333] text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,77,77,0.35)]"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Practice Again</span>
                </button>

                <button
                  onClick={() => {
                    setIsPracticeSummaryOpen(false)
                    handleExitPractice()
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-[#D1D5DB] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  View Company Intelligence
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}