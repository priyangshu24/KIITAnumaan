'use client'

// ---------------------------------------------------------------------------
// AI/ML Lab — Algorithm sims. Full-bleed: a responsive canvas that fills the
// viewport with a docked control panel. Pure client-side maths, no deps.
// ---------------------------------------------------------------------------

import {
  useCallback, useEffect, useMemo, useRef, useState,
  type ReactNode, type RefObject, type PointerEvent as ReactPointerEvent,
} from 'react'
import { Play, Pause, RotateCcw, Shuffle, StepForward, Trophy, ExternalLink, FastForward, UploadCloud } from 'lucide-react'
import type { AlgoLabMeta } from '@/lib/aiml-lab-data'

const ACCENT = '#FF4D4D'
const PALETTE = ['#FF4D4D', '#60A5FA', '#34D399', '#FBBF24', '#C084FC', '#F472B6']

// -- shared UI -----------------------------------------------------------

function Range({
  label, value, min, max, step = 1, onChange, fmt,
}: {
  label: string; value: number; min: number; max: number; step?: number
  onChange: (n: number) => void; fmt?: (n: number) => string
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-[12px] mb-1">
        <span className="text-[#9CA3AF]">{label}</span>
        <span className="font-mono text-white">{fmt ? fmt(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#FF4D4D] h-1 cursor-pointer"
      />
    </label>
  )
}

function Btn({
  onClick, children, active, disabled, wide,
}: {
  onClick: () => void; children: ReactNode; active?: boolean; disabled?: boolean; wide?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${wide ? 'w-full' : ''} ${
        active ? 'bg-[#FF4D4D] text-white' : 'bg-white/[0.05] text-[#D1D5DB] hover:bg-white/[0.09] border border-white/[0.08]'
      }`}
    >
      {children}
    </button>
  )
}

function Seg<T extends string | number>({
  value, options, onChange,
}: {
  value: T; options: { label: string; value: T }[]; onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`flex-1 px-2 py-1.5 text-[11.5px] font-semibold transition-colors ${
            o.value === value ? 'bg-[#FF4D4D] text-white' : 'bg-white/[0.03] text-[#9CA3AF] hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2 text-[12px] text-[#9CA3AF] hover:text-white transition-colors">
      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-[#FF4D4D] border-[#FF4D4D]' : 'border-white/25'}`}>
        {checked && <span className="w-1.5 h-1.5 rounded-[1px] bg-white" />}
      </span>
      {label}
    </button>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'warn' | 'bad' }) {
  const c = tone === 'ok' ? '#34D399' : tone === 'warn' ? '#FBBF24' : tone === 'bad' ? '#FB7185' : '#E5E7EB'
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#111114] px-2.5 py-2">
      <div className="text-[9.5px] font-mono uppercase tracking-wider text-[#6B7280]">{label}</div>
      <div className="text-[13.5px] font-bold font-mono mt-0.5 truncate" style={{ color: c }}>{value}</div>
    </div>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">{title}</div>
      {children}
    </div>
  )
}

function Sparkline({ data, color = ACCENT, h = 34 }: { data: number[]; color?: string; h?: number }) {
  if (data.length < 2) return <div style={{ height: h }} className="rounded bg-white/[0.03]" />
  const min = Math.min(...data), max = Math.max(...data)
  const rng = max - min || 1
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${h - ((d - min) / rng) * (h - 4) - 2}`).join(' ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="rounded bg-white/[0.03]">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

// -- bring-your-own-data --------------------------------------------------

type Table = { name: string; headers: string[]; rows: (number | string)[][] }

function parseTable(text: string, name: string): Table | null {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim())
  if (lines.length < 2) return null
  const delim = lines[0].includes('\t') ? '\t' : lines[0].includes(';') && !lines[0].includes(',') ? ';' : ','
  const split = (l: string) => l.split(delim).map((c) => c.trim().replace(/^"(.*)"$/, '$1'))
  const first = split(lines[0])
  const headerRow = !first.every((c) => c !== '' && isFinite(Number(c)))
  const headers = headerRow ? first : first.map((_, i) => `col${i + 1}`)
  const body = (headerRow ? lines.slice(1) : lines).map(split).filter((r) => r.length >= headers.length)
  if (!body.length) return null
  const rows = body.map((r) => headers.map((_, i) => {
    const v = r[i]
    return v !== '' && isFinite(Number(v)) ? Number(v) : v
  }))
  return { name, headers, rows }
}

function columnKind(t: Table, i: number): 'num' | 'cat' {
  const frac = t.rows.filter((r) => typeof r[i] === 'number').length / (t.rows.length || 1)
  return frac > 0.6 ? 'num' : 'cat'
}
function numericCols(t: Table): number[] {
  return t.headers.map((_, i) => i).filter((i) => columnKind(t, i) === 'num')
}
function allCols(t: Table): number[] {
  return t.headers.map((_, i) => i)
}
function distinctCount(t: Table, i: number): number {
  return new Set(t.rows.map((r) => r[i])).size
}

/** min-max scale a numeric column into [0.04, 0.96] for the canvas */
function scaleCol(t: Table, i: number): number[] {
  const vals = t.rows.map((r) => (typeof r[i] === 'number' ? (r[i] as number) : NaN))
  const fin = vals.filter((v) => isFinite(v))
  const lo = Math.min(...fin), hi = Math.max(...fin)
  return vals.map((v) => (isFinite(v) && hi > lo ? ((v - lo) / (hi - lo)) * 0.92 + 0.04 : 0.5))
}

/** scale ANY column to [0.04, 0.96] — numeric via min-max, text via label-encoding */
function scaleColAny(t: Table, i: number): number[] {
  if (columnKind(t, i) === 'num') return scaleCol(t, i)
  const { ids } = labelCol(t, i)
  const hi = Math.max(...ids, 1)
  return ids.map((v) => (hi > 0 ? (v / hi) * 0.92 + 0.04 : 0.5))
}

/** pick a likely target column: the lowest-cardinality column with 2–12 distinct values */
function guessLabelCol(t: Table): number {
  const cand = allCols(t)
    .map((i) => ({ i, d: distinctCount(t, i) }))
    .filter((o) => o.d >= 2 && o.d <= 12)
    .sort((a, b) => a.d - b.d)
  return cand.length ? cand[0].i : t.headers.length - 1
}

/** map an arbitrary label column to integer class ids 0..k-1 */
function labelCol(t: Table, i: number): { ids: number[]; classes: (number | string)[] } {
  const seen: (number | string)[] = []
  const ids = t.rows.map((r) => {
    const v = r[i]
    let k = seen.indexOf(v)
    if (k < 0) { k = seen.length; seen.push(v) }
    return k
  })
  return { ids, classes: seen }
}

function DataSource({
  table, onFile, onClear, note, children,
}: {
  table: Table | null
  onFile: (f: File) => void
  onClear: () => void
  note: string
  children?: ReactNode
}) {
  return (
    <Group title="Data source">
      {!table ? (
        <>
          <label className="flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg text-[12px] font-semibold bg-white/[0.05] border border-white/[0.08] text-[#D1D5DB] hover:bg-white/[0.09] cursor-pointer transition-colors">
            <UploadCloud size={12} /> Insert CSV data
            <input type="file" accept=".csv,.tsv,.txt" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f) }} />
          </label>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">{note}</p>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#34D399] font-mono truncate">{table.name}</span>
            <button onClick={onClear} className="text-[#6B7280] hover:text-[#FB7185] font-mono transition-colors">use synthetic</button>
          </div>
          <div className="text-[10px] font-mono text-[#6B7280]">{table.rows.length} rows · {table.headers.length} cols</div>
          {children}
        </>
      )}
    </Group>
  )
}

function ColPick({
  label, table, cols, value, onChange,
}: {
  label: string; table: Table | null; cols: number[]; value: number; onChange: (i: number) => void
}) {
  return (
    <label className="block text-[11px]">
      <span className="text-[#9CA3AF]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 rounded-lg bg-[#111114] border border-white/[0.1] text-[12px] text-white px-2 py-1 outline-none focus:border-[#FF4D4D]/40"
      >
        {cols.map((i) => (
          <option key={i} value={i}>
            {table?.headers[i] ?? `col${i + 1}`}{table && columnKind(table, i) === 'cat' ? '  (text → encoded)' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

function useDataTable() {
  const [table, setTable] = useState<Table | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const onFile = useCallback((f: File) => {
    f.text().then((t) => {
      const parsed = parseTable(t, f.name)
      if (parsed) { setTable(parsed); setErr(null) }
      else setErr('could not parse — need a header row and ≥ 2 data rows')
    })
  }, [])
  return { table, setTable, onFile, err }
}

/** Live step-by-step trace shown at the top of the control panel while a sim runs. */
function Narration({ running, log, idle }: { running: boolean; log: string[]; idle: string }) {
  const active = running || log.length > 0
  return (
    <div className={`rounded-xl border p-3 ${active ? 'border-[#FF4D4D]/25 bg-[#FF4D4D]/[0.05]' : 'border-white/[0.07] bg-[#111114]'}`}>
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-1.5" style={{ color: active ? '#FF4D4D' : '#6B7280' }}>
        {active
          ? <><span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] animate-pulse" /> Live trace</>
          : 'How it works'}
      </div>
      {active ? (
        <div className="space-y-0.5">
          {log.slice(-7).map((l, i, a) => (
            <p key={i} className={`text-[11.5px] font-mono leading-snug ${i === a.length - 1 ? 'text-white' : 'text-[#7A7A82]'}`}>{l}</p>
          ))}
          {log.length === 0 && <p className="text-[11.5px] font-mono text-[#7A7A82]">waiting for the first step…</p>}
        </div>
      ) : (
        <p className="text-[11.5px] text-[#9CA3AF] leading-relaxed">{idle}</p>
      )}
    </div>
  )
}

function PanelInfo({ meta }: { meta: AlgoLabMeta }) {
  return (
    <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2.5">
      <p className="text-[11.5px] text-[#6B7280] leading-relaxed">{meta.blurb}</p>
      <div className="flex flex-wrap gap-1">
        {meta.concepts.map((c) => (
          <span key={c} className="text-[9px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{c}</span>
        ))}
      </div>
      {meta.reading.map((r) => (
        <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10.5px] font-mono text-[#8A8A8A] hover:text-white transition-colors">
          {r.label} <ExternalLink size={9} />
        </a>
      ))}
    </div>
  )
}

// -- responsive canvas -------------------------------------------------

function useCanvas() {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 900, h: 620 })

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: Math.max(320, Math.floor(r.width)), h: Math.max(240, Math.floor(r.height)) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.round(size.w * dpr)
    c.height = Math.round(size.h * dpr)
    c.style.width = `${size.w}px`
    c.style.height = `${size.h}px`
    const ctx = c.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }, [size])

  return { wrap, canvas, size }
}

function Frame({
  wrap, canvas, overlay, legend, caption, onPointerDown, onPointerMove, onPointerUp, controls, meta,
}: {
  wrap: RefObject<HTMLDivElement | null>
  canvas: RefObject<HTMLCanvasElement | null>
  overlay?: ReactNode
  /** what each mark on the graph means */
  legend?: { c: string; label: string }[]
  /** one live line describing what is happening in the plot right now */
  caption?: ReactNode
  onPointerDown?: (e: ReactPointerEvent<HTMLCanvasElement>) => void
  onPointerMove?: (e: ReactPointerEvent<HTMLCanvasElement>) => void
  onPointerUp?: (e: ReactPointerEvent<HTMLCanvasElement>) => void
  controls: ReactNode
  meta: AlgoLabMeta
}) {
  return (
    <div className="flex h-full min-h-0 w-full">
      <div ref={wrap} className="flex-1 min-w-0 relative bg-[#0B0B0E]">
        <canvas
          ref={canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute inset-0 touch-none"
        />
        {overlay && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">{overlay}</div>
        )}
        {legend && legend.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1 rounded-lg bg-black/60 border border-white/[0.08] px-2.5 py-2 pointer-events-none">
            {legend.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono text-[#C7C9CE] leading-none">
                <span className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: l.c }} />{l.label}
              </span>
            ))}
          </div>
        )}
        {caption && (
          <div className="absolute inset-x-0 bottom-0 px-4 pt-6 pb-2 bg-gradient-to-t from-black/85 via-black/55 to-transparent pointer-events-none">
            <p className="text-[11.5px] leading-snug text-[#DDDFE4]">
              <span className="text-[#FF4D4D] font-mono">▸ </span>{caption}
            </p>
          </div>
        )}
      </div>
      <div
        className="shrink-0 border-l border-white/[0.07] bg-[#0D0D10] overflow-y-auto scrollbar-thin p-4 space-y-5"
        style={{ width: 'clamp(250px, 20%, 380px)' }}
      >
        {controls}
        <PanelInfo meta={meta} />
      </div>
    </div>
  )
}

function Chip({ children, color = '#9CA3AF' }: { children: ReactNode; color?: string }) {
  return (
    <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-black/50 border border-white/[0.08]" style={{ color }}>
      {children}
    </span>
  )
}

// -- seeded RNG --------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const gauss = (rnd: () => number) => {
  let u = 0, v = 0
  while (u === 0) u = rnd()
  while (v === 0) v = rnd()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
const clamp01 = (v: number) => Math.min(0.999, Math.max(0.001, v))

type P = { x: number; y: number }

// =========================================================================
// 1. K-MEANS
// =========================================================================

function lloyd(pts: P[], init: P[], maxIter = 60) {
  let cents = init.map((c) => ({ ...c }))
  let assign = new Array(pts.length).fill(0)
  let iters = 0
  for (; iters < maxIter; iters++) {
    const na = pts.map((p) => {
      let b = 0, bd = Infinity
      cents.forEach((c, ci) => { const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2; if (d < bd) { bd = d; b = ci } })
      return b
    })
    const sums = cents.map(() => ({ x: 0, y: 0, n: 0 }))
    pts.forEach((p, i) => { const s = sums[na[i]]; s.x += p.x; s.y += p.y; s.n++ })
    const nc = cents.map((c, i) => (sums[i].n ? { x: sums[i].x / sums[i].n, y: sums[i].y / sums[i].n } : c))
    let moved = 0
    nc.forEach((c, i) => { moved += Math.hypot(c.x - cents[i].x, c.y - cents[i].y) })
    cents = nc; assign = na
    if (moved < 1e-5) { iters++; break }
  }
  let inertia = 0
  pts.forEach((p, i) => { const c = cents[assign[i]]; inertia += (p.x - c.x) ** 2 + (p.y - c.y) ** 2 })
  return { cents, assign, inertia, iters }
}

function kppInit(pts: P[], k: number, rnd: () => number) {
  const cs: P[] = [{ ...pts[Math.floor(rnd() * pts.length)] }]
  while (cs.length < k) {
    const d2 = pts.map((p) => Math.min(...cs.map((c) => (p.x - c.x) ** 2 + (p.y - c.y) ** 2)))
    const sum = d2.reduce((a, b) => a + b, 0) || 1
    let r = rnd() * sum
    let i = 0
    while (i < pts.length - 1 && (r -= d2[i]) > 0) i++
    cs.push({ ...pts[i] })
  }
  return cs
}

function KMeans({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(7)
  const [k, setK] = useState(4)
  const [nPoints, setNPoints] = useState(160)
  const [kpp, setKpp] = useState(true)
  const [showLinks, setShowLinks] = useState(true)
  const [showRegions, setShowRegions] = useState(true)
  const [speed, setSpeed] = useState(450)

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table)
    setColX(nc[0] ?? 0)
    setColY(nc[1] ?? (table.headers.length > 1 ? 1 : 0))
  }, [table])

  const userPts = useMemo<P[] | null>(() => {
    if (!table || table.headers.length < 2) return null
    const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
    return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i] })).filter((p) => isFinite(p.x) && isFinite(p.y))
  }, [table, colX, colY])

  const [pts, setPts] = useState<P[]>([])
  const [cents, setCents] = useState<P[]>([])
  const [assign, setAssign] = useState<number[]>([])
  const [iter, setIter] = useState(0)
  const [inertiaHist, setInertiaHist] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const [running, setRunning] = useState(false)
  const [best, setBest] = useState<number | null>(null)
  const [log, setLog] = useState<string[]>([])

  const build = useCallback(() => {
    const rnd = mulberry32(seed)
    let p: P[]
    if (userPts && userPts.length >= k) {
      p = userPts
    } else {
      const blobs = 3 + Math.floor(rnd() * 3)
      const centers = Array.from({ length: blobs }, () => ({ x: 0.12 + rnd() * 0.76, y: 0.12 + rnd() * 0.76, s: 0.04 + rnd() * 0.06 }))
      p = []
      for (let i = 0; i < nPoints; i++) {
        const b = centers[i % blobs]
        p.push({ x: clamp01(b.x + gauss(rnd) * b.s), y: clamp01(b.y + gauss(rnd) * b.s) })
      }
    }
    const init = kpp ? kppInit(p, k, rnd) : [...p.keys()].sort(() => rnd() - 0.5).slice(0, k).map((i) => ({ ...p[i] }))
    setPts(p); setCents(init); setAssign(new Array(p.length).fill(0))
    setIter(0); setInertiaHist([]); setDone(false); setBest(null)
    setRunning(!!(userPts && userPts.length >= k))
    setLog(
      userPts
        ? [`loaded ${p.length} rows from ${table?.name}`, `X = ${table?.headers[colX]}, Y = ${table?.headers[colY]} (min-max scaled)`, `seeded ${k} centroids with ${kpp ? 'k-means++' : 'random'} — running…`]
        : [`synthetic — ${p.length} points · seeded ${k} centroids with ${kpp ? 'k-means++' : 'random pick'}`],
    )
  }, [seed, k, nPoints, kpp, userPts, table, colX, colY])

  useEffect(() => { build() }, [build])

  const step = useCallback(() => {
    if (!pts.length || !cents.length) return
    const na = pts.map((p) => {
      let b = 0, bd = Infinity
      cents.forEach((c, ci) => { const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2; if (d < bd) { bd = d; b = ci } })
      return b
    })
    const reassigned = na.reduce((n, a, i) => n + (a !== assign[i] ? 1 : 0), 0)
    const sums = cents.map(() => ({ x: 0, y: 0, n: 0 }))
    pts.forEach((p, i) => { const s = sums[na[i]]; s.x += p.x; s.y += p.y; s.n++ })
    const nc = cents.map((c, i) => (sums[i].n ? { x: sums[i].x / sums[i].n, y: sums[i].y / sums[i].n } : c))
    let moved = 0
    nc.forEach((c, i) => { moved += Math.hypot(c.x - cents[i].x, c.y - cents[i].y) })
    let inert = 0
    pts.forEach((p, i) => { const c = nc[na[i]]; inert += (p.x - c.x) ** 2 + (p.y - c.y) ** 2 })
    const prev = inertiaHist[inertiaHist.length - 1]
    setAssign(na); setCents(nc); setIter((n) => n + 1)
    setInertiaHist((h) => [...h.slice(-40), inert])
    const it = iter + 1
    if (moved < 1e-4) {
      setDone(true); setRunning(false)
      setLog((l) => [...l.slice(-8), `iter ${it}: 0 points moved — converged, inertia ${inert.toFixed(3)}`])
    } else {
      setLog((l) => [...l.slice(-8), `iter ${it}: assign ${reassigned} pts, move centroids · inertia ${prev != null ? prev.toFixed(3) + ' → ' : ''}${inert.toFixed(3)}`])
    }
  }, [pts, cents, assign, iter, inertiaHist])

  useEffect(() => {
    if (!running) return
    const t = setInterval(step, speed)
    return () => clearInterval(t)
  }, [running, step, speed])

  const restarts = useCallback(() => {
    if (!pts.length) return
    let bestRun = { inertia: Infinity, cents: cents, assign: assign }
    for (let r = 0; r < 12; r++) {
      const rnd = mulberry32(seed * 1000 + r)
      const init = kpp ? kppInit(pts, k, rnd) : [...pts.keys()].sort(() => rnd() - 0.5).slice(0, k).map((i) => ({ ...pts[i] }))
      const res = lloyd(pts, init)
      if (res.inertia < bestRun.inertia) bestRun = { inertia: res.inertia, cents: res.cents, assign: res.assign }
    }
    setCents(bestRun.cents); setAssign(bestRun.assign); setDone(true); setRunning(false)
    setBest(bestRun.inertia); setInertiaHist((h) => [...h.slice(-40), bestRun.inertia])
    setLog((l) => [...l.slice(-8), `ran 12 full restarts — kept the best (inertia ${bestRun.inertia.toFixed(3)})`])
  }, [pts, cents, assign, seed, k, kpp])

  const inertiaNow = inertiaHist[inertiaHist.length - 1] ?? null

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const sx = (x: number) => 20 + x * (w - 40)
    const sy = (y: number) => 20 + y * (h - 40)

    if (showRegions && cents.length) {
      const cell = 14
      for (let gx = 0; gx < w; gx += cell) {
        for (let gy = 0; gy < h; gy += cell) {
          const nx = (gx + cell / 2 - 20) / (w - 40)
          const ny = (gy + cell / 2 - 20) / (h - 40)
          let b = 0, bd = Infinity
          cents.forEach((cc, ci) => { const d = (nx - cc.x) ** 2 + (ny - cc.y) ** 2; if (d < bd) { bd = d; b = ci } })
          ctx.fillStyle = PALETTE[b % PALETTE.length] + '12'
          ctx.fillRect(gx, gy, cell + 1, cell + 1)
        }
      }
    }
    if (showLinks && cents.length) {
      ctx.lineWidth = 1
      pts.forEach((p, i) => {
        const cc = cents[assign[i]]
        ctx.strokeStyle = PALETTE[assign[i] % PALETTE.length] + '33'
        ctx.beginPath(); ctx.moveTo(sx(p.x), sy(p.y)); ctx.lineTo(sx(cc.x), sy(cc.y)); ctx.stroke()
      })
    }
    pts.forEach((p, i) => {
      ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.6, 0, 7)
      ctx.fillStyle = PALETTE[assign[i] % PALETTE.length] + 'dd'; ctx.fill()
    })
    cents.forEach((cc, i) => {
      const x = sx(cc.x), y = sy(cc.y)
      ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 6
      ctx.beginPath(); ctx.moveTo(x - 9, y - 9); ctx.lineTo(x + 9, y + 9); ctx.moveTo(x + 9, y - 9); ctx.lineTo(x - 9, y + 9); ctx.stroke()
      ctx.strokeStyle = PALETTE[i % PALETTE.length]; ctx.lineWidth = 3.5
      ctx.beginPath(); ctx.moveTo(x - 9, y - 9); ctx.lineTo(x + 9, y + 9); ctx.moveTo(x + 9, y - 9); ctx.lineTo(x - 9, y + 9); ctx.stroke()
      ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.strokeStyle = PALETTE[i % PALETTE.length] + '55'; ctx.lineWidth = 1.5; ctx.stroke()
    })
  }, [pts, cents, assign, size, showLinks, showRegions, canvas])

  const addPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = clamp01((e.clientX - r.left - 20) / (r.width - 40))
    const ny = clamp01((e.clientY - r.top - 20) / (r.height - 40))
    setPts((prev) => [...prev, { x: nx, y: ny }])
    setAssign((prev) => [...prev, 0])
    setDone(false)
  }

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta} onPointerDown={addPoint}
      legend={[
        { c: '#FF4D4D', label: 'point · coloured by cluster' },
        { c: '#FBBF24', label: '✕ = centroid (cluster mean)' },
        { c: '#8B5CF6', label: 'shaded = region of that centroid' },
      ]}
      caption={
        done
          ? `Converged after ${iter} iterations — no point changed cluster. Final inertia ${inertiaNow?.toFixed(3) ?? '—'}.`
          : running
            ? `Iteration ${iter}: (1) assign every point to its nearest centroid, then (2) move each ✕ to the mean of its points. Inertia keeps dropping.`
            : 'Press Run — Lloyd’s algorithm alternates assign-to-nearest and move-to-mean until nothing moves. Click the canvas to drop a point.'
      }
      overlay={
        <>
          <Chip color={userPts ? '#34D399' : '#6B7280'}>{userPts ? `${table?.name} · ${pts.length} pts` : 'synthetic data'}</Chip>
          <Chip>iter {iter}</Chip>
          <Chip color="#FBBF24">inertia {inertiaNow != null ? inertiaNow.toFixed(3) : '—'}</Chip>
          {best != null && <Chip color="#34D399">best {best.toFixed(3)}</Chip>}
          <Chip color={done ? '#34D399' : '#6B7280'}>{done ? 'converged' : running ? 'iterating' : 'ready'}</Chip>
        </>
      }
      controls={
        <>
          <Narration
            running={running}
            log={log}
            idle="Lloyd's algorithm repeats two steps: (1) assign every point to its nearest centroid, (2) move each centroid to the mean of its points. Inertia — total squared distance to centroids — falls every iteration until nothing moves."
          />
          <Group title="Run">
            <div className="grid grid-cols-2 gap-1.5">
              <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={done}>
                {running ? <Pause size={12} /> : <Play size={12} />}{running ? 'Pause' : 'Run'}
              </Btn>
              <Btn onClick={step} disabled={running || done}><StepForward size={12} /> Step</Btn>
              <Btn onClick={build}><RotateCcw size={12} /> Reset</Btn>
              <Btn onClick={() => setSeed((s) => s + 1)}><Shuffle size={12} /> Re-seed</Btn>
            </div>
            <Btn onClick={restarts} wide><Trophy size={12} /> 12 restarts → keep best</Btn>
          </Group>

          <DataSource
            table={table} onFile={onFile} onClear={() => setTable(null)}
            note="Any CSV — a header row plus at least two columns. Text columns are label-encoded automatically. Pick X and Y; the sim scales them onto the canvas and runs."
          >
            <ColPick label="X column" table={table} cols={cols} value={colX} onChange={setColX} />
            <ColPick label="Y column" table={table} cols={cols} value={colY} onChange={setColY} />
          </DataSource>
          {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}

          <Group title="Parameters">
            <Range label="Clusters k" value={k} min={2} max={6} onChange={setK} />
            {!userPts && <Range label="Points" value={nPoints} min={40} max={400} step={10} onChange={setNPoints} />}
            <Range label="Anim speed" value={speed} min={80} max={900} step={20} onChange={setSpeed} fmt={(n) => `${n} ms`} />
          </Group>

          <Group title="Init & display">
            <Check label="k-means++ seeding" checked={kpp} onChange={setKpp} />
            <Check label="point → centroid links" checked={showLinks} onChange={setShowLinks} />
            <Check label="assignment regions" checked={showRegions} onChange={setShowRegions} />
          </Group>

          <Group title="Inertia history">
            <Sparkline data={inertiaHist} color="#FBBF24" />
          </Group>
          <p className="text-[11px] text-[#6B7280] leading-relaxed">Click the canvas to drop a point. Re-seed at fixed k: final inertia moves because Lloyd only finds a local optimum.</p>
        </>
      }
    />
  )
}

// =========================================================================
// 2. GRADIENT DESCENT
// =========================================================================

type LossKey = 'double-well' | 'bowl' | 'wiggly' | 'valley'
const LOSSES: Record<LossKey, { f: (x: number) => number; g: (x: number) => number; dom: [number, number]; label: string }> = {
  'double-well': { f: (x) => 0.05 * x ** 4 - 0.5 * x ** 2 + 0.2 * x + 1.2, g: (x) => 0.2 * x ** 3 - x + 0.2, dom: [-5, 5], label: 'Double well' },
  bowl: { f: (x) => 0.16 * x ** 2 + 0.4, g: (x) => 0.32 * x, dom: [-5, 5], label: 'Convex bowl' },
  wiggly: { f: (x) => 0.12 * x ** 2 + Math.sin(3 * x) * 0.55 + 1, g: (x) => 0.24 * x + 1.65 * Math.cos(3 * x), dom: [-5, 5], label: 'Many minima' },
  valley: { f: (x) => 0.9 * Math.log(Math.cosh(1.6 * x)) + 0.4, g: (x) => 1.44 * Math.tanh(1.6 * x), dom: [-4, 4], label: 'Steep valley' },
}

function GradientDescent({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [lossKey, setLossKey] = useState<LossKey>('double-well')
  const [lr, setLr] = useState(0.12)
  const [x0, setX0] = useState(-3.4)
  const [momentum, setMomentum] = useState(0)
  const [decay, setDecay] = useState(false)
  const [ghost, setGhost] = useState(true)
  const [running, setRunning] = useState(false)

  const L = LOSSES[lossKey]
  const [x, setX] = useState(-3.4)
  const [vel, setVel] = useState(0)
  const [steps, setSteps] = useState(0)
  const [trail, setTrail] = useState<number[]>([-3.4])
  const [gx, setGx] = useState(-3.4) // ghost @ 1.9x lr
  const [gtrail, setGtrail] = useState<number[]>([-3.4])
  const [lossHist, setLossHist] = useState<number[]>([])
  const [log, setLog] = useState<string[]>([])

  const diverged = Math.abs(x) > (L.dom[1] + 2) || !isFinite(x)
  const settled = steps > 5 && Math.abs(L.g(x)) < 1e-3

  const reset = useCallback(() => {
    setX(x0); setGx(x0); setVel(0); setSteps(0)
    setTrail([x0]); setGtrail([x0]); setLossHist([])
    setRunning(false)
    setLog([`start at x₀ = ${x0.toFixed(2)} · lr ${lr.toFixed(2)}${momentum ? ` · momentum ${momentum.toFixed(2)}` : ''}`])
  }, [x0, lr, momentum])
  useEffect(() => { reset() }, [reset, lossKey])

  const step = useCallback(() => {
    const eff = lr / (decay ? 1 + 0.03 * steps : 1)
    const g = L.g(x)
    const nv = momentum * vel - eff * g
    const nx = x + nv
    const ng = gx - eff * 1.9 * L.g(gx)
    setVel(nv)
    setX(nx)
    setGx(ng)
    setSteps((s) => s + 1)
    setTrail((t) => [...t.slice(-80), nx])
    setGtrail((t) => [...t.slice(-80), ng])
    setLossHist((h) => [...h.slice(-80), L.f(nx)])
    const it = steps + 1
    let note = ''
    if (Math.abs(nx) > L.dom[1] + 2 || !isFinite(nx)) note = ' — overshooting, diverging'
    else if (Math.abs(L.g(nx)) < 1e-3) note = ' — gradient ≈ 0, converged'
    else if (Math.abs(nx) < Math.abs(x)) note = ' — moving toward a minimum'
    setLog((l) => [...l.slice(-8), `step ${it}: x ${x.toFixed(2)}→${nx.toFixed(2)}, ∇ ${g.toFixed(3)}, Δx ${nv.toFixed(3)}${note}`])
  }, [lr, decay, steps, momentum, vel, x, gx, L])

  useEffect(() => {
    if (!running || diverged || settled) return
    const t = setInterval(step, 130)
    return () => clearInterval(t)
  }, [running, step, diverged, settled])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const [xmin, xmax] = L.dom
    const ys: number[] = []
    for (let i = 0; i <= 300; i++) ys.push(L.f(xmin + (i / 300) * (xmax - xmin)))
    const ymin = Math.min(...ys) - 0.5
    const ymax = Math.min(ys[0] * 0 + Math.max(...ys), Math.max(...ys)) + 0.6
    const sx = (v: number) => 50 + ((v - xmin) / (xmax - xmin)) * (w - 80)
    const sy = (v: number) => h - 44 - ((v - ymin) / (ymax - ymin)) * (h - 74)

    ctx.strokeStyle = '#1F1F25'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(sx(0), 14); ctx.lineTo(sx(0), h - 34); ctx.stroke()

    ctx.strokeStyle = '#5B6572'; ctx.lineWidth = 2; ctx.beginPath()
    for (let i = 0; i <= 300; i++) {
      const xv = xmin + (i / 300) * (xmax - xmin)
      const px = sx(xv), py = sy(L.f(xv))
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
    }
    ctx.stroke()

    if (ghost) {
      gtrail.forEach((tx, i) => {
        if (Math.abs(tx) > xmax + 1) return
        ctx.beginPath(); ctx.arc(sx(tx), sy(L.f(tx)), 2.6, 0, 7)
        ctx.fillStyle = `rgba(251,191,36,${0.1 + 0.5 * (i / gtrail.length)})`; ctx.fill()
      })
    }
    trail.forEach((tx, i) => {
      if (Math.abs(tx) > xmax + 1) return
      ctx.beginPath(); ctx.arc(sx(tx), sy(L.f(tx)), 3, 0, 7)
      ctx.fillStyle = `rgba(255,77,77,${0.12 + 0.6 * (i / trail.length)})`; ctx.fill()
    })
    if (Math.abs(x) <= xmax + 0.5) {
      const px = sx(x), py = sy(L.f(x))
      ctx.beginPath(); ctx.arc(px, py, 7, 0, 7); ctx.fillStyle = ACCENT; ctx.fill()
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke()
      const g = L.g(x)
      ctx.strokeStyle = '#34D399'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - Math.sign(g) * Math.min(60, Math.abs(g) * 40), py); ctx.stroke()
    }
  }, [x, trail, gtrail, ghost, size, L, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#5B6572', label: 'loss curve  f(x)' },
        { c: '#FF4D4D', label: 'current x (the iterate)' },
        { c: '#34D399', label: '→ gradient direction (downhill)' },
        { c: '#FBBF24', label: 'ghost run @ 1.9× LR' },
      ]}
      caption={
        diverged
          ? `Diverged — the step overshot the valley and |x| blew up. Lower the learning rate.`
          : settled
            ? `Converged at x ≈ ${x.toFixed(2)}, where the gradient ≈ 0.`
            : running
              ? `Step ${steps}: x ← x − lr·∇f(x). ∇ = ${L.g(x).toFixed(2)}, so x moves ${L.g(x) > 0 ? 'left' : 'right'} by ${Math.abs(vel).toFixed(3)}.`
              : 'Press Run — each step moves x opposite the gradient. Push the learning rate past ~0.9 to make it overshoot and diverge.'
      }
      overlay={
        <>
          <Chip>x {isFinite(x) ? x.toFixed(3) : '∞'}</Chip>
          <Chip color="#34D399">loss {isFinite(L.f(x)) ? L.f(x).toFixed(3) : '∞'}</Chip>
          <Chip color="#FBBF24">∇ {isFinite(L.g(x)) ? L.g(x).toFixed(3) : '∞'}</Chip>
          <Chip>step {steps}</Chip>
          <Chip color={diverged ? '#FB7185' : settled ? '#34D399' : '#6B7280'}>{diverged ? 'diverged' : settled ? 'converged' : running ? 'descending' : 'ready'}</Chip>
        </>
      }
      controls={
        <>
          <Narration
            running={running}
            log={log}
            idle="Each step moves x downhill by −(learning rate)·gradient. Momentum adds a fraction of the previous step so the iterate builds speed in a consistent direction. Too large a learning rate overshoots the valley and the loss explodes."
          />
          <Group title="Run">
            <div className="grid grid-cols-3 gap-1.5">
              <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={diverged || settled}>
                {running ? <Pause size={12} /> : <Play size={12} />}
              </Btn>
              <Btn onClick={step} disabled={running || diverged}><StepForward size={12} /></Btn>
              <Btn onClick={reset}><RotateCcw size={12} /></Btn>
            </div>
          </Group>
          <Group title="Loss surface">
            <Seg
              value={lossKey}
              onChange={(v) => setLossKey(v)}
              options={[
                { label: 'Well', value: 'double-well' },
                { label: 'Bowl', value: 'bowl' },
                { label: 'Minima', value: 'wiggly' },
                { label: 'Valley', value: 'valley' },
              ]}
            />
          </Group>
          <Group title="Optimizer">
            <Range label="Learning rate" value={lr} min={0.01} max={1.4} step={0.01} onChange={setLr} fmt={(n) => n.toFixed(2)} />
            <Range label="Momentum β" value={momentum} min={0} max={0.95} step={0.05} onChange={setMomentum} fmt={(n) => n.toFixed(2)} />
            <Range label="Start x₀" value={x0} min={L.dom[0] + 0.5} max={L.dom[1] - 0.5} step={0.1} onChange={setX0} fmt={(n) => n.toFixed(1)} />
            <Check label="learning-rate decay" checked={decay} onChange={setDecay} />
            <Check label="ghost run @ 1.9× LR (amber)" checked={ghost} onChange={setGhost} />
          </Group>
          <Group title="Loss vs step">
            <Sparkline data={lossHist} color="#34D399" />
          </Group>
        </>
      }
    />
  )
}

// =========================================================================
// 3. SOFTMAX SAMPLING
// =========================================================================

const TOKENS = ['the', 'a', 'cat', 'sat', 'on', 'mat', 'and', 'ran', 'fast', 'away']
const BASE = [4.0, 3.4, 3.0, 2.5, 2.1, 1.7, 1.2, 0.8, 0.3, -0.5]

function SoftmaxLab({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [logits, setLogits] = useState<number[]>([...BASE])
  const [temp, setTemp] = useState(1)
  const [topK, setTopK] = useState(10)
  const [topP, setTopP] = useState(1)
  const [minP, setMinP] = useState(0)
  const [showCum, setShowCum] = useState(true)
  const dragging = useRef<number | null>(null)

  const softmax = (arr: number[], t: number) => {
    const z = arr.map((v) => v / Math.max(0.05, t))
    const m = Math.max(...z)
    const e = z.map((v) => Math.exp(v - m))
    const s = e.reduce((a, b) => a + b, 0)
    return e.map((v) => v / s)
  }

  const { probs, entropy, kept, kl, greedy } = useMemo(() => {
    const base = softmax(logits, 1)
    const scaled = logits.map((l) => l / Math.max(0.05, temp))
    const order = [...scaled.keys()].sort((a, b) => scaled[b] - scaled[a])
    const inK = new Set(order.slice(0, topK))
    const m = Math.max(...scaled)
    let e = scaled.map((s, i) => (inK.has(i) ? Math.exp(s - m) : 0))
    let z = e.reduce((a, b) => a + b, 0)
    let p = e.map((v) => v / z)
    // top-p
    const pOrd = [...p.keys()].sort((a, b) => p[b] - p[a])
    let cum = 0
    const keep = new Set<number>()
    for (const i of pOrd) { keep.add(i); cum += p[i]; if (cum >= topP) break }
    p = p.map((v, i) => (keep.has(i) ? v : 0))
    // min-p (relative to max)
    const mx = Math.max(...p)
    p = p.map((v) => (v >= minP * mx ? v : 0))
    z = p.reduce((a, b) => a + b, 0) || 1
    p = p.map((v) => v / z)
    const ent = -p.reduce((a, v) => a + (v > 0 ? v * Math.log2(v) : 0), 0)
    const klv = p.reduce((a, v, i) => a + (v > 0 ? v * Math.log2(v / (base[i] || 1e-9)) : 0), 0)
    return { probs: p, entropy: ent, kept: p.filter((v) => v > 1e-6).length, kl: klv, greedy: p.indexOf(Math.max(...p)) }
  }, [logits, temp, topK, topP, minP])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const padL = 44, padB = 46, padT = 30
    const n = logits.length
    const bw = (w - padL - 20) / n
    const maxP = Math.max(...probs, 0.05)
    const baseY = h - padB
    // grid
    ctx.strokeStyle = '#1A1A1F'; ctx.lineWidth = 1
    for (let g = 0; g <= 4; g++) {
      const gy = padT + (g / 4) * (baseY - padT)
      ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(w - 20, gy); ctx.stroke()
      ctx.fillStyle = '#4B5563'; ctx.font = '9px monospace'
      ctx.fillText(`${((1 - g / 4) * maxP * 100).toFixed(0)}%`, 8, gy + 3)
    }
    // bars
    probs.forEach((p, i) => {
      const bx = padL + i * bw + 4
      const bh = (p / maxP) * (baseY - padT)
      ctx.fillStyle = i === greedy && p > 0 ? '#FBBF24' : p > 0 ? ACCENT : '#26262C'
      ctx.fillRect(bx, baseY - bh, bw - 8, Math.max(bh, p > 0 ? 2 : 1))
      ctx.fillStyle = '#9CA3AF'; ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(TOKENS[i] ?? String(i), bx + (bw - 8) / 2, baseY + 16)
      if (p > 0.01) ctx.fillText(`${(p * 100).toFixed(0)}`, bx + (bw - 8) / 2, baseY - bh - 6)
      ctx.textAlign = 'left'
    })
    // cumulative curve
    if (showCum) {
      let cum = 0
      ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 2; ctx.beginPath()
      probs.forEach((p, i) => {
        cum += p
        const px = padL + i * bw + bw / 2
        const py = baseY - cum * (baseY - padT)
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)
      })
      ctx.stroke()
      ctx.fillStyle = '#60A5FA'; ctx.font = '9px monospace'
      ctx.fillText('cumulative', w - 90, padT + 4)
    }
  }, [probs, size, showCum, greedy, logits.length, canvas])

  const onDrag = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (dragging.current == null) return
    const r = e.currentTarget.getBoundingClientRect()
    const padT = 30, padB = 46
    const frac = 1 - (e.clientY - r.top - padT) / (r.height - padT - padB)
    const val = Math.max(-2, Math.min(6, frac * 8 - 2))
    setLogits((prev) => prev.map((v, i) => (i === dragging.current ? val : v)))
  }
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const padL = 44
    const bw = (r.width - padL - 20) / logits.length
    const idx = Math.floor((e.clientX - r.left - padL) / bw)
    if (idx >= 0 && idx < logits.length) { dragging.current = idx; onDrag(e) }
  }

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      onPointerDown={onDown} onPointerMove={onDrag} onPointerUp={() => (dragging.current = null)}
      legend={[
        { c: '#FF4D4D', label: 'P(token) after temp + truncation' },
        { c: '#FBBF24', label: 'greedy pick (highest bar)' },
        { c: '#60A5FA', label: 'cumulative probability curve' },
      ]}
      caption={
        temp <= 0.15
          ? `Temperature ≈ 0 → the distribution collapses onto one token (entropy ${entropy.toFixed(2)} bits). This is greedy decoding.`
          : kept === 1
            ? `top-k / top-p have truncated the tail to a single token — no randomness left.`
            : `T = ${temp.toFixed(2)} reshapes the logits; top-k/top-p keep ${kept} of ${logits.length} tokens. Entropy ${entropy.toFixed(2)} bits ≈ ${Math.pow(2, entropy).toFixed(1)} effective choices. Drag a bar to edit its logit.`
      }
      overlay={
        <>
          <Chip color="#FBBF24">greedy: {TOKENS[greedy]}</Chip>
          <Chip>entropy {entropy.toFixed(2)} bits</Chip>
          <Chip color="#60A5FA">eff. choices {Math.pow(2, entropy).toFixed(1)}</Chip>
          <Chip color="#C084FC">KL‖base {kl.toFixed(2)}</Chip>
          <Chip color={kept === 1 ? '#FBBF24' : '#6B7280'}>support {kept}/{logits.length}</Chip>
        </>
      }
      controls={
        <>
          <Group title="Sampling">
            <Range label="Temperature" value={temp} min={0.1} max={2} step={0.05} onChange={setTemp} fmt={(n) => n.toFixed(2)} />
            <Range label="top-k" value={topK} min={1} max={10} onChange={setTopK} />
            <Range label="top-p" value={topP} min={0.05} max={1} step={0.05} onChange={setTopP} fmt={(n) => n.toFixed(2)} />
            <Range label="min-p (× max)" value={minP} min={0} max={0.5} step={0.02} onChange={setMinP} fmt={(n) => n.toFixed(2)} />
          </Group>
          <Group title="Display">
            <Check label="cumulative probability" checked={showCum} onChange={setShowCum} />
          </Group>
          <Group title="Logits">
            <div className="grid grid-cols-2 gap-1.5">
              <Btn onClick={() => setLogits([...BASE])}><RotateCcw size={12} /> Reset</Btn>
              <Btn onClick={() => { const r = mulberry32(Date.now() & 0xffff); setLogits(BASE.map((b) => b + gauss(r) * 1.1)) }}><Shuffle size={12} /> Random</Btn>
            </div>
            <p className="text-[11px] text-[#6B7280] leading-relaxed">Drag a bar up or down on the chart to edit its logit.</p>
          </Group>
        </>
      }
    />
  )
}

// =========================================================================
// 4. k-NN DECISION BOUNDARY
// =========================================================================

function KnnLab({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [k, setK] = useState(1)
  const [seed, setSeed] = useState(3)
  const [metric, setMetric] = useState<'l2' | 'l1'>('l2')
  const [nClasses, setNClasses] = useState(2)
  const [nPer, setNPer] = useState(45)
  const [noise, setNoise] = useState(0.13)
  const [weighted, setWeighted] = useState(false)

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  const [colL, setColL] = useState(2)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table)
    const lab = guessLabelCol(table)
    setColX(nc.filter((i) => i !== lab)[0] ?? 0)
    setColY(nc.filter((i) => i !== lab)[1] ?? (table.headers.length > 1 ? 1 : 0))
    setColL(lab)
  }, [table])

  const userData = useMemo<{ x: number; y: number; c: number }[] | null>(() => {
    if (!table || table.headers.length < 2) return null
    const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
    const { ids } = labelCol(table, colL)
    return table.rows
      .map((_, i) => ({ x: xs[i], y: 1 - ys[i], c: ids[i] }))
      .filter((p) => isFinite(p.x) && isFinite(p.y))
  }, [table, colX, colY, colL])
  const userClassCount = useMemo(() => (userData ? new Set(userData.map((p) => p.c)).size : 0), [userData])

  const data = useMemo(() => {
    if (userData && userData.length) return userData
    const rnd = mulberry32(seed)
    const centers = [{ x: 0.32, y: 0.4 }, { x: 0.68, y: 0.6 }, { x: 0.5, y: 0.28 }]
    const pts: { x: number; y: number; c: number }[] = []
    for (let cls = 0; cls < nClasses; cls++) {
      for (let i = 0; i < nPer; i++) {
        pts.push({ x: clamp01(centers[cls].x + gauss(rnd) * noise), y: clamp01(centers[cls].y + gauss(rnd) * noise), c: cls })
      }
    }
    return pts
  }, [userData, seed, nClasses, nPer, noise])

  const classCount = userData ? Math.max(2, userClassCount) : nClasses

  const dist = useCallback((ax: number, ay: number, bx: number, by: number) =>
    metric === 'l2' ? Math.hypot(ax - bx, ay - by) : Math.abs(ax - bx) + Math.abs(ay - by), [metric])

  const classifyAt = useCallback((px: number, py: number, exclude = -1) => {
    const near = data
      .map((p, i) => ({ p, i, d: dist(px, py, p.x, p.y) }))
      .filter((o) => o.i !== exclude)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
    const votes = new Array(classCount).fill(0)
    near.forEach((o) => { votes[o.p.c] += weighted ? 1 / (o.d + 1e-4) : 1 })
    let b = 0
    for (let c = 1; c < classCount; c++) if (votes[c] > votes[b]) b = c
    const conf = votes[b] / (votes.reduce((a, v) => a + v, 0) || 1)
    return { cls: b, conf }
  }, [data, dist, k, classCount, weighted])

  const looAcc = useMemo(() => {
    let ok = 0
    data.forEach((p, i) => { if (classifyAt(p.x, p.y, i).cls === p.c) ok++ })
    return ok / data.length
  }, [data, classifyAt])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    const cols = 90, rows = Math.round(90 * (h / w))
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const { cls, conf } = classifyAt((i + 0.5) / cols, (j + 0.5) / rows)
        ctx.fillStyle = PALETTE[cls % PALETTE.length] + Math.round(28 + 60 * (conf - 1 / classCount)).toString(16).padStart(2, '0')
        ctx.fillRect((i / cols) * w, (j / rows) * h, w / cols + 1, h / rows + 1)
      }
    }
    data.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 5, 0, 7)
      ctx.fillStyle = PALETTE[p.c % PALETTE.length]
      ctx.fill(); ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 1.5; ctx.stroke()
    })
  }, [data, classifyAt, size, classCount, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'training point (class colour)' },
        { c: '#60A5FA', label: 'shaded = predicted class of that region' },
        { c: '#8A8A8A', label: 'stronger shade = more confident vote' },
      ]}
      caption={
        k <= 3
          ? `k = ${k}: each cell copies its ${k === 1 ? 'single nearest' : `${k} nearest`} neighbour(s), so the boundary hugs every point — low bias, high variance (it memorises noise). LOO accuracy ${(looAcc * 100).toFixed(0)}%.`
          : k >= 15
            ? `k = ${k}: the vote averages over ${k} neighbours, so the boundary smooths out and can miss real structure — high bias. LOO accuracy ${(looAcc * 100).toFixed(0)}%.`
            : `k = ${k}: a balanced neighbourhood. Every grid cell is coloured by the majority class of its ${k} nearest training points. LOO accuracy ${(looAcc * 100).toFixed(0)}%.`
      }
      overlay={
        <>
          <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${data.length} rows` : 'synthetic data'}</Chip>
          <Chip color="#34D399">LOO accuracy {(looAcc * 100).toFixed(1)}%</Chip>
          <Chip>k = {k}</Chip>
          <Chip color={k <= 3 ? '#FBBF24' : k >= 15 ? '#FBBF24' : '#34D399'}>{k <= 3 ? 'low bias · high variance' : k >= 15 ? 'high bias · low variance' : 'balanced'}</Chip>
        </>
      }
      controls={
        <>
          <Group title="Model">
            <Range label="k (neighbours)" value={k} min={1} max={25} step={2} onChange={setK} />
            <Seg value={metric} onChange={setMetric} options={[{ label: 'Euclidean', value: 'l2' }, { label: 'Manhattan', value: 'l1' }]} />
            <Check label="distance-weighted vote" checked={weighted} onChange={setWeighted} />
          </Group>

          <DataSource
            table={table} onFile={onFile} onClear={() => setTable(null)}
            note="Any CSV: two feature columns + a label column. Text columns are encoded; the boundary and LOO accuracy update as you change columns."
          >
            <ColPick label="X feature" table={table} cols={cols} value={colX} onChange={setColX} />
            <ColPick label="Y feature" table={table} cols={cols} value={colY} onChange={setColY} />
            <ColPick label="Label" table={table} cols={cols} value={colL} onChange={setColL} />
            <p className="text-[10px] text-[#6B7280]">{userClassCount} classes detected</p>
          </DataSource>
          {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}

          {!table && (
            <Group title="Synthetic data">
              <Seg value={nClasses} onChange={setNClasses} options={[{ label: '2 classes', value: 2 }, { label: '3 classes', value: 3 }]} />
              <Range label="points / class" value={nPer} min={15} max={90} step={5} onChange={setNPer} />
              <Range label="noise σ" value={noise} min={0.05} max={0.24} step={0.01} onChange={setNoise} fmt={(n) => n.toFixed(2)} />
              <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>
            </Group>
          )}
          <p className="text-[11px] text-[#6B7280] leading-relaxed">Leave-one-out accuracy peaks at a middling k — small k overfits noise, large k washes out real structure.</p>
        </>
      }
    />
  )
}

// =========================================================================
// 5. THRESHOLD · CONFUSION · ROC / PR
// =========================================================================

function MetricsLab({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [thr, setThr] = useState(0.5)
  const [seed, setSeed] = useState(2)
  const [sep, setSep] = useState(0.32)
  const [posFrac, setPosFrac] = useState(0.5)

  const { table, setTable, onFile, err } = useDataTable()
  const numCols = useMemo(() => (table ? numericCols(table) : []), [table])
  const allC = useMemo(() => (table ? allCols(table) : []), [table])
  const [colScore, setColScore] = useState(0)
  const [colLabel, setColLabel] = useState(1)
  useEffect(() => {
    if (!table) return
    const lab = guessLabelCol(table)
    setColScore(numCols.filter((i) => i !== lab)[0] ?? numCols[0] ?? 0)
    setColLabel(lab)
  }, [table, numCols])

  const { neg, pos } = useMemo(() => {
    if (table && numCols.length >= 1) {
      const raw = table.rows.map((r) => (typeof r[colScore] === 'number' ? (r[colScore] as number) : NaN))
      const fin = raw.filter((v) => isFinite(v))
      const lo = Math.min(...fin), hi = Math.max(...fin)
      const norm = (v: number) => (hi > lo ? (v - lo) / (hi - lo) : 0.5)
      const { ids } = labelCol(table, colLabel)
      const neg: number[] = [], pos: number[] = []
      table.rows.forEach((_, i) => {
        if (!isFinite(raw[i])) return
        ;(ids[i] === 0 ? neg : pos).push(clamp01(norm(raw[i])))
      })
      if (neg.length && pos.length) return { neg, pos }
    }
    const rnd = mulberry32(seed)
    const total = 460
    const nPos = Math.round(total * posFrac)
    const neg = Array.from({ length: total - nPos }, () => clamp01(0.5 - sep / 2 + gauss(rnd) * 0.13))
    const pos = Array.from({ length: nPos }, () => clamp01(0.5 + sep / 2 + gauss(rnd) * 0.13))
    return { neg, pos }
  }, [table, numCols, colScore, colLabel, seed, sep, posFrac])

  const m = useMemo(() => {
    const at = (t: number) => {
      const tp = pos.filter((s) => s >= t).length
      const fp = neg.filter((s) => s >= t).length
      const fn = pos.length - tp
      const tn = neg.length - fp
      const precision = tp + fp ? tp / (tp + fp) : 1
      const recall = tp + fn ? tp / (tp + fn) : 0
      const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0
      return { tp, fp, fn, tn, precision, recall, f1, tpr: recall, fpr: fp + tn ? fp / (fp + tn) : 0, acc: (tp + tn) / (tp + tn + fp + fn) }
    }
    const cur = at(thr)
    const roc: [number, number][] = []
    const pr: [number, number][] = []
    let bestF1 = { t: 0.5, f1: 0 }
    let auc = 0, ap = 0
    let prevFpr = 1, prevRec = 1
    for (let t = 0; t <= 1.0001; t += 0.02) {
      const s = at(t)
      roc.push([s.fpr, s.tpr]); pr.push([s.recall, s.precision])
      if (s.f1 > bestF1.f1) bestF1 = { t, f1: s.f1 }
      auc += Math.abs(prevFpr - s.fpr) * (prevRec + s.tpr) / 2
      prevFpr = s.fpr; prevRec = s.tpr
    }
    for (let i = 1; i < pr.length; i++) ap += Math.abs(pr[i - 1][0] - pr[i][0]) * pr[i][1]
    return { ...cur, roc, pr, auc, ap, bestF1 }
  }, [neg, pos, thr])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const bins = 46
    const hist = (arr: number[]) => { const a = new Array(bins).fill(0); arr.forEach((s) => a[Math.min(bins - 1, Math.floor(s * bins))]++); return a }
    const hn = hist(neg), hp = hist(pos)
    const top = Math.max(...hn, ...hp, 1)
    const chartH = h - 210
    const bw = (w - 60) / bins
    const baseY = chartH
    for (let i = 0; i < bins; i++) {
      const bx = 40 + i * bw
      ctx.fillStyle = 'rgba(255,77,77,0.5)'; ctx.fillRect(bx, baseY - (hn[i] / top) * (baseY - 24), bw - 1, (hn[i] / top) * (baseY - 24))
      ctx.fillStyle = 'rgba(96,165,250,0.5)'; ctx.fillRect(bx, baseY - (hp[i] / top) * (baseY - 24), bw - 1, (hp[i] / top) * (baseY - 24))
    }
    const tx = 40 + thr * (w - 60)
    ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(tx, 10); ctx.lineTo(tx, baseY); ctx.stroke()
    ctx.fillStyle = '#FBBF24'; ctx.font = '10px monospace'; ctx.fillText(`thr ${thr.toFixed(2)}`, Math.min(tx + 5, w - 60), 18)
    ctx.fillStyle = 'rgba(255,77,77,0.85)'; ctx.fillRect(40, baseY + 12, 10, 10)
    ctx.fillStyle = '#9CA3AF'; ctx.font = '10px monospace'; ctx.fillText('negatives', 55, baseY + 21)
    ctx.fillStyle = 'rgba(96,165,250,0.85)'; ctx.fillRect(150, baseY + 12, 10, 10)
    ctx.fillStyle = '#9CA3AF'; ctx.fillText('positives', 165, baseY + 21)

    // curve insets
    const os = 150, oy = h - os - 16
    const drawCurve = (ox: number, curve: [number, number][], pt: [number, number], title: string, diag: boolean) => {
      ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(ox, oy, os, os)
      ctx.strokeStyle = '#26262C'; ctx.strokeRect(ox, oy, os, os)
      if (diag) { ctx.strokeStyle = '#2F2F37'; ctx.beginPath(); ctx.moveTo(ox, oy + os); ctx.lineTo(ox + os, oy); ctx.stroke() }
      ctx.strokeStyle = ACCENT; ctx.lineWidth = 2; ctx.beginPath()
      curve.forEach(([cx, cy], i) => { const px = ox + cx * os, py = oy + os - cy * os; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py) })
      ctx.stroke()
      ctx.beginPath(); ctx.arc(ox + pt[0] * os, oy + os - pt[1] * os, 4, 0, 7); ctx.fillStyle = '#FBBF24'; ctx.fill()
      ctx.fillStyle = '#9CA3AF'; ctx.font = '10px monospace'; ctx.fillText(title, ox, oy - 6)
    }
    drawCurve(40, m.roc, [m.fpr, m.tpr], `ROC · AUC ${m.auc.toFixed(3)}`, true)
    drawCurve(40 + os + 30, m.pr, [m.recall, m.precision], `PR · AP ${m.ap.toFixed(3)}`, false)
  }, [neg, pos, thr, m, size, canvas])

  const Cell = ({ l, v, c }: { l: string; v: number; c: string }) => (
    <div className="rounded-lg px-2 py-2 text-center" style={{ background: `${c}1a`, border: `1px solid ${c}44` }}>
      <div className="text-[9px] font-mono uppercase text-[#9CA3AF]">{l}</div>
      <div className="text-[14px] font-bold font-mono" style={{ color: c }}>{v}</div>
    </div>
  )

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: 'rgba(255,77,77,0.7)', label: 'negatives — score histogram' },
        { c: 'rgba(96,165,250,0.7)', label: 'positives — score histogram' },
        { c: '#FBBF24', label: 'decision threshold' },
        { c: '#FF4D4D', label: 'ROC & PR curves (inset)' },
      ]}
      caption={
        `Threshold ${thr.toFixed(2)}: everything right of the amber line is predicted positive. Precision ${m.precision.toFixed(2)}, recall ${m.recall.toFixed(2)}, F1 ${m.f1.toFixed(2)}. ` +
        `Slide it right → precision ↑, recall ↓. ROC-AUC ${m.auc.toFixed(2)} · PR-AUC ${m.ap.toFixed(2)} (threshold-free).`
      }
      overlay={
        <>
          <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${neg.length + pos.length}` : 'synthetic scores'}</Chip>
          <Chip color="#34D399">F1 {m.f1.toFixed(3)}</Chip>
          <Chip>P {m.precision.toFixed(3)}</Chip>
          <Chip>R {m.recall.toFixed(3)}</Chip>
          <Chip color="#60A5FA">AUC {m.auc.toFixed(3)}</Chip>
          <Chip color="#C084FC">AP {m.ap.toFixed(3)}</Chip>
        </>
      }
      controls={
        <>
          <Group title="Operating point">
            <Range label="Decision threshold" value={thr} min={0} max={1} step={0.01} onChange={setThr} fmt={(n) => n.toFixed(2)} />
            <Btn onClick={() => setThr(m.bestF1.t)} wide>Snap to best F1 (thr {m.bestF1.t.toFixed(2)})</Btn>
          </Group>

          <DataSource
            table={table} onFile={onFile} onClear={() => setTable(null)}
            note="CSV of real predictions: a numeric score column (any range — min-max scaled to 0–1) and a label column. The ROC / PR curves recompute instantly."
          >
            <ColPick label="Score column" table={table} cols={numCols} value={colScore} onChange={setColScore} />
            <ColPick label="Label column" table={table} cols={allC} value={colLabel} onChange={setColLabel} />
            <p className="text-[10px] text-[#6B7280]">{neg.length} negatives · {pos.length} positives{table && !pos.length ? ' — pick a different label' : ''}</p>
          </DataSource>
          {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}

          {!table && (
            <Group title="Synthetic data">
              <Range label="Class separation" value={sep} min={0} max={0.6} step={0.02} onChange={setSep} fmt={(n) => n.toFixed(2)} />
              <Range label="Positive fraction" value={posFrac} min={0.1} max={0.9} step={0.05} onChange={setPosFrac} fmt={(n) => n.toFixed(2)} />
              <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>
            </Group>
          )}
          <Group title="Confusion @ threshold">
            <div className="grid grid-cols-2 gap-1.5">
              <Cell l="TP" v={m.tp} c="#34D399" />
              <Cell l="FP" v={m.fp} c="#FB7185" />
              <Cell l="FN" v={m.fn} c="#FBBF24" />
              <Cell l="TN" v={m.tn} c="#60A5FA" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Accuracy" value={m.acc.toFixed(3)} />
              <Stat label="F1" value={m.f1.toFixed(3)} tone="ok" />
            </div>
          </Group>
        </>
      }
    />
  )
}

// =========================================================================
// 6. COSINE SIMILARITY + RETRIEVAL
// =========================================================================

function CosineLab({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [aAng, setAAng] = useState(25)
  const [aMag, setAMag] = useState(1)
  const [bAng, setBAng] = useState(70)
  const [bMag, setBMag] = useState(1.7)
  const [normalize, setNormalize] = useState(false)
  const [docSeed, setDocSeed] = useState(1)

  const ar = (aAng * Math.PI) / 180
  const br = (bAng * Math.PI) / 180
  const am = normalize ? 1 : aMag
  const bm = normalize ? 1 : bMag
  const a = { x: Math.cos(ar) * am, y: Math.sin(ar) * am }
  const b = { x: Math.cos(br) * bm, y: Math.sin(br) * bm }
  const dot = a.x * b.x + a.y * b.y
  const cos = dot / (am * bm)
  const l2 = Math.hypot(a.x - b.x, a.y - b.y)

  const docs = useMemo(() => {
    const rnd = mulberry32(docSeed)
    const labels = ['doc: feline nap', 'doc: fast runner', 'doc: weather report', 'doc: cooking tips']
    const q = { x: Math.cos(ar), y: Math.sin(ar) }
    return labels.map((label) => {
      const ang = rnd() * Math.PI * 2
      const v = { x: Math.cos(ang), y: Math.sin(ang) }
      return { label, cos: v.x * q.x + v.y * q.y }
    }).sort((x, y) => y.cos - x.cos)
  }, [docSeed, ar])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const cx = w / 2, cy = h / 2
    const scale = Math.min(w, h) / 6
    ctx.strokeStyle = '#1A1A1F'
    for (let r = 1; r <= 2.5; r += 0.5) { ctx.beginPath(); ctx.arc(cx, cy, r * scale, 0, 7); ctx.stroke() }
    ctx.strokeStyle = '#26262C'
    ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(w - 30, cy); ctx.moveTo(cx, 30); ctx.lineTo(cx, h - 30); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 46, -br, -ar, ar < br); ctx.closePath()
    ctx.fillStyle = 'rgba(251,191,36,0.14)'; ctx.fill()
    const arrow = (v: { x: number; y: number }, color: string, label: string) => {
      const ex = cx + v.x * scale, ey = cy - v.y * scale
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3.5
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke()
      const ang = Math.atan2(ey - cy, ex - cx)
      ctx.beginPath(); ctx.moveTo(ex, ey)
      ctx.lineTo(ex - 13 * Math.cos(ang - 0.4), ey - 13 * Math.sin(ang - 0.4))
      ctx.lineTo(ex - 13 * Math.cos(ang + 0.4), ey - 13 * Math.sin(ang + 0.4))
      ctx.closePath(); ctx.fill()
      ctx.font = '13px monospace'; ctx.fillText(label, ex + 9, ey - 5)
    }
    arrow(a, ACCENT, 'a')
    arrow(b, '#60A5FA', 'b')
  }, [a.x, a.y, b.x, b.y, ar, br, size, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'vector a  (query)' },
        { c: '#60A5FA', label: 'vector b' },
        { c: '#FBBF24', label: 'wedge = angle between them' },
      ]}
      caption={
        `Angle ${Math.abs(aAng - bAng).toFixed(0)}° → cosine ${cos.toFixed(3)}. ` +
        `Change only a magnitude: cosine and the angle stay put, but the dot product (${dot.toFixed(2)}) and L2 distance (${l2.toFixed(2)}) move — which is why embeddings are normalised before comparison.`
      }
      overlay={
        <>
          <Chip color="#34D399">cosine {cos.toFixed(3)}</Chip>
          <Chip>dot {dot.toFixed(3)}</Chip>
          <Chip>L2 {l2.toFixed(3)}</Chip>
          <Chip color="#FBBF24">angle {Math.abs(aAng - bAng).toFixed(0)}°</Chip>
        </>
      }
      controls={
        <>
          <Group title="Vector a">
            <Range label="angle" value={aAng} min={0} max={180} onChange={setAAng} fmt={(n) => `${n}°`} />
            <Range label="magnitude" value={aMag} min={0.3} max={2.5} step={0.1} onChange={setAMag} fmt={(n) => n.toFixed(1)} />
          </Group>
          <Group title="Vector b">
            <Range label="angle" value={bAng} min={0} max={180} onChange={setBAng} fmt={(n) => `${n}°`} />
            <Range label="magnitude" value={bMag} min={0.3} max={2.5} step={0.1} onChange={setBMag} fmt={(n) => n.toFixed(1)} />
          </Group>
          <Check label="normalise to unit length" checked={normalize} onChange={setNormalize} />
          <Group title="Cosine retrieval (query = a)">
            {docs.map((d, i) => (
              <div key={d.label} className="flex items-center gap-2 text-[11.5px]">
                <span className="font-mono text-[#6B7280] w-3">{i + 1}</span>
                <span className="flex-1 text-[#9CA3AF] truncate">{d.label}</span>
                <span className="font-mono" style={{ color: d.cos > 0 ? '#34D399' : '#FB7185' }}>{d.cos.toFixed(3)}</span>
              </div>
            ))}
            <Btn onClick={() => setDocSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-roll documents</Btn>
          </Group>
        </>
      }
    />
  )
}

// =========================================================================
// 7. LOGISTIC REGRESSION — training loop
// =========================================================================

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))

function LogisticTrain({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(3)
  const [lr, setLr] = useState(0.6)
  const [sep, setSep] = useState(0.2)
  const [running, setRunning] = useState(false)
  const [w, setW] = useState<[number, number, number]>([0, 0, 0])
  const [epoch, setEpoch] = useState(0)
  const [lossHist, setLossHist] = useState<number[]>([])
  const [log, setLog] = useState<string[]>([])

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  const [colL, setColL] = useState(2)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table)
    const lab = guessLabelCol(table)
    setColX(nc.filter((i) => i !== lab)[0] ?? 0)
    setColY(nc.filter((i) => i !== lab)[1] ?? (table.headers.length > 1 ? 1 : 0))
    setColL(lab)
  }, [table])

  const data = useMemo<{ x: number; y: number; c: 0 | 1 }[]>(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
      const { ids } = labelCol(table, colL)
      return table.rows
        .map((_, i) => ({ x: xs[i], y: 1 - ys[i], c: (ids[i] === 0 ? 0 : 1) as 0 | 1 }))
        .filter((p) => isFinite(p.x) && isFinite(p.y))
    }
    const rnd = mulberry32(seed)
    const pts: { x: number; y: number; c: 0 | 1 }[] = []
    for (let i = 0; i < 60; i++) pts.push({ x: clamp01(0.5 - sep + gauss(rnd) * 0.12), y: clamp01(0.42 + gauss(rnd) * 0.16), c: 0 })
    for (let i = 0; i < 60; i++) pts.push({ x: clamp01(0.5 + sep + gauss(rnd) * 0.12), y: clamp01(0.58 + gauss(rnd) * 0.16), c: 1 })
    return pts
  }, [table, colX, colY, colL, seed, sep])

  const reset = useCallback(() => {
    setW([0, 0, 0]); setEpoch(0); setLossHist([]); setRunning(false)
    setLog(
      table
        ? [`loaded ${data.length} rows from ${table.name}`, `X = ${table.headers[colX]}, Y = ${table.headers[colY]}, label = ${table.headers[colL]}`, `weights = 0, lr ${lr.toFixed(2)} — training…`]
        : [`synthetic — ${data.length} points · weights = 0, lr ${lr.toFixed(2)}`],
    )
  }, [data.length, lr, table, colX, colY, colL])
  useEffect(() => { reset() }, [reset])
  // auto-train once your data is in
  useEffect(() => { if (table && data.length) setRunning(true) }, [table, data.length])

  const step = useCallback(() => {
    let g0 = 0, g1 = 0, gb = 0, loss = 0, correct = 0
    data.forEach((p) => {
      const z = w[0] * (p.x - 0.5) + w[1] * (p.y - 0.5) + w[2]
      const pr = sigmoid(z)
      const err = pr - p.c
      g0 += err * (p.x - 0.5); g1 += err * (p.y - 0.5); gb += err
      loss += -(p.c * Math.log(pr + 1e-9) + (1 - p.c) * Math.log(1 - pr + 1e-9))
      if ((pr >= 0.5 ? 1 : 0) === p.c) correct++
    })
    const n = data.length
    const nw: [number, number, number] = [w[0] - lr * g0 / n, w[1] - lr * g1 / n, w[2] - lr * gb / n]
    const L = loss / n
    setW(nw); setEpoch((e) => e + 1)
    setLossHist((h) => [...h.slice(-80), L])
    const it = epoch + 1
    setLog((l) => [...l.slice(-8), `epoch ${it}: BCE ${L.toFixed(3)}, train acc ${Math.round((correct / n) * 100)}% · ∇ pushes the line toward separation`])
    if (L < 0.05) setRunning(false)
  }, [data, w, lr, epoch])

  useEffect(() => {
    if (!running) return
    const t = setInterval(step, 90)
    return () => clearInterval(t)
  }, [running, step])

  const acc = useMemo(() => {
    let c = 0
    data.forEach((p) => { const z = w[0] * (p.x - 0.5) + w[1] * (p.y - 0.5) + w[2]; if ((z >= 0 ? 1 : 0) === p.c) c++ })
    return c / data.length
  }, [data, w])
  const converged = lossHist.length > 0 && lossHist[lossHist.length - 1] < 0.05

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: H } = size
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, W, H)
    const cell = 12
    for (let gx = 0; gx < W; gx += cell) for (let gy = 0; gy < H; gy += cell) {
      const nx = (gx + cell / 2) / W, ny = (gy + cell / 2) / H
      const pr = sigmoid(w[0] * (nx - 0.5) + w[1] * (ny - 0.5) + w[2])
      ctx.fillStyle = pr >= 0.5 ? `rgba(96,165,250,${(pr - 0.5) * 0.5})` : `rgba(255,77,77,${(0.5 - pr) * 0.5})`
      ctx.fillRect(gx, gy, cell + 1, cell + 1)
    }
    if (Math.abs(w[1]) > 1e-6) {
      const yAt = (x: number) => 0.5 - (w[0] * (x - 0.5) + w[2]) / w[1]
      ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(0, yAt(0) * H); ctx.lineTo(W, yAt(1) * H); ctx.stroke()
    }
    data.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 5, 0, 7)
      ctx.fillStyle = p.c === 1 ? '#60A5FA' : '#FF4D4D'
      ctx.fill(); ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 1.5; ctx.stroke()
    })
  }, [data, w, size, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'class 0 point' },
        { c: '#60A5FA', label: 'class 1 point' },
        { c: '#FBBF24', label: 'decision boundary  (p = 0.5)' },
        { c: '#8A8A8A', label: 'shading = predicted probability' },
      ]}
      caption={
        converged
          ? `Converged at ${Math.round(acc * 100)}% training accuracy — the amber line separates the classes.`
          : running
            ? `Epoch ${epoch}: each step nudges the weights down the cross-entropy gradient, rotating the p = 0.5 line toward separation. BCE ${lossHist.length ? lossHist[lossHist.length - 1].toFixed(3) : '—'}.`
            : 'Press Run — gradient descent on binary cross-entropy will rotate the amber line to split the two classes.'
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${data.length} rows` : 'synthetic data'}</Chip>
        <Chip>epoch {epoch}</Chip>
        <Chip color="#34D399">train acc {(acc * 100).toFixed(0)}%</Chip>
        <Chip color="#FBBF24">BCE {lossHist.length ? lossHist[lossHist.length - 1].toFixed(3) : '—'}</Chip>
        <Chip color={converged ? '#34D399' : '#6B7280'}>{converged ? 'converged' : running ? 'training' : 'ready'}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="Logistic regression fits a line by gradient descent on binary cross-entropy. Every epoch the weights move so the sigmoid outputs approach the true 0/1 labels; the amber line is the p = 0.5 boundary and the shading is predicted probability." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={converged}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={step} disabled={running || converged}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
        </Group>
        <DataSource
          table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV: two feature columns + a label (first distinct value → class 0, rest → class 1). Training starts automatically."
        >
          <ColPick label="X feature" table={table} cols={cols} value={colX} onChange={setColX} />
          <ColPick label="Y feature" table={table} cols={cols} value={colY} onChange={setColY} />
          <ColPick label="Label" table={table} cols={cols} value={colL} onChange={setColL} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        <Group title="Parameters">
          <Range label="Learning rate" value={lr} min={0.05} max={2} step={0.05} onChange={setLr} fmt={(n) => n.toFixed(2)} />
          {!table && <Range label="Class separation" value={sep} min={0.05} max={0.35} step={0.01} onChange={setSep} fmt={(n) => n.toFixed(2)} />}
          {!table && <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>}
        </Group>
        <Group title="Loss vs epoch"><Sparkline data={lossHist} color="#34D399" /></Group>
      </>}
    />
  )
}

// =========================================================================
// 8. Q-LEARNING — gridworld
// =========================================================================

const QGW = 9, QGH = 7
const Q_GOAL: [number, number] = [QGW - 1, QGH - 1]
const Q_PITS: [number, number][] = [[3, 2], [3, 3], [3, 4], [6, 1], [6, 4], [5, 5]]
const isPit = (x: number, y: number) => Q_PITS.some(([px, py]) => px === x && py === y)
const isGoal = (x: number, y: number) => x === Q_GOAL[0] && y === Q_GOAL[1]

function QLearning({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [alpha, setAlpha] = useState(0.3)
  const [gamma, setGamma] = useState(0.95)
  const [decay, setDecay] = useState(0.995)
  const [speed, setSpeed] = useState(45)
  const [running, setRunning] = useState(false)
  const [Q, setQ] = useState<number[]>(() => new Array(QGW * QGH * 4).fill(0))
  const [agent, setAgent] = useState<[number, number]>([0, 0])
  const [episode, setEpisode] = useState(0)
  const [epStep, setEpStep] = useState(0)
  const [eps, setEps] = useState(0.9)
  const [solved, setSolved] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const retRef = useRef(0)

  const reset = useCallback(() => {
    setQ(new Array(QGW * QGH * 4).fill(0))
    setAgent([0, 0]); setEpisode(0); setEpStep(0); setEps(0.9); setSolved(0); setRunning(false)
    retRef.current = 0
    setLog(['Q-table zeroed · ε 0.90 · agent at the top-left start'])
  }, [])
  useEffect(() => { reset() }, [reset])

  const envStep = useCallback(() => {
    const q = Q.slice()
    const [ax, ay] = agent
    const s = (ay * QGW + ax) * 4
    let a: number
    if (Math.random() < eps) a = Math.floor(Math.random() * 4)
    else { a = 0; for (let k = 1; k < 4; k++) if (q[s + k] > q[s + a]) a = k }
    let nx = ax, ny = ay
    if (a === 0) ny--; else if (a === 1) nx++; else if (a === 2) ny++; else nx--
    let wall = false
    if (nx < 0 || nx >= QGW || ny < 0 || ny >= QGH) { nx = ax; ny = ay; wall = true }
    let r = wall ? -0.05 : -0.02, terminal = false
    if (!wall && isGoal(nx, ny)) { r = 1; terminal = true }
    else if (!wall && isPit(nx, ny)) { r = -1; terminal = true }
    const ns = (ny * QGW + nx) * 4
    const maxNext = terminal ? 0 : Math.max(q[ns], q[ns + 1], q[ns + 2], q[ns + 3])
    q[s + a] += alpha * (r + gamma * maxNext - q[s + a])
    retRef.current += r
    setQ(q)
    if (terminal || epStep > 120) {
      const reached = isGoal(nx, ny)
      if (reached) setSolved((n) => n + 1)
      const ret = retRef.current
      setLog((l) => [...l.slice(-8), `ep ${episode + 1}: ${reached ? 'reached goal' : isPit(nx, ny) ? 'fell in a pit' : 'timed out'} in ${epStep + 1} steps, return ${ret.toFixed(2)}, ε ${eps.toFixed(2)}`])
      setEpisode((e) => e + 1); setEpStep(0); setEps((e) => Math.max(0.05, e * decay))
      setAgent([0, 0]); retRef.current = 0
    } else {
      setAgent([nx, ny]); setEpStep((k) => k + 1)
    }
  }, [Q, agent, eps, alpha, gamma, decay, epStep, episode])

  useEffect(() => {
    if (!running) return
    const t = setInterval(envStep, speed)
    return () => clearInterval(t)
  }, [running, envStep, speed])

  const burst = useCallback(() => {
    setRunning(false)
    const q = Q.slice()
    let e = eps, got = 0
    for (let ep = 0; ep < 40; ep++) {
      let x = 0, y = 0
      for (let st = 0; st < 140; st++) {
        const s = (y * QGW + x) * 4
        let a: number
        if (Math.random() < e) a = Math.floor(Math.random() * 4)
        else { a = 0; for (let k = 1; k < 4; k++) if (q[s + k] > q[s + a]) a = k }
        let nx = x, ny = y
        if (a === 0) ny--; else if (a === 1) nx++; else if (a === 2) ny++; else nx--
        let wall = false
        if (nx < 0 || nx >= QGW || ny < 0 || ny >= QGH) { nx = x; ny = y; wall = true }
        let r = wall ? -0.05 : -0.02, term = false
        if (!wall && isGoal(nx, ny)) { r = 1; term = true }
        else if (!wall && isPit(nx, ny)) { r = -1; term = true }
        const ns = (ny * QGW + nx) * 4
        const mn = term ? 0 : Math.max(q[ns], q[ns + 1], q[ns + 2], q[ns + 3])
        q[s + a] += alpha * (r + gamma * mn - q[s + a])
        x = nx; y = ny
        if (term) { if (isGoal(nx, ny)) got++; break }
      }
      e = Math.max(0.05, e * decay)
    }
    setQ(q); setEps(e); setEpisode((n) => n + 40); setSolved((n) => n + got)
    setAgent([0, 0]); setEpStep(0); retRef.current = 0
    setLog((l) => [...l.slice(-8), `fast-forwarded 40 episodes — ${got}/40 reached the goal, ε now ${e.toFixed(2)}`])
  }, [Q, eps, alpha, gamma, decay])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const pad = 18
    const cw = (w - pad * 2) / QGW, ch = (h - pad * 2) / QGH
    const px = (gx: number) => pad + gx * cw, py = (gy: number) => pad + gy * ch
    for (let gy = 0; gy < QGH; gy++) for (let gx = 0; gx < QGW; gx++) {
      const s = (gy * QGW + gx) * 4
      const v = Math.max(Q[s], Q[s + 1], Q[s + 2], Q[s + 3])
      let fill = '#111114'
      if (isGoal(gx, gy)) fill = 'rgba(52,211,153,0.4)'
      else if (isPit(gx, gy)) fill = 'rgba(251,113,133,0.3)'
      else if (v > 0) fill = `rgba(52,211,153,${Math.min(0.45, v * 0.45)})`
      else if (v < 0) fill = `rgba(251,113,133,${Math.min(0.35, -v * 0.35)})`
      ctx.fillStyle = fill; ctx.fillRect(px(gx) + 1, py(gy) + 1, cw - 2, ch - 2)
      ctx.strokeStyle = '#1E1E24'; ctx.strokeRect(px(gx), py(gy), cw, ch)
      if (!isGoal(gx, gy) && !isPit(gx, gy) && (Q[s] || Q[s + 1] || Q[s + 2] || Q[s + 3])) {
        let a = 0; for (let k = 1; k < 4; k++) if (Q[s + k] > Q[s + a]) a = k
        const mx = px(gx) + cw / 2, my = py(gy) + ch / 2, rr = Math.min(cw, ch) * 0.22
        const ang = a === 0 ? -Math.PI / 2 : a === 1 ? 0 : a === 2 ? Math.PI / 2 : Math.PI
        ctx.fillStyle = '#9CA3AF'
        ctx.beginPath()
        ctx.moveTo(mx + rr * Math.cos(ang), my + rr * Math.sin(ang))
        ctx.lineTo(mx + rr * Math.cos(ang + 2.5), my + rr * Math.sin(ang + 2.5))
        ctx.lineTo(mx + rr * Math.cos(ang - 2.5), my + rr * Math.sin(ang - 2.5))
        ctx.closePath(); ctx.fill()
      }
    }
    const [ax, ay] = agent
    ctx.beginPath(); ctx.arc(px(ax) + cw / 2, py(ay) + ch / 2, Math.min(cw, ch) * 0.26, 0, 7)
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.stroke()
  }, [Q, agent, size, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#34D399', label: 'green cell = high Q-value · goal' },
        { c: '#FB7185', label: 'red cell = pit (−1, terminal)' },
        { c: '#9CA3AF', label: 'arrow = current greedy action' },
        { c: '#ffffff', label: 'white dot = the agent' },
      ]}
      caption={
        `Episode ${episode}, ε = ${eps.toFixed(2)}: with prob. ε the agent explores randomly, else it follows the arrows. ` +
        `Each move updates one Q-value toward reward + γ·max Q(next). ${solved} goals reached so far — the value map spreads outward from the goal.`
      }
      overlay={<>
        <Chip>episode {episode}</Chip>
        <Chip color="#FBBF24">ε {eps.toFixed(2)}</Chip>
        <Chip>step {epStep}</Chip>
        <Chip color="#34D399">goals {solved}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="Q-learning builds a table of expected return Q(state, action). Each move nudges one entry toward reward + γ·max Q(next state). ε-greedy takes a random action with probability ε (explore) and decays ε over episodes (exploit). Arrows show the greedy action per cell; green cells are high-value, red are pits." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={envStep} disabled={running}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
          <Btn onClick={burst} wide><FastForward size={12} /> Fast-forward 40 episodes</Btn>
        </Group>
        <Group title="Hyper-parameters">
          <Range label="Learning rate α" value={alpha} min={0.05} max={1} step={0.05} onChange={setAlpha} fmt={(n) => n.toFixed(2)} />
          <Range label="Discount γ" value={gamma} min={0.5} max={0.99} step={0.01} onChange={setGamma} fmt={(n) => n.toFixed(2)} />
          <Range label="ε decay / episode" value={decay} min={0.9} max={0.999} step={0.001} onChange={setDecay} fmt={(n) => n.toFixed(3)} />
          <Range label="Step speed" value={speed} min={15} max={200} step={5} onChange={setSpeed} fmt={(n) => `${n} ms`} />
        </Group>
      </>}
    />
  )
}

// =========================================================================
// 9. PCA — principal component analysis
// =========================================================================

function PCALab({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(1)
  const [rot, setRot] = useState(30)
  const [spreadA, setSpreadA] = useState(0.22)
  const [spreadB, setSpreadB] = useState(0.07)
  const [project, setProject] = useState(false)

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table)
    setColX(nc[0] ?? 0)
    setColY(nc[1] ?? (table.headers.length > 1 ? 1 : 0))
  }, [table])

  const pts = useMemo(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
      return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i] })).filter((p) => isFinite(p.x) && isFinite(p.y))
    }
    const rnd = mulberry32(seed)
    const th = (rot * Math.PI) / 180
    const cos = Math.cos(th), sin = Math.sin(th)
    return Array.from({ length: 170 }, () => {
      const u = gauss(rnd) * spreadA, v = gauss(rnd) * spreadB
      return { x: 0.5 + u * cos - v * sin, y: 0.5 + u * sin + v * cos }
    })
  }, [table, colX, colY, seed, rot, spreadA, spreadB])

  const pca = useMemo(() => {
    const n = pts.length
    const mx = pts.reduce((s, p) => s + p.x, 0) / n
    const my = pts.reduce((s, p) => s + p.y, 0) / n
    let a = 0, b = 0, c = 0
    pts.forEach((p) => { const dx = p.x - mx, dy = p.y - my; a += dx * dx; b += dx * dy; c += dy * dy })
    a /= n; b /= n; c /= n
    const tr = a + c, det = a * c - b * b
    const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det))
    const l1 = tr / 2 + disc, l2 = tr / 2 - disc
    let vx = b, vy = l1 - a
    if (Math.hypot(vx, vy) < 1e-9) { vx = 1; vy = 0 }
    const nrm = Math.hypot(vx, vy) || 1
    vx /= nrm; vy /= nrm
    return { mx, my, l1, l2, vx, vy, explained: l1 / (l1 + l2 || 1), angle: (Math.atan2(vy, vx) * 180) / Math.PI }
  }, [pts])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w, h } = size
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, w, h)
    const sx = (x: number) => x * w, sy = (y: number) => y * h
    const { mx, my, l1, l2, vx, vy } = pca
    const wx = -vy, wy = vx
    if (project) {
      pts.forEach((p) => {
        const t = (p.x - mx) * vx + (p.y - my) * vy
        const qx = mx + t * vx, qy = my + t * vy
        ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.moveTo(sx(p.x), sy(p.y)); ctx.lineTo(sx(qx), sy(qy)); ctx.stroke()
        ctx.beginPath(); ctx.arc(sx(qx), sy(qy), 3, 0, 7); ctx.fillStyle = '#FBBF24'; ctx.fill()
      })
    }
    pts.forEach((p) => { ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.4, 0, 7); ctx.fillStyle = 'rgba(96,165,250,0.7)'; ctx.fill() })
    const axis = (dx: number, dy: number, lam: number, col: string, label: string) => {
      const len = Math.sqrt(Math.max(lam, 1e-6)) * 3.4
      ctx.strokeStyle = col; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(sx(mx - dx * len), sy(my - dy * len)); ctx.lineTo(sx(mx + dx * len), sy(my + dy * len)); ctx.stroke()
      ctx.fillStyle = col; ctx.font = '12px monospace'
      ctx.fillText(label, sx(mx + dx * len) + 5, sy(my + dy * len))
    }
    axis(vx, vy, l1, '#FF4D4D', 'PC1')
    axis(wx, wy, l2, '#34D399', 'PC2')
  }, [pts, pca, project, size, canvas])

  return (
    <Frame
      wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: 'rgba(96,165,250,0.7)', label: 'data point' },
        { c: '#FF4D4D', label: 'PC1 — direction of most variance' },
        { c: '#34D399', label: 'PC2 — orthogonal to PC1' },
        { c: '#FBBF24', label: 'projection onto PC1 (toggle)' },
      ]}
      caption={
        `PCA takes the eigenvectors of the covariance matrix. PC1 (red) points along the cloud’s longest spread — it explains ${(pca.explained * 100).toFixed(0)}% of the variance; PC2 (green) the rest. Each axis length is √eigenvalue. Projecting onto PC1 alone keeps ${(pca.explained * 100).toFixed(0)}%.`
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${pts.length} rows` : 'synthetic cloud'}</Chip>
        <Chip color="#FF4D4D">PC1 explains {(pca.explained * 100).toFixed(0)}%</Chip>
        <Chip>PC1 angle {pca.angle.toFixed(0)}°</Chip>
        <Chip color="#34D399">PC2 explains {((1 - pca.explained) * 100).toFixed(0)}%</Chip>
      </>}
      controls={<>
        <Narration running={false} log={[]}
          idle="PCA centres the cloud, forms the 2×2 covariance matrix and takes its eigenvectors. PC1 (red) is the direction of greatest variance, PC2 (green) is orthogonal, and each axis length is √eigenvalue. Projecting onto PC1 alone keeps the percentage of variance shown above." />
        <DataSource
          table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV with ≥ 2 columns (text encoded). Pick two — the principal axes come from their real covariance and update live."
        >
          <ColPick label="X column" table={table} cols={cols} value={colX} onChange={setColX} />
          <ColPick label="Y column" table={table} cols={cols} value={colY} onChange={setColY} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        {!table && (
          <Group title="Synthetic data shape">
            <Range label="Rotation" value={rot} min={0} max={180} onChange={setRot} fmt={(n) => `${n}°`} />
            <Range label="Spread · major axis" value={spreadA} min={0.05} max={0.35} step={0.01} onChange={setSpreadA} fmt={(n) => n.toFixed(2)} />
            <Range label="Spread · minor axis" value={spreadB} min={0.02} max={0.35} step={0.01} onChange={setSpreadB} fmt={(n) => n.toFixed(2)} />
            <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>
          </Group>
        )}
        <Check label="project points onto PC1" checked={project} onChange={setProject} />
        <Group title="Explained variance">
          <div className="h-2.5 rounded-full overflow-hidden flex bg-white/[0.06]">
            <div style={{ width: `${pca.explained * 100}%`, background: '#FF4D4D' }} />
            <div style={{ width: `${(1 - pca.explained) * 100}%`, background: '#34D399' }} />
          </div>
          <p className="text-[11px] font-mono text-[#6B7280] mt-1">PC1 {(pca.explained * 100).toFixed(1)}% · PC2 {((1 - pca.explained) * 100).toFixed(1)}%</p>
        </Group>
      </>}
    />
  )
}

// =========================================================================
// 10. LINEAR REGRESSION — OLS vs gradient descent
// =========================================================================

function LinReg({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(2)
  const [lr, setLr] = useState(0.15)
  const [running, setRunning] = useState(false)
  const [w, setW] = useState(0)
  const [b, setB] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [lossHist, setLossHist] = useState<number[]>([])
  const [showOLS, setShowOLS] = useState(true)
  const [log, setLog] = useState<string[]>([])

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  useEffect(() => { if (!table) return; const nc = numericCols(table); setColX(nc[0] ?? 0); setColY(nc[1] ?? 1) }, [table])

  const pts = useMemo<{ x: number; y: number }[]>(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
      return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i] })).filter((p) => isFinite(p.x) && isFinite(p.y))
    }
    const rnd = mulberry32(seed)
    const slope = 0.6 + rnd() * 0.8, icpt = 0.15 + rnd() * 0.2
    return Array.from({ length: 60 }, () => { const x = clamp01(rnd()); return { x, y: clamp01(icpt + slope * x + gauss(rnd) * 0.08) } })
  }, [table, colX, colY, seed])

  const ols = useMemo(() => {
    const n = pts.length; if (!n) return { w: 0, b: 0 }
    const mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.y, 0) / n
    let sxy = 0, sxx = 0
    pts.forEach((p) => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2 })
    const ww = sxx ? sxy / sxx : 0
    return { w: ww, b: my - ww * mx }
  }, [pts])

  const mse = useMemo(() => (pts.length ? pts.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / pts.length : 0), [pts, w, b])
  const r2 = useMemo(() => {
    if (!pts.length) return 0
    const my = pts.reduce((s, p) => s + p.y, 0) / pts.length
    const ssTot = pts.reduce((s, p) => s + (p.y - my) ** 2, 0) || 1
    return 1 - (mse * pts.length) / ssTot
  }, [pts, mse])

  const reset = useCallback(() => {
    setW(0); setB(0); setEpoch(0); setLossHist([]); setRunning(false)
    setLog([table ? `${pts.length} rows from ${table.name}` : `synthetic — ${pts.length} points`, `w = 0, b = 0, lr ${lr.toFixed(2)}`])
  }, [pts.length, lr, table])
  useEffect(() => { reset() }, [reset])
  useEffect(() => { if (table && pts.length) setRunning(true) }, [table, pts.length])

  const settled = lossHist.length > 5 && Math.abs(w - ols.w) < 2e-3 && Math.abs(b - ols.b) < 2e-3

  const step = useCallback(() => {
    if (!pts.length) return
    let gw = 0, gb = 0
    pts.forEach((p) => { const e = w * p.x + b - p.y; gw += 2 * e * p.x; gb += 2 * e })
    gw /= pts.length; gb /= pts.length
    const nw = w - lr * gw, nb = b - lr * gb
    const L = pts.reduce((s, p) => s + (nw * p.x + nb - p.y) ** 2, 0) / pts.length
    setW(nw); setB(nb); setEpoch((e) => e + 1)
    setLossHist((h) => [...h.slice(-80), L])
    setLog((l) => [...l.slice(-8), `epoch ${epoch + 1}: MSE ${L.toFixed(4)}, slope ${nw.toFixed(3)}, intercept ${nb.toFixed(3)}`])
    if (Math.abs(nw - ols.w) < 2e-3 && Math.abs(nb - ols.b) < 2e-3) setRunning(false)
  }, [pts, w, b, lr, epoch, ols])

  useEffect(() => { if (!running) return; const t = setInterval(step, 90); return () => clearInterval(t) }, [running, step])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: H } = size
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, W, H)
    const sx = (x: number) => 20 + x * (W - 40), sy = (y: number) => 20 + y * (H - 40)
    ctx.strokeStyle = 'rgba(251,191,36,0.22)'; ctx.lineWidth = 1
    pts.forEach((p) => { ctx.beginPath(); ctx.moveTo(sx(p.x), sy(p.y)); ctx.lineTo(sx(p.x), sy(w * p.x + b)); ctx.stroke() })
    if (showOLS) {
      ctx.strokeStyle = '#34D399'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(sx(0), sy(ols.b)); ctx.lineTo(sx(1), sy(ols.w + ols.b)); ctx.stroke(); ctx.setLineDash([])
    }
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(sx(0), sy(b)); ctx.lineTo(sx(1), sy(w + b)); ctx.stroke()
    pts.forEach((p) => { ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 3.6, 0, 7); ctx.fillStyle = '#60A5FA'; ctx.fill() })
  }, [pts, w, b, ols, showOLS, size, canvas])

  return (
    <Frame wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#60A5FA', label: 'data point (x, y)' },
        { c: '#FF4D4D', label: 'GD fit   y = w·x + b' },
        { c: '#34D399', label: 'closed-form (OLS) optimum' },
        { c: '#FBBF24', label: 'residual = fit − actual' },
      ]}
      caption={
        settled
          ? `Converged — the red GD line now sits on top of the green closed-form fit. slope ${w.toFixed(2)}, intercept ${b.toFixed(2)}, R² ${r2.toFixed(2)}.`
          : running
            ? `Epoch ${epoch}: each step subtracts lr·(gradient of the mean squared residual), sliding the red line toward the green optimum. MSE ${mse.toFixed(4)}.`
            : 'Press Run — gradient descent will walk the red line onto the green closed-form solution as the amber residuals shrink.'
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${pts.length}` : 'synthetic'}</Chip>
        <Chip>epoch {epoch}</Chip>
        <Chip color="#FBBF24">MSE {mse.toFixed(4)}</Chip>
        <Chip color="#34D399">R² {r2.toFixed(3)}</Chip>
        <Chip color={settled ? '#34D399' : '#6B7280'}>{settled ? 'converged' : running ? 'fitting' : 'ready'}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="Linear regression minimises the total squared vertical distance (the amber residuals). The green dashed line is the exact closed-form solution; gradient descent (red) walks toward it one step at a time." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={settled}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={step} disabled={running || settled}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
        </Group>
        <DataSource table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV — pick an X and a Y numeric column (text is encoded). Fitting starts automatically.">
          <ColPick label="X column" table={table} cols={cols} value={colX} onChange={setColX} />
          <ColPick label="Y column" table={table} cols={cols} value={colY} onChange={setColY} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        <Group title="Parameters">
          <Range label="Learning rate" value={lr} min={0.02} max={0.8} step={0.02} onChange={setLr} fmt={(n) => n.toFixed(2)} />
          {!table && <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>}
          <Check label="show closed-form (OLS) line" checked={showOLS} onChange={setShowOLS} />
        </Group>
        <Group title="Loss vs epoch"><Sparkline data={lossHist} color="#FBBF24" /></Group>
      </>}
    />
  )
}

// =========================================================================
// 11. DECISION TREE — greedy Gini splits
// =========================================================================

type TRegion = { x0: number; y0: number; x1: number; y1: number; idx: number[]; gini: number; depth: number }

function giniOf(idx: number[], cls: number[], k: number) {
  if (!idx.length) return 0
  const cnt = new Array(k).fill(0)
  idx.forEach((i) => cnt[cls[i]]++)
  return 1 - cnt.reduce((s: number, c: number) => s + (c / idx.length) ** 2, 0)
}
function majOf(idx: number[], cls: number[], k: number) {
  const cnt = new Array(k).fill(0)
  idx.forEach((i) => cnt[cls[i]]++)
  let b = 0
  for (let c = 1; c < k; c++) if (cnt[c] > cnt[b]) b = c
  return { cls: b, purity: idx.length ? cnt[b] / idx.length : 0 }
}

function DTree({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(4)
  const [nClasses, setNClasses] = useState(3)
  const [nPer, setNPer] = useState(40)
  const [noise, setNoise] = useState(0.12)
  const [maxDepth, setMaxDepth] = useState(5)
  const [running, setRunning] = useState(false)
  const [regions, setRegions] = useState<TRegion[]>([])
  const [lines, setLines] = useState<{ axis: 0 | 1; thr: number; box: [number, number, number, number] }[]>([])
  const [log, setLog] = useState<string[]>([])

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [colX, setColX] = useState(0)
  const [colY, setColY] = useState(1)
  const [colL, setColL] = useState(2)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table); const lab = guessLabelCol(table)
    setColX(nc.filter((i) => i !== lab)[0] ?? 0)
    setColY(nc.filter((i) => i !== lab)[1] ?? 1)
    setColL(lab)
  }, [table])

  const data = useMemo(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, colX), ys = scaleColAny(table, colY)
      const { ids } = labelCol(table, colL)
      return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i], c: ids[i] })).filter((p) => isFinite(p.x) && isFinite(p.y))
    }
    const rnd = mulberry32(seed)
    const centers = [{ x: 0.28, y: 0.32 }, { x: 0.72, y: 0.4 }, { x: 0.5, y: 0.74 }]
    const p: { x: number; y: number; c: number }[] = []
    for (let cl = 0; cl < nClasses; cl++) for (let i = 0; i < nPer; i++)
      p.push({ x: clamp01(centers[cl].x + gauss(rnd) * noise), y: clamp01(centers[cl].y + gauss(rnd) * noise), c: cl })
    return p
  }, [table, colX, colY, colL, seed, nClasses, nPer, noise])
  const K = table ? Math.max(2, new Set(data.map((d) => d.c)).size) : nClasses
  const cls = useMemo(() => data.map((d) => d.c), [data])

  const build = useCallback(() => {
    const idx = data.map((_, i) => i)
    const g = giniOf(idx, cls, K)
    setRegions([{ x0: 0, y0: 0, x1: 1, y1: 1, idx, gini: g, depth: 0 }])
    setLines([]); setRunning(false)
    setLog([`${data.length} points · ${K} classes · root Gini ${g.toFixed(3)}`])
  }, [data, cls, K])
  useEffect(() => { build() }, [build])

  const bestSplit = useCallback((r: TRegion) => {
    let best: { axis: 0 | 1; thr: number; gain: number; L: number[]; R: number[]; gL: number; gR: number } | null = null
    for (const axis of [0, 1] as const) {
      const lo = axis === 0 ? r.x0 : r.y0, hi = axis === 0 ? r.x1 : r.y1
      for (let t = 1; t <= 12; t++) {
        const thr = lo + (t / 13) * (hi - lo)
        const L: number[] = [], R: number[] = []
        r.idx.forEach((i) => ((axis === 0 ? data[i].x : data[i].y) < thr ? L : R).push(i))
        if (L.length < 3 || R.length < 3) continue
        const gL = giniOf(L, cls, K), gR = giniOf(R, cls, K)
        const gain = r.gini - (L.length * gL + R.length * gR) / r.idx.length
        if (!best || gain > best.gain) best = { axis, thr, gain, L, R, gL, gR }
      }
    }
    return best
  }, [data, cls, K])

  const step = useCallback(() => {
    const splittable = regions.map((r, i) => ({ r, i })).filter(({ r }) => r.depth < maxDepth && r.gini > 0.03 && r.idx.length > 6)
    if (!splittable.length) { setRunning(false); return }
    splittable.sort((a, b) => b.r.gini * b.r.idx.length - a.r.gini * a.r.idx.length)
    const { r, i } = splittable[0]
    const s = bestSplit(r)
    if (!s || s.gain <= 1e-4) { setRunning(false); return }
    const left: TRegion = s.axis === 0
      ? { x0: r.x0, y0: r.y0, x1: s.thr, y1: r.y1, idx: s.L, gini: s.gL, depth: r.depth + 1 }
      : { x0: r.x0, y0: r.y0, x1: r.x1, y1: s.thr, idx: s.L, gini: s.gL, depth: r.depth + 1 }
    const right: TRegion = s.axis === 0
      ? { x0: s.thr, y0: r.y0, x1: r.x1, y1: r.y1, idx: s.R, gini: s.gR, depth: r.depth + 1 }
      : { x0: r.x0, y0: s.thr, x1: r.x1, y1: r.y1, idx: s.R, gini: s.gR, depth: r.depth + 1 }
    setRegions([...regions.slice(0, i), left, right, ...regions.slice(i + 1)])
    setLines((ls) => [...ls, { axis: s.axis, thr: s.thr, box: [r.x0, r.y0, r.x1, r.y1] }])
    const after = (s.L.length * s.gL + s.R.length * s.gR) / r.idx.length
    setLog((l) => [...l.slice(-8), `split #${l.length}: ${s.axis === 0 ? 'x₁' : 'x₂'} < ${s.thr.toFixed(2)} · depth ${r.depth + 1} · Gini ${r.gini.toFixed(2)} → ${after.toFixed(2)}  (gain ${s.gain.toFixed(2)})`])
  }, [regions, maxDepth, bestSplit])

  useEffect(() => { if (!running) return; const t = setInterval(step, 500); return () => clearInterval(t) }, [running, step])

  const wGini = regions.reduce((s, r) => s + (r.idx.length / (data.length || 1)) * r.gini, 0)
  const depth = regions.reduce((m, r) => Math.max(m, r.depth), 0)

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: H } = size
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, W, H)
    const sx = (x: number) => x * W, sy = (y: number) => y * H
    regions.forEach((r) => {
      const { cls: mc, purity } = majOf(r.idx, cls, K)
      ctx.fillStyle = PALETTE[mc % PALETTE.length] + Math.round(20 + 45 * purity).toString(16).padStart(2, '0')
      ctx.fillRect(sx(r.x0), sy(r.y0), sx(r.x1 - r.x0), sy(r.y1 - r.y0))
    })
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.4
    lines.forEach(({ axis, thr, box }) => {
      ctx.beginPath()
      if (axis === 0) { ctx.moveTo(sx(thr), sy(box[1])); ctx.lineTo(sx(thr), sy(box[3])) }
      else { ctx.moveTo(sx(box[0]), sy(thr)); ctx.lineTo(sx(box[2]), sy(thr)) }
      ctx.stroke()
    })
    data.forEach((p) => {
      ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 4, 0, 7)
      ctx.fillStyle = PALETTE[p.c % PALETTE.length]; ctx.fill()
      ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 1.2; ctx.stroke()
    })
  }, [regions, lines, data, cls, K, size, canvas])

  return (
    <Frame wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'point (class colour)' },
        { c: '#8B5CF6', label: 'region = a leaf · fill = majority class' },
        { c: '#ffffff', label: 'white line = a split boundary' },
        { c: '#8A8A8A', label: 'stronger fill = purer leaf' },
      ]}
      caption={
        running || regions.length > 1
          ? `${regions.length} leaves, depth ${depth}. Each step picks the impurest leaf and the axis-aligned threshold with the largest Gini gain, then cuts it in two. Weighted Gini ${wGini.toFixed(3)} — it falls with every split, and near 0 the tree has started memorising noise.`
          : `Root: one region, weighted Gini ${wGini.toFixed(3)}. Press Run to grow the tree one greedy split at a time.`
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${data.length}` : 'synthetic'}</Chip>
        <Chip>leaves {regions.length}</Chip>
        <Chip>depth {depth}</Chip>
        <Chip color="#FBBF24">weighted Gini {wGini.toFixed(3)}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="At each step the tree finds the axis-aligned threshold with the largest Gini gain and splits the impurest leaf into two. Regions fill in with the majority class (opacity = purity); keep splitting and it eventually memorises the noise." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={step} disabled={running}><StepForward size={12} /></Btn>
            <Btn onClick={build}><RotateCcw size={12} /></Btn>
          </div>
          <Range label="Max depth" value={maxDepth} min={1} max={8} onChange={setMaxDepth} />
        </Group>
        <DataSource table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV: two feature columns + a label. Reset and re-run to rebuild the tree on your data.">
          <ColPick label="X feature" table={table} cols={cols} value={colX} onChange={setColX} />
          <ColPick label="Y feature" table={table} cols={cols} value={colY} onChange={setColY} />
          <ColPick label="Label" table={table} cols={cols} value={colL} onChange={setColL} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        {!table && (
          <Group title="Synthetic data">
            <Seg value={nClasses} onChange={setNClasses} options={[{ label: '2', value: 2 }, { label: '3', value: 3 }]} />
            <Range label="points / class" value={nPer} min={15} max={80} step={5} onChange={setNPer} />
            <Range label="noise σ" value={noise} min={0.05} max={0.22} step={0.01} onChange={setNoise} fmt={(n) => n.toFixed(2)} />
            <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>
          </Group>
        )}
      </>}
    />
  )
}

// =========================================================================
// 12. PERCEPTRON — the learning rule
// =========================================================================

function Perceptron({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(1)
  const [lr, setLr] = useState(0.3)
  const [sep, setSep] = useState(0.28)
  const [running, setRunning] = useState(false)
  const [w, setW] = useState<[number, number, number]>([0.4, -0.3, 0])
  const [ptr, setPtr] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [errThisPass, setErrThisPass] = useState(0)
  const [lastErr, setLastErr] = useState<number | null>(null)
  const [converged, setConverged] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [cx, setCx] = useState(0)
  const [cy, setCy] = useState(1)
  const [cl, setCl] = useState(2)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table); const lab = guessLabelCol(table)
    setCx(nc.filter((i) => i !== lab)[0] ?? 0); setCy(nc.filter((i) => i !== lab)[1] ?? 1); setCl(lab)
  }, [table])

  const data = useMemo<{ x: number; y: number; s: 1 | -1 }[]>(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, cx), ys = scaleColAny(table, cy)
      const { ids } = labelCol(table, cl)
      return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i], s: (ids[i] === 0 ? -1 : 1) as 1 | -1 })).filter((p) => isFinite(p.x))
    }
    const rnd = mulberry32(seed)
    const d: { x: number; y: number; s: 1 | -1 }[] = []
    for (let i = 0; i < 45; i++) d.push({ x: clamp01(0.5 - sep + gauss(rnd) * 0.1), y: clamp01(0.4 + gauss(rnd) * 0.14), s: -1 })
    for (let i = 0; i < 45; i++) d.push({ x: clamp01(0.5 + sep + gauss(rnd) * 0.1), y: clamp01(0.6 + gauss(rnd) * 0.14), s: 1 })
    return d
  }, [table, cx, cy, cl, seed, sep])

  const reset = useCallback(() => {
    setW([0.4, -0.3, 0]); setPtr(0); setEpoch(0); setErrThisPass(0); setLastErr(null); setConverged(false); setRunning(false)
    setLog([`${data.length} points · online perceptron, η ${lr.toFixed(2)}`])
  }, [data.length, lr])
  useEffect(() => { reset() }, [reset])
  useEffect(() => { if (table && data.length) setRunning(true) }, [table, data.length])

  const step = useCallback(() => {
    if (!data.length || converged) return
    const i = ptr % data.length
    const p = data[i]
    const act = w[0] * (p.x - 0.5) + w[1] * (p.y - 0.5) + w[2]
    let nw = w
    let hit = false
    if (Math.sign(act || 1) !== p.s) {
      nw = [w[0] + lr * p.s * (p.x - 0.5), w[1] + lr * p.s * (p.y - 0.5), w[2] + lr * p.s]
      hit = true
      setLog((l) => [...l.slice(-8), `pt ${i} misclassified (want ${p.s > 0 ? '+' : '−'}) → w += η·y·x`])
    }
    setW(nw)
    const passErr = errThisPass + (hit ? 1 : 0)
    if (ptr + 1 >= (epoch + 1) * data.length) {
      setEpoch((e) => e + 1)
      setLastErr(passErr)
      setLog((l) => [...l.slice(-8), `pass ${epoch + 1} — ${passErr} misclassified`])
      if (passErr === 0) { setConverged(true); setRunning(false) }
      setErrThisPass(0)
    } else {
      setErrThisPass(passErr)
    }
    setPtr(ptr + 1)
  }, [data, ptr, w, lr, converged, errThisPass, epoch])

  useEffect(() => { if (!running) return; const t = setInterval(step, 55); return () => clearInterval(t) }, [running, step])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: H } = size
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0B0B0E'; ctx.fillRect(0, 0, W, H)
    const cell = 14
    for (let gx = 0; gx < W; gx += cell) for (let gy = 0; gy < H; gy += cell) {
      const nx = (gx + cell / 2) / W, ny = (gy + cell / 2) / H
      const a = w[0] * (nx - 0.5) + w[1] * (ny - 0.5) + w[2]
      ctx.fillStyle = a >= 0 ? 'rgba(96,165,250,0.10)' : 'rgba(255,77,77,0.10)'
      ctx.fillRect(gx, gy, cell + 1, cell + 1)
    }
    if (Math.abs(w[1]) > 1e-6) {
      const yAt = (x: number) => 0.5 - (w[0] * (x - 0.5) + w[2]) / w[1]
      ctx.strokeStyle = '#FBBF24'; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(0, yAt(0) * H); ctx.lineTo(W, yAt(1) * H); ctx.stroke()
    }
    data.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 5, 0, 7)
      ctx.fillStyle = p.s > 0 ? '#60A5FA' : '#FF4D4D'; ctx.fill()
      ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 1.4; ctx.stroke()
    })
    if (running || ptr > 0) {
      const cur = data[ptr % data.length]
      if (cur) { ctx.beginPath(); ctx.arc(cur.x * W, cur.y * H, 10, 0, 7); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke() }
    }
  }, [w, data, ptr, running, size, canvas])

  return (
    <Frame wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'class −1 point' },
        { c: '#60A5FA', label: 'class +1 point' },
        { c: '#FBBF24', label: 'current boundary  w·x + b = 0' },
        { c: '#ffffff', label: 'circled = point being checked' },
      ]}
      caption={
        converged
          ? `Converged after ${epoch} passes — the data is linearly separable and the last full pass had 0 mistakes.`
          : running
            ? `Pass ${epoch + 1}: for the circled point, if sign(w·x + b) is wrong, w moves toward it by η·y·x — rotating the amber line. ${lastErr != null ? `Last pass: ${lastErr} mistakes.` : ''}`
            : 'Press Run — the rule nudges the boundary toward every misclassified point. Drop the class separation to 0 and it never stops.'
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${data.length}` : 'synthetic'}</Chip>
        <Chip>pass {epoch}</Chip>
        <Chip color="#FBBF24">errors last pass {lastErr ?? '—'}</Chip>
        <Chip color={converged ? '#34D399' : '#6B7280'}>{converged ? 'converged' : running ? 'learning' : 'ready'}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="The perceptron rule: for every point it labels wrong, move the weight vector toward it by η·y·x. The circled point is the one being checked. On linearly separable data it stops in finite time; overlap the classes and it never settles." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={converged}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={step} disabled={running || converged}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
        </Group>
        <DataSource table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV: two features + a binary label. Learning starts automatically.">
          <ColPick label="X feature" table={table} cols={cols} value={cx} onChange={setCx} />
          <ColPick label="Y feature" table={table} cols={cols} value={cy} onChange={setCy} />
          <ColPick label="Label" table={table} cols={cols} value={cl} onChange={setCl} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        <Group title="Parameters">
          <Range label="Learning rate η" value={lr} min={0.05} max={1} step={0.05} onChange={setLr} fmt={(n) => n.toFixed(2)} />
          {!table && <Range label="Class separation" value={sep} min={0.02} max={0.35} step={0.01} onChange={setSep} fmt={(n) => n.toFixed(2)} />}
          {!table && <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-sample</Btn>}
        </Group>
        <p className="text-[11px] text-[#6B7280] leading-relaxed">Drop the separation toward 0 to overlap the classes — the boundary will keep jittering forever.</p>
      </>}
    />
  )
}

// =========================================================================
// 13. MLP — a curved decision boundary
// =========================================================================

type Net = { W1: number[][]; b1: number[]; W2: number[]; b2: number }

function MLP({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [seed, setSeed] = useState(3)
  const [H, setH] = useState(8)
  const [lr, setLr] = useState(0.6)
  const [running, setRunning] = useState(false)
  const [epoch, setEpoch] = useState(0)
  const [lossHist, setLossHist] = useState<number[]>([])
  const [log, setLog] = useState<string[]>([])
  const [net, setNet] = useState<Net | null>(null)

  const { table, setTable, onFile, err } = useDataTable()
  const cols = useMemo(() => (table ? allCols(table) : []), [table])
  const [cx, setCx] = useState(0)
  const [cy, setCy] = useState(1)
  const [cl, setCl] = useState(2)
  useEffect(() => {
    if (!table) return
    const nc = numericCols(table); const lab = guessLabelCol(table)
    setCx(nc.filter((i) => i !== lab)[0] ?? 0); setCy(nc.filter((i) => i !== lab)[1] ?? 1); setCl(lab)
  }, [table])

  const data = useMemo<{ x: number; y: number; c: 0 | 1 }[]>(() => {
    if (table && table.headers.length >= 2) {
      const xs = scaleColAny(table, cx), ys = scaleColAny(table, cy)
      const { ids } = labelCol(table, cl)
      return table.rows.map((_, i) => ({ x: xs[i], y: 1 - ys[i], c: (ids[i] === 0 ? 0 : 1) as 0 | 1 })).filter((p) => isFinite(p.x))
    }
    // XOR-shaped: class 0 on one diagonal, class 1 on the other
    const rnd = mulberry32(seed)
    const blob = (bx: number, by: number, c: 0 | 1) =>
      Array.from({ length: 30 }, () => ({ x: clamp01(bx + gauss(rnd) * 0.09), y: clamp01(by + gauss(rnd) * 0.09), c }))
    return [...blob(0.28, 0.28, 0), ...blob(0.72, 0.72, 0), ...blob(0.28, 0.72, 1), ...blob(0.72, 0.28, 1)]
  }, [table, cx, cy, cl, seed])

  const initNet = useCallback((): Net => {
    const rnd = mulberry32(seed * 97 + H)
    return {
      W1: Array.from({ length: H }, () => [gauss(rnd) * 0.8, gauss(rnd) * 0.8]),
      b1: new Array(H).fill(0),
      W2: Array.from({ length: H }, () => gauss(rnd) * 0.8),
      b2: 0,
    }
  }, [seed, H])

  const reset = useCallback(() => {
    setNet(initNet()); setEpoch(0); setLossHist([]); setRunning(false)
    setLog([table ? `${data.length} rows from ${table.name}` : `synthetic XOR — ${data.length} points`, `${H} hidden units, lr ${lr.toFixed(2)}`])
  }, [initNet, data.length, H, lr, table])
  useEffect(() => { reset() }, [reset])
  useEffect(() => { if (table && data.length) setRunning(true) }, [table, data.length])

  const forward = (n: Net, x: number, y: number) => {
    const a1 = n.W1.map((row, j) => Math.tanh(row[0] * (x - 0.5) + row[1] * (y - 0.5) + n.b1[j]))
    const z2 = a1.reduce((s, a, j) => s + n.W2[j] * a, n.b2)
    return { a1, p: 1 / (1 + Math.exp(-z2)) }
  }

  const step = useCallback(() => {
    if (!net || !data.length) return
    const n = net
    const N = data.length
    const dW1 = n.W1.map(() => [0, 0])
    const db1 = new Array(H).fill(0)
    const dW2 = new Array(H).fill(0)
    let db2 = 0
    let loss = 0, correct = 0
    for (const p of data) {
      const { a1, p: pr } = forward(n, p.x, p.y)
      const dz2 = (pr - p.c) / N
      loss += -(p.c * Math.log(pr + 1e-9) + (1 - p.c) * Math.log(1 - pr + 1e-9)) / N
      if ((pr >= 0.5 ? 1 : 0) === p.c) correct++
      for (let j = 0; j < H; j++) {
        dW2[j] += dz2 * a1[j]
        const dz1 = dz2 * n.W2[j] * (1 - a1[j] * a1[j])
        dW1[j][0] += dz1 * (p.x - 0.5)
        dW1[j][1] += dz1 * (p.y - 0.5)
        db1[j] += dz1
      }
      db2 += dz2
    }
    const nn: Net = {
      W1: n.W1.map((row, j) => [row[0] - lr * dW1[j][0], row[1] - lr * dW1[j][1]]),
      b1: n.b1.map((b, j) => b - lr * db1[j]),
      W2: n.W2.map((wj, j) => wj - lr * dW2[j]),
      b2: n.b2 - lr * db2,
    }
    setNet(nn); setEpoch((e) => e + 1)
    setLossHist((hh) => [...hh.slice(-80), loss])
    setLog((l) => [...l.slice(-8), `epoch ${epoch + 1}: BCE ${loss.toFixed(3)}, train acc ${Math.round((correct / N) * 100)}%`])
    if (loss < 0.04) setRunning(false)
  }, [net, data, H, lr, epoch])

  useEffect(() => { if (!running) return; const t = setInterval(step, 70); return () => clearInterval(t) }, [running, step])

  const acc = useMemo(() => {
    if (!net || !data.length) return 0
    let c = 0
    data.forEach((p) => { if ((forward(net, p.x, p.y).p >= 0.5 ? 1 : 0) === p.c) c++ })
    return c / data.length
  }, [net, data])
  const done = lossHist.length > 5 && lossHist[lossHist.length - 1] < 0.04

  useEffect(() => {
    const c = canvas.current; if (!c || !net) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: Hh } = size
    ctx.clearRect(0, 0, W, Hh)
    const cell = 10
    for (let gx = 0; gx < W; gx += cell) for (let gy = 0; gy < Hh; gy += cell) {
      const pr = forward(net, (gx + cell / 2) / W, (gy + cell / 2) / Hh).p
      ctx.fillStyle = pr >= 0.5 ? `rgba(96,165,250,${(pr - 0.5) * 0.6})` : `rgba(255,77,77,${(0.5 - pr) * 0.6})`
      ctx.fillRect(gx, gy, cell + 1, cell + 1)
    }
    data.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x * W, p.y * Hh, 5, 0, 7)
      ctx.fillStyle = p.c === 1 ? '#60A5FA' : '#FF4D4D'; ctx.fill()
      ctx.strokeStyle = '#0B0B0E'; ctx.lineWidth = 1.4; ctx.stroke()
    })
  }, [net, data, size, canvas])

  return (
    <Frame wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#FF4D4D', label: 'class 0 point' },
        { c: '#60A5FA', label: 'class 1 point' },
        { c: '#8A8A8A', label: 'shading = network output  σ(z₂)' },
        { c: '#ffffff', label: 'white band = decision boundary' },
      ]}
      caption={
        done
          ? `Converged at ${Math.round(acc * 100)}% — ${H} tanh units combined into a curved boundary that isolates each cluster.`
          : running
            ? `Epoch ${epoch}: full-batch backprop updates W₁ (${H} hidden units) and W₂. Early the boundary is nearly straight; as loss (${lossHist.length ? lossHist[lossHist.length - 1].toFixed(3) : '—'}) drops it bends around the classes.`
            : `Press Run — a single linear layer can’t separate this XOR shape, but 2 layers with a tanh in between can. Watch the boundary curve.`
      }
      overlay={<>
        <Chip color={table ? '#34D399' : '#6B7280'}>{table ? `${table.name} · ${data.length}` : 'synthetic XOR'}</Chip>
        <Chip>epoch {epoch}</Chip>
        <Chip color="#34D399">train acc {(acc * 100).toFixed(0)}%</Chip>
        <Chip color="#FBBF24">BCE {lossHist.length ? lossHist[lossHist.length - 1].toFixed(3) : '—'}</Chip>
        <Chip color={done ? '#34D399' : '#6B7280'}>{done ? 'converged' : running ? 'training' : 'ready'}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="Two Linear layers with a tanh in between. The hidden units each draw a line; the output layer combines them into a curved boundary. Watch it start almost linear and bend as training proceeds." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running} disabled={done}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={step} disabled={running || done}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
        </Group>
        <DataSource table={table} onFile={onFile} onClear={() => setTable(null)}
          note="Any CSV: two features + a binary label. Training starts automatically.">
          <ColPick label="X feature" table={table} cols={cols} value={cx} onChange={setCx} />
          <ColPick label="Y feature" table={table} cols={cols} value={cy} onChange={setCy} />
          <ColPick label="Label" table={table} cols={cols} value={cl} onChange={setCl} />
        </DataSource>
        {err && <p className="text-[11px] text-[#FB7185]">{err}</p>}
        <Group title="Network">
          <Range label="Hidden units" value={H} min={2} max={16} step={2} onChange={setH} />
          <Range label="Learning rate" value={lr} min={0.05} max={2} step={0.05} onChange={setLr} fmt={(n) => n.toFixed(2)} />
          {!table && <Btn onClick={() => setSeed((s) => s + 1)} wide><Shuffle size={12} /> Re-init</Btn>}
        </Group>
        <Group title="Loss vs epoch"><Sparkline data={lossHist} color="#FBBF24" /></Group>
      </>}
    />
  )
}

// =========================================================================
// 14. OPTIMIZERS — SGD vs Momentum vs Adam
// =========================================================================

function Optimizers({ meta }: { meta: AlgoLabMeta }) {
  const { wrap, canvas, size } = useCanvas()
  const [lr, setLr] = useState(0.05)
  const [beta, setBeta] = useState(0.9)
  const [running, setRunning] = useState(false)
  const [step, setStepN] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const START: [number, number] = [-0.85, 0.9]
  const f = (x: number, y: number) => 3 * x * x + 0.35 * y * y
  const grad = (x: number, y: number): [number, number] => [6 * x, 0.7 * y]

  type St = { p: [number, number]; v: [number, number]; m: [number, number]; trail: [number, number][] }
  const mk = (): St => ({ p: [...START], v: [0, 0], m: [0, 0], trail: [[...START]] })
  const [sgd, setSgd] = useState<St>(mk)
  const [mom, setMom] = useState<St>(mk)
  const [adam, setAdam] = useState<St>(mk)

  const reset = useCallback(() => {
    setSgd(mk()); setMom(mk()); setAdam(mk()); setStepN(0); setRunning(false)
    setLog([`same start ${START.map((v) => v.toFixed(2)).join(', ')} · lr ${lr.toFixed(3)}, β ${beta.toFixed(2)}`])
  }, [lr, beta])
  useEffect(() => { reset() }, [reset])

  const doStep = useCallback(() => {
    const t = step + 1
    setSgd((s) => {
      const g = grad(s.p[0], s.p[1])
      const p: [number, number] = [s.p[0] - lr * g[0], s.p[1] - lr * g[1]]
      return { ...s, p, trail: [...s.trail.slice(-120), p] }
    })
    setMom((s) => {
      const g = grad(s.p[0], s.p[1])
      const v: [number, number] = [beta * s.v[0] - lr * g[0], beta * s.v[1] - lr * g[1]]
      const p: [number, number] = [s.p[0] + v[0], s.p[1] + v[1]]
      return { ...s, v, p, trail: [...s.trail.slice(-120), p] }
    })
    setAdam((s) => {
      const g = grad(s.p[0], s.p[1])
      const m: [number, number] = [0.9 * s.m[0] + 0.1 * g[0], 0.9 * s.m[1] + 0.1 * g[1]]
      const v: [number, number] = [0.999 * s.v[0] + 0.001 * g[0] ** 2, 0.999 * s.v[1] + 0.001 * g[1] ** 2]
      const mh: [number, number] = [m[0] / (1 - 0.9 ** t), m[1] / (1 - 0.9 ** t)]
      const vh: [number, number] = [v[0] / (1 - 0.999 ** t), v[1] / (1 - 0.999 ** t)]
      const p: [number, number] = [
        s.p[0] - (lr * 3) * mh[0] / (Math.sqrt(vh[0]) + 1e-8),
        s.p[1] - (lr * 3) * mh[1] / (Math.sqrt(vh[1]) + 1e-8),
      ]
      return { ...s, m, v, p, trail: [...s.trail.slice(-120), p] }
    })
    setStepN(t)
    if (t % 5 === 0) {
      setLog((l) => [...l.slice(-8), `step ${t} — f:  SGD ${f(sgd.p[0], sgd.p[1]).toFixed(3)}   Mom ${f(mom.p[0], mom.p[1]).toFixed(3)}   Adam ${f(adam.p[0], adam.p[1]).toFixed(3)}`])
    }
  }, [step, lr, beta, sgd.p, mom.p, adam.p])

  useEffect(() => { if (!running) return; const t = setInterval(doStep, 80); return () => clearInterval(t) }, [running, doStep])

  useEffect(() => {
    const c = canvas.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const { w: W, h: Hh } = size
    const sx = (x: number) => ((x + 1) / 2) * W
    const sy = (y: number) => ((1 - (y + 1) / 2)) * Hh
    // heatmap
    const cell = 10
    let fmax = f(1, 1)
    for (let gx = 0; gx < W; gx += cell) for (let gy = 0; gy < Hh; gy += cell) {
      const x = (gx / W) * 2 - 1, y = (1 - gy / Hh) * 2 - 1
      const v = f(x, y) / fmax
      ctx.fillStyle = `rgba(139,92,246,${0.05 + 0.35 * v})`
      ctx.fillRect(gx, gy, cell + 1, cell + 1)
    }
    // contour rings
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1
    ;[0.05, 0.15, 0.35, 0.6].forEach((lv) => {
      ctx.beginPath()
      for (let a = 0; a <= 64; a++) {
        const th = (a / 64) * Math.PI * 2
        const rx = Math.sqrt((lv * fmax) / 3) * Math.cos(th)
        const ry = Math.sqrt((lv * fmax) / 0.35) * Math.sin(th)
        a ? ctx.lineTo(sx(rx), sy(ry)) : ctx.moveTo(sx(rx), sy(ry))
      }
      ctx.closePath(); ctx.stroke()
    })
    ctx.beginPath(); ctx.arc(sx(0), sy(0), 5, 0, 7); ctx.fillStyle = '#fff'; ctx.fill()
    const draw = (s: St, col: string) => {
      ctx.strokeStyle = col + '99'; ctx.lineWidth = 1.6; ctx.beginPath()
      s.trail.forEach((p, i) => (i ? ctx.lineTo(sx(p[0]), sy(p[1])) : ctx.moveTo(sx(p[0]), sy(p[1]))))
      ctx.stroke()
      ctx.beginPath(); ctx.arc(sx(s.p[0]), sy(s.p[1]), 5, 0, 7); ctx.fillStyle = col; ctx.fill()
    }
    draw(sgd, '#FF4D4D'); draw(mom, '#60A5FA'); draw(adam, '#34D399')
  }, [sgd, mom, adam, size, canvas])

  return (
    <Frame wrap={wrap} canvas={canvas} meta={meta}
      legend={[
        { c: '#8B5CF6', label: 'loss surface (darker = higher)' },
        { c: '#FF4D4D', label: 'SGD path' },
        { c: '#60A5FA', label: 'Momentum path' },
        { c: '#34D399', label: 'Adam path' },
      ]}
      caption={
        step === 0
          ? 'All three start at the same point on an elongated bowl (x is ~9× steeper than y). Press Run and watch the paths diverge.'
          : `Step ${step}: same gradient, three rules. SGD (red) zig-zags across the steep x-axis; Momentum (blue) builds speed along the shallow y-axis; Adam (green) rescales each coordinate by its gradient history. f-values → SGD ${f(sgd.p[0], sgd.p[1]).toFixed(3)}, Mom ${f(mom.p[0], mom.p[1]).toFixed(3)}, Adam ${f(adam.p[0], adam.p[1]).toFixed(3)}.`
      }
      overlay={<>
        <Chip color="#FF4D4D">SGD f {f(sgd.p[0], sgd.p[1]).toFixed(3)}</Chip>
        <Chip color="#60A5FA">Momentum f {f(mom.p[0], mom.p[1]).toFixed(3)}</Chip>
        <Chip color="#34D399">Adam f {f(adam.p[0], adam.p[1]).toFixed(3)}</Chip>
        <Chip>step {step}</Chip>
      </>}
      controls={<>
        <Narration running={running} log={log}
          idle="An elongated bowl (x is 9× steeper than y). Same gradient, three rules: SGD zig-zags across the steep axis, Momentum accumulates velocity along the shallow one, Adam rescales each coordinate by its own gradient history and usually reaches the centre first." />
        <Group title="Run">
          <div className="grid grid-cols-3 gap-1.5">
            <Btn onClick={() => setRunning((r) => !r)} active={running}>{running ? <Pause size={12} /> : <Play size={12} />}</Btn>
            <Btn onClick={doStep} disabled={running}><StepForward size={12} /></Btn>
            <Btn onClick={reset}><RotateCcw size={12} /></Btn>
          </div>
        </Group>
        <Group title="Parameters">
          <Range label="Learning rate" value={lr} min={0.005} max={0.16} step={0.005} onChange={setLr} fmt={(n) => n.toFixed(3)} />
          <Range label="Momentum β" value={beta} min={0} max={0.98} step={0.02} onChange={setBeta} fmt={(n) => n.toFixed(2)} />
        </Group>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="text-[#FF4D4D]">■ SGD</span>
          <span className="text-[#60A5FA]">■ Momentum</span>
          <span className="text-[#34D399]">■ Adam</span>
        </div>
        <p className="text-[11px] text-[#6B7280] leading-relaxed">Push the learning rate up: SGD diverges on the steep axis long before the others.</p>
      </>}
    />
  )
}

// =========================================================================

export function AlgoLab({ meta }: { meta: AlgoLabMeta }) {
  switch (meta.id) {
    case 'kmeans': return <KMeans meta={meta} />
    case 'gradient-descent': return <GradientDescent meta={meta} />
    case 'softmax-temp': return <SoftmaxLab meta={meta} />
    case 'knn': return <KnnLab meta={meta} />
    case 'metrics': return <MetricsLab meta={meta} />
    case 'cosine': return <CosineLab meta={meta} />
    case 'logreg': return <LogisticTrain meta={meta} />
    case 'qlearn': return <QLearning meta={meta} />
    case 'pca': return <PCALab meta={meta} />
    case 'linreg': return <LinReg meta={meta} />
    case 'dtree': return <DTree meta={meta} />
    case 'perceptron': return <Perceptron meta={meta} />
    case 'mlp': return <MLP meta={meta} />
    case 'optimizers': return <Optimizers meta={meta} />
    default: return null
  }
}
