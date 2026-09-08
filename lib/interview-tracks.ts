// ---------------------------------------------------------------------------
// Interview Track registry
//
// Each track reuses the AI/ML content shape: subtopics -> graded questions with
// answer outlines, plus a per-track readiness checklist and reading list.
// ---------------------------------------------------------------------------

import {
  AIML_SUBTOPICS, AIML_READINESS, AIML_LEVELS, LEVEL_POINTS,
  type AimlSubtopic, type ReadinessItem, type AimlLevel,
} from '@/lib/aiml-interview-data'
import { AIML_EXTRA_SUBTOPICS } from '@/lib/aiml-drill-extra'

export type { AimlSubtopic, ReadinessItem, AimlLevel }
export { AIML_LEVELS, LEVEL_POINTS }

export interface InterviewTrack {
  slug: string
  title: string
  short: string
  icon: string
  accent: string
  tagline: string
  description: string
  tags: string[]
  featured?: boolean
  /** Where "Start Practising" sends you — defaults to the FORCE code editor. */
  practiceHref?: string
  subtopics: AimlSubtopic[]
  readiness: ReadinessItem[]
}

// ===========================================================================
// DSA
// ===========================================================================
const DSA_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'dsa-arrays',
    title: 'Arrays & Strings',
    icon: 'grid',
    tagline: 'Two pointers · sliding window · prefix sums',
    definition:
      'Linear-scan patterns that turn brute-force O(n²) scans into O(n): two pointers on sorted or bounded data, sliding windows for contiguous constraints, and prefix sums for range queries.',
    questions: [
      {
        id: 'dsa-a1', level: 'Fresher',
        q: 'Explain the two-pointer technique and when it applies.',
        outline: [
          'Two indices move toward each other (or in the same direction) instead of a nested loop.',
          'Requires structure — sorted order, or a monotone property you can exploit.',
          'Classic uses: pair-sum on a sorted array, palindrome check, in-place dedupe, merging.',
          'Turns O(n²) into O(n) with O(1) extra space.',
        ],
      },
      {
        id: 'dsa-a2', level: 'Fresher',
        q: 'What is a sliding window, and when do you shrink it?',
        outline: [
          'Maintain a contiguous range [l, r] that satisfies a constraint.',
          'Always expand r; shrink l while the window is invalid (or while it is still valid, for "minimum" problems).',
          'Each index enters and leaves at most once → amortised O(n).',
          'Breaks down when negative values destroy monotonicity — use prefix sums + a hash map instead.',
        ],
      },
      {
        id: 'dsa-a3', level: 'SDE II',
        q: 'Longest substring without repeating characters — approach and complexity.',
        outline: [
          'Sliding window plus a map of character → last seen index.',
          'On a repeat inside the window, jump l to lastSeen + 1 rather than shrinking one at a time.',
          'O(n) time, O(min(n, alphabet)) space.',
        ],
        followUp: 'Now generalise to "at most k distinct characters".',
      },
      {
        id: 'dsa-a4', level: 'SDE III',
        q: 'Trapping Rain Water — give the O(n) time, O(1) space solution.',
        outline: [
          'Water above index i = min(maxLeft, maxRight) − height[i].',
          'Two pointers from both ends carrying leftMax and rightMax.',
          'Always advance the side with the smaller height — that side\'s bound is known to be the limiting one.',
          'Contrast with the O(n) space prefix/suffix-max arrays and the monotonic-stack variant.',
        ],
      },
    ],
    reading: [
      { label: 'NeetCode roadmap', url: 'https://neetcode.io/roadmap' },
      { label: 'CP-Algorithms', url: 'https://cp-algorithms.com/' },
      { label: 'VisuAlgo', url: 'https://visualgo.net/en' },
    ],
  },
  {
    id: 'dsa-hashing',
    title: 'Hashing & Sets',
    icon: 'hash',
    tagline: 'Maps, frequency counts, prefix-sum tricks',
    definition:
      'Trading space for time — hash maps and sets give O(1) average membership and counting, which collapses most "have I seen this before?" problems from quadratic to linear.',
    questions: [
      {
        id: 'dsa-h1', level: 'Fresher',
        q: 'When does a hash map degrade to O(n) per operation?',
        outline: [
          'Heavy collisions from a poor hash function or an adversarial key set.',
          'A high load factor with no resizing.',
          'Mitigations: randomised hashing, resize at a threshold, tree-ify long buckets (Java 8 HashMap).',
        ],
      },
      {
        id: 'dsa-h2', level: 'SDE II',
        q: 'Group anagrams — give two keying strategies and compare them.',
        outline: [
          'Key by the sorted string: O(n · k log k) but trivially correct.',
          'Key by a 26-length character-count tuple: O(n · k), better when k is large.',
          'Bucket into a map of key → list; the map is the answer.',
        ],
      },
      {
        id: 'dsa-h3', level: 'SDE II',
        q: 'Design an LRU cache with O(1) get and put.',
        outline: [
          'Hash map from key → node, plus a doubly linked list ordered by recency.',
          'get: look up, unlink the node, move it to the head.',
          'put: insert at head; if over capacity, evict the tail and delete its map entry.',
          'The map gives O(1) lookup; the list gives O(1) reordering and eviction.',
        ],
      },
      {
        id: 'dsa-h4', level: 'SDE III',
        q: 'Count subarrays summing to k, including negative numbers.',
        outline: [
          'Sliding window fails — negatives break the monotonic growth of the window sum.',
          'Use prefix sums: subarray (i, j] sums to k when prefix[j] − prefix[i] = k.',
          'Sweep once, maintaining a map of prefix-sum → count; add map[prefix − k] at each step.',
          'Seed the map with {0: 1} to count subarrays starting at index 0. O(n) time and space.',
        ],
      },
    ],
    reading: [
      { label: 'Hash table (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Hash_table' },
      { label: 'NeetCode roadmap', url: 'https://neetcode.io/roadmap' },
    ],
  },
  {
    id: 'dsa-graphs',
    title: 'Trees & Graphs',
    icon: 'gitbranch',
    tagline: 'Traversals · BFS/DFS · topological sort',
    definition:
      'Traversal and ordering over connected structures — recursive tree recursion, BFS for shortest paths and level order, DFS for reachability and cycle detection, and topological sort for dependency ordering.',
    questions: [
      {
        id: 'dsa-g1', level: 'Fresher',
        q: 'BFS vs DFS — when is each the right choice?',
        outline: [
          'BFS: shortest path in an unweighted graph, level-order traversal; queue, O(width) memory.',
          'DFS: reachability, backtracking, cycle detection, topological sort; stack/recursion, O(depth) memory.',
          'Deep narrow graphs favour DFS memory-wise; wide shallow ones favour BFS.',
        ],
      },
      {
        id: 'dsa-g2', level: 'SDE II',
        q: 'Validate a binary search tree.',
        outline: [
          'The common trap: checking only node vs its two children is wrong — it misses violations deeper down.',
          'Correct: recurse carrying a (min, max) bound that tightens on each descent.',
          'Alternative: an in-order traversal of a BST must be strictly increasing — track the previous value.',
          'Watch for duplicates and integer bounds; use nullable bounds rather than INT_MIN/MAX.',
        ],
      },
      {
        id: 'dsa-g3', level: 'SDE II',
        q: 'How does cycle detection differ between directed and undirected graphs?',
        outline: [
          'Undirected: DFS and ignore the edge back to your parent; or union-find — an edge joining two nodes already in the same set closes a cycle.',
          'Directed: a back edge to a node still on the recursion stack. Three-colour DFS (white/grey/black).',
          'Kahn\'s algorithm also detects it: if fewer than V nodes are emitted, a cycle exists.',
        ],
      },
      {
        id: 'dsa-g4', level: 'SDE III',
        q: 'Course Schedule II — produce a valid order and detect impossibility.',
        outline: [
          'Build the adjacency list and an indegree array from the prerequisite pairs.',
          'Kahn\'s BFS: seed a queue with all indegree-0 nodes, emit, decrement neighbours, enqueue new zeros.',
          'If the emitted count is less than n, the graph has a cycle → no valid ordering.',
          'O(V + E). The DFS alternative pushes onto a stack post-order and reverses.',
        ],
      },
    ],
    reading: [
      { label: 'Breadth-first search', url: 'https://en.wikipedia.org/wiki/Breadth-first_search' },
      { label: 'Topological sorting', url: 'https://en.wikipedia.org/wiki/Topological_sorting' },
      { label: 'CP-Algorithms — graphs', url: 'https://cp-algorithms.com/graph/breadth-first-search.html' },
    ],
  },
  {
    id: 'dsa-dp',
    title: 'Dynamic Programming',
    icon: 'boxes',
    tagline: 'Recurrences · memoisation · space optimisation',
    definition:
      'Solving problems with optimal substructure and overlapping subproblems by caching sub-results — top-down memoisation or bottom-up tabulation, then reducing the state dimension for space.',
    questions: [
      {
        id: 'dsa-d1', level: 'Fresher',
        q: 'What makes a problem a DP problem?',
        outline: [
          'Optimal substructure: the optimum is built from optima of subproblems.',
          'Overlapping subproblems: the same subproblem recurs, so caching pays off.',
          'Top-down memoisation is easier to derive; bottom-up tabulation avoids recursion depth and enables space tricks.',
        ],
      },
      {
        id: 'dsa-d2', level: 'SDE II',
        q: '0/1 Knapsack — state the recurrence and optimise the space.',
        outline: [
          'dp[i][w] = max(dp[i−1][w], value[i] + dp[i−1][w − weight[i]]).',
          'O(n · W) time and space with the 2D table.',
          'Collapse to a 1D array and iterate w downward, so each item is used at most once.',
          'Iterating w upward instead gives the unbounded-knapsack answer — a common bug and a good follow-up.',
        ],
      },
      {
        id: 'dsa-d3', level: 'SDE II',
        q: 'Longest Common Subsequence vs Longest Common Substring.',
        outline: [
          'LCS: on a match dp[i][j] = dp[i−1][j−1] + 1, else max(dp[i−1][j], dp[i][j−1]); answer at dp[m][n].',
          'Substring: on a mismatch the run resets to 0; track a global maximum rather than reading the corner.',
          'Both O(mn); both reduce to two rows for the length-only answer.',
        ],
      },
      {
        id: 'dsa-d4', level: 'SDE III',
        q: 'Edit Distance — recurrence, complexity, and reconstructing the operations.',
        outline: [
          'On a match dp[i][j] = dp[i−1][j−1]; otherwise 1 + min(insert dp[i][j−1], delete dp[i−1][j], replace dp[i−1][j−1]).',
          'O(mn) time and space; O(min(m, n)) space if you only need the distance.',
          'To reconstruct, keep the full table (or parent pointers) and walk back from dp[m][n].',
          'Hirschberg\'s algorithm recovers the alignment in linear space via divide and conquer.',
        ],
      },
    ],
    reading: [
      { label: 'Dynamic programming', url: 'https://en.wikipedia.org/wiki/Dynamic_programming' },
      { label: 'CP-Algorithms — DP', url: 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html' },
    ],
  },
  {
    id: 'dsa-sort',
    title: 'Sorting, Searching & Heaps',
    icon: 'sort',
    tagline: 'Binary search · quickselect · priority queues',
    definition:
      'Ordering and selection primitives — comparison sorts and their guarantees, binary search on sorted or monotone-predicate spaces, and heaps for streaming top-k and scheduling.',
    questions: [
      {
        id: 'dsa-s1', level: 'Fresher',
        q: 'When is a heap the right data structure?',
        outline: [
          'You repeatedly need the min or max of a changing collection: top-k, scheduling, streaming median.',
          'O(log n) push and pop, O(1) peek, O(n) to heapify an existing array.',
          'It gives no ordering beyond the root — do not reach for it when you need full sorted order.',
        ],
      },
      {
        id: 'dsa-s2', level: 'SDE II',
        q: 'Kth largest element — compare a heap with quickselect.',
        outline: [
          'Min-heap of size k: O(n log k) guaranteed, O(k) space, works on a stream.',
          'Quickselect: O(n) average, O(n²) worst case, in-place, but needs the whole array in memory.',
          'Pick heap for streaming or when worst-case matters; quickselect for a one-shot in-memory array.',
        ],
      },
      {
        id: 'dsa-s3', level: 'SDE II',
        q: 'Search in a rotated sorted array.',
        outline: [
          'At every step at least one half of [l, r] is properly sorted — determine which by comparing nums[l] with nums[mid].',
          'Check whether the target lies inside that sorted half; if so search it, otherwise search the other.',
          'O(log n). Duplicates degrade the worst case to O(n) because the halves become indistinguishable.',
        ],
      },
      {
        id: 'dsa-s4', level: 'SDE III',
        q: 'Merge k sorted lists — give two approaches and their trade-offs.',
        outline: [
          'Min-heap of the k current heads: pop the smallest, push its successor. O(N log k) time, O(k) space.',
          'Divide and conquer: pairwise-merge lists. Also O(N log k) with lower constant factors and no heap overhead.',
          'The naive "merge one at a time" is O(N k) — the answer they are checking you avoid.',
        ],
      },
    ],
    reading: [
      { label: 'Binary search algorithm', url: 'https://en.wikipedia.org/wiki/Binary_search_algorithm' },
      { label: 'Quickselect', url: 'https://en.wikipedia.org/wiki/Quickselect' },
      { label: 'Binary heap', url: 'https://en.wikipedia.org/wiki/Binary_heap' },
    ],
  },
]

const DSA_READINESS: ReadinessItem[] = [
  { id: 'd-r1', level: 'Fresher', label: 'I can state the time and space complexity of every solution I write.' },
  { id: 'd-r2', level: 'Fresher', label: 'I can apply two pointers and sliding window without prompting.' },
  { id: 'd-r3', level: 'SDE II', label: 'I can implement an LRU cache with O(1) get and put from scratch.' },
  { id: 'd-r4', level: 'SDE II', label: 'I can derive a DP recurrence and then optimise its space.' },
  { id: 'd-r5', level: 'SDE II', label: 'I can detect cycles in both directed and undirected graphs.' },
  { id: 'd-r6', level: 'SDE III', label: 'I can solve a hard problem in O(1) extra space when asked to.' },
]

// ===========================================================================
// SYSTEM DESIGN
// ===========================================================================
const SD_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'sd-fundamentals',
    title: 'Fundamentals & Estimation',
    icon: 'ruler',
    tagline: 'Framework · back-of-envelope · SLOs',
    definition:
      'The opening ten minutes that decide the round — scoping functional and non-functional requirements, sizing the system with back-of-envelope maths, and stating the latency and availability targets you will design against.',
    questions: [
      {
        id: 'sdq-f1', level: 'Fresher',
        q: 'What framework do you use to attack a system design question?',
        outline: [
          'Requirements: functional, then non-functional (scale, latency, availability, consistency).',
          'Estimate QPS, storage and bandwidth before drawing boxes.',
          'API sketch → data model → high-level diagram → deep dive on one or two components.',
          'Close with bottlenecks, trade-offs and what you would change at 10×.',
        ],
      },
      {
        id: 'sdq-f2', level: 'Fresher',
        q: 'Estimate the load for 100M daily users posting 10 items a day.',
        outline: [
          '1B writes/day ÷ 86,400 ≈ 11.5k writes/sec average; assume 2–3× for peak ≈ 30k/sec.',
          'Reads usually dominate — a 100:1 read/write ratio gives ~1.1M reads/sec, which forces caching and CDN.',
          'Storage: 1B × 1 KB ≈ 1 TB/day ≈ 365 TB/year before replication.',
          'State assumptions out loud; the number matters less than the reasoning.',
        ],
      },
      {
        id: 'sdq-f3', level: 'SDE II',
        q: 'Latency versus throughput — where does each dominate, and how do they trade off?',
        outline: [
          'Latency is per-request time; throughput is requests served per second.',
          'Batching and queueing raise throughput while raising latency — you pick based on the SLO.',
          'Always reason in percentiles: p99 drives user experience, the mean hides everything.',
        ],
      },
      {
        id: 'sdq-f4', level: 'SDE III',
        q: 'How do you choose SLOs and design the system to defend them?',
        outline: [
          'Pick SLIs users feel (request latency, availability, freshness), then set SLOs with an error budget.',
          'Design explicit degradation: load shedding, request prioritisation, cached or stale fallbacks.',
          'Back it with autoscaling, circuit breakers, bulkheads and timeouts at every hop.',
          'Burn-rate alerting on the error budget rather than raw threshold alerts.',
        ],
      },
    ],
    reading: [
      { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { label: 'Google SRE Book — SLOs', url: 'https://sre.google/sre-book/service-level-objectives/' },
    ],
  },
  {
    id: 'sd-scaling',
    title: 'Scaling & Caching',
    icon: 'gauge',
    tagline: 'Horizontal scale · cache strategies · CDNs',
    definition:
      'Getting more work out of the system — stateless horizontal scaling behind load balancers, multi-layer caching with a coherent invalidation story, and edge delivery.',
    questions: [
      {
        id: 'sdq-s1', level: 'Fresher',
        q: 'Vertical versus horizontal scaling.',
        outline: [
          'Vertical: a bigger machine — simple, but capped and a single point of failure.',
          'Horizontal: more machines behind a load balancer — effectively unbounded, but you must handle state.',
          'The hard part is never the stateless tier; it is the database and session state.',
        ],
      },
      {
        id: 'sdq-s2', level: 'SDE II',
        q: 'Walk through cache invalidation strategies and their failure modes.',
        outline: [
          'TTL: simple, always somewhat stale. Write-through: consistent, slower writes. Write-around: avoids cache churn on write-once data. Write-back: fastest, risks loss.',
          'Explicit invalidation on write is precise but easy to miss a path.',
          'Thundering herd on expiry — fix with request coalescing, TTL jitter, or refresh-ahead.',
          'Cache stampede protection matters more than the eviction policy in practice.',
        ],
      },
      {
        id: 'sdq-s3', level: 'SDE II',
        q: 'What belongs behind a CDN and what does not?',
        outline: [
          'Yes: static assets, images, video segments, and cacheable API GETs keyed correctly.',
          'No: user-specific dynamic responses, unless you vary on the right headers and set private caching.',
          'Watch cache keys — a stray query parameter or cookie destroys the hit rate.',
        ],
      },
      {
        id: 'sdq-s4', level: 'SDE III',
        q: 'Design a rate limiter for a distributed API gateway.',
        outline: [
          'Algorithm: token bucket for burst tolerance, sliding-window counter for smoother enforcement.',
          'State in Redis with a Lua script so check-and-decrement is atomic; key by user/API/route.',
          'Two-tier — a local in-process limiter absorbs most traffic, the shared store enforces the global cap.',
          'Handle hot keys by sharding, and decide the failure mode explicitly: fail-open or fail-closed.',
          'Return 429 with Retry-After and expose limit headers.',
        ],
      },
    ],
    reading: [
      { label: 'Caching (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Cache_(computing)' },
      { label: 'Token bucket', url: 'https://en.wikipedia.org/wiki/Token_bucket' },
    ],
  },
  {
    id: 'sd-data',
    title: 'Data Storage & Consistency',
    icon: 'database',
    tagline: 'SQL vs NoSQL · sharding · replication',
    definition:
      'Choosing and partitioning the storage layer — relational versus non-relational trade-offs, sharding strategies, replication topologies, and the consistency guarantees each choice buys or forfeits.',
    questions: [
      {
        id: 'sdq-d1', level: 'Fresher',
        q: 'SQL or NoSQL — how do you actually choose?',
        outline: [
          'Relational when you need joins, multi-row transactions and strong schema guarantees.',
          'NoSQL when the access pattern is known and narrow, and horizontal scale or schema flexibility dominates.',
          'Design NoSQL from the query pattern backwards, not from an entity diagram.',
        ],
      },
      {
        id: 'sdq-d2', level: 'SDE II',
        q: 'Compare sharding strategies and their pitfalls.',
        outline: [
          'Range sharding: keeps range queries cheap, creates hotspots on sequential keys.',
          'Hash sharding: even distribution, loses range queries.',
          'Directory-based: flexible, adds a lookup hop and a new failure point.',
          'Resharding is the real cost — consistent hashing or virtual buckets limit how much data must move.',
        ],
      },
      {
        id: 'sdq-d3', level: 'SDE II',
        q: 'Explain eventual consistency and how you still give read-your-writes.',
        outline: [
          'Replicas converge given no new writes; a read right after a write may hit a lagging replica.',
          'Read-your-writes: pin the session to the primary for a window, or route by a version/LSN token.',
          'Related guarantees worth naming: monotonic reads and consistent prefix.',
        ],
      },
      {
        id: 'sdq-d4', level: 'SDE III',
        q: 'Design a multi-region system that still offers strong guarantees where it matters.',
        outline: [
          'Split the data: strongly consistent for money/inventory, eventually consistent for feeds and counters.',
          'Single-writer region with global read replicas is the simplest strong option; consensus (Raft, Spanner-style) costs cross-region round trips.',
          'For active-active, define conflict resolution up front — CRDTs, last-write-wins with care, or application-level merge.',
          'Consider data residency and failover: RTO/RPO targets drive the topology, not the other way round.',
        ],
      },
    ],
    reading: [
      { label: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/' },
      { label: 'CAP theorem', url: 'https://en.wikipedia.org/wiki/CAP_theorem' },
      { label: 'Consistent hashing', url: 'https://en.wikipedia.org/wiki/Consistent_hashing' },
    ],
  },
  {
    id: 'sd-async',
    title: 'Messaging & Async',
    icon: 'workflow',
    tagline: 'Queues · ordering · exactly-once effects',
    definition:
      'Decoupling services with durable messaging — delivery semantics, ordering guarantees, idempotent consumers, fan-out patterns and the outbox/saga patterns that keep distributed writes coherent.',
    questions: [
      {
        id: 'sdq-a1', level: 'Fresher',
        q: 'Why put a queue between two services?',
        outline: [
          'Decouples producer and consumer lifecycles and deploy cadence.',
          'Absorbs traffic spikes so a slow consumer does not degrade the request path.',
          'Enables retries, fan-out to multiple consumers, and replay from an offset after a bug fix.',
        ],
      },
      {
        id: 'sdq-a2', level: 'SDE II',
        q: 'How do you guarantee ordering and handle duplicates?',
        outline: [
          'Global ordering is expensive — order per partition key (user id, conversation id) instead.',
          'At-least-once delivery is the norm, so consumers must be idempotent.',
          'Dedupe on a message id in a store with TTL, or make the write itself idempotent (upsert on a natural key).',
        ],
      },
      {
        id: 'sdq-a3', level: 'SDE II',
        q: 'Design a notification fan-out system.',
        outline: [
          'Fan-out on write pre-computes per-recipient inboxes — fast reads, expensive for high-follower accounts.',
          'Fan-out on read assembles at query time — cheap writes, slower reads.',
          'Hybrid: fan-out on write for normal accounts, on read for celebrities.',
          'Per-channel workers (push, email, SMS) with retries, rate limits and a dead-letter queue.',
        ],
      },
      {
        id: 'sdq-a4', level: 'SDE III',
        q: 'Design an event-driven order pipeline with exactly-once effects.',
        outline: [
          'Transactional outbox: write the domain row and the event in one local transaction, then relay via CDC.',
          'Producer-side transactions plus consumer-side idempotency keys give end-to-end exactly-once effect.',
          'Long-running flows use a saga with explicit compensating actions, not a distributed transaction.',
          'Every step needs a dead-letter path and an operator-visible replay tool.',
        ],
      },
    ],
    reading: [
      { label: 'Kafka — delivery semantics', url: 'https://kafka.apache.org/documentation/#semantics' },
      { label: 'Transactional outbox pattern', url: 'https://microservices.io/patterns/data/transactional-outbox.html' },
      { label: 'Saga pattern', url: 'https://microservices.io/patterns/data/saga.html' },
    ],
  },
  {
    id: 'sd-classics',
    title: 'Classic Designs',
    icon: 'network',
    tagline: 'URL shortener · feed · chat · scheduler',
    definition:
      'The canonical whiteboard problems. Each one exists to probe a specific axis — read-heavy caching, fan-out, real-time connections, or durable scheduling.',
    questions: [
      {
        id: 'sdq-c1', level: 'SDE II',
        q: 'Design a URL shortener.',
        outline: [
          'ID generation: base62 of a distributed counter or Snowflake id — avoids the collision handling that hashing needs.',
          'Extremely read-heavy → cache aggressively and serve redirects from the edge.',
          '301 is cacheable and fast but kills per-click analytics; 302 keeps analytics.',
          'Custom aliases need a uniqueness check; expiry needs a TTL sweep or lazy deletion.',
        ],
      },
      {
        id: 'sdq-c2', level: 'SDE II',
        q: 'Design a social news feed.',
        outline: [
          'Hybrid fan-out: precompute inboxes for normal users, merge celebrity posts at read time.',
          'Separate ranking service scoring candidates on recency, affinity and engagement.',
          'Cursor-based pagination — offset pagination breaks as the feed shifts.',
          'Cache the top N of each feed; invalidate or append rather than recompute.',
        ],
      },
      {
        id: 'sdq-c3', level: 'SDE III',
        q: 'Design a chat system like WhatsApp.',
        outline: [
          'Persistent WebSocket gateway layer with a session registry mapping user → connection node.',
          'Message store partitioned by conversation id, ordered by a per-conversation sequence.',
          'Offline delivery via a per-user queue drained on reconnect; ack-based delivery and read receipts.',
          'Presence via heartbeat with a short TTL; group messages fan out through the gateway.',
          'End-to-end encryption removes server-side search and moderation — call that trade-off out.',
        ],
      },
      {
        id: 'sdq-c4', level: 'SDE III',
        q: 'Design a distributed job scheduler.',
        outline: [
          'Durable job store plus leader election so exactly one scheduler dispatches a given shard.',
          'Time-wheel or sorted-set index on next-run time; shard by job id to scale dispatch.',
          'At-least-once dispatch with idempotent job bodies and a visibility timeout on claim.',
          'Backpressure, per-tenant concurrency limits, retry with exponential backoff, and a dead-letter queue.',
        ],
      },
    ],
    reading: [
      { label: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { label: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/' },
    ],
  },
]

const SD_READINESS: ReadinessItem[] = [
  { id: 's-r1', level: 'Fresher', label: 'I can drive the requirements + estimation phase without being prompted.' },
  { id: 's-r2', level: 'Fresher', label: 'I can do back-of-envelope QPS and storage maths out loud.' },
  { id: 's-r3', level: 'SDE II', label: 'I can pick a sharding strategy and defend it against the alternatives.' },
  { id: 's-r4', level: 'SDE II', label: 'I can design a cache layer including its invalidation and stampede story.' },
  { id: 's-r5', level: 'SDE III', label: 'I can design a multi-region system and state its consistency trade-offs.' },
  { id: 's-r6', level: 'SDE III', label: 'I can define SLOs, error budgets and explicit degradation behaviour.' },
]

// ===========================================================================
// SQL & DATABASES
// ===========================================================================
const SQL_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'sql-basics',
    title: 'Query Fundamentals',
    icon: 'database',
    tagline: 'Execution order · NULLs · DML vs DDL',
    definition:
      'The semantics interviewers probe first — the logical order the engine evaluates a query in, three-valued logic around NULL, and the difference between the statement families.',
    questions: [
      {
        id: 'sq-b1', level: 'Fresher',
        q: 'What is the logical execution order of a SELECT statement?',
        outline: [
          'FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.',
          'This is why a SELECT alias cannot be used in WHERE but can be used in ORDER BY.',
          'It also explains why WHERE cannot reference an aggregate — grouping has not happened yet.',
        ],
      },
      {
        id: 'sq-b2', level: 'Fresher',
        q: 'WHERE versus HAVING.',
        outline: [
          'WHERE filters individual rows before grouping; HAVING filters groups after aggregation.',
          'Filter in WHERE whenever you can — it reduces the rows that ever reach the grouping step.',
        ],
      },
      {
        id: 'sq-b3', level: 'SDE II',
        q: 'How do NULLs behave in comparisons, aggregates and joins?',
        outline: [
          'NULL = NULL is unknown, not true — use IS NULL / IS DISTINCT FROM.',
          'COUNT(col) skips NULLs while COUNT(*) does not; SUM and AVG ignore them.',
          'NOT IN with a NULL in the subquery returns no rows — a classic silent bug; prefer NOT EXISTS.',
          'Outer joins manufacture NULLs, so post-join filters on the outer side quietly turn it into an inner join.',
        ],
      },
      {
        id: 'sq-b4', level: 'SDE II',
        q: 'DELETE vs TRUNCATE vs DROP.',
        outline: [
          'DELETE: DML, row-by-row, fires triggers, logged, transactional and rollback-able, supports WHERE.',
          'TRUNCATE: DDL, deallocates pages, far faster, resets identity, no WHERE, limited rollback depending on engine.',
          'DROP: removes the table object and its structure entirely.',
        ],
      },
    ],
    reading: [
      { label: 'PostgreSQL — SELECT', url: 'https://www.postgresql.org/docs/current/sql-select.html' },
      { label: 'SQLZoo', url: 'https://sqlzoo.net/' },
    ],
  },
  {
    id: 'sql-joins',
    title: 'Joins & Aggregation',
    icon: 'gitbranch',
    tagline: 'Join types · dedupe · self-joins',
    definition:
      'Combining and collapsing rows — the join family and what each preserves, grouping with aggregates, and the classic interview puzzles built on self-joins and duplicate detection.',
    questions: [
      {
        id: 'sq-j1', level: 'Fresher',
        q: 'Explain INNER, LEFT, RIGHT, FULL and CROSS joins.',
        outline: [
          'INNER keeps only matched pairs; LEFT keeps all left rows; RIGHT keeps all right rows; FULL keeps both sides.',
          'CROSS is the Cartesian product — every combination, no condition.',
          'Unmatched sides come back as NULL columns, which is how you find "customers with no orders".',
        ],
      },
      {
        id: 'sq-j2', level: 'SDE II',
        q: 'Find the second-highest salary three different ways.',
        outline: [
          'MAX of salaries below the overall MAX — handles the "no second value" case by returning NULL.',
          'ORDER BY salary DESC LIMIT 1 OFFSET 1 — simple but counts duplicates as separate rows.',
          'DENSE_RANK() OVER (ORDER BY salary DESC) = 2 — the correct answer when ties should share a rank.',
          'Clarify the tie semantics with the interviewer before you pick; that is the real signal.',
        ],
      },
      {
        id: 'sq-j3', level: 'SDE II',
        q: 'Find duplicate rows and delete all but one.',
        outline: [
          'Detect with GROUP BY the identifying columns HAVING COUNT(*) > 1.',
          'Delete with a CTE assigning ROW_NUMBER() over the duplicate group and removing rn > 1.',
          'Always run the SELECT form first, inside a transaction, before converting it to a DELETE.',
        ],
      },
      {
        id: 'sq-j4', level: 'SDE III',
        q: 'Find employees earning more than their manager.',
        outline: [
          'Self-join the employee table to itself on e.manager_id = m.id.',
          'Filter WHERE e.salary > m.salary; alias both sides clearly.',
          'Employees with no manager drop out of an inner join — use a LEFT JOIN if they should be kept.',
        ],
      },
    ],
    reading: [
      { label: 'Join (SQL)', url: 'https://en.wikipedia.org/wiki/Join_(SQL)' },
      { label: 'Mode SQL tutorial', url: 'https://mode.com/sql-tutorial/' },
    ],
  },
  {
    id: 'sql-windows',
    title: 'Window Functions',
    icon: 'chart',
    tagline: 'Ranking · running totals · top-N per group',
    definition:
      'Computing across a set of rows related to the current row without collapsing them — ranking, running aggregates and per-group top-N, which is where most analytics SQL rounds land.',
    questions: [
      {
        id: 'sq-w1', level: 'Fresher',
        q: 'How does a window function differ from GROUP BY?',
        outline: [
          'GROUP BY collapses rows into one row per group; a window function keeps every row and adds a computed column.',
          'The OVER clause defines the partition and the ordering the function sees.',
          'You can therefore show a row alongside its group total in the same result set.',
        ],
      },
      {
        id: 'sq-w2', level: 'SDE II',
        q: 'ROW_NUMBER vs RANK vs DENSE_RANK.',
        outline: [
          'On values 100, 100, 90: ROW_NUMBER gives 1, 2, 3 — arbitrary tiebreak.',
          'RANK gives 1, 1, 3 — it skips the gap after a tie.',
          'DENSE_RANK gives 1, 1, 2 — no gap.',
          'Use ROW_NUMBER for deduplication, DENSE_RANK for "Nth distinct value" questions.',
        ],
      },
      {
        id: 'sq-w3', level: 'SDE II',
        q: 'Write a running total and a 7-day moving average.',
        outline: [
          'Running total: SUM(amount) OVER (PARTITION BY user ORDER BY day ROWS UNBOUNDED PRECEDING).',
          'Moving average: AVG(amount) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).',
          'ROWS counts physical rows while RANGE counts logical value ranges — the distinction matters with duplicate dates.',
          'Gaps in dates need a calendar table joined in, or the window silently averages the wrong span.',
        ],
      },
      {
        id: 'sq-w4', level: 'SDE III',
        q: 'Return the top 3 products by revenue within each category.',
        outline: [
          'Assign ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) in a CTE or subquery.',
          'Filter rn <= 3 in the outer query — you cannot filter a window function in WHERE directly.',
          'Swap to DENSE_RANK if ties should all be included rather than truncated at three.',
        ],
      },
    ],
    reading: [
      { label: 'PostgreSQL — window functions', url: 'https://www.postgresql.org/docs/current/tutorial-window.html' },
      { label: 'Mode — window functions', url: 'https://mode.com/sql-tutorial/sql-window-functions/' },
    ],
  },
  {
    id: 'sql-perf',
    title: 'Indexing & Transactions',
    icon: 'gauge',
    tagline: 'Index design · query plans · isolation',
    definition:
      'Making queries fast and correct under concurrency — B-tree index design and when the planner ignores one, reading an execution plan, and the isolation levels with the anomalies each prevents.',
    questions: [
      {
        id: 'sq-p1', level: 'Fresher',
        q: 'What is an index and what does it cost you?',
        outline: [
          'Usually a B-tree giving O(log n) lookups and efficient range scans and ordered reads.',
          'Costs: extra storage, and every INSERT/UPDATE/DELETE must maintain it.',
          'Index for the queries you actually run — an unused index is pure write tax.',
        ],
      },
      {
        id: 'sq-p2', level: 'SDE II',
        q: 'The index exists but the planner is not using it. Why?',
        outline: [
          'A function or cast wraps the column, making the predicate non-sargable — WHERE YEAR(d) = 2026 rather than a range.',
          'Composite index leading-column mismatch: an index on (a, b) cannot serve a query filtering only on b.',
          'Low selectivity — the planner correctly decides a sequential scan is cheaper.',
          'Stale statistics, implicit type coercion, or an OR that prevents a single index path.',
        ],
      },
      {
        id: 'sq-p3', level: 'SDE II',
        q: 'Name the isolation levels and the anomaly each prevents.',
        outline: [
          'Read Uncommitted allows dirty reads. Read Committed prevents them.',
          'Repeatable Read additionally prevents non-repeatable reads.',
          'Serializable additionally prevents phantoms — in the standard; PostgreSQL blocks phantoms at Repeatable Read via snapshot isolation.',
          'Higher isolation costs concurrency, so pick per transaction rather than globally.',
        ],
      },
      {
        id: 'sq-p4', level: 'SDE III',
        q: 'A query that was fast last month now times out in production. Debug it.',
        outline: [
          'EXPLAIN ANALYZE first — compare estimated versus actual rows to spot bad statistics.',
          'Look for sequential scans on large tables, nested loops over big row counts, and spills to disk.',
          'Check for data growth crossing a planner threshold, a missing or bloated index, or parameter sniffing.',
          'Fixes in order of cost: update statistics, add a covering index, rewrite the query, then partition.',
          'Verify with the real production data distribution, not a dev sample.',
        ],
      },
    ],
    reading: [
      { label: 'Use The Index, Luke', url: 'https://use-the-index-luke.com/' },
      { label: 'PostgreSQL — EXPLAIN', url: 'https://www.postgresql.org/docs/current/using-explain.html' },
      { label: 'Isolation levels', url: 'https://en.wikipedia.org/wiki/Isolation_(database_systems)' },
    ],
  },
]

const SQL_READINESS: ReadinessItem[] = [
  { id: 'q-r1', level: 'Fresher', label: 'I can recite the logical execution order of a SELECT.' },
  { id: 'q-r2', level: 'Fresher', label: 'I know how NULL behaves in comparisons, aggregates and NOT IN.' },
  { id: 'q-r3', level: 'SDE II', label: 'I can write top-N-per-group with a window function from memory.' },
  { id: 'q-r4', level: 'SDE II', label: 'I can explain why a planner ignores an index and fix it.' },
  { id: 'q-r5', level: 'SDE II', label: 'I can name each isolation level and the anomaly it prevents.' },
  { id: 'q-r6', level: 'SDE III', label: 'I can read EXPLAIN ANALYZE output and act on it.' },
]

// ===========================================================================
// BEHAVIOURAL
// ===========================================================================
const BEHAV_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'bh-star',
    title: 'STAR & Story Bank',
    icon: 'clipboard',
    tagline: 'Structure · length · reusable stories',
    definition:
      'The delivery mechanics of a behavioural answer — a structure that keeps you concrete, the right length, and a prepared bank of stories that can be re-cut for many different prompts.',
    questions: [
      {
        id: 'bh-s1', level: 'Fresher',
        q: 'What is STAR and why do interviewers insist on it?',
        outline: [
          'Situation, Task, Action, Result — it forces specificity and separates your contribution from the team\'s.',
          'Most of the time should sit in Action, described in first person singular.',
          'Quantify the Result; an unquantified result reads as an opinion.',
        ],
      },
      {
        id: 'bh-s2', level: 'Fresher',
        q: 'How long should a behavioural answer be?',
        outline: [
          'Two to three minutes. Under one minute reads as thin, over four loses the interviewer.',
          'Roughly 20% setup, 60% action, 20% result and reflection.',
          'End cleanly and let them probe — do not fill silence with more detail.',
        ],
      },
      {
        id: 'bh-s3', level: 'SDE II',
        q: 'How do you prepare a story bank?',
        outline: [
          'Six to eight strong stories, each written out in STAR form once.',
          'Map them to dimensions: conflict, failure, ambiguity, influence without authority, tight deadline, customer impact, mentoring.',
          'One story can answer several prompts if you re-cut which part you emphasise.',
          'Rehearse aloud — written fluency does not transfer to spoken fluency.',
        ],
      },
      {
        id: 'bh-s4', level: 'SDE II',
        q: '"Tell me about yourself" — what is the right structure?',
        outline: [
          'Present: current role, scope, and the kind of problems you own.',
          'Two highlights that are relevant to this job, each with a measurable outcome.',
          'Why this role, now — connect your trajectory to their opening.',
          'Ninety seconds. It is a trailer, not the film.',
        ],
      },
    ],
    reading: [
      { label: 'STAR method', url: 'https://en.wikipedia.org/wiki/Situation,_task,_action,_result' },
      { label: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
    ],
  },
  {
    id: 'bh-conflict',
    title: 'Conflict & Collaboration',
    icon: 'users',
    tagline: 'Disagreement · peers · shifting requirements',
    definition:
      'How you behave when people disagree — whether you can separate the technical question from the interpersonal one, argue from evidence, and commit to a decision that went against you.',
    questions: [
      {
        id: 'bh-c1', level: 'Fresher',
        q: 'Tell me about a technical disagreement with a teammate.',
        outline: [
          'Start by restating the shared goal — it reframes the disagreement as a trade-off, not a contest.',
          'Make each option\'s cost, risk and timeline explicit; look for data or a small spike to decide.',
          'If still tied, escalate to a neutral owner, then commit fully to the outcome.',
          'The signal they want: low ego, evidence-led, and no lingering resentment.',
        ],
      },
      {
        id: 'bh-c2', level: 'SDE II',
        q: 'A peer consistently blocks your pull requests. What do you do?',
        outline: [
          'Separate the signal from the delivery — are the comments technically right but abrasively phrased?',
          'Ask for the principle behind a comment so the discussion moves from taste to standards.',
          'Take it to a synchronous conversation; async review threads escalate badly.',
          'Convert recurring disagreements into a written team standard or a linter rule.',
        ],
      },
      {
        id: 'bh-c3', level: 'SDE II',
        q: 'A product manager changes requirements mid-sprint. How do you respond?',
        outline: [
          'Clarify the underlying need rather than debating the requested change.',
          'Quantify the cost — what slips, what has to be rebuilt.',
          'Offer options with trade-offs instead of a yes or a no.',
          'Get the decision written down so the sprint outcome is not relitigated later.',
        ],
      },
      {
        id: 'bh-c4', level: 'SDE III',
        q: 'How do you drive alignment across three teams without authority?',
        outline: [
          'Write the problem framing and options down first — a document scales where a meeting does not.',
          'Pre-align with each stakeholder individually before the group forum, so the meeting confirms rather than debates.',
          'Give each team something they care about in the outcome.',
          'Record the decision and its rationale, then follow through visibly on the first milestone.',
        ],
      },
    ],
    reading: [
      { label: 'Disagree and commit', url: 'https://en.wikipedia.org/wiki/Disagree_and_commit' },
      { label: 'Crucial Conversations (summary)', url: 'https://www.vitalsmarts.com/crucial-conversations-book/' },
    ],
  },
  {
    id: 'bh-ownership',
    title: 'Ownership & Failure',
    icon: 'shield',
    tagline: 'Incidents · missed deadlines · postmortems',
    definition:
      'Whether you own outcomes rather than tasks — how you behave in an incident, how early you raise a slipping deadline, and whether you can describe a genuine failure without deflecting.',
    questions: [
      {
        id: 'bh-o1', level: 'Fresher',
        q: 'Tell me about a time you failed.',
        outline: [
          'Pick a real failure with real consequences — a disguised strength reads as evasion.',
          'Name your own contribution to it explicitly, not the circumstances.',
          'Spend most of the answer on what you changed afterwards and the evidence it worked.',
        ],
      },
      {
        id: 'bh-o2', level: 'SDE II',
        q: 'Describe a production incident you owned.',
        outline: [
          'Detection: how you found out, and whether monitoring or a customer told you.',
          'Mitigate before diagnosing — restore service first, investigate second.',
          'Root cause, then a blameless postmortem with action items that actually shipped.',
          'Say what the incident changed structurally, not just the one-line fix.',
        ],
      },
      {
        id: 'bh-o3', level: 'SDE II',
        q: 'Your project is going to miss its deadline. What now?',
        outline: [
          'Raise it as early as the data supports — late surprises are the actual failure.',
          'Bring options: cut scope, move the date, add people (with the ramp cost stated).',
          'Recommend one, with reasoning, rather than presenting a menu and waiting.',
          'Then over-communicate progress against the revised plan.',
        ],
      },
      {
        id: 'bh-o4', level: 'SDE III',
        q: 'Tell me about a technical decision you got wrong at scale.',
        outline: [
          'Set the context and the constraints you were optimising for at the time.',
          'Name the signal you missed and why the feedback loop was too slow to catch it.',
          'Quantify the cost — engineering time, incidents, migration effort.',
          'Describe how you reversed it and the process change that prevents a repeat.',
        ],
      },
    ],
    reading: [
      { label: 'Google SRE — Postmortem culture', url: 'https://sre.google/sre-book/postmortem-culture/' },
      { label: 'Etsy — Blameless postmortems', url: 'https://www.etsy.com/codeascraft/blameless-postmortems/' },
    ],
  },
  {
    id: 'bh-impact',
    title: 'Impact & Leadership',
    icon: 'trophy',
    tagline: 'Scope · mentoring · prioritisation',
    definition:
      'The senior signal — whether your impact extends past your own keyboard through mentoring, prioritisation under pressure, and influencing decisions with evidence.',
    questions: [
      {
        id: 'bh-i1', level: 'SDE II',
        q: 'What is your biggest technical achievement?',
        outline: [
          'Open with the business problem, not the technology.',
          'Be precise about your role versus the team\'s — interviewers discount vague "we".',
          'Quantify impact in the units the business cares about.',
          'Close with what you would do differently, which signals judgement rather than nostalgia.',
        ],
      },
      {
        id: 'bh-i2', level: 'SDE III',
        q: 'How do you mentor engineers?',
        outline: [
          'Calibrate to their level: juniors need worked examples, mid-level engineers need delegated ownership with a safety net.',
          'Review for reasoning, not only for code — ask what alternatives they rejected.',
          'Give the work away, including the visible work; hoarding it caps both of you.',
          'Measure it by their trajectory, not by how much you helped.',
        ],
      },
      {
        id: 'bh-i3', level: 'SDE III',
        q: 'Everything is urgent. How do you decide what to work on?',
        outline: [
          'Rank by impact, effort and reversibility — cheap reversible things go first when uncertain.',
          'Tie each item back to a team or company goal; anything that does not map is a candidate to drop.',
          'Say no explicitly, with the reasoning, rather than silently deprioritising.',
          'Make the trade-off visible to your manager so the decision is shared.',
        ],
      },
      {
        id: 'bh-i4', level: 'SDE III',
        q: 'Describe influencing a roadmap decision with data.',
        outline: [
          'Frame the problem in business terms the decision-maker already cares about.',
          'Run the smallest experiment that produces credible evidence.',
          'Present options with costs rather than advocating for one outcome.',
          'Follow through publicly on the result — that is what earns the next round of influence.',
        ],
      },
    ],
    reading: [
      { label: 'The Manager\'s Path', url: 'https://www.oreilly.com/library/view/the-managers-path/9781491973882/' },
      { label: 'StaffEng — stories', url: 'https://staffeng.com/stories' },
    ],
  },
]

const BEHAV_READINESS: ReadinessItem[] = [
  { id: 'b-r1', level: 'Fresher', label: 'I have 6–8 STAR stories written out and rehearsed aloud.' },
  { id: 'b-r2', level: 'Fresher', label: 'I can deliver "tell me about yourself" in 90 seconds.' },
  { id: 'b-r3', level: 'SDE II', label: 'I have a genuine failure story that does not deflect blame.' },
  { id: 'b-r4', level: 'SDE II', label: 'I can quantify the impact of every story with a real number.' },
  { id: 'b-r5', level: 'SDE III', label: 'I have a story about influencing across teams without authority.' },
  { id: 'b-r6', level: 'SDE III', label: 'I have a story about mentoring that shows the other person\'s growth.' },
]

// ===========================================================================
// HR & MANAGER ROUND
// ===========================================================================
const HR_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'hr-screen',
    title: 'HR Screening',
    icon: 'phone',
    tagline: 'Resume walk · why leaving · strengths',
    definition:
      'The first filter. Low technical depth, high elimination rate — the recruiter is checking coherence, motivation and red flags, not engineering ability.',
    questions: [
      {
        id: 'hr-s1', level: 'Fresher',
        q: '"Walk me through your resume."',
        outline: [
          'Chronological, but with a through-line — each move should look deliberate.',
          'Thirty seconds per role, weighted heavily toward the most recent and most relevant.',
          'Land on why you are talking to them specifically.',
        ],
      },
      {
        id: 'hr-s2', level: 'Fresher',
        q: '"Why are you leaving your current job?"',
        outline: [
          'Frame forward: what you are moving toward, not what you are escaping.',
          'Scope, domain, technology or growth are all safe and true reasons.',
          'Never criticise a manager or employer — it is the single most common self-inflicted rejection.',
        ],
      },
      {
        id: 'hr-s3', level: 'Fresher',
        q: '"What is your greatest weakness?"',
        outline: [
          'Name a real one that does not disqualify you for this specific role.',
          'Pair it with the concrete mitigation you already run.',
          'Avoid the disguised-strength answer; it reads as unselfaware.',
        ],
      },
      {
        id: 'hr-s4', level: 'Fresher',
        q: '"Where do you see yourself in five years?"',
        outline: [
          'Answer with direction and scope rather than a job title.',
          'Connect it to capabilities this role would build.',
          'Show ambition without implying you will leave in twelve months.',
        ],
      },
    ],
    reading: [
      { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
      { label: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles' },
    ],
  },
  {
    id: 'hr-fit',
    title: 'Fit & Motivation',
    icon: 'target',
    tagline: 'Why us · why you · learning',
    definition:
      'Whether you actually want this job or any job. Specificity is the whole test — generic enthusiasm is indistinguishable from a mass application.',
    questions: [
      {
        id: 'hr-f1', level: 'Fresher',
        q: '"Why this company?"',
        outline: [
          'Name something specific: a product decision, a technical blog post, the market position.',
          'Connect it to what you want to work on, not just what you admire.',
          'One concrete detail beats three paragraphs of praise.',
        ],
      },
      {
        id: 'hr-f2', level: 'Fresher',
        q: '"Why should we hire you?"',
        outline: [
          'Pick three pillars straight from the job description.',
          'Give one piece of evidence per pillar, with an outcome.',
          'Close on the gap you would fill for their team specifically.',
        ],
      },
      {
        id: 'hr-f3', level: 'SDE II',
        q: '"What kind of manager and team do you work best with?"',
        outline: [
          'Be honest — a mismatch discovered later is worse for both sides.',
          'State a preference, then show adaptability with an example of thriving under a different style.',
          'This is also your chance to interview them; listen carefully to the answer.',
        ],
      },
      {
        id: 'hr-f4', level: 'SDE II',
        q: '"Tell me about a time you had to learn something quickly."',
        outline: [
          'Emphasise the method — how you found the shortest path to competence.',
          'Show the checkpoint: how you validated you had actually learned it.',
          'End with the outcome and how you now onboard onto unfamiliar systems.',
        ],
      },
    ],
    reading: [
      { label: 'Ask a Manager', url: 'https://www.askamanager.org/' },
    ],
  },
  {
    id: 'hr-comp',
    title: 'Compensation & Negotiation',
    icon: 'coins',
    tagline: 'Expectations · total comp · counter-offers',
    definition:
      'The highest-leverage twenty minutes of the whole process. The rules are simple and mostly about sequencing — who names a number first, and what you compare across offers.',
    questions: [
      {
        id: 'hr-p1', level: 'Fresher',
        q: '"What are your salary expectations?" — asked in the first call.',
        outline: [
          'Deflect once, politely: ask for the band budgeted for the level.',
          'If pressed, give a researched range with a rationale, anchored at the top of market for your level.',
          'In many jurisdictions they must disclose the range if you ask — use that.',
        ],
      },
      {
        id: 'hr-p2', level: 'SDE II',
        q: 'How do you evaluate a total-compensation offer?',
        outline: [
          'Base plus bonus plus equity plus benefits — never compare on base alone.',
          'For equity, ask about vesting schedule and cliff, strike price, current valuation and liquidity path.',
          'Factor location, remote policy, on-call load and the growth the role unlocks.',
          'Model it over four years, not year one, because the vesting shape varies wildly.',
        ],
      },
      {
        id: 'hr-p3', level: 'SDE II',
        q: 'How do you negotiate without a competing offer?',
        outline: [
          'Use market data for the level and location, plus your specific evidence of impact.',
          'Make one clear, reasonable ask rather than a list — and say what would make you sign today.',
          'Stay collaborative in tone; the hiring manager is usually your advocate with the compensation team.',
          'Ask about a signing bonus or an early review if the base is genuinely capped.',
        ],
      },
      {
        id: 'hr-p4', level: 'SDE III',
        q: 'Your current employer makes a counter-offer. How do you think about it?',
        outline: [
          'Ask why the problem you are leaving over required a resignation to get solved.',
          'Money rarely fixes scope, manager or trajectory issues — check what structurally changed.',
          'Consider how your commitment is now perceived internally.',
          'Decide against your original reason for looking, not against the number.',
        ],
      },
    ],
    reading: [
      { label: 'Kalzumeus — Salary Negotiation', url: 'https://www.kalzumeus.com/2012/01/23/salary-negotiation/' },
      { label: 'levels.fyi', url: 'https://www.levels.fyi/' },
    ],
  },
  {
    id: 'hr-manager',
    title: 'Hiring-Manager Round',
    icon: 'briefcase',
    tagline: 'Prioritisation · feedback · first 90 days',
    definition:
      'The round where a future manager decides whether they want to work with you daily — judgement under competing priorities, coachability, and how you would actually land in the team.',
    questions: [
      {
        id: 'hr-m1', level: 'SDE II',
        q: '"How do you prioritise when everything is a P0?"',
        outline: [
          'Nothing is P0 if everything is — force the ranking with impact, dependencies and reversibility.',
          'Surface the trade-off to your manager rather than silently choosing.',
          'Give a concrete example where you dropped something and the reasoning held up.',
        ],
      },
      {
        id: 'hr-m2', level: 'SDE II',
        q: '"How do you take feedback?"',
        outline: [
          'Give a specific example of hard feedback you received.',
          'Describe what you actually changed, and how you knew it worked.',
          'Mention how you now solicit feedback proactively rather than waiting for review cycles.',
        ],
      },
      {
        id: 'hr-m3', level: 'SDE III',
        q: '"How would you ramp up in your first 90 days?"',
        outline: [
          'Days 0–30: learn — codebase, deploy path, the metrics that matter, and who owns what.',
          'Days 30–60: contribute — own a real component end to end, ship something visible.',
          'Days 60–90: lead — drive a project, and propose one improvement you earned the right to suggest.',
          'Name what you would want from them at each checkpoint.',
        ],
      },
      {
        id: 'hr-m4', level: 'SDE III',
        q: '"What questions do you have for me?"',
        outline: [
          'Team health: how decisions get made, and what the last hard one was.',
          'Success: what "great" looks like at six months for this specific role.',
          'Reality check: on-call load, tech-debt budget, and how much of the roadmap is committed.',
          'Growth: how the last person in this role progressed. Never say "no questions".',
        ],
      },
    ],
    reading: [
      { label: 'The Manager\'s Path', url: 'https://www.oreilly.com/library/view/the-managers-path/9781491973882/' },
      { label: 'The First 90 Days', url: 'https://hbr.org/books/watkins' },
    ],
  },
]

const HR_READINESS: ReadinessItem[] = [
  { id: 'h-r1', level: 'Fresher', label: 'I can walk my resume in under three minutes with a clear through-line.' },
  { id: 'h-r2', level: 'Fresher', label: 'I have a specific, non-generic answer to "why this company".' },
  { id: 'h-r3', level: 'Fresher', label: 'I can answer "why are you leaving" without criticising anyone.' },
  { id: 'h-r4', level: 'SDE II', label: 'I know my market band for this level and location.' },
  { id: 'h-r5', level: 'SDE II', label: 'I can evaluate an offer on total comp, not base salary.' },
  { id: 'h-r6', level: 'SDE III', label: 'I have a concrete 30/60/90 plan and questions for the hiring manager.' },
]

// ===========================================================================
// DSA — additional subtopic
// ===========================================================================
const DSA_GREEDY: AimlSubtopic = {
  id: 'dsa-greedy',
  title: 'Greedy, Intervals & Bit Manipulation',
  icon: 'gauge',
  tagline: 'Greedy proofs · interval sweeps · XOR tricks',
  definition:
    'Problems solved by a locally optimal choice that provably yields a global optimum — interval scheduling and merging, plus the bit-level identities that turn O(n) counting into O(1).',
  questions: [
    {
      id: 'dsa-gr1', level: 'Fresher',
      q: 'What makes a greedy choice provably correct?',
      outline: [
        'Greedy-choice property: a locally optimal pick is part of some global optimum.',
        'Optimal substructure: after that pick, the remaining problem is the same problem, smaller.',
        'If you cannot argue both, look for a counterexample — most "obvious" greedy solutions are wrong.',
        'Coin change with arbitrary denominations is the canonical greedy failure; DP is required.',
      ],
      source: { label: 'Greedy algorithm', url: 'https://en.wikipedia.org/wiki/Greedy_algorithm' },
    },
    {
      id: 'dsa-gr2', level: 'SDE II',
      q: 'Merge overlapping intervals.',
      outline: [
        'Sort by start time — this is the entire trick.',
        'Sweep once: if current.start <= last.end, extend last.end = max(last.end, current.end); otherwise push a new interval.',
        'O(n log n) dominated by the sort, O(n) extra for the output.',
        'Decide up front whether touching intervals like [1,2] and [2,3] should merge.',
      ],
      source: { label: 'Interval scheduling', url: 'https://en.wikipedia.org/wiki/Interval_scheduling' },
    },
    {
      id: 'dsa-gr3', level: 'SDE II',
      q: 'Maximum number of non-overlapping intervals (activity selection).',
      outline: [
        'Sort by END time, not start — the counter-intuitive part interviewers probe.',
        'Greedily take each interval whose start is >= the last taken end.',
        'Finishing earliest leaves the most room for what follows; this is provably optimal by an exchange argument.',
        '"Minimum removals to make non-overlapping" is the same algorithm: n − (count kept).',
      ],
      source: { label: 'Activity selection problem', url: 'https://en.wikipedia.org/wiki/Activity_selection_problem' },
    },
    {
      id: 'dsa-gr4', level: 'SDE III',
      q: 'Which XOR and bit identities should you have memorised, and what do they buy you?',
      outline: [
        'a ^ a = 0 and a ^ 0 = a — XOR every element to find the single non-duplicated number in O(1) space.',
        'n & (n − 1) clears the lowest set bit — Brian Kernighan\'s popcount runs in O(set bits).',
        'n & −n isolates the lowest set bit; n & (n − 1) == 0 tests for a power of two.',
        'Watch for signed-shift and overflow pitfalls, and prefer built-ins (popcount) when available.',
      ],
      source: { label: 'Bitwise operation', url: 'https://en.wikipedia.org/wiki/Bitwise_operation' },
    },
  ],
  reading: [
    { label: 'Greedy algorithm', url: 'https://en.wikipedia.org/wiki/Greedy_algorithm' },
    { label: 'Bit manipulation — CP-Algorithms', url: 'https://cp-algorithms.com/algebra/bit-manipulation.html' },
  ],
}

// ===========================================================================
// CS FUNDAMENTALS
// ===========================================================================
const CSF_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'csf-os',
    title: 'Operating Systems',
    icon: 'cpu',
    tagline: 'Processes · memory · deadlock · scheduling',
    definition:
      'How the kernel multiplexes hardware — process and thread abstractions, virtual memory and paging, synchronisation and deadlock, and the scheduling policies that decide who runs next.',
    questions: [
      {
        id: 'csf-os1', level: 'Fresher',
        q: 'Process versus thread.',
        outline: [
          'A process owns an address space, file descriptors and its own heap; threads live inside one and share all of it.',
          'Each thread still has its own stack, registers and program counter.',
          'Context switching between processes is more expensive — it flushes the TLB and swaps page tables.',
          'Sharing is why threads need mutexes and atomics, and why a crash in one thread takes the whole process down.',
        ],
        source: { label: 'Thread (computing)', url: 'https://en.wikipedia.org/wiki/Thread_(computing)' },
      },
      {
        id: 'csf-os2', level: 'Fresher',
        q: 'What is virtual memory and why does it exist?',
        outline: [
          'Each process sees a private contiguous address space that the MMU maps to scattered physical frames.',
          'Buys isolation, simpler linking, and the ability to run a working set larger than physical RAM via paging.',
          'The page table holds the mapping; the TLB caches recent translations.',
          'Cost: a TLB miss costs a page-table walk, and a page fault costs a disk read.',
        ],
        source: { label: 'Virtual memory', url: 'https://en.wikipedia.org/wiki/Virtual_memory' },
      },
      {
        id: 'csf-os3', level: 'SDE II',
        q: 'State the four Coffman conditions and how you break each one.',
        outline: [
          'Mutual exclusion, hold-and-wait, no preemption, circular wait — all four must hold simultaneously.',
          'Break circular wait with a global lock ordering — the practical fix in almost every codebase.',
          'Break hold-and-wait by acquiring all locks atomically up front, or by releasing before re-acquiring.',
          'Alternatives: allow preemption via lock timeouts, or detect-and-recover with a wait-for graph.',
        ],
        source: { label: 'Deadlock', url: 'https://en.wikipedia.org/wiki/Deadlock' },
      },
      {
        id: 'csf-os4', level: 'SDE III',
        q: 'Walk through what happens on a page fault, end to end.',
        outline: [
          'The MMU finds no valid mapping and traps into the kernel with the faulting address.',
          'The kernel checks the VMA: invalid access → SIGSEGV; valid but not resident → continue.',
          'Allocate a free frame, or evict one using a clock/second-chance approximation of LRU, writing it back if dirty.',
          'Read the page from disk or the swap file, update the page table and TLB, then restart the faulting instruction.',
          'Minor faults (page already in memory, just unmapped) are cheap; major faults hit disk and dominate latency.',
        ],
        source: { label: 'Page fault', url: 'https://en.wikipedia.org/wiki/Page_fault' },
      },
    ],
    reading: [
      { label: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
      { label: 'Virtual memory', url: 'https://en.wikipedia.org/wiki/Virtual_memory' },
      { label: 'Scheduling (computing)', url: 'https://en.wikipedia.org/wiki/Scheduling_(computing)' },
    ],
  },
  {
    id: 'csf-net',
    title: 'Computer Networks',
    icon: 'network',
    tagline: 'TCP/UDP · handshakes · HTTP versions · TLS',
    definition:
      'How bytes actually cross the wire — the transport guarantees TCP and UDP each offer, connection setup, and the evolution of HTTP and TLS that shapes modern web latency.',
    questions: [
      {
        id: 'csf-n1', level: 'Fresher',
        q: 'TCP versus UDP.',
        outline: [
          'TCP is connection-oriented and reliable: ordered delivery, retransmission, flow and congestion control.',
          'UDP is connectionless and best-effort: no ordering, no retransmission, far lower overhead.',
          'TCP for correctness (HTTP, file transfer); UDP where timeliness beats completeness (voice, video, DNS, gaming).',
          'QUIC runs reliability on top of UDP to escape TCP\'s head-of-line blocking and kernel ossification.',
        ],
        source: { label: 'RFC 9293 — TCP', url: 'https://datatracker.ietf.org/doc/html/rfc9293' },
      },
      {
        id: 'csf-n2', level: 'Fresher',
        q: 'What happens between typing a URL and seeing the page?',
        outline: [
          'Browser cache and DNS resolution (recursive resolver → root → TLD → authoritative).',
          'TCP three-way handshake to the resolved IP, then a TLS handshake for HTTPS.',
          'HTTP request; server responds with HTML; the browser parses and requests sub-resources.',
          'DOM and CSSOM build, JavaScript executes, layout and paint produce first contentful paint.',
        ],
        source: { label: 'MDN — How browsers work', url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work' },
      },
      {
        id: 'csf-n3', level: 'SDE II',
        q: 'Why does TCP need a three-way handshake rather than two?',
        outline: [
          'SYN, SYN-ACK, ACK — each side must announce its initial sequence number and have it acknowledged.',
          'Two messages would confirm only one direction, leaving the server unsure the client can receive.',
          'The third message also lets the server discard delayed duplicate SYNs from an old connection.',
          'Connection teardown is four-way (FIN/ACK each way) because each direction closes independently.',
        ],
        source: { label: 'RFC 9293 — TCP', url: 'https://datatracker.ietf.org/doc/html/rfc9293' },
      },
      {
        id: 'csf-n4', level: 'SDE II',
        q: 'Compare HTTP/1.1, HTTP/2 and HTTP/3.',
        outline: [
          'HTTP/1.1: one request in flight per connection, so browsers open ~6 connections per origin.',
          'HTTP/2: binary framing with multiplexed streams and header compression — but one lost TCP segment stalls every stream (TCP head-of-line blocking).',
          'HTTP/3: the same semantics over QUIC on UDP, with per-stream loss recovery, so a loss stalls only its own stream.',
          'QUIC also folds the TLS handshake into connection setup, cutting a round trip.',
        ],
        source: { label: 'MDN — HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
      },
    ],
    reading: [
      { label: 'RFC 9293 — TCP', url: 'https://datatracker.ietf.org/doc/html/rfc9293' },
      { label: 'RFC 9114 — HTTP/3', url: 'https://datatracker.ietf.org/doc/html/rfc9114' },
      { label: 'High Performance Browser Networking', url: 'https://hpbn.co/' },
    ],
  },
  {
    id: 'csf-dbms',
    title: 'DBMS Concepts',
    icon: 'database',
    tagline: 'Normalisation · durability · MVCC',
    definition:
      'The theory underneath a relational database — normal forms and when to break them, how durability is actually implemented, and how multi-version concurrency lets readers avoid blocking writers.',
    questions: [
      {
        id: 'csf-db1', level: 'Fresher',
        q: 'Explain 1NF, 2NF and 3NF.',
        outline: [
          '1NF: atomic column values, no repeating groups or arrays stuffed into one column.',
          '2NF: 1NF plus no partial dependency — non-key columns depend on the whole composite key, not part of it.',
          '3NF: 2NF plus no transitive dependency — non-key columns depend on the key only, not on other non-key columns.',
          'The goal is removing update, insert and delete anomalies, not elegance for its own sake.',
        ],
        source: { label: 'Database normalization', url: 'https://en.wikipedia.org/wiki/Database_normalization' },
      },
      {
        id: 'csf-db2', level: 'SDE II',
        q: 'When would you deliberately denormalise?',
        outline: [
          'Read-heavy workloads where a hot query joins many tables on every request.',
          'Analytics and reporting tables, where a star schema is intentionally denormalised.',
          'Precomputed counters and aggregates that would otherwise be an expensive COUNT on every page load.',
          'The cost is update anomalies — you now own keeping the copies in sync, usually via triggers or an async job.',
        ],
        source: { label: 'Denormalization', url: 'https://en.wikipedia.org/wiki/Denormalization' },
      },
      {
        id: 'csf-db3', level: 'SDE II',
        q: 'How does a database actually implement the D in ACID?',
        outline: [
          'Write-ahead logging: the change is appended to the WAL and fsynced before the data pages are written.',
          'Commit returns only once the log record is durably on disk, so a crash can replay it.',
          'Checkpoints periodically flush dirty pages so recovery does not have to replay the entire log.',
          'Group commit batches fsyncs across concurrent transactions to amortise the disk cost.',
        ],
        source: { label: 'PostgreSQL — Write-Ahead Logging', url: 'https://www.postgresql.org/docs/current/wal-intro.html' },
      },
      {
        id: 'csf-db4', level: 'SDE III',
        q: 'Explain MVCC and what it costs.',
        outline: [
          'Each write creates a new row version tagged with the transaction id that created it.',
          'A transaction reads the snapshot visible at its start, so readers never block writers and writers never block readers.',
          'Cost: dead tuples accumulate and must be reclaimed — VACUUM in PostgreSQL, the undo log in InnoDB.',
          'Long-running transactions hold back the cleanup horizon and cause bloat — a classic production incident.',
        ],
        source: { label: 'PostgreSQL — MVCC', url: 'https://www.postgresql.org/docs/current/mvcc-intro.html' },
      },
    ],
    reading: [
      { label: 'PostgreSQL — MVCC', url: 'https://www.postgresql.org/docs/current/mvcc-intro.html' },
      { label: 'Database normalization', url: 'https://en.wikipedia.org/wiki/Database_normalization' },
      { label: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/' },
    ],
  },
  {
    id: 'csf-oop',
    title: 'OOP & Low-Level Design',
    icon: 'boxes',
    tagline: 'Pillars · SOLID · class design',
    definition:
      'Designing classes that survive change — the four pillars, the SOLID principles applied concretely, and the LLD round where you turn a vague product prompt into a class diagram.',
    questions: [
      {
        id: 'csf-oo1', level: 'Fresher',
        q: 'What are the four pillars of OOP?',
        outline: [
          'Encapsulation: hide internal state behind an interface so invariants cannot be broken from outside.',
          'Abstraction: expose what an object does, not how it does it.',
          'Inheritance: share behaviour through an is-a relationship.',
          'Polymorphism: one interface, many implementations, resolved at runtime.',
        ],
        source: { label: 'Object-oriented programming', url: 'https://en.wikipedia.org/wiki/Object-oriented_programming' },
      },
      {
        id: 'csf-oo2', level: 'SDE II',
        q: 'Explain each SOLID principle with a one-line example.',
        outline: [
          'S — one reason to change: split an Invoice that both computes totals and renders PDFs.',
          'O — open to extension, closed to modification: add a new PaymentMethod class rather than a new if-branch.',
          'L — a subclass must be usable wherever the base is: a Square that overrides setWidth breaks Rectangle\'s contract.',
          'I — many small interfaces beat one fat one: do not force a Printer to implement scan().',
          'D — depend on abstractions: the service takes a Repository interface, not a PostgresRepository.',
        ],
        source: { label: 'SOLID', url: 'https://en.wikipedia.org/wiki/SOLID' },
      },
      {
        id: 'csf-oo3', level: 'SDE II',
        q: 'Why prefer composition over inheritance?',
        outline: [
          'Inheritance exposes the parent\'s implementation, so a base-class change silently breaks subclasses.',
          'Deep hierarchies become rigid — behaviour cannot vary independently along two axes.',
          'Composition lets behaviour be swapped at runtime through an injected collaborator.',
          'Reach for inheritance only for genuine is-a substitutability; otherwise compose.',
        ],
        source: { label: 'Composition over inheritance', url: 'https://en.wikipedia.org/wiki/Composition_over_inheritance' },
      },
      {
        id: 'csf-oo4', level: 'SDE III',
        q: 'Design a parking lot (low-level design).',
        outline: [
          'Clarify first: vehicle types, multiple floors, pricing model, entry/exit points, reservations.',
          'Entities: ParkingLot, Floor, ParkingSpot (subtyped by size), Vehicle, Ticket, Payment, DisplayBoard.',
          'Use Strategy for pricing and for spot allocation so new rules do not touch existing classes.',
          'Concurrency: allocating a spot must be atomic or two cars get the same slot — say how you lock it.',
          'Call out extension points: EV charging spots, dynamic pricing, a reservation service.',
        ],
        source: { label: 'Refactoring Guru — design patterns', url: 'https://refactoring.guru/design-patterns' },
      },
    ],
    reading: [
      { label: 'SOLID', url: 'https://en.wikipedia.org/wiki/SOLID' },
      { label: 'Refactoring Guru — design patterns', url: 'https://refactoring.guru/design-patterns' },
    ],
  },
]

const CSF_READINESS: ReadinessItem[] = [
  { id: 'c-r1', level: 'Fresher', label: 'I can explain process vs thread and why threads need synchronisation.' },
  { id: 'c-r2', level: 'Fresher', label: 'I can explain virtual memory, paging and the role of the TLB.' },
  { id: 'c-r3', level: 'Fresher', label: 'I can compare TCP and UDP and name the right use cases.' },
  { id: 'c-r4', level: 'SDE II', label: 'I can state the four Coffman conditions and a fix for each.' },
  { id: 'c-r5', level: 'SDE II', label: 'I can explain 1NF through 3NF and justify denormalising.' },
  { id: 'c-r6', level: 'SDE III', label: 'I can walk a page fault and an MVCC read end to end.' },
]

// ===========================================================================
// APTITUDE & REASONING
// ===========================================================================
const APT_SUBTOPICS: AimlSubtopic[] = [
  {
    id: 'apt-quant',
    title: 'Quantitative Aptitude',
    icon: 'calculator',
    tagline: 'Time-speed-distance · work · percentages',
    definition:
      'The arithmetic screening round used by most mass campus recruiters — speed and distance, work and rate, percentages and profit/loss, solved under roughly one minute per question.',
    questions: [
      {
        id: 'apt-q1', level: 'Fresher',
        q: 'A 120 m train travelling at 54 km/h crosses a pole. How long does it take?',
        outline: [
          'Convert first: 54 km/h × 1000/3600 = 15 m/s.',
          'Crossing a pole means covering exactly the train\'s own length.',
          'Time = 120 / 15 = 8 seconds.',
          'Crossing a platform instead means covering train length + platform length.',
        ],
        source: { label: 'Speed', url: 'https://en.wikipedia.org/wiki/Speed' },
      },
      {
        id: 'apt-q2', level: 'Fresher',
        q: 'A finishes a job in 10 days and B in 15 days. Working together, how long?',
        outline: [
          'Work in rates, never in days: A = 1/10 per day, B = 1/15 per day.',
          'Combined = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 per day.',
          'Time = 1 ÷ (1/6) = 6 days.',
          'Shortcut for two workers: (a × b)/(a + b) = 150/25 = 6.',
        ],
        source: { label: 'Rate (mathematics)', url: 'https://en.wikipedia.org/wiki/Rate_(mathematics)' },
      },
      {
        id: 'apt-q3', level: 'SDE II',
        q: 'An item is marked up 40% above cost, then sold at a 10% discount. What is the profit percentage?',
        outline: [
          'Take cost price as 100 for arithmetic convenience.',
          'Marked price = 140; selling price = 140 × 0.90 = 126.',
          'Profit = 126 − 100 = 26, so profit = 26%.',
          'Note the trap: 40% − 10% = 30% is wrong, because the discount applies to the marked price, not the cost.',
        ],
        source: { label: 'Percentage', url: 'https://en.wikipedia.org/wiki/Percentage' },
      },
      {
        id: 'apt-q4', level: 'SDE II',
        q: 'Two trains 200 m and 300 m long run toward each other at 60 km/h and 40 km/h. How long to cross completely?',
        outline: [
          'Opposite directions → relative speed is the sum: 60 + 40 = 100 km/h = 100 × 1000/3600 ≈ 27.78 m/s.',
          'Total distance to clear = 200 + 300 = 500 m.',
          'Time = 500 / 27.78 = 18 seconds.',
          'Same direction instead → subtract the speeds, which is the usual variant they follow up with.',
        ],
        source: { label: 'Relative velocity', url: 'https://en.wikipedia.org/wiki/Relative_velocity' },
      },
    ],
    reading: [
      { label: 'Rate (mathematics)', url: 'https://en.wikipedia.org/wiki/Rate_(mathematics)' },
      { label: 'Percentage', url: 'https://en.wikipedia.org/wiki/Percentage' },
    ],
  },
  {
    id: 'apt-logic',
    title: 'Logical Reasoning',
    icon: 'puzzle',
    tagline: 'Series · blood relations · syllogisms',
    definition:
      'Pattern and deduction questions — number series, family-relation chains, syllogistic validity, and arrangement puzzles, all scored on speed as much as accuracy.',
    questions: [
      {
        id: 'apt-l1', level: 'Fresher',
        q: 'Complete the series: 2, 6, 12, 20, 30, ?',
        outline: [
          'Differences are 4, 6, 8, 10 — increasing by 2, so the next difference is 12.',
          '30 + 12 = 42.',
          'Closed form: term n = n(n + 1) — 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.',
          'Always check both the difference pattern and a closed form before committing.',
        ],
        source: { label: 'Pronic number', url: 'https://en.wikipedia.org/wiki/Pronic_number' },
      },
      {
        id: 'apt-l2', level: 'Fresher',
        q: 'A is B\'s brother. C is B\'s mother. D is C\'s father. How is A related to D?',
        outline: [
          'Chain it one link at a time rather than guessing.',
          'A is B\'s brother, and C is B\'s mother, so C is also A\'s mother.',
          'D is C\'s father, so D is A\'s maternal grandfather.',
          'Therefore A is D\'s grandson.',
        ],
        source: { label: 'Kinship terminology', url: 'https://en.wikipedia.org/wiki/Kinship_terminology' },
      },
      {
        id: 'apt-l3', level: 'SDE II',
        q: '"All cats are animals. Some animals are pets." Does it follow that some cats are pets?',
        outline: [
          'No. The conclusion does not follow.',
          'The middle term "animals" is undistributed — the "some animals" that are pets need not overlap the cats.',
          'A Venn diagram makes it obvious: cats sit inside animals, but the pets circle can miss cats entirely.',
          'Only conclusions true in every possible diagram are valid.',
        ],
        source: { label: 'Syllogism', url: 'https://en.wikipedia.org/wiki/Syllogism' },
      },
      {
        id: 'apt-l4', level: 'SDE II',
        q: 'What is your method for a seating-arrangement puzzle?',
        outline: [
          'Draw the frame first — linear row or circle, and whether people face inward or outward.',
          'Place the most constrained clue first (a fixed position or an "exactly between" statement).',
          'Track negative information as explicitly as positive: "X is not at either end" removes two slots.',
          'Enumerate the remaining possibilities rather than guessing, and verify every clue against the final layout.',
        ],
        source: { label: 'Constraint satisfaction problem', url: 'https://en.wikipedia.org/wiki/Constraint_satisfaction_problem' },
      },
    ],
    reading: [
      { label: 'Syllogism', url: 'https://en.wikipedia.org/wiki/Syllogism' },
      { label: 'Deductive reasoning', url: 'https://en.wikipedia.org/wiki/Deductive_reasoning' },
    ],
  },
  {
    id: 'apt-di',
    title: 'Data Interpretation & Verbal',
    icon: 'chart',
    tagline: 'Charts · averages · error spotting',
    definition:
      'Reading numbers off a table or chart under time pressure, plus the verbal section — sentence correction, para jumbles and reading comprehension.',
    questions: [
      {
        id: 'apt-d1', level: 'Fresher',
        q: 'Sales rose from 400 units to 500 units. What is the percentage increase?',
        outline: [
          'Percentage change = (new − old) / old × 100.',
          '(500 − 400) / 400 × 100 = 25%.',
          'Divide by the ORIGINAL value — dividing by 500 gives 20% and is the standard trap.',
          'A fall from 500 back to 400 is a 20% decrease, so increases and decreases are not symmetric.',
        ],
        source: { label: 'Relative change', url: 'https://en.wikipedia.org/wiki/Relative_change' },
      },
      {
        id: 'apt-d2', level: 'SDE II',
        q: 'Class A has 30 students averaging 60; class B has 20 averaging 70. What is the combined average?',
        outline: [
          'You cannot average the averages — the class sizes differ.',
          'Total = 30 × 60 + 20 × 70 = 1800 + 1400 = 3200.',
          'Combined average = 3200 / 50 = 64.',
          'Note it sits closer to 60 because class A carries more weight.',
        ],
        source: { label: 'Weighted arithmetic mean', url: 'https://en.wikipedia.org/wiki/Weighted_arithmetic_mean' },
      },
      {
        id: 'apt-d3', level: 'SDE II',
        q: 'What is your approach to a para-jumble question?',
        outline: [
          'Find the opening sentence: it introduces a subject by full name and depends on nothing prior.',
          'Chain by connectors and pronouns — "however", "this", "such a policy" all point backwards.',
          'Lock down mandatory pairs first, then slot the remaining sentences around them.',
          'Verify by reading the assembled paragraph once; check the options for the pair you are surest about.',
        ],
        source: { label: 'Cohesion (linguistics)', url: 'https://en.wikipedia.org/wiki/Cohesion_(linguistics)' },
      },
      {
        id: 'apt-d4', level: 'SDE II',
        q: 'Where do most subject–verb agreement errors hide?',
        outline: [
          'A prepositional phrase between subject and verb: "The box of chocolates IS", not "are".',
          'Collective nouns and "each / every / neither" take a singular verb.',
          '"Either ... or" and "neither ... nor" agree with the nearer subject.',
          'Inverted sentences: "There ARE several reasons" — the subject follows the verb.',
        ],
        source: { label: 'Agreement (linguistics)', url: 'https://en.wikipedia.org/wiki/Agreement_(linguistics)' },
      },
    ],
    reading: [
      { label: 'Weighted arithmetic mean', url: 'https://en.wikipedia.org/wiki/Weighted_arithmetic_mean' },
      { label: 'Relative change', url: 'https://en.wikipedia.org/wiki/Relative_change' },
    ],
  },
]

const APT_READINESS: ReadinessItem[] = [
  { id: 'a-r1', level: 'Fresher', label: 'I can convert km/h to m/s without thinking about it.' },
  { id: 'a-r2', level: 'Fresher', label: 'I solve work problems in rates, not days.' },
  { id: 'a-r3', level: 'Fresher', label: 'I compute percentage change against the original value.' },
  { id: 'a-r4', level: 'SDE II', label: 'I can spot an undistributed middle term in a syllogism.' },
  { id: 'a-r5', level: 'SDE II', label: 'I use weighted averages when group sizes differ.' },
  { id: 'a-r6', level: 'SDE II', label: 'I can finish a 4-question DI set in under 4 minutes.' },
]

// ===========================================================================
// REGISTRY
// ===========================================================================

export const TRACKS: InterviewTrack[] = [
  {
    slug: 'aiml',
    title: 'AI / ML Interview Track',
    short: 'AI / ML',
    icon: 'sparkles',
    accent: '#FF4D4D',
    featured: true,
    tagline: 'LLMs, RAG, agents, evals and AI system design',
    description:
      'LLM architecture, fine-tuning, evals, guardrails, RAG, agentic systems, vector databases, benchmarks, OCR, pipelining and AI system design.',
    tags: ['LLM Architecture', 'Fine-tuning', 'Evals', 'Guardrails', 'RAG', 'Agentic RAG', 'Vector DB', 'System Design'],
    practiceHref: '/workspace/playground/aiml',
    subtopics: [...AIML_EXTRA_SUBTOPICS, ...AIML_SUBTOPICS],
    readiness: AIML_READINESS,
  },
  {
    slug: 'dsa',
    title: 'DSA & Problem Solving',
    short: 'DSA',
    icon: 'binary',
    accent: '#3B82F6',
    tagline: 'Patterns that cover most coding rounds',
    description:
      'Arrays and strings, hashing, trees and graphs, dynamic programming, and sorting/searching/heaps — the pattern set behind almost every coding round.',
    tags: ['Two Pointers', 'Sliding Window', 'Hashing', 'Graphs', 'DP', 'Greedy', 'Heaps'],
    subtopics: [...DSA_SUBTOPICS, DSA_GREEDY],
    readiness: DSA_READINESS,
  },
  {
    slug: 'system-design',
    title: 'System Design',
    short: 'System Design',
    icon: 'network',
    accent: '#8B5CF6',
    tagline: 'Estimation, scaling, storage, async, classics',
    description:
      'Requirements and estimation, scaling and caching, storage and consistency, messaging and async, plus the classic whiteboard designs.',
    tags: ['Estimation', 'Caching', 'Sharding', 'Consistency', 'Queues', 'Classic Designs'],
    practiceHref: '/workspace/playground/design',
    subtopics: SD_SUBTOPICS,
    readiness: SD_READINESS,
  },
  {
    slug: 'sql',
    title: 'SQL & Databases',
    short: 'SQL',
    icon: 'database',
    accent: '#10B981',
    tagline: 'Queries, joins, windows, indexing',
    description:
      'Query fundamentals and NULL semantics, joins and aggregation, window functions, and indexing plus transaction isolation.',
    tags: ['Execution Order', 'Joins', 'Window Functions', 'Indexing', 'Isolation'],
    practiceHref: '/workspace/playground/sql',
    subtopics: SQL_SUBTOPICS,
    readiness: SQL_READINESS,
  },
  {
    slug: 'behavioural',
    title: 'Behavioural Interview',
    short: 'Behavioural',
    icon: 'users',
    accent: '#F59E0B',
    tagline: 'STAR, conflict, ownership, leadership',
    description:
      'STAR structure and a reusable story bank, conflict and collaboration, ownership and failure, and the senior impact and leadership signals.',
    tags: ['STAR', 'Conflict', 'Failure', 'Ownership', 'Mentoring', 'Influence'],
    subtopics: BEHAV_SUBTOPICS,
    readiness: BEHAV_READINESS,
  },
  {
    slug: 'hr-manager',
    title: 'HR & Manager Round',
    short: 'HR / Manager',
    icon: 'briefcase',
    accent: '#EC4899',
    tagline: 'Screening, fit, negotiation, 30/60/90',
    description:
      'Recruiter screening, fit and motivation, compensation and negotiation, and the hiring-manager round including your first 90 days.',
    tags: ['Screening', 'Why Us', 'Total Comp', 'Negotiation', '30/60/90'],
    subtopics: HR_SUBTOPICS,
    readiness: HR_READINESS,
  },
  {
    slug: 'cs-fundamentals',
    title: 'CS Fundamentals',
    short: 'CS Core',
    icon: 'cpu',
    accent: '#06B6D4',
    tagline: 'OS, networks, DBMS and OOP',
    description:
      'Operating systems, computer networks, DBMS internals and object-oriented / low-level design — the theory round that campus and service-company interviews lean on hardest.',
    tags: ['Processes', 'Virtual Memory', 'TCP/IP', 'HTTP/3', 'Normalisation', 'MVCC', 'SOLID'],
    subtopics: CSF_SUBTOPICS,
    readiness: CSF_READINESS,
  },
  {
    slug: 'aptitude',
    title: 'Aptitude & Reasoning',
    short: 'Aptitude',
    icon: 'calculator',
    accent: '#84CC16',
    tagline: 'Quant, logic and data interpretation',
    description:
      'The timed screening round used by most mass recruiters — quantitative aptitude, logical reasoning, data interpretation and verbal ability, with the shortcuts that make the clock manageable.',
    tags: ['Time-Speed-Distance', 'Work & Rate', 'Percentages', 'Series', 'Syllogisms', 'DI'],
    subtopics: APT_SUBTOPICS,
    readiness: APT_READINESS,
  },
]

export const getTrack = (slug: string): InterviewTrack | undefined =>
  TRACKS.find((t) => t.slug === slug)

export function trackStats(track: InterviewTrack) {
  const questions = track.subtopics.reduce((n, s) => n + s.questions.length, 0)
  const readings = track.subtopics.reduce((n, s) => n + s.reading.length, 0)
  const byLevel = AIML_LEVELS.reduce((acc, lvl) => {
    acc[lvl] = track.subtopics.reduce((n, s) => n + s.questions.filter((q) => q.level === lvl).length, 0)
    return acc
  }, {} as Record<AimlLevel, number>)
  return { subtopics: track.subtopics.length, questions, readings, byLevel }
}

export const ALL_TRACKS_STATS = {
  tracks: TRACKS.length,
  questions: TRACKS.reduce((n, t) => n + trackStats(t).questions, 0),
  subtopics: TRACKS.reduce((n, t) => n + t.subtopics.length, 0),
}
