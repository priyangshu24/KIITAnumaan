// ---------------------------------------------------------------------------
// AI / ML Lab — the interactive layer on top of the AI/ML interview track.
//
// Three practice surfaces:
//   1. Drill       — answer real interview questions, self-grade against the outline
//   2. Estimation  — back-of-envelope calculators every AI/ML systems round asks for
//   3. Algorithms  — small ML algorithms you can parameterise and watch run
//
// The drill bank is DERIVED from lib/aiml-interview-data.ts — no content is
// duplicated here. The estimators carry their own pure compute() functions so
// the UI stays a thin renderer.
// ---------------------------------------------------------------------------

import {
  AIML_SUBTOPICS,
  type AimlLevel,
  type AimlReading,
} from '@/lib/aiml-interview-data'
import { AIML_EXTRA_SUBTOPICS } from '@/lib/aiml-drill-extra'

export type { AimlLevel, AimlReading }

/** foundations first, then the LLM/RAG/agents track */
const DRILL_SUBTOPICS = [...AIML_EXTRA_SUBTOPICS, ...AIML_SUBTOPICS]

// ===========================================================================
// 1. DRILL — grouped question bank (derived)
// ===========================================================================

export interface DrillQuestion {
  id: string
  subtopicId: string
  subtopic: string
  icon: string
  q: string
  level: AimlLevel
  outline: string[]
  followUp?: string
  reading: AimlReading
}

export interface DrillTopic {
  id: string
  title: string
  icon: string
  tagline: string
  count: number
}

export const DRILL_TOPICS: DrillTopic[] = DRILL_SUBTOPICS.map((s) => ({
  id: s.id,
  title: s.title,
  icon: s.icon,
  tagline: s.tagline,
  count: s.questions.length,
}))

export const DRILL_QUESTIONS: DrillQuestion[] = DRILL_SUBTOPICS.flatMap((s) =>
  s.questions.map((qq) => ({
    id: qq.id,
    subtopicId: s.id,
    subtopic: s.title,
    icon: s.icon,
    q: qq.q,
    level: qq.level,
    outline: qq.outline,
    followUp: qq.followUp,
    reading: qq.source ?? s.reading[0],
  })),
)

export const drillOf = (subtopicId: string): DrillQuestion[] =>
  DRILL_QUESTIONS.filter((q) => q.subtopicId === subtopicId)

export const LEVEL_COLOR: Record<AimlLevel, { text: string; bg: string; border: string }> = {
  Fresher: { text: '#34D399', bg: 'rgba(52,211,153,0.10)', border: 'rgba(52,211,153,0.30)' },
  'SDE II': { text: '#FBBF24', bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.30)' },
  'SDE III': { text: '#FB7185', bg: 'rgba(251,113,133,0.10)', border: 'rgba(251,113,133,0.30)' },
}

// ===========================================================================
// 2. ESTIMATION LAB
// ===========================================================================

export type EstimatorFieldKind = 'number' | 'select'

export interface EstimatorField {
  key: string
  label: string
  unit?: string
  kind?: EstimatorFieldKind
  min?: number
  max?: number
  step?: number
  default: number
  options?: { label: string; value: number }[]
  help?: string
}

export type OutputTone = 'ok' | 'warn' | 'bad' | 'neutral'

export interface EstimatorOutput {
  label: string
  value: string
  hint?: string
  tone?: OutputTone
  /** 0..1 — draws a bar under the value when present */
  bar?: number
  barColor?: string
}

export interface EstimatorPreset {
  label: string
  values: Record<string, number>
}

export interface Estimator {
  id: string
  title: string
  blurb: string
  concepts: string[]
  fields: EstimatorField[]
  /** named starting points that set several fields at once */
  presets: EstimatorPreset[]
  /** the arithmetic, shown verbatim under the results */
  formula: string
  compute: (v: Record<string, number>) => EstimatorOutput[]
  /** what the interviewer is really probing for */
  checks: string[]
  reading: AimlReading[]
}

export const LEVEL_TARGET_SEC: Record<AimlLevel, number> = {
  Fresher: 120,
  'SDE II': 180,
  'SDE III': 240,
}

// -- formatting helpers ----------------------------------------------------

const KB = 1024
const MB = 1024 * 1024
const GB = 1024 * 1024 * 1024

const fmtBytes = (b: number): string => {
  if (!isFinite(b)) return '—'
  const n = Math.abs(b)
  if (n >= GB) return `${(b / GB).toFixed(2)} GB`
  if (n >= MB) return `${(b / MB).toFixed(1)} MB`
  if (n >= KB) return `${(b / KB).toFixed(1)} KB`
  return `${b.toFixed(0)} B`
}

const fmtInt = (n: number): string =>
  n.toLocaleString('en-US', { maximumFractionDigits: 0 })

const fmtCompact = (n: number): string => {
  if (!isFinite(n)) return '—'
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}k`
  return `${Math.round(n)}`
}

const fmtUsd = (n: number, dp = 2): string =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`

const fmtMs = (n: number): string => (n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${Math.round(n)} ms`)

const gpuTone = (bytes: number, gpuGb: number): OutputTone => {
  const cap = gpuGb * GB
  if (bytes > cap) return 'bad'
  if (bytes > cap * 0.8) return 'warn'
  return 'ok'
}

// -- the estimators ------------------------------------------------------------

export const ESTIMATORS: Estimator[] = [
  // ---------------------------------------------------------------- KV cache
  {
    id: 'kv-cache',
    title: 'KV Cache & Serving Memory',
    blurb:
      'Size the attention KV cache for a decoder-only model and check whether weights + cache fit the GPU. The KV cache — not the weights — is what caps batch size at long context.',
    concepts: ['KV cache', 'GQA vs MHA', 'context length', 'batch size'],
    formula:
      'head_dim = d_model / query_heads\n' +
      'KV bytes = 2 · layers · kv_heads · head_dim · seq · batch · dtype_bytes\n' +
      'weights  = params · dtype_bytes\n' +
      'resident = weights + KV bytes   (must be ≤ GPU memory)',
    presets: [
      { label: 'Llama-3 8B', values: { params_b: 8, layers: 32, d_model: 4096, n_heads: 32, n_kv_heads: 8, seq_len: 8192, batch: 16, bytes: 2, gpu_gb: 80 } },
      { label: 'Llama-3 70B', values: { params_b: 70, layers: 80, d_model: 8192, n_heads: 64, n_kv_heads: 8, seq_len: 8192, batch: 8, bytes: 2, gpu_gb: 80 } },
      { label: 'Mistral 7B / 32k', values: { params_b: 7, layers: 32, d_model: 4096, n_heads: 32, n_kv_heads: 8, seq_len: 32768, batch: 8, bytes: 2, gpu_gb: 40 } },
      { label: 'GPT-3 175B (MHA)', values: { params_b: 175, layers: 96, d_model: 12288, n_heads: 96, n_kv_heads: 96, seq_len: 2048, batch: 4, bytes: 2, gpu_gb: 141 } },
    ],
    fields: [
      { key: 'params_b', label: 'Parameters', unit: 'B', default: 8, min: 0.1, max: 700, step: 0.1 },
      { key: 'layers', label: 'Layers', default: 32, min: 1, max: 160, step: 1 },
      { key: 'd_model', label: 'Hidden dim', default: 4096, min: 256, max: 20480, step: 128 },
      { key: 'n_heads', label: 'Query heads', default: 32, min: 1, max: 160, step: 1 },
      { key: 'n_kv_heads', label: 'KV heads (GQA)', default: 8, min: 1, max: 160, step: 1, help: '= query heads for MHA · 1 for MQA' },
      { key: 'seq_len', label: 'Context length', unit: 'tok', default: 8192, min: 128, max: 1_000_000, step: 128 },
      { key: 'batch', label: 'Concurrent sequences', default: 16, min: 1, max: 512, step: 1 },
      {
        key: 'bytes', label: 'Cache dtype', kind: 'select', default: 2,
        options: [
          { label: 'fp16 / bf16 (2 B)', value: 2 },
          { label: 'fp8 (1 B)', value: 1 },
          { label: 'fp32 (4 B)', value: 4 },
        ],
      },
      {
        key: 'gpu_gb', label: 'GPU memory', kind: 'select', default: 80,
        options: [
          { label: 'A10G / 4090 — 24 GB', value: 24 },
          { label: 'A100 40 GB', value: 40 },
          { label: 'A100 / H100 80 GB', value: 80 },
          { label: 'H200 141 GB', value: 141 },
        ],
      },
    ],
    compute: (v) => {
      const headDim = v.d_model / v.n_heads
      const kv = 2 * v.layers * v.n_kv_heads * headDim * v.seq_len * v.batch * v.bytes
      const kvPerTok = 2 * v.layers * v.n_kv_heads * headDim * v.bytes
      const mhaKv = 2 * v.layers * v.n_heads * headDim * v.seq_len * v.batch * v.bytes
      const weights = v.params_b * 1e9 * v.bytes
      const total = weights + kv
      const cap = v.gpu_gb * GB
      return [
        { label: 'KV cache (this config)', value: fmtBytes(kv), hint: `${fmtBytes(kv / v.batch)} per sequence`, tone: gpuTone(kv, v.gpu_gb) },
        { label: 'KV per token', value: fmtBytes(kvPerTok), hint: 'batch 1 · grows linearly with context' },
        { label: 'Model weights', value: fmtBytes(weights), hint: `${v.params_b} B × ${v.bytes} B/param` },
        {
          label: `Total resident vs ${v.gpu_gb} GB`,
          value: fmtBytes(total),
          hint: total > cap ? `over by ${fmtBytes(total - cap)} — reduce batch or context` : `${fmtBytes(cap - total)} headroom`,
          tone: gpuTone(total, v.gpu_gb),
          bar: Math.min(1, total / cap),
          barColor: total > cap ? '#FB7185' : total > cap * 0.8 ? '#FBBF24' : '#34D399',
        },
        {
          label: 'GQA saving vs MHA',
          value: fmtBytes(mhaKv - kv),
          hint: `${Math.round((1 - kv / mhaKv) * 100)}% less KV memory (${v.n_heads}→${v.n_kv_heads} KV heads)`,
          tone: 'ok',
        },
      ]
    },
    checks: [
      'Do you know the KV cache formula: 2 × layers × kv_heads × head_dim × seq × batch × dtype?',
      'Can you argue that at long context the KV cache, not the weights, bounds batch size?',
      'Do you reach for GQA/MQA or a quantised KV cache when it does not fit?',
    ],
    reading: [
      { label: 'GQA: Grouped-Query Attention', url: 'https://arxiv.org/abs/2305.13245' },
      { label: 'vLLM / PagedAttention', url: 'https://arxiv.org/abs/2309.06180' },
    ],
  },

  // ---------------------------------------------------------------- LoRA
  {
    id: 'lora',
    title: 'LoRA / QLoRA Footprint',
    blurb:
      'Count the trainable parameters a LoRA config actually introduces, the effective α/r scaling, and a rough training-VRAM figure for the QLoRA setup.',
    concepts: ['low-rank adapters', 'rank & alpha', 'target modules', 'QLoRA'],
    formula:
      'per matrix   = 2 · r · d_model        (A: r×d, B: d×r)\n' +
      'trainable    = layers · target_modules · per_matrix\n' +
      'scaling      = alpha / r\n' +
      'train VRAM  ≈ base(@bits) + adapters(2B) + grads(2B) + AdamW(8B/param)',
    presets: [
      { label: 'QLoRA 7B · r16', values: { params_b: 7, layers: 32, d_model: 4096, rank: 16, alpha: 32, targets: 4, base_bits: 4, optimizer: 1 } },
      { label: 'LoRA 13B · r64 + MLP', values: { params_b: 13, layers: 40, d_model: 5120, rank: 64, alpha: 128, targets: 7, base_bits: 16, optimizer: 1 } },
      { label: '70B QLoRA · r8', values: { params_b: 70, layers: 80, d_model: 8192, rank: 8, alpha: 16, targets: 4, base_bits: 4, optimizer: 1 } },
    ],
    fields: [
      { key: 'params_b', label: 'Base parameters', unit: 'B', default: 7, min: 0.1, max: 700, step: 0.1 },
      { key: 'layers', label: 'Layers', default: 32, min: 1, max: 160, step: 1 },
      { key: 'd_model', label: 'Hidden dim', default: 4096, min: 256, max: 20480, step: 128 },
      { key: 'rank', label: 'Rank r', default: 16, min: 1, max: 256, step: 1 },
      { key: 'alpha', label: 'Alpha', default: 32, min: 1, max: 512, step: 1 },
      {
        key: 'targets', label: 'Target modules / layer', kind: 'select', default: 4,
        options: [
          { label: 'q, v (2)', value: 2 },
          { label: 'q, k, v, o (4)', value: 4 },
          { label: '+ gate, up, down (7)', value: 7 },
        ],
      },
      {
        key: 'base_bits', label: 'Base precision', kind: 'select', default: 4,
        options: [
          { label: '4-bit (QLoRA / NF4)', value: 4 },
          { label: '8-bit', value: 8 },
          { label: '16-bit', value: 16 },
        ],
      },
      {
        key: 'optimizer', label: 'Optimizer', kind: 'select', default: 1,
        options: [
          { label: 'AdamW (m + v states)', value: 1 },
          { label: 'SGD / none', value: 0 },
        ],
      },
    ],
    compute: (v) => {
      // A: r×d_in, B: d_out×r → 2·r·d for a square projection
      const perMatrix = 2 * v.rank * v.d_model
      const loraParams = v.layers * v.targets * perMatrix
      const pct = (loraParams / (v.params_b * 1e9)) * 100
      const scaling = v.alpha / v.rank
      const baseBytes = v.params_b * 1e9 * (v.base_bits / 8)
      const adapterBytes = loraParams * 2 // bf16 weights
      const gradBytes = loraParams * 2
      const optBytes = v.optimizer ? loraParams * 8 : 0 // fp32 m + v
      const trainTotal = baseBytes + adapterBytes + gradBytes + optBytes
      return [
        { label: 'Trainable parameters', value: fmtCompact(loraParams), hint: `${pct.toFixed(2)}% of the ${v.params_b} B base`, tone: 'ok' },
        { label: 'Effective scaling α / r', value: scaling.toFixed(2), hint: scaling > 4 ? 'high — updates may dominate; watch stability' : 'typical range 1–4' },
        { label: `Base weights @ ${v.base_bits}-bit`, value: fmtBytes(baseBytes), hint: 'frozen — no gradients or optimizer state' },
        { label: 'Adapters + grads + optimizer', value: fmtBytes(adapterBytes + gradBytes + optBytes), hint: v.optimizer ? 'AdamW ≈ 8 B/param of state' : 'no optimizer state' },
        {
          label: 'Est. training VRAM (ex-activations)',
          value: fmtBytes(trainTotal),
          hint: trainTotal > 48 * GB ? 'needs an 80 GB card or offload' : trainTotal > 24 * GB ? 'fits a 48 GB card' : 'fits a 24 GB card',
          tone: trainTotal > 48 * GB ? 'warn' : 'ok',
        },
      ]
    },
    checks: [
      'Do you know ΔW = B·A adds ~2·r·d params per target matrix?',
      'Can you explain what α/r controls and pick sane values (r 8–64, α ≈ 2r)?',
      'Do you know QLoRA freezes a 4-bit base so only adapters carry optimizer state?',
    ],
    reading: [
      { label: 'LoRA', url: 'https://arxiv.org/abs/2106.09685' },
      { label: 'QLoRA', url: 'https://arxiv.org/abs/2305.14314' },
    ],
  },

  // ---------------------------------------------------------------- RAG latency
  {
    id: 'rag-latency',
    title: 'RAG Latency Budget',
    blurb:
      'Add up the stages of a RAG request and check the total against your p95 SLO. If it blows the budget, you can see which stage to attack.',
    concepts: ['latency budget', 'two-stage retrieval', 'TTFT', 'p95 SLO'],
    formula:
      'retrieval = embed + ANN + rerank + assemble\n' +
      'total     = retrieval + LLM_TTFT + groundedness_check\n' +
      'within SLO ⇔ total ≤ p95_budget',
    presets: [
      { label: 'Tight · 500 ms', values: { embed_ms: 8, ann_ms: 20, rerank_ms: 60, assemble_ms: 10, llm_ttft_ms: 300, postcheck_ms: 30, budget_ms: 500 } },
      { label: 'Standard · 800 ms', values: { embed_ms: 15, ann_ms: 40, rerank_ms: 120, assemble_ms: 20, llm_ttft_ms: 400, postcheck_ms: 60, budget_ms: 800 } },
      { label: 'Heavy rerank', values: { embed_ms: 15, ann_ms: 50, rerank_ms: 280, assemble_ms: 25, llm_ttft_ms: 450, postcheck_ms: 80, budget_ms: 800 } },
    ],
    fields: [
      { key: 'embed_ms', label: 'Query embedding', unit: 'ms', default: 15, min: 0, max: 500, step: 1 },
      { key: 'ann_ms', label: 'ANN search', unit: 'ms', default: 40, min: 0, max: 1000, step: 1 },
      { key: 'rerank_ms', label: 'Cross-encoder rerank', unit: 'ms', default: 120, min: 0, max: 1000, step: 5 },
      { key: 'assemble_ms', label: 'Context assembly', unit: 'ms', default: 20, min: 0, max: 500, step: 1 },
      { key: 'llm_ttft_ms', label: 'LLM time-to-first-token', unit: 'ms', default: 400, min: 0, max: 5000, step: 10 },
      { key: 'postcheck_ms', label: 'Groundedness check', unit: 'ms', default: 60, min: 0, max: 1000, step: 5 },
      { key: 'budget_ms', label: 'p95 budget', unit: 'ms', default: 800, min: 100, max: 10000, step: 50 },
    ],
    compute: (v) => {
      const stages: [string, number, string][] = [
        ['Query embedding', v.embed_ms, '#60A5FA'],
        ['ANN search', v.ann_ms, '#818CF8'],
        ['Rerank', v.rerank_ms, '#A78BFA'],
        ['Context assembly', v.assemble_ms, '#C084FC'],
        ['LLM TTFT', v.llm_ttft_ms, '#F472B6'],
        ['Groundedness check', v.postcheck_ms, '#FB7185'],
      ]
      const total = stages.reduce((s, [, ms]) => s + ms, 0)
      const retrieval = v.embed_ms + v.ann_ms + v.rerank_ms + v.assemble_ms
      const out: EstimatorOutput[] = stages.map(([label, ms, color]) => ({
        label,
        value: fmtMs(ms),
        hint: `${Math.round((ms / v.budget_ms) * 100)}% of budget`,
        bar: Math.min(1, ms / v.budget_ms),
        barColor: color,
      }))
      out.push({
        label: 'Total vs p95 budget',
        value: fmtMs(total),
        hint: total > v.budget_ms ? `over by ${fmtMs(total - v.budget_ms)}` : `${fmtMs(v.budget_ms - total)} slack`,
        tone: total > v.budget_ms ? 'bad' : total > v.budget_ms * 0.9 ? 'warn' : 'ok',
        bar: Math.min(1, total / v.budget_ms),
        barColor: total > v.budget_ms ? '#FB7185' : '#34D399',
      })
      out.push({
        label: 'Retrieval sub-total',
        value: fmtMs(retrieval),
        hint: `${Math.round((retrieval / total) * 100)}% of the request — rerank is usually the lever`,
      })
      return out
    },
    checks: [
      'Do you budget each stage explicitly rather than hand-waving "it should be fast"?',
      'Do you know rerank and LLM TTFT dominate, and cut k or cache to fix it?',
      'Do you reason in p95, not mean?',
    ],
    reading: [
      { label: 'Lost in the Middle', url: 'https://arxiv.org/abs/2307.03172' },
      { label: 'Anthropic — Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval' },
    ],
  },

  // ---------------------------------------------------------------- token cost
  {
    id: 'token-cost',
    title: 'Token Cost Model',
    blurb:
      'Turn a per-request token profile and a price sheet into daily, monthly and annual spend — the number that decides whether the feature ships.',
    concepts: ['token accounting', 'prompt caching', 'unit economics'],
    formula:
      'eff_in  = in·(1−h) + in·h·0.10          (h = cache-hit rate)\n' +
      'per_req = eff_in/1e6 · price_in + out/1e6 · price_out\n' +
      'daily   = per_req · requests_per_day     ·   monthly = daily · 30',
    presets: [
      { label: 'Frontier tier', values: { in_tok: 1500, out_tok: 600, price_in: 3, price_out: 15, cache_hit_pct: 0, rpd: 50000 } },
      { label: 'Mid tier', values: { in_tok: 1500, out_tok: 600, price_in: 0.8, price_out: 4, cache_hit_pct: 0, rpd: 50000 } },
      { label: 'Cached system prompt', values: { in_tok: 4000, out_tok: 400, price_in: 3, price_out: 15, cache_hit_pct: 80, rpd: 200000 } },
      { label: 'Cheap / self-hosted', values: { in_tok: 1500, out_tok: 600, price_in: 0.1, price_out: 0.3, cache_hit_pct: 0, rpd: 50000 } },
    ],
    fields: [
      { key: 'in_tok', label: 'Input tokens / request', default: 1200, min: 0, max: 200000, step: 50 },
      { key: 'out_tok', label: 'Output tokens / request', default: 400, min: 0, max: 32000, step: 10 },
      { key: 'price_in', label: 'Input price', unit: '$/1M', default: 3, min: 0, max: 100, step: 0.05 },
      { key: 'price_out', label: 'Output price', unit: '$/1M', default: 15, min: 0, max: 400, step: 0.05 },
      { key: 'cache_hit_pct', label: 'Prompt-cache hit rate', unit: '%', default: 0, min: 0, max: 100, step: 5, help: 'cached input billed at ~10%' },
      { key: 'rpd', label: 'Requests / day', default: 50000, min: 0, max: 50_000_000, step: 1000 },
    ],
    compute: (v) => {
      const hit = v.cache_hit_pct / 100
      const effIn = v.in_tok * (1 - hit) + v.in_tok * hit * 0.1
      const perReq = (effIn / 1e6) * v.price_in + (v.out_tok / 1e6) * v.price_out
      const daily = perReq * v.rpd
      return [
        { label: 'Cost per request', value: fmtUsd(perReq, 4), hint: `${fmtInt(effIn)} billed input + ${fmtInt(v.out_tok)} output tokens` },
        { label: 'Per 1,000 requests', value: fmtUsd(perReq * 1000, 2) },
        { label: 'Per day', value: fmtUsd(daily, 2), hint: `${fmtCompact(v.rpd)} req/day`, tone: 'neutral' },
        { label: 'Per month (30d)', value: fmtUsd(daily * 30, 0), tone: daily * 30 > 50000 ? 'warn' : 'ok' },
        { label: 'Per year', value: fmtUsd(daily * 365, 0), tone: daily * 365 > 1_000_000 ? 'bad' : 'neutral' },
        {
          label: 'Output-token share of cost',
          value: `${Math.round(((v.out_tok / 1e6) * v.price_out / perReq) * 100)}%`,
          hint: 'output tokens are typically 3–5× the price of input',
        },
      ]
    },
    checks: [
      'Do you separate input vs output pricing (output is far dearer)?',
      'Do you model prompt-cache hit rate on repetitive system prompts?',
      'Do you scale to daily / annual so the business can decide?',
    ],
    reading: [
      { label: 'Anthropic — prompt caching', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-caching' },
      { label: 'Designing ML Systems — Chip Huyen', url: 'https://huyenchip.com/books/' },
    ],
  },

  // ---------------------------------------------------------------- pass@k
  {
    id: 'pass-at-k',
    title: 'pass@k Estimator',
    blurb:
      'The unbiased pass@k estimate from n samples with c correct — the standard code-eval metric. See how much large k flatters a model versus the pass@1 a user actually gets.',
    concepts: ['pass@k', 'sampling', 'unbiased estimator', 'temperature'],
    formula:
      'pass@k = 1 − Π_{i=0}^{k−1} (n − c − i) / (n − i)      when n − c ≥ k,  else 1\n' +
      'pass@1 = c / n        (the temperature-0 production number)',
    presets: [
      { label: 'Strong model', values: { n: 200, c: 150, k: 10 } },
      { label: 'Weak model', values: { n: 200, c: 30, k: 10 } },
      { label: 'pass@1 view', values: { n: 200, c: 80, k: 1 } },
      { label: 'Large k flatter', values: { n: 200, c: 40, k: 100 } },
    ],
    fields: [
      { key: 'n', label: 'Samples drawn (n)', default: 200, min: 1, max: 1000, step: 1 },
      { key: 'c', label: 'Correct samples (c)', default: 80, min: 0, max: 1000, step: 1 },
      { key: 'k', label: 'k', default: 10, min: 1, max: 200, step: 1 },
    ],
    compute: (v) => {
      const n = Math.max(1, Math.round(v.n))
      const c = Math.min(n, Math.max(0, Math.round(v.c)))
      const k = Math.min(n, Math.max(1, Math.round(v.k)))
      // unbiased: 1 - C(n-c, k) / C(n, k)  ==  1 - Π_{i=0}^{k-1} (n-c-i)/(n-i)
      let passK: number
      if (n - c < k) passK = 1
      else {
        let prod = 1
        for (let i = 0; i < k; i++) prod *= (n - c - i) / (n - i)
        passK = 1 - prod
      }
      const pass1 = c / n
      return [
        { label: `pass@${k}`, value: `${(passK * 100).toFixed(1)}%`, tone: 'ok', bar: passK, barColor: '#34D399' },
        { label: 'pass@1 (c / n)', value: `${(pass1 * 100).toFixed(1)}%`, hint: 'what temperature-0 production actually gets', bar: pass1, barColor: '#60A5FA' },
        { label: 'Lift from sampling k', value: `+${((passK - pass1) * 100).toFixed(1)} pts`, hint: 'shrinks as the test suite weakens' },
        { label: 'Per-sample success rate', value: `${(pass1 * 100).toFixed(1)}%`, hint: `${c} of ${n} samples` },
        { label: 'Disclosure needed', value: `n=${n}, k=${k}, temp`, hint: 'a pass@k without n, k and temperature is not a result' },
      ]
    },
    checks: [
      'Can you write the unbiased estimator rather than the naive 1 − (1 − p)^k?',
      'Do you know pass@k is bounded by hidden-test-suite quality?',
      'Do you insist on n, k and temperature being disclosed?',
    ],
    reading: [
      { label: 'HumanEval / Codex paper', url: 'https://arxiv.org/abs/2107.03374' },
      { label: 'SWE-bench', url: 'https://arxiv.org/abs/2310.06770' },
    ],
  },

  // ---------------------------------------------------------------- vector index
  {
    id: 'vector-index',
    title: 'Vector Index Memory',
    blurb:
      'Estimate RAM for an HNSW index over N embeddings and compare it with an IVF-PQ compressed build. At scale the graph and the raw vectors both matter.',
    concepts: ['HNSW', 'IVF-PQ', 'quantisation', 'recall vs memory'],
    formula:
      'flat   = N · dim · dtype_bytes\n' +
      'graph ≈ N · M · 2 · 8 · 1.3          (neighbour id lists, both layers)\n' +
      'HNSW   = flat + graph      ·      IVF-PQ = N · pq_bytes + graph',
    presets: [
      { label: '10M · 768d fp32', values: { n_million: 10, dim: 768, bytes: 4, hnsw_m: 16, pq_bytes: 64 } },
      { label: '100M · 1536d fp32', values: { n_million: 100, dim: 1536, bytes: 4, hnsw_m: 32, pq_bytes: 96 } },
      { label: '1B · 384d int8', values: { n_million: 1000, dim: 384, bytes: 1, hnsw_m: 16, pq_bytes: 48 } },
    ],
    fields: [
      { key: 'n_million', label: 'Vectors', unit: 'M', default: 50, min: 0.01, max: 5000, step: 0.5 },
      { key: 'dim', label: 'Dimensions', default: 768, min: 32, max: 4096, step: 32 },
      {
        key: 'bytes', label: 'Vector dtype', kind: 'select', default: 4,
        options: [
          { label: 'fp32 (4 B)', value: 4 },
          { label: 'fp16 (2 B)', value: 2 },
          { label: 'int8 (1 B)', value: 1 },
        ],
      },
      { key: 'hnsw_m', label: 'HNSW M (links/node)', default: 16, min: 4, max: 64, step: 2 },
      { key: 'pq_bytes', label: 'PQ code size', unit: 'B/vec', default: 64, min: 8, max: 256, step: 8 },
    ],
    compute: (v) => {
      const N = v.n_million * 1e6
      const flat = N * v.dim * v.bytes
      // neighbour id lists, both layers, ~8 B/id, ~1.3× overhead
      const graph = N * v.hnsw_m * 2 * 8 * 1.3
      const hnswTotal = flat + graph
      const pqTotal = N * v.pq_bytes + graph
      return [
        { label: 'Raw vectors (flat)', value: fmtBytes(flat), hint: `${fmtCompact(N)} × ${v.dim} × ${v.bytes} B` },
        { label: 'HNSW graph overhead', value: fmtBytes(graph), hint: `M=${v.hnsw_m} links/node × 2 layers` },
        { label: 'HNSW total (RAM-resident)', value: fmtBytes(hnswTotal), tone: hnswTotal > 128 * GB ? 'bad' : hnswTotal > 32 * GB ? 'warn' : 'ok' },
        { label: 'IVF-PQ total', value: fmtBytes(pqTotal), hint: `${v.pq_bytes} B/vector compressed`, tone: 'ok' },
        {
          label: 'Compression ratio',
          value: `${(hnswTotal / pqTotal).toFixed(1)}×`,
          hint: 'PQ trades a few points of recall for this saving',
        },
      ]
    },
    checks: [
      'Do you count the graph, not just the raw vectors?',
      'Can you pick HNSW vs IVF-PQ on N, memory budget and target recall?',
      'Do you know quantisation buys memory at a measurable recall cost?',
    ],
    reading: [
      { label: 'HNSW paper', url: 'https://arxiv.org/abs/1603.09320' },
      { label: 'FAISS wiki — index selection', url: 'https://github.com/facebookresearch/faiss/wiki' },
    ],
  },
]

// ===========================================================================
// 3. ALGORITHM LAB (metadata — sim logic lives in the component)
// ===========================================================================

export type AlgoId =
  | 'kmeans'
  | 'gradient-descent'
  | 'softmax-temp'
  | 'knn'
  | 'metrics'
  | 'cosine'
  | 'logreg'
  | 'qlearn'
  | 'pca'
  | 'linreg'
  | 'dtree'
  | 'perceptron'
  | 'mlp'
  | 'optimizers'

export interface AlgoLabMeta {
  id: AlgoId
  title: string
  blurb: string
  category: 'Unsupervised' | 'Optimization' | 'LLM Internals' | 'Supervised' | 'Evaluation'
  concepts: string[]
  /** the algorithm as a numbered walkthrough, shown in the sim panel */
  steps: string[]
  reading: AimlReading[]
}

export const ALGO_LABS: AlgoLabMeta[] = [
  {
    id: 'kmeans',
    title: 'K-Means Clustering',
    category: 'Unsupervised',
    blurb:
      'Step through Lloyd’s algorithm — alternate assign-to-nearest-centroid and move-centroid-to-mean until nothing moves. Re-seed to watch it land in a different local minimum.',
    concepts: ['centroids', 'inertia', 'local minima', 'choosing k'],
    steps: [
      'Drop k marker points on the plot — these are the guessed cluster centres.',
      'Colour every data point by whichever marker is nearest to it.',
      'Slide each marker to the middle of the points that now share its colour.',
      'Repeat the last two steps. When no point changes colour, it is done.',
      'Different starting markers can give a different answer — run it a few times and keep the tightest clusters.',
    ],
    reading: [{ label: 'k-means clustering (Wikipedia)', url: 'https://en.wikipedia.org/wiki/K-means_clustering' }],
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    category: 'Optimization',
    blurb:
      'Roll downhill on a non-convex 1-D loss. Nudge the learning rate up and watch the iterate overshoot, oscillate, then diverge — the single most common training failure.',
    concepts: ['learning rate', 'convergence', 'divergence', 'local minima'],
    steps: [
      'Place a ball somewhere on the curve.',
      'Check which way is downhill right there (that is the gradient).',
      'Roll the ball one small step downhill. The step size is the learning rate.',
      'Repeat. It settles at the bottom of a valley — unless the steps are too big, then it flies out and blows up.',
    ],
    reading: [{ label: 'Gradient descent (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gradient_descent' }],
  },
  {
    id: 'softmax-temp',
    title: 'Sampling — Temperature, top-k, top-p',
    category: 'LLM Internals',
    blurb:
      'Reshape a fixed logit vector. Temperature flattens or sharpens; top-k and top-p truncate the tail. The entropy readout shows how much randomness is left.',
    concepts: ['softmax', 'temperature', 'nucleus sampling', 'entropy'],
    steps: [
      'Start with a raw score for each possible next word.',
      'Temperature: divide every score by it. A low temperature makes the top word dominate; a high one evens the words out.',
      'Turn the scores into percentages that add up to 100% (this is softmax).',
      'Optionally throw away the unlikely words (top-k / top-p), then pick one word at random from what is left.',
    ],
    reading: [{ label: 'The Curious Case of Neural Text Degeneration', url: 'https://arxiv.org/abs/1904.09751' }],
  },
  {
    id: 'knn',
    title: 'k-NN Decision Boundary',
    category: 'Supervised',
    blurb:
      'Raise k and watch the boundary go from a jagged shape that memorises noise (low bias, high variance) to a smooth one that misses structure (high bias).',
    concepts: ['bias–variance', 'k', 'distance metric', 'overfitting'],
    steps: [
      'Just remember every training point and its colour — there is no real "training".',
      'To label a new spot, find its k closest training points.',
      'Whichever colour is most common among those k wins.',
      'Small k copies every point (bumpy, over-fit). Large k averages everything (too smooth).',
    ],
    reading: [{ label: 'k-nearest neighbors (Wikipedia)', url: 'https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm' }],
  },
  {
    id: 'metrics',
    title: 'Threshold · Confusion Matrix · F1',
    category: 'Evaluation',
    blurb:
      'Two overlapping score distributions and a movable decision threshold. Watch precision trade against recall and the operating point slide along the ROC curve.',
    concepts: ['precision', 'recall', 'F1', 'ROC / AUC', 'threshold'],
    steps: [
      'The model gives every item a score from 0 to 1.',
      'Pick a cut-off. Anything scoring above it, you predict "yes".',
      'Compare your predictions to the truth: count the hits and misses to get precision, recall and F1.',
      'Slide the cut-off across every value to draw the ROC and PR curves.',
      'The area under those curves (AUC / AP) rates the model without you picking one cut-off.',
    ],
    reading: [{ label: 'Precision and recall (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Precision_and_recall' }],
  },
  {
    id: 'cosine',
    title: 'Cosine Similarity vs Dot vs L2',
    category: 'LLM Internals',
    blurb:
      'Rotate and scale two vectors. Cosine ignores magnitude, the dot product does not, and Euclidean distance disagrees with both — which is why embeddings are normalised.',
    concepts: ['embeddings', 'cosine vs dot', 'normalisation', 'angle'],
    steps: [
      'Take two arrows (vectors).',
      'Dot product: multiply the matching parts and add them up — it grows with both length and alignment.',
      'Cosine: the dot product divided by both arrows’ lengths — this leaves only the angle, ignoring length.',
      'Make both arrows length 1 first, and the cosine equals the dot product.',
      'Straight-line (L2) distance still cares about length — that is why search compares length-1 embeddings by cosine.',
    ],
    reading: [{ label: 'Cosine similarity (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cosine_similarity' }],
  },
  {
    id: 'logreg',
    title: 'Logistic Regression — training',
    category: 'Supervised',
    blurb:
      'Watch a linear classifier train: each epoch takes a gradient step on binary cross-entropy and the decision line rotates toward separating the two classes. The live trace reports loss and accuracy per epoch.',
    concepts: ['sigmoid', 'cross-entropy', 'gradient descent', 'decision boundary'],
    steps: [
      'Start with a flat line and no knowledge (weights = 0).',
      'For each point the line gives a number; squash it to a 0–1 probability with an S-shaped curve.',
      'Measure how wrong those probabilities are versus the real yes/no labels.',
      'Nudge the line a little to make that error smaller.',
      'Repeat until the line separates the two colours.',
    ],
    reading: [{ label: 'Logistic regression (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Logistic_regression' }],
  },
  {
    id: 'qlearn',
    title: 'Q-Learning — gridworld',
    category: 'Optimization',
    blurb:
      'A reinforcement-learning agent learns to reach a goal while avoiding pits. Run episodes and watch the Q-value map and greedy-policy arrows fill in as ε decays from explore to exploit.',
    concepts: ['reward', 'Q-values', 'ε-greedy', 'discount factor', 'exploration'],
    steps: [
      'Make a scoreboard: for every cell, how good is each of the 4 moves? Start every score at 0.',
      'From where you stand, usually take the best-scoring move — but now and then (chance = ε) move at random to explore.',
      'Make the move, see the reward, and note the new cell.',
      'Update that move’s score toward: reward now + (discount × the best score from the new cell).',
      'Reaching the goal or a pit ends the round. Lower ε over time so it explores less and exploits what it learned.',
    ],
    reading: [{ label: 'Q-learning (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Q-learning' }],
  },
  {
    id: 'pca',
    title: 'PCA — principal components',
    category: 'Unsupervised',
    blurb:
      'Reshape a 2-D cloud and see its principal axes update live. PC1 tracks the direction of greatest variance; the explained-variance bar shows how much a 1-D projection would keep.',
    concepts: ['covariance', 'eigenvectors', 'explained variance', 'dimensionality reduction'],
    steps: [
      'Shift the whole cloud so its centre sits at the origin.',
      'Measure how the points spread out and how the two axes move together.',
      'Find the one direction the cloud is longest along — that is PC1. PC2 is at a right angle to it.',
      'PC1’s length tells you how much of the total spread it captures.',
      'Keep only PC1 (or the top few directions) to squash the data into fewer numbers per point.',
    ],
    reading: [{ label: 'Principal component analysis (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Principal_component_analysis' }],
  },
  {
    id: 'linreg',
    title: 'Linear Regression — OLS vs gradient descent',
    category: 'Supervised',
    blurb:
      'Fit a line to noisy points. The closed form (normal equations) solves it in one step; gradient descent walks there — watch the residuals and the loss curve shrink.',
    concepts: ['least squares', 'residuals', 'gradient descent', 'R²'],
    steps: [
      'You want the best straight line through the dots: y = slope·x + intercept.',
      '"Best" means the smallest total up-and-down gap between the line and the dots (the residuals).',
      'One formula gives the exact answer in a single shot — that is the green line.',
      'Or start with a bad line and keep tilting it downhill on the error — that is gradient descent, the red line.',
      'Watch the red line settle right on top of the green one.',
    ],
    reading: [{ label: 'Linear regression (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Linear_regression' }],
  },
  {
    id: 'dtree',
    title: 'Decision Tree — greedy splits',
    category: 'Supervised',
    blurb:
      'Build a tree one split at a time. Each step finds the axis-aligned threshold with the biggest Gini gain and partitions the worst leaf — watch the regions carve up and the impurity fall.',
    concepts: ['Gini impurity', 'information gain', 'axis-aligned splits', 'overfitting / depth'],
    steps: [
      'Put all the points in one box.',
      'Try every horizontal and vertical cut. For each, check how mixed the two halves are (that is Gini).',
      'Keep the cut that makes the two halves the purest.',
      'Split that box into two smaller boxes.',
      'Repeat on the most mixed-up box until boxes are pure or you hit the depth limit.',
    ],
    reading: [{ label: 'Decision tree learning (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Decision_tree_learning' }],
  },
  {
    id: 'perceptron',
    title: 'Perceptron — the learning rule',
    category: 'Supervised',
    blurb:
      'The 1958 update rule: for every point it gets wrong, nudge the weight vector toward it. On linearly separable data it stops in finite time; on non-separable data it oscillates forever.',
    concepts: ['online learning', 'weight update', 'linear separability', 'convergence'],
    steps: [
      'Start with any dividing line.',
      'Look at one point. Is it on the correct side?',
      'If yes, leave the line alone.',
      'If no, tilt the line a little toward that point.',
      'Go through all the points again and again. When a whole pass has zero mistakes, stop.',
    ],
    reading: [{ label: 'Perceptron (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Perceptron' }],
  },
  {
    id: 'mlp',
    title: 'Neural Net — a curved decision boundary',
    category: 'Supervised',
    blurb:
      'A 2-layer MLP with a tanh hidden layer, trained by gradient descent on two interleaved classes. Early on the boundary is nearly linear; as training proceeds the hidden units carve the non-linear shape.',
    concepts: ['hidden layer', 'tanh', 'backpropagation', 'non-linear boundary'],
    steps: [
      'Feed a point in: a hidden layer draws several lines, then bends and blends them; the output turns that into a 0–1 answer.',
      'Check how wrong the answer is.',
      'Send that error backwards through the network to see how much each weight was to blame (backpropagation).',
      'Nudge every weight to make the error smaller.',
      'Repeat. One straight line cannot split this shape, but the bent, blended lines can.',
    ],
    reading: [{ label: 'Multilayer perceptron (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Multilayer_perceptron' }],
  },
  {
    id: 'optimizers',
    title: 'SGD vs Momentum vs Adam',
    category: 'Optimization',
    blurb:
      'Three update rules descend the same elongated loss valley from the same start. SGD zig-zags across the valley, momentum builds speed along it, Adam adapts per-coordinate and usually arrives first.',
    concepts: ['momentum', 'adaptive learning rate', 'ill-conditioning', 'convergence speed'],
    steps: [
      'All three start at the same spot and see the same downhill direction.',
      'SGD: just step downhill. On a stretched valley it bounces from side to side.',
      'Momentum: like a heavy ball — it keeps rolling the way it was already going, so it speeds down the valley.',
      'Adam: gives each direction its own step size based on how bumpy that direction has been.',
      'Watch which one reaches the centre first — usually Adam.',
    ],
    reading: [{ label: 'An overview of gradient descent optimization algorithms', url: 'https://www.ruder.io/optimizing-gradient-descent/' }],
  },
]

// ===========================================================================
// aggregate
// ===========================================================================

export const AIML_LAB_STATS = {
  drillQuestions: DRILL_QUESTIONS.length,
  drillTopics: DRILL_TOPICS.length,
  estimators: ESTIMATORS.length,
  algos: ALGO_LABS.length,
}
