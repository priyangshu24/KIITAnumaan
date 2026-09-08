// ---------------------------------------------------------------------------
// AI / ML Lab — "Practice in console" starters.
//
// Maps a drill subtopic id to a notebook the drill can open directly, with the
// input / goal / constraints / success check spelled out and a code scaffold
// to fill in. A string value references an existing notebook by id instead.
// ---------------------------------------------------------------------------

import { NOTEBOOK_MAP, type Notebook } from '@/lib/aiml-notebook-data'

const md = (s: string) => ({ type: 'markdown' as const, source: s.trim() })
const code = (s: string) => ({ type: 'code' as const, source: s.replace(/^\n/, '').replace(/\s+$/, '') })

export const DRILL_CONSOLES: Record<string, Notebook | string> = {
  // ------------------------------------------------------------- gradient descent
  'ml-math': {
    id: 'nb-drill-ml-math',
    title: 'Gradient Descent from scratch',
    blurb: 'Recover the parameters of a linear model with hand-written gradient descent.',
    packages: [],
    cells: [
      md(`
# Gradient descent from scratch

**Input** — 60 noisy points from \`y = 2·x + 1 + ε\`.
**Goal** — recover slope ≈ 2 and intercept ≈ 1 (each within ±0.05) using only gradient descent.
**Constraints** — NumPy only, no \`sklearn\`, no closed-form \`lstsq\`. Plot the loss curve.
**Success check** — final MSE < 1.1 and \`abs(w - 2) < 0.05\` and \`abs(b - 1) < 0.05\`.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
X = np.linspace(-3, 3, 60)
y = 2.0 * X + 1.0 + rng.normal(0, 1.0, X.shape)
      `),
      code(`
# TODO: implement one gradient-descent step for MSE loss on y = w*x + b
w, b = 0.0, 0.0
lr = 0.02
loss_hist = []

for step in range(400):
    y_hat = w * X + b
    err = y_hat - y
    # gradients of mean squared error
    grad_w = 2 * np.mean(err * X)
    grad_b = 2 * np.mean(err)
    w -= lr * grad_w
    b -= lr * grad_b
    loss_hist.append(float(np.mean(err ** 2)))

print(f"w = {w:.3f}   b = {b:.3f}   MSE = {loss_hist[-1]:.3f}")
assert abs(w - 2) < 0.05 and abs(b - 1) < 0.05, "not converged — tune lr / steps"
      `),
      code(`
fig, ax = plt.subplots(1, 2, figsize=(8, 3.2))
ax[0].scatter(X, y, s=14, c="#FF4D4D"); ax[0].plot(X, w * X + b, c="#60A5FA")
ax[0].set_title("fit")
ax[1].plot(loss_hist, c="#34D399"); ax[1].set_title("MSE vs step")
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // ------------------------------------------------------------- classical ML
  'classical-ml': {
    id: 'nb-drill-classical-ml',
    title: 'Train & compare three models',
    blurb: 'Fit logistic regression, a decision tree and a random forest on the same split and compare.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Compare classical models

**Input** — a synthetic binary classification set (800 rows, 8 features, class_sep ≈ 0.9).
**Goal** — train logistic regression, a decision tree and a random forest on the **same** train/test split; report accuracy and F1 for each.
**Constraints** — one \`train_test_split\` (\`random_state=1\`); no leakage; do not tune on the test set.
**Success check** — the random forest reaches F1 ≥ 0.85 on the test set, and you can explain why it beats a single tree.
      `),
      code(`
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

X, y = make_classification(n_samples=800, n_features=8, n_informative=4,
                           class_sep=0.9, random_state=1)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=1)
      `),
      code(`
models = {
    "logreg": LogisticRegression(max_iter=1000),
    "tree":   DecisionTreeClassifier(random_state=1),
    "forest": RandomForestClassifier(n_estimators=200, random_state=1),
}
for name, m in models.items():
    m.fit(Xtr, ytr)
    p = m.predict(Xte)
    print(f"{name:7s}  acc={accuracy_score(yte, p):.3f}  f1={f1_score(yte, p):.3f}")

assert f1_score(yte, models["forest"].predict(Xte)) >= 0.85
      `),
      code('# why? a single deep tree = low bias, high variance. the forest averages\n# decorrelated trees (bagging) → variance drops, accuracy up.'),
    ],
  },

  // ------------------------------------------------------------- feature engineering
  'feature-eng': {
    id: 'nb-drill-feature-eng',
    title: 'Clean a messy dataframe & find the leak',
    blurb: 'Impute, encode, scale — inside the split only — and identify the leaky column.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Preprocess without leaking

**Input** — a small dataframe with missing values, one text column, an outlier, and a column \`leak\` that is a function of the target.
**Goal** — produce a clean numeric feature matrix for train and test, and print which column leaks and why.
**Constraints** — every transform (impute, encode, scale) is **fit on the training rows only**, then applied to test. Drop the leaky column.
**Success check** — no NaNs in the output, test matrix has the same columns as train, and \`leak\` is excluded.
      `),
      code(`
import numpy as np, pandas as pd
rng = np.random.default_rng(0)
n = 200
y = rng.integers(0, 2, n)
df = pd.DataFrame({
    "age":    rng.normal(35, 8, n),
    "score":  rng.normal(0.5, 0.2, n),
    "city":   rng.choice(["NY", "SF", "LON", "TYO"], n),
    "leak":   y + rng.normal(0, 0.01, n),     # <- built from the target
})
df.loc[rng.choice(n, 20, replace=False), "age"] = np.nan
df.loc[5, "score"] = 999.0                     # outlier
      `),
      code(`
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# TODO: drop the leak, split, fit transforms on train only
X = df.drop(columns=["leak"])
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=1)

num = ["age", "score"]
cat = ["city"]

imp = SimpleImputer(strategy="median").fit(Xtr[num])
sc  = StandardScaler().fit(imp.transform(Xtr[num]))
ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore").fit(Xtr[cat])

def transform(frame):
    a = sc.transform(imp.transform(frame[num]))
    b = ohe.transform(frame[cat])
    return np.hstack([a, b])

Xtr_m, Xte_m = transform(Xtr), transform(Xte)
print("train", Xtr_m.shape, "test", Xte_m.shape, "nan?", np.isnan(Xtr_m).any())
      `),
      code(`
# the leak: correlation with the target is near-perfect and it would not
# exist at prediction time
print("corr(leak, y) =", round(float(np.corrcoef(df["leak"], y)[0, 1]), 3))
      `),
    ],
  },

  // ------------------------------------------------------------- model evaluation
  'model-eval': {
    id: 'nb-drill-model-eval',
    title: 'Metrics & threshold selection',
    blurb: 'From scores + labels to a confusion matrix, P/R/F1, ROC-AUC, PR-AUC and the best-F1 threshold.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Pick an operating point

**Input** — \`y_true\` (binary) and \`y_score\` (model probabilities) from a held-out set.
**Goal** — compute precision, recall and F1 **by hand** at threshold 0.5, then sweep thresholds and report the one that maximises F1, plus ROC-AUC and PR-AUC.
**Constraints** — implement the confusion counts yourself once; \`sklearn\` only for AUC and to check your numbers.
**Success check** — your hand P/R/F1 match \`sklearn\` to 3 dp, and you print \`best_threshold\` with its F1.
      `),
      code(`
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

X, y = make_classification(n_samples=1000, n_features=8, n_informative=4,
                           weights=[0.8, 0.2], class_sep=0.8, random_state=1)
Xtr, Xte, ytr, y_true = train_test_split(X, y, test_size=0.3, random_state=1)
y_score = LogisticRegression(max_iter=1000).fit(Xtr, ytr).predict_proba(Xte)[:, 1]
      `),
      code(`
def prf(y_true, y_pred):
    tp = int(((y_pred == 1) & (y_true == 1)).sum())
    fp = int(((y_pred == 1) & (y_true == 0)).sum())
    fn = int(((y_pred == 0) & (y_true == 1)).sum())
    p = tp / (tp + fp) if tp + fp else 0.0
    r = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * p * r / (p + r) if p + r else 0.0
    return p, r, f1

p, r, f1 = prf(y_true, (y_score >= 0.5).astype(int))
print(f"@0.5  P={p:.3f} R={r:.3f} F1={f1:.3f}")

best = max(((t, prf(y_true, (y_score >= t).astype(int))[2]) for t in np.linspace(0.05, 0.95, 91)),
          key=lambda kv: kv[1])
print(f"best_threshold = {best[0]:.2f}  (F1 = {best[1]:.3f})")
      `),
      code(`
from sklearn.metrics import roc_auc_score, average_precision_score, precision_recall_fscore_support
print("ROC-AUC", round(roc_auc_score(y_true, y_score), 3))
print("PR-AUC ", round(average_precision_score(y_true, y_score), 3))
print("sklearn @0.5", [round(x, 3) for x in precision_recall_fscore_support(
    y_true, (y_score >= 0.5).astype(int), average="binary")[:3]])
      `),
    ],
  },

  // ------------------------------------------------------------- deep learning
  'deep-learning': {
    id: 'nb-drill-deep-learning',
    title: 'Backprop a 2-layer net (NumPy)',
    blurb: 'Forward pass, chain-rule backward pass and SGD on a toy non-linear problem — no autograd.',
    packages: [],
    cells: [
      md(`
# Backprop by hand

**Input** — the XOR problem (4 points) expanded to 400 noisy points.
**Goal** — implement forward + backward + SGD for a network \`x → Linear(2,8) → ReLU → Linear(8,1) → sigmoid\` and reach ≥ 97% training accuracy.
**Constraints** — NumPy only, no PyTorch/JAX/autograd. Derive every gradient yourself.
**Success check** — accuracy ≥ 0.97 within 3000 steps and the loss curve is monotone-ish.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
base = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], float)
lab = np.array([0, 1, 1, 0], float)
idx = rng.integers(0, 4, 400)
X = base[idx] + rng.normal(0, 0.08, (400, 2))
y = lab[idx].reshape(-1, 1)
      `),
      code(`
def sigmoid(z): return 1 / (1 + np.exp(-z))

W1 = rng.normal(0, 0.5, (2, 8)); b1 = np.zeros(8)
W2 = rng.normal(0, 0.5, (8, 1)); b2 = np.zeros(1)
lr = 0.1
hist = []

for step in range(3000):
    # forward
    z1 = X @ W1 + b1
    a1 = np.maximum(0, z1)          # ReLU
    z2 = a1 @ W2 + b2
    p = sigmoid(z2)
    loss = -np.mean(y * np.log(p + 1e-9) + (1 - y) * np.log(1 - p + 1e-9))
    hist.append(loss)

    # backward
    dz2 = (p - y) / len(X)
    dW2 = a1.T @ dz2
    db2 = dz2.sum(0)
    da1 = dz2 @ W2.T
    dz1 = da1 * (z1 > 0)
    dW1 = X.T @ dz1
    db1 = dz1.sum(0)

    for prm, g in [(W1, dW1), (b1, db1), (W2, dW2), (b2, db2)]:
        prm -= lr * g

acc = float((((p >= 0.5).astype(int) == y).mean()))
print(f"loss {hist[-1]:.4f}   train acc {acc:.3f}")
assert acc >= 0.97
      `),
      code('import matplotlib.pyplot as plt\nplt.figure(figsize=(5,3)); plt.plot(hist, c="#34D399"); plt.title("BCE loss"); plt.show()'),
    ],
  },

  // ------------------------------------------------------------- CNN / RNN
  'cnn-rnn': {
    id: 'nb-drill-cnn-rnn',
    title: '2-D convolution from scratch',
    blurb: 'Implement conv2d with stride and padding, then run an edge-detection kernel over an image.',
    packages: [],
    cells: [
      md(`
# Convolution from scratch

**Input** — a 64×64 synthetic grayscale image with a bright square.
**Goal** — implement \`conv2d(img, kernel, stride, padding)\` and apply a Sobel-x edge kernel; the output should light up the vertical edges of the square.
**Constraints** — NumPy only (loops are fine); match the shape formula \`out = (H + 2p − k) // s + 1\`.
**Success check** — output shape matches the formula and the edge response is non-zero only near the square's borders.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

img = np.zeros((64, 64))
img[20:44, 20:44] = 1.0
sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], float)
      `),
      code(`
def conv2d(x, k, stride=1, padding=0):
    if padding:
        x = np.pad(x, padding)
    H, W = x.shape
    kh, kw = k.shape
    out_h = (H - kh) // stride + 1
    out_w = (W - kw) // stride + 1
    out = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            patch = x[i*stride:i*stride+kh, j*stride:j*stride+kw]
            out[i, j] = np.sum(patch * k)
    return out

edges = conv2d(img, sobel_x, stride=1, padding=1)
print("shape", edges.shape, "expected", ((64 + 2 - 3) // 1 + 1,) * 2)
      `),
      code(`
fig, ax = plt.subplots(1, 2, figsize=(7, 3.4))
ax[0].imshow(img, cmap="gray"); ax[0].set_title("input")
ax[1].imshow(np.abs(edges), cmap="magma"); ax[1].set_title("|Sobel-x|")
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // ------------------------------------------------------------- inference sizing
  'llm-inference': {
    id: 'nb-drill-llm-inference',
    title: 'How many users fit on one GPU?',
    blurb: 'Compute weights + KV cache + activations, then solve for the max concurrent batch.',
    packages: [],
    cells: [
      md(`
# Serving-memory budget

**Input** — a model config (params, layers, d_model, query/KV heads), a context length, a dtype and a GPU size.
**Goal** — compute resident memory for weights and the KV cache, then solve for the largest \`batch\` that fits, and print concurrent users.
**Constraints** — NumPy only; use \`KV = 2·layers·kv_heads·head_dim·seq·batch·bytes\`; leave 15% headroom for activations + runtime.
**Success check** — for Llama-3 8B, fp16, 8k context, 80 GB you get roughly 60–100 concurrent sequences.
      `),
      code(`
GB = 1024**3
cfg = dict(params_b=8, layers=32, d_model=4096, q_heads=32, kv_heads=8,
           seq=8192, bytes=2, gpu_gb=80, headroom=0.15)

head_dim = cfg["d_model"] / cfg["q_heads"]
weights  = cfg["params_b"] * 1e9 * cfg["bytes"]
kv_per_seq = 2 * cfg["layers"] * cfg["kv_heads"] * head_dim * cfg["seq"] * cfg["bytes"]

usable = cfg["gpu_gb"] * GB * (1 - cfg["headroom"])
max_batch = int((usable - weights) // kv_per_seq)

print(f"weights       {weights/GB:6.2f} GB")
print(f"KV / sequence {kv_per_seq/GB:6.3f} GB")
print(f"usable        {usable/GB:6.2f} GB")
print(f"max concurrent sequences: {max_batch}")
assert 40 <= max_batch <= 200
      `),
      code(`
# what changes it? try MHA (kv_heads = q_heads) or a 32k context
for kvh, seq in [(32, 8192), (8, 32768), (1, 8192)]:
    kv = 2 * cfg["layers"] * kvh * head_dim * seq * cfg["bytes"]
    print(f"kv_heads={kvh:2d} seq={seq:6d}  -> {int((usable-weights)//kv):4d} seqs")
      `),
    ],
  },

  // ------------------------------------------------------------- quantization
  'model-efficiency': {
    id: 'nb-drill-model-efficiency',
    title: 'Quantize a weight matrix to INT8',
    blurb: 'Per-tensor and per-channel symmetric int8, measure the error, see why per-channel wins.',
    packages: [],
    cells: [
      md(`
# Weight quantization from scratch

**Input** — a random \`float32\` weight matrix \`W\` (256×256) with a few large-magnitude columns (outliers).
**Goal** — implement symmetric int8 quantization (per-tensor and per-channel), dequantize, and report the mean absolute error of each.
**Constraints** — NumPy only. int8 range is [-127, 127]; scale = max(|x|) / 127.
**Success check** — per-channel error is clearly lower than per-tensor because the outlier columns no longer inflate a shared scale.
      `),
      code(`
import numpy as np
rng = np.random.default_rng(0)
W = rng.normal(0, 0.02, (256, 256)).astype(np.float32)
W[:, ::37] *= 12.0          # a handful of outlier channels
      `),
      code(`
def quant(x, axis=None):
    scale = np.max(np.abs(x), axis=axis, keepdims=True) / 127.0
    q = np.clip(np.round(x / scale), -127, 127).astype(np.int8)
    return q, scale

def dequant(q, scale):
    return q.astype(np.float32) * scale

for name, axis in [("per-tensor", None), ("per-channel (cols)", 0)]:
    q, s = quant(W, axis=axis)
    err = np.mean(np.abs(W - dequant(q, s)))
    print(f"{name:22s}  MAE = {err:.6f}")
      `),
      code('# per-channel isolates the outlier columns into their own scale — this is\n# the core idea behind AWQ / SmoothQuant.'),
    ],
  },

  // ------------------------------------------------------------- judge agreement
  'llm-eval': {
    id: 'nb-drill-llm-eval',
    title: 'Validate an LLM judge',
    blurb: 'Human vs judge scores → Spearman, Cohen’s kappa, and a position-bias check.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Is your judge trustworthy?

**Input** — arrays of human scores and LLM-judge scores over the same 120 responses, plus paired A/B judgements run in both orders.
**Goal** — report Spearman correlation and quadratic-weighted Cohen’s kappa between human and judge, and estimate position bias from the order-swapped pairs.
**Constraints** — a judge is only usable if it tracks humans; print a clear verdict.
**Success check** — you print \`spearman\`, \`kappa\` and \`position_bias\` and a one-line pass/fail.
      `),
      code(`
import numpy as np
from scipy.stats import spearmanr
from sklearn.metrics import cohen_kappa_score

rng = np.random.default_rng(0)
human = rng.integers(1, 6, 120)
judge = np.clip(human + rng.integers(-1, 2, 120), 1, 5)      # noisy but correlated

sp = spearmanr(human, judge).statistic
kp = cohen_kappa_score(human, judge, weights="quadratic")
print(f"spearman = {sp:.3f}   kappa = {kp:.3f}")
      `),
      code(`
# position bias: same pair judged as (A,B) and (B,A); if the judge is fair the
# "A wins" rate should be ~50% when A and B are equal-quality
n = 400
a_wins_AB = rng.random(n) < 0.62      # judge favours the first slot
a_wins_BA = rng.random(n) < 0.62
bias = (a_wins_AB.mean() + (1 - a_wins_BA.mean())) / 2 - 0.5
print(f"position_bias = {bias:+.3f}   (0 = fair)")
      `),
      code(`
ok = sp >= 0.6 and kp >= 0.4 and abs(bias) < 0.1
print("VERDICT:", "usable" if ok else "NOT usable — recalibrate / swap-and-average")
      `),
    ],
  },

  // ------------------------------------------------------------- self-consistency
  reasoning: {
    id: 'nb-drill-reasoning',
    title: 'Self-consistency: does voting help?',
    blurb: 'Simulate a noisy reasoner and show accuracy rising with the number of sampled traces.',
    packages: [],
    cells: [
      md(`
# Majority vote over samples

**Input** — a "reasoner" that returns the correct answer with probability \`p = 0.55\` per sample, otherwise a random wrong answer from \`k = 4\` options.
**Goal** — for N = 1, 3, 5, ..., 41 samples, take the majority answer over 4000 trials and plot accuracy vs N.
**Constraints** — NumPy only; ties broken randomly.
**Success check** — accuracy is monotonically non-decreasing in N and clearly exceeds \`p\` by N ≈ 11.
      `),
      code(`
import numpy as np, matplotlib.pyplot as plt
rng = np.random.default_rng(0)
p, k, trials = 0.55, 4, 4000
Ns = list(range(1, 42, 2))
acc = []

for N in Ns:
    correct = 0
    for _ in range(trials):
        samples = np.where(rng.random(N) < p, 0, rng.integers(1, k, N))  # 0 = right answer
        counts = np.bincount(samples, minlength=k)
        top = np.flatnonzero(counts == counts.max())
        pick = rng.choice(top)
        correct += (pick == 0)
    acc.append(correct / trials)

plt.figure(figsize=(5.2, 3.2))
plt.plot(Ns, acc, "o-", c="#FF4D4D"); plt.axhline(p, ls="--", c="#3F3F46")
plt.xlabel("samples N"); plt.ylabel("majority-vote accuracy"); plt.title("self-consistency")
plt.tight_layout(); plt.show()
print("N=1:", round(acc[0], 3), "  N=41:", round(acc[-1], 3))
      `),
    ],
  },

  // ------------------------------------------------------------- reuse existing
  rag: 'nb-embeddings',
  evals: 'nb-metrics',
  'vector-db': 'nb-embeddings',
}

// ---------------------------------------------------------------------------
// Per-subtopic "how to approach this in code" context, prepended when a
// notebook is launched from a drill question.
// ---------------------------------------------------------------------------

export const DRILL_CONSOLE_BRIEFS: Record<string, string> = {
  'ml-math':
    'Gradient descent is three lines: predict, take the gradient of the loss, step against it. Do it by hand once and every framework’s optimiser stops being magic. Watch the loss curve — if it rises, the learning rate is too large.',
  'classical-ml':
    'The skill here is disciplined comparison: one train/test split, the same X/y for every model, metrics that suit the class balance. The forest should beat the single tree — be ready to say why (variance reduction from decorrelated bagging).',
  'feature-eng':
    'Every transform is a leakage risk. Fit imputers, encoders and scalers on the training rows only, then apply to test. Before modelling, ask of each feature: would this value exist, unchanged, at prediction time?',
  'model-eval':
    'Never trust one number. Compute the confusion counts yourself so precision / recall / F1 are concrete, then sweep the threshold (0.5 is rarely optimal) and report ROC-AUC and PR-AUC together — PR-AUC is the honest one under imbalance.',
  'deep-learning':
    'Backprop is the chain rule applied layer by layer: derive ∂L/∂z at the output, then push it backward through each weight and activation. If gradients vanish or explode, look at initialisation and the activation function, not the learning rate.',
  'cnn-rnn':
    'A convolution is a sliding dot product with shared weights. Write it with plain loops first, verify the output-shape formula out = (H + 2p − k)//s + 1, then run a known kernel (Sobel) so you can see it is correct.',
  'llm-inference':
    'Serving cost is a memory budget: weights + KV cache + activations must fit the GPU. The KV cache grows with layers × kv_heads × head_dim × context × batch, so it — not the weights — usually caps concurrency. Solve for the largest batch that fits.',
  'model-efficiency':
    'Quantization error concentrates where magnitudes are large. Compute a per-tensor scale and a per-channel scale, measure the dequantization error of each, and see why isolating outlier channels (AWQ’s idea) wins.',
  'llm-eval':
    'A judge is only useful if it tracks humans. Correlate judge scores with human scores (Spearman, quadratic-weighted kappa) and probe for position bias by scoring the same pair in both orders. No agreement → the judge is noise.',
  'reasoning':
    'Self-consistency trades compute for accuracy: sample several independent reasoning traces and take the majority. Simulate a fallible reasoner and plot accuracy vs number of samples — it rises above the single-shot rate, then plateaus.',
  'rag':
    'Retrieval is a similarity search over normalised embeddings. Build the vectors, rank documents by cosine, and confirm that scaling a vector changes the dot product and L2 distance but not the cosine — the reason embeddings are normalised.',
  'vector-db':
    'Retrieval is a similarity search over normalised embeddings. Build the vectors, rank documents by cosine, and confirm that scaling a vector changes the dot product and L2 distance but not the cosine.',
}

/** the left-hand reference panel shown beside a drill-launched console */
export interface DrillBrief {
  title: string
  question: string
  subtopic: string
  /** how to approach this topic in code */
  context: string
  /** the Input / Goal / Constraints / Success markdown from the scaffold */
  io: string
  /** "how to work this in the console" steps (markdown, one per item) */
  steps: string[]
}

const HOW_TO_STEPS = [
  '**Plan first.** Write the 3–5 steps you will take *before* touching code.',
  '**Read the scaffold** on the right. It gives you the inputs and a skeleton; `# TODO` marks what to fill in.',
  '**Run cell by cell** with `Ctrl / ⌘ + Enter`. Keep the **Vars** panel open to watch array shapes.',
  '**Hit the success check.** A cell fails loudly (`assert`) until your numbers are right.',
  '**Extend.** Try the variations in the last cell, then say the drill answer out loud in your own words.',
]

/**
 * Resolve the notebook + reference brief the drill opens for a question.
 * The notebook (right pane) holds only code cells; the brief (left pane) holds
 * the question, the concept context, the how-to steps and the goal spec.
 */
export function drillConsoleFor(
  q: { id: string; q: string; subtopic: string; subtopicId: string },
): { notebook: Notebook; brief: DrillBrief } | null {
  const ref = DRILL_CONSOLES[q.subtopicId]
  if (!ref) return null
  const base: Notebook | undefined = typeof ref === 'string' ? NOTEBOOK_MAP[ref] : ref
  if (!base) return null

  const firstMd = (base.cells[0]?.type === 'markdown' ? base.cells[0].source : '')
    .replace(/^\s*#\s+.*\n+/, '') // drop the redundant title line
  const codeCells = base.cells.filter((c) => c.type === 'code')

  return {
    notebook: {
      ...base,
      id: `nb-drill-${q.id}`,
      cells: codeCells.length ? codeCells : base.cells,
    },
    brief: {
      title: base.title,
      question: q.q,
      subtopic: q.subtopic,
      context: DRILL_CONSOLE_BRIEFS[q.subtopicId]
        ?? 'Work through the scaffold one cell at a time and check every assertion.',
      io: firstMd,
      steps: HOW_TO_STEPS,
    },
  }
}
