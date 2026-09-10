'use client'

// ---------------------------------------------------------------------------
// AI / ML Lab — Notebook console. A Colab-style notebook running a real
// in-browser CPython kernel (Pyodide) with numpy / matplotlib and on-demand
// pandas / scikit-learn. Code + markdown cells, run / run-all, inline plots,
// package loader, kernel restart, per-notebook autosave.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft, Play, Trash2, Plus, RotateCcw, ChevronUp, ChevronDown,
  Loader2, Circle, Package, FileCode2, Type, PlayCircle,
  PanelLeftClose, PanelLeftOpen, AlertTriangle, Download, Variable, FastForward,
  Database, UploadCloud, Eraser, Copy, X,
} from 'lucide-react'
import { NOTEBOOKS, NOTEBOOK_MAP, type Notebook, type NbCellType } from '@/lib/aiml-notebook-data'
import type { DrillBrief } from '@/lib/aiml-drill-consoles'

const ACCENT = '#FF4D4D'
const PYODIDE_VERSION = '0.26.4'
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
const NB_KEY = (id: string) => `kiit:aiml:nb:${id}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Py = any

type Output =
  | { kind: 'stream'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'image'; b64: string }
  | { kind: 'result'; text: string }
  | { kind: 'html'; html: string }

interface Dataset { name: string; path: string; kind: string; bytes: number; shape?: string }

interface Cell {
  id: string
  type: NbCellType
  source: string
  outputs: Output[]
  exec: number | null
  ms: number | null
  busy: boolean
  collapsed?: boolean
}

interface VarRow { name: string; type: string; summary: string }

type KernelState = 'idle' | 'booting' | 'ready' | 'running' | 'error'

const uid = () => Math.random().toString(36).slice(2, 9)

const INIT_PY = `
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
plt.show = lambda *a, **k: None
import matplotlib as mpl
mpl.rcParams.update({
    'figure.facecolor': '#0B0B0E', 'axes.facecolor': '#0B0B0E', 'savefig.facecolor': '#0B0B0E',
    'savefig.edgecolor': 'none', 'text.color': '#E5E7EB', 'axes.labelcolor': '#9CA3AF',
    'xtick.color': '#8A8A8A', 'ytick.color': '#8A8A8A', 'axes.edgecolor': '#3F3F46',
    'axes.titlecolor': '#E5E7EB', 'grid.color': '#26262C', 'axes.grid': False,
    'figure.figsize': (6, 3.4), 'figure.dpi': 110, 'font.size': 9,
})

def __capture_figs():
    import sys
    if 'matplotlib' not in sys.modules:
        return []
    import matplotlib.pyplot as _p, io as _io, base64 as _b
    res = []
    for _n in _p.get_fignums():
        _f = _p.figure(_n)
        _buf = _io.BytesIO()
        _f.savefig(_buf, format='png', bbox_inches='tight')
        res.append(_b.b64encode(_buf.getvalue()).decode())
        _p.close(_f)
    return res

def __inspect():
    _hide = {'__capture_figs', '__inspect', 'In', 'Out', 'exit', 'quit', 'get_ipython', 'mpl', 'plt', 'matplotlib'}
    out = []
    for _k, _v in list(globals().items()):
        if _k.startswith('_') or _k in _hide:
            continue
        _t = type(_v).__name__
        if _t in ('module', 'function', 'type', 'builtin_function_or_method', 'method'):
            continue
        try:
            if hasattr(_v, 'shape'):
                _s = 'shape ' + str(tuple(_v.shape))
            elif isinstance(_v, (list, tuple, set, dict, str, bytes)):
                _s = 'len ' + str(len(_v))
            elif isinstance(_v, (int, float, bool)):
                _s = repr(_v)[:24]
            else:
                _s = ''
        except Exception:
            _s = ''
        out.append((_k, _t, _s))
    return out
`

let pyodidePromise: Promise<Py> | null = null

function bootKernel(onStage: (s: string) => void): Promise<Py> {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = (async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    if (!w.loadPyodide) {
      onStage('Downloading Python runtime…')
      await new Promise<void>((res, rej) => {
        const s = document.createElement('script')
        s.src = `${PYODIDE_BASE}pyodide.js`
        s.onload = () => res()
        s.onerror = () => rej(new Error('Could not load the Python runtime (network blocked?).'))
        document.head.appendChild(s)
      })
    }
    onStage('Starting interpreter…')
    const py = await w.loadPyodide({ indexURL: PYODIDE_BASE })
    onStage('Loading numpy + matplotlib…')
    await py.loadPackage(['numpy', 'matplotlib'])
    py.runPython(INIT_PY)
    w.__kiitPyodide = py
    return py
  })()
  return pyodidePromise
}

// -- minimal markdown -----------------------------------------------------

function renderMarkdown(src: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = esc(src).split('\n')
  const out: string[] = []
  let inList = false
  let inCode = false
  for (const raw of lines) {
    if (raw.trim().startsWith('```')) {
      if (inCode) { out.push('</code></pre>'); inCode = false }
      else { if (inList) { out.push('</ul>'); inList = false } out.push('<pre class="nb-md-pre"><code>'); inCode = true }
      continue
    }
    if (inCode) { out.push(raw); continue }
    let line = raw
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+?)`/g, '<code class="nb-md-code">$1</code>')
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      if (inList) { out.push('</ul>'); inList = false }
      const lvl = h[1].length
      out.push(`<div class="nb-md-h${lvl}">${h[2]}</div>`)
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul class="nb-md-ul">'); inList = true }
      out.push(`<li>${line.replace(/^[-*]\s+/, '')}</li>`)
      continue
    }
    if (inList) { out.push('</ul>'); inList = false }
    if (line.trim() === '') out.push('<div class="nb-md-sp"></div>')
    else out.push(`<p class="nb-md-p">${line}</p>`)
  }
  if (inList) out.push('</ul>')
  if (inCode) out.push('</code></pre>')
  return out.join('')
}

// -- cell editor (auto-grow textarea) -----------------------------------

function CellEditor({
  value, onChange, onRun, onRunAdvance, placeholder,
}: {
  value: string; onChange: (s: string) => void; onRun: () => void
  onRunAdvance?: () => void; placeholder?: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 24)}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      spellCheck={false}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); (onRunAdvance ?? onRun)(); return }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); onRun() }
        if (e.key === 'Tab') {
          e.preventDefault()
          const el = e.currentTarget
          const s = el.selectionStart, en = el.selectionEnd
          const next = value.slice(0, s) + '    ' + value.slice(en)
          onChange(next)
          requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4 })
        }
      }}
      className="w-full resize-none bg-transparent outline-none font-mono text-[13.5px] leading-[1.6] text-[#E5E7EB] placeholder:text-[#4B5563]"
      rows={1}
    />
  )
}

// =========================================================================

export default function AimlNotebook({
  notebookId, override, brief, onBack, onPick,
}: {
  notebookId: string
  /** an ad-hoc notebook (e.g. launched from a drill "practice in console") */
  override?: Notebook | null
  /** left-pane reference shown when launched from a drill question */
  brief?: DrillBrief | null
  onBack: () => void
  onPick: (id: string) => void
}) {
  const nb: Notebook = override ?? NOTEBOOK_MAP[notebookId] ?? NOTEBOOKS[0]

  const [listOpen, setListOpen] = useState(false)
  const [briefOpen, setBriefOpen] = useState(true)
  const [kernel, setKernel] = useState<KernelState>('idle')
  const [stage, setStage] = useState('')
  const [bootErr, setBootErr] = useState<string | null>(null)
  const [cells, setCells] = useState<Cell[]>([])
  const [loadedPkgs, setLoadedPkgs] = useState<Set<string>>(new Set(['numpy', 'matplotlib']))
  const [pkgBusy, setPkgBusy] = useState(false)
  const [vars, setVars] = useState<VarRow[]>([])
  const [varsOpen, setVarsOpen] = useState(false)
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [dataOpen, setDataOpen] = useState(false)
  const [preview, setPreview] = useState<{ name: string; html: string; note: string; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const pyRef = useRef<Py>(null)
  const runningCell = useRef<string | null>(null)

  // ---- load cells for the active notebook (saved draft or seed) ----
  useEffect(() => {
    let seeded = nb.cells.map((c) => ({ ...c, id: uid(), outputs: [], exec: null, ms: null, busy: false }))
    try {
      const raw = window.localStorage.getItem(NB_KEY(nb.id))
      if (raw) {
        const saved = JSON.parse(raw) as { type: NbCellType; source: string }[]
        if (Array.isArray(saved) && saved.length) {
          seeded = saved.map((c) => ({ id: uid(), type: c.type, source: c.source, outputs: [], exec: null, ms: null, busy: false }))
        }
      }
    } catch { /* ignore */ }
    setCells(seeded)
    setListOpen(false)
  }, [nb])

  // ---- autosave (source + type only) ----
  useEffect(() => {
    if (!cells.length) return
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(NB_KEY(nb.id), JSON.stringify(cells.map((c) => ({ type: c.type, source: c.source }))))
      } catch { /* quota */ }
    }, 500)
    return () => clearTimeout(t)
  }, [cells, nb.id])

  // ---- boot kernel on mount ----
  const ensureKernel = useCallback(async (): Promise<Py | null> => {
    if (pyRef.current) return pyRef.current
    setKernel('booting'); setBootErr(null)
    try {
      const py = await bootKernel(setStage)
      pyRef.current = py
      // per-instance stdout/stderr routing
      py.setStdout({ batched: (s: string) => appendStream(s, 'stream') })
      py.setStderr({ batched: (s: string) => appendStream(s, 'error') })
      setKernel('ready')
      if (nb.packages.length) void loadPackages(nb.packages, py)
      return py
    } catch (e) {
      setKernel('error')
      setBootErr(e instanceof Error ? e.message : 'Kernel failed to start.')
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nb])

  useEffect(() => { void ensureKernel() }, [ensureKernel])

  // ---- output routing ----
  const appendStream = (text: string, kind: 'stream' | 'error') => {
    const id = runningCell.current
    if (!id) return
    setCells((prev) => prev.map((c) => {
      if (c.id !== id) return c
      const last = c.outputs[c.outputs.length - 1]
      if (last && last.kind === kind) {
        return { ...c, outputs: [...c.outputs.slice(0, -1), { kind, text: last.text + text }] }
      }
      return { ...c, outputs: [...c.outputs, { kind, text }] }
    }))
  }
  const addOutput = (id: string, o: Output) =>
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, outputs: [...c.outputs, o] } : c)))

  // ---- packages ----
  const loadPackages = useCallback(async (pkgs: string[], py?: Py) => {
    const k = py ?? pyRef.current
    if (!k) return
    const need = pkgs.filter((p) => !loadedPkgs.has(p))
    if (!need.length) return
    setPkgBusy(true)
    try {
      await k.loadPackage(need)
      setLoadedPkgs((prev) => new Set([...prev, ...need]))
    } catch { /* surfaced on run */ }
    setPkgBusy(false)
  }, [loadedPkgs])

  // ---- run a single code cell ----
  const execCounter = useRef(0)
  const runCell = useCallback(async (id: string): Promise<boolean> => {
    const py = await ensureKernel()
    if (!py) return false
    const target = cells.find((c) => c.id === id)
    if (!target || target.type !== 'code') return true

    setKernel('running')
    runningCell.current = id
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, busy: true, outputs: [], exec: null, ms: null, collapsed: false } : c)))

    let ok = true
    const t0 = performance.now()
    try {
      const result = await py.runPythonAsync(target.source)
      // inline figures
      try {
        const figs = py.runPython('__capture_figs()')
        const arr: string[] = figs.toJs ? figs.toJs() : []
        if (figs?.destroy) figs.destroy()
        arr.forEach((b64) => addOutput(id, { kind: 'image', b64 }))
      } catch { /* no matplotlib */ }
      // last-expression value — render pandas / rich objects as HTML when possible
      if (result !== undefined && result !== null) {
        let handled = false
        try {
          if (typeof result === 'object' && typeof result._repr_html_ === 'function') {
            const html = result._repr_html_()
            if (typeof html === 'string' && html.trim()) { addOutput(id, { kind: 'html', html }); handled = true }
          }
        } catch { /* fall back to text */ }
        if (!handled) {
          let text = ''
          try { text = typeof result === 'object' && result.toString ? result.toString() : String(result) } catch { text = '' }
          if (text && text !== 'None') addOutput(id, { kind: 'result', text })
        }
        try { if (typeof result === 'object' && result.destroy) result.destroy() } catch { /* noop */ }
      }
      execCounter.current += 1
      const n = execCounter.current
      const ms = Math.round(performance.now() - t0)
      setCells((prev) => prev.map((c) => (c.id === id ? { ...c, exec: n, ms } : c)))
      // variable inspector
      try {
        const raw = py.runPython('__inspect()')
        const rows = (raw.toJs ? raw.toJs() : []) as [string, string, string][]
        if (raw?.destroy) raw.destroy()
        setVars(rows.map(([name, type, summary]) => ({ name, type, summary })))
      } catch { /* ignore */ }
    } catch (e) {
      ok = false
      addOutput(id, { kind: 'error', text: e instanceof Error ? e.message : String(e) })
      setCells((prev) => prev.map((c) => (c.id === id ? { ...c, ms: Math.round(performance.now() - t0) } : c)))
    } finally {
      runningCell.current = null
      setCells((prev) => prev.map((c) => (c.id === id ? { ...c, busy: false } : c)))
      setKernel('ready')
    }
    return ok
  }, [cells, ensureKernel])

  const runAll = useCallback(async () => {
    for (const c of cells) {
      if (c.type !== 'code') continue
      const ok = await runCell(c.id)
      if (!ok) break
    }
  }, [cells, runCell])

  const clearOutputs = useCallback(() => {
    setCells((prev) => prev.map((c) => ({ ...c, outputs: [], exec: null, ms: null, collapsed: false })))
  }, [])

  // ---- data upload (CSV / TSV / JSON / text) ----
  const refreshPreview = useCallback(async (name: string, path: string, kind: string) => {
    const py = pyRef.current
    if (!py) return
    const J = JSON.stringify
    const grab = (code: string) => { try { return String(py.runPython(code)) } catch { return '' } }
    try {
      if (kind === 'csv' || kind === 'tsv' || kind === 'txt') {
        const sep = kind === 'tsv' ? ", sep='\\t'" : ''
        const res = await py.runPythonAsync(`import pandas as pd\ndf = pd.read_csv(${J(path)}${sep})\ndf.head(12)`)
        let html = ''
        try { if (res && typeof res._repr_html_ === 'function') html = res._repr_html_() } catch { /* noop */ }
        try { res?.destroy?.() } catch { /* noop */ }
        const note = grab('f"{df.shape[0]:,} rows × {df.shape[1]} columns"')
        const text = grab('"column dtypes\\n" + df.dtypes.astype(str).to_string()')
        const shp = grab('f"{df.shape[0]} × {df.shape[1]}"')
        setPreview({ name, html, note, text })
        setDatasets((d) => d.map((x) => (x.name === name ? { ...x, shape: shp || x.shape } : x)))
      } else if (kind === 'json') {
        const r = await py.runPythonAsync(
          `import json\n_o = json.load(open(${J(path)}))\n` +
          `try:\n    import pandas as pd\n    df = pd.json_normalize(_o) if isinstance(_o, list) else pd.json_normalize([_o])\n    df.head(12)\nexcept Exception:\n    None`,
        )
        let html = ''
        try { if (r && typeof r._repr_html_ === 'function') html = r._repr_html_() } catch { /* noop */ }
        try { r?.destroy?.() } catch { /* noop */ }
        if (html) {
          setPreview({ name, html, note: grab('f"{df.shape[0]:,} rows × {df.shape[1]} columns (json_normalize → df)"'), text: '' })
        } else {
          setPreview({ name, html: '', note: 'parsed as `_o` — not tabular', text: grab(`import json\njson.dumps(json.load(open(${J(path)})), indent=2)[:2200]`) })
        }
      }
    } catch (e) {
      setPreview({ name, html: '', note: e instanceof Error ? e.message : 'could not preview this file', text: '' })
    }
    // reflect the new df / _o in the namespace strip too
    try {
      const py = pyRef.current
      const raw = py?.runPython('__inspect()')
      const rows = (raw?.toJs ? raw.toJs() : []) as [string, string, string][]
      raw?.destroy?.()
      if (rows.length) setVars(rows.map(([nm, tp, sm]) => ({ name: nm, type: tp, summary: sm })))
    } catch { /* noop */ }
  }, [])

  const onUpload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const py = await ensureKernel()
      if (!py) return
      const clean = file.name.replace(/[^\w.\-]+/g, '_')
      const kind = (clean.split('.').pop() || '').toLowerCase()
      const text = await file.text()
      try { py.FS.mkdir('/data') } catch { /* exists */ }
      const path = `/data/${clean}`
      py.FS.writeFile(path, text)
      if (kind === 'csv' || kind === 'tsv' || kind === 'json') await loadPackages(['pandas'], py)
      setDatasets((d) => [...d.filter((x) => x.name !== clean), { name: clean, path, kind, bytes: text.length }])
      setDataOpen(true)
      await refreshPreview(clean, path, kind)
      // drop a reproducible loader cell at the top of the notebook
      const sep = kind === 'tsv' ? ", sep='\\t'" : ''
      const loader =
        kind === 'json'
          ? `import json, pandas as pd\n_raw = json.load(open(${JSON.stringify(path)}))\ndf = pd.json_normalize(_raw if isinstance(_raw, list) else [_raw])\ndf.head()`
          : `import pandas as pd\ndf = pd.read_csv(${JSON.stringify(path)}${sep})\nprint("loaded", df.shape)\ndf.head()`
      setCells((prev) => [
        { id: uid(), type: 'code' as const, source: loader, outputs: [], exec: null, ms: null, busy: false },
        ...prev,
      ])
    } catch (e) {
      setPreview({ name: file.name, html: '', note: e instanceof Error ? e.message : 'upload failed', text: '' })
      setDataOpen(true)
    } finally {
      setUploading(false)
    }
  }, [ensureKernel, loadPackages, refreshPreview])

  const deleteDataset = useCallback((ds: Dataset) => {
    try { pyRef.current?.FS?.unlink(ds.path) } catch { /* noop */ }
    setDatasets((d) => d.filter((x) => x.name !== ds.name))
    setPreview((p) => (p && p.name === ds.name ? null : p))
  }, [])

  const insertLoaderCell = useCallback((ds: Dataset) => {
    const sep = ds.kind === 'tsv' ? ", sep='\\t'" : ''
    const src =
      ds.kind === 'json'
        ? `import json, pandas as pd\n_raw = json.load(open(${JSON.stringify(ds.path)}))\ndf = pd.json_normalize(_raw if isinstance(_raw, list) else [_raw])\ndf.head()`
        : `import pandas as pd\ndf = pd.read_csv(${JSON.stringify(ds.path)}${sep})\ndf.head()`
    setCells((prev) => [...prev, { id: uid(), type: 'code' as const, source: src, outputs: [], exec: null, ms: null, busy: false }])
  }, [])

  const exportIpynb = useCallback(() => {
    const toSrc = (s: string) => {
      const parts = s.split('\n')
      return parts.map((l, i) => (i < parts.length - 1 ? l + '\n' : l))
    }
    const nbJson = {
      cells: cells.map((c) =>
        c.type === 'markdown'
          ? { cell_type: 'markdown', metadata: {}, source: toSrc(c.source) }
          : { cell_type: 'code', metadata: {}, execution_count: c.exec, outputs: [], source: toSrc(c.source) },
      ),
      metadata: {
        kernelspec: { name: 'python3', display_name: 'Python 3' },
        language_info: { name: 'python', version: '3.11' },
      },
      nbformat: 4,
      nbformat_minor: 5,
    }
    const blob = new Blob([JSON.stringify(nbJson, null, 1)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nb.id}.ipynb`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }, [cells, nb.id])

  // ---- kernel restart ----
  const restartKernel = useCallback(async (): Promise<Py | null> => {
    setKernel('booting'); setStage('Restarting kernel…')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    pyodidePromise = null
    w.__kiitPyodide = undefined
    pyRef.current = null
    execCounter.current = 0
    setVars([])
    setLoadedPkgs(new Set(['numpy', 'matplotlib']))
    setCells((prev) => prev.map((c) => ({ ...c, outputs: [], exec: null, ms: null, busy: false })))
    return ensureKernel()
  }, [ensureKernel])

  const restartAndRunAll = useCallback(async () => {
    const py = await restartKernel()
    if (!py) return
    if (nb.packages.length) await loadPackages(nb.packages, py)
    for (const c of cells) {
      if (c.type !== 'code') continue
      const ok = await runCell(c.id)
      if (!ok) break
    }
  }, [restartKernel, cells, runCell, loadPackages, nb.packages])

  // ---- cell ops ----
  const patchCell = (id: string, p: Partial<Cell>) =>
    setCells((prev) => prev.map((c) => (c.id === id ? { ...c, ...p } : c)))
  const addCell = (afterId: string | null, type: NbCellType) => {
    const cell: Cell = { id: uid(), type, source: '', outputs: [], exec: null, ms: null, busy: false }
    setCells((prev) => {
      if (afterId == null) return [...prev, cell]
      const i = prev.findIndex((c) => c.id === afterId)
      return [...prev.slice(0, i + 1), cell, ...prev.slice(i + 1)]
    })
  }
  const removeCell = (id: string) => setCells((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)))
  const duplicateCell = (id: string) => setCells((prev) => {
    const i = prev.findIndex((c) => c.id === id)
    if (i < 0) return prev
    const copy: Cell = { ...prev[i], id: uid(), outputs: [], exec: null, ms: null, busy: false, collapsed: false }
    return [...prev.slice(0, i + 1), copy, ...prev.slice(i + 1)]
  })
  const moveCell = (id: string, dir: -1 | 1) => setCells((prev) => {
    const i = prev.findIndex((c) => c.id === id)
    const j = i + dir
    if (j < 0 || j >= prev.length) return prev
    const next = [...prev]
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  })
  const resetNotebook = () => {
    try { window.localStorage.removeItem(NB_KEY(nb.id)) } catch { /* noop */ }
    setCells(nb.cells.map((c) => ({ ...c, id: uid(), outputs: [], exec: null, ms: null, busy: false })))
  }

  const kernelPill = () => {
    const map: Record<KernelState, { c: string; label: string }> = {
      idle: { c: '#6B7280', label: 'kernel idle' },
      booting: { c: '#FBBF24', label: stage || 'starting kernel…' },
      ready: { c: '#34D399', label: `Python ${PYODIDE_VERSION.split('.').slice(0, 2).join('.')} · ready` },
      running: { c: '#FF4D4D', label: 'running…' },
      error: { c: '#FB7185', label: 'kernel error' },
    }
    const s = map[kernel]
    return (
      <span className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: s.c }}>
        {kernel === 'booting' || kernel === 'running'
          ? <Loader2 size={10} className="animate-spin" />
          : <Circle size={8} fill="currentColor" />}
        {s.label}
      </span>
    )
  }

  const anyBusy = cells.some((c) => c.busy) || kernel === 'booting'
  const missingPkgs = nb.packages.filter((p) => !loadedPkgs.has(p))

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      <style>{`
        .nb-md-h1{font-size:19px;font-weight:800;color:#fff;margin:2px 0 6px}
        .nb-md-h2{font-size:15.5px;font-weight:700;color:#fff;margin:8px 0 4px}
        .nb-md-h3{font-size:13.5px;font-weight:700;color:#D1D5DB;margin:6px 0 3px}
        .nb-md-h4{font-size:12.5px;font-weight:700;color:#9CA3AF;margin:6px 0 3px}
        .nb-md-p{font-size:13.5px;line-height:1.65;color:#B4B8BF;margin:3px 0}
        .nb-md-ul{margin:4px 0 4px 16px;list-style:disc}
        .nb-md-ul li{font-size:13.5px;line-height:1.6;color:#B4B8BF;margin:2px 0}
        .nb-md-sp{height:6px}
        .nb-md-code{font-family:ui-monospace,monospace;font-size:12.5px;background:#1C1C22;border:1px solid #2A2A32;border-radius:4px;padding:1px 4px;color:#E5E7EB}
        .nb-md-pre{background:#111114;border:1px solid #26262C;border-radius:8px;padding:10px;overflow-x:auto;margin:6px 0}
        .nb-md-pre code{font-family:ui-monospace,monospace;font-size:12.5px;color:#D1D5DB;white-space:pre}
        .nb-html table{border-collapse:collapse;font-family:ui-monospace,monospace;font-size:11.5px}
        .nb-html th,.nb-html td{border:1px solid #26262C;padding:3px 9px;text-align:right;white-space:nowrap}
        .nb-html thead th,.nb-html th{background:#141418;color:#E5E7EB;font-weight:600;position:sticky;top:0}
        .nb-html td{color:#C7C9CE}
        .nb-html tbody th{background:#111114;color:#9CA3AF}
        .nb-html tr:hover td{background:rgba(255,255,255,0.02)}
      `}</style>

      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={onBack} title="Back to AI/ML Lab" className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors shrink-0">
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => (brief ? setBriefOpen((v) => !v) : setListOpen((v) => !v))}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
              (brief ? briefOpen : listOpen) ? 'bg-[#FF4D4D]/10 border-[#FF4D4D]/30 text-[#FF4D4D]' : 'bg-white/[0.04] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
            title={brief ? 'Question & brief' : 'Notebooks'}
          >
            {(brief ? briefOpen : listOpen) ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
          <FileCode2 size={14} className="text-[#FF4D4D] shrink-0" />
          <h2 className="text-sm font-bold text-white truncate">{brief ? brief.title : nb.title}</h2>
          <span className="hidden md:block">{kernelPill()}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {missingPkgs.length > 0 && (
            <button
              onClick={() => loadPackages(missingPkgs)}
              disabled={pkgBusy || kernel === 'booting'}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#FBBF24] bg-[#FBBF24]/[0.08] border border-[#FBBF24]/20 hover:bg-[#FBBF24]/[0.14] disabled:opacity-40 transition-colors"
            >
              {pkgBusy ? <Loader2 size={11} className="animate-spin" /> : <Package size={11} />}
              {pkgBusy ? 'loading' : `load ${missingPkgs.join(', ')}`}
            </button>
          )}
          <label
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono border cursor-pointer transition-colors ${
              datasets.length ? 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]' : 'bg-white/[0.03] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
            title="Upload a CSV / TSV / JSON file into the kernel"
          >
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <UploadCloud size={11} />}
            {uploading ? 'uploading' : `Data${datasets.length ? ` ${datasets.length}` : ''}`}
            <input
              type="file" accept=".csv,.tsv,.json,.txt" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void onUpload(f) }}
            />
          </label>
          {datasets.length > 0 && (
            <button
              onClick={() => setDataOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                dataOpen ? 'bg-[#34D399]/10 border-[#34D399]/30 text-[#34D399]' : 'bg-white/[0.03] border-white/[0.08] text-[#8A8A8A] hover:text-white'
              }`}
            >
              <Database size={11} /> {dataOpen ? 'hide' : 'show'}
            </button>
          )}
          <button
            onClick={() => setVarsOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
              varsOpen ? 'bg-[#60A5FA]/10 border-[#60A5FA]/30 text-[#60A5FA]' : 'bg-white/[0.03] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
          >
            <Variable size={11} /> Vars{vars.length ? ` ${vars.length}` : ''}
          </button>
          <button onClick={runAll} disabled={anyBusy || kernel === 'error'} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-40 transition-colors">
            <PlayCircle size={11} /> Run all
          </button>
          <button onClick={restartAndRunAll} disabled={anyBusy} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-40 transition-colors" title="Fresh kernel, then run every cell">
            <FastForward size={11} /> Restart &amp; run all
          </button>
          <button onClick={() => restartKernel()} disabled={kernel === 'booting'} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] disabled:opacity-40 transition-colors">
            <RotateCcw size={11} /> Restart
          </button>
          <button onClick={clearOutputs} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors" title="Clear every cell's output">
            <Eraser size={11} /> Clear out
          </button>
          <button onClick={exportIpynb} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors" title="Download as .ipynb">
            <Download size={11} /> .ipynb
          </button>
          <button onClick={resetNotebook} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            Reset cells
          </button>
        </div>
      </div>

      {varsOpen && (
        <div className="shrink-0 border-b border-white/[0.06] bg-[#0B0B0E] px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] shrink-0">Namespace</span>
          {vars.length === 0 ? (
            <span className="text-[11px] font-mono text-[#4B5563]">run a cell to populate</span>
          ) : (
            vars.map((v) => (
              <span key={v.name} title={v.summary} className="shrink-0 text-[11px] font-mono rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1">
                <span className="text-[#E5E7EB]">{v.name}</span>
                <span className="text-[#6B7280]"> : {v.type}{v.summary ? ` · ${v.summary}` : ''}</span>
              </span>
            ))
          )}
        </div>
      )}

      {dataOpen && datasets.length > 0 && (
        <div className="shrink-0 border-b border-white/[0.06] bg-[#0B0B0E] max-h-[46vh] overflow-y-auto scrollbar-thin">
          <div className="px-4 py-2.5 flex flex-wrap items-center gap-2 border-b border-white/[0.04]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#34D399] shrink-0 flex items-center gap-1.5"><Database size={11} /> Uploaded data</span>
            {datasets.map((ds) => (
              <span key={ds.name} className={`flex items-center gap-1.5 text-[11px] font-mono rounded-md border px-2 py-1 ${preview?.name === ds.name ? 'border-[#34D399]/40 bg-[#34D399]/[0.08] text-white' : 'border-white/[0.08] bg-white/[0.03] text-[#9CA3AF]'}`}>
                <button onClick={() => refreshPreview(ds.name, ds.path, ds.kind)} className="hover:text-white transition-colors" title="Preview">{ds.name}</button>
                <span className="text-[#4B5563]">{ds.kind}{ds.shape ? ` · ${ds.shape}` : ''} · {(ds.bytes / 1024).toFixed(1)}kB</span>
                <button onClick={() => insertLoaderCell(ds)} title="Append a loader cell" className="text-[#6B7280] hover:text-[#34D399] transition-colors"><Plus size={11} /></button>
                <button onClick={() => deleteDataset(ds)} title="Remove file" className="text-[#6B7280] hover:text-[#FB7185] transition-colors"><X size={11} /></button>
              </span>
            ))}
          </div>
          {preview && (
            <div className="px-4 py-3 space-y-2">
              <div className="text-[11px] font-mono text-[#8A8A8A]">
                <span className="text-[#D1D5DB]">{preview.name}</span>{preview.note ? ` — ${preview.note}` : ''}
              </div>
              {preview.html && (
                <div className="nb-html max-h-[30vh] overflow-auto scrollbar-thin rounded-lg border border-white/[0.06]" dangerouslySetInnerHTML={{ __html: preview.html }} />
              )}
              {preview.text && (
                <pre className="text-[11px] font-mono text-[#9CA3AF] whitespace-pre overflow-auto scrollbar-thin max-h-[24vh] rounded-lg border border-white/[0.06] p-2.5">{preview.text}</pre>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`flex-1 min-h-0 ${brief ? 'flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden scrollbar-thin' : 'flex'}`}>
        {/* drill brief — left reference pane */}
        {brief && briefOpen && <BriefPanel brief={brief} onLeave={() => onPick(NOTEBOOKS[0].id)} />}

        {/* notebook rail */}
        {listOpen && !brief && (
          <div className="w-[248px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
            <div className="px-3 py-2.5 border-b border-white/[0.05] text-[11px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
              <FileCode2 size={11} /> Notebooks
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
              {override && !NOTEBOOK_MAP[override.id] && (
                <div className="px-2.5 py-2 rounded-lg bg-[#FF4D4D]/[0.1] border border-[#FF4D4D]/20">
                  <div className="text-[12.5px] font-semibold text-white">{override.title}</div>
                  <div className="text-[11px] text-[#6B7280] leading-snug mt-0.5 line-clamp-2">from a drill · pick another to leave</div>
                </div>
              )}
              {NOTEBOOKS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onPick(n.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                    n.id === nb.id ? 'bg-[#FF4D4D]/[0.1]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className={`text-[12.5px] font-semibold ${n.id === nb.id ? 'text-white' : 'text-[#9CA3AF]'}`}>{n.title}</div>
                  <div className="text-[11px] text-[#6B7280] leading-snug mt-0.5 line-clamp-2">{n.blurb}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* notebook surface */}
        <div className={`flex-1 min-w-0 scrollbar-thin ${brief ? 'xl:overflow-y-auto' : 'overflow-y-auto'}`}>
          <div className={`mx-auto px-5 sm:px-8 py-6 space-y-2.5 ${brief ? 'max-w-[900px]' : 'max-w-[1180px]'}`}>
            {!brief && <p className="text-[13px] text-[#8A8A8A] leading-relaxed pb-1">{nb.blurb}</p>}

            {bootErr && (
              <div className="rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/[0.06] p-3 flex items-start gap-2.5">
                <AlertTriangle size={14} className="text-[#FB7185] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] text-[#FB7185] font-semibold">Kernel failed to start</p>
                  <p className="text-[12px] text-[#9CA3AF] mt-1">{bootErr}</p>
                  <button onClick={restartKernel} className="mt-2 text-[12px] font-mono text-white bg-white/[0.06] hover:bg-white/[0.12] px-2.5 py-1 rounded-lg transition-colors">Retry</button>
                </div>
              </div>
            )}

            {cells.map((cell, i) => (
              <CellView
                key={cell.id}
                cell={cell}
                first={i === 0}
                last={i === cells.length - 1}
                kernelReady={kernel !== 'error'}
                onChange={(s) => patchCell(cell.id, { source: s })}
                onRun={() => runCell(cell.id)}
                onRunAdvance={async () => { const ok = await runCell(cell.id); if (ok && i === cells.length - 1) addCell(cell.id, 'code') }}
                onToggleType={() => patchCell(cell.id, { type: cell.type === 'code' ? 'markdown' : 'code', outputs: [], exec: null })}
                onToggleCollapse={() => patchCell(cell.id, { collapsed: !cell.collapsed })}
                onAddBelow={(t) => addCell(cell.id, t)}
                onDuplicate={() => duplicateCell(cell.id)}
                onRemove={() => removeCell(cell.id)}
                onMove={(d) => moveCell(cell.id, d)}
              />
            ))}

            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => addCell(null, 'code')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors">
                <Plus size={12} /> Code
              </button>
              <button onClick={() => addCell(null, 'markdown')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors">
                <Type size={12} /> Markdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// -- drill brief (left reference pane) ----------------------------------

function BriefPanel({ brief, onLeave }: { brief: DrillBrief; onLeave: () => void }) {
  const stepsMd = brief.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')
  return (
    <div className="w-full xl:w-[420px] 2xl:w-[460px] shrink-0 border-b xl:border-b-0 xl:border-r border-white/[0.06] bg-[#0D0D10] xl:overflow-y-auto xl:scrollbar-thin">
      <div className="p-5 space-y-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6] mb-1.5">From the drill</div>
          <p className="text-[14.5px] text-white font-medium leading-snug">{brief.question}</p>
          <p className="text-[11px] font-mono text-[#6B7280] mt-1">{brief.subtopic}</p>
        </div>

        <div className="glass rounded-xl p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">Context — how to approach this in code</div>
          <p className="text-[12.5px] text-[#B4B8BF] leading-relaxed">{brief.context}</p>
        </div>

        <div className="glass rounded-xl p-3.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D4D] mb-1">How to work this</div>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(stepsMd) }} />
        </div>

        {brief.io && (
          <div className="rounded-xl border border-[#8B5CF6]/25 bg-[#8B5CF6]/[0.05] p-3.5">
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(brief.io) }} />
          </div>
        )}

        <div className="pt-1 border-t border-white/[0.06] space-y-2">
          <p className="text-[10.5px] text-[#6B7280] leading-relaxed">
            Scoped to this question. <span className="text-[#9CA3AF]">Reset cells</span> restores the scaffold;
            <span className="text-[#9CA3AF]"> Data</span> swaps in a real CSV.
          </p>
          <button onClick={onLeave} className="text-[11px] font-mono text-[#8A8A8A] hover:text-white transition-colors">← browse other notebooks</button>
        </div>
      </div>
    </div>
  )
}

// -- one cell ------------------------------------------------------------

function CellView({
  cell, first, last, kernelReady, onChange, onRun, onRunAdvance, onToggleType, onToggleCollapse, onAddBelow, onDuplicate, onRemove, onMove,
}: {
  cell: Cell
  first: boolean
  last: boolean
  kernelReady: boolean
  onChange: (s: string) => void
  onRun: () => void
  onRunAdvance: () => void
  onToggleType: () => void
  onToggleCollapse: () => void
  onAddBelow: (t: NbCellType) => void
  onDuplicate: () => void
  onRemove: () => void
  onMove: (d: -1 | 1) => void
}) {
  const [editingMd, setEditingMd] = useState(cell.source.trim() === '')
  const outLines = cell.outputs.reduce((n, o) => n + (o.kind === 'image' ? 6 : o.kind === 'html' ? 12 : o.text.split('\n').length), 0)
  const collapsible = outLines > 16

  if (cell.type === 'markdown' && !editingMd) {
    return (
      <div className="group relative rounded-xl px-3 py-1.5 hover:bg-white/[0.015] transition-colors" onDoubleClick={() => setEditingMd(true)}>
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(cell.source || '*empty markdown cell — double-click to edit*') }} />
        <CellTools cell={cell} first={first} last={last} onToggleType={onToggleType} onAddBelow={onAddBelow} onDuplicate={onDuplicate} onRemove={onRemove} onMove={onMove} onEditMd={() => setEditingMd(true)} />
      </div>
    )
  }

  const isMd = cell.type === 'markdown'
  return (
    <div className="group relative glass rounded-xl overflow-hidden">
      <div className="flex">
        {/* gutter */}
        <div className="w-11 shrink-0 flex flex-col items-center pt-2.5 gap-1 border-r border-white/[0.05] bg-[#0B0B0E]">
          {isMd ? (
            <button onClick={() => setEditingMd(false)} title="Render (⌘↵)" className="text-[#6B7280] hover:text-[#FF4D4D] transition-colors">
              <Type size={14} />
            </button>
          ) : (
            <button onClick={onRun} disabled={!kernelReady || cell.busy} title="Run (Ctrl/⌘ + Enter)" className="text-[#6B7280] hover:text-[#FF4D4D] disabled:opacity-40 transition-colors">
              {cell.busy ? <Loader2 size={15} className="animate-spin text-[#FF4D4D]" /> : <Play size={15} />}
            </button>
          )}
          {!isMd && (
            <>
              <span className="text-[10px] font-mono text-[#4B5563]">{cell.busy ? '[*]' : cell.exec != null ? `[${cell.exec}]` : '[ ]'}</span>
              {cell.ms != null && !cell.busy && (
                <span className="text-[9px] font-mono text-[#3F3F46]">{cell.ms < 1000 ? `${cell.ms}ms` : `${(cell.ms / 1000).toFixed(1)}s`}</span>
              )}
            </>
          )}
        </div>

        {/* body */}
        <div className="flex-1 min-w-0">
          <div className="px-3 py-2.5">
            <CellEditor
              value={cell.source}
              onChange={onChange}
              onRun={isMd ? () => setEditingMd(false) : onRun}
              onRunAdvance={isMd ? () => setEditingMd(false) : onRunAdvance}
              placeholder={isMd ? '# Markdown — **bold**, `code`, - bullets' : '# Python — Shift+Enter runs & advances'}
            />
          </div>

          {cell.outputs.length > 0 && (
            <div className="border-t border-white/[0.05] bg-[#0B0B0E]">
              {collapsible && (
                <button onClick={onToggleCollapse} className="w-full flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-[#6B7280] hover:text-white border-b border-white/[0.04] transition-colors">
                  {cell.collapsed ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
                  {cell.collapsed ? `show output (${outLines} lines)` : 'collapse output'}
                </button>
              )}
              {!(collapsible && cell.collapsed) && (
                <div className="px-3 py-2 space-y-2">
                  {cell.outputs.map((o, k) => {
                    if (o.kind === 'image') {
                      return (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={k} src={`data:image/png;base64,${o.b64}`} alt="cell output figure" className="max-w-full rounded-lg border border-white/[0.06]" />
                      )
                    }
                    if (o.kind === 'html') {
                      return (
                        <div key={k} className="nb-html max-h-[440px] overflow-auto scrollbar-thin rounded-lg border border-white/[0.06]" dangerouslySetInnerHTML={{ __html: o.html }} />
                      )
                    }
                    return (
                      <pre
                        key={k}
                        className={`text-[12.5px] font-mono leading-[1.55] overflow-x-auto scrollbar-thin ${
                          o.kind === 'error' ? 'text-[#FB7185] whitespace-pre-wrap' : o.kind === 'result' ? 'text-[#93C5FD] whitespace-pre' : 'text-[#C7C9CE] whitespace-pre-wrap'
                        }`}
                      >
                        {o.text.replace(/\n+$/, '')}
                      </pre>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CellTools cell={cell} first={first} last={last} onToggleType={onToggleType} onAddBelow={onAddBelow} onDuplicate={onDuplicate} onRemove={onRemove} onMove={onMove} />
    </div>
  )
}

function CellTools({
  cell, first, last, onToggleType, onAddBelow, onDuplicate, onRemove, onMove, onEditMd,
}: {
  cell: Cell
  first: boolean
  last: boolean
  onToggleType: () => void
  onAddBelow: (t: NbCellType) => void
  onDuplicate: () => void
  onRemove: () => void
  onMove: (d: -1 | 1) => void
  onEditMd?: () => void
}) {
  return (
    <div className="absolute -top-2.5 right-2 hidden group-hover:flex items-center gap-0.5 rounded-lg border border-white/[0.1] bg-[#16161B] px-1 py-0.5 shadow-lg z-10">
      <ToolBtn title="Move up" disabled={first} onClick={() => onMove(-1)}><ChevronUp size={12} /></ToolBtn>
      <ToolBtn title="Move down" disabled={last} onClick={() => onMove(1)}><ChevronDown size={12} /></ToolBtn>
      <span className="w-px h-3.5 bg-white/10 mx-0.5" />
      {onEditMd && <ToolBtn title="Edit markdown" onClick={onEditMd}><Type size={12} /></ToolBtn>}
      <ToolBtn title={cell.type === 'code' ? 'To markdown' : 'To code'} onClick={onToggleType}>
        {cell.type === 'code' ? <Type size={12} /> : <FileCode2 size={12} />}
      </ToolBtn>
      <ToolBtn title="Duplicate cell" onClick={onDuplicate}><Copy size={12} /></ToolBtn>
      <ToolBtn title="Add code below" onClick={() => onAddBelow('code')}><Plus size={12} /></ToolBtn>
      <span className="w-px h-3.5 bg-white/10 mx-0.5" />
      <ToolBtn title="Delete cell" danger onClick={onRemove}><Trash2 size={12} /></ToolBtn>
    </div>
  )
}

function ToolBtn({
  children, onClick, title, disabled, danger,
}: {
  children: ReactNode; onClick: () => void; title: string; disabled?: boolean; danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 rounded flex items-center justify-center transition-colors disabled:opacity-30 ${
        danger ? 'text-[#8A8A8A] hover:text-[#FB7185] hover:bg-[#FB7185]/10' : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.08]'
      }`}
    >
      {children}
    </button>
  )
}
