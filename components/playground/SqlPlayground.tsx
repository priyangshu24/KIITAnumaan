'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Play, RotateCcw, Database, Table2, Check, X, Lightbulb,
  ChevronDown, ChevronRight, Loader2, Eye, EyeOff, Terminal, CheckCircle2,
  PanelLeftClose, PanelLeftOpen, ListOrdered, History, GitCompareArrows,
  Download, RefreshCw, Wand2, Clock,
} from 'lucide-react'
import {
  SQL_EXERCISES, SQL_SCHEMA_DDL, SQL_SEED_DML, SQL_TABLES, SQL_DIFFICULTY_COLOR,
  SQL_TOPICS, topicOf,
  type SqlExercise,
} from '@/lib/sql-playground-data'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

type ResultSet = { columns: string[]; values: unknown[][] }
type RunState =
  | { kind: 'idle' }
  | { kind: 'running' }
  | { kind: 'error'; message: string }
  | { kind: 'ok'; result: ResultSet | null; passed: boolean; expected: ResultSet | null; reason?: string; ms: number }

interface HistoryEntry { sql: string; passed: boolean | null; rows: number; ms: number; at: number }

const SOLVED_KEY = 'kiit:sql:solved'
const DRAFT_KEY = (id: string) => `kiit:sql:draft:${id}`
const HISTORY_KEY = 'kiit:sql:history'

// -- helpers ----------------------------------------------------------------

const cellText = (v: unknown) => (v === null || v === undefined ? 'NULL' : String(v))

/** CSV-escape then join a result set into a downloadable string. */
function toCsv(rs: ResultSet): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [rs.columns.map(esc).join(','), ...rs.values.map((r) => r.map(esc).join(','))].join('\n')
}

/** Lightweight SQL pretty-printer: uppercases keywords, breaks before major clauses. */
function formatSql(sql: string): string {
  const kw = ['select', 'from', 'where', 'group by', 'having', 'order by', 'limit', 'offset',
    'inner join', 'left join', 'right join', 'full join', 'join', 'on', 'and', 'or',
    'union all', 'union', 'with', 'as', 'case', 'when', 'then', 'else', 'end', 'over',
    'partition by', 'insert into', 'values', 'update', 'set', 'delete', 'distinct', 'desc', 'asc']
  let out = sql.replace(/\s+/g, ' ').trim()
  // uppercase keywords (word-boundary, longest first)
  for (const k of [...kw].sort((a, b) => b.length - a.length)) {
    out = out.replace(new RegExp(`\\b${k.replace(/ /g, '\\s+')}\\b`, 'gi'), k.toUpperCase())
  }
  const breakBefore = ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT',
    'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN', 'UNION ALL', 'UNION']
  for (const b of breakBefore) out = out.replace(new RegExp(`\\s+${b}\\b`, 'g'), `\n${b}`)
  return out.replace(/,\s*/g, ', ')
}

/** Compare two result sets. Row order only matters when the prompt asked for it. */
function compare(user: ResultSet | null, expected: ResultSet | null, ordered: boolean): { passed: boolean; reason?: string } {
  if (!expected) return { passed: false, reason: 'Could not evaluate the reference solution.' }
  if (!user) return { passed: false, reason: 'Your query returned no result set. Did you run a SELECT?' }

  if (user.columns.length !== expected.columns.length) {
    return { passed: false, reason: `Expected ${expected.columns.length} column(s), got ${user.columns.length}.` }
  }
  if (user.values.length !== expected.values.length) {
    return { passed: false, reason: `Expected ${expected.values.length} row(s), got ${user.values.length}.` }
  }

  const norm = (rs: ResultSet) => {
    const rows = rs.values.map((r) => r.map(cellText).join(''))
    return ordered ? rows : [...rows].sort()
  }
  const a = norm(user)
  const b = norm(expected)
  for (let i = 0; i < b.length; i++) {
    if (a[i] !== b[i]) {
      return {
        passed: false,
        reason: ordered
          ? `Row ${i + 1} does not match. Check your ORDER BY and the selected columns.`
          : 'The rows do not match. Check your filters and selected columns.',
      }
    }
  }
  return { passed: true }
}

function ResultTable({ rs, max = 200 }: { rs: ResultSet; max?: number }) {
  if (rs.values.length === 0) {
    return <p className="text-[11px] font-mono text-[#6B7280] p-3">Query ran successfully — 0 rows returned.</p>
  }
  return (
    <div className="overflow-auto scrollbar-thin max-h-full">
      <table className="w-full text-[11px] font-mono border-collapse">
        <thead className="sticky top-0 bg-[#141418]">
          <tr>
            {rs.columns.map((c) => (
              <th key={c} className="text-left px-3 py-2 text-[#FF4D4D] font-bold border-b border-white/[0.08] whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rs.values.slice(0, max).map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.02]">
              {row.map((cell, j) => (
                <td key={j} className={`px-3 py-1.5 border-b border-white/[0.03] whitespace-nowrap ${
                  cell === null ? 'text-[#4B5563] italic' : 'text-[#D1D5DB]'
                }`}>
                  {cellText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rs.values.length > max && (
        <p className="text-[10px] font-mono text-[#6B7280] p-2">Showing first {max} of {rs.values.length} rows.</p>
      )}
    </div>
  )
}

// -- main -------------------------------------------------------------------

export default function SqlPlayground() {
  const [view, setView] = useState<'browse' | 'solve'>('browse')
  const [exercise, setExercise] = useState<SqlExercise | null>(null)
  const [sql, setSql] = useState('')
  const [run, setRun] = useState<RunState>({ kind: 'idle' })
  const [tab, setTab] = useState<'result' | 'expected' | 'plan' | 'history'>('result')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [openTable, setOpenTable] = useState<string | null>('customers')
  const [listOpen, setListOpen] = useState(false)
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [plan, setPlan] = useState<ResultSet | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [preview, setPreview] = useState<ResultSet | null>(null)
  const [previewName, setPreviewName] = useState<string | null>(null)

  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  // ---- boot SQLite (wasm) ----
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const initSqlJs = (await import('sql.js')).default
        const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
        if (cancelled) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).__kiitSqlJs = SQL
        const db = new SQL.Database()
        db.run(SQL_SCHEMA_DDL)
        db.run(SQL_SEED_DML)
        dbRef.current = db
        setDbReady(true)
      } catch (e) {
        if (!cancelled) setDbError(e instanceof Error ? e.message : 'Failed to load the SQL engine.')
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SOLVED_KEY)
      if (raw) setSolved(new Set(JSON.parse(raw)))
      const h = window.localStorage.getItem(HISTORY_KEY)
      if (h) setHistory(JSON.parse(h))
    } catch { /* private mode */ }
  }, [])

  const pushHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 25)
      try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) } catch { /* quota */ }
      return next
    })
  }, [])

  const rebuildDb = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SQL: any = (window as any).__kiitSqlJs
    if (!SQL) return
    const db = new SQL.Database()
    db.run(SQL_SCHEMA_DDL)
    db.run(SQL_SEED_DML)
    dbRef.current?.close?.()
    dbRef.current = db
    setRun({ kind: 'idle' })
    setPreview(null)
    setPlan(null)
  }, [])

  const persistSolved = (next: Set<string>) => {
    setSolved(next)
    try { window.localStorage.setItem(SOLVED_KEY, JSON.stringify([...next])) } catch { /* quota */ }
  }

  const start = (ex: SqlExercise) => {
    let draft: string | null = null
    try { draft = window.localStorage.getItem(DRAFT_KEY(ex.id)) } catch { /* noop */ }
    setExercise(ex)
    setSql(draft ?? ex.starter)
    setRun({ kind: 'idle' })
    setTab('result')
    setShowHint(false)
    setShowSolution(false)
    setPlan(null)
    setPreview(null)
    setPreviewName(null)
    setOpenTopic(topicOf(ex.id))
    setListOpen(false) // collapse the rail once a question is chosen
    setView('solve')
  }

  // autosave the draft
  useEffect(() => {
    if (!exercise || view !== 'solve') return
    const t = setTimeout(() => {
      try { window.localStorage.setItem(DRAFT_KEY(exercise.id), sql) } catch { /* quota */ }
    }, 500)
    return () => clearTimeout(t)
  }, [sql, exercise, view])

  const execute = useCallback((query: string): ResultSet | null => {
    const db = dbRef.current
    if (!db) throw new Error('SQL engine is still loading.')
    const res = db.exec(query)
    if (!res || res.length === 0) return null
    const last = res[res.length - 1]
    return { columns: last.columns as string[], values: last.values as unknown[][] }
  }, [])

  /** the highlighted text in Monaco, or the whole buffer */
  const activeQuery = useCallback((): string => {
    const ed = editorRef.current
    try {
      const sel = ed?.getSelection?.()
      const picked = sel && !sel.isEmpty?.() ? ed.getModel()?.getValueInRange(sel) : ''
      return (picked && picked.trim()) ? picked : sql
    } catch {
      return sql
    }
  }, [sql])

  const handleRun = useCallback(() => {
    if (!exercise || !dbReady) return
    setRun({ kind: 'running' })
    setTab('result')
    setTimeout(() => {
      const q = activeQuery()
      const t0 = performance.now()
      try {
        const result = execute(q)
        const ms = performance.now() - t0
        let expected: ResultSet | null = null
        try { expected = execute(exercise.solution) } catch { expected = null }
        const { passed, reason } = compare(result, expected, exercise.ordered)
        setRun({ kind: 'ok', result, passed, expected, reason, ms })
        pushHistory({ sql: q, passed, rows: result?.values.length ?? 0, ms, at: Date.now() })
        if (passed && !solved.has(exercise.id)) persistSolved(new Set([...solved, exercise.id]))
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        setRun({ kind: 'error', message: msg })
        pushHistory({ sql: q, passed: false, rows: 0, ms: performance.now() - t0, at: Date.now() })
      }
    }, 20)
  }, [exercise, dbReady, execute, solved, activeQuery, pushHistory])

  const handleExplain = useCallback(() => {
    if (!dbReady) return
    try {
      const p = execute(`EXPLAIN QUERY PLAN ${activeQuery()}`)
      setPlan(p)
      setTab('plan')
    } catch (e) {
      setRun({ kind: 'error', message: e instanceof Error ? e.message : String(e) })
      setTab('result')
    }
  }, [dbReady, execute, activeQuery])

  const peekTable = useCallback((name: string) => {
    if (!dbReady) return
    try {
      setPreview(execute(`SELECT * FROM ${name} LIMIT 8`))
      setPreviewName(name)
      setTab('result')
    } catch { /* noop */ }
  }, [dbReady, execute])

  const downloadCsv = () => {
    const rs = run.kind === 'ok' ? run.result : preview
    if (!rs) return
    const blob = new Blob([toCsv(rs)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exercise?.id ?? 'query'}-result.csv`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  // Ctrl/Cmd + Enter to run
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleRun() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleRun])

  const stats = useMemo(() => ({
    total: SQL_EXERCISES.length,
    solved: SQL_EXERCISES.filter((e) => solved.has(e.id)).length,
  }), [solved])

  // ======================= BROWSE =======================
  if (view === 'browse') {
    return (
      <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
        <header className="px-5 sm:px-8 py-3 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
          <Link href="/workspace/playground" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group">
            <ArrowLeft size={13} className="text-[#10B981] group-hover:-translate-x-0.5 transition-transform" /> Playground Dashboard
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            {dbReady
              ? <span className="text-[#10B981] flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> SQLite ready</span>
              : dbError
                ? <span className="text-[#EF4444]">engine error</span>
                : <span className="text-[#8A8A8A] flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> loading engine</span>}
          </div>
        </header>

        <main className="flex-1 w-full px-5 sm:px-8 lg:px-10 py-6 sm:py-8 max-w-[1200px] mx-auto space-y-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10B981] font-mono">
              <Database size={11} /> SQL Practice
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">SQL Playground</h1>
            <p className="text-sm text-[#9CA3AF] mt-1.5 max-w-2xl">
              Pick a question and hit Start — a real SQLite database loads in your browser with a seeded
              e-commerce schema. Your query is graded by comparing result sets, so any correct solution passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-lg font-bold text-white leading-none">{stats.solved}<span className="text-[#6B7280] text-sm">/{stats.total}</span></div>
              <div className="text-[10px] font-mono text-[#6B7280] mt-1">solved</div>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-lg font-bold text-white leading-none">{SQL_TABLES.length}</div>
              <div className="text-[10px] font-mono text-[#6B7280] mt-1">tables</div>
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-lg font-bold text-white leading-none">SQLite</div>
              <div className="text-[10px] font-mono text-[#6B7280] mt-1">full SQL · CTEs · windows</div>
            </div>
          </div>

          <div className="space-y-6">
            {SQL_TOPICS.map((topic) => {
              const items = topic.ids
                .map((id) => SQL_EXERCISES.find((e) => e.id === id))
                .filter(Boolean) as SqlExercise[]
              const done = items.filter((i) => solved.has(i.id)).length
              return (
                <div key={topic.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-sm font-bold text-white">{topic.name}</h2>
                    <span className="text-[10px] font-mono text-[#6B7280]">{done}/{items.length} solved</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((ex) => {
                      const c = SQL_DIFFICULTY_COLOR[ex.difficulty]
                      const isDone = solved.has(ex.id)
                      return (
                        <div key={ex.id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4 hover:border-white/[0.12] transition-colors">
                          {isDone
                            ? <CheckCircle2 size={15} className="text-[#10B981] shrink-0" />
                            : <span className="w-[15px] h-[15px] rounded-full border border-white/15 shrink-0" />}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-[13px] font-bold text-white">{ex.title}</h3>
                              <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}>{ex.difficulty}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {ex.concepts.map((t) => (
                                <span key={t} className="text-[8px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{t}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => start(ex)}
                            disabled={!dbReady}
                            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#0E9F6E] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                          >
                            <Play size={12} fill="currentColor" /> Start
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {dbError && (
            <p className="text-[11px] text-[#EF4444] font-mono">Engine failed to load: {dbError}</p>
          )}
        </main>
      </div>
    )
  }

  // ======================= SOLVE =======================
  const ex = exercise!
  const dc = SQL_DIFFICULTY_COLOR[ex.difficulty]

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setView('browse')}
            className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors shrink-0"
            title="Back to questions"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => setListOpen((v) => !v)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
              listOpen
                ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                : 'bg-white/[0.04] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
            title={listOpen ? 'Hide question list' : 'Show question list'}
          >
            {listOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ color: dc.text, backgroundColor: dc.bg, border: `1px solid ${dc.border}` }}>{ex.difficulty}</span>
          <h2 className="text-sm font-bold text-white truncate">{ex.title}</h2>
          {solved.has(ex.id) && <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setSql((s) => formatSql(s))} title="Format SQL" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <Wand2 size={11} /> Format
          </button>
          <button onClick={handleExplain} disabled={!dbReady} title="EXPLAIN QUERY PLAN" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-40 transition-colors">
            <GitCompareArrows size={11} /> Explain
          </button>
          <button onClick={rebuildDb} disabled={!dbReady} title="Reset the database to its seeded state" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-40 transition-colors">
            <RefreshCw size={11} /> Reset DB
          </button>
          <span className="w-px h-5 bg-white/[0.08] mx-0.5" />
          <button onClick={() => setSql(ex.starter)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <RotateCcw size={11} /> Starter
          </button>
          <button onClick={() => setShowHint((v) => !v)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono text-[#F59E0B] bg-[#F59E0B]/[0.08] hover:bg-[#F59E0B]/[0.14] border border-[#F59E0B]/20 transition-colors">
            <Lightbulb size={11} /> Hint
          </button>
          <button
            onClick={handleRun}
            disabled={!dbReady || run.kind === 'running'}
            title="Ctrl/⌘ + Enter — runs the selection if you have one"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#10B981] hover:bg-[#0E9F6E] disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors"
          >
            {run.kind === 'running' ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} fill="currentColor" />}
            {run.kind === 'running' ? 'Running' : 'Run'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* QUESTION RAIL — grouped by topic, collapses once a question is picked */}
        {listOpen && (
          <div className="w-[262px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <ListOrdered size={11} /> Questions
              </span>
              <span className="text-[9px] font-mono text-[#10B981]">{stats.solved}/{stats.total}</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5">
              {SQL_TOPICS.map((topic) => {
                const items = topic.ids
                  .map((id) => SQL_EXERCISES.find((e) => e.id === id))
                  .filter(Boolean) as SqlExercise[]
                const open = openTopic === topic.name
                const done = items.filter((i) => solved.has(i.id)).length
                return (
                  <div key={topic.name} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenTopic(open ? null : topic.name)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      {open ? <ChevronDown size={12} className="text-[#6B7280] shrink-0" /> : <ChevronRight size={12} className="text-[#6B7280] shrink-0" />}
                      <span className="flex-1 min-w-0 text-[11px] font-semibold text-[#D1D5DB] truncate">{topic.name}</span>
                      <span className="text-[9px] font-mono text-[#4B5563] shrink-0">{done}/{items.length}</span>
                    </button>
                    {open && (
                      <div className="border-t border-white/[0.04] py-1">
                        {items.map((item) => {
                          const active = item.id === ex.id
                          const c = SQL_DIFFICULTY_COLOR[item.difficulty]
                          return (
                            <button
                              key={item.id}
                              onClick={() => start(item)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left transition-colors ${
                                active ? 'bg-[#10B981]/[0.08]' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              {solved.has(item.id)
                                ? <CheckCircle2 size={11} className="text-[#10B981] shrink-0" />
                                : <span className="w-[11px] h-[11px] rounded-full border border-white/15 shrink-0" />}
                              <span className={`flex-1 min-w-0 text-[11px] truncate ${active ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>
                                {item.title}
                              </span>
                              <span
                                className="text-[7px] font-bold uppercase px-1 py-px rounded shrink-0"
                                style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}
                              >
                                {item.difficulty[0]}
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
        )}

        {/* LEFT — prompt + schema */}
        <div className="w-[34%] min-w-[280px] border-r border-white/[0.06] flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Question</div>
              <p className="text-[13px] text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">{ex.prompt}</p>
            </div>

            {showHint && (
              <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/[0.05] p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] mb-1.5">
                  <Lightbulb size={11} /> Hint
                </div>
                <p className="text-[12px] text-[#D1D5DB] leading-relaxed">{ex.hint}</p>
              </div>
            )}

            <div>
              <button
                onClick={() => setShowSolution((v) => !v)}
                className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8A8A] hover:text-white transition-colors"
              >
                {showSolution ? <EyeOff size={11} /> : <Eye size={11} />}
                {showSolution ? 'Hide reference solution' : 'Show reference solution'}
              </button>
              {showSolution && (
                <pre className="mt-2 text-[10.5px] font-mono text-[#9CA3AF] bg-[#111214] border border-white/[0.06] rounded-xl p-3 overflow-x-auto scrollbar-thin whitespace-pre">
{ex.solution}
                </pre>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">
                <Database size={10} /> Schema
              </div>
              <div className="space-y-1">
                {SQL_TABLES.map((t) => {
                  const open = openTable === t.name
                  return (
                    <div key={t.name} className="glass rounded-xl overflow-hidden">
                      <div className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/[0.02] transition-colors group">
                        <button onClick={() => setOpenTable(open ? null : t.name)} className="flex items-center gap-2 flex-1 min-w-0">
                          {open ? <ChevronDown size={12} className="text-[#6B7280] shrink-0" /> : <ChevronRight size={12} className="text-[#6B7280] shrink-0" />}
                          <Table2 size={12} className="text-[#10B981] shrink-0" />
                          <span className="text-[11px] font-mono text-[#D1D5DB] truncate">{t.name}</span>
                        </button>
                        <span className="text-[9px] font-mono text-[#4B5563] shrink-0">{t.columns.length} cols</span>
                        <button
                          onClick={() => peekTable(t.name)}
                          title={`Preview rows of ${t.name}`}
                          className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-[#10B981] transition-all shrink-0"
                        >
                          <Eye size={12} />
                        </button>
                      </div>
                      {open && (
                        <div className="px-2.5 pb-2 pl-8 space-y-0.5 border-t border-white/[0.04] pt-1.5">
                          {t.columns.map((c) => (
                            <div key={c.name} className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="text-[#D1D5DB]">{c.name}</span>
                              <span className="text-[#4B5563]">{c.type}</span>
                              {c.note && <span className="text-[#10B981]/70 ml-auto">{c.note}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — editor + results */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 min-h-0 border-b border-white/[0.06]">
            <MonacoEditor
              height="100%"
              language="sql"
              value={sql}
              onChange={(v) => setSql(v ?? '')}
              onMount={(ed) => { editorRef.current = ed }}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                wordWrap: 'on',
                tabSize: 2,
                renderLineHighlight: 'all',
              }}
            />
          </div>

          <div className="h-[42%] min-h-[200px] flex flex-col bg-[#0D0D10] shrink-0">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.05] shrink-0">
              {([
                { id: 'result' as const, label: 'Result', icon: Terminal },
                { id: 'expected' as const, label: 'Expected', icon: Table2 },
                { id: 'plan' as const, label: 'Plan', icon: GitCompareArrows },
                { id: 'history' as const, label: 'History', icon: History },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-colors ${
                    tab === t.id ? 'bg-white/[0.08] text-white' : 'text-[#6B7280] hover:text-white'
                  }`}
                >
                  <t.icon size={11} /> {t.label}
                  {t.id === 'history' && history.length > 0 && <span className="text-[8px] text-[#4B5563]">{history.length}</span>}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2">
                {run.kind === 'ok' && (
                  <span className="flex items-center gap-1 text-[9px] font-mono text-[#6B7280]">
                    <Clock size={9} /> {run.ms < 1 ? '<1' : run.ms.toFixed(1)} ms · {run.result?.values.length ?? 0} rows
                  </span>
                )}
                {(run.kind === 'ok' && run.result) || preview ? (
                  <button onClick={downloadCsv} title="Download result as CSV" className="text-[#6B7280] hover:text-white transition-colors">
                    <Download size={12} />
                  </button>
                ) : null}
                {run.kind === 'ok' && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold ${run.passed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {run.passed ? <><Check size={13} /> Correct</> : <><X size={13} /> Not matching</>}
                  </span>
                )}
                {run.kind === 'error' && (
                  <span className="text-[11px] font-bold text-[#EF4444] flex items-center gap-1.5"><X size={13} /> SQL error</span>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {tab === 'history' ? (
                history.length === 0 ? (
                  <p className="text-[11px] font-mono text-[#6B7280] p-3">Your last 25 executed queries appear here.</p>
                ) : (
                  <div className="overflow-y-auto scrollbar-thin h-full divide-y divide-white/[0.04]">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        onClick={() => setSql(h.sql)}
                        className="w-full text-left px-3 py-2 hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {h.passed === true
                            ? <Check size={11} className="text-[#10B981] shrink-0" />
                            : h.passed === false
                              ? <X size={11} className="text-[#EF4444] shrink-0" />
                              : <span className="w-[11px] shrink-0" />}
                          <code className="flex-1 min-w-0 text-[10.5px] font-mono text-[#9CA3AF] group-hover:text-white truncate">
                            {h.sql.replace(/\s+/g, ' ').trim()}
                          </code>
                          <span className="text-[9px] font-mono text-[#4B5563] shrink-0">{h.rows}r · {h.ms.toFixed(0)}ms</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              ) : tab === 'plan' ? (
                plan
                  ? <ResultTable rs={plan} />
                  : <p className="text-[11px] font-mono text-[#6B7280] p-3">Press <span className="text-[#D1D5DB]">Explain</span> to see the SQLite query plan — it shows scans, index use and join order.</p>
              ) : run.kind === 'idle' ? (
                preview && previewName
                  ? (
                    <>
                      <p className="text-[10px] font-mono text-[#10B981] px-3 py-2 border-b border-white/[0.05]">preview · SELECT * FROM {previewName} LIMIT 8</p>
                      <ResultTable rs={preview} />
                    </>
                  )
                  : <p className="text-[11px] font-mono text-[#6B7280] p-3">Write your query and press <span className="text-[#D1D5DB]">Run</span> (Ctrl/⌘ + Enter). Select text to run just that.</p>
              ) : run.kind === 'running' ? (
                <p className="text-[11px] font-mono text-[#6B7280] p-3 flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Executing…</p>
              ) : run.kind === 'error' ? (
                <pre className="text-[11px] font-mono text-[#EF4444] p-3 whitespace-pre-wrap">{run.message}</pre>
              ) : (
                <>
                  {!run.passed && run.reason && (
                    <p className="text-[11px] font-mono text-[#F59E0B] px-3 py-2 border-b border-white/[0.05]">{run.reason}</p>
                  )}
                  {tab === 'result'
                    ? (run.result ? <ResultTable rs={run.result} /> : <p className="text-[11px] font-mono text-[#6B7280] p-3">No rows returned.</p>)
                    : (run.expected ? <ResultTable rs={run.expected} /> : <p className="text-[11px] font-mono text-[#6B7280] p-3">Reference solution produced no rows.</p>)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
