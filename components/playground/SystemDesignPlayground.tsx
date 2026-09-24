'use client'

import Link from 'next/link'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, addEdge,
  useNodesState, useEdgesState, useReactFlow, Handle, Position, NodeToolbar,
  MarkerType, BackgroundVariant, BaseEdge, EdgeLabelRenderer,
  getBezierPath, getSmoothStepPath, getStraightPath,
  type Node, type Edge, type Connection, type NodeProps, type NodeTypes,
  type EdgeProps, type EdgeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  ArrowLeft, Play, Trash2, Save, Check, ListChecks, Lightbulb, Network,
  Download, Plus, PanelLeftClose, PanelLeftOpen, CheckCircle2, Calculator,
  Search, GripVertical, ChevronDown, ChevronRight, ListTree, Pencil,
} from 'lucide-react'
import {
  SD_PROMPTS, SD_COMPONENTS, SD_COMPONENT_MAP, SD_DIFFICULTY_COLOR, SD_GROUP_ORDER,
  SD_CATEGORY_ORDER,
  type SdPrompt,
} from '@/lib/system-design-data'
import { SdIcon, tileColorFor } from '@/lib/system-design-icons'

const STATE_KEY = (id: string) => `kiit:sd:board:${id}`
const DONE_KEY = 'kiit:sd:attempted'
const PALETTE_W_KEY = 'kiit:sd:paletteW'
const PANEL_W_KEY = 'kiit:sd:panelW'

interface SavedBoard {
  nodes: Node[]
  edges: Edge[]
  notes: string
  checked: string[]
}

// ---- custom node --------------------------------------------------------

// In-app rename dialog — replaces window.prompt()'s native "site says" box.
// Nodes/edges live deep inside <ReactFlow>'s render tree, so they ask for a
// rename via this context rather than owning any dialog state themselves.
interface RenameRequest { kind: 'node' | 'edge'; id: string; value: string; title: string; connType?: ConnType }
const RenameContext = createContext<(req: RenameRequest) => void>(() => {})

function RenameModal({ req, onCancel, onSubmit }: {
  req: RenameRequest | null
  onCancel: () => void
  onSubmit: (value: string, connType?: ConnType) => void
}) {
  const [value, setValue] = useState('')
  const [connType, setConnType] = useState<ConnType>(DEFAULT_CONN_TYPE)
  useEffect(() => {
    if (req) {
      setValue(req.value)
      setConnType(req.connType || DEFAULT_CONN_TYPE)
    }
  }, [req])
  if (!req) return null
  const isEdge = req.kind === 'edge'
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onMouseDown={onCancel}
    >
      <form
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSubmit(value, isEdge ? connType : undefined) }}
        className="glass w-full max-w-[380px] rounded-2xl p-5"
      >
        <h3 className="text-[13px] font-bold text-white mb-3">{req.title}</h3>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') onCancel() }}
          onFocus={(e) => e.currentTarget.select()}
          autoFocus
          placeholder="Enter a name…"
          className="glass-well w-full px-3 py-2 rounded-lg text-[13px] text-white outline-none"
        />
        {isEdge && (
          <div className="mt-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Connection type</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CONNECTION_TYPES.map((t) => {
                const active = connType === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setConnType(t.id)}
                    title={t.hint}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer"
                    style={{
                      backgroundColor: active ? `${t.color}1F` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? `${t.color}80` : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <span className="w-6 h-0 shrink-0 border-t-[2px]" style={{ borderColor: t.color, borderStyle: t.dash ? 'dashed' : 'solid' }} />
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold" style={{ color: active ? t.color : '#D1D5DB' }}>{t.label}</span>
                      <span className="block text-[9px] text-[#6B7280] truncate">{t.hint}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-semibold text-[#8A8A8A] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="glass-raised glass-accent [--acc:#8B5CF6] px-4 py-1.5 rounded-lg text-[12px] font-bold text-white cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

// Small action pill shown once a node or edge is selected — Rename + Delete.
function SelectionActions({ onRename, onDelete }: { onRename: (e: React.MouseEvent) => void; onDelete: (e: React.MouseEvent) => void }) {
  return (
    <div className="nodrag nopan flex items-center gap-1 rounded-lg bg-[#18181C] border border-white/[0.1] shadow-lg p-0.5">
      <button
        onClick={onRename}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[#D1D5DB] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        title="Rename"
      >
        <Pencil size={10} /> Rename
      </button>
      <span className="w-px h-3.5 bg-white/[0.1]" />
      <button
        onClick={onDelete}
        className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-[#FF8A80] hover:text-white hover:bg-[#FF4D4D] transition-colors cursor-pointer"
        title="Delete"
      >
        <Trash2 size={10} /> Delete
      </button>
    </div>
  )
}

function SdFlowNode({ id, data, selected }: NodeProps) {
  const kind = (data.kind as string) || 'service'
  const meta = SD_COMPONENT_MAP[kind]
  const iconKey = (meta?.icon as string) || kind
  const color = tileColorFor(iconKey, (meta?.color as string) || '#64748B')
  const { deleteElements } = useReactFlow()
  const requestRename = useContext(RenameContext)

  const renameNode = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    requestRename({ kind: 'node', id, value: (data.label as string) || meta?.label || kind, title: 'Rename component' })
  }, [id, data.label, meta?.label, kind, requestRename])

  const deleteNode = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ nodes: [{ id }] })
  }, [id, deleteElements])

  return (
    <div
      className="relative flex items-center gap-2.5 rounded-[12px] pl-2 pr-3.5 py-2 min-w-[164px] max-w-[240px]"
      style={{
        background: '#141418',
        border: `1px solid ${selected ? color : 'rgba(255,255,255,0.10)'}`,
        boxShadow: selected ? `0 0 0 2px ${color}55, 0 12px 30px rgba(0,0,0,0.5)` : '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      <NodeToolbar isVisible={selected} position={Position.Top} offset={10}>
        <SelectionActions onRename={renameNode} onDelete={deleteNode} />
      </NodeToolbar>
      <Handle type="target" position={Position.Left} style={{ background: color, width: 7, height: 7, border: 'none' }} />
      <Handle type="target" position={Position.Top} id="t" style={{ background: color, width: 7, height: 7, border: 'none' }} />
      <SdIcon kind={iconKey} size={26} />
      <span className="text-[11.5px] font-semibold text-[#E5E7EB] leading-tight truncate">{(data.label as string) || meta?.label || kind}</span>
      <Handle type="source" position={Position.Right} style={{ background: color, width: 7, height: 7, border: 'none' }} />
      <Handle type="source" position={Position.Bottom} id="b" style={{ background: color, width: 7, height: 7, border: 'none' }} />
    </div>
  )
}

const nodeTypes: NodeTypes = { sd: SdFlowNode }

type EdgeShape = 'default' | 'smoothstep' | 'straight'
const EDGE_SHAPES: { id: EdgeShape; label: string }[] = [
  { id: 'default', label: 'Curved' },
  { id: 'smoothstep', label: 'Orthogonal' },
  { id: 'straight', label: 'Straight' },
]

// The kind of call a connection represents — drives its colour/dash so a
// design reads correctly at a glance (solid sync vs dashed async, etc.).
type ConnType = 'sync' | 'async' | 'data' | 'stream'
const CONNECTION_TYPES: { id: ConnType; label: string; hint: string; color: string; dash?: string }[] = [
  { id: 'sync', label: 'Sync', hint: 'Request/response — REST, RPC, gRPC', color: '#8B5CF6' },
  { id: 'async', label: 'Async', hint: 'Fire-and-forget — queue, event, pub/sub', color: '#F59E0B', dash: '7 4' },
  { id: 'data', label: 'Data', hint: 'Read/write — database, cache', color: '#10B981', dash: '2 3' },
  { id: 'stream', label: 'Stream', hint: 'Long-lived — WebSocket, SSE, gRPC stream', color: '#EC4899', dash: '1 3 5 3' },
]
const CONNECTION_TYPE_MAP: Record<string, (typeof CONNECTION_TYPES)[number]> = Object.fromEntries(
  CONNECTION_TYPES.map((t) => [t.id, t]),
)
const DEFAULT_CONN_TYPE: ConnType = 'sync'

const edgeBase = {
  type: 'sd',
  animated: true,
  style: { stroke: '#8B5CF6', strokeWidth: 1.6 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
  labelStyle: { fill: '#D1D5DB', fontSize: 10, fontFamily: 'ui-monospace, monospace' },
  labelBgStyle: { fill: '#0D0D10', stroke: 'rgba(255,255,255,0.08)' },
  labelBgPadding: [4, 3] as [number, number],
  labelBgBorderRadius: 4,
}

// Backfills a loaded board's edges to the current shape — legacy boards
// stored the shape directly on `type`; newer ones carry it in data.shape.
// Shared by the localStorage load and the account-sync fetch.
function normalizeEdges(raw: Edge[]): Edge[] {
  return raw.map((e) => {
    const prevData = e.data as { shape?: EdgeShape; connType?: ConnType } | undefined
    const shape = prevData?.shape || (EDGE_SHAPES.some((s) => s.id === e.type) ? (e.type as EdgeShape) : 'default')
    const connType = prevData?.connType || DEFAULT_CONN_TYPE
    return { ...edgeBase, ...e, type: 'sd', data: { ...e.data, shape, connType } }
  })
}

// Custom edge — draws the chosen shape (curved/orthogonal/straight, read
// from data.shape) and, once selected, shows a Rename + Delete pill at its
// midpoint so a connection can be edited or removed with a click, not just
// double-click / Backspace.
function SdEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition,
  style, markerEnd, label, labelStyle, labelBgStyle, labelBgPadding, labelBgBorderRadius,
  data, selected,
}: EdgeProps) {
  const shape = (data?.shape as EdgeShape) || 'default'
  const connType = (data?.connType as ConnType) || DEFAULT_CONN_TYPE
  const [path, labelX, labelY] =
    shape === 'smoothstep'
      ? getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
      : shape === 'straight'
        ? getStraightPath({ sourceX, sourceY, targetX, targetY })
        : getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const { deleteElements } = useReactFlow()
  const requestRename = useContext(RenameContext)

  const renameEdge = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    requestRename({ kind: 'edge', id, value: (label as string) || '', title: 'Edit connection', connType })
  }, [id, label, connType, requestRename])

  const deleteEdge = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    deleteElements({ edges: [{ id }] })
  }, [id, deleteElements])

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={selected ? { ...style, strokeWidth: ((style?.strokeWidth as number) || 1.6) + 0.6 } : style}
        markerEnd={markerEnd}
        label={label}
        labelStyle={labelStyle}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            className="absolute"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - (label ? 24 : 0)}px)`, pointerEvents: 'all' }}
          >
            <SelectionActions onRename={renameEdge} onDelete={deleteEdge} />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const edgeTypes: EdgeTypes = { sd: SdEdge }

// ---- canvas (inside provider) -----------------------------------------

function Canvas({ prompt, onBack, onAttempt, onPick, attempted }: {
  onPick: (p: SdPrompt) => void
  attempted: Set<string>
  prompt: SdPrompt
  onBack: () => void
  onAttempt: (id: string) => void
}) {
  const dc = SD_DIFFICULTY_COLOR[prompt.difficulty]
  const { screenToFlowPosition, deleteElements } = useReactFlow()
  const wrapRef = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [notes, setNotes] = useState('')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [panel, setPanel] = useState<'requirements' | 'estimation' | 'hints'>('requirements')
  const [saved, setSaved] = useState(false)

  const [listOpen, setListOpen] = useState(false)
  const [openCat, setOpenCat] = useState<string | null>(prompt.category)

  const [edgeShape, setEdgeShape] = useState<EdgeShape>('default')
  const [paletteOpen, setPaletteOpen] = useState(true)
  const [paletteW, setPaletteW] = useState(232)
  const [panelW, setPanelW] = useState(372)
  const [resizing, setResizing] = useState<null | 'palette' | 'panel'>(null)
  const [pSearch, setPSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const paletteRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragW = useRef<{ which: 'palette' | 'panel'; startX: number; startW: number } | null>(null)

  const clampW = (which: 'palette' | 'panel', w: number) => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440
    const min = which === 'palette' ? 190 : 300
    const max = Math.min(which === 'palette' ? 520 : 680, Math.round(vw * 0.55))
    return Math.min(max, Math.max(min, w))
  }

  // ---- load board ----
  useEffect(() => {
    let board: SavedBoard | null = null
    try {
      const raw = window.localStorage.getItem(STATE_KEY(prompt.id))
      if (raw) board = JSON.parse(raw)
      const pw = window.localStorage.getItem(PALETTE_W_KEY)
      if (pw) setPaletteW(clampW('palette', Number(pw) || 232))
      const rw = window.localStorage.getItem(PANEL_W_KEY)
      if (rw) setPanelW(clampW('panel', Number(rw) || 372))
    } catch { /* noop */ }

    setNodes(board?.nodes ?? [{
      id: 'n-client-0',
      type: 'sd',
      position: { x: 60, y: 180 },
      data: { label: 'Web Client', kind: 'client' },
    }])
    setEdges(normalizeEdges(board?.edges ?? []))
    setNotes(board?.notes ?? '')
    setChecked(new Set(board?.checked ?? []))
    setPanel('requirements')
    onAttempt(prompt.id)

    // If the visitor is signed in, the account copy is the cross-device
    // source of truth — fetch it and override the localStorage snapshot
    // above once it arrives. Silently does nothing when signed out.
    let cancelled = false
    fetch(`/api/boards/${prompt.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { board: SavedBoard | null } | null) => {
        if (cancelled || !data?.board) return
        setNodes(data.board.nodes ?? [])
        setEdges(normalizeEdges(data.board.edges ?? []))
        setNotes(data.board.notes ?? '')
        setChecked(new Set(data.board.checked ?? []))
      })
      .catch(() => { /* offline / signed out — localStorage snapshot stands */ })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt.id])

  // ---- autosave (localStorage always; account sync when signed in) ----
  useEffect(() => {
    const t = setTimeout(() => {
      const snapshot = { nodes, edges, notes, checked: [...checked] }
      try {
        window.localStorage.setItem(STATE_KEY(prompt.id), JSON.stringify(snapshot))
      } catch { /* quota */ }
      fetch(`/api/boards/${prompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot),
      }).catch(() => { /* offline / signed out — localStorage still has it */ })
    }, 700)
    return () => clearTimeout(t)
  }, [nodes, edges, notes, checked, prompt.id])

  const addNode = useCallback((kindId: string, at?: { x: number; y: number }) => {
    const kind = SD_COMPONENT_MAP[kindId]
    if (!kind) return
    setNodes((ns) => [
      ...ns,
      {
        id: `n-${kindId}-${Date.now()}`,
        type: 'sd',
        position: at ?? { x: 280 + (ns.length % 4) * 200, y: 80 + Math.floor(ns.length / 4) * 110 },
        data: { label: kind.label, kind: kindId },
      },
    ])
  }, [setNodes])

  const onConnect = useCallback(
    (c: Connection) => setEdges((es) => addEdge({ ...edgeBase, data: { shape: edgeShape, connType: DEFAULT_CONN_TYPE }, ...c }, es)),
    [setEdges, edgeShape],
  )

  // re-shape all existing edges when the toggle changes
  useEffect(() => {
    setEdges((es) =>
      es.map((e) => {
        const shape = (e.data as { shape?: EdgeShape } | undefined)?.shape
        return shape === edgeShape ? e : { ...e, data: { ...e.data, shape: edgeShape } }
      }),
    )
  }, [edgeShape, setEdges])

  // ---- rename dialog (in-app, replaces window.prompt) ----
  const [renameReq, setRenameReq] = useState<RenameRequest | null>(null)
  const applyRename = useCallback((value: string, connType?: ConnType) => {
    if (!renameReq) return
    const trimmed = value.trim()
    if (renameReq.kind === 'node') {
      if (trimmed) setNodes((ns) => ns.map((n) => (n.id === renameReq.id ? { ...n, data: { ...n.data, label: trimmed } } : n)))
    } else {
      const resolved = connType || DEFAULT_CONN_TYPE
      const ct = CONNECTION_TYPE_MAP[resolved] || CONNECTION_TYPE_MAP[DEFAULT_CONN_TYPE]
      setEdges((es) => es.map((e) => (e.id === renameReq.id ? {
        ...e,
        label: trimmed || undefined,
        data: { ...e.data, connType: resolved },
        style: { ...e.style, stroke: ct.color, strokeDasharray: ct.dash },
        markerEnd: { type: MarkerType.ArrowClosed, color: ct.color },
      } : e)))
    }
    setRenameReq(null)
  }, [renameReq, setNodes, setEdges])

  const onEdgeDoubleClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setRenameReq({
      kind: 'edge',
      id: edge.id,
      value: (edge.label as string) || '',
      title: 'Edit connection',
      connType: (edge.data as { connType?: ConnType } | undefined)?.connType,
    })
  }, [])

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    setRenameReq({ kind: 'node', id: node.id, value: (node.data as { label?: string })?.label || '', title: 'Rename component' })
  }, [])

  // ---- select + delete ----
  const selectedNodeIds = useMemo(() => nodes.filter((n) => n.selected).map((n) => n.id), [nodes])
  const selectedEdgeIds = useMemo(() => edges.filter((e) => e.selected).map((e) => e.id), [edges])
  const hasSelection = selectedNodeIds.length > 0 || selectedEdgeIds.length > 0
  const deleteSelected = useCallback(() => {
    deleteElements({
      nodes: selectedNodeIds.map((id) => ({ id })),
      edges: selectedEdgeIds.map((id) => ({ id })),
    })
  }, [deleteElements, selectedNodeIds, selectedEdgeIds])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const kindId = e.dataTransfer.getData('application/sd-kind')
    if (!kindId) return
    addNode(kindId, screenToFlowPosition({ x: e.clientX, y: e.clientY }))
  }, [addNode, screenToFlowPosition])

  // ---- resize drag (palette + right panel) ----
  // During the drag we set the DOM width directly (no React re-render of the
  // list on every mousemove); state + persistence is committed on drop.
  const startResize = useCallback((which: 'palette' | 'panel') => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = which === 'palette' ? paletteRef.current : panelRef.current
    dragW.current = { which, startX: e.clientX, startW: el?.offsetWidth ?? 0 }
    setResizing(which)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = dragW.current
      if (!d) return
      const el = d.which === 'palette' ? paletteRef.current : panelRef.current
      if (!el) return
      // palette grows to the right, panel grows to the left
      const delta = d.which === 'palette' ? e.clientX - d.startX : d.startX - e.clientX
      el.style.width = `${clampW(d.which, d.startW + delta)}px`
      window.dispatchEvent(new Event('resize')) // nudge React Flow to re-fit
    }
    const up = () => {
      const d = dragW.current
      if (!d) return
      const el = d.which === 'palette' ? paletteRef.current : panelRef.current
      const w = clampW(d.which, el?.offsetWidth ?? 0)
      dragW.current = null
      setResizing(null)
      if (d.which === 'palette') {
        setPaletteW(w)
        try { window.localStorage.setItem(PALETTE_W_KEY, String(w)) } catch { /* quota */ }
      } else {
        setPanelW(w)
        try { window.localStorage.setItem(PANEL_W_KEY, String(w)) } catch { /* quota */ }
      }
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = useCallback(() => {
    try {
      window.localStorage.setItem(STATE_KEY(prompt.id), JSON.stringify({ nodes, edges, notes, checked: [...checked] }))
    } catch { /* quota */ }
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [prompt.id, nodes, edges, notes, checked])

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ prompt: prompt.id, nodes, edges, notes }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${prompt.id}-design.json`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  const placedKinds = useMemo(
    () => new Set(nodes.map((n) => (n.data as { kind?: string })?.kind).filter(Boolean) as string[]),
    [nodes],
  )
  const coverage = Math.round((prompt.expects.filter((k) => placedKinds.has(k)).length / prompt.expects.length) * 100)

  const toggleCheck = (v: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(v)) next.delete(v)
      else next.add(v)
      return next
    })
  }

  const groups = useMemo(() => {
    const q = pSearch.trim().toLowerCase()
    return SD_GROUP_ORDER
      .map((g) => ({
        group: g,
        items: SD_COMPONENTS.filter((c) => c.group === g && (!q || c.label.toLowerCase().includes(q))),
      }))
      .filter((g) => g.items.length > 0)
  }, [pSearch])

  const promptCats = useMemo(
    () => SD_CATEGORY_ORDER
      .map((cat) => ({ cat, items: SD_PROMPTS.filter((p) => p.category === cat) }))
      .filter((g) => g.items.length > 0),
    [],
  )

  const pickPrompt = useCallback((p: SdPrompt) => {
    onPick(p)
    setOpenCat(p.category)
    setListOpen(false) // collapse the rail once a design is chosen
  }, [onPick])

  return (
    <RenameContext.Provider value={setRenameReq}>
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-hidden">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-[#0D0D10] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors shrink-0" title="Back to prompts">
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => setListOpen((v) => !v)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
              listOpen ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#8B5CF6]' : 'bg-white/[0.04] border-white/[0.08] text-[#8A8A8A] hover:text-white'
            }`}
            title={listOpen ? 'Hide design list' : 'Show design list'}
          >
            <ListTree size={14} />
          </button>
          <button onClick={() => setPaletteOpen((v) => !v)} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors shrink-0" title="Toggle palette">
            {paletteOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ color: dc.text, backgroundColor: dc.bg, border: `1px solid ${dc.border}` }}>{prompt.difficulty}</span>
          <h2 className="text-sm font-bold text-white truncate">{prompt.title}</h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-[#8A8A8A] hidden lg:inline">
            coverage <span className="text-[#8B5CF6] font-bold">{coverage}%</span> · {nodes.length} nodes · {edges.length} edges
          </span>
          <div className="hidden xl:flex items-center gap-2 px-2 rounded-lg bg-white/[0.03] border border-white/[0.08] h-[26px]" title="Connection type legend — set per connection via its Rename action">
            {CONNECTION_TYPES.map((t) => (
              <span key={t.id} className="flex items-center gap-1 text-[9px] font-mono text-[#8A8A8A]">
                <span className="w-3 h-0 border-t-[2px]" style={{ borderColor: t.color, borderStyle: t.dash ? 'dashed' : 'solid' }} />
                {t.label}
              </span>
            ))}
          </div>
          <div className="flex items-center rounded-lg bg-white/[0.03] border border-white/[0.08] p-0.5" title="Edge shape">
            {EDGE_SHAPES.map((s) => (
              <button
                key={s.id}
                onClick={() => setEdgeShape(s.id)}
                className={`px-2 py-1 rounded-md text-[9px] font-mono transition-colors ${
                  edgeShape === s.id ? 'bg-[#8B5CF6] text-white' : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={deleteSelected}
            disabled={!hasSelection}
            title={hasSelection ? 'Delete selected (Backspace / Delete)' : 'Select a component or connection to delete it'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              hasSelection
                ? 'text-[#FF4D4D] bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/20 border border-[#FF4D4D]/25'
                : 'text-[#4B5563] bg-white/[0.02] cursor-not-allowed'
            }`}
          >
            <Trash2 size={11} /> Delete{hasSelection ? ` (${selectedNodeIds.length + selectedEdgeIds.length})` : ''}
          </button>
          <button onClick={() => { setNodes([]); setEdges([]) }} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <Trash2 size={11} /> Clear
          </button>
          <button onClick={exportJson} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-[#8A8A8A] hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
            <Download size={11} /> Export
          </button>
          <button onClick={save} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors">
            {saved ? <Check size={12} /> : <Save size={12} />} {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* DESIGN RAIL — categories → prompts, collapses once a design is picked */}
        {listOpen && (
          <div className="w-[280px] shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <ListTree size={11} /> System Design
              </span>
              <span className="text-[9px] font-mono text-[#8B5CF6]">{attempted.size}/{SD_PROMPTS.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1.5">
              {promptCats.map(({ cat, items }) => {
                const open = openCat === cat
                const done = items.filter((i) => attempted.has(i.id)).length
                return (
                  <div key={cat} className="glass rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenCat(open ? null : cat)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      {open ? <ChevronDown size={12} className="text-[#6B7280] shrink-0" /> : <ChevronRight size={12} className="text-[#6B7280] shrink-0" />}
                      <span className="flex-1 min-w-0 text-[11px] font-semibold text-[#D1D5DB] truncate">{cat}</span>
                      <span className="text-[9px] font-mono text-[#4B5563] shrink-0">{done}/{items.length}</span>
                    </button>
                    {open && (
                      <div className="border-t border-white/[0.04] py-1">
                        {items.map((item) => {
                          const active = item.id === prompt.id
                          const c = SD_DIFFICULTY_COLOR[item.difficulty]
                          return (
                            <button
                              key={item.id}
                              onClick={() => pickPrompt(item)}
                              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left transition-colors ${
                                active ? 'bg-[#8B5CF6]/[0.10]' : 'hover:bg-white/[0.03]'
                              }`}
                            >
                              {attempted.has(item.id)
                                ? <CheckCircle2 size={11} className="text-[#8B5CF6] shrink-0" />
                                : <span className="w-[11px] h-[11px] rounded-full border border-white/15 shrink-0" />}
                              <span className={`flex-1 min-w-0 text-[11px] truncate ${active ? 'text-white font-semibold' : 'text-[#9CA3AF]'}`}>
                                {item.title.replace(/^Design (a |an |the )?/i, '')}
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

        {/* palette (resizable) */}
        {paletteOpen && (
          <>
            <div
              ref={paletteRef}
              className={`shrink-0 border-r border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0 ${resizing === 'palette' ? '' : 'transition-[width] duration-150'}`}
              style={{ width: paletteW }}
            >
              <div className="p-2 border-b border-white/[0.05] shrink-0">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    value={pSearch}
                    onChange={(e) => setPSearch(e.target.value)}
                    placeholder="Search components…"
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] text-white placeholder:text-[#6B7280] outline-none focus:border-[#8B5CF6]/40"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2.5">
                {groups.map(({ group, items }) => {
                  const isCol = collapsed.has(group)
                  return (
                    <div key={group}>
                      <button
                        onClick={() => setCollapsed((prev) => {
                          const n = new Set(prev)
                          if (n.has(group)) n.delete(group)
                          else n.add(group)
                          return n
                        })}
                        className="w-full flex items-center gap-1.5 px-1 mb-1 text-[9.5px] font-mono uppercase tracking-wider text-[#6B7280] hover:text-white transition-colors"
                      >
                        <span className={`transition-transform ${isCol ? '' : 'rotate-90'}`}>▸</span>
                        {group}
                        <span className="ml-auto text-[#4B5563]">{items.length}</span>
                      </button>
                      {!isCol && (
                        <div className="space-y-1">
                          {items.map((c) => (
                            <button
                              key={c.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('application/sd-kind', c.id)
                                e.dataTransfer.effectAllowed = 'move'
                              }}
                              onClick={() => addNode(c.id)}
                              className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11.5px] text-[#D1D5DB] hover:text-white hover:bg-white/[0.04] transition-colors text-left group cursor-grab active:cursor-grabbing"
                            >
                              <SdIcon kind={c.icon || c.id} size={22} color={c.color} />
                              <span className="flex-1 truncate">{c.label}</span>
                              <Plus size={11} className="text-[#4B5563] group-hover:text-white shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            {/* drag handle — wide invisible hit area, thin visible bar */}
            <div
              onMouseDown={startResize('palette')}
              onDoubleClick={() => { setPaletteW(232); try { window.localStorage.setItem(PALETTE_W_KEY, '232') } catch { /* quota */ } }}
              className="relative w-1.5 shrink-0 cursor-col-resize group select-none"
              title="Drag to resize · double-click to reset"
            >
              <span className="absolute inset-y-0 -left-2 -right-2 z-10" />
              <span className={`absolute inset-y-0 left-0 right-0 transition-colors ${resizing === 'palette' ? 'bg-[#8B5CF6]' : 'bg-white/[0.05] group-hover:bg-[#8B5CF6]/60'}`} />
              <GripVertical size={12} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors ${resizing === 'palette' ? 'text-white' : 'text-[#4B5563] group-hover:text-white'}`} />
            </div>
          </>
        )}

        {/* canvas */}
        <div ref={wrapRef} className="flex-1 min-w-0 relative" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onNodeDoubleClick={onNodeDoubleClick}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
            minZoom={0.2}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ ...edgeBase, data: { shape: edgeShape, connType: DEFAULT_CONN_TYPE } }}
          >
            <Background id="grid" variant={BackgroundVariant.Lines} gap={96} lineWidth={1} color="#18181B" />
            <Background id="dots" variant={BackgroundVariant.Dots} gap={16} size={1.4} color="#3A3A42" />
            <Controls className="!bg-[#141418] !border-white/[0.08] [&>button]:!bg-[#141418] [&>button]:!border-white/[0.08] [&>button]:!fill-[#8A8A8A]" />
            <MiniMap
              pannable
              zoomable
              maskColor="rgba(10,10,13,0.75)"
              style={{ background: '#0D0D10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
              nodeColor={(n) => {
                const k = (n.data as { kind?: string })?.kind ?? ''
                return tileColorFor(SD_COMPONENT_MAP[k]?.icon || k, '#64748B')
              }}
            />
          </ReactFlow>

          {nodes.length === 0 && edges.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-[12px] font-mono text-[#4B5563] text-center max-w-sm leading-relaxed">
                Drag components from the palette onto the canvas.<br />
                Connect them by dragging between the coloured handles.<br />
                Double-click a node to rename, an edge to label it.
              </p>
            </div>
          )}
        </div>

        {/* right panel drag handle */}
        <div
          onMouseDown={startResize('panel')}
          onDoubleClick={() => { setPanelW(372); try { window.localStorage.setItem(PANEL_W_KEY, '372') } catch { /* quota */ } }}
          className="relative w-1.5 shrink-0 cursor-col-resize group select-none"
          title="Drag to resize · double-click to reset"
        >
          <span className="absolute inset-y-0 -left-2 -right-2 z-10" />
          <span className={`absolute inset-y-0 left-0 right-0 transition-colors ${resizing === 'panel' ? 'bg-[#8B5CF6]' : 'bg-white/[0.05] group-hover:bg-[#8B5CF6]/60'}`} />
          <GripVertical size={12} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors ${resizing === 'panel' ? 'text-white' : 'text-[#4B5563] group-hover:text-white'}`} />
        </div>

        {/* right panel */}
        <div
          ref={panelRef}
          className={`shrink-0 border-l border-white/[0.06] bg-[#0D0D10] flex flex-col min-h-0 ${resizing === 'panel' ? '' : 'transition-[width] duration-150'}`}
          style={{ width: panelW }}
        >
          <div className="flex items-center gap-1 p-2 border-b border-white/[0.05] shrink-0">
            {([
              { id: 'requirements' as const, label: 'Requirements', icon: ListChecks },
              { id: 'estimation' as const, label: 'Estimate', icon: Calculator },
              { id: 'hints' as const, label: 'Hints', icon: Lightbulb },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setPanel(t.id)}
                className={`flex-1 px-2 py-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  panel === t.id ? 'bg-white/[0.08] text-white' : 'text-[#6B7280] hover:text-white'
                }`}
              >
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4 space-y-5">
            {panel === 'requirements' && (
              <>
                <p className="text-[13px] text-[#B4B8BF] leading-relaxed">{prompt.brief}</p>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] mb-2">Functional</p>
                  <div className="space-y-0.5">
                    {prompt.functional.map((r) => (
                      <button key={r} onClick={() => toggleCheck(r)} className="w-full flex items-start gap-2.5 py-1.5 group text-left">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-px transition-colors ${checked.has(r) ? 'bg-[#10B981] border-[#10B981]' : 'border-white/25 group-hover:border-white/50'}`}>
                          {checked.has(r) && <Check size={11} className="text-white" />}
                        </span>
                        <span className={`text-[12.5px] leading-relaxed ${checked.has(r) ? 'text-[#6B7280] line-through' : 'text-[#D8DBE0]'}`}>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] mb-2">Non-functional</p>
                  <div className="space-y-0.5">
                    {prompt.nonFunctional.map((r) => (
                      <button key={r} onClick={() => toggleCheck(r)} className="w-full flex items-start gap-2.5 py-1.5 group text-left">
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-px transition-colors ${checked.has(r) ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-white/25 group-hover:border-white/50'}`}>
                          {checked.has(r) && <Check size={11} className="text-white" />}
                        </span>
                        <span className={`text-[12.5px] leading-relaxed ${checked.has(r) ? 'text-[#6B7280] line-through' : 'text-[#D8DBE0]'}`}>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#8B5CF6]">Component coverage</p>
                    <span className="text-[11px] font-mono font-bold text-[#8B5CF6]">{coverage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2.5">
                    <div className="h-full rounded-full bg-[#8B5CF6] transition-[width] duration-500" style={{ width: `${coverage}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.expects.map((k) => {
                      const kind = SD_COMPONENT_MAP[k]
                      const have = placedKinds.has(k)
                      return (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md border"
                          style={have
                            ? { color: kind?.color, backgroundColor: `${kind?.color}1A`, borderColor: `${kind?.color}55` }
                            : { color: '#5B5B66', borderColor: 'rgba(255,255,255,0.07)' }}
                        >
                          {have && <Check size={9} />}{kind?.label ?? k}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {panel === 'estimation' && (
              <>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Back-of-envelope</p>
                <ul className="space-y-2.5">
                  {prompt.estimation.map((e) => (
                    <li key={e} className="flex gap-2.5 text-[12.5px] text-[#B4B8BF] leading-relaxed">
                      <span className="text-[#8B5CF6] shrink-0 mt-px">›</span><span>{e}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] mb-2">Your notes</p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="QPS, storage, cache sizing, trade-offs…"
                    className="w-full h-64 bg-[#111214] border border-white/[0.06] rounded-xl p-3 text-[12.5px] font-mono text-[#D8DBE0] placeholder:text-[#4B5563] outline-none focus:border-[#8B5CF6]/40 resize-none scrollbar-thin leading-relaxed"
                  />
                </div>
              </>
            )}

            {panel === 'hints' && (
              <>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">Talking points a strong answer hits</p>
                <ul className="space-y-3">
                  {prompt.talkingPoints.map((t) => (
                    <li key={t} className="flex gap-2.5 text-[12.5px] text-[#B4B8BF] leading-relaxed">
                      <Lightbulb size={12} className="text-[#F59E0B] shrink-0 mt-0.5" /><span>{t}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    <RenameModal req={renameReq} onCancel={() => setRenameReq(null)} onSubmit={applyRename} />
    </RenameContext.Provider>
  )
}

// ---- outer (browse + provider) --------------------------------------

export default function SystemDesignPlayground() {
  const [prompt, setPrompt] = useState<SdPrompt | null>(null)
  const [attempted, setAttempted] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DONE_KEY)
      if (raw) setAttempted(new Set(JSON.parse(raw)))
    } catch { /* private mode */ }
  }, [])

  const markAttempt = useCallback((id: string) => {
    setAttempted((prev) => {
      if (prev.has(id)) return prev
      const next = new Set([...prev, id])
      try { window.localStorage.setItem(DONE_KEY, JSON.stringify([...next])) } catch { /* quota */ }
      return next
    })
  }, [])

  const promptCats = useMemo(
    () =>
      SD_CATEGORY_ORDER
        .map((cat) => ({ cat, items: SD_PROMPTS.filter((p) => p.category === cat) }))
        .filter((g) => g.items.length),
    [],
  )

  if (prompt) {
    return (
      <ReactFlowProvider>
        <Canvas prompt={prompt} onBack={() => setPrompt(null)} onAttempt={markAttempt} onPick={setPrompt} attempted={attempted} />
      </ReactFlowProvider>
    )
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#0A0A0D] text-white overflow-y-auto scrollbar-thin">
      <header className="px-5 sm:px-8 py-3 border-b border-white/[0.06] bg-[#0D0D10]/80 backdrop-blur-md flex items-center justify-between shrink-0 sticky top-0 z-30">
        <Link href="/workspace/playground" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8A8A8A] hover:text-white transition-colors group">
          <ArrowLeft size={13} className="text-[#8B5CF6] group-hover:-translate-x-0.5 transition-transform" /> Playground Dashboard
        </Link>
      </header>

      <main className="flex-1 w-full px-5 sm:px-8 lg:px-10 py-6 sm:py-8 max-w-[1200px] mx-auto space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] font-mono">
            <Network size={11} /> Architecture Practice
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">System Design Playground</h1>
          <p className="text-sm text-[#9CA3AF] mt-1.5 max-w-2xl">
            Pick a prompt and hit Start — a drag-and-connect canvas opens with a searchable, resizable
            component palette (AWS primitives, data stores, async, observability), the requirement
            checklist, capacity-estimation prompts and a notes pane. Your board autosaves.
          </p>
        </div>

        <div className="space-y-6">
          {promptCats.map(({ cat, items }) => {
            const catDone = items.filter((p) => attempted.has(p.id)).length
            return (
              <section key={cat} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <ListTree size={12} className="text-[#8B5CF6]" />
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] font-mono">{cat}</h2>
                  <span className="text-[10px] font-mono text-[#4B5563]">{catDone}/{items.length}</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                {items.map((p) => {
                  const c = SD_DIFFICULTY_COLOR[p.difficulty]
                  const done = attempted.has(p.id)
                  return (
                    <div key={p.id} className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4 hover:border-white/[0.12] transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[13px] font-bold text-white">{p.title}</h3>
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: c.text, backgroundColor: c.bg, border: `1px solid ${c.border}` }}>{p.difficulty}</span>
                          {done && <span className="text-[9px] font-mono text-[#8B5CF6] flex items-center gap-1"><CheckCircle2 size={10} /> board saved</span>}
                        </div>
                        <p className="text-[11px] text-[#8A8A8A] mt-1 line-clamp-1">{p.brief}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.tags.map((t) => (
                            <span key={t} className="text-[8px] font-mono text-[#8A8A8A] bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setPrompt(p)}
                        className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        <Play size={12} fill="currentColor" /> Start
                      </button>
                    </div>
                  )
                })}
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
