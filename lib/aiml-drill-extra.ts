// ---------------------------------------------------------------------------
// AI / ML Lab — supplementary drill subtopics (foundations).
//
// These extend AIML_SUBTOPICS (which is LLM/RAG/agents heavy) with the
// classical ML foundations interviewers still test hardest: the maths, the
// non-deep algorithms, feature engineering, evaluation and DL fundamentals.
// Merged into the drill bank by lib/aiml-lab-data.ts.
// ---------------------------------------------------------------------------

import type { AimlSubtopic } from '@/lib/aiml-interview-data'

export const AIML_EXTRA_SUBTOPICS: AimlSubtopic[] = [
  // ---------------------------------------------------------------- math
  {
    id: 'ml-math',
    title: 'Mathematics for ML',
    icon: 'sigma',
    tagline: 'Linear algebra · probability · optimisation',
    definition:
      'The maths that actually comes up: the matrix operations behind a forward pass, probability and Bayes for reasoning under uncertainty, and the calculus of gradient-based optimisation.',
    questions: [
      {
        id: 'mm-1', level: 'Fresher',
        q: 'Why is matrix multiplication the core operation of a neural network?',
        outline: [
          'A dense layer computes activation(W·x + b); W is [out × in], a batch is X·Wᵀ.',
          'Stacking layers composes linear maps, and the non-linearity between them is what adds capacity.',
          'GPUs/TPUs are built for dense matmul (GEMM) — throughput, not clever control flow.',
          'Shapes must chain: the output dim of one layer is the input dim of the next.',
        ],
      },
      {
        id: 'mm-2', level: 'Fresher',
        q: 'Explain gradient descent and what the learning rate controls.',
        outline: [
          'θ ← θ − η·∇L(θ): the gradient points uphill, so you step in the opposite direction.',
          'η too large overshoots the minimum and can diverge; too small crawls or stalls in flat regions.',
          'Schedules — warmup then cosine/step decay — trade early stability against late fine-tuning.',
          'Mini-batch/SGD trades gradient noise for far more updates per epoch.',
        ],
      },
      {
        id: 'mm-3', level: 'SDE II',
        q: "State Bayes' theorem and give one ML use.",
        outline: [
          'P(A|B) = P(B|A)·P(A) / P(B) — posterior ∝ likelihood × prior.',
          'Naive Bayes classifies by assuming features are conditionally independent given the class.',
          'MAP estimation = MLE + a prior term, which is exactly what L2 regularisation is (Gaussian prior).',
          'Also underlies calibration, A/B stopping rules and Thompson sampling.',
        ],
      },
      {
        id: 'mm-4', level: 'SDE II',
        q: 'What do eigenvectors and eigenvalues tell you, and where do they show up in ML?',
        outline: [
          'A·v = λ·v: v is a direction the map only scales (by λ), not rotates.',
          'PCA takes the eigenvectors of the covariance matrix; each eigenvalue is the variance along that axis.',
          'Spectral clustering, PageRank and the stability of iterative updates all rest on the spectrum.',
          'Condition number (λmax/λmin) predicts how badly gradient descent zig-zags.',
        ],
      },
    ],
    reading: [
      { label: '3Blue1Brown — Essence of Linear Algebra', url: 'https://www.3blue1brown.com/topics/linear-algebra' },
      { label: 'Mathematics for Machine Learning (book)', url: 'https://mml-book.github.io/' },
    ],
  },

  // ---------------------------------------------------------------- classical
  {
    id: 'classical-ml',
    title: 'Classical ML Algorithms',
    icon: 'gitbranch',
    tagline: 'Regression · trees · ensembles · clustering',
    definition:
      'The non-deep models that still win on tabular data and still get asked about: linear/logistic regression, decision trees, bagging vs boosting, SVMs and k-means.',
    questions: [
      {
        id: 'cm-1', level: 'Fresher',
        q: 'Linear vs logistic regression — what is the actual difference?',
        outline: [
          'Linear regression predicts a continuous value and is fit with squared-error loss.',
          'Logistic regression passes wᵀx through a sigmoid to a probability and is fit with cross-entropy.',
          'It is called "regression" because it models the log-odds as a linear function of the features.',
          'The decision boundary is linear in feature space; add interactions/polynomials to bend it.',
        ],
      },
      {
        id: 'cm-2', level: 'SDE II',
        q: 'How does a decision tree choose a split, and why do we ensemble trees?',
        outline: [
          'Greedily pick the feature + threshold that most reduces impurity (Gini or entropy) or variance.',
          'A single unpruned tree has low bias but high variance — it memorises noise.',
          'Bagging (Random Forest) averages many decorrelated deep trees → variance down.',
          'Boosting (XGBoost/LightGBM) fits shallow trees sequentially to the residual → bias down.',
        ],
      },
      {
        id: 'cm-3', level: 'SDE II',
        q: 'Bagging vs boosting.',
        outline: [
          'Bagging: parallel, each learner on a bootstrap sample, predictions averaged — reduces variance, hard to overfit.',
          'Boosting: sequential, each learner focuses on the previous errors — reduces bias, can overfit, needs shrinkage + early stopping.',
          'RF is forgiving of hyper-parameters; GBMs are stronger but more sensitive.',
          'Both give feature importance; boosting usually wins competitions on tabular data.',
        ],
      },
      {
        id: 'cm-4', level: 'SDE II',
        q: 'k-means: how do you choose k, and what are its failure modes?',
        outline: [
          "Lloyd's algorithm alternates assign-to-nearest and move-to-mean, minimising within-cluster inertia — only a local optimum, so use k-means++ init and several restarts.",
          'Choose k with the inertia elbow, the silhouette score, or a downstream task metric.',
          'It assumes roughly spherical, equal-size, equal-density clusters.',
          'Elongated, nested or varying-density data needs DBSCAN or a Gaussian mixture instead.',
        ],
      },
    ],
    reading: [
      { label: 'An Introduction to Statistical Learning', url: 'https://www.statlearning.com/' },
      { label: 'scikit-learn — supervised learning', url: 'https://scikit-learn.org/stable/supervised_learning.html' },
    ],
  },

  // ---------------------------------------------------------------- features
  {
    id: 'feature-eng',
    title: 'Feature Engineering & Preprocessing',
    icon: 'sliders',
    tagline: 'Missing values · encoding · scaling · leakage',
    definition:
      'Turning raw records into a matrix a model can learn from — imputation, encoding, scaling, handling imbalance — and the leakage traps that make offline numbers lie.',
    questions: [
      {
        id: 'fe-1', level: 'Fresher',
        q: 'How do you handle missing values, and when is mean vs median imputation right?',
        outline: [
          'First ask why they are missing (MCAR / MAR / MNAR) — the mechanism changes what is safe.',
          'Mean for roughly symmetric numeric columns; median when skewed or outlier-prone.',
          'Add a "was_missing" indicator column so the model can use the missingness itself.',
          'Fit the imputer on the training fold only, then apply to validation and test.',
        ],
      },
      {
        id: 'fe-2', level: 'Fresher',
        q: 'One-hot vs label vs target encoding for categorical features.',
        outline: [
          'One-hot: low-cardinality nominal features — no false ordering, but sparse and wide.',
          'Label/ordinal: only when a genuine order exists, or for tree models that can split on the integer.',
          'Target/mean encoding: high-cardinality features — strong signal, but leaks unless computed inside CV with smoothing.',
          'Hashing trick when cardinality is huge and you can tolerate collisions.',
        ],
      },
      {
        id: 'fe-3', level: 'SDE II',
        q: 'What is data leakage? Give a concrete example and how to prevent it.',
        outline: [
          'Information the model would not have at prediction time leaks into training features → great offline, poor in production.',
          'Classic: scaling or imputing on the full dataset before the split; using a future aggregate; an ID that encodes the label.',
          'Fix: fit every transform inside the CV fold (use a Pipeline), split by time for temporal problems.',
          'Audit each feature: "would this value exist, unchanged, at the moment I score a new example?"',
        ],
      },
      {
        id: 'fe-4', level: 'SDE II',
        q: 'How do you deal with class imbalance?',
        outline: [
          'Choose the metric first — PR-AUC or recall at a fixed precision, never raw accuracy.',
          'Resample inside CV only: SMOTE/oversample the minority or undersample the majority.',
          'Or keep the data and use class weights / focal loss.',
          'Tune the decision threshold on a validation set; for extreme rarity, reframe as anomaly detection.',
        ],
      },
    ],
    reading: [
      { label: 'scikit-learn — preprocessing', url: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
      { label: 'Feature Engineering for Machine Learning (Zheng & Casari)', url: 'https://www.oreilly.com/library/view/feature-engineering-for/9781491953235/' },
    ],
  },

  // ---------------------------------------------------------------- eval
  {
    id: 'model-eval',
    title: 'Model Evaluation',
    icon: 'clipboard',
    tagline: 'Precision/recall · ROC vs PR · CV · thresholds',
    definition:
      'Measuring a model honestly: the classification and regression metrics, when each is misleading, cross-validation discipline, and choosing an operating threshold.',
    questions: [
      {
        id: 'me-1', level: 'Fresher',
        q: 'Precision vs recall, and when does each matter more?',
        outline: [
          'Precision = TP/(TP+FP): of everything you flagged, how much was right.',
          'Recall = TP/(TP+FN): of everything that mattered, how much you caught.',
          'Recall dominates when misses are costly (disease, fraud); precision dominates when false alarms are costly (spam, moderation).',
          'F1 is their harmonic mean; Fβ tilts the balance.',
        ],
      },
      {
        id: 'me-2', level: 'SDE II',
        q: 'Why can accuracy mislead, and ROC-AUC vs PR-AUC?',
        outline: [
          'On imbalanced data a constant "negative" predictor scores high accuracy while being useless.',
          'ROC-AUC measures threshold-free ranking quality but is optimistic under heavy imbalance because true negatives dominate the FPR.',
          'PR-AUC focuses on the positive class and is the honest summary when positives are rare.',
          'Report both plus the confusion matrix at your chosen threshold.',
        ],
      },
      {
        id: 'me-3', level: 'SDE II',
        q: 'MAE vs MSE/RMSE vs R² for regression.',
        outline: [
          'MAE: robust, same units, all errors weighted linearly.',
          'MSE/RMSE: quadratic penalty on large errors (outlier-sensitive); RMSE is back in target units.',
          'R²: fraction of variance explained — scale-free, ≤ 1, can go negative, and hides systematic bias.',
          'Also look at residual plots and error stratified by segment.',
        ],
      },
      {
        id: 'me-4', level: 'SDE II',
        q: 'What is cross-validation and why not tune on the test set?',
        outline: [
          'k-fold rotates the validation split to get a lower-variance performance estimate on small data.',
          'Stratify for classification; use a forward-chaining split for time series.',
          'Tuning on the test set leaks it — the reported number becomes optimistic and non-reproducible.',
          'Keep a held-out test set touched once; use nested CV for unbiased model selection.',
        ],
      },
    ],
    reading: [
      { label: 'scikit-learn — model evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
      { label: 'Google ML Crash Course — classification', url: 'https://developers.google.com/machine-learning/crash-course/classification' },
    ],
  },

  // ---------------------------------------------------------------- DL
  {
    id: 'deep-learning',
    title: 'Neural Network Fundamentals',
    icon: 'network',
    tagline: 'Forward/backprop · activations · init · norm',
    definition:
      'The mechanics under every deep model: the forward pass, backpropagation via the chain rule, why non-linearities and initialisation matter, and what BatchNorm/dropout do.',
    questions: [
      {
        id: 'dl-1', level: 'Fresher',
        q: 'Walk through forward and backward propagation for a 2-layer network.',
        outline: [
          'Forward: z₁ = W₁x + b₁, a₁ = σ(z₁), z₂ = W₂a₁ + b₂, ŷ = softmax(z₂), L = cross-entropy(ŷ, y).',
          'Backward: ∂L/∂z₂ = ŷ − y, then ∂L/∂W₂ = (∂L/∂z₂)·a₁ᵀ.',
          'Chain-rule back through σ′(z₁) to get ∂L/∂W₁.',
          'Apply the optimiser update; repeat over mini-batches.',
        ],
      },
      {
        id: 'dl-2', level: 'Fresher',
        q: 'Why do we need non-linear activations, and ReLU vs sigmoid?',
        outline: [
          'Stacking linear layers collapses to a single linear map — no extra representational power.',
          'Sigmoid/tanh saturate at the tails → vanishing gradients; sigmoid is also not zero-centred.',
          'ReLU is cheap, non-saturating for x > 0, and induces sparsity — the default hidden activation.',
          '"Dying ReLU" (stuck at 0) motivates Leaky ReLU and GELU.',
        ],
      },
      {
        id: 'dl-3', level: 'SDE II',
        q: 'What causes vanishing / exploding gradients and how do you fix them?',
        outline: [
          'Backprop multiplies many Jacobian terms through depth; if they are consistently < 1 or > 1 the product vanishes or explodes.',
          'Initialisation: Xavier/Glorot for tanh, He for ReLU, to keep activation variance stable across layers.',
          'Residual/skip connections give gradients a shortcut path.',
          'Normalisation layers, gradient clipping for explosions, and gated units (LSTM/GRU) for recurrence.',
        ],
      },
      {
        id: 'dl-4', level: 'SDE II',
        q: 'BatchNorm vs LayerNorm, and what does dropout do?',
        outline: [
          'BatchNorm normalises each feature across the batch — needs a reasonable batch size and behaves differently at train vs eval.',
          'LayerNorm normalises across features within one example — batch-independent, the norm of choice for transformers and RNNs.',
          'Dropout randomly zeros activations during training (scaled at inference) → an implicit ensemble, a regulariser.',
          'They address different problems and are often used together.',
        ],
      },
    ],
    reading: [
      { label: 'CS231n — neural networks notes', url: 'https://cs231n.github.io/neural-networks-1/' },
      { label: 'Deep Learning (Goodfellow, Bengio, Courville)', url: 'https://www.deeplearningbook.org/' },
    ],
  },

  // ---------------------------------------------------------------- CNN / RNN
  {
    id: 'cnn-rnn',
    title: 'CNNs & Sequence Models',
    icon: 'workflow',
    tagline: 'Convolution · pooling · ResNet · RNN/LSTM',
    definition:
      'The two pre-transformer workhorses: convolutional nets for grid data (images), and recurrent nets (RNN/LSTM/GRU) for sequences, plus the seq2seq bottleneck that attention removed.',
    questions: [
      {
        id: 'cr-1', level: 'Fresher',
        q: 'Why are CNNs good for images? Explain convolution, stride, padding and pooling.',
        outline: [
          'Local connectivity + weight sharing give translation equivariance and far fewer parameters than a dense layer.',
          'A kernel slides over the input computing dot products → a feature map; many kernels → many channels.',
          'Stride subsamples the output; padding preserves spatial size at the borders.',
          'Pooling downsamples for local invariance and to grow the receptive field.',
        ],
      },
      {
        id: 'cr-2', level: 'SDE II',
        q: 'What is the receptive field, and why do ResNets use skip connections?',
        outline: [
          'Receptive field = the input region that influences one output unit; it grows with depth, stride and pooling.',
          'Very deep plain networks degrade — an optimisation problem, not overfitting.',
          'A residual block computes F(x) + x, so identity is easy to learn and gradients have a clear path.',
          'This is what made 100+ layer networks trainable.',
        ],
      },
      {
        id: 'cr-3', level: 'Fresher',
        q: 'Why do vanilla RNNs struggle with long sequences, and how does an LSTM help?',
        outline: [
          'Backprop-through-time multiplies the recurrent Jacobian at every step → vanishing/exploding gradients and short effective memory.',
          'An LSTM adds a cell state with additive updates plus input/forget/output gates — a gradient highway.',
          'The forget gate lets it learn what to keep and what to drop.',
          'A GRU merges gates for fewer parameters at similar quality.',
        ],
      },
      {
        id: 'cr-4', level: 'SDE II',
        q: 'What is sequence-to-sequence, and what limitation did attention remove?',
        outline: [
          'An encoder compresses the whole input into a fixed vector; a decoder generates the output from it.',
          'That fixed vector is a bottleneck — detail is lost on long inputs.',
          'Attention lets the decoder look back at every encoder state, weighted by relevance.',
          'Transformers drop recurrence entirely for parallel self-attention → longer range, much faster training.',
        ],
      },
    ],
    reading: [
      { label: 'CS231n — convolutional networks', url: 'https://cs231n.github.io/convolutional-networks/' },
      { label: 'The Illustrated Transformer', url: 'https://jalammar.github.io/illustrated-transformer/' },
    ],
  },

  // ---------------------------------------------------------------- inference
  {
    id: 'llm-inference',
    title: 'LLM Inference Engineering',
    icon: 'cpu',
    tagline: 'Prefill/decode · batching · PagedAttention · spec decoding',
    definition:
      'Serving an LLM economically: the prefill/decode split and its latency metrics, continuous batching, PagedAttention and prefix caching, and speculative decoding.',
    questions: [
      {
        id: 'li-1', level: 'SDE II',
        q: 'Prefill vs decode — why is one compute-bound and the other memory-bound?',
        outline: [
          'Prefill processes the whole prompt in parallel — large matmuls, compute-bound; it sets time-to-first-token.',
          'Decode generates one token at a time, re-reading the full KV cache each step — memory-bandwidth-bound; it sets time-per-output-token and throughput.',
          'That asymmetry motivates chunked prefill and prefill/decode disaggregation.',
          'Batching helps decode a lot (amortise the weight read) and prefill less.',
        ],
      },
      {
        id: 'li-2', level: 'SDE II',
        q: 'What is continuous batching and why does it beat static batching?',
        outline: [
          'Static batching waits for the slowest sequence in the batch, leaving the GPU idle as others finish.',
          'Continuous (in-flight) batching swaps a finished sequence out and a queued one in at every decode step.',
          'The GPU stays saturated → much higher throughput at similar latency.',
          'It is the default in vLLM / TGI / TensorRT-LLM.',
        ],
      },
      {
        id: 'li-3', level: 'SDE II',
        q: 'What problem do PagedAttention and prefix caching solve?',
        outline: [
          'A naive KV cache is one contiguous block per sequence, sized for the max length → fragmentation and over-allocation.',
          'PagedAttention stores KV in fixed-size pages with a per-sequence block table, like OS virtual memory → near-zero waste and sharing across sequences.',
          'Prefix caching reuses the KV of a shared system prompt across many requests.',
          'Together they roughly double the concurrency you can serve on the same GPU.',
        ],
      },
      {
        id: 'li-4', level: 'SDE III',
        q: 'How does speculative decoding speed up generation without changing the output distribution?',
        outline: [
          'A cheap draft model proposes k tokens; the target verifies all k in one parallel forward pass.',
          'Accepted tokens are kept; at the first rejection you resample from the corrected (target − draft) distribution.',
          'This is provably identical in distribution to sampling from the target alone.',
          'Speedup ≈ acceptance rate × cost ratio; a poor draft collapses it to the baseline.',
        ],
      },
    ],
    reading: [
      { label: 'vLLM / PagedAttention', url: 'https://arxiv.org/abs/2309.06180' },
      { label: 'How LLM inference works (DataCamp)', url: 'https://www.datacamp.com/tutorial/how-llm-inference-works' },
    ],
  },

  // ---------------------------------------------------------------- efficiency
  {
    id: 'model-efficiency',
    title: 'Model Efficiency',
    icon: 'boxes',
    tagline: 'Quantization · MoE · distillation · routing',
    definition:
      'Making a model cheaper to run: numeric quantization (INT8/INT4, GPTQ/AWQ), sparse Mixture-of-Experts, and distilling a large teacher into a small student.',
    questions: [
      {
        id: 'ef-1', level: 'Fresher',
        q: 'Why quantize, and what is weight-only vs activation quantization?',
        outline: [
          'Fewer bits → less memory and bandwidth, so more model + KV cache fits and decode speeds up.',
          'Weight-only (INT4, GPTQ/AWQ): activations stay fp16 — easy, big memory win, small quality hit.',
          'Activation quantization (W8A8, SmoothQuant): also speeds compute, but activation outliers make it harder.',
          'Quality loss concentrates in a few sensitive layers/channels — mixed precision protects them.',
        ],
      },
      {
        id: 'ef-2', level: 'SDE II',
        q: 'GPTQ vs AWQ.',
        outline: [
          'Both are post-training, weight-only, ~4-bit.',
          'GPTQ minimises layer-wise output error with a second-order (Hessian-based) column-wise update.',
          'AWQ finds the ~1% salient weight channels (by activation magnitude) and scales rather than hard-rounds them.',
          'AWQ is faster to produce and often more robust; GPTQ can be marginally more accurate.',
        ],
      },
      {
        id: 'ef-3', level: 'SDE II',
        q: 'Why can a 1T-parameter MoE model be cheaper to run than a dense 1T model?',
        outline: [
          'MoE replaces the FFN with E experts + a router sending each token to top-k (usually 1–2).',
          'Total params ≫ active params, so FLOPs per token match a much smaller dense model.',
          'Cost: every expert must be memory-resident, plus all-to-all communication across ranks.',
          'Failure mode is routing collapse / load imbalance → auxiliary load-balancing loss, capacity factor, token dropping.',
        ],
      },
      {
        id: 'ef-4', level: 'SDE II',
        q: 'Knowledge distillation — what is transferred, and can you distill reasoning?',
        outline: [
          'The student matches the teacher’s soft target distribution, which carries similarity structure ("dark knowledge") that hard labels lose; temperature softens it.',
          'Sequence-level distillation trains on teacher generations; reasoning distillation trains on teacher chain-of-thought traces.',
          'It works, but the student inherits the teacher’s mistakes and cannot exceed it.',
          'Distillation + a little RL is a common recipe for small strong models.',
        ],
      },
    ],
    reading: [
      { label: 'AWQ', url: 'https://arxiv.org/abs/2306.00978' },
      { label: 'Switch Transformer (MoE)', url: 'https://arxiv.org/abs/2101.03961' },
    ],
  },

  // ---------------------------------------------------------------- post-training
  {
    id: 'post-training',
    title: 'Post-Training & Preference Optimization',
    icon: 'sliders',
    tagline: 'SFT · DPO/ORPO/KTO · PPO vs GRPO · RLVR',
    definition:
      'Everything after pretraining: supervised fine-tuning, the DPO family of preference methods, and RL approaches (PPO, GRPO, RLVR) — each with different objectives, memory footprints and failure modes.',
    questions: [
      {
        id: 'pt-1', level: 'SDE II',
        q: 'SFT vs preference optimization vs RL — what does each actually optimise?',
        outline: [
          'SFT maximises the likelihood of curated good responses — teaches format and skill, no sense of "better vs worse".',
          'Preference optimization (DPO etc.) raises the log-prob gap between chosen and rejected pairs with a KL anchor to the SFT model — no reward model, no rollouts.',
          'RL (PPO) optimises a learned or rule-based reward with on-policy rollouts and a KL penalty — most powerful, most unstable, most expensive.',
          'All need a KL anchor or you get capability collapse / reward hacking.',
        ],
      },
      {
        id: 'pt-2', level: 'SDE II',
        q: 'DPO vs PPO-RLHF, and what do ORPO / KTO change?',
        outline: [
          'RLHF = reward model + PPO rollouts + KL; DPO = a closed-form loss on the same preference pairs — simpler, cheaper, more stable.',
          'ORPO folds the preference term into the SFT loss, so you skip a separate SFT stage.',
          'KTO uses unpaired binary "good/bad" labels (a prospect-theory loss) — much easier data collection.',
          'Well-tuned online PPO with fresh data can still beat DPO on the hardest alignment targets.',
        ],
      },
      {
        id: 'pt-3', level: 'SDE III',
        q: 'What is GRPO and how does it differ from PPO?',
        outline: [
          'PPO needs a separate learned value/critic network to compute the advantage baseline.',
          'GRPO drops the critic: sample a group of G completions per prompt, score each, and use the group mean/std as the baseline (advantage = normalised reward within the group).',
          'Far less memory and simpler; well suited to verifiable-reward reasoning tasks.',
          'Used to train DeepSeek-R1-style reasoning models.',
        ],
      },
      {
        id: 'pt-4', level: 'SDE III',
        q: 'What is RLVR, and what is reward hacking?',
        outline: [
          'RLVR = RL from Verifiable Rewards — the reward is a deterministic checker (tests pass, answer matches, JSON validates), not a learned reward model → no RM drift, cheap, hard to game the metric itself.',
          'Reward hacking = the policy maximises the proxy in a way that diverges from intent (exploiting a test blind spot, verbose hedging, format tricks).',
          'Mitigations: KL anchor, held-out verifiers, process rewards, adversarial checks.',
          'A rising reward with flat human preference is the tell-tale.',
        ],
      },
    ],
    reading: [
      { label: 'Direct Preference Optimization', url: 'https://arxiv.org/abs/2305.18290' },
      { label: 'DeepSeekMath (GRPO)', url: 'https://arxiv.org/abs/2402.03300' },
    ],
  },

  // ---------------------------------------------------------------- reasoning
  {
    id: 'reasoning',
    title: 'Reasoning & Test-Time Compute',
    icon: 'bot',
    tagline: 'CoT · self-consistency · verifiers · process reward',
    definition:
      'Getting better answers by spending more compute at inference: chain-of-thought, sampling and voting, search, and verifier/critic models — plus how to evaluate reasoning rather than just the answer.',
    questions: [
      {
        id: 'rs-1', level: 'Fresher',
        q: 'Why does chain-of-thought help, and what is self-consistency?',
        outline: [
          'CoT externalises intermediate steps into the context the model then conditions on — a hard one-shot mapping becomes a sequence of easier ones.',
          'Self-consistency samples N independent CoT traces at temperature > 0 and takes the majority answer.',
          'Independent slips average out → large gains on maths and logic.',
          'Cost scales linearly with N; diminishing returns past ~20–40 samples.',
        ],
      },
      {
        id: 'rs-2', level: 'SDE II',
        q: 'How does increasing test-time compute improve reasoning?',
        outline: [
          'More samples + a selector: majority vote, or best-of-N ranked by a reward/verifier.',
          'Or tree-of-thought search that expands and prunes partial solutions.',
          'Or iterative self-refinement with a critic.',
          'On verifiable tasks accuracy rises roughly log-linearly with the inference budget — a train-time vs test-time compute trade-off.',
        ],
      },
      {
        id: 'rs-3', level: 'SDE II',
        q: 'Process reward vs outcome reward.',
        outline: [
          'Outcome reward scores only the final answer — cheap labels, but rewards lucky guesses and gives no credit assignment.',
          'Process reward (PRM) scores each reasoning step — denser signal, catches "right answer, wrong reasoning".',
          'PRM is much better for RL and for best-of-N reranking, but needs step-level labels.',
          'Step labels can be generated automatically by checking whether a step leads to a correct completion.',
        ],
      },
      {
        id: 'rs-4', level: 'SDE III',
        q: 'A model gives the correct answer with clearly wrong reasoning. How do you evaluate it?',
        outline: [
          'Separate answer-correctness from reasoning-validity — score them independently.',
          'Use a step verifier, or an LLM-judge with a rubric that checks each step’s entailment.',
          'On a perturbed held-out set (change the numbers) a memoriser’s accuracy collapses.',
          'For training, prefer process supervision so you are not reinforcing spurious chains.',
        ],
      },
    ],
    reading: [
      { label: 'Self-Consistency (Wang et al.)', url: 'https://arxiv.org/abs/2203.11171' },
      { label: "Let's Verify Step by Step (PRM)", url: 'https://arxiv.org/abs/2305.20050' },
    ],
  },

  // ---------------------------------------------------------------- eval
  {
    id: 'llm-eval',
    title: 'LLM · RAG · Agent Evaluation',
    icon: 'clipboard',
    tagline: 'Judges & biases · faithfulness · trajectories · CI',
    definition:
      'Evaluation as an engineering discipline: the model / application / production layers, why overlap metrics fail, LLM-as-judge and its biases, RAG faithfulness and context metrics, agent trajectory scoring, and continuous eval in CI.',
    questions: [
      {
        id: 'le-1', level: 'Fresher',
        q: 'Why do BLEU / ROUGE fail for LLM output, and what replaces them?',
        outline: [
          'They measure n-gram overlap with a reference — a correct paraphrase scores low, a wrong answer that copies phrasing scores high.',
          'Replace with a mix: deterministic task checks (code runs, JSON validates, exact numeric match).',
          'Embedding / BERTScore for semantic similarity where a reference exists.',
          'Rubric-based LLM-as-judge for open-ended quality — plus latency, cost and safety as first-class metrics.',
        ],
      },
      {
        id: 'le-2', level: 'SDE II',
        q: 'LLM-as-judge: name the biases and how you correct for them.',
        outline: [
          'Position bias — swap the option order and average both runs.',
          'Verbosity/length bias — normalise or penalise length, prefer pairwise over absolute scores.',
          'Self-preference — use a different judge family or an ensemble/jury.',
          'Also format bias and prompt sensitivity; always calibrate against a human-labelled sample and report Spearman / Cohen’s kappa.',
        ],
      },
      {
        id: 'le-3', level: 'SDE II',
        q: 'RAG: retrieval recall is 95% but answers are 60% correct. Diagnose it.',
        outline: [
          'Separate retrieval metrics from generation metrics — the failure is downstream of retrieval.',
          'Likely: chunk boundaries split the fact (raise overlap / small-to-big), lost-in-the-middle (rerank, cut k), the prompt does not force grounding or an abstention path.',
          'Or context truncation dropped the cited chunk, or conflicting/duplicate chunks.',
          'Measure faithfulness (is the answer entailed by the context) and citation correctness; log retrieved-vs-cited ids.',
        ],
      },
      {
        id: 'le-4', level: 'SDE III',
        q: 'How do you evaluate an agent, and what is trajectory evaluation?',
        outline: [
          'End-to-end task success is necessary but not sufficient.',
          'Trajectory eval scores the path: tool-selection accuracy, argument correctness, plan quality, step efficiency (calls vs optimal), loop/failure/recovery rate, cost, latency, safety violations.',
          'Use deterministic graders where the environment allows (did the file get written); LLM-judge on the rest.',
          'Build the set from real failure traces and run it in CI to catch regressions.',
        ],
      },
    ],
    reading: [
      { label: 'Judging LLM-as-a-Judge (MT-Bench)', url: 'https://arxiv.org/abs/2306.05685' },
      { label: 'RAGAS', url: 'https://arxiv.org/abs/2309.15217' },
    ],
  },

  // ---------------------------------------------------------------- security
  {
    id: 'llm-security',
    title: 'LLM Security & Red-Teaming',
    icon: 'shield',
    tagline: 'Injection · jailbreaks · RAG/tool poisoning · agency',
    definition:
      'Attacking and defending LLM applications: direct and indirect prompt injection, jailbreaks, system-prompt and training-data extraction, RAG and tool poisoning, and excessive agency.',
    questions: [
      {
        id: 'ls-1', level: 'Fresher',
        q: 'Direct vs indirect prompt injection.',
        outline: [
          'Direct: the user types instructions that try to override the system prompt ("ignore previous instructions…").',
          'Indirect: malicious instructions ride in on content the model later reads — a web page, a retrieved document, a tool result — and hijack a downstream action.',
          'Indirect is the dangerous one for RAG and agents: the attacker never talks to the model directly.',
          'Both exploit that the model cannot reliably tell instructions from data.',
        ],
      },
      {
        id: 'ls-2', level: 'SDE II',
        q: 'How do you defend a RAG / agent system against injection?',
        outline: [
          'Treat all retrieved content and tool output as untrusted data, never as instructions.',
          'Structurally separate data from instructions (delimiters, spotlighting / datamarking).',
          'Enforce authorization in code at the tool boundary (least privilege) — never request it in the prompt.',
          'Require human approval for irreversible actions; add injection classifiers + canary tokens; accept that defence in depth + authz is the real control.',
        ],
      },
      {
        id: 'ls-3', level: 'SDE II',
        q: 'What is excessive agency and how do you contain it?',
        outline: [
          'The agent can take more consequential actions than the task needs (delete, pay, email, run shell) — one bad instruction becomes real damage.',
          'Contain with a small allow-listed tool set, per-tool scopes and rate limits.',
          'Dry-run / confirm for writes, sandboxed execution, a hard budget and a kill switch.',
          'Log every tool call with its provenance so you can trace an incident.',
        ],
      },
      {
        id: 'ls-4', level: 'SDE III',
        q: 'How would you red-team your own RAG system?',
        outline: [
          'Seed the corpus with adversarial documents: override instructions, data-exfiltration prompts, plausible fake "authoritative" facts.',
          'Test system-prompt extraction, jailbreak suites, and queries designed to surface PII.',
          'Check whether a poisoned chunk changes the answer or triggers a tool call.',
          'Track attack success rate and false-refusal rate; turn every successful attack into a regression test.',
        ],
      },
    ],
    reading: [
      { label: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
      { label: 'Prompt injection series — Simon Willison', url: 'https://simonwillison.net/series/prompt-injection/' },
    ],
  },
]
