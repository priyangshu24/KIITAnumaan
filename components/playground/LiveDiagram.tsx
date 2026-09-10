'use client'

// ---------------------------------------------------------------------------
// LiveDiagram — a self-contained animated canvas that *shows the concept
// running*, not just a static schematic. One scene per family of topics.
// Pure requestAnimationFrame loop, DPR-aware, honours reduced-motion.
// ---------------------------------------------------------------------------

import { useEffect, useRef } from 'react'

export type Scene =
  | 'descent' | 'net' | 'conv' | 'boundary' | 'histogram'
  | 'roc' | 'transformer' | 'retrieval' | 'pipeline'
  // DSA
  | 'twopointer' | 'hashmap' | 'traversal' | 'dptable' | 'binsearch' | 'greedy'
  // System design
  | 'lb' | 'queue' | 'shard'
  // SQL
  | 'join' | 'window' | 'btree'
  // Behavioural / HR
  | 'star'

/** subtopic id -> scene */
export const SCENE_FOR: Record<string, Scene> = {
  'ml-math': 'descent',
  'deep-learning': 'net',
  'cnn-rnn': 'conv',
  'classical-ml': 'boundary',
  'feature-eng': 'histogram',
  'model-eval': 'roc',
  evals: 'roc',
  'llm-eval': 'roc',
  benchmarks: 'roc',
  'llm-architecture': 'transformer',
  'llm-inference': 'transformer',
  'model-efficiency': 'transformer',
  'post-training': 'transformer',
  'fine-tuning': 'transformer',
  reasoning: 'transformer',
  rag: 'retrieval',
  'agentic-rag': 'retrieval',
  'agentic-llm': 'retrieval',
  'vector-db': 'retrieval',
  guardrails: 'pipeline',
  'llm-security': 'pipeline',
  ocr: 'pipeline',
  pipelining: 'pipeline',
  'ai-system-design': 'pipeline',

  // DSA
  'dsa-arrays': 'twopointer',
  'dsa-hashing': 'hashmap',
  'dsa-graphs': 'traversal',
  'dsa-dp': 'dptable',
  'dsa-sort': 'binsearch',
  'dsa-greedy': 'greedy',

  // System design
  'sd-fundamentals': 'lb',
  'sd-scaling': 'lb',
  'sd-classics': 'lb',
  'sd-async': 'queue',
  'sd-data': 'shard',

  // SQL
  'sql-basics': 'join',
  'sql-joins': 'join',
  'sql-windows': 'window',
  'sql-perf': 'btree',

  // Behavioural / HR
  'bh-star': 'star',
  'bh-conflict': 'star',
  'bh-ownership': 'star',
  'bh-impact': 'star',
  'hr-screen': 'star',
  'hr-fit': 'star',
  'hr-comp': 'star',
  'hr-manager': 'star',
}

export const SCENE_META: Record<Scene, { title: string; caption: string }> = {
  descent: {
    title: 'Gradient descent on a loss surface',
    caption:
      'The point follows −∇L down the contours. The x-direction collapses fast while the stretched y-direction crawls — that gap is the condition number, and a larger learning rate would overshoot the valley instead of settling.',
  },
  net: {
    title: 'Forward pass and backpropagation',
    caption:
      'Blue: activations flow input → output. Amber: gradients flow output → input during backprop. Every edge is one weight; the non-linearity at each node is what lets stacked layers fit curves rather than just one line.',
  },
  conv: {
    title: 'Convolution — a kernel sliding over an image',
    caption:
      'One small filter steps across every position (stride 1) and writes a dot-product into the feature map on the right. Sharing that one filter everywhere is why a conv layer has far fewer parameters than a dense layer, and why it is translation-invariant.',
  },
  boundary: {
    title: 'Fitting a decision boundary',
    caption:
      'The classifier rotates and shifts its separating line to cut the two classes apart; the faint band is the margin it tries to widen. Cleanly separable data converges — overlapping classes need a kernel or a non-linear model.',
  },
  histogram: {
    title: 'Feature transformation',
    caption:
      'A skewed raw feature is mapped toward a roughly normal shape (log / power / quantile transform). Symmetric, comparably-scaled features make optimisation better-conditioned and distance-based models behave.',
  },
  roc: {
    title: 'ROC curve and the threshold sweep',
    caption:
      'Lowering the decision threshold trades false-positive rate for true-positive rate; the marker walks that trade-off. Area under the curve summarises ranking quality independent of any single threshold.',
  },
  transformer: {
    title: 'Tokens streaming through transformer blocks',
    caption:
      'Tokens enter on the left, pass through N identical attention + feed-forward blocks (attention mixes information across positions), and the top of the stack produces logits for the next token — emitted one at a time when generating.',
  },
  retrieval: {
    title: 'Retrieval-augmented generation',
    caption:
      'The query is embedded into the same vector space as the documents; the k nearest chunks are pulled and concatenated into the prompt, so the model answers from fresh, specific context instead of parametric memory.',
  },
  pipeline: {
    title: 'Processing pipeline',
    caption:
      'Each request moves stage by stage; stages scale and fail independently, and queues between them absorb bursts and enable retries.',
  },
  twopointer: {
    title: 'Two pointers & the sliding window',
    caption:
      'The window [l, r] grows by advancing r and shrinks by advancing l whenever it breaks the constraint. Every index enters and leaves at most once, so the whole scan is O(n) instead of O(n²).',
  },
  hashmap: {
    title: 'Hash map — key → bucket',
    caption:
      'Each key is hashed to a bucket index in O(1); collisions share a bucket as a short chain. Lookups, inserts and frequency counts all become average-case constant time — the space-for-time trade at the heart of most "seen it before?" problems.',
  },
  traversal: {
    title: 'Graph traversal — BFS frontier',
    caption:
      'Breadth-first search expands one layer at a time from the source, so the first time it reaches a node it has found a shortest path (unweighted). A queue holds the frontier; swapping it for a stack gives depth-first search.',
  },
  dptable: {
    title: 'Dynamic programming table',
    caption:
      'Each cell is computed once from a fixed set of earlier cells (here: up, left, and up-left) and then reused. Overlapping subproblems + optimal substructure turn an exponential recursion into an O(rows·cols) fill.',
  },
  binsearch: {
    title: 'Binary search',
    caption:
      'Each step checks the midpoint and throws away the half that cannot contain the target, so the search range halves every iteration — O(log n). It needs sorted data or any monotone predicate to split on.',
  },
  greedy: {
    title: 'Greedy interval scheduling',
    caption:
      'Sort by finish time, then walk left to right taking every interval that starts after the last one you took. The exchange argument proves this earliest-finish choice is always safe — no backtracking needed.',
  },
  lb: {
    title: 'Load balancer, stateless servers, cache',
    caption:
      'A balancer spreads requests across interchangeable stateless servers so capacity scales horizontally; a cache in front absorbs the read-heavy majority, and only misses fall through to the origin.',
  },
  queue: {
    title: 'Producer / queue / consumers',
    caption:
      'A durable queue decouples producers from consumers: bursts fill the buffer instead of overwhelming a slow consumer, work can be retried or replayed, and when the buffer fills the producer feels backpressure.',
  },
  shard: {
    title: 'Sharding & replication',
    caption:
      'Rows are partitioned across shards by hashing a key, so writes and storage scale out; each shard is then replicated so a node failure loses no data. Resharding is the expensive part — consistent hashing limits how much moves.',
  },
  join: {
    title: 'Relational join',
    caption:
      'Rows from two tables are matched on a key and emitted as combined rows. INNER keeps only matches; LEFT keeps every left row and pads the missing right side with NULLs — which is how you find "rows with no match".',
  },
  window: {
    title: 'Window function — sliding frame',
    caption:
      'A window function keeps every row and computes across a frame of neighbouring rows — here a trailing average. Unlike GROUP BY it does not collapse rows, so you see each value beside its running aggregate.',
  },
  btree: {
    title: 'B-tree index lookup',
    caption:
      'An index walks root → internal → leaf, comparing at each level, so a row is found in O(log n) page reads instead of scanning the whole table. The cost is extra storage and slower writes to keep the tree balanced.',
  },
  star: {
    title: 'STAR answer structure',
    caption:
      'Situation and Task set up context briefly; Action is most of the answer and stays in first person; Result is quantified. One prepared story can answer many prompts by shifting which part you emphasise.',
  },
}

// --- small helpers ---------------------------------------------------------
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}
function dot(ctx: CanvasRenderingContext2D, x: number, y: number, c: string, rad = 3.2) {
  ctx.fillStyle = c
  ctx.beginPath()
  ctx.arc(x, y, rad, 0, Math.PI * 2)
  ctx.fill()
}
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
function mulberry(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const MONO = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
function hexRgb(hex: string) {
  const m = hex.replace('#', '')
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const int = parseInt(n, 16)
  return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`
}

// --- scenes --------------------------------------------------------------
function sDescent(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const cx = w * 0.5
  const cy = h * 0.55
  const RX = w * 0.4
  const RY = h * 0.38
  for (let i = 7; i >= 1; i--) {
    const k = i / 7
    ctx.strokeStyle = `rgba(196,181,253,${0.05 + (0.07 * (8 - i)) / 7})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(cx, cy, RX * k, RY * k, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  let x = -0.92
  let y = 0.86
  const lr = 0.016
  const pts: [number, number][] = [[x, y]]
  for (let i = 0; i < 170; i++) {
    x -= lr * 6 * x
    y -= lr * 0.8 * y
    pts.push([x, y])
  }
  const toPx = (p: [number, number]): [number, number] => [cx + p[0] * RX, cy + p[1] * RY]
  const period = 4.6
  const prog = (t % period) / period
  const idx = Math.floor(prog * (pts.length - 1))
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= idx; i++) {
    const [px, py] = toPx(pts[i])
    if (i) ctx.lineTo(px, py)
    else ctx.moveTo(px, py)
  }
  ctx.stroke()
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.35
  dot(ctx, ...toPx(pts[idx]), accent, 7)
  ctx.globalAlpha = 1
  dot(ctx, ...toPx(pts[idx]), '#fff', 4)
  dot(ctx, cx, cy, accent, 3)
  ctx.font = MONO
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText('θ ← θ − η·∇L(θ)', 14, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText(`minimum`, cx + 8, cy + 3)
  ctx.fillText(`step ${idx} / ${pts.length - 1}`, 14, h - 14)
}

function sNet(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const layers = [4, 6, 6, 3]
  const pad = w * 0.13
  const xs = layers.map((_, i) => pad + ((w - 2 * pad) * i) / (layers.length - 1))
  const ny = (n: number, i: number) => {
    const gap = Math.min((h * 0.68) / (n - 1), 32)
    return h / 2 - (gap * (n - 1)) / 2 + gap * i
  }
  for (let l = 0; l < layers.length - 1; l++)
    for (let a = 0; a < layers[l]; a++)
      for (let b = 0; b < layers[l + 1]; b++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(xs[l], ny(layers[l], a))
        ctx.lineTo(xs[l + 1], ny(layers[l + 1], b))
        ctx.stroke()
      }
  const cycle = 4.6
  const ph = (t % cycle) / cycle
  const fwd = ph < 0.5
  const p = fwd ? ph / 0.5 : 1 - (ph - 0.5) / 0.5
  const col = fwd ? '#60A5FA' : '#FBBF24'
  const seg = p * (layers.length - 1)
  const l = Math.min(Math.floor(seg), layers.length - 2)
  const local = seg - l
  for (let a = 0; a < layers[l]; a++)
    for (let b = 0; b < layers[l + 1]; b++) {
      const x1 = xs[l]
      const y1 = ny(layers[l], a)
      const x2 = xs[l + 1]
      const y2 = ny(layers[l + 1], b)
      const mx = x1 + (x2 - x1) * local
      const my = y1 + (y2 - y1) * local
      ctx.strokeStyle = col
      ctx.globalAlpha = 0.22
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(mx, my)
      ctx.stroke()
      ctx.globalAlpha = 0.9
      dot(ctx, mx, my, col, 2.2)
      ctx.globalAlpha = 1
    }
  for (let li = 0; li < layers.length; li++)
    for (let i = 0; i < layers[li]; i++) {
      const on = fwd ? li <= seg : li >= seg
      dot(ctx, xs[li], ny(layers[li], i), on ? col : 'rgba(255,255,255,0.18)', li === 0 || li === layers.length - 1 ? 5 : 4)
    }
  ctx.font = MONO
  ctx.fillStyle = col
  ctx.fillText(fwd ? 'forward pass  ·  activations →' : '← backward pass  ·  gradients', 14, h - 14)
}

function sConv(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const N = 8
  const K = 3
  const M = N - K + 1
  const cell = Math.min((w * 0.42) / N, (h * 0.6) / N)
  const gx = w * 0.06
  const gy = (h - cell * N) / 2
  const bright = (r: number, c: number) => {
    const v = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453
    return v - Math.floor(v)
  }
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      ctx.fillStyle = `rgba(96,165,250,${0.1 + 0.5 * bright(r, c)})`
      ctx.fillRect(gx + c * cell, gy + r * cell, cell - 1, cell - 1)
    }
  const steps = M * M
  const period = 6
  const k = Math.floor(((t % period) / period) * steps)
  const kr = Math.floor(k / M)
  const kc = k % M
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(gx + kc * cell, gy + kr * cell, cell * K, cell * K)
  const fmc = Math.min((w * 0.3) / M, (h * 0.46) / M)
  const fx = w * 0.62
  const fy = (h - fmc * M) / 2
  for (let r = 0; r < M; r++)
    for (let c = 0; c < M; c++) {
      if (r * M + c <= k) {
        let s = 0
        for (let i = 0; i < K; i++) for (let j = 0; j < K; j++) s += bright(r + i, c + j)
        ctx.fillStyle = `rgba(52,211,153,${0.15 + 0.6 * (s / 9)})`
        ctx.fillRect(fx + c * fmc, fy + r * fmc, fmc - 1, fmc - 1)
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'
      ctx.lineWidth = 1
      ctx.strokeRect(fx + c * fmc, fy + r * fmc, fmc - 1, fmc - 1)
    }
  const ay = h / 2
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(gx + N * cell + 8, ay)
  ctx.lineTo(fx - 10, ay)
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.beginPath()
  ctx.moveTo(fx - 8, ay)
  ctx.lineTo(fx - 16, ay - 5)
  ctx.lineTo(fx - 16, ay + 5)
  ctx.fill()
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('kernel · stride 1', gx, Math.max(gy - 8, 12))
  ctx.fillStyle = '#34D399'
  ctx.fillText('feature map', fx, Math.max(fy - 8, 12))
}

function sBoundary(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const cx = w / 2
  const cy = h / 2
  const rnd = mulberry(42)
  const A: [number, number][] = []
  const B: [number, number][] = []
  for (let i = 0; i < 24; i++) A.push([cx - w * 0.17 + (rnd() - 0.5) * w * 0.22, cy - h * 0.1 + (rnd() - 0.5) * h * 0.44])
  for (let i = 0; i < 24; i++) B.push([cx + w * 0.17 + (rnd() - 0.5) * w * 0.22, cy + h * 0.1 + (rnd() - 0.5) * h * 0.44])
  const period = 5.2
  const p = easeInOut((t % period) / period)
  const ang = -0.98 + p * 0.82
  const bias = (0.5 - p) * w * 0.12
  const dx = Math.cos(ang)
  const dy = Math.sin(ang)
  const L = Math.max(w, h)
  const x1 = cx + bias - dx * L
  const y1 = cy - dy * L
  const x2 = cx + bias + dx * L
  const y2 = cy + dy * L
  const nx = -dy
  const nyy = dx
  for (const s of [-1, 1]) {
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x1 + nx * 22 * s, y1 + nyy * 22 * s)
    ctx.lineTo(x2 + nx * 22 * s, y2 + nyy * 22 * s)
    ctx.stroke()
  }
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  const side = (px: number, py: number) => (px - (cx + bias)) * nyy - (py - cy) * nx
  let correct = 0
  for (const [px, py] of A) {
    const ok = side(px, py) < 0
    if (ok) correct++
    dot(ctx, px, py, ok ? '#60A5FA' : '#FB7185')
  }
  for (const [px, py] of B) {
    const ok = side(px, py) > 0
    if (ok) correct++
    dot(ctx, px, py, ok ? '#34D399' : '#FB7185')
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('fitting decision boundary', 14, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(`separated: ${correct} / ${A.length + B.length}`, 14, h - 14)
}

function sHistogram(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const n = 18
  const nm = (a: number[]) => {
    const m = Math.max(...a)
    return a.map((v) => v / m)
  }
  const s = nm(Array.from({ length: n }, (_, i) => Math.exp(-i * 0.28)))
  const nn = nm(
    Array.from({ length: n }, (_, i) => {
      const x = (i - (n - 1) / 2) / 3.4
      return Math.exp(-x * x)
    }),
  )
  const period = 4.8
  const p = easeInOut(Math.sin((t / period) * Math.PI * 2) * 0.5 + 0.5)
  const bw = (w * 0.82) / n
  const x0 = w * 0.09
  const baseY = h * 0.8
  const maxH = h * 0.56
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0, baseY)
  ctx.lineTo(x0 + bw * n, baseY)
  ctx.stroke()
  for (let i = 0; i < n; i++) {
    const v = s[i] + (nn[i] - s[i]) * p
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.22 + 0.55 * v
    ctx.fillRect(x0 + i * bw + 1, baseY - v * maxH, bw - 2, v * maxH)
    ctx.globalAlpha = 1
  }
  const sx = x0 + bw * n * ((t % period) / period)
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(sx, baseY - maxH)
  ctx.lineTo(sx, baseY)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText(p < 0.5 ? 'raw feature  ·  skewed' : 'after transform  ·  ≈ normal', 14, 20)
}

function sRoc(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const pad = 40
  const x0 = pad
  const y0 = h - pad
  const x1 = w - pad * 0.6
  const y1 = pad * 0.7
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y0)
  ctx.moveTo(x0, y0)
  ctx.lineTo(x0, y1)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.setLineDash([])
  const KK = 0.34
  const X = (f: number) => x0 + (x1 - x0) * f
  const Y = (tp: number) => y0 + (y1 - y0) * tp
  const period = 5
  const p = (t % period) / period
  ctx.beginPath()
  ctx.moveTo(X(0), Y(0))
  for (let i = 0; i <= 100; i++) {
    const f = (i / 100) * p
    ctx.lineTo(X(f), Y(Math.pow(f, KK)))
  }
  ctx.lineTo(X(p), Y(0))
  ctx.closePath()
  ctx.fillStyle = accent
  ctx.globalAlpha = 0.12
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= 200; i++) {
    const f = i / 200
    if (i) ctx.lineTo(X(f), Y(Math.pow(f, KK)))
    else ctx.moveTo(X(f), Y(Math.pow(f, KK)))
  }
  ctx.stroke()
  dot(ctx, X(p), Y(Math.pow(p, KK)), '#fff', 4)
  ctx.font = MONO
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('FPR', x1 - 24, y0 + 16)
  ctx.save()
  ctx.translate(x0 - 16, y1 + 30)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('TPR', 0, 0)
  ctx.restore()
  ctx.fillStyle = accent
  ctx.fillText(`AUC ≈ ${(1 / (1 + KK)).toFixed(2)}`, x0 + 8, y1 + 4)
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText('threshold ↓  ·  sweeping operating point', x0 + 8, 18)
}

function sTransformer(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const nBlocks = 4
  const bx = w * 0.3
  const bw = w * 0.4
  const bh = Math.min(26, h * 0.12)
  const gap = (h * 0.6) / nBlocks
  const top = h * 0.17
  for (let i = 0; i < nBlocks; i++) {
    const y = top + i * gap
    rr(ctx, bx, y, bw, bh, 6)
    ctx.fillStyle = 'rgba(192,132,252,0.06)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(192,132,252,0.35)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillText(`attn + FFN  #${i + 1}`, bx + 8, y + bh / 2 + 3)
  }
  const period = 3.6
  const p = (t % period) / period
  const toks = 5
  for (let k = 0; k < toks; k++) {
    const tp = (p + k / toks) % 1
    const yy = h * 0.9 - tp * (h * 0.9 - top)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.85
    rr(ctx, bx - 36, yy - 7, 20, 14, 3)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  const ab = Math.floor(p * nBlocks) % nBlocks
  const ay = top + ab * gap + bh / 2
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(192,132,252,${0.1 + 0.28 * Math.abs(Math.sin(t * 3 + i))})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(bx + 10 + i * 8, ay)
    ctx.lineTo(bx + bw - 10 - i * 6, ay)
    ctx.stroke()
  }
  ctx.fillStyle = '#34D399'
  rr(ctx, bx + bw + 16, top - 5 + Math.sin(t * 2) * 2, 22, 14, 3)
  ctx.fill()
  if (Math.floor(t * 2) % 2) ctx.fillRect(bx + bw + 42, top - 5, 2, 14)
  ctx.font = MONO
  ctx.fillStyle = '#C084FC'
  ctx.fillText('tokens → N blocks → next-token logits', 14, h - 14)
}

function sRetrieval(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const rnd = mulberry(7)
  const cxC = w * 0.4
  const cyC = h * 0.5
  const R = Math.min(w * 0.22, h * 0.36)
  const pts: [number, number][] = []
  for (let i = 0; i < 44; i++) {
    const a = rnd() * 7
    const r = Math.sqrt(rnd()) * R
    pts.push([cxC + Math.cos(a) * r, cyC + Math.sin(a) * r])
  }
  const q: [number, number] = [cxC + Math.cos(t * 0.6) * R * 0.4, cyC + Math.sin(t * 0.7) * R * 0.3]
  const withD = pts
    .map((p) => ({ p, d: Math.hypot(p[0] - q[0], p[1] - q[1]) }))
    .sort((a, b) => a.d - b.d)
  const K = 4
  for (const { p } of withD) dot(ctx, p[0], p[1], 'rgba(255,255,255,0.22)')
  for (let i = 0; i < K; i++) {
    const p = withD[i].p
    ctx.strokeStyle = accent
    ctx.globalAlpha = 0.35 + 0.3 * Math.abs(Math.sin(t * 3 + i))
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(q[0], q[1])
    ctx.lineTo(p[0], p[1])
    ctx.stroke()
    ctx.globalAlpha = 1
    dot(ctx, p[0], p[1], accent)
  }
  dot(ctx, q[0], q[1], '#FBBF24', 4)
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillStyle = '#FBBF24'
  ctx.fillText('query', q[0] + 7, q[1] - 7)
  const px = w * 0.72
  const pw = w * 0.24
  const py = h * 0.24
  const phh = h * 0.52
  rr(ctx, px, py, pw, phh, 8)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText('prompt', px + 8, py + 14)
  const period = 3.2
  for (let i = 0; i < K; i++) {
    const tp = (t / period + i / K) % 1
    const prog = Math.min(tp * 1.4, 1)
    const yy = py + 26 + i * ((phh - 32) / K)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.15 + 0.5 * prog
    rr(ctx, px - 40 + easeInOut(prog) * 48, yy, pw - 16, (phh - 32) / K - 6, 3)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('embed · k-NN retrieve · stuff context', 14, h - 14)
}

function sPipeline(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const stages = ['input', 'process', 'transform', 'output']
  const n = stages.length
  const bw = w * 0.16
  const gap = (w - bw * n) / (n + 1)
  const y = h * 0.5 - 16
  const cx: number[] = []
  for (let i = 0; i < n; i++) {
    const x = gap + (bw + gap) * i
    cx.push(x + bw / 2)
    rr(ctx, x, y, bw, 32, 6)
    ctx.strokeStyle = 'rgba(255,255,255,0.14)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.font = '10px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(stages[i], x + bw / 2, y + 20)
    ctx.textAlign = 'left'
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  for (let i = 0; i < n - 1; i++) {
    ctx.beginPath()
    ctx.moveTo(cx[i] + bw / 2, y + 16)
    ctx.lineTo(cx[i + 1] - bw / 2, y + 16)
    ctx.stroke()
  }
  const period = 3.4
  const count = 4
  for (let k = 0; k < count; k++) {
    const tp = (t / period + k / count) % 1
    const seg = tp * (n - 1)
    const i = Math.min(Math.floor(seg), n - 2)
    const x = cx[i] + (cx[i + 1] - cx[i]) * easeInOut(seg - i)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.3
    dot(ctx, x, y + 16, accent, 8)
    ctx.globalAlpha = 1
    dot(ctx, x, y + 16, accent, 4)
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('data flows stage → stage', 14, h - 14)
}

// ---- DSA -----------------------------------------------------------------
function sTwoPointer(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const N = 12
  const rnd = mulberry(9)
  const vals = Array.from({ length: N }, () => 0.22 + rnd() * 0.78)
  const pad = w * 0.06
  const bw = (w - 2 * pad) / N
  const baseY = h * 0.64
  const maxH = h * 0.4
  const period = 6
  const p = (t % period) / period
  const r = Math.min(N - 1, Math.floor(p * N))
  const l = Math.max(0, r - 3)
  for (let i = 0; i < N; i++) {
    const inWin = i >= l && i <= r
    ctx.fillStyle = inWin ? accent : 'rgba(255,255,255,0.14)'
    ctx.globalAlpha = inWin ? 0.85 : 1
    const bh = vals[i] * maxH
    ctx.fillRect(pad + i * bw + 1, baseY - bh, bw - 2, bh)
    ctx.globalAlpha = 1
  }
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(pad + l * bw, baseY - maxH - 6, (r - l + 1) * bw, maxH + 12)
  ctx.font = MONO
  ctx.fillStyle = '#60A5FA'
  ctx.fillText('l', pad + l * bw + bw / 2 - 3, baseY + 18)
  ctx.fillStyle = '#FBBF24'
  ctx.fillText('r', pad + r * bw + bw / 2 - 3, baseY + 18)
  let s = 0
  for (let i = l; i <= r; i++) s += vals[i]
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText(`window sum = ${s.toFixed(2)}`, pad, 20)
  ctx.fillStyle = accent
  ctx.fillText('expand r · shrink l while invalid · each index O(1) amortised', pad, h - 14)
}

function sHashMap(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const B = 6
  const bx = w * 0.5
  const bw = w * 0.42
  const bh = (h * 0.78) / B
  const by = h * 0.1
  for (let i = 0; i < B; i++) {
    const y = by + i * bh
    rr(ctx, bx, y + 2, bw, bh - 4, 4)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillText(`[${i}]`, bx + 6, y + bh / 2 + 3)
    const cnt = 1 + Math.floor(mulberry(7 + i)() * 3)
    for (let c = 0; c < cnt; c++) {
      ctx.fillStyle = 'rgba(96,165,250,0.45)'
      rr(ctx, bx + 34 + c * 15, y + bh / 2 - 5, 11, 10, 2)
      ctx.fill()
    }
  }
  const hx = w * 0.26
  const hy = h * 0.42
  const hw = w * 0.15
  const hh = h * 0.16
  rr(ctx, hx, hy, hw, hh, 6)
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = accent
  ctx.font = MONO
  ctx.fillText('hash()', hx + 12, hy + hh / 2 + 4)
  const period = 2.4
  const keys = 4
  const cyc = Math.floor(t / period)
  for (let k = 0; k < keys; k++) {
    const tp = (t / period + k / keys) % 1
    const target = (k * 2 + cyc) % B
    if (tp < 0.45) {
      const x = w * 0.03 + (tp / 0.45) * (hx - w * 0.03)
      ctx.fillStyle = '#60A5FA'
      rr(ctx, x - 10, hy + hh / 2 - 7, 20, 14, 3)
      ctx.fill()
    } else {
      const q = (tp - 0.45) / 0.55
      const ty = by + target * bh + bh / 2
      const x = hx + hw + q * (bx - (hx + hw))
      const y = hy + hh / 2 + q * (ty - (hy + hh / 2))
      dot(ctx, x, y, accent, 4)
    }
  }
  ctx.fillStyle = accent
  ctx.font = MONO
  ctx.fillText('key → hash → bucket · O(1) average, chains on collision', w * 0.03, h - 14)
}

function sTraversal(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const rnd = mulberry(3)
  const NODES = 8
  const pos: [number, number][] = []
  for (let i = 0; i < NODES; i++) pos.push([w * (0.16 + 0.68 * rnd()), h * (0.16 + 0.62 * rnd())])
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [4, 6], [5, 7], [6, 7], [1, 4],
  ]
  const adj: number[][] = Array.from({ length: NODES }, () => [])
  for (const [a, b] of edges) {
    adj[a].push(b)
    adj[b].push(a)
  }
  const layer = new Array<number>(NODES).fill(-1)
  layer[0] = 0
  const q: number[] = [0]
  while (q.length) {
    const n = q.shift() as number
    for (const m of adj[n]) if (layer[m] < 0) {
      layer[m] = layer[n] + 1
      q.push(m)
    }
  }
  const maxL = Math.max(...layer)
  const period = 4.5
  const front = ((t % period) / period) * (maxL + 1)
  for (const [a, b] of edges) {
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(pos[a][0], pos[a][1])
    ctx.lineTo(pos[b][0], pos[b][1])
    ctx.stroke()
    const hi = Math.max(layer[a], layer[b])
    if (hi <= front && hi > front - 1) {
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(pos[a][0], pos[a][1])
      ctx.lineTo(pos[b][0], pos[b][1])
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }
  for (let i = 0; i < NODES; i++) {
    const visited = layer[i] <= front
    const onFront = visited && layer[i] > front - 1
    const col = i === 0 ? '#FBBF24' : visited ? accent : 'rgba(255,255,255,0.18)'
    dot(ctx, pos[i][0], pos[i][1], col, onFront ? 7 : 5)
    if (onFront) {
      ctx.strokeStyle = accent
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.arc(pos[i][0], pos[i][1], 11, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }
  ctx.font = MONO
  ctx.fillStyle = '#FBBF24'
  ctx.fillText('source', pos[0][0] + 9, pos[0][1] - 9)
  ctx.fillStyle = accent
  ctx.fillText('BFS · frontier expands one layer at a time from the source', w * 0.04, h - 14)
}

function sDpTable(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const R = 6
  const C = 8
  const cw = Math.min((w * 0.9) / C, (h * 0.74) / R)
  const gx = (w - cw * C) / 2
  const gy = (h - cw * R) / 2 + 6
  const rgb = hexRgb(accent)
  const total = R * C
  const period = 6
  const k = Math.floor(((t % period) / period) * total)
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const idx = r * C + c
      const done = idx < k
      const cur = idx === k
      ctx.fillStyle = done ? `rgba(${rgb},${0.12 + 0.5 * ((r + c) / (R + C))})` : 'rgba(255,255,255,0.03)'
      ctx.fillRect(gx + c * cw, gy + r * cw, cw - 2, cw - 2)
      ctx.strokeStyle = cur ? accent : 'rgba(255,255,255,0.1)'
      ctx.lineWidth = cur ? 2 : 1
      ctx.strokeRect(gx + c * cw, gy + r * cw, cw - 2, cw - 2)
    }
  const cr = Math.floor(k / C)
  const cc = k % C
  const cx0 = gx + cc * cw + cw / 2
  const cy0 = gy + cr * cw + cw / 2
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.5
  for (const [dr, dc] of [[-1, 0], [0, -1], [-1, -1]]) {
    const nr = cr + dr
    const nc = cc + dc
    if (nr >= 0 && nc >= 0) {
      ctx.beginPath()
      ctx.moveTo(gx + nc * cw + cw / 2, gy + nr * cw + cw / 2)
      ctx.lineTo(cx0, cy0)
      ctx.stroke()
    }
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('dp[i][j] from dp[i-1][j], dp[i][j-1], dp[i-1][j-1]', gx, Math.max(gy - 8, 12))
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText('compute each cell once · reuse — O(R·C)', gx, h - 14)
}

function sBinSearch(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const N = 20
  const pad = w * 0.05
  const bw = (w - 2 * pad) / N
  const baseY = h * 0.66
  const maxH = h * 0.42
  const targetIdx = 13
  const period = 5
  const steps = 5
  const step = Math.floor(((t % period) / period) * steps)
  let lo = 0
  let hi = N - 1
  for (let s = 0; s < step; s++) {
    const m = (lo + hi) >> 1
    if (m < targetIdx) lo = m + 1
    else if (m > targetIdx) hi = m - 1
    else break
  }
  const mid = (lo + hi) >> 1
  for (let i = 0; i < N; i++) {
    const inRange = i >= lo && i <= hi
    ctx.fillStyle =
      i === targetIdx ? '#34D399' : i === mid ? '#FBBF24' : inRange ? accent : 'rgba(255,255,255,0.12)'
    ctx.globalAlpha = inRange || i === targetIdx ? 0.9 : 1
    const bh = ((i + 1) / N) * maxH
    ctx.fillRect(pad + i * bw + 1, baseY - bh, bw - 2, bh)
    ctx.globalAlpha = 1
  }
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(pad + lo * bw, baseY - maxH - 4, (hi - lo + 1) * bw, maxH + 8)
  ctx.font = MONO
  ctx.fillStyle = '#FBBF24'
  ctx.fillText('mid', pad + mid * bw, baseY + 16)
  ctx.fillStyle = '#34D399'
  ctx.fillText('target', pad + targetIdx * bw - 8, Math.max(baseY - maxH - 12, 10))
  ctx.fillStyle = accent
  ctx.fillText('discard half each step → O(log n)', pad, 20)
}

function sGreedy(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const pad = w * 0.06
  const rnd = mulberry(15)
  const M = 7
  const iv: [number, number][] = []
  for (let i = 0; i < M; i++) {
    const s = rnd() * 0.68
    const e = Math.min(1, s + 0.12 + rnd() * 0.28)
    iv.push([s, e])
  }
  iv.sort((a, b) => a[1] - b[1])
  const period = 5.5
  const k = Math.floor(((t % period) / period) * (M + 1))
  let lastEnd = -1
  const chosen = new Set<number>()
  for (let i = 0; i < Math.min(k, M); i++) {
    if (iv[i][0] >= lastEnd) {
      chosen.add(i)
      lastEnd = iv[i][1]
    }
  }
  const X = (u: number) => pad + u * (w - 2 * pad)
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h * 0.82)
  ctx.lineTo(w - pad, h * 0.82)
  ctx.stroke()
  const rowH = (h * 0.6) / M
  const y0 = h * 0.12
  for (let i = 0; i < M; i++) {
    const [s, e] = iv[i]
    const active = i < k
    const on = chosen.has(i)
    ctx.fillStyle = !active ? 'rgba(255,255,255,0.1)' : on ? '#34D399' : '#FB7185'
    ctx.globalAlpha = !active ? 0.5 : on ? 0.85 : 0.4
    rr(ctx, X(s), y0 + i * rowH, X(e) - X(s), rowH - 6, 3)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('sort by finish time · take each that starts after the last taken', pad, h - 12)
}

// ---- System design -----------------------------------------------------
function sLb(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const lbx = w * 0.3
  const lby = h * 0.5
  const S = 4
  const sx = w * 0.62
  const syFor = (i: number) => h * 0.16 + i * ((h * 0.68) / (S - 1))
  rr(ctx, w * 0.05, lby - 14, w * 0.12, 28, 5)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillText('clients', w * 0.06, lby + 4)
  rr(ctx, lbx, lby - 20, w * 0.12, 40, 6)
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = accent
  ctx.fillText('LB', lbx + w * 0.05, lby + 4)
  for (let i = 0; i < S; i++) {
    rr(ctx, sx, syFor(i) - 13, w * 0.12, 26, 5)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillText(`srv ${i + 1}`, sx + 8, syFor(i) + 3)
  }
  const period = 2.2
  const reqs = 5
  const cyc = Math.floor(t / period)
  for (let k = 0; k < reqs; k++) {
    const tp = (t / period + k / reqs) % 1
    const target = (k + cyc) % S
    if (tp < 0.4) {
      dot(ctx, w * 0.17 + (tp / 0.4) * (lbx - w * 0.17), lby, accent, 4)
    } else {
      const qq = (tp - 0.4) / 0.6
      const x = lbx + w * 0.12 + qq * (sx - (lbx + w * 0.12))
      const y = lby + qq * (syFor(target) - lby)
      dot(ctx, x, y, accent, 4)
    }
  }
  const hit = Math.floor(t * 1.3) % 3 !== 0
  ctx.font = MONO
  ctx.fillStyle = hit ? '#34D399' : '#FB7185'
  ctx.fillText(hit ? 'cache HIT' : 'cache MISS → origin', lbx, Math.max(lby - 32, 12))
  ctx.fillStyle = accent
  ctx.fillText('stateless servers · balancer spreads load · cache absorbs reads', w * 0.05, h - 12)
}

function sQueueScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const qx = w * 0.28
  const qw = w * 0.44
  const qy = h * 0.42
  const qh = h * 0.16
  const SLOTS = 10
  const slotW = qw / SLOTS
  rr(ctx, qx, qy, qw, qh, 6)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.stroke()
  const fill = Math.floor((Math.sin(t * 0.8) * 0.5 + 0.5) * SLOTS)
  for (let i = 0; i < SLOTS; i++) {
    if (i < fill) {
      ctx.fillStyle = accent
      ctx.globalAlpha = 0.25 + 0.5 * (1 - i / SLOTS)
      ctx.fillRect(qx + i * slotW + 1, qy + 2, slotW - 2, qh - 4)
      ctx.globalAlpha = 1
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillText('producer', qx - w * 0.02, qy - 8)
  ctx.fillText('consumers', qx + qw - w * 0.06, qy - 8)
  dot(ctx, qx - w * 0.12 + ((t * 1.4) % 1) * (w * 0.12), qy + qh / 2, '#60A5FA', 4)
  for (let c = 0; c < 2; c++) {
    const co = ((t * 1.1) + c * 0.5) % 1
    dot(ctx, qx + qw + co * (w * 0.12), qy + qh / 2 - 10 + c * 20, '#34D399', 4)
  }
  ctx.font = MONO
  ctx.fillStyle = fill >= SLOTS - 1 ? '#FB7185' : accent
  ctx.fillText(
    fill >= SLOTS - 1 ? 'buffer full → producer applies backpressure' : 'queue decouples producer & consumer rates',
    qx - w * 0.02,
    h - 12,
  )
}

function sShard(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const K = 3
  const sw = w * 0.2
  const gap = (w - K * sw) / (K + 1)
  const sy = h * 0.32
  const sh = h * 0.34
  for (let i = 0; i < K; i++) {
    const x = gap + (sw + gap) * i
    for (let r = 2; r >= 0; r--) {
      rr(ctx, x + r * 5, sy + r * 5, sw, sh, 6)
      ctx.fillStyle = r === 0 ? 'rgba(20,20,24,0.95)' : 'rgba(20,20,24,0.5)'
      ctx.fill()
      ctx.strokeStyle = r === 0 ? accent : 'rgba(255,255,255,0.12)'
      ctx.lineWidth = r === 0 ? 1.5 : 1
      ctx.stroke()
    }
    ctx.fillStyle = accent
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillText(`shard ${i}`, x + 10, sy + sh / 2)
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillText('+2 replicas', x + 10, sy + sh / 2 + 14)
  }
  const period = 2
  const rows = 4
  const cyc = Math.floor(t / period)
  for (let k = 0; k < rows; k++) {
    const tp = (t / period + k / rows) % 1
    const target = (k + cyc) % K
    const tx = gap + (sw + gap) * target + sw / 2
    const x = w * 0.5 + (tx - w * 0.5) * easeInOut(tp)
    const y = h * 0.1 + easeInOut(tp) * (sy - h * 0.1)
    ctx.fillStyle = accent
    rr(ctx, x - 12, y - 6, 24, 12, 3)
    ctx.fill()
  }
  ctx.font = MONO
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('hash(key) → shard', w * 0.42, Math.max(h * 0.08, 12))
  ctx.fillStyle = accent
  ctx.fillText('partition by key · replicate each shard for durability', gap, h - 12)
}

// ---- SQL --------------------------------------------------------------
function sJoin(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const N = 5
  const lx = w * 0.06
  const rx = w * 0.42
  const ox = w * 0.72
  const rw = w * 0.2
  const rh = h * 0.12
  const gap = h * 0.04
  const y0 = h * 0.16
  const rightKey = [2, 0, 3, 1, 4]
  for (let i = 0; i < N; i++) {
    rr(ctx, lx, y0 + i * (rh + gap), rw, rh, 4)
    ctx.strokeStyle = 'rgba(96,165,250,0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(96,165,250,0.9)'
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillText(`id ${i}`, lx + 8, y0 + i * (rh + gap) + rh / 2 + 3)
    rr(ctx, rx, y0 + i * (rh + gap), rw, rh, 4)
    ctx.strokeStyle = 'rgba(52,211,153,0.4)'
    ctx.stroke()
    ctx.fillStyle = 'rgba(52,211,153,0.9)'
    ctx.fillText(`fk ${rightKey[i]}`, rx + 8, y0 + i * (rh + gap) + rh / 2 + 3)
  }
  const period = 5
  const shown = Math.floor(((t % period) / period) * N)
  let outRow = 0
  for (let i = 0; i < N; i++) {
    const j = rightKey.indexOf(i)
    if (j < 0 || i > shown) continue
    const ly = y0 + i * (rh + gap) + rh / 2
    const ry = y0 + j * (rh + gap) + rh / 2
    ctx.strokeStyle = accent
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(lx + rw, ly)
    ctx.bezierCurveTo((lx + rw + rx) / 2, ly, (lx + rw + rx) / 2, ry, rx, ry)
    ctx.stroke()
    ctx.globalAlpha = 1
    rr(ctx, ox, y0 + outRow * (rh + gap), rw, rh, 4)
    ctx.fillStyle = accent
    ctx.globalAlpha = 0.15
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.strokeStyle = accent
    ctx.stroke()
    ctx.fillStyle = accent
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillText(`${i} · ${i}`, ox + 8, y0 + outRow * (rh + gap) + rh / 2 + 3)
    outRow++
  }
  ctx.font = MONO
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText('left', lx, Math.max(y0 - 8, 10))
  ctx.fillText('right', rx, Math.max(y0 - 8, 10))
  ctx.fillText('INNER JOIN', ox, Math.max(y0 - 8, 10))
  ctx.fillStyle = accent
  ctx.fillText('match on key · emit combined rows', lx, h - 12)
}

function sWindowFn(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const N = 16
  const F = 4
  const rnd = mulberry(19)
  const vals = Array.from({ length: N }, () => 0.2 + rnd() * 0.8)
  const pad = w * 0.06
  const bw = (w - 2 * pad) / N
  const baseY = h * 0.72
  const maxH = h * 0.32
  const period = 6
  const end = Math.min(N - 1, Math.floor(((t % period) / period) * N))
  const start = Math.max(0, end - F + 1)
  for (let i = 0; i < N; i++) {
    const inF = i >= start && i <= end
    ctx.fillStyle = inF ? accent : 'rgba(255,255,255,0.14)'
    ctx.globalAlpha = inF ? 0.85 : 1
    ctx.fillRect(pad + i * bw + 1, baseY - vals[i] * maxH, bw - 2, vals[i] * maxH)
    ctx.globalAlpha = 1
  }
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(pad + start * bw, baseY - maxH - 6, (end - start + 1) * bw, maxH + 12)
  ctx.strokeStyle = '#FBBF24'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i <= end; i++) {
    const s = Math.max(0, i - F + 1)
    let sum = 0
    for (let j = s; j <= i; j++) sum += vals[j]
    const avg = sum / (i - s + 1)
    const x = pad + i * bw + bw / 2
    const y = h * 0.12 + (1 - avg) * h * 0.22
    if (i) ctx.lineTo(x, y)
    else ctx.moveTo(x, y)
  }
  ctx.stroke()
  ctx.font = MONO
  ctx.fillStyle = '#FBBF24'
  ctx.fillText('moving average over the frame', pad, 18)
  ctx.fillStyle = accent
  ctx.fillText('OVER (ORDER BY day ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)', pad, h - 12)
}

function sBTree(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const rootY = h * 0.16
  const midY = h * 0.46
  const leafY = h * 0.78
  const rx = w * 0.5
  const mids = [w * 0.22, w * 0.5, w * 0.78]
  const leavesPerMid = 3
  const period = 4.5
  const p = (t % period) / period
  const cyc = Math.floor(t / period)
  const targetMid = cyc % 3
  const targetLeaf = (cyc * 2) % leavesPerMid
  rr(ctx, rx - w * 0.09, rootY - 12, w * 0.18, 24, 5)
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '10px ui-monospace, monospace'
  ctx.fillText('root', rx - 12, rootY + 3)
  for (let m = 0; m < 3; m++) {
    const active = p > 0.33 && m === targetMid
    ctx.strokeStyle = p > 0 && m === targetMid ? accent : 'rgba(255,255,255,0.12)'
    ctx.lineWidth = active ? 2 : 1
    ctx.beginPath()
    ctx.moveTo(rx, rootY + 12)
    ctx.lineTo(mids[m], midY - 12)
    ctx.stroke()
    rr(ctx, mids[m] - w * 0.07, midY - 12, w * 0.14, 24, 5)
    ctx.strokeStyle = m === targetMid && p > 0.15 ? accent : 'rgba(255,255,255,0.18)'
    ctx.stroke()
    for (let l = 0; l < leavesPerMid; l++) {
      const lx = mids[m] - w * 0.06 + l * (w * 0.06)
      const activeLeaf = p > 0.66 && m === targetMid && l === targetLeaf
      ctx.strokeStyle = m === targetMid && p > 0.5 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(mids[m], midY + 12)
      ctx.lineTo(lx, leafY - 8)
      ctx.stroke()
      ctx.fillStyle = activeLeaf ? '#34D399' : 'rgba(255,255,255,0.15)'
      rr(ctx, lx - 8, leafY - 8, 16, 16, 3)
      ctx.fill()
    }
  }
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('B-tree index: root → internal → leaf  ·  O(log n) vs full scan', w * 0.04, h - 12)
}

// ---- Behavioural / HR ------------------------------------------------
function sStar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: string) {
  const segs: [string, number, string][] = [
    ['Situation', 0.2, '#60A5FA'],
    ['Task', 0.15, '#C084FC'],
    ['Action', 0.45, '#34D399'],
    ['Result', 0.2, '#FBBF24'],
  ]
  const pad = w * 0.08
  const barW = w - 2 * pad
  const barY = h * 0.44
  const barH = h * 0.14
  const period = 6
  const p = (t % period) / period
  let x = pad
  for (const [label, frac, col] of segs) {
    const segW = barW * frac
    const fillFrac = Math.max(0, Math.min(1, (p - (x - pad) / barW) / frac))
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    rr(ctx, x, barY, segW - 3, barH, 4)
    ctx.fill()
    ctx.fillStyle = col
    ctx.globalAlpha = 0.8
    rr(ctx, x, barY, (segW - 3) * fillFrac, barH, 4)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.font = '10px ui-monospace, monospace'
    ctx.fillStyle = fillFrac > 0 ? col : 'rgba(255,255,255,0.3)'
    ctx.fillText(label, x + 4, barY - 8)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText(`${Math.round(frac * 100)}%`, x + 4, barY + barH + 14)
    x += segW
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(pad + barW * p, barY - 16)
  ctx.lineTo(pad + barW * p, barY + barH + 18)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.font = MONO
  ctx.fillStyle = accent
  ctx.fillText('most of the answer in Action, first person, then quantify Result', pad, h - 14)
}

function draw(ctx: CanvasRenderingContext2D, scene: Scene, w: number, h: number, t: number, accent: string) {
  switch (scene) {
    case 'descent':
      return sDescent(ctx, w, h, t, accent)
    case 'net':
      return sNet(ctx, w, h, t, accent)
    case 'conv':
      return sConv(ctx, w, h, t, accent)
    case 'boundary':
      return sBoundary(ctx, w, h, t, accent)
    case 'histogram':
      return sHistogram(ctx, w, h, t, accent)
    case 'roc':
      return sRoc(ctx, w, h, t, accent)
    case 'transformer':
      return sTransformer(ctx, w, h, t, accent)
    case 'retrieval':
      return sRetrieval(ctx, w, h, t, accent)
    case 'twopointer':
      return sTwoPointer(ctx, w, h, t, accent)
    case 'hashmap':
      return sHashMap(ctx, w, h, t, accent)
    case 'traversal':
      return sTraversal(ctx, w, h, t, accent)
    case 'dptable':
      return sDpTable(ctx, w, h, t, accent)
    case 'binsearch':
      return sBinSearch(ctx, w, h, t, accent)
    case 'greedy':
      return sGreedy(ctx, w, h, t, accent)
    case 'lb':
      return sLb(ctx, w, h, t, accent)
    case 'queue':
      return sQueueScene(ctx, w, h, t, accent)
    case 'shard':
      return sShard(ctx, w, h, t, accent)
    case 'join':
      return sJoin(ctx, w, h, t, accent)
    case 'window':
      return sWindowFn(ctx, w, h, t, accent)
    case 'btree':
      return sBTree(ctx, w, h, t, accent)
    case 'star':
      return sStar(ctx, w, h, t, accent)
    default:
      return sPipeline(ctx, w, h, t, accent)
  }
}

export default function LiveDiagram({ scene, accent }: { scene: Scene; accent: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const cvRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const cv = cvRef.current
    if (!wrap || !cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    if (!ctx.roundRect) {
      // very old engines — degrade to sharp corners
      ;(ctx as unknown as { roundRect: (x: number, y: number, w: number, h: number) => void }).roundRect = (x, y, w, h) => ctx.rect(x, y, w, h)
    }
    const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let cw = 0
    let ch = 0
    const start = performance.now()

    // Re-syncs the backing store to the wrapper's box. Returns false until the
    // element actually has a size (guards the first paint / layout settling).
    const ensureSize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (w < 2 || h < 2) return false
      if (w === cw && h === ch) return true
      cw = w
      ch = h
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return true
    }

    const render = (t: number) => {
      ctx.clearRect(0, 0, cw, ch)
      draw(ctx, scene, cw, ch, t, accent)
    }

    if (reduce) {
      const ro = new ResizeObserver(() => {
        if (ensureSize()) render(0)
      })
      ro.observe(wrap)
      if (ensureSize()) render(0)
      return () => ro.disconnect()
    }

    const frame = (now: number) => {
      ensureSize() // self-heals after layout settles or on any resize
      if (cw > 0) render((now - start) / 1000)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [scene, accent])

  return (
    <div
      ref={wrapRef}
      className="w-full glass rounded-xl overflow-hidden"
      style={{ aspectRatio: '3 / 2', minHeight: 340, maxHeight: 560 }}
    >
      <canvas ref={cvRef} className="block w-full h-full" />
    </div>
  )
}
