// ---------------------------------------------------------------------------
// AI / ML Lab — Notebook console starters.
//
// Each notebook is a list of cells that runs on a real in-browser CPython
// kernel (Pyodide) with numpy / matplotlib / pandas / scikit-learn. The
// content is original and ties into the concepts drilled elsewhere in the Lab.
// ---------------------------------------------------------------------------

export type NbCellType = 'code' | 'markdown'

export interface NbCellSeed {
  type: NbCellType
  source: string
}

export interface Notebook {
  id: string
  title: string
  blurb: string
  /** extra Pyodide packages beyond the always-loaded numpy + matplotlib */
  packages: string[]
  cells: NbCellSeed[]
}

const md = (s: string): NbCellSeed => ({ type: 'markdown', source: s.trim() })
const code = (s: string): NbCellSeed => ({ type: 'code', source: s.replace(/^\n/, '').replace(/\s+$/, '') })

export const NOTEBOOKS: Notebook[] = [
  // --------------------------------------------------------------- softmax
  {
    id: 'nb-softmax',
    title: 'Softmax & Temperature',
    blurb: 'Implement softmax from scratch and watch temperature reshape the probability mass and the entropy.',
    packages: [],
    cells: [
      md(`
# Softmax & temperature

The sampling knob every LLM exposes. \`temperature\` divides the logits **before** the exponential:
sharpen toward greedy as \`T → 0\`, flatten the tail as \`T > 1\`.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

logits = np.array([4.2, 3.6, 3.1, 2.4, 2.0, 1.6, 1.1, 0.7, 0.2, -0.4])

def softmax(x, temp=1.0):
    z = x / temp
    z = z - z.max()          # stability shift
    e = np.exp(z)
    return e / e.sum()

def entropy_bits(p):
    p = p[p > 0]
    return float(-(p * np.log2(p)).sum())

for t in (0.5, 1.0, 2.0):
    p = softmax(logits, t)
    h = entropy_bits(p)
    print(f"T={t:>4}   max p={p.max():.3f}   entropy={h:.3f} bits   effective choices={2**h:.1f}")
      `),
      code(`
x = np.arange(len(logits))
w = 0.26
fig, ax = plt.subplots(figsize=(6.4, 3.2))
for i, t in enumerate((0.5, 1.0, 2.0)):
    p = softmax(logits, t)
    ax.bar(x + i * w, p, w, label=f"T={t}")
ax.set_xlabel("token id"); ax.set_ylabel("probability")
ax.set_title("Softmax vs temperature"); ax.legend(fontsize=8)
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // --------------------------------------------------------- linear regression
  {
    id: 'nb-linreg',
    title: 'Linear Regression — two ways',
    blurb: 'Closed-form least squares versus batch gradient descent, with the training-loss curve.',
    packages: [],
    cells: [
      md(`
# Linear regression: normal equation vs gradient descent

Both minimise the same mean-squared error. The closed form solves it in one step;
gradient descent walks there — and the LR decides whether it arrives or diverges.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
X = np.linspace(-3, 3, 60)
y = 1.7 * X + 0.5 + rng.normal(0, 1.2, X.shape)
A = np.c_[X, np.ones_like(X)]          # design matrix with bias column

w_closed, *_ = np.linalg.lstsq(A, y, rcond=None)

w = np.zeros(2)
lr = 0.02
loss_hist = []
for _ in range(200):
    grad = A.T @ (A @ w - y) / len(y)
    w -= lr * grad
    loss_hist.append(float(np.mean((A @ w - y) ** 2)))

print("closed form  :", w_closed.round(3))
print("grad descent :", w.round(3))
print("final MSE     :", round(loss_hist[-1], 4))
      `),
      code(`
fig, ax = plt.subplots(1, 2, figsize=(8, 3.2))
ax[0].scatter(X, y, s=14, c="#FF4D4D")
ax[0].plot(X, A @ w_closed, c="#60A5FA", lw=2)
ax[0].set_title("fit (closed form)")
ax[1].plot(loss_hist, c="#34D399")
ax[1].set_title("gradient-descent loss"); ax[1].set_xlabel("step"); ax[1].set_ylabel("MSE")
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // ------------------------------------------------------------------ kmeans
  {
    id: 'nb-kmeans',
    title: 'K-Means + the elbow',
    blurb: 'Cluster blobs with scikit-learn and use the inertia elbow to argue for k.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# K-Means and choosing k

\`KMeans\` minimises within-cluster inertia. Inertia keeps falling as k rises, so you
look for the **elbow** — the point where extra clusters stop buying much.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans

X, _ = make_blobs(n_samples=400, centers=4, cluster_std=1.1, random_state=7)

inertias = [KMeans(k, n_init=10, random_state=0).fit(X).inertia_ for k in range(1, 9)]
print("inertia by k:", [round(v) for v in inertias])

km = KMeans(4, n_init=10, random_state=0).fit(X)
print("chosen k=4 inertia:", round(km.inertia_))
      `),
      code(`
fig, ax = plt.subplots(1, 2, figsize=(8.4, 3.4))
ax[0].scatter(X[:, 0], X[:, 1], c=km.labels_, cmap="cool", s=12)
ax[0].scatter(km.cluster_centers_[:, 0], km.cluster_centers_[:, 1],
              c="#FF4D4D", marker="X", s=110, edgecolor="white")
ax[0].set_title("k = 4")
ax[1].plot(range(1, 9), inertias, "o-", c="#FBBF24")
ax[1].set_xlabel("k"); ax[1].set_ylabel("inertia"); ax[1].set_title("elbow")
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // ----------------------------------------------------------------- metrics
  {
    id: 'nb-metrics',
    title: 'Threshold, Confusion Matrix, ROC',
    blurb: 'Train logistic regression, then sweep the decision threshold and read precision / recall / F1 / AUC.',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Classification metrics beyond accuracy

Accuracy hides the precision–recall trade-off. Move the threshold and watch them
diverge; the ROC curve and its AUC summarise every threshold at once.
      `),
      code(`
import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, precision_recall_fscore_support,
                             roc_curve, roc_auc_score)

X, y = make_classification(n_samples=800, n_features=8, n_informative=4,
                           class_sep=0.9, random_state=1)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.3, random_state=1)
clf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)
scores = clf.predict_proba(Xte)[:, 1]

for thr in (0.3, 0.5, 0.7):
    pred = (scores >= thr).astype(int)
    p, r, f1, _ = precision_recall_fscore_support(yte, pred, average="binary")
    print(f"thr {thr}:  P={p:.3f}  R={r:.3f}  F1={f1:.3f}")

print("\\nconfusion @ 0.5:\\n", confusion_matrix(yte, (scores >= 0.5).astype(int)))
print("ROC AUC:", round(roc_auc_score(yte, scores), 3))
      `),
      code(`
import matplotlib.pyplot as plt
fpr, tpr, _ = roc_curve(yte, scores)
plt.figure(figsize=(4.2, 4.2))
plt.plot(fpr, tpr, c="#FF4D4D", lw=2)
plt.plot([0, 1], [0, 1], "--", c="#3F3F46")
plt.xlabel("false positive rate"); plt.ylabel("true positive rate")
plt.title(f"ROC · AUC {roc_auc_score(yte, scores):.3f}")
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // --------------------------------------------------------------- embeddings
  {
    id: 'nb-embeddings',
    title: 'Embeddings & Cosine Retrieval',
    blurb: 'Unit-norm vectors, a cosine nearest-neighbour lookup, and why cosine ≠ dot ≠ L2.',
    packages: [],
    cells: [
      md(`
# Vector retrieval mechanics

Random vectors — this shows the *mechanics*, not real semantics. Normalise to unit
length and cosine similarity becomes a plain dot product; Euclidean distance still disagrees.
      `),
      code(`
import numpy as np
rng = np.random.default_rng(0)

vocab = ["king", "queen", "man", "woman", "paris", "france", "tokyo", "japan", "cat", "dog"]
E = rng.normal(size=(len(vocab), 16))
E /= np.linalg.norm(E, axis=1, keepdims=True)      # unit-norm rows

def nearest(word, k=3):
    i = vocab.index(word)
    sims = E @ E[i]
    order = np.argsort(-sims)
    return [(vocab[j], round(float(sims[j]), 3)) for j in order if j != i][:k]

for w in ("king", "paris", "cat"):
    print(f"{w:>6}  ->  {nearest(w)}")
      `),
      code(`
a, b = E[0], E[1]
print("cosine    :", round(float(a @ b), 3))
print("dot       :", round(float(a @ b), 3), " (equal: rows are unit-norm)")
print("euclidean :", round(float(np.linalg.norm(a - b)), 3))

# scaling b changes dot and L2 but not cosine
b2 = b * 5
print("\\nafter b *= 5")
print("cosine    :", round(float((a @ b2) / (np.linalg.norm(a) * np.linalg.norm(b2))), 3))
print("dot       :", round(float(a @ b2), 3))
print("euclidean :", round(float(np.linalg.norm(a - b2)), 3))
      `),
    ],
  },

  // ------------------------------------------------------------ bias-variance
  {
    id: 'nb-bias-variance',
    title: 'Bias–Variance with Polynomial Fits',
    blurb: 'Fit degree-1, 4 and 12 polynomials to noisy sine data and read train vs test error.',
    packages: [],
    cells: [
      md(`
# Under- and over-fitting

Degree 1 can't bend to the signal (**high bias**). Degree 12 traces the noise
(**high variance**) — train error keeps dropping while test error turns back up.
      `),
      code(`
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(1)
f = lambda x: np.sin(1.5 * x)
Xtr = np.sort(rng.uniform(-3, 3, 25))
ytr = f(Xtr) + rng.normal(0, 0.25, Xtr.shape)
Xte = np.linspace(-3, 3, 200)
yte = f(Xte)

fig, ax = plt.subplots(1, 3, figsize=(9, 3))
for k, deg in enumerate((1, 4, 12)):
    p = np.poly1d(np.polyfit(Xtr, ytr, deg))
    tr = np.mean((p(Xtr) - ytr) ** 2)
    te = np.mean((p(Xte) - yte) ** 2)
    ax[k].scatter(Xtr, ytr, s=12, c="#FF4D4D")
    ax[k].plot(Xte, p(Xte), c="#60A5FA")
    ax[k].plot(Xte, yte, "--", c="#3F3F46")
    ax[k].set_ylim(-2, 2)
    ax[k].set_title(f"deg {deg}  ·  train {tr:.2f} / test {te:.2f}", fontsize=8)
plt.tight_layout(); plt.show()
      `),
    ],
  },

  // ---------------------------------------------------------- your data (EDA)
  {
    id: 'nb-your-data',
    title: 'EDA on your own data',
    blurb: 'Upload a CSV / TSV / JSON with the Data button, then run these cells — they pick up the first file you uploaded and profile it (shape, dtypes, describe, histograms, correlation heat-map).',
    packages: ['scikit-learn'],
    cells: [
      md(`
# Explore your data

1. Click **Data** in the toolbar and pick a \`.csv\`, \`.tsv\` or \`.json\` file.
2. A \`df\` is loaded and previewed automatically.
3. Run the cells below to profile it.
      `),
      code(`
import os, pandas as pd

FILES = sorted(f for f in os.listdir('/data')) if os.path.isdir('/data') else []
assert FILES, "No file uploaded yet — click the Data button in the toolbar."

name = FILES[0]
path = '/data/' + name
df = pd.read_json(path) if name.endswith('.json') else pd.read_csv(path, sep='\\t' if name.endswith('.tsv') else ',')
print(name, '->', df.shape, 'rows x cols')
df.head(10)
      `),
      code(`# column types + missing values
summary = pd.DataFrame({
    'dtype': df.dtypes.astype(str),
    'non_null': df.notna().sum(),
    'nulls': df.isna().sum(),
    'unique': df.nunique(),
})
summary
      `),
      code('df.describe(include="all").T'),
      code(`
import matplotlib.pyplot as plt
num = df.select_dtypes('number')
if num.shape[1]:
    num.hist(figsize=(9, max(3, 2.2 * ((num.shape[1] + 2) // 3))), bins=24)
    plt.tight_layout(); plt.show()
else:
    print('no numeric columns to plot')
      `),
      code(`
import numpy as np, matplotlib.pyplot as plt
num = df.select_dtypes('number')
if num.shape[1] >= 2:
    c = num.corr()
    fig, ax = plt.subplots(figsize=(1 + 0.5 * len(c), 1 + 0.5 * len(c)))
    im = ax.imshow(c, cmap='coolwarm', vmin=-1, vmax=1)
    ax.set_xticks(range(len(c))); ax.set_xticklabels(c.columns, rotation=90, fontsize=7)
    ax.set_yticks(range(len(c))); ax.set_yticklabels(c.columns, fontsize=7)
    fig.colorbar(im, fraction=0.045); ax.set_title('correlation'); plt.tight_layout(); plt.show()
else:
    print('need at least two numeric columns for a correlation map')
      `),
    ],
  },

  // ------------------------------------------------------------------- blank
  {
    id: 'nb-scratch',
    title: 'Scratchpad',
    blurb: 'An empty kernel with numpy + matplotlib ready. Load pandas / scikit-learn with the package button, or upload a file with the Data button.',
    packages: [],
    cells: [
      md('# Scratchpad\n\nnumpy and matplotlib are already imported-ready. `Ctrl/⌘ + Enter` runs a cell, `Shift + Enter` runs and advances.'),
      code('import numpy as np\nimport matplotlib.pyplot as plt\n\nnp.random.seed(0)\nprint(np.random.randn(3, 3).round(2))'),
    ],
  },
]

export const NOTEBOOK_MAP: Record<string, Notebook> = Object.fromEntries(
  NOTEBOOKS.map((n) => [n.id, n]),
)
