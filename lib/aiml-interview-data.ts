// ---------------------------------------------------------------------------
// AI / ML Interview Track — enterprise-grade question bank
//
// Levels: Fresher (entry / campus), SDE II (3-6 yrs), SDE III (senior / staff).
// Every subtopic carries a definition, graded questions with answer outlines,
// and a curated reading list of primary sources.
// ---------------------------------------------------------------------------

export type AimlLevel = 'Fresher' | 'SDE II' | 'SDE III'

export const AIML_LEVELS: AimlLevel[] = ['Fresher', 'SDE II', 'SDE III']

export const LEVEL_POINTS: Record<AimlLevel, number> = {
  Fresher: 5,
  'SDE II': 10,
  'SDE III': 20,
}

export interface AimlReading {
  label: string
  url: string
}

export interface AimlQuestion {
  id: string
  q: string
  level: AimlLevel
  outline: string[]
  followUp?: string
  /** Authoritative reference for the concept this answer relies on.
   *  When omitted the UI falls back to the subtopic's first reading. */
  source?: AimlReading
}

export interface AimlSubtopic {
  id: string
  title: string
  icon: string
  tagline: string
  definition: string
  questions: AimlQuestion[]
  reading: AimlReading[]
}

export const AIML_SUBTOPICS: AimlSubtopic[] = [
  // ---------------------------------------------------------------- 1
  {
    id: 'llm-architecture',
    title: 'LLM Architecture',
    icon: 'cpu',
    tagline: 'Transformers, attention, KV cache, MoE',
    definition:
      'The transformer stack behind modern LLMs — tokenisation, embeddings, causal multi-head self-attention, feed-forward blocks and normalisation — plus the inference-time machinery (KV cache, attention kernels, positional schemes) that makes serving them economical.',
    questions: [
      {
        id: 'arch-1',
        level: 'Fresher',
        q: 'Walk through what happens to a prompt from raw text to the first generated token.',
        outline: [
          'Tokenise with BPE / SentencePiece → integer token ids.',
          'Embedding lookup, then inject position (RoPE, ALiBi or learned).',
          'N decoder blocks: causal multi-head self-attention → residual + norm → FFN → residual + norm.',
          'Final norm, LM head projects hidden state to vocabulary logits.',
          'Sampling (greedy / temperature / top-p) selects the next token id; detokenise to text.',
        ],
      },
      {
        id: 'arch-2',
        level: 'SDE II',
        q: 'Why is self-attention O(n²) in sequence length, and what production techniques reduce that cost?',
        outline: [
          'Every token attends to every other token → an n×n score matrix per head, per layer.',
          'FlashAttention: IO-aware tiling — identical maths, far less HBM traffic (constant-factor, not asymptotic).',
          'Sliding-window / local attention (Mistral) and sparse patterns (Longformer) cut the asymptotic term.',
          'MQA / GQA shrink KV memory rather than compute; quantised KV cache helps further.',
          'Long context also needs RoPE scaling (NTK-aware, YaRN) or the model degrades past its trained length.',
        ],
        followUp: 'Which of these change complexity vs which only change constants?',
      },
      {
        id: 'arch-3',
        level: 'SDE II',
        q: 'What is the KV cache, how do you size it, and how do MQA/GQA change the maths?',
        outline: [
          'Cache K and V per layer per token so each new token costs O(n) attention instead of recomputing O(n²).',
          'Size ≈ 2 × layers × kv_heads × head_dim × seq_len × batch × bytes_per_elem.',
          'At long context the KV cache — not weights — becomes the memory bottleneck and caps batch size.',
          'MQA: a single KV head shared by all query heads → large memory cut, small quality loss.',
          'GQA: g groups of KV heads — the practical middle ground used by Llama 2/3 and Mistral.',
        ],
      },
      {
        id: 'arch-4',
        level: 'SDE III',
        q: 'Compare dense and Mixture-of-Experts architectures for a production serving fleet.',
        outline: [
          'MoE routes each token to top-k of E experts → total params ≫ active FLOPs per token.',
          'Upside: markedly better quality per FLOP at the same inference cost.',
          'Downside: every expert must be resident in memory, plus all-to-all communication across ranks.',
          'Serving concerns: expert parallelism, capacity factor, token dropping, load imbalance under skewed traffic.',
          'Dense models are easier to batch, quantise and deploy; MoE wins at scale given memory and interconnect.',
        ],
      },
      {
        id: 'arch-5',
        level: 'SDE III',
        q: 'How does the positional-encoding choice affect long-context behaviour?',
        outline: [
          'Learned absolute encodings hard-cap the model at its trained length.',
          'RoPE rotates Q/K by position — relative by construction, and extendable via NTK-aware / YaRN scaling.',
          'ALiBi applies a linear distance bias to attention scores and extrapolates gracefully.',
          'Naive context extension degrades short-context quality; continued pretraining on long sequences is required.',
          'Always validate with RULER or needle-in-a-haystack, not just "it did not crash at 128k".',
        ],
      },
    ],
    reading: [
      { label: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
      { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
      { label: 'FlashAttention', url: 'https://arxiv.org/abs/2205.14135' },
      { label: 'GQA: Grouped-Query Attention', url: 'https://arxiv.org/abs/2305.13245' },
      { label: 'RoFormer (RoPE)', url: 'https://arxiv.org/abs/2104.09864' },
    ],
  },

  // ---------------------------------------------------------------- 2
  {
    id: 'fine-tuning',
    title: 'Fine-tuning',
    icon: 'sliders',
    tagline: 'SFT · LoRA / QLoRA · RLHF · DPO',
    definition:
      'Adapting a pretrained base model to a task, domain, output format or preference distribution — spanning full-parameter supervised fine-tuning, parameter-efficient methods (LoRA, QLoRA), and preference optimisation (RLHF with PPO, or DPO).',
    questions: [
      {
        id: 'ft-1',
        level: 'Fresher',
        q: 'When do you fine-tune instead of prompt-engineering or using RAG?',
        outline: [
          'RAG for knowledge and freshness; prompting for fast iteration and low commitment.',
          'Fine-tune for consistent format/tone, a narrow repeated skill, or to move work onto a smaller cheaper model.',
          'Fine-tuning teaches form and skill — it does not reliably teach facts, which still go stale.',
          'Cost and iteration-speed ladder: prompt < RAG < LoRA < full fine-tune.',
        ],
      },
      {
        id: 'ft-2',
        level: 'SDE II',
        q: 'Explain LoRA. What are rank, alpha and target modules, and how do you choose them?',
        outline: [
          'Freeze W, learn a low-rank update ΔW = B·A with rank r ≪ d → train ~0.1–1% of parameters.',
          'alpha/r is the effective scaling of the update; typical r = 8–64 with alpha ≈ 2r.',
          'Target the attention projections (q, k, v, o); add the MLP projections for harder tasks.',
          'Merge adapters at inference for zero added latency, or keep them hot-swappable for multi-tenant serving.',
          'QLoRA adds a 4-bit NF4 quantised base with bf16 adapters — 65B fine-tuning on a single 48 GB GPU.',
        ],
      },
      {
        id: 'ft-3',
        level: 'SDE II',
        q: 'Compare RLHF (PPO) with DPO.',
        outline: [
          'RLHF: train a reward model on preference pairs, then PPO-optimise the policy against it with a KL penalty.',
          'DPO: a closed-form objective on the same preference pairs — no separate reward model, no rollouts.',
          'DPO is simpler, cheaper and more stable; well-tuned PPO with online data can still exceed it.',
          'Both need a KL anchor to a reference policy or you get reward hacking and capability collapse.',
        ],
      },
      {
        id: 'ft-4',
        level: 'SDE III',
        q: 'Your fine-tune improved benchmarks but production quality dropped. Diagnose it.',
        outline: [
          'Catastrophic forgetting — check general held-out benchmarks; mix replay data back into the set.',
          'Train/eval contamination, or overfitting to a narrow eval that does not mirror real traffic.',
          'Distribution shift: training prompts ≠ production prompt distribution (length, messiness, language).',
          'Format lock-in — the model now answers in one rigid style regardless of intent.',
          'Remedies: lower LR, fewer epochs, LoRA over full FT, rebalance the data mixture, roll out via shadow + canary.',
        ],
      },
      {
        id: 'ft-5',
        level: 'SDE III',
        q: 'Design a fine-tuning data pipeline for a regulated enterprise.',
        outline: [
          'Source → PII detection and redaction → near-duplicate removal (MinHash/LSH) → quality scoring and filtering.',
          'Track licence, consent and data residency per record; maintain full lineage and reproducible manifests.',
          'Temporal holdout for validation; contamination check against public benchmarks before training.',
          'Human review queue plus a standing red-team set; explicit sign-off gate before a training run.',
          'Post-training the model must clear both the quality eval suite and the safety suite before promotion.',
        ],
      },
    ],
    reading: [
      { label: 'LoRA', url: 'https://arxiv.org/abs/2106.09685' },
      { label: 'QLoRA', url: 'https://arxiv.org/abs/2305.14314' },
      { label: 'Direct Preference Optimization', url: 'https://arxiv.org/abs/2305.18290' },
      { label: 'InstructGPT (RLHF)', url: 'https://arxiv.org/abs/2203.02155' },
      { label: 'Hugging Face PEFT docs', url: 'https://huggingface.co/docs/peft' },
    ],
  },

  // ---------------------------------------------------------------- 3
  {
    id: 'evals',
    title: 'LLM Evals',
    icon: 'clipboard',
    tagline: 'Golden sets · LLM-as-judge · release gates',
    definition:
      'Measuring quality reliably enough to gate a release — offline golden sets, retrieval and generation metrics, rubric-based LLM-as-judge scoring, online guardrail metrics, and the statistical discipline that keeps the numbers honest.',
    questions: [
      {
        id: 'ev-1',
        level: 'Fresher',
        q: 'Why can you not evaluate an LLM feature with accuracy alone?',
        outline: [
          'Open-ended outputs have many valid phrasings, so exact match systematically under-counts correct answers.',
          'Use a mix: reference-based (ROUGE, BERTScore), rubric-based (LLM judge), and task-grounded checks.',
          'Task-grounded is strongest where available — does the code run, does the JSON validate, does the SQL return the right rows.',
          'Latency, cost and safety are first-class metrics, not afterthoughts.',
        ],
      },
      {
        id: 'ev-2',
        level: 'SDE II',
        q: 'Design an eval harness for a RAG support assistant.',
        outline: [
          'Golden set of 200–500 real queries with reference answers and the expected source documents.',
          'Retrieval metrics: recall@k, MRR, nDCG — did we even fetch the right chunk?',
          'Generation metrics: groundedness/faithfulness, answer relevance, citation correctness.',
          'Guard metrics: correct refusal on out-of-scope queries, PII leakage rate.',
          'Run in CI on every prompt, model or index change; block merge on threshold regression.',
        ],
      },
      {
        id: 'ev-3',
        level: 'SDE II',
        q: 'When is LLM-as-judge valid, and which biases must you correct for?',
        outline: [
          'Valid for scalable relative ranking and rubric scoring of open-ended output.',
          'Known biases: position, verbosity, self-preference, sycophancy, and format preference.',
          'Mitigations: randomise and average both orderings, prefer pairwise over absolute scores, anchor with few-shot examples.',
          'Always calibrate against a human-labelled sample and report the correlation (Spearman / Cohen’s kappa).',
        ],
      },
      {
        id: 'ev-4',
        level: 'SDE III',
        q: 'How do you gate a model upgrade in production?',
        outline: [
          'Tiered gates: prompt unit tests → offline golden set → safety and red-team suite → shadow → canary → full.',
          'Shadow runs on live traffic with predictions logged but not served — zero user risk.',
          'Canary serves a small slice with guardrail metrics wired to automatic rollback.',
          'Guardrails: p99 latency, cost per request, refusal rate, groundedness, thumbs-down rate.',
          'Fix the sample size up front and use sequential testing so you are not peeking your way to a false positive.',
        ],
      },
      {
        id: 'ev-5',
        level: 'SDE III',
        q: 'Public benchmark scores went up but users complain. Explain the gap.',
        outline: [
          'Contamination — the benchmark leaked into pretraining data.',
          'Benchmark distribution does not match your traffic; multiple-choice ability ≠ generation quality.',
          'Metric saturation and gaming: everyone is at 89% so a point of movement is noise.',
          'Missing dimensions — latency, tone, instruction-following on long messy real prompts.',
          'Fix: build an internal eval that mirrors production traffic and treat public benchmarks as a smoke test only.',
        ],
      },
    ],
    reading: [
      { label: 'Judging LLM-as-a-Judge (MT-Bench)', url: 'https://arxiv.org/abs/2306.05685' },
      { label: 'HELM — Holistic Evaluation', url: 'https://crfm.stanford.edu/helm/' },
      { label: 'RAGAS', url: 'https://arxiv.org/abs/2309.15217' },
      { label: 'OpenAI Evals', url: 'https://github.com/openai/evals' },
    ],
  },

  // ---------------------------------------------------------------- 4
  {
    id: 'guardrails',
    title: 'Guardrails & Safety',
    icon: 'shield',
    tagline: 'Injection defence · filtering · structured output',
    definition:
      'The control layer wrapped around a model — input validation, policy enforcement, constrained decoding, output filtering and abuse defence — that makes an LLM feature predictable and safe enough to put in front of users.',
    questions: [
      {
        id: 'gr-1',
        level: 'Fresher',
        q: 'What layers make up a guardrail system?',
        outline: [
          'Input: PII detection and redaction, injection/jailbreak detection, scope classifier, rate limiting.',
          'Model: hardened system prompt, safety-tuned model, constrained or schema-guided decoding.',
          'Output: policy and toxicity classifiers, PII scrub, schema validation, groundedness and citation checks.',
          'Operational: full logging, human escalation path, and a kill switch.',
        ],
      },
      {
        id: 'gr-2',
        level: 'SDE II',
        q: 'How do you defend a RAG or agent system against prompt injection?',
        outline: [
          'Treat retrieved documents and tool output as untrusted data — never as instructions.',
          'Structurally separate data from instructions (delimiters, spotlighting/datamarking, explicit framing).',
          'Least privilege at the tool boundary: authorisation is enforced in code, not requested in the prompt.',
          'Require human approval for irreversible actions; add injection classifiers and canary tokens.',
          'Accept that no prompt-level fix is complete — the real control is defence in depth plus authz.',
        ],
        followUp: 'What is the difference between direct and indirect prompt injection?',
      },
      {
        id: 'gr-3',
        level: 'SDE II',
        q: 'How do you guarantee the model returns valid JSON?',
        outline: [
          'Constrained / grammar-based decoding masks tokens that would break the schema (GBNF, Outlines, JSON mode).',
          'Or use the provider’s tool/function-calling API with a declared schema.',
          'Add a validate-and-repair loop with a bounded retry count.',
          'Always validate server-side before use — the model is never the last line of defence.',
        ],
      },
      {
        id: 'gr-4',
        level: 'SDE III',
        q: 'Design a content-safety pipeline for a consumer chatbot at scale.',
        outline: [
          'Tiered classifiers: cheap heuristics → small fine-tuned classifier → LLM judge only in the uncertain band.',
          'Streaming-aware: buffer and check chunks so a stream can be halted mid-generation.',
          'Per-policy thresholds tuned by harm severity — precision-weighted for low harm, recall-weighted for high harm.',
          'Appeals and human review feeding labelled data back into classifier training.',
          'Track both harmful-output rate and false-refusal rate; regional policy variants and audit logs.',
        ],
      },
      {
        id: 'gr-5',
        level: 'SDE III',
        q: 'How do you balance safety against over-refusal?',
        outline: [
          'Over-refusal is a genuine product failure — measure false-refusal rate on a benign-but-sensitive set.',
          'Calibrate thresholds per harm tier rather than one global switch.',
          'Prefer a safe completion with caveats over a hard refusal where policy allows.',
          'Red-team in both directions and A/B refusal rates alongside satisfaction.',
        ],
      },
    ],
    reading: [
      { label: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
      { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { label: 'Llama Guard', url: 'https://arxiv.org/abs/2312.06674' },
      { label: 'Prompt injection series — Simon Willison', url: 'https://simonwillison.net/series/prompt-injection/' },
    ],
  },

  // ---------------------------------------------------------------- 5
  {
    id: 'rag',
    title: 'RAG',
    icon: 'database',
    tagline: 'Ingestion · retrieval · grounding · citations',
    definition:
      'Retrieval-Augmented Generation grounds answers in fetched evidence: an ingestion pipeline (parse → chunk → embed → index) and a query path (retrieve → rerank → assemble context → generate with citations → verify groundedness).',
    questions: [
      {
        id: 'rag-1',
        level: 'Fresher',
        q: 'Walk through the RAG pipeline end to end.',
        outline: [
          'Ingest: load → parse → clean → chunk with metadata → embed → upsert into the vector index.',
          'Query: embed the question → ANN top-k with metadata filters → rerank → build the prompt.',
          'Generate with an instruction to answer only from context and to cite chunk ids.',
          'Post-check groundedness and citations before returning; expose an explicit "not found" path.',
        ],
      },
      {
        id: 'rag-2',
        level: 'SDE II',
        q: 'Retrieval fetched the right document but the answer is still wrong. Where do you look?',
        outline: [
          'Chunk boundaries split the answer — increase overlap or use parent-document (small-to-big) retrieval.',
          '"Lost in the middle": models under-attend to mid-context content — rerank and reduce k.',
          'Prompt fails to instruct grounding or provide an abstention path.',
          'Context truncation silently dropped the relevant chunk.',
          'Conflicting or duplicate chunks — dedupe and weight by recency/authority. Log retrieved vs cited ids.',
        ],
      },
      {
        id: 'rag-3',
        level: 'SDE II',
        q: 'Compare chunking strategies and how you would pick one.',
        outline: [
          'Fixed-size with overlap: trivial baseline, routinely breaks semantic units.',
          'Structure-aware / recursive (headings, markdown, code fences): much better coherence for docs.',
          'Semantic chunking on embedding-shift boundaries: highest quality, highest ingestion cost.',
          'Parent-document: embed small chunks for precision, return the larger parent for context.',
          'Rule of thumb — a chunk should be independently answerable and carry its own metadata.',
        ],
      },
      {
        id: 'rag-4',
        level: 'SDE III',
        q: 'Design RAG over 50M documents with a p95 latency budget under 800 ms.',
        outline: [
          'Two-stage retrieval: ANN (HNSW or IVF-PQ) for recall@100 → cross-encoder rerank → top-5 into the prompt.',
          'Hybrid BM25 + dense fused with reciprocal rank fusion so exact identifiers are not missed.',
          'Shard by tenant/domain; use metadata pre-filtering to shrink the search space before ANN.',
          'Layered caching: query-embedding cache, semantic cache for repeats, full-answer cache for hot questions.',
          'Budget it explicitly — embed 15 ms, ANN 40 ms, rerank 120 ms, LLM TTFT ~400 ms, then stream.',
          'Incremental ingestion with blue-green index alias swaps for reindexing.',
        ],
      },
      {
        id: 'rag-5',
        level: 'SDE III',
        q: 'How do you evaluate and monitor RAG in production?',
        outline: [
          'Offline: recall@k and nDCG for retrieval; faithfulness, answer relevance and citation precision for generation.',
          'Online: thumbs, citation click-through, human-escalation rate, "no answer found" rate.',
          'Drift: pin the embedding model version, set an index-freshness SLA, monitor query distribution.',
          'Trace every request end to end — query → retrieved chunks → final prompt → output — or you cannot debug it.',
        ],
      },
    ],
    reading: [
      { label: 'Retrieval-Augmented Generation (original paper)', url: 'https://arxiv.org/abs/2005.11401' },
      { label: 'Lost in the Middle', url: 'https://arxiv.org/abs/2307.03172' },
      { label: 'RAGAS evaluation framework', url: 'https://arxiv.org/abs/2309.15217' },
      { label: 'Anthropic — Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval' },
    ],
  },

  // ---------------------------------------------------------------- 6
  {
    id: 'agentic-llm',
    title: 'Agentic LLM',
    icon: 'bot',
    tagline: 'Tool use · planning · memory · budgets',
    definition:
      'An LLM that plans, calls tools, observes results and iterates toward a goal — adding control flow, state, error recovery and cost budgets on top of single-shot generation.',
    questions: [
      {
        id: 'ag-1',
        level: 'Fresher',
        q: 'What separates an agent from a chatbot?',
        outline: [
          'A chatbot maps text in to text out; an agent runs a loop of think → act → observe → repeat.',
          'Agents need tool schemas, persistent state, and explicit termination criteria.',
          'They fail differently: loops, wrong tool selection, and compounding errors across steps.',
        ],
      },
      {
        id: 'ag-2',
        level: 'SDE II',
        q: 'Explain the ReAct loop and its common failure modes.',
        outline: [
          'Reason (thought) → Act (tool call) → Observe (result) → repeat until the goal is met.',
          'Failures: infinite loops, hallucinated tool names/arguments, context bloat from raw observations, no backtracking.',
          'Mitigations: hard step and wall-clock budgets, observation truncation or summarisation, schema-validated calls.',
          'Retry with the structured error message fed back in; separate planner and critic roles for hard tasks.',
        ],
      },
      {
        id: 'ag-3',
        level: 'SDE II',
        q: 'How do you design tools an agent can actually use reliably?',
        outline: [
          'Small, orthogonal, verb-named tools with strict JSON schemas, descriptions and enums.',
          'Idempotent where possible; return structured errors the model can reason about and recover from.',
          'Keep the active tool count low (roughly under 20) or add a tool-retrieval routing step.',
          'Never expose a destructive operation without explicit confirmation and server-side authorisation.',
        ],
      },
      {
        id: 'ag-4',
        level: 'SDE III',
        q: 'Design a multi-agent system for automated incident triage.',
        outline: [
          'Orchestrator plus specialists: log analyst, metrics analyst, runbook retriever, remediation proposer.',
          'Shared blackboard state with an explicit handoff schema between agents.',
          'Read-only tools by default; any write or remediation action gated behind human approval.',
          'Per-agent budgets and a global deadline, with a deterministic fallback path when budgets blow.',
          'Full trace with per-step cost and latency, plus deterministic replay for post-incident review.',
        ],
      },
      {
        id: 'ag-5',
        level: 'SDE III',
        q: 'How do you make agent runs cost-predictable and debuggable?',
        outline: [
          'Enforce token, step and wall-clock budgets with graceful degradation rather than hard failure.',
          'Route cheap steps to a small model and escalate to the strong model only when needed.',
          'Cache tool results and sub-plans; deduplicate identical calls within a run.',
          'Store a structured trace (one span per step) and support replay from recorded observations.',
          'Evaluate on end-to-end task completion rate, not just per-step output quality.',
        ],
      },
    ],
    reading: [
      { label: 'ReAct: Synergizing Reasoning and Acting', url: 'https://arxiv.org/abs/2210.03629' },
      { label: 'Toolformer', url: 'https://arxiv.org/abs/2302.04761' },
      { label: 'Reflexion', url: 'https://arxiv.org/abs/2303.11366' },
      { label: 'Anthropic — Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
    ],
  },

  // ---------------------------------------------------------------- 7
  {
    id: 'agentic-rag',
    title: 'Agentic RAG',
    icon: 'workflow',
    tagline: 'Query planning · multi-hop · self-correction',
    definition:
      'RAG where retrieval itself is agent-controlled and iterative — the model decides whether to retrieve, rewrites queries, performs multi-hop lookups across sources, critiques the evidence it got back, and retries.',
    questions: [
      {
        id: 'arag-1',
        level: 'Fresher',
        q: 'How does agentic RAG differ from classic RAG?',
        outline: [
          'Classic RAG retrieves once with a fixed pipeline, then generates.',
          'Agentic RAG decides if, what and when to retrieve; it can loop, rewrite queries and pick sources.',
          'Clear win on multi-hop and ambiguous questions; the cost is extra latency and tokens.',
        ],
      },
      {
        id: 'arag-2',
        level: 'SDE II',
        q: 'Implement query decomposition for multi-hop questions.',
        outline: [
          'A planner splits the question into ordered sub-questions with explicit dependencies.',
          'Retrieve and answer each sub-question, carrying intermediate facts in run state.',
          'Synthesise a final answer from all evidence, with per-claim citations.',
          'Guardrails: cap the hop count, detect unanswerable sub-questions, and prevent drift from the original intent.',
        ],
      },
      {
        id: 'arag-3',
        level: 'SDE II',
        q: 'How does self-correcting retrieval (Self-RAG / CRAG style) work?',
        outline: [
          'A critic grades retrieved evidence as correct, ambiguous or incorrect before generation.',
          'Correct → generate; ambiguous → augment with another source; incorrect → rewrite the query and retry.',
          'A second critic pass checks groundedness of the draft answer and can force regeneration or abstention.',
          'Trade-off: meaningfully better accuracy for roughly 2–4× the latency and token cost.',
        ],
      },
      {
        id: 'arag-4',
        level: 'SDE III',
        q: 'Design agentic RAG over heterogeneous sources — a SQL warehouse, a document store and a live API.',
        outline: [
          'A router classifies intent and selects sources: text-to-SQL for structured, vector search for unstructured, tools for live data.',
          'Uniform retriever interface per source, with authorisation filters applied at query time per source.',
          'Cross-source synthesis that keeps provenance attached to each claim.',
          'An explicit fallback ladder ending in "insufficient evidence" rather than a confident guess.',
          'Evaluate each route independently as well as end to end — a bad router poisons everything downstream.',
        ],
      },
      {
        id: 'arag-5',
        level: 'SDE III',
        q: 'How do you keep agentic RAG latency acceptable?',
        outline: [
          'Fan out retrieval across sources in parallel rather than sequentially.',
          'Adaptive retrieval: exit after round one when confidence is already high.',
          'Small model for routing and critique, large model reserved for final synthesis.',
          'Stream a partial answer while verification runs in the background.',
          'Semantic cache keyed on decomposed sub-questions, not just the raw user query.',
        ],
      },
    ],
    reading: [
      { label: 'Self-RAG', url: 'https://arxiv.org/abs/2310.11511' },
      { label: 'Corrective RAG (CRAG)', url: 'https://arxiv.org/abs/2401.15884' },
      { label: 'HyDE — Hypothetical Document Embeddings', url: 'https://arxiv.org/abs/2212.10496' },
      { label: 'Adaptive-RAG', url: 'https://arxiv.org/abs/2403.14403' },
    ],
  },

  // ---------------------------------------------------------------- 8
  {
    id: 'vector-db',
    title: 'Vector Database Concepts',
    icon: 'boxes',
    tagline: 'ANN · HNSW / IVF / PQ · hybrid · multi-tenancy',
    definition:
      'Storage and approximate-nearest-neighbour search over high-dimensional embeddings — index structures, recall/latency/memory trade-offs, metadata filtering, hybrid scoring and index lifecycle management.',
    questions: [
      {
        id: 'vdb-1',
        level: 'Fresher',
        q: 'Why use approximate nearest neighbour search instead of exact kNN?',
        outline: [
          'Exact kNN is O(N·d) per query — untenable at millions of vectors and interactive latency.',
          'ANN trades a small, measurable recall loss for orders-of-magnitude speedup.',
          'The trade-off is tunable at query time (efSearch, nprobe), so you can dial recall against latency.',
        ],
      },
      {
        id: 'vdb-2',
        level: 'SDE II',
        q: 'Compare HNSW, IVF and PQ.',
        outline: [
          'HNSW: layered navigable small-world graph — best recall/latency, high memory, slow build; tune M and efSearch.',
          'IVF: partition into nlist Voronoi cells and probe nprobe of them — lower memory, needs a training pass.',
          'PQ: compress vectors into quantised sub-codes — large memory savings, some recall loss.',
          'In practice you combine them: IVF-PQ for huge corpora, HNSW for latency-critical mid-size ones.',
          'Choose on N, memory budget, update rate and target recall — not on brand names.',
        ],
      },
      {
        id: 'vdb-3',
        level: 'SDE II',
        q: 'How do metadata filters interact with ANN search?',
        outline: [
          'Pre-filter then search: excellent for highly selective filters, slow when the filter is broad.',
          'Search then post-filter: fast, but can return fewer than k results — over-fetch k′ > k to compensate.',
          'Filter-aware graph traversal (filtered HNSW) is the modern middle ground.',
          'Structurally, partition or shard on high-cardinality keys like tenant so the filter is free.',
        ],
      },
      {
        id: 'vdb-4',
        level: 'SDE III',
        q: 'Design a multi-tenant vector store with strict isolation.',
        outline: [
          'Namespace or collection per tenant, or a mandatory partition key — a filter must never be able to leak.',
          'Authorisation enforced in the query layer in code, never asked for in the prompt.',
          'Per-tenant quotas and noisy-neighbour isolation; dedicated indexes for the largest tenants.',
          'Encryption at rest, plus a deletion path that removes vectors and any cached embeddings for GDPR.',
          'Plan the re-embedding story up front: dual-write, backfill, then an atomic alias swap.',
        ],
      },
      {
        id: 'vdb-5',
        level: 'SDE III',
        q: 'You need to upgrade the embedding model on a 100M-vector index. How?',
        outline: [
          'Vectors from different models are not comparable — you cannot mix them in one index.',
          'Build the new index in parallel and backfill with batched embedding jobs; keep the old one serving.',
          'Dual-read on a query sample to compare recall and downstream answer quality before cutover.',
          'Atomic alias/pointer swap, with the old index retained for a rollback window.',
          'Budget the compute cost explicitly; Matryoshka embeddings can give cheaper dimensionality options.',
        ],
      },
    ],
    reading: [
      { label: 'HNSW paper', url: 'https://arxiv.org/abs/1603.09320' },
      { label: 'FAISS wiki — index selection', url: 'https://github.com/facebookresearch/faiss/wiki' },
      { label: 'pgvector', url: 'https://github.com/pgvector/pgvector' },
      { label: 'Matryoshka Representation Learning', url: 'https://arxiv.org/abs/2205.13147' },
    ],
  },

  // ---------------------------------------------------------------- 9
  {
    id: 'benchmarks',
    title: 'AI Benchmark Scoring',
    icon: 'trophy',
    tagline: 'MMLU · SWE-bench · pass@k · contamination',
    definition:
      'How model capability gets quantified — the benchmark families, scoring protocols and aggregation rules, plus the contamination and statistical pitfalls that make headline leaderboard numbers misleading.',
    questions: [
      {
        id: 'bm-1',
        level: 'Fresher',
        q: 'Name the major benchmark families and what each actually measures.',
        outline: [
          'Knowledge and reasoning: MMLU, MMLU-Pro, GPQA.',
          'Code: HumanEval, MBPP, SWE-bench, LiveCodeBench.',
          'Maths: GSM8K, MATH, AIME.',
          'Instruction following and chat: IFEval, MT-Bench, Arena-Hard.',
          'Long context: RULER and needle-in-a-haystack; safety: HarmBench, ToxiGen; human preference: LMArena Elo.',
        ],
      },
      {
        id: 'bm-2',
        level: 'SDE II',
        q: 'What is benchmark contamination and how do you detect it?',
        outline: [
          'Test items present in pretraining data inflate scores without real capability gain.',
          'Detection: n-gram overlap search, canary strings, perplexity gap between the test set and paraphrases.',
          'A large drop on freshly generated or perturbed variants is a strong contamination signal.',
          'Mitigate with private held-out sets and time-gated benchmarks like LiveCodeBench.',
        ],
      },
      {
        id: 'bm-3',
        level: 'SDE II',
        q: 'Define pass@k and explain its limits.',
        outline: [
          'Probability at least one of k sampled solutions passes the tests, estimated unbiasedly from n samples.',
          'It is bounded entirely by the quality of the hidden test suite — weak tests inflate it.',
          'pass@1 at temperature 0 is what production actually experiences; large k flatters models.',
          'A pass@k number without n, k and temperature disclosed is not a result.',
        ],
      },
      {
        id: 'bm-4',
        level: 'SDE III',
        q: 'Design an internal benchmark board for model selection.',
        outline: [
          'Axes: task quality on your golden sets, safety, p50/p99 latency, cost per 1k tokens, context limit, tool-calling reliability.',
          'Weight the axes to a single decision score but always display the full breakdown.',
          'Statistical rigour: fixed n per task, bootstrap confidence intervals, paired comparison on identical inputs.',
          'Allow per-model prompt tuning but disclose it — otherwise you are benchmarking your prompt, not the model.',
          'Re-run on every model release and retain raw outputs for audit.',
        ],
      },
      {
        id: 'bm-5',
        level: 'SDE III',
        q: 'Two candidate models are within 1% on your benchmark. How do you decide?',
        outline: [
          'A 1% gap is almost certainly inside the confidence interval — treat quality as tied.',
          'Decide on the other axes: cost, latency, context window, rate limits, data residency, provider reliability.',
          'Consider roadmap risk and whether fine-tuning or adapters are available.',
          'Break the tie with a live A/B on real users measured on business metrics.',
          'Or route: cheap model by default, escalate only hard queries to the expensive one.',
        ],
      },
    ],
    reading: [
      { label: 'HELM', url: 'https://crfm.stanford.edu/helm/' },
      { label: 'HumanEval / Codex paper', url: 'https://arxiv.org/abs/2107.03374' },
      { label: 'SWE-bench', url: 'https://arxiv.org/abs/2310.06770' },
      { label: 'LMArena leaderboard', url: 'https://lmarena.ai/' },
    ],
  },

  // ---------------------------------------------------------------- 10
  {
    id: 'ocr',
    title: 'OCR & Document AI',
    icon: 'scan',
    tagline: 'Detection · recognition · layout · extraction',
    definition:
      'Turning document images and PDFs into structured, machine-usable data — preprocessing, text detection and recognition, layout and reading-order understanding, and key-value/table extraction, increasingly via vision-language models.',
    questions: [
      {
        id: 'ocr-1',
        level: 'Fresher',
        q: 'Outline a classical OCR pipeline.',
        outline: [
          'Acquire → preprocess (deskew, denoise, binarise, dewarp).',
          'Text detection (DBNet, EAST, CRAFT) produces word or line boxes.',
          'Recognition (CRNN + CTC, or a transformer decoder) turns each crop into characters.',
          'Post-process: lexicon correction, confidence thresholds, regex validation.',
          'Layout analysis recovers reading order, columns and blocks.',
        ],
      },
      {
        id: 'ocr-2',
        level: 'SDE II',
        q: 'OCR works on clean scans but fails on phone photos of invoices. Fix it.',
        outline: [
          'Add perspective correction and dewarping, plus glare and shadow normalisation.',
          'Super-resolution for low-DPI captures; rotate to canonical orientation before recognition.',
          'Fine-tune the recogniser on in-domain data augmented with blur, JPEG artefacts and uneven lighting.',
          'Route low-confidence pages to a vision-language model as a fallback.',
          'Report CER/WER stratified by capture condition — the aggregate number hides the failure.',
        ],
      },
      {
        id: 'ocr-3',
        level: 'SDE II',
        q: 'How do you extract key-value pairs and tables reliably?',
        outline: [
          'Use layout-aware models that consume text plus bounding boxes plus the image (LayoutLMv3, Donut, or a VLM).',
          'Tables: table-structure recognition for rows/columns/spans, then per-cell OCR — or end-to-end to HTML/markdown.',
          'Constrain output to a schema and validate business rules (totals sum, dates parse, IDs match a pattern).',
          'Emit per-field confidence and route low-confidence fields to human review.',
        ],
      },
      {
        id: 'ocr-4',
        level: 'SDE III',
        q: 'Design a document-processing platform for 1M pages per day.',
        outline: [
          'Ingest → object storage → per-page fan-out onto a queue → GPU worker pool → extract → validate → index.',
          'Autoscale workers on queue depth; batch pages and use mixed precision to hold cost down.',
          'Idempotent per-page processing keyed on content hash, with retries and a dead-letter queue.',
          'Cost tiering: classical OCR first, VLM only for pages that fail a confidence threshold.',
          'Human-in-the-loop review UI feeding active learning back into the training set.',
          'SLOs on p95 page latency, per-field extraction accuracy and cost per page.',
        ],
      },
      {
        id: 'ocr-5',
        level: 'SDE III',
        q: 'How do you evaluate an extraction system beyond character error rate?',
        outline: [
          'Field-level precision, recall and F1 on a labelled set — the business cares about fields, not characters.',
          'Normalise before comparing (dates, currency, casing, whitespace).',
          'Track the "fully correct document" rate — it drives the human review load and therefore the cost.',
          'Stratify by vendor, template, language and capture quality to find the real failure pockets.',
          'Auto-approval rate at a fixed accuracy bar is the metric that actually expresses ROI.',
        ],
      },
    ],
    reading: [
      { label: 'LayoutLMv3', url: 'https://arxiv.org/abs/2204.08387' },
      { label: 'Donut — OCR-free document understanding', url: 'https://arxiv.org/abs/2111.15664' },
      { label: 'PaddleOCR', url: 'https://github.com/PaddlePaddle/PaddleOCR' },
      { label: 'Tesseract OCR', url: 'https://github.com/tesseract-ocr/tesseract' },
    ],
  },

  // ---------------------------------------------------------------- 11
  {
    id: 'pipelining',
    title: 'ML Pipelining & MLOps',
    icon: 'gitbranch',
    tagline: 'Orchestration · feature stores · CI/CD · monitoring',
    definition:
      'The engineering around models — reproducible, orchestrated data and training pipelines, feature management, model registries, deployment strategy and production monitoring with automated retraining.',
    questions: [
      {
        id: 'pl-1',
        level: 'Fresher',
        q: 'What are the stages of an end-to-end ML pipeline?',
        outline: [
          'Ingest → validate → feature engineering → train → evaluate → register → deploy → monitor → retrain trigger.',
          'Every stage versioned: data version plus code commit plus config, so any run is reproducible.',
          'Failure at the validation stage should stop the pipeline, not silently train on bad data.',
        ],
      },
      {
        id: 'pl-2',
        level: 'SDE II',
        q: 'What is training/serving skew and how do you eliminate it?',
        outline: [
          'The same feature computed by two code paths — batch SQL offline, a service online — that quietly disagree.',
          'Fix with a single feature definition served to both (a feature store), offline point-in-time correct and online low-latency.',
          'Point-in-time joins are essential or you leak future information into training labels.',
          'Add contract tests that compare offline and online values for sampled entities in CI.',
        ],
      },
      {
        id: 'pl-3',
        level: 'SDE II',
        q: 'How do you make a training pipeline reproducible?',
        outline: [
          'Pin the data snapshot, code commit, container image, library versions and random seeds.',
          'Log hyperparameters, metrics and artefacts to a tracking store (MLflow, Weights & Biases).',
          'Prefer deterministic ops; where nondeterminism is unavoidable, record it explicitly.',
          'Model registry entries carry lineage — exactly which data and code produced this artefact.',
        ],
      },
      {
        id: 'pl-4',
        level: 'SDE III',
        q: 'Design a retraining system with automated promotion.',
        outline: [
          'Triggers: schedule, drift threshold breach, live metric degradation, or data-volume milestone.',
          'Pipeline: build dataset → train → evaluate against the champion on a frozen holdout → safety and fairness checks.',
          'Promotion gate: challenger must beat champion by more than the confidence interval, with no regression on key slices.',
          'Rollout via shadow → canary → full, with automatic rollback on guardrail breach.',
          'Complete lineage and audit trail; explicit human approval in regulated domains.',
        ],
      },
      {
        id: 'pl-5',
        level: 'SDE III',
        q: 'Batch versus real-time inference — how do you decide, and how do you serve both?',
        outline: [
          'Batch when inputs are known ahead and latency is tolerant (nightly recommendations) — by far the cheapest.',
          'Real-time when the input only exists at request time and the user is waiting.',
          'Hybrid is usually right: precompute embeddings and candidates offline, rank online.',
          'Serving: Spark/warehouse jobs for batch; a model server (vLLM, Triton, TorchServe) with request batching for online.',
          'Share feature and model definitions across both paths or you have reintroduced skew.',
        ],
      },
    ],
    reading: [
      { label: 'Hidden Technical Debt in ML Systems', url: 'https://papers.nips.cc/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html' },
      { label: 'Google — MLOps continuous delivery levels', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning' },
      { label: 'Rules of Machine Learning', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml' },
      { label: 'MLflow documentation', url: 'https://mlflow.org/docs/latest/index.html' },
    ],
  },

  // ---------------------------------------------------------------- 12
  {
    id: 'ai-system-design',
    title: 'AI System Design',
    icon: 'network',
    tagline: 'End-to-end designs from basics to staff level',
    definition:
      'End-to-end design of AI-powered products — requirements and scale, success metrics, data flow, model choice, serving architecture, evaluation, cost and failure modes. This is the round that separates SDE II from SDE III.',
    questions: [
      {
        id: 'sd-1',
        level: 'Fresher',
        q: 'What framework do you use to attack an AI system design question?',
        outline: [
          'Clarify requirements, scale and latency budget before drawing anything.',
          'Define success metrics on two levels — product (retention, containment) and model (recall@k, groundedness).',
          'Map the data flow, then choose a model — and always state the non-ML baseline first.',
          'Cover serving architecture, evaluation and monitoring, then failure modes and cost.',
          'Close with explicit trade-offs and what you would build in v2.',
        ],
      },
      {
        id: 'sd-2',
        level: 'SDE II',
        q: 'Design semantic search over a company knowledge base.',
        outline: [
          'Ingest via connectors → parse → chunk → embed → index alongside BM25, carrying ACL metadata per chunk.',
          'Query path: apply the authorisation filter first, hybrid retrieve, rerank, optionally generate a cited answer.',
          'Freshness: incremental sync, deletions must propagate, reindex via an index alias swap.',
          'Evaluate on recall@k over golden queries, click-through, and zero-result rate.',
          'Control cost with an embedding budget per document and a cache for hot queries.',
        ],
      },
      {
        id: 'sd-3',
        level: 'SDE II',
        q: 'Design an LLM-powered customer support assistant.',
        outline: [
          'Intent router splits FAQ/RAG queries, tool-backed queries (order lookup) and straight-to-human cases.',
          'Ground answers on help-centre and policy documents with mandatory citations and an abstention path.',
          'Guardrails: PII redaction, scope classifier, and a hard rule that the bot never commits to refunds or SLAs.',
          'Human handoff carries the full transcript and retrieved context.',
          'Metrics: containment rate, CSAT, escalation rate, groundedness, cost per conversation.',
        ],
      },
      {
        id: 'sd-4',
        level: 'SDE III',
        q: 'Design a production LLM serving platform used by many internal teams.',
        outline: [
          'Gateway handles authn/z, per-team quotas and budgets, routing, retries and provider failover.',
          'Model layer: vLLM or TGI with continuous batching, paged KV cache and tensor parallelism; multi-LoRA for per-team adapters.',
          'Caching at two levels — prompt prefix cache and semantic cache for repeated questions.',
          'Observability: token accounting, per-team cost dashboards, latency SLOs and sampled traces.',
          'A central guardrail service with per-team policy config; autoscale on queue depth and GPU utilisation.',
        ],
      },
      {
        id: 'sd-5',
        level: 'SDE III',
        q: 'Design a real-time recommendation system that uses an LLM.',
        outline: [
          'Keep the classic funnel: candidate generation (two-tower + ANN) → ranking model → business rules and diversity.',
          'Use the LLM offline for content understanding — tags, summaries, embeddings — not in the hot path.',
          'Optionally re-rank only the top ~20 with a strict latency budget and aggressive caching.',
          'Online feature store reads for user and item features; budget the p99 explicitly (e.g. 100 ms total).',
          'Cold start via content-based fallback plus bandit exploration; evaluate with offline replay then online A/B.',
        ],
      },
    ],
    reading: [
      { label: 'Designing Machine Learning Systems — Chip Huyen', url: 'https://huyenchip.com/books/' },
      { label: 'vLLM / PagedAttention', url: 'https://arxiv.org/abs/2309.06180' },
      { label: 'Eugene Yan — ML system design patterns', url: 'https://eugeneyan.com/writing/' },
      { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Readiness checklist
// ---------------------------------------------------------------------------

export interface ReadinessItem {
  id: string
  label: string
  level: AimlLevel
}

export const AIML_READINESS: ReadinessItem[] = [
  { id: 'r1', level: 'Fresher', label: 'I can explain the transformer forward pass from tokens to logits.' },
  { id: 'r2', level: 'Fresher', label: 'I can describe the full RAG pipeline and say when it beats fine-tuning.' },
  { id: 'r3', level: 'Fresher', label: 'I can name three evaluation approaches beyond accuracy for an LLM feature.' },
  { id: 'r4', level: 'Fresher', label: 'I know what an embedding is and how similarity search retrieves with it.' },
  { id: 'r5', level: 'Fresher', label: 'I can list the layers of a guardrail system.' },
  { id: 'r6', level: 'SDE II', label: 'I can size a KV cache and argue the MQA / GQA trade-off.' },
  { id: 'r7', level: 'SDE II', label: 'I can configure LoRA (rank, alpha, target modules) and justify each choice.' },
  { id: 'r8', level: 'SDE II', label: 'I can design an eval harness covering both retrieval and generation metrics.' },
  { id: 'r9', level: 'SDE II', label: 'I can defend a RAG or agent system against direct and indirect prompt injection.' },
  { id: 'r10', level: 'SDE II', label: 'I can choose between HNSW, IVF and PQ for a given scale and memory budget.' },
  { id: 'r11', level: 'SDE II', label: 'I can explain training/serving skew and how a feature store removes it.' },
  { id: 'r12', level: 'SDE III', label: 'I can design RAG over 50M+ documents inside a stated p95 latency budget.' },
  { id: 'r13', level: 'SDE III', label: 'I can architect a multi-tenant LLM serving platform with quotas and guardrails.' },
  { id: 'r14', level: 'SDE III', label: 'I can define a model promotion gate with shadow, canary and auto-rollback.' },
  { id: 'r15', level: 'SDE III', label: 'I can diagnose why benchmark gains failed to transfer to production.' },
  { id: 'r16', level: 'SDE III', label: 'I can plan an embedding-model migration over a 100M-vector index with rollback.' },
]

// ---------------------------------------------------------------------------
// Aggregate helpers
// ---------------------------------------------------------------------------

export const AIML_STATS = {
  subtopics: AIML_SUBTOPICS.length,
  questions: AIML_SUBTOPICS.reduce((n, s) => n + s.questions.length, 0),
  readings: AIML_SUBTOPICS.reduce((n, s) => n + s.reading.length, 0),
  byLevel: AIML_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = AIML_SUBTOPICS.reduce((n, s) => n + s.questions.filter((q) => q.level === lvl).length, 0)
    return acc
  }, {} as Record<AimlLevel, number>),
}

export const LEVEL_COLOR: Record<AimlLevel, { text: string; bg: string; border: string }> = {
  Fresher: { text: '#10B981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.30)' },
  'SDE II': { text: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
  'SDE III': { text: '#FF4D4D', bg: 'rgba(255,77,77,0.10)', border: 'rgba(255,77,77,0.30)' },
}
