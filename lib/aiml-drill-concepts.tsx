/* eslint-disable react/no-unknown-property */
// ---------------------------------------------------------------------------
// AI / ML Lab — per-subtopic concept explainer + schematic diagram.
//
// Keyed by the subtopic id from lib/aiml-interview-data.ts. Shown on the
// "reveal" step of the Interview Drill alongside a question's outline so every
// question comes with the full concept and a related diagram.
// ---------------------------------------------------------------------------

import type { ReactNode } from 'react'

// -- tiny SVG toolkit ---------------------------------------------------------

const STROKE = '#5B6572'
const CARD = '#141418'
const TXT = '#E5E7EB'
const DIM = '#8A8A8A'

function DFrame({ children, w = 380, h = 214 }: { children: ReactNode; w?: number; h?: number }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto rounded-lg border border-white/[0.07] bg-[#0B0B0E]" role="img">
      <defs>
        <marker id="dc-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={STROKE} />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

function DBox({
  x, y, w = 82, h = 30, label, sub, color = '#3F3F46', fill = CARD,
}: {
  x: number; y: number; w?: number; h?: number; label: string; sub?: string; color?: string; fill?: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={color} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -2 : 3.4)} textAnchor="middle" fill={TXT} fontSize="9" fontFamily="ui-monospace, monospace">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 8.5} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">{sub}</text>}
    </g>
  )
}

function DArrow({
  x1, y1, x2, y2, dashed, label, color = STROKE,
}: {
  x1: number; y1: number; x2: number; y2: number; dashed?: boolean; label?: string; color?: string
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.4} markerEnd="url(#dc-arrow)" strokeDasharray={dashed ? '3 3' : undefined} />
      {label && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">{label}</text>}
    </g>
  )
}

function DLabel({ x, y, text, color = DIM }: { x: number; y: number; text: string; color?: string }) {
  return <text x={x} y={y} fill={color} fontSize="8" fontFamily="ui-monospace, monospace" fontWeight="600">{text}</text>
}

/** evenly spaced horizontal chain of boxes with connecting arrows */
function Chain({ y, items, x0 = 12, gap = 14, bw = 66, bh = 30 }: {
  y: number; items: { label: string; sub?: string; color?: string }[]; x0?: number; gap?: number; bw?: number; bh?: number
}) {
  return (
    <>
      {items.map((it, i) => {
        const x = x0 + i * (bw + gap)
        return (
          <g key={i}>
            <DBox x={x} y={y} w={bw} h={bh} label={it.label} sub={it.sub} color={it.color} />
            {i < items.length - 1 && <DArrow x1={x + bw} y1={y + bh / 2} x2={x + bw + gap} y2={y + bh / 2} />}
          </g>
        )
      })}
    </>
  )
}

// ===========================================================================

export interface DrillConcept {
  concept: string[]
  diagram: ReactNode
}

const A = '#FF4D4D', B = '#60A5FA', G = '#34D399', Y = '#FBBF24', P = '#C084FC'

export const DRILL_CONCEPTS: Record<string, DrillConcept> = {
  // ---------------------------------------------------------------- 1
  'llm-architecture': {
    concept: [
      'A decoder-only transformer turns a sequence of token ids into a probability distribution over the next token. Tokens are looked up in an embedding table, position is injected (RoPE, ALiBi or learned), and the result flows through N identical blocks: causal multi-head self-attention, then a position-wise feed-forward network, each wrapped in a residual connection and a normalisation layer.',
      'Self-attention is where every token mixes information from every earlier token, which costs O(n²) in sequence length. At inference the K and V projections for past tokens are cached (the KV cache) so each new token is O(n) instead of O(n²); at long context that cache, not the weights, is the memory bottleneck. GQA/MQA shrink it by sharing KV heads across query heads.',
      'The final hidden state is projected by the LM head to vocabulary logits, and a sampler (greedy, temperature, top-p) picks the next id. Mixture-of-Experts swaps the dense FFN for a router that sends each token to a few of many experts — far more parameters at the same active FLOPs, at the cost of memory and all-to-all communication.',
    ],
    diagram: (
      <DFrame h={210}>
        <DLabel x={12} y={16} text="DECODER-ONLY FORWARD PASS" color={A} />
        <Chain y={30} bw={60} gap={13} items={[
          { label: 'tokens', sub: 'BPE ids' },
          { label: 'embed', sub: '+ position', color: B },
          { label: 'block ×N', sub: 'attn·FFN', color: A },
          { label: 'LM head', sub: 'logits', color: B },
          { label: 'sample', sub: 'top-p / T', color: G },
        ]} />
        <rect x={148} y={74} width={86} height={104} rx={7} fill="none" stroke={A} strokeWidth={1.2} strokeDasharray="3 3" />
        <DLabel x={150} y={86} text="one block" color={A} />
        <DBox x={152} y={92} w={78} h={26} label="self-attn" sub="causal, KV cache" color={A} />
        <DArrow x1={191} y1={118} x2={191} y2={128} />
        <DBox x={152} y={128} w={78} h={26} label="FFN / MoE" sub="router → experts" color={P} />
        <text x={244} y={104} fill={DIM} fontSize="7.5" fontFamily="ui-monospace, monospace">+ residual</text>
        <text x={244} y={144} fill={DIM} fontSize="7.5" fontFamily="ui-monospace, monospace">+ norm</text>
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 2
  'fine-tuning': {
    concept: [
      'Adapting a base model is a ladder of increasing cost and commitment: prompt engineering, then retrieval, then parameter-efficient fine-tuning (LoRA/QLoRA), then full-parameter fine-tuning. Fine-tuning reliably teaches form, tone and a narrow repeated skill — it does not reliably teach facts, which still go stale and belong in RAG.',
      'LoRA freezes the base weights W and learns a low-rank update ΔW = B·A, training roughly 0.1–1% of the parameters. Rank r (8–64) sets capacity, alpha/r scales the update, and you target the attention projections plus, for harder tasks, the MLP. QLoRA keeps a 4-bit quantised base with bf16 adapters so large models fine-tune on a single GPU.',
      'Preference optimisation aligns the model to human choices. RLHF trains a reward model on preference pairs then PPO-optimises the policy against it with a KL penalty; DPO skips the reward model with a closed-form objective on the same pairs — simpler and more stable, though well-tuned online PPO can still exceed it. Both need a KL anchor or you get reward hacking.',
    ],
    diagram: (
      <DFrame h={214}>
        <DLabel x={12} y={16} text="ADAPTATION LADDER — cost / commitment →" color={A} />
        <Chain y={28} bw={70} gap={10} items={[
          { label: 'prompt', sub: 'fastest' },
          { label: 'RAG', sub: 'knowledge', color: B },
          { label: 'LoRA', sub: '~1% params', color: G },
          { label: 'full FT', sub: 'all params', color: A },
        ]} />
        <DLabel x={12} y={84} text="LoRA UPDATE" color={G} />
        <DBox x={12} y={92} w={70} h={68} label="W" sub="frozen" color="#3F3F46" />
        <text x={90} y={130} fill={TXT} fontSize="12" fontFamily="ui-monospace, monospace">+</text>
        <DBox x={104} y={98} w={54} h={26} label="A" sub="r × d" color={G} />
        <DBox x={104} y={132} w={54} h={26} label="B" sub="d × r" color={G} />
        <DArrow x1={162} y1={130} x2={186} y2={130} label="ΔW" />
        <DBox x={188} y={116} w={70} h={28} label="W + BA" sub="merged" color={B} />
        <DLabel x={276} y={104} text="PREFERENCE" color={P} />
        <DBox x={276} y={110} w={94} h={22} label="RLHF · PPO" sub="reward model + KL" color={P} />
        <DBox x={276} y={138} w={94} h={22} label="DPO" sub="closed form, no RM" color={P} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 3
  'evals': {
    concept: [
      'You cannot ship an LLM feature on accuracy alone: open-ended outputs have many valid phrasings, so exact match systematically under-counts. A real eval mixes reference-based metrics (ROUGE, BERTScore), rubric-based LLM-as-judge scoring, and task-grounded checks — does the code run, does the JSON validate, does the SQL return the right rows. Latency, cost and safety are first-class metrics, not afterthoughts.',
      'For RAG you separate retrieval from generation. Retrieval: recall@k, MRR, nDCG — did we even fetch the right chunk. Generation: groundedness/faithfulness, answer relevance, citation correctness. Guard metrics cover correct refusal on out-of-scope queries and PII leakage. The whole suite runs in CI on every prompt, model or index change and blocks merge on a threshold regression.',
      'LLM-as-judge is valid for scalable relative ranking, but it has position, verbosity, self-preference and format biases — randomise and average orderings, prefer pairwise over absolute scores, and calibrate against a human-labelled sample. Gate a model upgrade through tiered stages: prompt unit tests → offline golden set → safety/red-team → shadow → canary → full, with guardrail metrics wired to automatic rollback.',
    ],
    diagram: (
      <DFrame h={210}>
        <DLabel x={12} y={16} text="EVAL HARNESS + RELEASE GATE" color={A} />
        <DBox x={12} y={26} w={78} h={34} label="golden set" sub="200–500 q" color={B} />
        <DArrow x1={90} y1={43} x2={112} y2={43} />
        <DBox x={112} y={22} w={92} h={20} label="retrieval" sub="recall@k · nDCG" color={G} />
        <DBox x={112} y={44} w={92} h={20} label="generation" sub="grounded · cited" color={G} />
        <DBox x={112} y={66} w={92} h={20} label="guard" sub="refusal · PII" color={Y} />
        <DArrow x1={204} y1={53} x2={226} y2={53} />
        <DBox x={226} y={40} w={70} h={26} label="LLM judge" sub="rubric, ± bias" color={P} />
        <DLabel x={12} y={112} text="PROMOTION" color={A} />
        <Chain y={122} bw={62} gap={12} items={[
          { label: 'unit', sub: 'prompts' },
          { label: 'golden', sub: 'offline', color: B },
          { label: 'safety', sub: 'red-team', color: Y },
          { label: 'shadow', sub: 'logged', color: G },
          { label: 'canary→full', sub: 'auto-rollback', color: A },
        ]} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 4
  'guardrails': {
    concept: [
      'A guardrail system is defence in depth around the model. Input layer: PII detection and redaction, injection/jailbreak detection, a scope classifier, rate limiting. Model layer: a hardened system prompt, a safety-tuned model, and constrained or schema-guided decoding. Output layer: policy and toxicity classifiers, PII scrub, schema validation, groundedness and citation checks. Operationally you need full logging, a human escalation path and a kill switch.',
      'Prompt injection is the signature threat for RAG and agents: retrieved documents and tool output are untrusted data and must never be treated as instructions. Structurally separate data from instructions (delimiters, spotlighting), enforce least privilege at the tool boundary in code rather than in the prompt, and require human approval for irreversible actions. No prompt-level fix is complete — the real control is authz plus defence in depth.',
      'To guarantee valid JSON, use grammar-constrained decoding or the provider’s tool-calling API with a declared schema, plus a bounded validate-and-repair loop; always validate server-side. Balancing safety against over-refusal is itself a product metric: measure false-refusal rate on a benign-but-sensitive set and calibrate thresholds per harm tier rather than with one global switch.',
    ],
    diagram: (
      <DFrame h={196}>
        <DLabel x={12} y={16} text="DEFENCE IN DEPTH" color={A} />
        <DBox x={12} y={28} w={104} h={78} label="INPUT" sub="" color={Y} fill="#15130E" />
        <text x={64} y={54} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">PII redact</text>
        <text x={64} y={68} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">injection clf</text>
        <text x={64} y={82} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">scope · rate</text>
        <DArrow x1={116} y1={67} x2={138} y2={67} />
        <DBox x={138} y={28} w={104} h={78} label="MODEL" sub="" color={A} fill="#160E0E" />
        <text x={190} y={54} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">hardened prompt</text>
        <text x={190} y={68} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">safety-tuned</text>
        <text x={190} y={82} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">constrained decode</text>
        <DArrow x1={242} y1={67} x2={264} y2={67} />
        <DBox x={264} y={28} w={104} h={78} label="OUTPUT" sub="" color={G} fill="#0E1611" />
        <text x={316} y={54} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">policy · toxicity</text>
        <text x={316} y={68} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">schema validate</text>
        <text x={316} y={82} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">groundedness</text>
        <DBox x={110} y={124} w={160} h={22} label="log · human escalation · kill switch" color="#3F3F46" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 5
  'rag': {
    concept: [
      'Retrieval-Augmented Generation grounds answers in fetched evidence. The ingestion path loads and parses documents, cleans them, chunks with metadata, embeds each chunk and upserts into a vector index (alongside BM25 for hybrid search). A chunk should be independently answerable and carry its own metadata; structure-aware or parent-document chunking beats fixed-size splitting.',
      'The query path embeds the question, does an ANN top-k with metadata filters, reranks with a cross-encoder, assembles the prompt, and instructs the model to answer only from context and cite chunk ids. A post-check verifies groundedness and citations before returning, and an explicit "not found" path handles no-evidence cases.',
      'When retrieval fetched the right document but the answer is still wrong, look at chunk boundaries (increase overlap or use small-to-big retrieval), "lost in the middle" (rerank, reduce k), a prompt that fails to instruct grounding, silent context truncation, or conflicting duplicate chunks. At scale you budget each stage explicitly and cache query embeddings, semantic repeats and hot answers.',
    ],
    diagram: (
      <DFrame h={200}>
        <DLabel x={12} y={15} text="INGEST" color={B} />
        <Chain y={22} bw={58} gap={10} items={[
          { label: 'docs' },
          { label: 'parse', sub: 'clean' },
          { label: 'chunk', sub: '+ meta', color: B },
          { label: 'embed', color: B },
          { label: 'index', sub: 'vec + BM25', color: G },
        ]} />
        <DArrow x1={300} y1={37} x2={300} y2={72} dashed />
        <DLabel x={12} y={98} text="QUERY" color={A} />
        <Chain y={106} bw={52} gap={9} items={[
          { label: 'question' },
          { label: 'embed', color: B },
          { label: 'ANN k', sub: '+ filter', color: G },
          { label: 'rerank', sub: 'cross-enc', color: P },
          { label: 'prompt', sub: 'cite ids' },
          { label: 'LLM', color: A },
        ]} />
        <DArrow x1={330} y1={121} x2={330} y2={150} />
        <DBox x={278} y={150} w={92} h={24} label="verify" sub="grounded · cited" color={G} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 6
  'agentic-llm': {
    concept: [
      'An agent runs a loop — reason, act, observe, repeat — until a goal is met or a budget is hit, whereas a chatbot maps text in to text out. Agents need tool schemas, persistent state and explicit termination criteria, and they fail differently: infinite loops, hallucinated tool names or arguments, context bloat from raw observations, and no backtracking.',
      'The ReAct pattern interleaves a thought, a tool call, and the observed result. Mitigations for its failure modes: hard step and wall-clock budgets, observation truncation or summarisation, schema-validated tool calls, retry with the structured error fed back in, and separate planner and critic roles for hard tasks.',
      'Reliable tools are small, orthogonal, verb-named, with strict JSON schemas, idempotent where possible, returning structured errors the model can recover from. Keep the active tool count low (roughly under 20) or add a retrieval routing step, and never expose a destructive operation without explicit confirmation and server-side authorisation. Cost predictability comes from budgets, cheap-model routing for easy steps, caching, and a structured per-step trace.',
    ],
    diagram: (
      <DFrame h={196}>
        <DLabel x={12} y={16} text="ReAct LOOP" color={A} />
        <DBox x={40} y={40} w={92} h={30} label="Thought" sub="plan next step" color={B} />
        <DArrow x1={132} y1={55} x2={196} y2={55} label="call" />
        <DBox x={196} y={40} w={92} h={30} label="Action" sub="tool(args)" color={A} />
        <DArrow x1={242} y1={70} x2={242} y2={108} />
        <DBox x={196} y={108} w={92} h={30} label="Observation" sub="result / error" color={G} />
        <DArrow x1={196} y1={123} x2={86} y2={123} label="append" />
        <DArrow x1={86} y1={108} x2={86} y2={70} />
        <DBox x={306} y={62} w={64} h={44} label="budget" sub="steps · $ · stop" color={Y} />
        <DArrow x1={288} y1={55} x2={306} y2={70} dashed />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 7
  'agentic-rag': {
    concept: [
      'Agentic RAG makes retrieval itself agent-controlled and iterative: the model decides whether, what and when to retrieve, rewrites queries, performs multi-hop lookups across sources, and critiques the evidence it got back. It clearly wins on multi-hop and ambiguous questions; the cost is extra latency and tokens.',
      'Query decomposition splits the question into ordered sub-questions with explicit dependencies, retrieves and answers each while carrying intermediate facts in run state, then synthesises a final answer with per-claim citations. Guardrails cap the hop count, detect unanswerable sub-questions, and prevent drift from the original intent.',
      'Self-correcting retrieval (Self-RAG / CRAG style) grades retrieved evidence as correct, ambiguous or incorrect before generation — correct proceeds, ambiguous augments with another source, incorrect rewrites the query and retries. A second critic checks the draft answer’s groundedness. The trade-off is meaningfully better accuracy for roughly 2–4× the latency and token cost; keep it acceptable with parallel fan-out, adaptive early exit, small models for routing, and a semantic cache keyed on sub-questions.',
    ],
    diagram: (
      <DFrame h={196}>
        <DLabel x={12} y={16} text="PLAN · RETRIEVE · CRITIQUE · SYNTHESISE" color={A} />
        <DBox x={12} y={30} w={78} h={30} label="planner" sub="sub-questions" color={B} />
        <DArrow x1={90} y1={45} x2={112} y2={45} />
        <DBox x={112} y={30} w={78} h={30} label="retrieve" sub="per sub-q" color={G} />
        <DArrow x1={190} y1={45} x2={212} y2={45} />
        <DBox x={212} y={30} w={78} h={30} label="critic" sub="ok / amb / bad" color={P} />
        <DArrow x1={251} y1={60} x2={251} y2={92} label="ok" />
        <DBox x={212} y={92} w={78} h={28} label="synthesise" sub="cited answer" color={A} />
        <DArrow x1={212} y1={106} x2={151} y2={106} />
        <DArrow x1={151} y1={106} x2={151} y2={45} label="rewrite / retry" color={Y} />
        <DBox x={306} y={30} w={64} h={30} label="hop cap" sub="anti-drift" color={Y} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 8
  'vector-db': {
    concept: [
      'Vector search does approximate nearest-neighbour over high-dimensional embeddings because exact kNN is O(N·d) per query — untenable at millions of vectors. ANN trades a small, measurable recall loss for orders-of-magnitude speedup, and the trade-off is tunable at query time (efSearch, nprobe).',
      'HNSW is a layered navigable small-world graph — best recall/latency, high memory, slow build (tune M and efSearch). IVF partitions into nlist Voronoi cells and probes nprobe of them — lower memory, needs training. PQ compresses vectors into quantised sub-codes for large memory savings with some recall loss. In practice you combine them: IVF-PQ for huge corpora, HNSW for latency-critical mid-size ones.',
      'Metadata filters interact with ANN in three ways: pre-filter then search (great for selective filters), search then post-filter (fast, over-fetch to compensate), or filter-aware graph traversal (the modern middle ground). Multi-tenancy needs a namespace or mandatory partition key so a filter can never leak, authz enforced in the query layer, per-tenant quotas, and a planned re-embedding story: dual-write, backfill, atomic alias swap.',
    ],
    diagram: (
      <DFrame h={188}>
        <DLabel x={12} y={16} text="TWO-STAGE RETRIEVAL" color={A} />
        <DBox x={12} y={30} w={72} h={30} label="query vec" color={B} />
        <DArrow x1={84} y1={45} x2={104} y2={45} />
        <g>
          <rect x={104} y={26} width={120} height={92} rx={7} fill={CARD} stroke={G} strokeWidth={1.3} />
          <DLabel x={110} y={38} text="HNSW graph" color={G} />
          <circle cx={128} cy={58} r={3} fill={G} /><circle cx={162} cy={52} r={3} fill={G} /><circle cx={196} cy={64} r={3} fill={G} />
          <circle cx={140} cy={88} r={3} fill={G} /><circle cx={178} cy={96} r={3} fill={G} /><circle cx={206} cy={86} r={3} fill={G} />
          <path d="M128,58 L162,52 L196,64 M140,88 L178,96 L206,86 M162,52 L178,96" stroke={G} strokeWidth={0.8} fill="none" opacity={0.6} />
        </g>
        <DArrow x1={224} y1={72} x2={244} y2={72} label="top-k" />
        <DBox x={244} y={58} w={72} h={28} label="rerank" sub="cross-enc" color={P} />
        <DBox x={12} y={132} w={140} h={22} label="alt: IVF-PQ (compressed)" color={Y} />
        <DBox x={164} y={132} w={152} h={22} label="filter: pre / post / filtered-graph" color="#3F3F46" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 9
  'benchmarks': {
    concept: [
      'Benchmarks quantify capability by family: knowledge and reasoning (MMLU, GPQA), code (HumanEval, SWE-bench, LiveCodeBench), maths (GSM8K, MATH, AIME), instruction following and chat (IFEval, MT-Bench, Arena-Hard), long context (RULER), safety (HarmBench), and human preference (LMArena Elo). Each measures something specific — multiple-choice ability is not generation quality.',
      'pass@k is the probability that at least one of k sampled solutions passes the tests, estimated unbiasedly from n samples. It is bounded entirely by the hidden test suite — weak tests inflate it — and a number without n, k and temperature disclosed is not a result. pass@1 at temperature 0 is what production actually experiences; large k flatters models.',
      'Contamination is test items leaking into pretraining data, which inflates scores without real capability gain. Detect it with n-gram overlap, canary strings, a perplexity gap between the test set and paraphrases, and a large drop on freshly perturbed variants. Mitigate with private held-out sets and time-gated benchmarks. For model selection, build an internal board weighted across quality, safety, latency, cost and context, with fixed n and bootstrap confidence intervals.',
    ],
    diagram: (
      <DFrame h={184}>
        <DLabel x={12} y={16} text="CAPABILITY SCORING" color={A} />
        <DBox x={12} y={30} w={64} h={34} label="model" color={A} />
        <DArrow x1={76} y1={47} x2={98} y2={35} />
        <DArrow x1={76} y1={47} x2={98} y2={55} />
        <DArrow x1={76} y1={47} x2={98} y2={75} />
        <DBox x={98} y={24} w={96} h={20} label="MMLU / GPQA" sub="" color={B} />
        <DBox x={98} y={46} w={96} h={20} label="SWE-bench" sub="agentic code" color={B} />
        <DBox x={98} y={68} w={96} h={20} label="pass@k" sub="n, k, temp" color={G} />
        <DArrow x1={194} y1={56} x2={216} y2={56} />
        <DBox x={216} y={40} w={72} h={30} label="board" sub="weighted, CI" color={P} />
        <DBox x={300} y={26} w={70} h={44} label="contamination" sub="n-gram · canary" color={Y} />
        <DArrow x1={300} y1={48} x2={288} y2={55} dashed color={Y} />
        <text x={12} y={110} fill={DIM} fontSize="7.5" fontFamily="ui-monospace, monospace">pass@k = 1 − Π (n−c−i)/(n−i)   ·   pass@1 = c / n</text>
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 10
  ocr: {
    concept: [
      'A classical OCR pipeline acquires the image, preprocesses it (deskew, denoise, binarise, dewarp), detects text regions (DBNet, EAST, CRAFT) into word or line boxes, recognises each crop into characters (CRNN + CTC or a transformer decoder), post-processes with lexicon correction and regex validation, and runs layout analysis to recover reading order, columns and blocks.',
      'Phone photos break clean-scan pipelines: add perspective correction and dewarping, glare and shadow normalisation, super-resolution for low DPI, and canonical rotation before recognition. Fine-tune the recogniser on in-domain data augmented with blur, JPEG artefacts and uneven lighting, and route low-confidence pages to a vision-language model as a fallback. Report CER/WER stratified by capture condition.',
      'Reliable key-value and table extraction uses layout-aware models that consume text plus bounding boxes plus the image (LayoutLMv3, Donut, or a VLM), constrains output to a schema, validates business rules, and emits per-field confidence so low-confidence fields go to human review. At scale it is a queue of per-page jobs on a GPU worker pool with idempotent processing keyed on content hash and cost tiering (classical first, VLM only on failures).',
    ],
    diagram: (
      <DFrame h={182}>
        <DLabel x={12} y={16} text="DOCUMENT → STRUCTURED DATA" color={A} />
        <Chain y={28} bw={54} gap={9} items={[
          { label: 'image' },
          { label: 'preproc', sub: 'deskew', color: B },
          { label: 'detect', sub: 'boxes', color: B },
          { label: 'recognise', sub: 'CRNN/VLM', color: A },
          { label: 'layout', sub: 'order', color: G },
          { label: 'extract', sub: 'KV·table', color: G },
        ]} />
        <DArrow x1={340} y1={43} x2={340} y2={74} />
        <DBox x={264} y={74} w={92} h={26} label="schema + rules" sub="per-field conf" color={P} />
        <DArrow x1={264} y1={87} x2={200} y2={87} label="low conf" color={Y} />
        <DBox x={108} y={74} w={92} h={26} label="human review" color={Y} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 11
  pipelining: {
    concept: [
      'An end-to-end ML pipeline is ingest → validate → feature engineering → train → evaluate → register → deploy → monitor → retrain trigger, with every stage versioned (data version + code commit + config) so any run is reproducible. A failure at validation stops the pipeline rather than silently training on bad data.',
      'Training/serving skew is the same feature computed by two code paths — batch SQL offline, a service online — that quietly disagree. A feature store serves one definition to both, point-in-time correct offline and low-latency online; point-in-time joins prevent label leakage, and CI contract tests compare offline and online values for sampled entities.',
      'Automated retraining fires on a schedule, a drift threshold, live metric degradation or a data-volume milestone. It builds the dataset, trains, evaluates the challenger against the champion on a frozen holdout with fairness checks, and promotes only if the challenger beats the champion beyond the confidence interval with no regression on key slices — rolled out via shadow → canary → full with automatic rollback and full lineage.',
    ],
    diagram: (
      <DFrame h={176}>
        <DLabel x={12} y={16} text="MLOps LIFECYCLE" color={A} />
        <Chain y={28} bw={50} gap={8} items={[
          { label: 'ingest' },
          { label: 'validate', sub: 'stop on bad', color: Y },
          { label: 'features', sub: 'store', color: B },
          { label: 'train', color: A },
          { label: 'eval', sub: 'vs champ', color: G },
          { label: 'registry', color: B },
        ]} />
        <DArrow x1={340} y1={43} x2={340} y2={70} />
        <DBox x={286} y={70} w={72} h={26} label="deploy" sub="shadow→canary" color={G} />
        <DArrow x1={286} y1={83} x2={214} y2={83} />
        <DBox x={140} y={70} w={72} h={26} label="monitor" sub="drift" color={P} />
        <DArrow x1={140} y1={83} x2={64} y2={83} />
        <DArrow x1={64} y1={83} x2={64} y2={58} label="retrain" color={A} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- 12
  'ai-system-design': {
    concept: [
      'Attack an AI system design question by clarifying requirements, scale and latency budget before drawing anything; define success on two levels — product (retention, containment) and model (recall@k, groundedness); map the data flow; then choose a model, always stating the non-ML baseline first. Cover serving, evaluation and monitoring, then failure modes and cost, and close with explicit trade-offs and a v2.',
      'Recurring designs: semantic search (connectors → parse → chunk → embed → index with ACLs; authz-filtered hybrid retrieve → rerank → cited answer), a support assistant (intent router, grounded answers with mandatory citations, guardrails, human handoff carrying context), and a serving platform (gateway for authz/quotas/failover; vLLM/TGI with continuous batching and paged KV cache; prompt-prefix and semantic caches; token accounting and per-team dashboards).',
      'For a real-time recommender that uses an LLM, keep the classic funnel — candidate generation (two-tower + ANN), a ranking model, business rules and diversity — and use the LLM offline for content understanding (tags, summaries, embeddings), not in the hot path. Optionally re-rank only the top ~20 with a strict latency budget and aggressive caching; handle cold start with content-based fallback plus bandit exploration.',
    ],
    diagram: (
      <DFrame h={188}>
        <DLabel x={12} y={16} text="DESIGN CHECKLIST" color={A} />
        <Chain y={28} bw={58} gap={9} items={[
          { label: 'requirements', sub: 'scale · SLO' },
          { label: 'metrics', sub: 'product+model', color: B },
          { label: 'data flow', color: B },
          { label: 'model', sub: '+ baseline', color: A },
          { label: 'serving', sub: 'batch·cache', color: G },
        ]} />
        <DArrow x1={318} y1={43} x2={318} y2={72} />
        <DBox x={244} y={72} w={92} h={26} label="eval + monitor" sub="guardrails" color={P} />
        <DArrow x1={244} y1={85} x2={180} y2={85} />
        <DBox x={96} y={72} w={84} h={26} label="cost + failure" sub="trade-offs" color={Y} />
        <DArrow x1={96} y1={85} x2={40} y2={85} />
        <DArrow x1={40} y1={85} x2={40} y2={58} label="v2" color={A} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- math
  'ml-math': {
    concept: [
      'A forward pass is a chain of matrix multiplies with a non-linearity between each: a dense layer computes activation(W·x + b), and a batch is X·Wᵀ. Composing linear maps stays linear, so the non-linearity is what buys capacity; the accelerator hardware exists to do exactly this dense multiply (GEMM) fast.',
      'Probability handles uncertainty. Bayes’ theorem — posterior ∝ likelihood × prior — is the backbone of Naive Bayes, and MAP estimation is just maximum likelihood plus a prior, which is precisely what L2 regularisation is (a Gaussian prior on the weights).',
      'Optimisation is calculus: gradient descent does θ ← θ − η·∇L(θ), stepping opposite the gradient. The learning rate η sets the step size — too large diverges, too small stalls — and the eigenvalue spread of the loss curvature (its condition number) predicts how badly the iterate zig-zags. PCA, in turn, is the eigendecomposition of the covariance matrix.',
    ],
    diagram: (
      <DFrame h={196}>
        <DLabel x={12} y={16} text="THREE PILLARS" color={A} />
        <DBox x={12} y={28} w={110} h={44} label="linear map" sub="a = σ(W·x + b)" color={B} />
        <DBox x={135} y={28} w={110} h={44} label="Bayes" sub="post ∝ lik × prior" color={P} />
        <DBox x={258} y={28} w={110} h={44} label="grad descent" sub="θ ← θ − η∇L" color={A} />
        <DLabel x={12} y={100} text="η too large → overshoot · too small → stall" />
        <path d="M40,170 C90,110 150,180 210,120 C250,90 300,140 350,110" stroke={STROKE} strokeWidth={1.6} fill="none" />
        <circle cx={40} cy={170} r={4} fill={A} />
        <circle cx={130} cy={148} r={4} fill={A} />
        <circle cx={210} cy={120} r={4} fill={A} />
        <circle cx={350} cy={110} r={4} fill={G} />
        <DLabel x={12} y={188} text="loss surface — descend to the minimum" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- classical
  'classical-ml': {
    concept: [
      'Linear regression predicts a continuous value with squared-error loss; logistic regression puts wᵀx through a sigmoid to get a probability and trains with cross-entropy — it is "regression" because it models the log-odds linearly, and its decision boundary is a hyperplane.',
      'A decision tree greedily splits on the feature and threshold that most reduce impurity (Gini/entropy) or variance. A single deep tree has low bias but high variance. Two fixes: bagging (Random Forest) averages many decorrelated deep trees to cut variance; boosting (XGBoost/LightGBM) fits shallow trees sequentially to the residual to cut bias, needing shrinkage and early stopping to avoid overfitting.',
      'k-means alternates assign-to-nearest-centroid and move-to-mean, minimising inertia — a local optimum, so use k-means++ and several restarts. It assumes spherical, equal-size, equal-density clusters; elongated or nested data needs DBSCAN or a Gaussian mixture.',
    ],
    diagram: (
      <DFrame h={176}>
        <DLabel x={12} y={16} text="THE CLASSICAL TOOLBOX" color={A} />
        <DBox x={12} y={26} w={96} h={26} label="linear / logistic" sub="linear boundary" color={B} />
        <DBox x={12} y={60} w={64} h={24} label="tree" color="#3F3F46" />
        <DArrow x1={76} y1={72} x2={100} y2={62} />
        <DArrow x1={76} y1={72} x2={100} y2={90} />
        <DBox x={100} y={50} w={92} h={22} label="forest" sub="bagging → var↓" color={G} />
        <DBox x={100} y={80} w={92} h={22} label="boosting" sub="residual → bias↓" color={A} />
        <DBox x={210} y={60} w={92} h={26} label="k-means" sub="k++ · elbow" color={P} />
        <DLabel x={12} y={112} text="tabular data: boosting usually wins · deep learning rarely needed" />
        <DLabel x={12} y={132} text="k-means fails on elongated / varying-density clusters → DBSCAN / GMM" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- features
  'feature-eng': {
    concept: [
      'Preprocessing turns raw records into a numeric matrix. Impute missing values (mean for symmetric, median for skewed) and add a "was-missing" indicator. Encode categoricals: one-hot for low-cardinality nominal, ordinal only when order is real, target encoding for high-cardinality — but only computed inside CV with smoothing, or it leaks.',
      'Data leakage is any information in a feature that would not exist, unchanged, at prediction time: scaling or imputing on the full dataset before the split, a future aggregate, an ID that encodes the label. The result is a great offline score and a bad production one. The fix is to fit every transform inside the CV fold (a Pipeline) and split by time for temporal problems.',
      'Class imbalance: pick the metric first (PR-AUC, recall at fixed precision), resample inside CV only (SMOTE / undersample), or use class weights / focal loss, then tune the decision threshold on validation.',
    ],
    diagram: (
      <DFrame h={172}>
        <DLabel x={12} y={16} text="PREPROCESS — FIT ON TRAIN ONLY" color={A} />
        <Chain y={28} bw={62} gap={12} items={[
          { label: 'raw', sub: 'NaN · text' },
          { label: 'split', sub: 'train / test', color: A },
          { label: 'impute', sub: 'fit(train)', color: B },
          { label: 'encode', sub: 'fit(train)', color: B },
          { label: 'scale', sub: 'fit(train)', color: B },
        ]} />
        <DArrow x1={360} y1={43} x2={360} y2={72} />
        <DBox x={286} y={72} w={90} h={26} label="model" sub="numeric matrix" color={G} />
        <DBox x={12} y={112} w={200} h={22} label="leakage check: value exists at predict time?" color={Y} />
        <DBox x={224} y={112} w={152} h={22} label="fit transforms in the CV fold" color="#3F3F46" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- eval
  'model-eval': {
    concept: [
      'Precision = TP/(TP+FP) — of what you flagged, how much was right. Recall = TP/(TP+FN) — of what mattered, how much you caught. Recall dominates when misses are costly (fraud, disease); precision dominates when false alarms are costly (spam, moderation). F1 is their harmonic mean.',
      'Accuracy misleads on imbalanced data — a constant predictor scores high. ROC-AUC measures threshold-free ranking but is optimistic under heavy imbalance because true negatives inflate the FPR; PR-AUC focuses on the rare positive class and is the honest summary. For regression: MAE is robust, RMSE punishes large errors and stays in target units, R² is the variance explained.',
      'Cross-validation rotates the validation split for a lower-variance estimate on small data (stratified for classification, forward-chaining for time series). Never tune on the test set — that leaks it. Keep a held-out set touched once; use nested CV for unbiased model selection.',
    ],
    diagram: (
      <DFrame h={192}>
        <DLabel x={12} y={16} text="CONFUSION MATRIX → METRICS" color={A} />
        <rect x={40} y={26} width={54} height={30} rx={5} fill="rgba(52,211,153,0.15)" stroke={G} />
        <text x={67} y={45} textAnchor="middle" fill={G} fontSize="10" fontFamily="ui-monospace, monospace">TP</text>
        <rect x={96} y={26} width={54} height={30} rx={5} fill="rgba(251,113,133,0.12)" stroke={A} />
        <text x={123} y={45} textAnchor="middle" fill={A} fontSize="10" fontFamily="ui-monospace, monospace">FP</text>
        <rect x={40} y={58} width={54} height={30} rx={5} fill="rgba(251,191,36,0.12)" stroke={Y} />
        <text x={67} y={77} textAnchor="middle" fill={Y} fontSize="10" fontFamily="ui-monospace, monospace">FN</text>
        <rect x={96} y={58} width={54} height={30} rx={5} fill="rgba(96,165,250,0.12)" stroke={B} />
        <text x={123} y={77} textAnchor="middle" fill={B} fontSize="10" fontFamily="ui-monospace, monospace">TN</text>
        <text x={172} y={40} fill={DIM} fontSize="8" fontFamily="ui-monospace, monospace">P = TP / (TP+FP)</text>
        <text x={172} y={56} fill={DIM} fontSize="8" fontFamily="ui-monospace, monospace">R = TP / (TP+FN)</text>
        <text x={172} y={72} fill={DIM} fontSize="8" fontFamily="ui-monospace, monospace">F1 = 2PR / (P+R)</text>
        <DLabel x={12} y={116} text="ROC-AUC: ranking, optimistic on imbalance   ·   PR-AUC: honest for rare positives" />
        <Chain y={130} bw={54} gap={8} x0={12} items={[
          { label: 'fold 1' }, { label: 'fold 2' }, { label: 'fold 3', color: A }, { label: 'fold 4' }, { label: 'fold 5' },
        ]} />
        <DLabel x={12} y={186} text="k-fold CV — rotate the validation fold · test set touched once" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- DL
  'deep-learning': {
    concept: [
      'Forward pass of a 2-layer net: z₁ = W₁x + b₁, a₁ = σ(z₁), z₂ = W₂a₁ + b₂, ŷ = softmax(z₂), L = cross-entropy(ŷ, y). Backward pass applies the chain rule: ∂L/∂z₂ = ŷ − y, ∂L/∂W₂ = (ŷ − y)·a₁ᵀ, then back through σ′(z₁) to W₁. An optimiser steps the parameters.',
      'Non-linear activations are essential — stacked linear layers collapse to one linear map. Sigmoid/tanh saturate and cause vanishing gradients; ReLU is the default (cheap, non-saturating for x > 0), with Leaky ReLU / GELU to cure the "dying ReLU".',
      'Vanishing/exploding gradients come from multiplying many Jacobian terms through depth. Fixes: variance-preserving initialisation (Xavier for tanh, He for ReLU), residual connections, normalisation (BatchNorm across the batch, LayerNorm across features — the transformer choice), gradient clipping, and gated recurrent units. Dropout randomly zeros activations at train time as an implicit ensemble.',
    ],
    diagram: (
      <DFrame h={176}>
        <DLabel x={12} y={16} text="2-LAYER NET — FORWARD / BACKWARD" color={A} />
        <DBox x={12} y={40} w={48} h={28} label="x" color="#3F3F46" />
        <DArrow x1={60} y1={54} x2={82} y2={54} />
        <DBox x={82} y={40} w={78} h={28} label="W₁ · σ" sub="a₁ = ReLU(z₁)" color={B} />
        <DArrow x1={160} y1={54} x2={182} y2={54} />
        <DBox x={182} y={40} w={90} h={28} label="W₂ · softmax" sub="ŷ" color={A} />
        <DArrow x1={272} y1={54} x2={294} y2={54} />
        <DBox x={294} y={40} w={70} h={28} label="L" sub="cross-ent" color={P} />
        <DArrow x1={330} y1={92} x2={210} y2={92} label="∂L/∂z₂ = ŷ − y" color={Y} />
        <DArrow x1={210} y1={92} x2={122} y2={92} label="chain rule → ∂L/∂W₁" color={Y} />
        <DLabel x={12} y={130} text="init: He (ReLU) / Xavier (tanh)   ·   residuals + norm keep gradients alive" />
        <DLabel x={12} y={150} text="dropout = train-time activation masking → implicit ensemble" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- CNN / RNN
  'cnn-rnn': {
    concept: [
      'A CNN exploits image structure with local connectivity and weight sharing: a kernel slides computing dot products → a feature map, giving translation equivariance and far fewer parameters than a dense layer. Stride subsamples, padding preserves size, pooling downsamples for invariance and grows the receptive field (the input region that affects one output). ResNet’s residual F(x) + x makes very deep networks trainable by giving gradients a shortcut.',
      'An RNN processes a sequence step by step, carrying a hidden state. Backprop-through-time multiplies the recurrent Jacobian at every step, so vanilla RNNs vanish/explode and forget quickly. An LSTM adds a cell state with additive updates and input/forget/output gates — a gradient highway; a GRU merges gates for fewer parameters.',
      'Sequence-to-sequence uses an encoder to compress the input into a fixed vector and a decoder to generate from it — a bottleneck on long inputs. Attention lets the decoder look back at every encoder state; transformers drop recurrence entirely for parallel self-attention.',
    ],
    diagram: (
      <DFrame h={190}>
        <DLabel x={12} y={15} text="CNN" color={B} />
        <Chain y={22} bw={46} gap={8} items={[
          { label: 'image' },
          { label: 'conv', color: B },
          { label: 'pool' },
          { label: 'conv', color: B },
          { label: 'pool' },
          { label: 'FC', color: G },
        ]} />
        <DLabel x={12} y={66} text="local + shared weights · receptive field grows with depth · ResNet: F(x)+x" />
        <DLabel x={12} y={100} text="RNN — unrolled" color={A} />
        <DBox x={12} y={110} w={48} h={26} label="x₁" color="#3F3F46" />
        <DBox x={72} y={110} w={48} h={26} label="x₂" color="#3F3F46" />
        <DBox x={132} y={110} w={48} h={26} label="x₃" color="#3F3F46" />
        <DBox x={36} y={148} w={48} h={22} label="h₁" color={A} />
        <DBox x={96} y={148} w={48} h={22} label="h₂" color={A} />
        <DBox x={156} y={148} w={48} h={22} label="h₃" color={A} />
        <DArrow x1={60} y1={159} x2={96} y2={159} />
        <DArrow x1={120} y1={159} x2={156} y2={159} />
        <DBox x={244} y={120} w={124} h={30} label="LSTM cell state" sub="gates = gradient highway" color={G} />
        <DLabel x={216} y={186} text="seq2seq bottleneck → attention → transformers" color={P} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- inference
  'llm-inference': {
    concept: [
      'An inference request has two phases. Prefill runs the whole prompt through the model in one parallel pass — big matmuls, compute-bound — and produces the first token; this dominates time-to-first-token. Decode then generates one token per step, and every step re-reads the entire KV cache and the weights, so it is memory-bandwidth-bound; this dominates time-per-output-token and throughput.',
      'Continuous (in-flight) batching keeps the GPU busy by swapping a finished sequence out and a queued one in at every decode step, instead of waiting for the slowest sequence. PagedAttention stores the KV cache in fixed-size pages with a per-sequence block table (OS-style virtual memory), eliminating fragmentation and letting sequences share pages; prefix caching reuses a shared system prompt’s KV across requests.',
      'Speculative decoding runs a cheap draft model to propose k tokens, then verifies all k with one parallel target forward pass; accepted tokens are free, the first rejection resamples from the corrected distribution — provably the same output distribution as the target alone, with speedup set by the acceptance rate.',
    ],
    diagram: (
      <DFrame h={200}>
        <DLabel x={12} y={16} text="PREFILL (compute-bound) → DECODE (memory-bound)" color={A} />
        <DBox x={12} y={28} w={70} h={30} label="prompt" color="#3F3F46" />
        <DArrow x1={82} y1={43} x2={104} y2={43} />
        <DBox x={104} y={28} w={82} h={30} label="prefill" sub="parallel · TTFT" color={A} />
        <DArrow x1={186} y1={43} x2={208} y2={43} />
        <DBox x={208} y={28} w={70} h={30} label="KV cache" sub="pages" color={G} />
        <DArrow x1={278} y1={43} x2={300} y2={43} />
        <DBox x={300} y={28} w={70} h={30} label="decode" sub="1 tok · TPOT" color={B} />
        <DArrow x1={335} y1={58} x2={335} y2={70} />
        <DArrow x1={335} y1={70} x2={243} y2={70} label="append K,V" />
        <DBox x={12} y={104} w={168} h={24} label="continuous batching — swap seqs in/out per step" color={P} />
        <DBox x={196} y={104} w={174} h={24} label="prefix cache — reuse shared system prompt KV" color={P} />
        <DBox x={12} y={140} w={110} h={26} label="draft model" sub="propose k" color="#3F3F46" />
        <DArrow x1={122} y1={153} x2={144} y2={153} />
        <DBox x={144} y={140} w={120} h={26} label="target verifies k" sub="1 parallel pass" color={A} />
        <DLabel x={278} y={156} text="same distribution, faster" color={G} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- efficiency
  'model-efficiency': {
    concept: [
      'Quantization stores weights (and sometimes activations) in fewer bits. Weight-only 4-bit (GPTQ, AWQ) leaves activations in fp16 — a large memory win for a small quality hit; W8A8 (SmoothQuant) also quantizes activations to speed compute, but activation outliers make it harder. GPTQ minimises layer-wise error with a Hessian-based column update; AWQ protects the ~1% salient channels by scaling instead of hard-rounding them.',
      'Mixture-of-Experts replaces the FFN with E experts and a router that sends each token to its top-1/2. Total parameters are huge but active FLOPs per token match a much smaller dense model — so a 1T MoE runs like a ~100B dense model. The costs are memory (all experts resident) and all-to-all communication; routing collapse and load imbalance are managed with an auxiliary loss and a capacity factor.',
      'Distillation trains a small student to match a large teacher’s soft output distribution (its "dark knowledge"), or its generations, or its chain-of-thought. The student learns fast and cheap but inherits the teacher’s errors and cannot surpass it.',
    ],
    diagram: (
      <DFrame h={196}>
        <DLabel x={12} y={16} text="THREE LEVERS FOR CHEAPER INFERENCE" color={A} />
        <DBox x={12} y={26} w={116} h={54} label="QUANTIZE" sub="fp16 → int4" color={B} />
        <text x={70} y={70} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">GPTQ · AWQ</text>
        <DBox x={140} y={26} w={116} h={54} label="MoE" sub="top-k of E experts" color={P} />
        <text x={198} y={70} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">params ≫ active FLOPs</text>
        <DBox x={268} y={26} w={100} h={54} label="DISTILL" sub="teacher → student" color={G} />
        <text x={318} y={70} textAnchor="middle" fill={DIM} fontSize="7" fontFamily="ui-monospace, monospace">soft targets</text>
        <DLabel x={12} y={110} text="MoE token routing" color={P} />
        <DBox x={12} y={118} w={54} h={24} label="token" color="#3F3F46" />
        <DArrow x1={66} y1={130} x2={88} y2={122} />
        <DArrow x1={66} y1={130} x2={88} y2={146} />
        <DBox x={88} y={112} w={70} h={20} label="expert 3" color={P} />
        <DBox x={88} y={138} w={70} h={20} label="expert 7" color={P} />
        <DLabel x={170} y={132} text="router picks top-k · aux loss balances load" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- post-training
  'post-training': {
    concept: [
      'SFT maximises the likelihood of curated good answers — it teaches format and skill but has no notion of "better vs worse". Preference optimization (DPO, ORPO, KTO, SimPO) takes that further: on pairs of chosen/rejected responses it widens the log-prob gap between them, anchored by a KL term to the reference model, with no reward model and no rollouts. DPO is the closed-form version of the RLHF objective; ORPO folds it into SFT; KTO needs only unpaired good/bad labels.',
      'RL keeps a place for the hardest targets. PPO does on-policy rollouts against a learned or rule-based reward with a KL penalty, and needs a separate critic network for the advantage baseline. GRPO removes the critic — it samples a group of completions per prompt and normalises reward within the group as the baseline — which is much lighter and pairs naturally with verifiable rewards.',
      'RLVR replaces the learned reward model with a deterministic verifier (tests pass, answer matches). It cannot be gamed on the metric itself, but the policy can still reward-hack around it — exploiting a test blind spot, hedging, format tricks — so you keep a KL anchor and held-out verifiers.',
    ],
    diagram: (
      <DFrame h={188}>
        <DLabel x={12} y={16} text="THE POST-TRAINING LADDER" color={A} />
        <Chain y={26} bw={68} gap={12} items={[
          { label: 'pretrain', sub: 'next token' },
          { label: 'SFT', sub: 'imitate good', color: B },
          { label: 'DPO / KTO', sub: 'chosen > rejected', color: G },
          { label: 'PPO / GRPO', sub: 'reward + KL', color: A },
        ]} />
        <DLabel x={12} y={82} text="PPO: needs a critic     ·     GRPO: group-normalised baseline, no critic" />
        <DBox x={12} y={94} w={110} h={26} label="prompt → G samples" color="#3F3F46" />
        <DArrow x1={122} y1={107} x2={144} y2={107} />
        <DBox x={144} y={94} w={96} h={26} label="verifier / RM" sub="score each" color={P} />
        <DArrow x1={240} y1={107} x2={262} y2={107} label="adv = z-score" />
        <DBox x={262} y={94} w={100} h={26} label="policy update" sub="+ KL anchor" color={A} />
        <DLabel x={12} y={150} text="RLVR = deterministic verifier · watch for reward hacking (rising reward, flat preference)" color={Y} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- reasoning
  reasoning: {
    concept: [
      'Chain-of-thought lets a model write intermediate steps into the context it then conditions on, converting one hard leap into a chain of easier ones. Self-consistency samples many independent CoT traces at temperature > 0 and takes the majority answer — independent slips cancel out, giving large gains on maths and logic at a cost linear in the number of samples.',
      'Test-time compute is the broader idea: spend more inference to get a better answer. Options are best-of-N ranked by a reward or verifier, tree-of-thought search that expands and prunes partial solutions, and iterative self-refinement with a critic. On verifiable tasks accuracy climbs roughly log-linearly with the budget, trading against train-time compute.',
      'Evaluating reasoning means scoring the process, not just the answer. Outcome rewards score only the final result — cheap but blind to lucky guesses and "right answer, wrong reasoning". Process reward models score each step, giving denser credit assignment and much better best-of-N reranking and RL, at the cost of step-level labels.',
    ],
    diagram: (
      <DFrame h={190}>
        <DLabel x={12} y={16} text="SPEND INFERENCE TO THINK BETTER" color={A} />
        <DBox x={12} y={28} w={70} h={28} label="prompt" color="#3F3F46" />
        <DArrow x1={82} y1={42} x2={104} y2={30} />
        <DArrow x1={82} y1={42} x2={104} y2={42} />
        <DArrow x1={82} y1={42} x2={104} y2={54} />
        <DBox x={104} y={22} w={92} h={16} label="CoT trace 1" color={B} />
        <DBox x={104} y={40} w={92} h={16} label="CoT trace 2" color={B} />
        <DBox x={104} y={58} w={92} h={16} label="CoT trace N" color={B} />
        <DArrow x1={196} y1={48} x2={218} y2={48} />
        <DBox x={218} y={34} w={92} h={28} label="vote / verifier" sub="best-of-N" color={P} />
        <DArrow x1={310} y1={48} x2={332} y2={48} />
        <DBox x={332} y={34} w={38} h={28} label="ans" color={G} />
        <DLabel x={12} y={104} text="process reward — score every step" color={Y} />
        <DBox x={12} y={112} w={44} h={22} label="step 1" color={G} />
        <DBox x={62} y={112} w={44} h={22} label="step 2" color={G} />
        <DBox x={112} y={112} w={44} h={22} label="step 3" color={A} />
        <DLabel x={166} y={126} text="PRM catches a wrong step even when the final answer is right" />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- eval
  'llm-eval': {
    concept: [
      'Evaluation splits into layers. Model eval measures capability (knowledge, reasoning, coding, safety). Application eval measures your feature (RAG groundedness, agent task success, tool accuracy). Production eval measures what users feel (latency, cost, refusal rate, thumbs-down, drift). BLEU/ROUGE only measure n-gram overlap, so a correct paraphrase scores low — replace them with deterministic task checks, embedding similarity, and rubric-based LLM-as-judge.',
      'LLM-as-judge scales relative ranking but carries biases: position (favours an ordering), verbosity (favours length), self-preference (favours its own family), and format. Correct with order-swapping and averaging, pairwise instead of absolute scores, a different or ensembled judge, and always calibrate against a human-labelled sample (report Spearman / Cohen’s kappa).',
      'RAG eval separates retrieval (recall@k, nDCG, context precision) from generation (faithfulness — is the answer entailed by the context — answer relevance, citation correctness). Agent eval adds trajectory scoring: tool-selection and argument accuracy, plan quality, step efficiency, loop/recovery rate, cost. All of it runs in CI on every prompt/model/index change and blocks merge on a regression.',
    ],
    diagram: (
      <DFrame h={200}>
        <DLabel x={12} y={16} text="EVALUATION — THREE LAYERS" color={A} />
        <DBox x={12} y={26} w={110} h={24} label="model eval" sub="capability" color={B} />
        <DBox x={130} y={26} w={120} h={24} label="application eval" sub="RAG · agents" color={G} />
        <DBox x={258} y={26} w={112} h={24} label="production eval" sub="latency · drift" color={P} />
        <DLabel x={12} y={70} text="RAG" color={G} />
        <DBox x={12} y={78} w={100} h={22} label="retrieval" sub="recall@k · nDCG" color={G} />
        <DBox x={120} y={78} w={110} h={22} label="generation" sub="faithfulness · cited" color={G} />
        <DLabel x={12} y={122} text="agent trajectory" color={A} />
        <Chain y={130} bw={56} gap={8} x0={12} items={[
          { label: 'plan' }, { label: 'tool sel', color: A }, { label: 'args', color: A }, { label: 'steps', sub: 'vs optimal' }, { label: 'success', color: G },
        ]} />
        <DBox x={12} y={172} w={358} h={20} label="run in CI on every prompt / model / index change → block on regression" color={Y} />
      </DFrame>
    ),
  },

  // ---------------------------------------------------------------- security
  'llm-security': {
    concept: [
      'Prompt injection comes in two forms. Direct: the user types "ignore previous instructions" to override the system prompt. Indirect: hostile instructions hide inside content the model later reads — a web page, a retrieved document, a tool result — and hijack a downstream action. Indirect is the real danger for RAG and agents, because the attacker never speaks to the model.',
      'The defence is not a prompt — it is architecture. Treat every retrieved chunk and tool output as untrusted data, never instructions; structurally separate the two (delimiters, spotlighting); enforce authorization in code at the tool boundary with least privilege; require human approval for irreversible actions; add injection classifiers and canary tokens. No single layer is complete.',
      'Excessive agency is when the agent can do more than the task needs — delete, pay, email, run shell. One bad instruction then becomes real damage. Contain it with a small allow-listed tool set, per-tool scopes and rate limits, dry-run/confirm for writes, a sandbox, a hard budget and a kill switch, and provenance logging on every call. Red-team by seeding your own corpus with adversarial documents and turning every successful attack into a regression test.',
    ],
    diagram: (
      <DFrame h={188}>
        <DLabel x={12} y={16} text="INDIRECT INJECTION VIA RETRIEVED CONTENT" color={A} />
        <DBox x={12} y={28} w={92} h={26} label="poisoned doc" sub={'"ignore rules…"'} color={A} />
        <DArrow x1={104} y1={41} x2={126} y2={41} />
        <DBox x={126} y={28} w={70} h={26} label="retriever" color="#3F3F46" />
        <DArrow x1={196} y1={41} x2={218} y2={41} />
        <DBox x={218} y={28} w={70} h={26} label="LLM" color={B} />
        <DArrow x1={288} y1={41} x2={310} y2={41} />
        <DBox x={310} y={28} w={60} h={26} label="tool call" sub="exfil?" color={A} />
        <DLabel x={12} y={82} text="DEFENCE IN DEPTH" color={G} />
        <DBox x={12} y={92} w={112} h={22} label="data ≠ instructions" sub="spotlighting" color={G} />
        <DBox x={132} y={92} w={112} h={22} label="authz in code" sub="least privilege" color={G} />
        <DBox x={252} y={92} w={118} h={22} label="human approve writes" sub="sandbox · budget" color={G} />
        <DBox x={12} y={126} w={358} h={22} label="red-team: seed adversarial docs → measure attack success → regression tests" color={Y} />
      </DFrame>
    ),
  },
}

