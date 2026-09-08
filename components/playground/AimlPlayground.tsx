'use client'

// ---------------------------------------------------------------------------
// AI / ML Lab — three practice surfaces on top of the AI/ML interview track:
//   • Interview Drill   — answer questions, self-grade against the outline
//   • Estimation Lab    — back-of-envelope calculators with live maths
//   • Algorithm Lab     — parameterise and run small ML algorithms
// Full-bleed workspace, same shell idiom as the SQL / System Design playgrounds.
// ---------------------------------------------------------------------------

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState, type ReactNode, type ComponentType } from 'react'
import {
  ArrowLeft, Play, Check, CheckCircle2, ChevronDown, ChevronRight, ChevronLeft,
  Eye, EyeOff, Lightbulb, ExternalLink, PanelLeftClose, PanelLeftOpen, Calculator, FlaskConical,
  Sparkles, RotateCcw, Cpu, SlidersHorizontal, ClipboardCheck, ShieldCheck, Database,
  Bot, Workflow, Boxes, Trophy, ScanLine, GitBranch, Network, ListChecks, FileCode2, Loader2,
  Copy, Pin, PinOff, Sigma, SkipForward,
} from 'lucide-react'
import {
  DRILL_TOPICS, DRILL_QUESTIONS, drillOf, LEVEL_COLOR,
  ESTIMATORS, ALGO_LABS, AIML_LAB_STATS,
  type DrillQuestion, type Estimator, type EstimatorOutput, type AlgoLabMeta,
} from '@/lib/aiml-lab-data'
import { NOTEBOOKS, type Notebook } from '@/lib/aiml-notebook-data'
import { DRILL_CONCEPTS } from '@/lib/aiml-drill-concepts'
import { DRILL_CONSOLES, drillConsoleFor, type DrillBrief } from '@/lib/aiml-drill-consoles'
import { AlgoLab } from './AimlAlgoLabs'

const AimlNotebook = dynamic(() => import('./AimlNotebook'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-full w-full items-center justify-center gap-3 bg-[#0A0A0D] text-[#6B7280]">
      <Loader2 size={20} className="animate-spin text-[#FF4D4D]" />
      <p className="text-[12px] font-mono">loading notebook…</p>
    </div>
  ),
})

const ACCENT = '#FF4D4D'

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  cpu: Cpu, sliders: SlidersHorizontal, clipboard: ClipboardCheck, shield: ShieldCheck,
  database: Database, bot: Bot, workflow: Workflow, boxes: Boxes, trophy: Trophy,
  scan: ScanLine, gitbranch: GitBranch, network: Network, sigma: Sigma,
}
const TopicIcon = ({ name, ...p }: { name: string; size?: number; className?: string }) => {
  const C = ICONS[name] ?? Sparkles
  return <C {...p} />
}

// -- localStorage keys ----------------------------------------------------
const CONFIDENT_KEY = 'kiit:aiml:drill:confident'
const ATTEMPT_KEY = 'kiit:aiml:drill:attempted'
const ALGO_SEEN_KEY = 'kiit:aiml:algo:seen'

type Mode = 'browse' | 'drill' | 'estimation' | 'algo' | 'notebook'

const readSet = (k: string): Set<string> => {
  try {
    const raw = window.localStorage.getItem(k)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}
const writeSet = (k: string, s: Set<string>) => {
  try { window.localStorage.setItem(k, JSON.stringify([...s])) } catch { /* quota */ }
}

// =========================================================================

export default function AimlPlayground() {
  const [mode, setMode] = useState<Mode>('browse')
  const [drill, setDrill] = useState<DrillQuestion | null>(null)
  const [estimator, setEstimator] = useState<Estimator | null>(null)
  const [algo, setAlgo] = useState<AlgoLabMeta | null>(null)

  const [notebookId, setNotebookId] = useState<string>(NOTEBOOKS[0].id)
  const [drillConsole, setDrillConsole] = useState<{ notebook: Notebook; brief: DrillBrief } | null>(null)

  const [confident, setConfident] = useState<Set<string>>(new Set())
  const [attempted, setAttempted] = useState<Set<string>>(new Set())
  const [algoSeen, setAlgoSeen] = useState<Set<string>>(new Set())

  useEffect(() => {
    setConfident(readSet(CONFIDENT_KEY))
    setAttempted(readSet(ATTEMPT_KEY))
    setAlgoSeen(readSet(ALGO_SEEN_KEY))
  }, [])

  const markConfident = useCallback((id: string) => {
    setConfident((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      writeSet(CONFIDENT_KEY, next)
      return next
    })
  }, [])
  const markAttempt = useCallback((id: string) => {
    setAttempted((prev) => {
      if (prev.has(id)) return prev
      const next = new Set([...prev, id]); writeSet(ATTEMPT_KEY, next); return next
    })
  }, [])

  const openDrill = useCallback((q: DrillQuestion) => {
    setDrill(q); markAttempt(q.id); setMode('drill')
  }, [markAttempt])
  const openEstimator = useCallback((e: Estimator) => { setEstimator(e); setMode('estimation') }, [])
  const openAlgo = useCallback((a: AlgoLabMeta) => {
    setAlgo(a); setMode('algo')
    setAlgoSeen((prev) => {
      if (prev.has(a.id)) return prev
      const next = new Set([...prev, a.id]); writeSet(ALGO_SEEN_KEY, next); return next
    })
  }, [])
  const openNotebook = useCallback((id: string) => { setDrillConsole(null); setNotebookId(id); setMode('notebook') }, [])
  const openConsole = useCallback((dq: DrillQuestion) => {
    const built = drillConsoleFor({ id: dq.id, q: dq.q, subtopic: dq.subtopic, subtopicId: dq.subtopicId })
    if (!built) return
    setDrillConsole(built)
    setMode('notebook')
  }, [])

  if (mode === 'drill' && drill) {
    return (
      <DrillWorkspace
        q={drill}
        onBack={() => setMode('browse')}
        onPick={openDrill}
        onConsole={openConsole}
        confident={confident}
        attempted={attempted}
        onToggleConfident={markConfident}
      />
    )
  }
  if (mode === 'estimation' && estimator) {
    return <EstimatorWorkspace est={estimator} onBack={() => setMode('browse')} onPick={openEstimator} />
  }
  if (mode === 'algo' && algo) {
    return <AlgoWorkspace algo={algo} onBack={() => setMode('browse')} onPick={openAlgo} seen={algoSeen} />
  }
  if (mode === 'notebook') {
    return (
      <AimlNotebook
        notebookId={notebookId}
        override={drillConsole?.notebook ?? null}
        brief={drillConsole?.brief ?? null}
        onBack={() => setMode('browse')}
        onPick={(id) => { setDrillConsole(null); setNotebookId(id) }}
      />
    )
  }

  return (
    <Browse
      confident={confident}
      attempted={attempted}
      algoSeen={algoSeen}
      onDrill={openDrill}
      onEstimator={openEstimator}
      onAlgo={openAlgo}
      onNotebook={openNotebook}
    />
  )
}

// =========================================================================
// BROWSE
// =========================================================================

function Browse({
  confident, attempted, algoSeen, onDrill, onEstimator, onAlgo, onNotebook,
}: {
  confident: Set<string>; attempted: Set<string>; algoSeen: Set<string>
  onDrill: (q: DrillQuestion) => void
  onEstimator: (e: Estimator) => void
  onAlgo: (a: AlgoLabMeta) => void
  onNotebook: (id: string) => void
}) {
  const [openTopic, setOpenTopic] = useState<string | null>(DRILL_TOPICS[0]?.id ?? null)
  const [tab, setTab] = useState<'drill' | 'estimation' | 'algo' | 'notebook'>('drill')

  const drilledCount = attempted.size
  const modeCards: { id: 'drill' | 'estimation' | 'algo' | 'notebook'; icon: ReactNode; title: string; desc: string; stat: string }[] = [
    { id: 'drill', icon: <ClipboardCheck size={18} />, title: 'Interview Drill', desc: 'Every question with its answer, the full concept and a diagram.', stat: `${drilledCount}/${AIML_LAB_STATS.drillQuestions} viewed` },
    { id: 'estimation', icon: <Calculator size={18} />, title: 'Estimation Lab', desc: 'KV cache, LoRA, RAG latency, cost, pass@k, index memory.', stat: `${AIML_LAB_STATS.estimators} calculators` },
    { id: 'algo', icon: <FlaskConical size={18} />, title: 'Algorithm Lab', desc: 'Run k-means, gradient descent, sampling, k-NN, metrics.', stat: `${algoSeen.size}/${AIML_LAB_STATS.algos} explored` },
    { id: 'notebook', icon: <FileCode2 size={18} />, title: 'Notebook Console', desc: 'A real in-browser Python kernel — numpy, matplotlib, scikit-learn.', stat: `${NOTEBOOKS.length} starter notebooks` },
  ]

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
      <header className="px-5 sm:px-8 py-3 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
        <Link href="/workspace/playground" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group">
          <ArrowLeft size={13} className="text-[#FF4D4D] group-hover:-translate-x-0.5 transition-transform" /> Playground Dashboard
        </Link>
        <Link href="/workspace/playground/track/aiml" className="text-[12px] font-mono text-[#8A8A8A] hover:text-white transition-colors">
          Track outlines →
        </Link>
      </header>

      <main className="flex-1 w-full px-5 sm:px-8 lg:px-10 py-6 sm:py-8 max-w-[1180px] mx-auto space-y-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#FF4D4D] font-mono">
            <Sparkles size={11} /> AI / ML Practice
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">AI / ML Lab</h1>
          <p className="text-sm text-[#9CA3AF] mt-1.5 max-w-2xl">
            The interactive layer over the AI/ML track. Drill interview questions with active recall, run the
            back-of-envelope calculators every systems round asks for, and watch the core algorithms behave when
            you move the knobs.
          </p>
        </div>

        {/* mode switch */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {modeCards.map((c) => (
            <button
              key={c.id}
              onClick={() => setTab(c.id)}
              className={`text-left rounded-2xl border p-4 transition-colors ${
                tab === c.id
                  ? 'border-[#FF4D4D]/40 bg-[#FF4D4D]/[0.06]'
                  : 'border-white/[0.07] bg-[#0D0D10] hover:border-white/[0.14]'
              }`}
            >
              <div className="flex items-center gap-2" style={{ color: tab === c.id ? ACCENT : '#D1D5DB' }}>
                {c.icon}
                <span className="text-[14px] font-bold">{c.title}</span>
              </div>
              <p className="text-[12px] text-[#8A8A8A] mt-1.5 leading-relaxed">{c.desc}</p>
              <div className="text-[11px] font-mono text-[#6B7280] mt-2">{c.stat}</div>
            </button>
          ))}
        </div>

        {/* ---- DRILL ---- */}
        {tab === 'drill' && (
          <div className="space-y-2">
            {DRILL_TOPICS.map((t) => {
              const qs = drillOf(t.id)
              const open = openTopic === t.id
              const done = qs.filter((q) => confident.has(q.id)).length
              return (
                <div key={t.id} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] overflow-hidden">
                  <button
                    onClick={() => setOpenTopic(open ? null : t.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                  >
                    {open ? <ChevronDown size={14} className="text-[#6B7280] shrink-0" /> : <ChevronRight size={14} className="text-[#6B7280] shrink-0" />}
                    <TopicIcon name={t.icon} size={15} className="text-[#FF4D4D] shrink-0" />
                    <span className="text-[14px] font-bold text-white">{t.title}</span>
                    <span className="text-[12px] text-[#6B7280] hidden sm:inline truncate">{t.tagline}</span>
                    <span className="ml-auto text-[11px] font-mono text-[#4B5563] shrink-0">{done}/{qs.length}</span>
                  </button>
                  {open && (
                    <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
                      {qs.map((q) => {
                        const lc = LEVEL_COLOR[q.level]
                        return (
                          <div key={q.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.015] transition-colors">
                            {confident.has(q.id)
                              ? <CheckCircle2 size={14} className="text-[#34D399] shrink-0 mt-0.5" />
                              : attempted.has(q.id)
                                ? <span className="w-[14px] h-[14px] rounded-full border-2 border-[#FF4D4D]/50 shrink-0 mt-0.5" />
                                : <span className="w-[14px] h-[14px] rounded-full border border-white/15 shrink-0 mt-0.5" />}
                            <div className="min-w-0 flex-1">
                              <p className="text-[13.5px] text-[#D1D5DB] leading-snug">{q.q}</p>
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mt-1.5 inline-block" style={{ color: lc.text, backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>{q.level}</span>
                            </div>
                            <button
                              onClick={() => onDrill(q)}
                              className="px-3.5 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E63946] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                            >
                              <Play size={11} fill="currentColor" /> Drill
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ---- ESTIMATION ---- */}
        {tab === 'estimation' && (
          <div className="grid md:grid-cols-2 gap-3">
            {ESTIMATORS.map((e) => (
              <div key={e.id} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 flex flex-col hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2 text-[#FF4D4D]">
                  <Calculator size={15} />
                  <h3 className="text-[14px] font-bold text-white">{e.title}</h3>
                </div>
                <p className="text-[12px] text-[#8A8A8A] mt-1.5 leading-relaxed flex-1">{e.blurb}</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {e.concepts.map((c) => (
                    <span key={c} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
                <button
                  onClick={() => onEstimator(e)}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E63946] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 self-start"
                >
                  <Play size={11} fill="currentColor" /> Open calculator
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---- ALGO ---- */}
        {tab === 'algo' && (
          <div className="grid md:grid-cols-2 gap-3">
            {ALGO_LABS.map((a) => (
              <div key={a.id} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 flex flex-col hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2 text-[#FF4D4D]">
                  <FlaskConical size={15} />
                  <h3 className="text-[14px] font-bold text-white">{a.title}</h3>
                  {algoSeen.has(a.id) && <CheckCircle2 size={12} className="text-[#34D399]" />}
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mt-1">{a.category}</span>
                <p className="text-[12px] text-[#8A8A8A] mt-1.5 leading-relaxed flex-1">{a.blurb}</p>
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {a.concepts.map((c) => (
                    <span key={c} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{c}</span>
                  ))}
                </div>
                <button
                  onClick={() => onAlgo(a)}
                  className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E63946] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 self-start"
                >
                  <Play size={11} fill="currentColor" /> Launch sim
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ---- NOTEBOOK ---- */}
        {tab === 'notebook' && (
          <div className="space-y-3">
            <div className="rounded-xl border border-white/[0.06] bg-[#0D0D10] p-3.5 flex items-start gap-2.5">
              <FileCode2 size={14} className="text-[#FF4D4D] shrink-0 mt-0.5" />
              <p className="text-[12.5px] text-[#9CA3AF] leading-relaxed">
                Opens a Colab-style notebook backed by a real CPython kernel compiled to WebAssembly (Pyodide).
                The runtime (~10&nbsp;MB) downloads on first launch, then <code className="text-[#D1D5DB]">numpy</code> and
                <code className="text-[#D1D5DB]"> matplotlib</code> are ready; <code className="text-[#D1D5DB]">pandas</code> and
                <code className="text-[#D1D5DB]"> scikit-learn</code> load on demand. Cells and edits autosave per notebook.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {NOTEBOOKS.map((n) => (
                <div key={n.id} className="rounded-2xl border border-white/[0.06] bg-[#0D0D10] p-4 flex flex-col hover:border-white/[0.12] transition-colors">
                  <div className="flex items-center gap-2 text-[#FF4D4D]">
                    <FileCode2 size={15} />
                    <h3 className="text-[14px] font-bold text-white">{n.title}</h3>
                  </div>
                  <p className="text-[12px] text-[#8A8A8A] mt-1.5 leading-relaxed flex-1">{n.blurb}</p>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    <span className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{n.cells.length} cells</span>
                    {['numpy', 'matplotlib', ...n.packages].map((p) => (
                      <span key={p} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => onNotebook(n.id)}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#FF4D4D] hover:bg-[#E63946] text-white text-[12px] font-semibold transition-colors flex items-center gap-1.5 self-start"
                  >
                    <Play size={11} fill="currentColor" /> Open notebook
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// =========================================================================
// shared workspace chrome
// =========================================================================

function TopBar({
  onBack, listOpen, onToggleList, children,
}: {
  onBack: () => void; listOpen: boolean; onToggleList: () => void; children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onBack} title="Back to AI/ML Lab" className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors shrink-0">
          <ArrowLeft size={14} />
        </button>
        <button
          onClick={onToggleList}
          title={listOpen ? 'Hide list' : 'Show list'}
          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
            listOpen ? 'bg-[#FF4D4D]/10 border-[#FF4D4D]/30 text-[#FF4D4D]' : 'bg-white/[0.04] border-white/[0.08] text-[#8A8A8A] hover:text-white'
          }`}
        >
          {listOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>
        {children}
      </div>
    </div>
  )
}

function ReadingRow({ reading }: { reading: { label: string; url: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {reading.map((r) => (
        <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.15] px-2 py-1 rounded-lg transition-colors">
          {r.label} <ExternalLink size={9} />
        </a>
      ))}
    </div>
  )
}

// =========================================================================
// DRILL WORKSPACE
// =========================================================================

function DrillWorkspace({
  q, onBack, onPick, onConsole, confident, attempted, onToggleConfident,
}: {
  q: DrillQuestion
  onBack: () => void
  onPick: (q: DrillQuestion) => void
  onConsole: (q: DrillQuestion) => void
  confident: Set<string>
  attempted: Set<string>
  onToggleConfident: (id: string) => void
}) {
  const [listOpen, setListOpen] = useState(false)
  const [openTopic, setOpenTopic] = useState<string | null>(q.subtopicId)
  const [showFollowUp, setShowFollowUp] = useState(false)

  const hasConsole = !!DRILL_CONSOLES[q.subtopicId]
  const lc = LEVEL_COLOR[q.level]
  const siblings = useMemo(() => drillOf(q.subtopicId), [q.subtopicId])
  const idx = siblings.findIndex((s) => s.id === q.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
  const nextNew = useMemo(
    () => DRILL_QUESTIONS.find((d) => d.id !== q.id && !attempted.has(d.id) && !confident.has(d.id)) ?? null,
    [q.id, attempted, confident],
  )
  const concept = DRILL_CONCEPTS[q.subtopicId]
  const doneInTopic = siblings.filter((s) => confident.has(s.id)).length

  useEffect(() => {
    setOpenTopic(q.subtopicId)
    setListOpen(false)
    setShowFollowUp(false)
  }, [q.id, q.subtopicId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && next) { e.preventDefault(); onPick(next) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, onPick])

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      <TopBar onBack={onBack} listOpen={listOpen} onToggleList={() => setListOpen((v) => !v)}>
        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ color: lc.text, backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>{q.level}</span>
        <span className="text-[12px] font-mono text-[#6B7280] shrink-0 hidden md:inline">{q.subtopic}</span>
        <h2 className="text-sm font-bold text-white truncate">{q.q}</h2>
        {confident.has(q.id) && <CheckCircle2 size={14} className="text-[#34D399] shrink-0" />}
        <span className="ml-auto shrink-0 text-[12px] font-mono text-[#6B7280] hidden lg:inline">{idx + 1} / {siblings.length} · {doneInTopic} confident</span>
      </TopBar>

      <div className="flex-1 flex flex-col xl:flex-row min-h-0 overflow-y-auto xl:overflow-hidden scrollbar-thin">
        {listOpen && (
          <DrillRail
            activeId={q.id}
            openTopic={openTopic}
            setOpenTopic={setOpenTopic}
            confident={confident}
            attempted={attempted}
            onPick={onPick}
          />
        )}

        {/* center — question, answer, concept, diagram */}
        <div className="flex-1 min-w-0 xl:overflow-y-auto xl:scrollbar-thin">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-7 space-y-6">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0D0D10] p-5 sm:p-6">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Question · {q.subtopic}</div>
              <p className="text-[18px] sm:text-[20px] text-white leading-relaxed font-medium">{q.q}</p>
              {hasConsole && (
                <button
                  onClick={() => onConsole(q)}
                  className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#8B5CF6]/12 border border-[#8B5CF6]/30 text-[#C4B5FD] hover:bg-[#8B5CF6]/20 text-[12px] font-semibold transition-colors"
                >
                  <FileCode2 size={13} /> Practice this in the console — input · goal · constraints ready
                </button>
              )}
            </div>

            {/* answer */}
            <div className="rounded-2xl border border-[#FF4D4D]/20 bg-[#FF4D4D]/[0.04] p-5 sm:p-6">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D] mb-3">
                <ListChecks size={12} /> Answer — the load-bearing points
              </div>
              <ol className="space-y-2.5">
                {q.outline.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 rounded-md bg-[#FF4D4D]/12 border border-[#FF4D4D]/30 text-[#FF4D4D] text-[11px] font-mono font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span className="text-[14.5px] text-[#E5E7EB] leading-relaxed">{point}</span>
                  </li>
                ))}
              </ol>
              {q.followUp && (
                <div className="mt-4 pt-3 border-t border-[#FF4D4D]/15">
                  <button onClick={() => setShowFollowUp((v) => !v)} className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#FBBF24]">
                    <Lightbulb size={12} /> Follow-up {showFollowUp ? <EyeOff size={11} /> : <Eye size={11} />}
                  </button>
                  {showFollowUp && <p className="text-[13.5px] text-[#D1D5DB] leading-relaxed mt-2">{q.followUp}</p>}
                </div>
              )}
            </div>

            {/* concept + diagram */}
            {concept && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0B0B0E] p-5 sm:p-6 space-y-3.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6]">
                  <ListChecks size={12} /> Concept · {q.subtopic}
                </div>
                {concept.concept.map((para, i) => (
                  <p key={i} className="text-[13.5px] text-[#B4B8BF] leading-relaxed">{para}</p>
                ))}
                <div className="pt-1 max-w-[600px]">{concept.diagram}</div>
              </div>
            )}

            {/* source */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">Primary source</div>
              <ReadingRow reading={[q.reading]} />
            </div>

            {/* nav */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => prev && onPick(prev)}
                disabled={!prev}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span className="text-[11px] font-mono text-[#4B5563]">{idx + 1} / {siblings.length} in topic</span>
              <button
                onClick={() => next && onPick(next)}
                disabled={!next}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] disabled:opacity-30 transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
              <button
                onClick={() => onToggleConfident(q.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors border ${
                  confident.has(q.id) ? 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]' : 'bg-white/[0.04] border-white/[0.1] text-[#D1D5DB] hover:border-white/25'
                }`}
              >
                <CheckCircle2 size={13} /> {confident.has(q.id) ? 'Confident' : 'Mark confident'}
              </button>
              {nextNew && (
                <button
                  onClick={() => onPick(nextNew)}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#FF4D4D] bg-[#FF4D4D]/[0.08] border border-[#FF4D4D]/20 hover:bg-[#FF4D4D]/[0.14] transition-colors"
                >
                  <SkipForward size={12} /> Next unattempted
                </button>
              )}
            </div>
          </div>
        </div>

        {/* right — topic navigator */}
        <div className="w-full xl:w-[340px] 2xl:w-[380px] shrink-0 border-t xl:border-t-0 xl:border-l border-white/[0.06] bg-[#0D0D10] xl:overflow-y-auto xl:scrollbar-thin">
          <div className="p-5 space-y-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">{q.subtopic} · {doneInTopic}/{siblings.length} confident</div>
            <div className="space-y-1">
              {siblings.map((s) => (
                <button key={s.id} onClick={() => onPick(s)} className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg transition-colors ${s.id === q.id ? 'bg-[#FF4D4D]/[0.08]' : 'hover:bg-white/[0.03]'}`}>
                  {confident.has(s.id)
                    ? <CheckCircle2 size={12} className="text-[#34D399] shrink-0 mt-0.5" />
                    : attempted.has(s.id)
                      ? <span className="w-3 h-3 rounded-full border-2 border-[#FF4D4D]/50 shrink-0 mt-0.5" />
                      : <span className="w-3 h-3 rounded-full border border-white/15 shrink-0 mt-0.5" />}
                  <span className={`flex-1 text-[13.5px] leading-snug ${s.id === q.id ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>{s.q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DrillRail({
  activeId, openTopic, setOpenTopic, confident, attempted, onPick,
}: {
  activeId: string
  openTopic: string | null
  setOpenTopic: (id: string | null) => void
  confident: Set<string>
  attempted: Set<string>
  onPick: (q: DrillQuestion) => void
}) {
  return (
    <div className="w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] shrink-0">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
          <ClipboardCheck size={11} /> Questions
        </span>
        <span className="text-[10px] font-mono text-[#FF4D4D]">{confident.size}/{DRILL_QUESTIONS.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5">
        {DRILL_TOPICS.map((t) => {
          const qs = drillOf(t.id)
          const open = openTopic === t.id
          const done = qs.filter((x) => confident.has(x.id)).length
          return (
            <div key={t.id} className="rounded-xl border border-white/[0.06] bg-[#111214] overflow-hidden">
              <button onClick={() => setOpenTopic(open ? null : t.id)} className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/[0.02] transition-colors text-left">
                {open ? <ChevronDown size={12} className="text-[#6B7280] shrink-0" /> : <ChevronRight size={12} className="text-[#6B7280] shrink-0" />}
                <TopicIcon name={t.icon} size={12} className="text-[#FF4D4D] shrink-0" />
                <span className="flex-1 min-w-0 text-[12px] font-semibold text-[#D1D5DB] truncate">{t.title}</span>
                <span className="text-[10px] font-mono text-[#4B5563] shrink-0">{done}/{qs.length}</span>
              </button>
              {open && (
                <div className="border-t border-white/[0.04] py-1">
                  {qs.map((item) => {
                    const active = item.id === activeId
                    const lc = LEVEL_COLOR[item.level]
                    return (
                      <button
                        key={item.id}
                        onClick={() => onPick(item)}
                        className={`w-full flex items-start gap-2 px-2.5 py-1.5 text-left transition-colors ${active ? 'bg-[#FF4D4D]/[0.08]' : 'hover:bg-white/[0.03]'}`}
                      >
                        {confident.has(item.id)
                          ? <CheckCircle2 size={11} className="text-[#34D399] shrink-0 mt-0.5" />
                          : attempted.has(item.id)
                            ? <span className="w-[11px] h-[11px] rounded-full border-2 border-[#FF4D4D]/50 shrink-0 mt-0.5" />
                            : <span className="w-[11px] h-[11px] rounded-full border border-white/15 shrink-0 mt-0.5" />}
                        <span className={`flex-1 min-w-0 text-[12px] leading-snug ${active ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>
                          {item.q}
                        </span>
                        <span className="text-[7px] font-bold uppercase px-1 py-px rounded shrink-0 mt-0.5" style={{ color: lc.text, backgroundColor: lc.bg, border: `1px solid ${lc.border}` }}>
                          {item.level === 'Fresher' ? 'F' : item.level === 'SDE II' ? 'II' : 'III'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =========================================================================
// ESTIMATOR WORKSPACE
// =========================================================================

const toneColor: Record<string, string> = {
  ok: '#34D399', warn: '#FBBF24', bad: '#FB7185', neutral: '#E5E7EB',
}

const EST_VALS_KEY = (id: string) => `kiit:aiml:est:${id}`
const leadNum = (s: string) => {
  const m = s.replace(/[$,]/g, '').match(/-?\d+(\.\d+)?/)
  return m ? parseFloat(m[0]) : NaN
}

function EstimatorWorkspace({
  est, onBack, onPick,
}: {
  est: Estimator; onBack: () => void; onPick: (e: Estimator) => void
}) {
  const [listOpen, setListOpen] = useState(false)
  const [vals, setVals] = useState<Record<string, number>>({})
  const [pinned, setPinned] = useState<{ vals: Record<string, number>; outputs: EstimatorOutput[] } | null>(null)
  const [copied, setCopied] = useState(false)

  const defaults = useCallback(() => {
    const init: Record<string, number> = {}
    est.fields.forEach((f) => { init[f.key] = f.default })
    return init
  }, [est])

  useEffect(() => {
    let v = defaults()
    try {
      const raw = window.localStorage.getItem(EST_VALS_KEY(est.id))
      if (raw) { const s = JSON.parse(raw); if (s && typeof s === 'object') v = { ...v, ...s } }
    } catch { /* noop */ }
    setVals(v)
    setPinned(null)
    setListOpen(false)
  }, [est, defaults])

  useEffect(() => {
    if (!Object.keys(vals).length) return
    const t = setTimeout(() => {
      try { window.localStorage.setItem(EST_VALS_KEY(est.id), JSON.stringify(vals)) } catch { /* quota */ }
    }, 300)
    return () => clearTimeout(t)
  }, [vals, est.id])

  const ready = est.fields.every((f) => typeof vals[f.key] === 'number')
  const outputs = useMemo(() => {
    if (!ready) return []
    try { return est.compute(vals) } catch { return [] }
  }, [est, vals, ready])

  const set = (k: string, n: number) => setVals((p) => ({ ...p, [k]: n }))
  const applyPreset = (pv: Record<string, number>) => setVals((p) => ({ ...p, ...pv }))

  const copySummary = async () => {
    const lines = [
      est.title,
      '',
      'Inputs',
      ...est.fields.map((f) => {
        const v = vals[f.key] ?? f.default
        const label = f.kind === 'select' ? (f.options?.find((o) => o.value === v)?.label ?? String(v)) : `${v}${f.unit ? ` ${f.unit}` : ''}`
        return `  ${f.label}: ${label}`
      }),
      '',
      'Results',
      ...outputs.map((o) => `  ${o.label}: ${o.value}${o.hint ? `  (${o.hint})` : ''}`),
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      <TopBar onBack={onBack} listOpen={listOpen} onToggleList={() => setListOpen((v) => !v)}>
        <Calculator size={14} className="text-[#FF4D4D] shrink-0" />
        <h2 className="text-sm font-bold text-white truncate">{est.title}</h2>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setPinned(pinned ? null : { vals: { ...vals }, outputs })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
              pinned ? 'bg-[#60A5FA]/10 border-[#60A5FA]/30 text-[#60A5FA]' : 'bg-white/[0.03] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
          >
            {pinned ? <PinOff size={11} /> : <Pin size={11} />} {pinned ? 'Clear A/B' : 'Pin as A'}
          </button>
          <button onClick={copySummary} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-white/[0.03] border border-white/[0.08] text-[#8A8A8A] hover:text-white transition-colors">
            {copied ? <Check size={11} className="text-[#34D399]" /> : <Copy size={11} />} {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={() => setVals(defaults())} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-white/[0.03] border border-white/[0.08] text-[#8A8A8A] hover:text-white transition-colors">
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </TopBar>

      <div className="flex-1 flex min-h-0">
        {listOpen && (
          <div className="w-[260px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
            <div className="px-3 py-2.5 border-b border-white/[0.05] text-[11px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
              <Calculator size={11} /> Calculators
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
              {ESTIMATORS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onPick(e)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[12.5px] transition-colors ${
                    e.id === est.id ? 'bg-[#FF4D4D]/[0.1] text-white font-semibold' : 'text-[#9CA3AF] hover:bg-white/[0.03]'
                  }`}
                >
                  {e.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 overflow-y-auto scrollbar-thin">
          <div className="px-6 sm:px-10 py-7 space-y-5">
            <p className="text-[13.5px] text-[#9CA3AF] leading-relaxed max-w-3xl">{est.blurb}</p>

            {/* presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mr-1">Presets</span>
              {est.presets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.values)}
                  className="text-[11.5px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#9CA3AF] hover:text-white hover:border-white/20 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)_360px] lg:grid-cols-[320px_minmax(0,1fr)]">
              {/* inputs */}
              <div className="space-y-3.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Inputs</div>
                {est.fields.map((f) => {
                  const v = vals[f.key] ?? f.default
                  const av = pinned?.vals[f.key]
                  return (
                    <div key={f.key}>
                      <div className="flex items-center justify-between text-[12px] mb-1">
                        <span className="text-[#9CA3AF]">{f.label}</span>
                        <span className="font-mono text-white">
                          {av != null && av !== v && <span className="text-[#4B5563] mr-1">{av} →</span>}
                          {v}{f.unit ? ` ${f.unit}` : ''}
                        </span>
                      </div>
                      {f.kind === 'select' ? (
                        <select
                          value={v}
                          onChange={(e) => set(f.key, parseFloat(e.target.value))}
                          className="w-full rounded-lg bg-[#111114] border border-white/[0.1] text-[13px] text-white px-2.5 py-1.5 outline-none focus:border-[#FF4D4D]/40"
                        >
                          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="range" min={f.min} max={f.max} step={f.step ?? 1} value={v}
                            onChange={(e) => set(f.key, parseFloat(e.target.value))}
                            className="flex-1 accent-[#FF4D4D] h-1 cursor-pointer"
                          />
                          <input
                            type="number" min={f.min} max={f.max} step={f.step ?? 1} value={v}
                            onChange={(e) => set(f.key, e.target.value === '' ? f.default : parseFloat(e.target.value))}
                            className="w-20 rounded-lg bg-[#111114] border border-white/[0.1] text-[12px] font-mono text-white px-2 py-1 outline-none focus:border-[#FF4D4D]/40"
                          />
                        </div>
                      )}
                      {f.help && <p className="text-[10.5px] text-[#4B5563] mt-1">{f.help}</p>}
                    </div>
                  )
                })}
              </div>

              {/* outputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Results</div>
                  {pinned && <div className="text-[10px] font-mono text-[#60A5FA]">A = pinned · B = live</div>}
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {outputs.map((o, i) => {
                    const a = pinned?.outputs[i]
                    const da = a ? leadNum(a.value) : NaN
                    const db = leadNum(o.value)
                    const delta = a && isFinite(da) && isFinite(db) ? db - da : null
                    return (
                      <div key={i} className="rounded-xl border border-white/[0.06] bg-[#0D0D10] px-3.5 py-3">
                        <span className="text-[12px] text-[#9CA3AF] leading-snug block">{o.label}</span>
                        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                          <span className="text-[15px] font-bold font-mono" style={{ color: toneColor[o.tone ?? 'neutral'] }}>{o.value}</span>
                          {a && <span className="text-[11px] font-mono text-[#4B5563]">was {a.value}</span>}
                          {delta != null && Math.abs(delta) > 1e-9 && (
                            <span className="text-[11px] font-mono" style={{ color: delta > 0 ? '#FB7185' : '#34D399' }}>
                              {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                        {typeof o.bar === 'number' && (
                          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mt-2">
                            <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${Math.min(100, o.bar * 100)}%`, backgroundColor: o.barColor ?? ACCENT }} />
                          </div>
                        )}
                        {o.hint && <p className="text-[11px] text-[#6B7280] mt-1.5 leading-snug">{o.hint}</p>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* context */}
              <div className="space-y-4 xl:col-span-1 lg:col-span-2">
                <div className="rounded-xl border border-white/[0.06] bg-[#0D0D10] p-3.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A] mb-2">
                    <Sigma size={11} /> The arithmetic
                  </div>
                  <pre className="text-[11.5px] font-mono text-[#B4B8BF] leading-[1.7] whitespace-pre-wrap">{est.formula}</pre>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0D0D10] p-3.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D] mb-2">What the interviewer is checking</div>
                  <ul className="space-y-1.5">
                    {est.checks.map((c) => (
                      <li key={c} className="flex gap-2 text-[12.5px] text-[#B4B8BF] leading-snug">
                        <span className="text-[#FF4D4D] shrink-0">›</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">Primary sources</div>
                  <ReadingRow reading={est.reading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// ALGO WORKSPACE
// =========================================================================

function AlgoWorkspace({
  algo, onBack, onPick, seen,
}: {
  algo: AlgoLabMeta; onBack: () => void; onPick: (a: AlgoLabMeta) => void; seen: Set<string>
}) {
  const [listOpen, setListOpen] = useState(false)
  useEffect(() => { setListOpen(false) }, [algo])

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      <TopBar onBack={onBack} listOpen={listOpen} onToggleList={() => setListOpen((v) => !v)}>
        <FlaskConical size={14} className="text-[#FF4D4D] shrink-0" />
        <h2 className="text-sm font-bold text-white truncate">{algo.title}</h2>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280] shrink-0 hidden sm:inline">{algo.category}</span>
      </TopBar>

      <div className="flex-1 flex min-h-0">
        {listOpen && (
          <div className="w-[260px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
            <div className="px-3 py-2.5 border-b border-white/[0.05] text-[11px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
              <FlaskConical size={11} /> Sims
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
              {ALGO_LABS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onPick(a)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[12.5px] flex items-center gap-2 transition-colors ${
                    a.id === algo.id ? 'bg-[#FF4D4D]/[0.1] text-white font-semibold' : 'text-[#9CA3AF] hover:bg-white/[0.03]'
                  }`}
                >
                  {seen.has(a.id) ? <CheckCircle2 size={11} className="text-[#34D399] shrink-0" /> : <span className="w-[11px] shrink-0" />}
                  <span className="min-w-0 truncate">{a.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 min-h-0">
          <AlgoLab meta={algo} />
        </div>
      </div>
    </div>
  )
}
