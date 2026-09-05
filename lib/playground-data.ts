// ---------------------------------------------------------------------------
// Playground Problem Bank & Job-Readiness Intelligence Engine
// Curated for KIIT placement & top tech companies
// ---------------------------------------------------------------------------

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Language =
  | 'python' | 'javascript' | 'typescript' | 'java' | 'cpp' | 'c'
  | 'csharp' | 'go' | 'rust' | 'kotlin' | 'swift' | 'ruby' | 'php' | 'sql'

export type Company = string
export type CompanyRole = string
export type ExperienceLevel = string

export type Topic =
  | 'All'
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stacks & Queues'
  | 'Trees'
  | 'Graphs'
  | 'Hashing'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Binary Search'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Recursion & Backtracking'
  | 'Bit Manipulation'
  | 'Math'
  | 'Heap / Priority Queue'
  | 'Intervals'
  | 'Monotonic Stack'
  | 'Design'
  | 'Tries'
  | 'Advanced Data Structures'
  | 'Others'
  // Backward compatibility alias keys
  | 'Hash Table'
  | 'Stack'
  | 'Heap'
  | 'Backtracking'
  | 'Linked List'
  | 'SQL'

export type Pattern =
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Fast & Slow Pointers'
  | 'Binary Search'
  | 'Backtracking'
  | 'DFS'
  | 'BFS'
  | 'HashMap'
  | 'Heap'
  | 'Monotonic Stack'
  | 'Prefix Sum'
  | 'Union Find'
  | 'Dynamic Programming'
  | 'Topological Sort'
  | 'Trie'
  | 'Kadane Algorithm'
  | 'Greedy'
  | 'Bitwise'
  | 'Divide & Conquer'

export type ListName =
  | 'Top Interview Questions'
  | 'Blind 75'
  | 'NeetCode 150'
  | 'Top 100 DSA'
  | 'FAANG Preparation'
  | 'Amazon Preparation'
  | 'Microsoft Preparation'
  | 'Google Preparation'
  | 'Beginner DSA'
  | 'SDE-1 Preparation'
  | 'SDE-2 Preparation'
  | 'Intern Preparation'
  | 'Frequently Reported'
  | 'Recently Reported'
  | 'My Bookmarks'
  | 'My Weak Topics'

export type SignalType = 'frequent' | 'recent' | 'priority'

export interface TestCase {
  id: number
  input: string
  expectedOutput: string
  isHidden?: boolean
}

export interface InterviewReport {
  company: Company
  role: CompanyRole
  experience: ExperienceLevel
  reportedDate: string
  stage: 'Online Assessment' | 'Technical Round 1' | 'Technical Round 2' | 'System Design' | 'Bar Raiser'
  confidence: 'High' | 'Very High' | 'Medium' | 'Low'
  reportsCount: number
  signalNotes: string
  sourceName?: string
  sourceUrl?: string
}

export interface WebDiscoveredReport {
  id: string
  title: string
  company: Company
  role: CompanyRole
  topic: Topic
  pattern?: string
  difficulty: Difficulty
  reportedDate: string
  sourceName: string
  sourceUrl: string
  confidence: 'High' | 'Medium' | 'Low'
  summary: string
  isPermittedSource: boolean
}

export interface QuestionVariant {
  id: string
  title: string
  difficulty: Difficulty
  relationship: string
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  companies: Company[]
  companyRoles?: Partial<Record<Company, CompanyRole[]>>
  companyExperience?: Partial<Record<Company, ExperienceLevel[]>>
  topics: Topic[]
  subtopic?: string
  patterns?: Pattern[]
  lists?: ListName[]
  signal?: SignalType
  signalText?: string
  confidence?: 'High' | 'Very High' | 'Medium'
  askedCount: number
  lastReportedDate?: string
  reports?: InterviewReport[]
  variants?: QuestionVariant[]
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  testCases: TestCase[]
  starterCode: Partial<Record<Language, string>>
  interviewSignal?: string[]
  similarProblems?: string[]
}

// Target profile structure for personalized job intelligence
export interface TargetProfile {
  company: Company
  role: CompanyRole
  experience: ExperienceLevel
  weakTopics: Topic[]
}

export const DEFAULT_TARGET_PROFILE: TargetProfile = {
  company: 'Amazon',
  role: 'SDE-1',
  experience: '0-2 Years',
  weakTopics: ['Dynamic Programming', 'Sliding Window'],
}

export type PriorityTier = 'must-practice' | 'high-priority' | 'recommended' | 'good-to-know'

export interface ScoredProblem {
  problem: Problem
  jobRelevanceScore: number // 0 - 100
  priorityTier: PriorityTier
  priorityLabel: string // '🔥 Must Practice' | '⭐ High Priority' | '⚡ Recommended' | '📘 Good to Know'
  priorityReason: string
  isCompanyMatch: boolean
  isRoleMatch: boolean
  isWeakTopicBoost: boolean
  interviewReportsCount: number
  confidenceLevel: 'Very High' | 'High' | 'Medium' | 'Low'
  lastReported: string
}

// ---------------------------------------------------------------------------
// HIERARCHICAL TOPICS & SUBTOPICS STRUCTURE
// ---------------------------------------------------------------------------
export interface SubtopicDefinition {
  id: string
  label: string
  problemIds: string[]
}

export interface TopicDefinition {
  key: string
  id: Topic
  label: string
  importanceRank: 'High' | 'Medium' | 'Standard'
  totalCount: number
  subtopics: SubtopicDefinition[]
}

export const HIERARCHICAL_TOPICS: TopicDefinition[] = [
  {
    key: 'arrays',
    id: 'Arrays',
    label: 'Arrays',
    importanceRank: 'High',
    totalCount: 120,
    subtopics: [
      { id: 'arrays-basic', label: 'Basic Array Problems', problemIds: ['two-sum', 'contains-duplicate', 'best-time-to-buy-stock'] },
      { id: 'arrays-prefix', label: 'Prefix Sum', problemIds: ['product-except-self'] },
      { id: 'arrays-two-pointers', label: 'Two Pointers in Arrays', problemIds: ['three-sum', 'container-with-most-water'] },
      { id: 'arrays-sliding-window', label: 'Sliding Window Arrays', problemIds: ['longest-substring', 'permutation-string'] },
      { id: 'arrays-sorting', label: 'Sorting & Selection', problemIds: ['kth-largest-element'] },
      { id: 'arrays-binary-search', label: 'Binary Search on Arrays', problemIds: ['binary-search-basic', 'search-rotated-sorted-array'] },
      { id: 'arrays-kadane', label: "Kadane's Algorithm", problemIds: ['max-subarray'] },
      { id: 'arrays-intervals', label: 'Interval Operations', problemIds: ['merge-intervals'] },
    ],
  },
  {
    key: 'strings',
    id: 'Strings',
    label: 'Strings',
    importanceRank: 'High',
    totalCount: 95,
    subtopics: [
      { id: 'strings-anagrams', label: 'Anagrams & Palindromes', problemIds: ['valid-anagram', 'group-anagrams', 'longest-palindromic-substring'] },
      { id: 'strings-parsing', label: 'Parsing & Substrings', problemIds: ['longest-substring', 'permutation-string'] },
    ],
  },
  {
    key: 'hashing',
    id: 'Hashing',
    label: 'Hashing',
    importanceRank: 'High',
    totalCount: 72,
    subtopics: [
      { id: 'hash-map', label: 'HashMap Lookups & Frequency', problemIds: ['two-sum', 'contains-duplicate', 'group-anagrams'] },
      { id: 'hash-set', label: 'HashSet Deduplication', problemIds: ['longest-substring'] },
    ],
  },
  {
    key: 'linked-lists',
    id: 'Linked Lists',
    label: 'Linked Lists',
    importanceRank: 'High',
    totalCount: 58,
    subtopics: [
      { id: 'll-pointers', label: 'Cycle Detection & Fast/Slow', problemIds: ['linked-list-cycle'] },
      { id: 'll-reversal', label: 'Reversal & In-Place Modification', problemIds: ['reverse-linked-list'] },
      { id: 'll-merge', label: 'Merge & Splice', problemIds: ['merge-two-sorted-lists'] },
      { id: 'll-design', label: 'Doubly Linked List in Design', problemIds: ['lru-cache'] },
    ],
  },
  {
    key: 'stacks-queues',
    id: 'Stacks & Queues',
    label: 'Stacks & Queues',
    importanceRank: 'High',
    totalCount: 62,
    subtopics: [
      { id: 'sq-parentheses', label: 'Parentheses Matching & Evaluation', problemIds: ['valid-parentheses'] },
      { id: 'sq-monotonic', label: 'Monotonic Stack & Deque', problemIds: ['daily-temperatures', 'sliding-window-max'] },
      { id: 'sq-design', label: 'Custom Stack & Queue Design', problemIds: ['min-stack'] },
    ],
  },
  {
    key: 'trees',
    id: 'Trees',
    label: 'Trees',
    importanceRank: 'High',
    totalCount: 92,
    subtopics: [
      { id: 'trees-traversal', label: 'Binary Tree Level Order & Views', problemIds: ['binary-tree-level-order'] },
      { id: 'trees-transform', label: 'Tree Inversion & Symmetry', problemIds: ['invert-binary-tree'] },
      { id: 'trees-bst', label: 'Binary Search Trees & LCA', problemIds: ['lowest-common-ancestor-bst'] },
    ],
  },
  {
    key: 'heaps',
    id: 'Heap / Priority Queue',
    label: 'Heaps',
    importanceRank: 'High',
    totalCount: 68,
    subtopics: [
      { id: 'heap-top-k', label: 'Top K Elements & Quickselect', problemIds: ['kth-largest-element'] },
    ],
  },
  {
    key: 'graphs',
    id: 'Graphs',
    label: 'Graphs',
    importanceRank: 'High',
    totalCount: 110,
    subtopics: [
      { id: 'graphs-traversal', label: 'BFS & DFS Matrix Traversals', problemIds: ['number-of-islands'] },
      { id: 'graphs-topo', label: 'Topological Sort & Cycle Detection', problemIds: ['course-schedule'] },
    ],
  },
  {
    key: 'recursion',
    id: 'Recursion & Backtracking',
    label: 'Recursion',
    importanceRank: 'Medium',
    totalCount: 40,
    subtopics: [
      { id: 'rec-divide', label: 'Divide & Conquer', problemIds: ['invert-binary-tree', 'subsets'] },
    ],
  },
  {
    key: 'backtracking',
    id: 'Recursion & Backtracking',
    label: 'Backtracking',
    importanceRank: 'Medium',
    totalCount: 36,
    subtopics: [
      { id: 'bt-subsets', label: 'Power Set & Subsets', problemIds: ['subsets'] },
    ],
  },
  {
    key: 'greedy',
    id: 'Greedy',
    label: 'Greedy',
    importanceRank: 'Medium',
    totalCount: 54,
    subtopics: [
      { id: 'greedy-intervals', label: 'Interval Scheduling', problemIds: ['merge-intervals'] },
      { id: 'greedy-reach', label: 'Reachability & Jump Game', problemIds: ['jump-game'] },
    ],
  },
  {
    key: 'dynamic-programming',
    id: 'Dynamic Programming',
    label: 'Dynamic Programming',
    importanceRank: 'High',
    totalCount: 140,
    subtopics: [
      { id: 'dp-1d', label: '1D DP & Fibonacci Patterns', problemIds: ['climbing-stairs'] },
      { id: 'dp-knapsack', label: 'Unbounded Knapsack & Coin Change', problemIds: ['coin-change'] },
      { id: 'dp-subsequences', label: 'Longest Subsequences (LIS)', problemIds: ['longest-increasing-subsequence'] },
      { id: 'dp-kadane', label: 'Subarray Kadane DP', problemIds: ['max-subarray'] },
    ],
  },
  {
    key: 'binary-search',
    id: 'Binary Search',
    label: 'Binary Search',
    importanceRank: 'High',
    totalCount: 48,
    subtopics: [
      { id: 'bs-basic', label: 'Basic Binary Search', problemIds: ['binary-search-basic'] },
      { id: 'bs-rotated', label: 'Rotated Sorted Arrays', problemIds: ['search-rotated-sorted-array'] },
      { id: 'bs-patience', label: 'Patience Sorting in DP', problemIds: ['longest-increasing-subsequence'] },
    ],
  },
  {
    key: 'two-pointers',
    id: 'Two Pointers',
    label: 'Two Pointers',
    importanceRank: 'High',
    totalCount: 60,
    subtopics: [
      { id: 'tp-sorted', label: 'Opposite Ends Shrinking', problemIds: ['three-sum', 'container-with-most-water'] },
      { id: 'tp-fast-slow', label: 'Fast & Slow Pointers', problemIds: ['linked-list-cycle'] },
    ],
  },
  {
    key: 'sliding-window',
    id: 'Sliding Window',
    label: 'Sliding Window',
    importanceRank: 'High',
    totalCount: 66,
    subtopics: [
      { id: 'sw-fixed', label: 'Fixed Size Window', problemIds: ['permutation-string'] },
      { id: 'sw-variable', label: 'Variable Size Window', problemIds: ['longest-substring'] },
      { id: 'sw-deque', label: 'Advanced Sliding Window', problemIds: ['sliding-window-max'] },
    ],
  },
  {
    key: 'bit-manipulation',
    id: 'Bit Manipulation',
    label: 'Bit Manipulation',
    importanceRank: 'Standard',
    totalCount: 44,
    subtopics: [
      { id: 'bit-xor', label: 'XOR Cancellation Tricks', problemIds: ['single-number'] },
    ],
  },
  {
    key: 'tries',
    id: 'Tries',
    label: 'Tries',
    importanceRank: 'Standard',
    totalCount: 36,
    subtopics: [
      { id: 'trie-prefix', label: 'Prefix Trees & Word Lookup', problemIds: ['group-anagrams'] },
    ],
  },
  {
    key: 'intervals',
    id: 'Intervals',
    label: 'Intervals',
    importanceRank: 'High',
    totalCount: 40,
    subtopics: [
      { id: 'int-merge', label: 'Merge Overlapping Intervals', problemIds: ['merge-intervals'] },
    ],
  },
  {
    key: 'advanced-ds',
    id: 'Advanced Data Structures',
    label: 'Advanced DS',
    importanceRank: 'Medium',
    totalCount: 52,
    subtopics: [
      { id: 'mono-daily', label: 'Monotonic Stack & Deque', problemIds: ['daily-temperatures', 'sliding-window-max'] },
      { id: 'ds-union-find', label: 'Disjoint Set / Union Find', problemIds: ['number-of-islands'] },
    ],
  },
  {
    key: 'math',
    id: 'Math',
    label: 'Math',
    importanceRank: 'Standard',
    totalCount: 70,
    subtopics: [
      { id: 'math-basic', label: 'Arithmetic & Number Theory', problemIds: ['climbing-stairs'] },
    ],
  },
  {
    key: 'matrix',
    id: 'Others',
    label: 'Matrix',
    importanceRank: 'Standard',
    totalCount: 46,
    subtopics: [
      { id: 'matrix-traversal', label: 'Matrix Grid Traversals', problemIds: ['number-of-islands'] },
    ],
  },
  {
    key: 'design',
    id: 'Design',
    label: 'Design',
    importanceRank: 'High',
    totalCount: 38,
    subtopics: [
      { id: 'design-lru', label: 'LRU Cache Design', problemIds: ['lru-cache'] },
      { id: 'design-min-stack', label: 'Min Stack Design', problemIds: ['min-stack'] },
      { id: 'sql-aggregation', label: 'SQL Aggregation & Analytics', problemIds: ['top-k-customers-sql'] },
    ],
  },
]

export const TOPIC_CATEGORIES = HIERARCHICAL_TOPICS.map(t => ({
  id: t.id,
  key: t.key,
  label: t.label,
  importanceRank: t.importanceRank,
}))

// ---------------------------------------------------------------------------
// 20+ COMPANIES DIRECTORY WITH INTERVIEW INTELLIGENCE
// ---------------------------------------------------------------------------
export interface PopularRole {
  role: string
  level: string
}

export interface ImportantTopicInsight {
  topic: string
  count: number
  percentage: number
}

export interface CompanyMetadata {
  id: string
  name: string
  category: 'FAANG' | 'Product' | 'Finance' | 'India' | 'Startups' | 'Services' | 'Other' | 'More'
  roles: string[]
  experienceLevels: string[]
  roleCount: number
  description?: string
  industry?: string
  headquarters?: string
  website?: string
  questionCount?: number
  highPriorityCount?: number
  reportedCount?: number
  topicsCoveredCount?: number
  popularRoles?: PopularRole[]
  interviewTips?: string[]
  companyInsight?: string
  importantTopics?: ImportantTopicInsight[]
  commonTopics?: { topic: Topic; percentage: number }[]
  commonPatterns?: string[]
  hiringFocus?: string
  frequentlyReportedQuestions?: string[]
}

export const TOP_COMPANIES: CompanyMetadata[] = [
  // FAANG / Global Giants
  {
    id: 'Amazon',
    name: 'Amazon',
    category: 'FAANG',
    industry: 'E-commerce & Cloud Computing',
    headquarters: 'Seattle, Washington, USA',
    website: 'https://amazon.jobs',
    questionCount: 128,
    highPriorityCount: 32,
    reportedCount: 24,
    topicsCoveredCount: 18,
    roles: ['SDE-1', 'SDE-2', 'SDE-3', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Global cloud infrastructure (AWS) and digital commerce titan. High emphasis on Leadership Principles, scalable distributed architectures, and clean algorithmic problem solving.',
    popularRoles: [
      { role: 'SDE-1', level: 'Entry Level (0-2 Yrs)' },
      { role: 'SDE-2', level: 'Mid Level (2-5 Yrs)' },
      { role: 'SDE-3', level: 'Senior / Staff (5+ Yrs)' },
      { role: 'Software Engineer Intern', level: 'Campus / Student' },
    ],
    interviewTips: [
      'Focus intensely on Data Structures and Algorithms with optimal space/time bounds.',
      'Tie technical decisions to Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action).',
      'For SDE-2+ roles, prepare for high-level distributed system design and trade-offs.',
      'Communicate thought process clearly before writing code in live coding rounds.',
    ],
    companyInsight: 'Amazon rounds heavily test sliding window arrays, binary tree depths, dynamic programming knapsack patterns, and cache eviction mechanisms.',
    importantTopics: [
      { topic: 'Arrays & Two Pointers', count: 78, percentage: 92 },
      { topic: 'Dynamic Programming', count: 62, percentage: 84 },
      { topic: 'Trees & Traversals', count: 48, percentage: 76 },
      { topic: 'Graphs & BFS/DFS', count: 44, percentage: 68 },
      { topic: 'Hashing & Deduplication', count: 40, percentage: 62 },
      { topic: 'Sliding Window', count: 38, percentage: 58 },
      { topic: 'Design & LRU', count: 34, percentage: 50 },
      { topic: 'Strings & Parsing', count: 32, percentage: 46 },
    ],
    commonTopics: [
      { topic: 'Arrays', percentage: 92 },
      { topic: 'Dynamic Programming', percentage: 84 },
      { topic: 'Trees', percentage: 76 },
      { topic: 'Sliding Window', percentage: 58 },
    ],
    commonPatterns: ['Sliding Window', 'Two Pointers', 'DFS', 'BFS', 'Dynamic Programming', 'Monotonic Stack'],
  },
  {
    id: 'Microsoft',
    name: 'Microsoft',
    category: 'FAANG',
    industry: 'Enterprise Software & Cloud (Azure)',
    headquarters: 'Redmond, Washington, USA',
    website: 'https://careers.microsoft.com',
    questionCount: 96,
    highPriorityCount: 28,
    reportedCount: 20,
    topicsCoveredCount: 16,
    roles: ['SDE-1', 'SDE-2', 'SDE-3', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Pioneer in operating systems, Azure cloud, productivity tooling, and AI. Emphasizes clean object-oriented architecture, modular logic, and robust test case reasoning.',
    popularRoles: [
      { role: 'Software Engineer (SDE-1)', level: 'Entry Level' },
      { role: 'Software Engineer II (SDE-2)', level: 'Mid Level' },
      { role: 'Senior Software Engineer', level: 'Senior Level' },
      { role: 'Explore Intern', level: 'Student Program' },
    ],
    interviewTips: [
      'Write production-grade, readable code with clean variable naming and OOP principles.',
      'Be comfortable walking through edge cases (null inputs, overflows, empty structures).',
      'System design rounds test Azure/cloud scalability, caching tiers, and async pipelines.',
    ],
    companyInsight: 'Frequently tests linked list cycle operations, binary tree level orders, matrix transformations, and Trie search prefix logic.',
    importantTopics: [
      { topic: 'Arrays & Matrix', count: 68, percentage: 88 },
      { topic: 'Trees & BST', count: 54, percentage: 80 },
      { topic: 'Linked Lists', count: 42, percentage: 68 },
      { topic: 'Dynamic Programming', count: 38, percentage: 60 },
      { topic: 'Graphs & Topological Sort', count: 32, percentage: 54 },
      { topic: 'Strings', count: 28, percentage: 46 },
    ],
    commonTopics: [
      { topic: 'Arrays', percentage: 88 },
      { topic: 'Trees', percentage: 80 },
      { topic: 'Linked Lists', percentage: 68 },
    ],
    commonPatterns: ['DFS', 'BFS', 'Two Pointers', 'Fast & Slow Pointers'],
  },
  {
    id: 'Google',
    name: 'Google',
    category: 'FAANG',
    industry: 'Search, Cloud & AI Systems',
    headquarters: 'Mountain View, California, USA',
    website: 'https://careers.google.com',
    questionCount: 102,
    highPriorityCount: 36,
    reportedCount: 26,
    topicsCoveredCount: 19,
    roles: ['Software Engineer (L3)', 'Software Engineer (L4)', 'Senior SWE (L5)', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Search, YouTube, Android, and Alphabet core AI infrastructure. Renowned for rigorous asymptotic optimization, complex graph algorithms, and edge-case mastery.',
    popularRoles: [
      { role: 'Software Engineer (L3)', level: 'Campus / Entry Level' },
      { role: 'Software Engineer (L4)', level: 'Mid Level' },
      { role: 'Senior SWE (L5)', level: 'Senior Level' },
      { role: 'STEP Intern', level: 'Undergraduate Program' },
    ],
    interviewTips: [
      'Always state both time and space complexity before and after coding.',
      'Google interviewers expect multiple solution approaches from naive to optimal.',
      'Master graph traversal (Dijkstra, Topological Sort, Union-Find) and 2D dynamic programming.',
    ],
    companyInsight: 'Interviewers often provide ambiguous requirements intentionally to assess candidate clarification questions and trade-off analysis.',
    importantTopics: [
      { topic: 'Graphs & Union-Find', count: 72, percentage: 94 },
      { topic: 'Dynamic Programming', count: 66, percentage: 86 },
      { topic: 'Arrays & Sliding Window', count: 58, percentage: 78 },
      { topic: 'Trees & Segment Trees', count: 46, percentage: 66 },
      { topic: 'Binary Search On Answers', count: 36, percentage: 52 },
    ],
    commonTopics: [
      { topic: 'Graphs', percentage: 94 },
      { topic: 'Dynamic Programming', percentage: 86 },
      { topic: 'Binary Search', percentage: 52 },
    ],
    commonPatterns: ['BFS', 'DFS', 'Dynamic Programming', 'Binary Search', 'Sliding Window'],
  },
  {
    id: 'Meta',
    name: 'Meta',
    category: 'FAANG',
    industry: 'Social Technologies & AI Hardware',
    headquarters: 'Menlo Park, California, USA',
    website: 'https://www.metacareers.com',
    questionCount: 76,
    highPriorityCount: 24,
    reportedCount: 18,
    topicsCoveredCount: 15,
    roles: ['Software Engineer (E3)', 'Software Engineer (E4)', 'Senior SWE (E5)', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Creator of Facebook, Instagram, WhatsApp, and PyTorch AI frameworks. Prioritizes rapid bug-free implementation of algorithmic solutions under tight time constraints.',
    popularRoles: [
      { role: 'Software Engineer (E3)', level: 'Entry Level' },
      { role: 'Software Engineer (E4)', level: 'Mid Level' },
      { role: 'Senior Software Engineer (E5)', level: 'Senior Level' },
    ],
    interviewTips: [
      'Aim to solve two medium-difficulty questions in a 45-minute coding round.',
      'Speed and working bug-free syntax are paramount in Meta interviews.',
      'Two Pointers, Binary Search, and Tree LCA are Meta favorites.',
    ],
    importantTopics: [
      { topic: 'Arrays & Two Pointers', count: 52, percentage: 90 },
      { topic: 'Trees & LCA', count: 44, percentage: 82 },
      { topic: 'Binary Search', count: 36, percentage: 70 },
      { topic: 'Graphs & BFS', count: 30, percentage: 60 },
    ],
  },
  {
    id: 'Apple',
    name: 'Apple',
    category: 'FAANG',
    industry: 'Consumer Hardware, OS & Services',
    headquarters: 'Cupertino, California, USA',
    website: 'https://jobs.apple.com',
    questionCount: 58,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['Software Engineer (ICT-2)', 'Software Engineer (ICT-3)', 'Senior SWE (ICT-4)', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Hardware and software integration leader. Rounds place strong emphasis on bit manipulation, memory efficiency, concurrent threads, and data structures.',
    popularRoles: [
      { role: 'Software Engineer (ICT-2)', level: 'Entry Level' },
      { role: 'Software Engineer (ICT-3)', level: 'Mid Level' },
      { role: 'Senior SWE (ICT-4)', level: 'Senior Level' },
    ],
    interviewTips: [
      'Strong grasp of memory layout, pointers, and cache friendliness.',
      'Expect low-level systems questions in addition to standard LeetCode style problems.',
    ],
    importantTopics: [
      { topic: 'Bit Manipulation & Math', count: 38, percentage: 84 },
      { topic: 'Arrays & Pointers', count: 34, percentage: 76 },
      { topic: 'Linked Lists & Caches', count: 28, percentage: 64 },
    ],
  },
  {
    id: 'Netflix',
    name: 'Netflix',
    category: 'FAANG',
    industry: 'Streaming Media & Distributed Cloud',
    headquarters: 'Los Gatos, California, USA',
    website: 'https://jobs.netflix.com',
    questionCount: 52,
    highPriorityCount: 16,
    reportedCount: 12,
    topicsCoveredCount: 12,
    roles: ['Senior Software Engineer', 'Software Engineer'],
    experienceLevels: ['2–5 Years', '5+ Years'],
    roleCount: 2,
    description: 'Global streaming infrastructure and open source cloud tooling. Evaluates high-throughput queuing, concurrency, distributed caching, and interval scheduling.',
    popularRoles: [
      { role: 'Software Engineer (L4)', level: 'Mid Level' },
      { role: 'Senior Software Engineer (L5)', level: 'Senior Level' },
    ],
    interviewTips: [
      'Demonstrate deep ownership and architectural intuition for high concurrency.',
      'Strong knowledge of LRU/LFU caching, sliding window rate limiters, and distributed consensus.',
    ],
    importantTopics: [
      { topic: 'System Design & Queues', count: 32, percentage: 86 },
      { topic: 'Intervals & Greedy', count: 26, percentage: 74 },
      { topic: 'Dynamic Programming', count: 22, percentage: 62 },
    ],
  },

  // Global Product Leaders
  {
    id: 'Adobe',
    name: 'Adobe',
    category: 'Product',
    industry: 'Creative Cloud & Digital Experience',
    headquarters: 'San Jose, California, USA',
    website: 'https://careers.adobe.com',
    questionCount: 64,
    highPriorityCount: 20,
    reportedCount: 15,
    topicsCoveredCount: 15,
    roles: ['Software Engineer (MTS-1)', 'MTS-2', 'Senior MTS', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Creator of Photoshop, Premiere, and enterprise marketing suites. Tests 2D matrix dynamic programming, string parsing algorithms, computational geometry, and image buffers.',
    popularRoles: [
      { role: 'Member Technical Staff 1', level: 'Entry Level' },
      { role: 'Member Technical Staff 2', level: 'Mid Level' },
      { role: 'Senior MTS', level: 'Senior Level' },
    ],
    interviewTips: [
      'Review 2D Matrix DP and geometric coordinates.',
      'String pattern matching (KMP, Rolling Hash) is frequently asked.',
    ],
    importantTopics: [
      { topic: 'Matrix & 2D DP', count: 36, percentage: 82 },
      { topic: 'Strings & Parsing', count: 30, percentage: 72 },
      { topic: 'Trees & Graphs', count: 26, percentage: 64 },
    ],
  },
  {
    id: 'Oracle',
    name: 'Oracle',
    category: 'Product',
    industry: 'Enterprise Cloud Infrastructure & Relational DBs',
    headquarters: 'Austin, Texas, USA',
    website: 'https://oracle.com/careers',
    questionCount: 72,
    highPriorityCount: 22,
    reportedCount: 16,
    topicsCoveredCount: 15,
    roles: ['Applications Developer', 'Software Engineer (IC2)', 'Senior Software Engineer (IC3)', 'MTS'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Enterprise relational database and OCI cloud provider. High focus on B-tree structures, relational SQL query planners, locking mechanisms, and sorting algorithms.',
    popularRoles: [
      { role: 'Software Developer (IC1/IC2)', level: 'Entry / Campus' },
      { role: 'Senior Developer (IC3)', level: 'Mid Level' },
    ],
    interviewTips: [
      'Master binary search trees, B-Trees, and database indexing fundamentals.',
      'Expect deep questions on SQL aggregation and thread synchronization.',
    ],
    importantTopics: [
      { topic: 'Trees & BST', count: 42, percentage: 85 },
      { topic: 'SQL & Database Design', count: 36, percentage: 78 },
      { topic: 'Sorting & Heaps', count: 28, percentage: 65 },
    ],
  },
  {
    id: 'NVIDIA',
    name: 'NVIDIA',
    category: 'Product',
    industry: 'GPU Computing, AI Chips & Omniverse',
    headquarters: 'Santa Clara, California, USA',
    website: 'https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite',
    questionCount: 64,
    highPriorityCount: 22,
    reportedCount: 17,
    topicsCoveredCount: 14,
    roles: ['Systems Software Engineer', 'AI Infrastructure Engineer', 'GPU Architect', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'World leader in GPU accelerated computing, CUDA, and AI data centers. Emphasizes C/C++ memory layout, SIMD parallelism, bitwise manipulation, and graph traversal.',
    popularRoles: [
      { role: 'Systems Software Engineer', level: 'Entry / Mid' },
      { role: 'AI Infrastructure Engineer', level: 'Mid / Senior' },
      { role: 'GPU Performance Architect', level: 'Senior' },
    ],
    interviewTips: [
      'Deeply revise bit manipulation, bitmask DP, and memory cache hierarchies.',
      'Parallel algorithms and CUDA kernel optimization concepts give a strong advantage.',
    ],
    importantTopics: [
      { topic: 'Bit Manipulation & Bitmasks', count: 40, percentage: 90 },
      { topic: 'Parallel Algorithms & Heaps', count: 32, percentage: 78 },
      { topic: 'Arrays & Matrix', count: 28, percentage: 70 },
    ],
  },
  {
    id: 'Uber',
    name: 'Uber',
    category: 'Product',
    industry: 'Mobility, Logistics & Geospatial Systems',
    headquarters: 'San Francisco, California, USA',
    website: 'https://uber.com/careers',
    questionCount: 68,
    highPriorityCount: 24,
    reportedCount: 18,
    topicsCoveredCount: 16,
    roles: ['Software Engineer (L3)', 'Software Engineer (L4)', 'Senior SWE (L5)', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Global ride-hailing and logistics infrastructure. Tests shortest path Dijkstra graphs, real-time dispatch heaps, spatial quad-trees, and concurrency pipelines.',
    popularRoles: [
      { role: 'Software Engineer (L3)', level: 'Entry Level' },
      { role: 'Software Engineer II (L4)', level: 'Mid Level' },
      { role: 'Senior Software Engineer (L5)', level: 'Senior Level' },
    ],
    interviewTips: [
      'Focus on Graph algorithms: Dijkstra, Bellman-Ford, and Priority Queue matching.',
      'Geospatial indexing (H3, QuadTrees) and state machine resilience are heavily praised.',
    ],
    importantTopics: [
      { topic: 'Graphs & Shortest Path', count: 48, percentage: 92 },
      { topic: 'Heaps & Priority Queues', count: 36, percentage: 80 },
      { topic: 'Dynamic Programming', count: 30, percentage: 68 },
    ],
  },
  {
    id: 'Atlassian',
    name: 'Atlassian',
    category: 'Product',
    industry: 'Collaboration Software (Jira, Confluence, Trello)',
    headquarters: 'Sydney, Australia',
    website: 'https://www.atlassian.com/company/careers',
    questionCount: 56,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['Software Engineer (P3)', 'Senior SWE (P4)', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 3,
    description: 'Enterprise agility and developer productivity tooling. Emphasizes clean design patterns, rate limiter architectures, Trie prefix lookups, and test coverage.',
    popularRoles: [
      { role: 'Software Engineer (P3)', level: 'Entry / Mid' },
      { role: 'Senior Software Engineer (P4)', level: 'Senior' },
    ],
    interviewTips: [
      'Prioritize clean coding structure, unit tests, and maintainable OOP hierarchy.',
      'Trie structures and rate-limiting sliding windows are common interview topics.',
    ],
    importantTopics: [
      { topic: 'Tries & Prefix Search', count: 32, percentage: 82 },
      { topic: 'OOP Design & Caches', count: 28, percentage: 76 },
      { topic: 'Arrays & Strings', count: 24, percentage: 66 },
    ],
  },
  {
    id: 'Salesforce',
    name: 'Salesforce',
    category: 'Product',
    industry: 'CRM & Enterprise Cloud',
    headquarters: 'San Francisco, California, USA',
    website: 'https://careers.salesforce.com',
    questionCount: 62,
    highPriorityCount: 20,
    reportedCount: 15,
    topicsCoveredCount: 15,
    roles: ['AMTS', 'MTS', 'Senior MTS', 'Lead MTS'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Global CRM and multi-tenant cloud pioneer. Evaluates distributed caching, sliding window rate limits, tree traversal queries, and clean API design.',
    popularRoles: [
      { role: 'Associate Member Technical Staff (AMTS)', level: 'Entry / Campus' },
      { role: 'Member Technical Staff (MTS)', level: 'Mid Level' },
      { role: 'Senior MTS', level: 'Senior Level' },
    ],
    interviewTips: [
      'Multi-tenant architecture considerations and API idempotency.',
      'Sliding window algorithms and binary tree serialization.',
    ],
    importantTopics: [
      { topic: 'Trees & Serialization', count: 36, percentage: 80 },
      { topic: 'Sliding Window & Hashing', count: 32, percentage: 74 },
      { topic: 'Design & Caching', count: 26, percentage: 64 },
    ],
  },
  {
    id: 'Flipkart',
    name: 'Flipkart',
    category: 'India',
    industry: 'E-commerce & Supply Chain Logistics',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://www.flipkartcareers.com',
    questionCount: 88,
    highPriorityCount: 30,
    reportedCount: 22,
    topicsCoveredCount: 18,
    roles: ['SDE-1', 'SDE-2', 'SDE-3', 'Software Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'India top e-commerce engineering team. Famous for rigorous machine coding rounds, hard dynamic programming, monotonic deques, and graph logistics.',
    popularRoles: [
      { role: 'SDE-1 (Machine Coding & DSA)', level: 'Entry / Campus' },
      { role: 'SDE-2 (DSA & LLD)', level: 'Mid Level' },
      { role: 'SDE-3 (HLD & Architecture)', level: 'Senior Level' },
    ],
    interviewTips: [
      'Prepare thoroughly for Machine Coding (LLD) with clean extensible classes and design patterns in 90 minutes.',
      'Dynamic programming (grid DP, knapsack) and Monotonic Stacks are campus staples.',
    ],
    importantTopics: [
      { topic: 'Low-Level Design / Machine Coding', count: 54, percentage: 95 },
      { topic: 'Dynamic Programming', count: 48, percentage: 88 },
      { topic: 'Monotonic Stack & Deque', count: 38, percentage: 76 },
      { topic: 'Graphs & BFS', count: 32, percentage: 66 },
    ],
  },
  {
    id: 'Goldman Sachs',
    name: 'Goldman Sachs',
    category: 'Finance',
    industry: 'Investment Banking & Quantitative Engineering',
    headquarters: 'New York, USA / Bengaluru, India',
    website: 'https://goldmansachs.com/careers',
    questionCount: 84,
    highPriorityCount: 26,
    reportedCount: 20,
    topicsCoveredCount: 16,
    roles: ['Analyst (New Grad)', 'Associate', 'Vice President (VP)', 'Summer Analyst'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 4,
    description: 'Premier quantitative and financial engineering firm. High mathematical focus, precision string manipulation, sliding window, and high-frequency order book heaps.',
    popularRoles: [
      { role: 'Technology Analyst (SDE)', level: 'Campus / Entry' },
      { role: 'Associate Engineer', level: 'Mid Level' },
      { role: 'Vice President', level: 'Lead / Management' },
    ],
    interviewTips: [
      'Strong mathematical aptitude, probability, and numerical series problem solving.',
      'Precision string manipulation (anagrams, custom sorting) and Min/Max heaps.',
    ],
    importantTopics: [
      { topic: 'Math & Number Theory', count: 46, percentage: 90 },
      { topic: 'Strings & Anagrams', count: 42, percentage: 84 },
      { topic: 'Heaps & Order Books', count: 36, percentage: 76 },
      { topic: 'Dynamic Programming', count: 32, percentage: 68 },
    ],
  },
  {
    id: 'JPMorgan Chase',
    name: 'JPMorgan Chase',
    category: 'Finance',
    industry: 'Financial Services & Core Payments',
    headquarters: 'New York, USA / Bengaluru & Hyderabad, India',
    website: 'https://careers.jpmorgan.com',
    questionCount: 74,
    highPriorityCount: 22,
    reportedCount: 17,
    topicsCoveredCount: 15,
    roles: ['Software Engineer (SEP)', 'Associate', 'VP'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 3,
    description: 'Global payments and retail banking powerhouse. Evaluates two pointers, binary search, relational integrity, and distributed ledger systems.',
    popularRoles: [
      { role: 'Software Engineer Program (SEP)', level: 'Campus Entry' },
      { role: 'Associate Software Engineer', level: 'Mid Level' },
    ],
    interviewTips: [
      'Two pointers, sorted array searching, and transactional database isolation levels.',
    ],
    importantTopics: [
      { topic: 'Two Pointers & Arrays', count: 44, percentage: 86 },
      { topic: 'Binary Search', count: 34, percentage: 74 },
      { topic: 'SQL & Transactions', count: 28, percentage: 64 },
    ],
  },
  {
    id: 'Swiggy',
    name: 'Swiggy',
    category: 'India',
    industry: 'Food Delivery, Quick Commerce & Logistics',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://careers.swiggy.com',
    questionCount: 58,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['SDE-1', 'SDE-2', 'SDE-3'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 3,
    description: 'India largest on-demand convenience platform. Tests delivery batching algorithms, geohash spatial grids, and machine coding design.',
    popularRoles: [
      { role: 'SDE-1', level: 'Entry Level' },
      { role: 'SDE-2', level: 'Mid Level' },
    ],
    interviewTips: [
      'Machine coding rounds test clean design patterns (Strategy, Factory, Observer).',
      'Geospatial clustering and routing graph algorithms are highly relevant.',
    ],
    importantTopics: [
      { topic: 'Machine Coding / LLD', count: 38, percentage: 90 },
      { topic: 'Graphs & BFS', count: 30, percentage: 76 },
      { topic: 'Sliding Window', count: 24, percentage: 62 },
    ],
  },
  {
    id: 'Zomato',
    name: 'Zomato',
    category: 'India',
    industry: 'Food Commerce & Blinkit Quick Supply',
    headquarters: 'Gurugram, Haryana, India',
    website: 'https://www.zomato.com/careers',
    questionCount: 54,
    highPriorityCount: 16,
    reportedCount: 13,
    topicsCoveredCount: 13,
    roles: ['SDE-1', 'SDE-2', 'SDE-3'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Food and grocery delivery giant. Focuses on Trie autocomplete engines, restaurant ranking algorithms, and resilient state machines.',
    popularRoles: [
      { role: 'Software Development Engineer 1', level: 'Entry' },
      { role: 'SDE-2', level: 'Mid' },
    ],
    interviewTips: ['Focus on fast search autocomplete (Tries) and caching architectures.'],
    importantTopics: [
      { topic: 'Tries & Strings', count: 32, percentage: 84 },
      { topic: 'Arrays & Two Pointers', count: 26, percentage: 72 },
    ],
  },
  {
    id: 'Razorpay',
    name: 'Razorpay',
    category: 'India',
    industry: 'Payment Gateway & Neobanking Infrastructure',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://razorpay.com/jobs',
    questionCount: 48,
    highPriorityCount: 15,
    reportedCount: 12,
    topicsCoveredCount: 12,
    roles: ['SDE-1', 'SDE-2', 'Senior SDE'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'India leading fintech payment gateway. Evaluates payment state machine resilience, idempotency, webhook processing, and sliding window rate limits.',
    popularRoles: [
      { role: 'SDE-1', level: 'Entry' },
      { role: 'SDE-2', level: 'Mid' },
    ],
    interviewTips: ['Focus on transaction state machines and rate-limiter design.'],
    importantTopics: [
      { topic: 'Sliding Window & Rate Limits', count: 28, percentage: 82 },
      { topic: 'OOP Design & State Machines', count: 24, percentage: 76 },
    ],
  },
  {
    id: 'TCS',
    name: 'TCS',
    category: 'Services',
    industry: 'Global IT & Digital Transformation',
    headquarters: 'Mumbai, Maharashtra, India',
    website: 'https://www.tcs.com/careers',
    questionCount: 92,
    highPriorityCount: 26,
    reportedCount: 22,
    topicsCoveredCount: 16,
    roles: ['Prime Specialist', 'Digital Engineer', 'Ninja Engineer', 'Intern'],
    experienceLevels: ['0–2 Years'],
    roleCount: 4,
    description: 'TCS Digital & CodeVita flagship hiring: Number theory, matrix manipulation, strings, and graph cycle detection.',
    popularRoles: [
      { role: 'Prime Specialist (High CTC)', level: 'Advanced Campus' },
      { role: 'Digital Engineer', level: 'Campus Digital' },
      { role: 'Ninja Engineer', level: 'Campus Standard' },
    ],
    interviewTips: [
      'TCS CodeVita / Digital questions test modular math, prime sieve, and matrix traversals.',
      'Ensure 100% test case coverage without Time Limit Exceeded errors.',
    ],
    importantTopics: [
      { topic: 'Math & Number Theory', count: 48, percentage: 92 },
      { topic: 'Matrix Traversals', count: 40, percentage: 82 },
      { topic: 'Strings & Palindromes', count: 34, percentage: 72 },
    ],
  },
  {
    id: 'Infosys',
    name: 'Infosys',
    category: 'Services',
    industry: 'Enterprise IT Consulting & Digital Services',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://www.infosys.com/careers',
    questionCount: 86,
    highPriorityCount: 24,
    reportedCount: 20,
    topicsCoveredCount: 15,
    roles: ['Specialist Programmer (PP)', 'Digital Specialist Engineer (DSE)', 'Systems Engineer'],
    experienceLevels: ['0–2 Years'],
    roleCount: 3,
    description: 'HackWithInfy and InfyTQ premier hiring. Rigorous dynamic programming, greedy scheduling, strings, and arrays.',
    popularRoles: [
      { role: 'Specialist Programmer (Power Programmer)', level: 'Top Tier Campus' },
      { role: 'Digital Specialist Engineer', level: 'Tier 2 Campus' },
    ],
    interviewTips: [
      'Power Programmer rounds feature LeetCode Medium/Hard DP and greedy problems.',
    ],
    importantTopics: [
      { topic: 'Dynamic Programming', count: 44, percentage: 90 },
      { topic: 'Greedy & Interval Scheduling', count: 36, percentage: 80 },
      { topic: 'Arrays & Strings', count: 30, percentage: 70 },
    ],
  },
  {
    id: 'Accenture',
    name: 'Accenture',
    category: 'Services',
    industry: 'Consulting & Technology Services',
    headquarters: 'Dublin, Ireland / India Global Centers',
    website: 'https://accenture.com/careers',
    questionCount: 68,
    highPriorityCount: 18,
    reportedCount: 15,
    topicsCoveredCount: 14,
    roles: ['Advanced ASE', 'Associate Software Engineer', 'Full Stack Developer'],
    experienceLevels: ['0–2 Years'],
    roleCount: 3,
    description: 'Accenture Advanced Tech Assessment: Bitwise operations, arrays, strings, and coding aptitude.',
    popularRoles: [
      { role: 'Advanced Associate Software Engineer', level: 'Campus High Tier' },
      { role: 'Associate Software Engineer', level: 'Campus Standard' },
    ],
    interviewTips: ['Bitwise tricks and array transformations are tested in online rounds.'],
    importantTopics: [
      { topic: 'Bit Manipulation', count: 34, percentage: 85 },
      { topic: 'Arrays & Strings', count: 28, percentage: 75 },
    ],
  },
  {
    id: 'Wipro',
    name: 'Wipro',
    category: 'Services',
    industry: 'IT Solutions & Business Services',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://careers.wipro.com',
    questionCount: 60,
    highPriorityCount: 16,
    reportedCount: 14,
    topicsCoveredCount: 13,
    roles: ['Turbo Developer', 'Elite Engineer', 'Project Engineer'],
    experienceLevels: ['0–2 Years'],
    roleCount: 3,
    description: 'Wipro Turbo assessment: Array searching, sorting, string deduplication, and recursion.',
    popularRoles: [
      { role: 'Turbo Developer', level: 'High CTC Campus' },
      { role: 'Elite National Talent', level: 'Campus Standard' },
    ],
    interviewTips: ['Focus on sorting, two pointers, and basic recursion.'],
    importantTopics: [
      { topic: 'Arrays & Sorting', count: 32, percentage: 82 },
      { topic: 'Strings', count: 26, percentage: 72 },
    ],
  },
  {
    id: 'Cognizant',
    name: 'Cognizant',
    category: 'Services',
    industry: 'Digital Services & Modernized IT',
    headquarters: 'Teaneck, New Jersey, USA / Chennai, India',
    website: 'https://careers.cognizant.com',
    questionCount: 58,
    highPriorityCount: 16,
    reportedCount: 13,
    topicsCoveredCount: 13,
    roles: ['GenC Next', 'GenC Elevate', 'GenC Programmer'],
    experienceLevels: ['0–2 Years'],
    roleCount: 3,
    description: 'GenC Next & Elevate coding challenges: Full stack DSA, hashing, and database query optimization.',
    popularRoles: [
      { role: 'GenC Next (Top Tier)', level: 'Campus Advanced' },
      { role: 'GenC Elevate', level: 'Campus Standard' },
    ],
    interviewTips: ['Hash maps and two pointers form the majority of coding questions.'],
    importantTopics: [
      { topic: 'Hashing & Deduplication', count: 30, percentage: 80 },
      { topic: 'Arrays', count: 24, percentage: 70 },
    ],
  },
  {
    id: 'Capgemini',
    name: 'Capgemini',
    category: 'Services',
    industry: 'IT Consulting, Engineering & Cloud',
    headquarters: 'Paris, France / Global Centers',
    website: 'https://www.capgemini.com/careers',
    questionCount: 56,
    highPriorityCount: 15,
    reportedCount: 12,
    topicsCoveredCount: 12,
    roles: ['Senior Analyst', 'Analyst (Exceller)', 'Software Engineer'],
    experienceLevels: ['0–2 Years'],
    roleCount: 3,
    description: 'Exceller program: Modular problem solving, time complexity evaluation, and OOP concepts.',
    popularRoles: [{ role: 'Analyst (Exceller)', level: 'Campus' }],
    interviewTips: ['Array manipulation and clean function structures.'],
    importantTopics: [{ topic: 'Arrays & Math', count: 28, percentage: 80 }],
  },
  {
    id: 'Stripe',
    name: 'Stripe',
    category: 'Product',
    industry: 'Global Financial Infrastructure & Developer APIs',
    headquarters: 'San Francisco & Dublin',
    website: 'https://stripe.com/jobs',
    questionCount: 62,
    highPriorityCount: 22,
    reportedCount: 16,
    topicsCoveredCount: 15,
    roles: ['Software Engineer', 'Backend Infrastructure', 'New Grad'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 3,
    description: 'Developer-first financial infrastructure. Highly realistic coding rounds involving rate limiters, HTTP parser logic, idempotency, and transactional ledger algorithms.',
    popularRoles: [
      { role: 'Software Engineer', level: 'Entry / Mid' },
      { role: 'Backend Infrastructure Engineer', level: 'Senior' },
    ],
    interviewTips: [
      'Stripe coding rounds simulate real IDE engineering with tests and documentation.',
      'Rate-limiting sliding windows and idempotency maps are paramount.',
    ],
    importantTopics: [
      { topic: 'Sliding Window & Rate Limiting', count: 36, percentage: 92 },
      { topic: 'OOP Design & Idempotency', count: 30, percentage: 84 },
      { topic: 'Hashing & Queues', count: 26, percentage: 72 },
    ],
  },
  {
    id: 'CRED',
    name: 'CRED',
    category: 'Startups',
    industry: 'Fintech & Rewards Ecosystem',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://cred.club/careers',
    questionCount: 46,
    highPriorityCount: 16,
    reportedCount: 12,
    topicsCoveredCount: 12,
    roles: ['Backend Engineer', 'Frontend Engineer', 'Full Stack Developer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'High scalability event architectures, cashback simulation graphs, and fintech security pipelines.',
    popularRoles: [{ role: 'Backend Engineer', level: 'Mid / Senior' }],
    interviewTips: ['Event-driven architecture and cache consistency.'],
    importantTopics: [{ topic: 'Design & Caching', count: 26, percentage: 85 }],
  },
  {
    id: 'Groww',
    name: 'Groww',
    category: 'Startups',
    industry: 'Investing & Wealth Management Tech',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://groww.in/careers',
    questionCount: 44,
    highPriorityCount: 14,
    reportedCount: 11,
    topicsCoveredCount: 12,
    roles: ['SDE-1', 'SDE-2'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Stock market ticker stream processing, live chart intervals, and trade matching heaps.',
    popularRoles: [{ role: 'SDE-1', level: 'Entry' }],
    interviewTips: ['Interval merging and fast heap trade matching.'],
    importantTopics: [{ topic: 'Intervals & Heaps', count: 24, percentage: 82 }],
  },
  {
    id: 'Zoho',
    name: 'Zoho',
    category: 'India',
    industry: 'Cloud SaaS & Enterprise Applications',
    headquarters: 'Chennai, Tamil Nadu, India',
    website: 'https://www.zoho.com/careers',
    questionCount: 64,
    highPriorityCount: 20,
    reportedCount: 16,
    topicsCoveredCount: 14,
    roles: ['Software Developer', 'Member Technical Staff', 'Project Trainee'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Rigorous C/Java fundamental rounds. Candidates are required to implement custom data structures from scratch without standard library helpers.',
    popularRoles: [
      { role: 'Software Developer', level: 'Campus / Entry' },
      { role: 'Member Technical Staff', level: 'Mid' },
    ],
    interviewTips: [
      'Do not rely on standard library built-ins (implement custom sorting, custom string splitting).',
      'String pattern matching and matrix printing without extra space.',
    ],
    importantTopics: [
      { topic: 'Custom Data Structures', count: 36, percentage: 90 },
      { topic: 'Strings & Matrix', count: 30, percentage: 80 },
    ],
  },
  {
    id: 'PhonePe',
    name: 'PhonePe',
    category: 'India',
    industry: 'UPI Payments & Financial Technology',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://phonepe.com/careers',
    questionCount: 52,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'SDE-2', 'Lead Engineer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'UPI transaction state machines, distributed locking, and zero-downtime ledger caches.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry / Mid' }],
    interviewTips: ['State machine design and distributed concurrency.'],
    importantTopics: [{ topic: 'OOP Design & Caching', count: 28, percentage: 84 }],
  },
  {
    id: 'Meesho',
    name: 'Meesho',
    category: 'Startups',
    industry: 'Social E-commerce & Reselling Network',
    headquarters: 'Bengaluru, Karnataka, India',
    website: 'https://www.meesho.io/careers',
    questionCount: 42,
    highPriorityCount: 14,
    reportedCount: 11,
    topicsCoveredCount: 12,
    roles: ['SDE-1', 'SDE-2'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Catalog feeds ranking, collaborative filtering vectors, and supply chain routing.',
    popularRoles: [{ role: 'SDE-1', level: 'Entry' }],
    interviewTips: ['Sliding window and greedy optimization.'],
    importantTopics: [{ topic: 'Sliding Window', count: 22, percentage: 78 }],
  },
  {
    id: 'IBM',
    name: 'IBM',
    category: 'Other',
    industry: 'Hybrid Cloud & Enterprise Systems',
    headquarters: 'Armonk, New York, USA',
    website: 'https://ibm.com/careers',
    questionCount: 66,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['Software Developer', 'Cloud Engineer', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Cloud infrastructure algorithms, hybrid container orchestration, and distributed queues.',
    popularRoles: [{ role: 'Software Developer', level: 'Entry / Campus' }],
    interviewTips: ['Focus on clean OOP design and tree structures.'],
    importantTopics: [{ topic: 'Trees & OOP', count: 32, percentage: 80 }],
  },
  {
    id: 'Cisco',
    name: 'Cisco',
    category: 'Other',
    industry: 'Networking Hardware & Cybersecurity',
    headquarters: 'San Jose, California, USA',
    website: 'https://jobs.cisco.com',
    questionCount: 62,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['Software Engineer', 'Network Software Engineer', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Packet routing graph algorithms, bit manipulation, subnet trees, and socket pipelines.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry / Campus' }],
    interviewTips: ['Bitwise operations, IP subnet masking, and shortest path graph algorithms.'],
    importantTopics: [
      { topic: 'Bit Manipulation', count: 34, percentage: 88 },
      { topic: 'Graphs & Routing', count: 28, percentage: 76 },
    ],
  },
  {
    id: 'Intel',
    name: 'Intel',
    category: 'Other',
    industry: 'Semiconductor Design & Microprocessors',
    headquarters: 'Santa Clara, California, USA',
    website: 'https://jobs.intel.com',
    questionCount: 54,
    highPriorityCount: 16,
    reportedCount: 12,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'Firmware Engineer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Compiler optimization, bitwise logic, memory caching, and instruction pipelines.',
    popularRoles: [{ role: 'Firmware & Software Engineer', level: 'Entry' }],
    interviewTips: ['Low-level C/C++ memory allocation and bitwise arithmetic.'],
    importantTopics: [{ topic: 'Bit Manipulation & Pointers', count: 32, percentage: 86 }],
  },
  {
    id: 'Qualcomm',
    name: 'Qualcomm',
    category: 'Other',
    industry: 'Wireless Telecommunications & Snapdragon SoCs',
    headquarters: 'San Diego, California, USA',
    website: 'https://qualcomm.wd5.myworkdayjobs.com/External',
    questionCount: 56,
    highPriorityCount: 16,
    reportedCount: 13,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'Embedded Engineer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'DSP signal processing, low latency buffer manipulation, and embedded C algorithms.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry' }],
    interviewTips: ['Circular buffers, bit shifting, and thread synchronization.'],
    importantTopics: [{ topic: 'Buffers & Bitwise', count: 30, percentage: 84 }],
  },
  {
    id: 'Samsung',
    name: 'Samsung',
    category: 'Other',
    industry: 'Consumer Electronics, Mobile & Memory Chips',
    headquarters: 'Suwon, South Korea / Bengaluru & Noida, India',
    website: 'https://www.samsung.com/in/aboutsamsung/careers',
    questionCount: 78,
    highPriorityCount: 24,
    reportedCount: 18,
    topicsCoveredCount: 15,
    roles: ['Software Engineer', 'Lead Developer', 'Intern'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 3,
    description: 'Samsung Advanced Coding Test: Hard BFS/DFS, 3D grid simulations, bitmask DP, and exhaustive backtracking.',
    popularRoles: [{ role: 'Software Engineer (R&D)', level: 'Campus / Entry' }],
    interviewTips: [
      'Samsung SW Competency Test gives 3 hours for 1 hard simulation/backtracking problem.',
      'Expect 3D grids, directional flood fill, and state compression with bitmasks.',
    ],
    importantTopics: [
      { topic: 'Simulation & Backtracking', count: 46, percentage: 94 },
      { topic: 'BFS/DFS Grid Traversals', count: 38, percentage: 86 },
      { topic: 'Bitmask DP', count: 30, percentage: 74 },
    ],
  },
  {
    id: 'PayPal',
    name: 'PayPal',
    category: 'Finance',
    industry: 'Digital Payments & Commerce Infrastructure',
    headquarters: 'San Jose, California, USA',
    website: 'https://careers.pypl.com',
    questionCount: 58,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 14,
    roles: ['Software Engineer 1', 'Software Engineer 2'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Fraud detection graphs, sliding window velocity checks, and idempotent payment queues.',
    popularRoles: [{ role: 'Software Engineer 1', level: 'Entry' }],
    interviewTips: ['Sliding window transaction checks and hash indexing.'],
    importantTopics: [{ topic: 'Sliding Window', count: 28, percentage: 80 }],
  },
  {
    id: 'Visa',
    name: 'Visa',
    category: 'Finance',
    industry: 'Global Payments & Transaction Switching Network',
    headquarters: 'Foster City, California, USA',
    website: 'https://visa.com/careers',
    questionCount: 54,
    highPriorityCount: 16,
    reportedCount: 12,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'Senior Systems Analyst'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Global settlement graph reconciliation, high availability, and low latency transaction verification.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry / Campus' }],
    interviewTips: ['Concurrency, relational integrity, and high throughput hashing.'],
    importantTopics: [{ topic: 'Hashing & Queues', count: 26, percentage: 80 }],
  },
  {
    id: 'Mastercard',
    name: 'Mastercard',
    category: 'Finance',
    industry: 'Global Payments, Security & Tokenization',
    headquarters: 'Purchase, New York, USA',
    website: 'https://mastercard.com/careers',
    questionCount: 52,
    highPriorityCount: 15,
    reportedCount: 12,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'Lead Engineer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Tokenization cryptographic hashing, distributed consensus, and routing protocols.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry' }],
    interviewTips: ['Cryptographic hash trees and distributed caches.'],
    importantTopics: [{ topic: 'Tries & Hashing', count: 24, percentage: 78 }],
  },
  {
    id: 'Databricks',
    name: 'Databricks',
    category: 'Product',
    industry: 'Lakehouse & Distributed AI Platform',
    headquarters: 'San Francisco, California, USA',
    website: 'https://databricks.com/careers',
    questionCount: 56,
    highPriorityCount: 20,
    reportedCount: 15,
    topicsCoveredCount: 14,
    roles: ['Software Engineer', 'Distributed Systems'],
    experienceLevels: ['0–2 Years', '2–5 Years', '5+ Years'],
    roleCount: 2,
    description: 'Query planner optimization, segment trees, sparse tables, and distributed shuffle.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry / Mid' }],
    interviewTips: ['Complex segment trees and distributed algorithms.'],
    importantTopics: [{ topic: 'Segment Trees & DP', count: 32, percentage: 88 }],
  },
  {
    id: 'Snowflake',
    name: 'Snowflake',
    category: 'Product',
    industry: 'Data Cloud & Vectorized Warehouse',
    headquarters: 'Bozeman, Montana, USA',
    website: 'https://careers.snowflake.com',
    questionCount: 52,
    highPriorityCount: 18,
    reportedCount: 14,
    topicsCoveredCount: 13,
    roles: ['Software Engineer', 'Cloud Database'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 2,
    description: 'Micro-partition indexing, vectorized execution, and multi-cluster warehouse architectures.',
    popularRoles: [{ role: 'Software Engineer', level: 'Entry' }],
    interviewTips: ['Column stores, B-Trees, and sorting algorithms.'],
    importantTopics: [{ topic: 'Indexing & Sorting', count: 28, percentage: 84 }],
  },
  {
    id: 'Deloitte',
    name: 'Deloitte',
    category: 'Services',
    industry: 'Audit, Consulting & Enterprise Tech',
    headquarters: 'London, UK / Hyderabad, India',
    website: 'https://jobs2.deloitte.com',
    questionCount: 64,
    highPriorityCount: 18,
    reportedCount: 15,
    topicsCoveredCount: 14,
    roles: ['Technology Analyst', 'Consultant', 'Senior Consultant'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Data analytics SQL, array processing, business logic mapping, and data aggregation.',
    popularRoles: [{ role: 'Technology Analyst', level: 'Campus' }],
    interviewTips: ['SQL joins, window functions, and array deduplication.'],
    importantTopics: [{ topic: 'SQL & Arrays', count: 32, percentage: 82 }],
  },
  {
    id: 'PwC',
    name: 'PwC',
    category: 'Services',
    industry: 'Professional Services & Digital Transformation',
    headquarters: 'London, UK / Global Centers',
    website: 'https://pwc.com/careers',
    questionCount: 56,
    highPriorityCount: 15,
    reportedCount: 12,
    topicsCoveredCount: 13,
    roles: ['Technology Associate', 'Senior Associate', 'Consultant'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'System transformation logic, risk analysis algorithms, and relational databases.',
    popularRoles: [{ role: 'Technology Associate', level: 'Campus' }],
    interviewTips: ['Relational databases, basic OOP, and array sorting.'],
    importantTopics: [{ topic: 'Databases & Arrays', count: 28, percentage: 78 }],
  },
  {
    id: 'KPMG',
    name: 'KPMG',
    category: 'Services',
    industry: 'Financial Advisory & Digital Assurance',
    headquarters: 'Amstelveen, Netherlands / Global Centers',
    website: 'https://kpmg.com/careers',
    questionCount: 52,
    highPriorityCount: 14,
    reportedCount: 11,
    topicsCoveredCount: 12,
    roles: ['Analyst', 'Consultant', 'Software Engineer'],
    experienceLevels: ['0–2 Years', '2–5 Years'],
    roleCount: 3,
    description: 'Digital audit automation, algorithmic data reconciliation, and security pipelines.',
    popularRoles: [{ role: 'Analyst', level: 'Campus' }],
    interviewTips: ['Array reconciliation and string parsing.'],
    importantTopics: [{ topic: 'Strings & Arrays', count: 26, percentage: 76 }],
  },
]

// ---------------------------------------------------------------------------
// WEB DISCOVERED INTERVIEW CANDIDATE REPORTS (Permitted Public Data)
// ---------------------------------------------------------------------------
export const WEB_DISCOVERED_REPORTS: WebDiscoveredReport[] = [
  {
    id: 'web-1',
    title: 'Longest Substring Without Repeating Characters',
    company: 'Amazon',
    role: 'SDE-1',
    topic: 'Sliding Window',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    reportedDate: 'August 2026',
    sourceName: 'Public Candidate Interview Log',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    confidence: 'High',
    summary: 'Candidate reported sliding window substring query during Amazon campus technical screening.',
    isPermittedSource: true,
  },
  {
    id: 'web-2',
    title: 'Sliding Window Maximum',
    company: 'Amazon',
    role: 'SDE-1',
    topic: 'Sliding Window',
    pattern: 'Monotonic Stack',
    difficulty: 'Hard',
    reportedDate: 'August 2026',
    sourceName: 'Candidate Interview Debrief',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    confidence: 'High',
    summary: 'Asked in Round 2 with requirement of strictly O(N) using double-ended queue.',
    isPermittedSource: true,
  },
  {
    id: 'web-3',
    title: 'Course Schedule (Cycle Detection in Directed Graph)',
    company: 'Google',
    role: 'Software Engineer',
    topic: 'Graphs',
    pattern: 'Topological Sort',
    difficulty: 'Medium',
    reportedDate: 'July 2026',
    sourceName: 'Google Tech Round Review',
    sourceUrl: 'https://github.com/jwasham/coding-interview-university',
    confidence: 'High',
    summary: 'Prerequisite graph dependency resolution using Kahn algorithm.',
    isPermittedSource: true,
  },
  {
    id: 'web-4',
    title: 'LRU Cache Design & Synchronization',
    company: 'Microsoft',
    role: 'SDE-2',
    topic: 'Design',
    pattern: 'HashMap',
    difficulty: 'Hard',
    reportedDate: 'August 2026',
    sourceName: 'Public Virtual Onsite Log',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    confidence: 'High',
    summary: 'Asked with concurrency and thread-safe lock discussions.',
    isPermittedSource: true,
  },
  {
    id: 'web-5',
    title: 'Number of Islands (Matrix Flood Fill)',
    company: 'Meta',
    role: 'Software Engineer',
    topic: 'Graphs',
    pattern: 'DFS',
    difficulty: 'Medium',
    reportedDate: 'August 2026',
    sourceName: 'Meta Speed Assessment Archive',
    sourceUrl: 'https://leetcode.com/discuss/interview-experience',
    confidence: 'High',
    summary: 'Required clean recursion without auxiliary visited matrix (in-place modification).',
    isPermittedSource: true,
  },
]

// ---------------------------------------------------------------------------
// CANONICAL PATTERNS & LISTS
// ---------------------------------------------------------------------------
export const PATTERN_LIST: Pattern[] = [
  'Two Pointers',
  'Sliding Window',
  'Fast & Slow Pointers',
  'Binary Search',
  'Backtracking',
  'DFS',
  'BFS',
  'HashMap',
  'Heap',
  'Monotonic Stack',
  'Prefix Sum',
  'Union Find',
  'Dynamic Programming',
  'Topological Sort',
  'Trie',
  'Kadane Algorithm',
  'Greedy',
  'Bitwise',
  'Divide & Conquer',
]

export const CURATED_LISTS: { id: ListName; description: string; badge?: string }[] = [
  { id: 'Top Interview Questions', description: 'Most frequently asked coding interview questions globally', badge: 'Popular' },
  { id: 'Blind 75', description: 'Curated 75 essential LeetCode problems for high-yield prep', badge: 'Must Do' },
  { id: 'NeetCode 150', description: 'Comprehensive roadmap covering every major algorithmic pattern', badge: 'Comprehensive' },
  { id: 'Top 100 DSA', description: 'Complete 100 benchmark problem set covering all data structures', badge: '100 DSA' },
  { id: 'Amazon Preparation', description: 'Reported in Amazon OA, Technical and Bar Raiser rounds', badge: 'Amazon' },
  { id: 'Microsoft Preparation', description: 'Top questions asked in Microsoft college campus and off-campus drives', badge: 'Microsoft' },
  { id: 'Google Preparation', description: 'Top questions asked in Google SWE university & off-campus tests', badge: 'Google' },
  { id: 'FAANG Preparation', description: 'Top tier tech company interview standard problems', badge: 'FAANG' },
  { id: 'Beginner DSA', description: 'Foundational problems to build intuition and confidence', badge: 'Start Here' },
  { id: 'SDE-1 Preparation', description: 'Targeted roadmap for 0-2 YOE Software Engineer positions', badge: 'SDE-1' },
  { id: 'SDE-2 Preparation', description: 'Targeted roadmap for 2-4 YOE mid-level positions', badge: 'SDE-2' },
  { id: 'Intern Preparation', description: 'Summer & 6-month internship assessment questions', badge: 'Intern' },
  { id: 'Frequently Reported', description: 'Questions reported with highest frequency in 2025-2026 drives', badge: '🔥 Hot' },
  { id: 'Recently Reported', description: 'Newly added problems from recent campus selection tests', badge: 'New' },
  { id: 'My Bookmarks', description: 'Your saved and starred questions for quick revision' },
  { id: 'My Weak Topics', description: 'Questions you have attempted but not yet fully solved' },
]

// Difficulty colors
export const difficultyColors: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
  Medium: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
  Hard: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
}

// Language configuration
export const languageConfig: Record<Language, { label: string; monacoId: string }> = {
  python: { label: 'Python 3', monacoId: 'python' },
  javascript: { label: 'JavaScript', monacoId: 'javascript' },
  typescript: { label: 'TypeScript', monacoId: 'typescript' },
  java: { label: 'Java 21', monacoId: 'java' },
  cpp: { label: 'C++ 20', monacoId: 'cpp' },
  c: { label: 'C (GCC)', monacoId: 'c' },
  csharp: { label: 'C#', monacoId: 'csharp' },
  go: { label: 'Go', monacoId: 'go' },
  rust: { label: 'Rust', monacoId: 'rust' },
  kotlin: { label: 'Kotlin', monacoId: 'kotlin' },
  swift: { label: 'Swift', monacoId: 'swift' },
  ruby: { label: 'Ruby', monacoId: 'ruby' },
  php: { label: 'PHP', monacoId: 'php' },
  sql: { label: 'SQL', monacoId: 'sql' },
}

export const languageBoilerplate: Record<Language, string> = {
  python: '# Write your solution here\n\ndef solve():\n    pass\n\nsolve()\n',
  javascript: '// Write your solution here\n\nfunction solve() {\n}\n\nsolve();\n',
  typescript: '// Write your solution here\n\nfunction solve(): void {\n}\n\nsolve();\n',
  java: 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main(void) {\n    /* Write your solution here */\n    return 0;\n}\n',
  csharp: 'using System;\n\npublic class Solution {\n    public static void Main() {\n        // Write your solution here\n    }\n}\n',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    _ = fmt.Sprint\n}\n',
  rust: 'fn main() {\n    // Write your solution here\n}\n',
  kotlin: 'fun main() {\n    // Write your solution here\n}\n',
  swift: 'import Foundation\n\n// Write your solution here\n',
  ruby: '# Write your solution here\n\ndef solve\nend\n\nsolve\n',
  php: '<?php\n// Write your solution here\n\nfunction solve() {\n}\n\nsolve();\n',
  sql: '-- Write your SQL query here\n',
}

export function starterCodeFor(problem: Problem, lang: Language): string {
  return problem.starterCode[lang] ?? languageBoilerplate[lang]
}

// ---------------------------------------------------------------------------
// DYNAMIC JOB RELEVANCE & PRIORITY CALCULATION ENGINE
// ---------------------------------------------------------------------------
export function calculateJobRelevance(
  problem: Problem,
  target: TargetProfile,
  solvedSet: Set<string>,
  attemptedSet: Set<string>
): ScoredProblem {
  let score = 0
  const reasons: string[] = []

  const isCompanyMatch = problem.companies.includes(target.company)
  const isRoleMatch = isCompanyMatch && (problem.companyRoles?.[target.company]?.includes(target.role) ?? true)
  const isExperienceMatch = isCompanyMatch && (problem.companyExperience?.[target.company]?.includes(target.experience) ?? true)

  // 1. Company Relevance Component (up to 35 pts)
  if (isCompanyMatch) {
    score += 25
    reasons.push(`Reported at ${target.company}`)
    if (isRoleMatch) {
      score += 10
      reasons.push(`Targeted for ${target.role}`)
    }
  } else {
    score += 10
  }

  // 2. Interview Frequency Component (up to 25 pts)
  const freqScore = Math.min(25, Math.round((problem.askedCount / 50) * 25))
  score += freqScore
  if (problem.askedCount >= 30) {
    reasons.push(`Frequently reported (${problem.askedCount}x)`)
  }

  // 3. Company Priority Topic Alignment (up to 15 pts)
  const companyMeta = TOP_COMPANIES.find(c => c.id === target.company)
  const isCoreCompanyTopic = companyMeta?.commonTopics?.some(ct => problem.topics.includes(ct.topic))
  if (isCoreCompanyTopic) {
    score += 15
    reasons.push(`High focus topic at ${target.company}`)
  }

  // 4. Weak Topic Boost (up to 15 pts)
  const isWeakTopicBoost = target.weakTopics.some(wt => problem.topics.includes(wt)) && !solvedSet.has(problem.id)
  if (isWeakTopicBoost) {
    score += 15
    reasons.push(`Matches your weak topic (${problem.topics[0]})`)
  }

  // 5. Pattern Criticality (up to 10 pts)
  if (companyMeta?.commonPatterns?.some(cp => problem.patterns?.includes(cp as Pattern))) {
    score += 10
  }

  const finalScore = Math.min(99, Math.max(25, score))

  let priorityTier: PriorityTier = 'good-to-know'
  let priorityLabel = '📘 Good to Know'

  if (finalScore >= 80) {
    priorityTier = 'must-practice'
    priorityLabel = '🔥 Must Practice'
  } else if (finalScore >= 68) {
    priorityTier = 'high-priority'
    priorityLabel = '⭐ High Priority'
  } else if (finalScore >= 50) {
    priorityTier = 'recommended'
    priorityLabel = '⚡ Recommended'
  }

  const reportsCount = problem.reports?.reduce((sum, r) => sum + r.reportsCount, 0) || problem.askedCount
  const confidenceLevel = problem.confidence || (reportsCount >= 20 ? 'Very High' : reportsCount >= 10 ? 'High' : 'Medium')

  return {
    problem,
    jobRelevanceScore: finalScore,
    priorityTier,
    priorityLabel,
    priorityReason: reasons.slice(0, 2).join(' · ') || 'Essential algorithmic technique',
    isCompanyMatch,
    isRoleMatch,
    isWeakTopicBoost,
    interviewReportsCount: reportsCount,
    confidenceLevel,
    lastReported: problem.lastReportedDate || 'Recently reported in 2026',
  }
}

// ---------------------------------------------------------------------------
// PROBLEM BANK WITH VERIFIED INTERVIEW REPORTS & VARIANTS
// ---------------------------------------------------------------------------
export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'HighRadius', 'Apple', 'Flipkart', 'Walmart', 'Goldman Sachs'],
    companyRoles: {
      Amazon: ['SDE-1', 'Intern'],
      Microsoft: ['SDE-1', 'Intern'],
      Google: ['Software Engineer', 'Intern'],
      Meta: ['Software Engineer'],
      HighRadius: ['SDE-1', 'Intern'],
      Apple: ['Software Engineer'],
      Flipkart: ['SDE-1'],
      Walmart: ['SDE-1'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', 'Intern / Fresher'],
      Microsoft: ['0-2 Years'],
      Google: ['0-2 Years'],
      HighRadius: ['0-2 Years', 'Intern / Fresher'],
    },
    topics: ['Arrays', 'Hashing'],
    subtopic: 'arrays-basic',
    patterns: ['HashMap', 'Two Pointers'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'Beginner DSA', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported · Asked 48x',
    confidence: 'Very High',
    askedCount: 48,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Online Assessment',
        confidence: 'Very High',
        reportsCount: 28,
        signalNotes: 'Appears as Section 1 warm-up in Amazon OA for university graduate hires.',
      },
      {
        company: 'HighRadius',
        role: 'SDE-1',
        experience: 'Intern / Fresher',
        reportedDate: 'July 2026',
        stage: 'Technical Round 1',
        confidence: 'High',
        reportsCount: 14,
        signalNotes: 'Asked in KIIT on-campus drive technical coding screening.',
      },
    ],
    variants: [
      { id: 'two-sum-ii', title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', relationship: 'Two Pointers Variant' },
      { id: 'three-sum', title: '3Sum', difficulty: 'Medium', relationship: '3 Elements Extension' },
      { id: 'four-sum', title: '4Sum', difficulty: 'Medium', relationship: 'Generalized K-Sum' },
    ],
    description: 'Given an array of integers `nums` and an integer `target`, return *indices of the two numbers* such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', output: '[0, 1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    testCases: [
      { id: 1, input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]' },
      { id: 2, input: '[3,2,4]\n6', expectedOutput: '[1, 2]' },
      { id: 3, input: '[3,3]\n6', expectedOutput: '[0, 1]' },
      { id: 4, input: '[1,5,8,3,9,2]\n11', expectedOutput: '[1,4]', isHidden: true },
    ],
    starterCode: {
      python: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass\n\nnums = list(map(int, input().strip("[] ").split(",")))\ntarget = int(input())\nprint(two_sum(nums, target))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n}\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    auto res = twoSum(nums, target);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n    return 0;\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
      javascript: 'function twoSum(nums, target) {\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));',
    },
    interviewSignal: ['Asked in Amazon OA frequently for SDE-1 roles', 'HighRadius uses this as a warm-up in tech rounds', 'Microsoft uses variants with sorted arrays'],
    similarProblems: ['Three Sum', 'Two Sum II - Sorted Array', 'Four Sum'],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Adobe', 'Salesforce', 'Goldman Sachs'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-1', 'Intern'],
      Google: ['Software Engineer'],
      Meta: ['Software Engineer', 'Intern'],
      Adobe: ['Software Engineer'],
      Salesforce: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Microsoft: ['0-2 Years'],
      Google: ['0-2 Years'],
    },
    topics: ['Strings', 'Sliding Window', 'Hashing'],
    subtopic: 'sw-variable',
    patterns: ['Sliding Window', 'HashMap'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'FAANG Preparation', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported in Amazon SDE-1 · Asked 34x',
    confidence: 'Very High',
    askedCount: 34,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 1',
        confidence: 'Very High',
        reportsCount: 22,
        signalNotes: 'Core assessment question for variable-size sliding window pattern.',
      },
    ],
    variants: [
      { id: 'min-window-substring', title: 'Minimum Window Substring', difficulty: 'Hard', relationship: 'Harder Constraint Variant' },
      { id: 'longest-repeating-replacement', title: 'Longest Repeating Character Replacement', difficulty: 'Medium', relationship: 'K-Replacements Extension' },
    ],
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    testCases: [
      { id: 1, input: 'abcabcbb', expectedOutput: '3' },
      { id: 2, input: 'bbbbb', expectedOutput: '1' },
      { id: 3, input: 'pwwkew', expectedOutput: '3' },
      { id: 4, input: 'dvdf', expectedOutput: '3', isHidden: true },
    ],
    starterCode: {
      python: 'def length_of_longest_substring(s: str) -> int:\n    pass\n\ns = input()\nprint(length_of_longest_substring(s))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    return 0;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    cout << lengthOfLongestSubstring(s) << endl;\n    return 0;\n}',
      java: 'public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}',
      javascript: 'function lengthOfLongestSubstring(s) {\n    return 0;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb"));',
    },
    interviewSignal: ['Asked by Amazon frequently for SDE-1 roles', 'Recently reported in Microsoft virtual rounds'],
    similarProblems: ['Minimum Window Substring', 'Longest Repeating Character Replacement'],
  },
  {
    id: 'sliding-window-max',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta', 'Flipkart'],
    companyRoles: {
      Amazon: ['SDE-2', 'SDE-1'],
      Google: ['Software Engineer'],
      Microsoft: ['SDE-2'],
      Meta: ['Software Engineer'],
      Flipkart: ['SDE-1'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Google: ['0-2 Years'],
      Flipkart: ['0-2 Years'],
    },
    topics: ['Sliding Window', 'Monotonic Stack', 'Heap / Priority Queue'],
    subtopic: 'sw-deque',
    patterns: ['Sliding Window', 'Monotonic Stack', 'Heap'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'FAANG Preparation'],
    signal: 'priority',
    signalText: '⭐ Hard Monotonic Deque Benchmark · Asked 22x',
    confidence: 'Very High',
    askedCount: 22,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 2',
        confidence: 'Very High',
        reportsCount: 14,
        signalNotes: 'Crucial assessment of monotonic deque for O(N) time vs O(N log K) max-heap.',
      },
    ],
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn *the max sliding window*.',
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window [1,3,-1] -> max 3, [3,-1,-3] -> max 3, [-1,-3,5] -> max 5, etc.' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    testCases: [
      { id: 1, input: '[1,3,-1,-3,5,3,6,7]\n3', expectedOutput: '[3,3,5,5,6,7]' },
      { id: 2, input: '[1]\n1', expectedOutput: '[1]' },
      { id: 3, input: '[1,-1]\n1', expectedOutput: '[1,-1]', isHidden: true },
    ],
    starterCode: {
      python: 'from collections import deque\n\ndef max_sliding_window(nums: list[int], k: int) -> list[int]:\n    pass',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    return {};\n}',
      java: 'public class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[]{};\n    }\n}',
      javascript: 'function maxSlidingWindow(nums, k) {\n    return [];\n}',
    },
    interviewSignal: ['Amazon onsite Round 2 - deque/monotonic stack', 'Google phone screen - O(n) required'],
    similarProblems: ['Min Stack', 'Longest Subarray With Maximum OR'],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Netflix', 'Uber', 'Walmart'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-1'],
      Google: ['Software Engineer'],
      Meta: ['Software Engineer'],
      Netflix: ['Software Engineer'],
      Uber: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Microsoft: ['0-2 Years'],
      Netflix: ['2-4 Years'],
    },
    topics: ['Intervals', 'Arrays', 'Two Pointers', 'Greedy'],
    subtopic: 'arrays-intervals',
    patterns: ['Two Pointers', 'Greedy'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'FAANG Preparation', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported in Amazon & Meta OA',
    confidence: 'Very High',
    askedCount: 37,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Online Assessment',
        confidence: 'Very High',
        reportsCount: 24,
        signalNotes: 'Reported in Amazon OA Round 1 (sorting + interval overlap).',
      },
    ],
    variants: [
      { id: 'insert-interval', title: 'Insert Interval', difficulty: 'Medium', relationship: 'Single Insert Variant' },
      { id: 'meeting-rooms-ii', title: 'Meeting Rooms II', difficulty: 'Medium', relationship: 'Concurrency Scheduling' },
    ],
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals* that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    testCases: [
      { id: 1, input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { id: 2, input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { id: 3, input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]', isHidden: true },
    ],
    starterCode: {
      python: 'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    pass\n\nimport json\nintervals = json.loads(input())\nprint(json.dumps(merge(intervals)))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    return {};\n}',
      java: 'public class Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[][]{};\n    }\n}',
      javascript: 'function merge(intervals) {\n    return [];\n}',
    },
    interviewSignal: ['Common in Amazon SDE-1 OA (sorting + greedy)', 'Microsoft asks variants with meeting rooms'],
    similarProblems: ['Insert Interval', 'Meeting Rooms II', 'Non-overlapping Intervals'],
  },
  {
    id: 'max-subarray',
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    companies: ['Amazon', 'HighRadius', 'Deloitte', 'Microsoft', 'Google', 'TCS', 'Walmart'],
    companyRoles: {
      Amazon: ['SDE-1', 'Intern'],
      HighRadius: ['SDE-1', 'Intern'],
      Deloitte: ['Analyst', 'SDE-1'],
      Microsoft: ['SDE-1'],
      Google: ['Software Engineer'],
    },
    companyExperience: {
      HighRadius: ['0-2 Years', 'Intern / Fresher'],
      Deloitte: ['0-2 Years', 'Intern / Fresher'],
      Amazon: ['0-2 Years'],
    },
    topics: ['Arrays', 'Dynamic Programming'],
    subtopic: 'arrays-kadane',
    patterns: ['Kadane Algorithm', 'Dynamic Programming'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'Beginner DSA', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported · Asked 32x',
    confidence: 'Very High',
    askedCount: 32,
    lastReportedDate: 'July 2026',
    reports: [
      {
        company: 'HighRadius',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'July 2026',
        stage: 'Technical Round 1',
        confidence: 'Very High',
        reportsCount: 18,
        signalNotes: 'Asked as core DSA question in campus test and 1st technical round.',
      },
    ],
    variants: [
      { id: 'max-product-subarray', title: 'Maximum Product Subarray', difficulty: 'Medium', relationship: 'Product Multiplicative Extension' },
    ],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { id: 1, input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { id: 2, input: '[1]', expectedOutput: '1' },
      { id: 3, input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
    starterCode: {
      python: 'def max_sub_array(nums: list[int]) -> int:\n    pass',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    return 0;\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}',
      java: 'public class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}',
      javascript: 'function maxSubArray(nums) {\n    return 0;\n}',
    },
    interviewSignal: ["HighRadius asks Kadane's in aptitude + tech combo", 'Amazon OA warm-up problem'],
    similarProblems: ['Maximum Product Subarray', 'Best Time to Buy and Sell Stock'],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'HighRadius', 'Google', 'Meta', 'Atlassian', 'Infosys'],
    companyRoles: {
      Amazon: ['SDE-1', 'Intern'],
      Microsoft: ['SDE-1', 'Intern'],
      HighRadius: ['SDE-1', 'Intern'],
      Google: ['Intern'],
      Atlassian: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', 'Intern / Fresher'],
      Microsoft: ['0-2 Years', 'Intern / Fresher'],
    },
    topics: ['Stacks & Queues', 'Strings'],
    subtopic: 'sq-parentheses',
    patterns: ['Monotonic Stack', 'HashMap'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'Beginner DSA', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported · Asked 36x',
    confidence: 'Very High',
    askedCount: 36,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Microsoft',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 1',
        confidence: 'High',
        reportsCount: 16,
        signalNotes: 'Standard stack warm-up problem testing edge cases with odd length strings.',
      },
    ],
    variants: [
      { id: 'generate-parentheses', title: 'Generate Parentheses', difficulty: 'Medium', relationship: 'Backtracking Variant' },
      { id: 'min-remove-valid-parentheses', title: 'Minimum Remove to Make Valid Parentheses', difficulty: 'Medium', relationship: 'String Cleanup Extension' },
    ],
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}' ."],
    testCases: [
      { id: 1, input: '()', expectedOutput: 'true' },
      { id: 2, input: '()[]{}', expectedOutput: 'true' },
      { id: 3, input: '(]', expectedOutput: 'false' },
      { id: 4, input: '([)]', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      python: 'def is_valid(s: str) -> bool:\n    pass\n\ns = input()\nprint(str(is_valid(s)).lower())',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool isValid(string s) {\n    return false;\n}\n\nint main() {\n    string s;\n    cin >> s;\n    cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}',
      java: 'public class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}',
      javascript: 'function isValid(s) {\n    return false;\n}',
    },
    interviewSignal: ['HighRadius tech round warm-up', 'Microsoft phone screen classic'],
    similarProblems: ['Generate Parentheses', 'Minimum Remove to Make Valid Parentheses'],
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Adobe', 'Salesforce', 'Morgan Stanley'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-1', 'SDE-2'],
      Google: ['Software Engineer'],
      Meta: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Microsoft: ['0-2 Years'],
    },
    topics: ['Trees', 'Graphs'],
    subtopic: 'trees-traversal',
    patterns: ['BFS'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'Microsoft Preparation'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported in Onsite Tech Rounds',
    confidence: 'Very High',
    askedCount: 28,
    lastReportedDate: 'July 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'July 2026',
        stage: 'Technical Round 2',
        confidence: 'Very High',
        reportsCount: 15,
        signalNotes: 'Queue-based BFS level-by-level tracking with null check verification.',
      },
    ],
    variants: [
      { id: 'zigzag-level-order', title: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', relationship: 'Alternating Direction Variant' },
      { id: 'right-side-view', title: 'Binary Tree Right Side View', difficulty: 'Medium', relationship: 'Level Rightmost Element' },
    ],
    description: "Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    testCases: [
      { id: 1, input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { id: 2, input: '[1]', expectedOutput: '[[1]]' },
      { id: 3, input: '[]', expectedOutput: '[]' },
    ],
    starterCode: {
      python: 'from collections import deque\nfrom typing import Optional\n\ndef level_order(root):\n    pass',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    return {};\n}',
      java: 'public class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}',
      javascript: 'function levelOrder(root) {\n    return [];\n}',
    },
    interviewSignal: ['Amazon asks BFS variants in onsite rounds', 'Microsoft bar-raiser round tree question'],
    similarProblems: ['Binary Tree Zigzag Level Order Traversal', 'Binary Tree Right Side View'],
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Apple', 'Netflix', 'Uber'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-1', 'SDE-2'],
      Google: ['Software Engineer'],
      Meta: ['Software Engineer'],
      Netflix: ['Software Engineer'],
      Uber: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Google: ['0-2 Years', '2-4 Years'],
      Meta: ['0-2 Years'],
    },
    topics: ['Graphs', 'Recursion & Backtracking'],
    subtopic: 'graphs-traversal',
    patterns: ['DFS', 'BFS', 'Union Find'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'FAANG Preparation', 'Frequently Reported'],
    signal: 'frequent',
    signalText: '🔥 #1 Most Reported Graph Question · Asked 52x',
    confidence: 'Very High',
    askedCount: 52,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 1',
        confidence: 'Very High',
        reportsCount: 30,
        signalNotes: 'Grid DFS traversal and in-place sink marking.',
      },
    ],
    variants: [
      { id: 'max-area-of-island', title: 'Max Area of Island', difficulty: 'Medium', relationship: 'Area Counting Extension' },
      { id: 'rotting-oranges', title: 'Rotting Oranges', difficulty: 'Medium', relationship: 'Multi-Source BFS Variant' },
    ],
    description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is "0" or "1".'],
    testCases: [
      { id: 1, input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { id: 2, input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
    ],
    starterCode: {
      python: 'def num_islands(grid: list[list[str]]) -> int:\n    pass',
      javascript: 'function numIslands(grid) { return 0; }',
      cpp: 'int numIslands(vector<vector<char>>& grid) { return 0; }',
      java: 'public int numIslands(char[][] grid) { return 0; }',
    },
    interviewSignal: ['Grid BFS/DFS flood fill algorithm', 'Amazon SDE-1 bar raiser favorite'],
    similarProblems: ['Max Area of Island', 'Surrounded Regions', 'Rotting Oranges'],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Hard',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Netflix', 'Apple', 'Atlassian', 'Morgan Stanley'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-2', 'SDE-1'],
      Google: ['Software Engineer'],
      Meta: ['Software Engineer'],
      Netflix: ['Software Engineer'],
      Apple: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Microsoft: ['0-2 Years', '2-4 Years'],
      Netflix: ['2-4 Years'],
    },
    topics: ['Design', 'Hashing', 'Linked Lists'],
    subtopic: 'design-lru',
    patterns: ['HashMap', 'Fast & Slow Pointers'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'Microsoft Preparation', 'FAANG Preparation'],
    signal: 'priority',
    signalText: '⭐ #1 Most Famous Object-Oriented Design Problem · Asked 46x',
    confidence: 'Very High',
    askedCount: 46,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 2',
        confidence: 'Very High',
        reportsCount: 26,
        signalNotes: 'Combines doubly linked list node removal and hash table lookup in O(1).',
      },
    ],
    variants: [
      { id: 'lfu-cache', title: 'LFU Cache', difficulty: 'Hard', relationship: 'Frequency Eviction Variant' },
    ],
    description: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with **positive** size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, **evict the least recently used key**.\n\nThe functions `get` and `put` must each run in **O(1)** average time complexity.',
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put.'],
    testCases: [
      { id: 1, input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', expectedOutput: '1\n-1\n-1\n3\n4' },
    ],
    starterCode: {
      python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass',
      cpp: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};',
      java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}',
      javascript: 'class LRUCache {\n    constructor(capacity) {}\n    get(key) { return -1; }\n    put(key, value) {}\n}',
    },
    interviewSignal: ['Doubly linked list + Hash map coordination for O(1) removal & insert', 'Amazon and Microsoft onsite standard question'],
    similarProblems: ['LFU Cache', 'Design In-Memory File System'],
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Adobe', 'Walmart', 'Morgan Stanley'],
    companyRoles: {
      Amazon: ['SDE-1', 'SDE-2'],
      Microsoft: ['SDE-1', 'SDE-2'],
      Google: ['Software Engineer'],
      Adobe: ['Software Engineer'],
    },
    companyExperience: {
      Amazon: ['0-2 Years', '2-4 Years'],
      Adobe: ['0-2 Years'],
    },
    topics: ['Dynamic Programming', 'Recursion & Backtracking'],
    subtopic: 'dp-knapsack',
    patterns: ['Dynamic Programming', 'BFS'],
    lists: ['Top Interview Questions', 'Blind 75', 'NeetCode 150', 'Top 100 DSA', 'Amazon Preparation', 'FAANG Preparation'],
    signal: 'frequent',
    signalText: '🔥 Frequently Reported Knapsack Variant · Asked 36x',
    confidence: 'Very High',
    askedCount: 36,
    lastReportedDate: 'August 2026',
    reports: [
      {
        company: 'Amazon',
        role: 'SDE-1',
        experience: '0-2 Years',
        reportedDate: 'August 2026',
        stage: 'Technical Round 1',
        confidence: 'Very High',
        reportsCount: 19,
        signalNotes: 'DP array state transitions with infinite supply unbounded knapsack formulation.',
      },
    ],
    variants: [
      { id: 'coin-change-ii', title: 'Coin Change II (Number of Ways)', difficulty: 'Medium', relationship: 'Combinations Counting Extension' },
    ],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    testCases: [
      { id: 1, input: '[1,2,5]\n11', expectedOutput: '3' },
      { id: 2, input: '[2]\n3', expectedOutput: '-1' },
      { id: 3, input: '[1]\n0', expectedOutput: '0' },
    ],
    starterCode: {
      python: 'def coin_change(coins: list[int], amount: int) -> int:\n    pass',
      javascript: 'function coinChange(coins, amount) { return -1; }',
      cpp: 'int coinChange(vector<int>& coins, int amount) { return -1; }',
      java: 'public int coinChange(int[] coins, int amount) { return -1; }',
    },
  },
]

// ---------------------------------------------------------------------------
// Practice Workflow State & Intelligence Engine
// ---------------------------------------------------------------------------

export interface PracticeQuestionResult {
  problemId: string
  problemTitle: string
  difficulty: Difficulty
  attempted: boolean
  solved: boolean
  failed: boolean
  timeSpentSeconds: number
  hintsUsed: boolean
  debugUsed: boolean
  aiReviewUsed: boolean
  userCode?: string
}

export interface PracticeSession {
  id: string
  companyId: string
  companyName: string
  role: string
  experience: string
  topic: string
  difficulty: 'All' | 'Easy' | 'Medium' | 'Hard'
  source: 'all' | 'curated' | 'discovery'
  mode: 'practice' | 'interview'
  questionIds: string[]
  currentIndex: number
  startedAt: number
  completedAt?: number
  isComplete: boolean
  timeLimitMinutes?: number
  results: Record<string, PracticeQuestionResult>
}

export interface PracticeSessionConfig {
  companyId: string
  companyName: string
  role?: string
  experience?: string
  topic?: string
  difficulty?: 'All' | 'Easy' | 'Medium' | 'Hard'
  source?: 'all' | 'curated' | 'discovery'
  questionCount?: number
  mode?: 'practice' | 'interview'
}

export function createPracticeSession(
  config: PracticeSessionConfig,
  solvedSet?: Set<string>,
  availableProblems: Problem[] = PROBLEMS
): PracticeSession {
  const {
    companyId,
    companyName,
    role = 'Lead Engineer',
    experience = '0–2 Years',
    topic = 'All Topics',
    difficulty = 'All',
    source = 'all',
    questionCount = 10,
    mode = 'practice',
  } = config

  // 1. Filter problems matching company and criteria
  let pool = availableProblems.filter(p => {
    const matchCompany =
      !p.companies ||
      p.companies.length === 0 ||
      p.companies.some(
        c =>
          c.toLowerCase() === companyId.toLowerCase() ||
          c.toLowerCase() === companyName.toLowerCase()
      )

    const matchTopic =
      !topic ||
      topic === 'All Topics' ||
      topic === 'All' ||
      p.topics.some(t => t.toLowerCase() === topic.toLowerCase())

    const matchDiff = !difficulty || difficulty === 'All' || p.difficulty === difficulty

    return matchCompany && matchTopic && matchDiff
  })

  // If strict company match yielded fewer questions than requested, supplement with relevant topic questions
  if (pool.length < questionCount) {
    const supplemental = availableProblems.filter(p => {
      const matchTopic =
        !topic ||
        topic === 'All Topics' ||
        topic === 'All' ||
        p.topics.some(t => t.toLowerCase() === topic.toLowerCase())
      const matchDiff = !difficulty || difficulty === 'All' || p.difficulty === difficulty
      return matchTopic && matchDiff && !pool.some(existing => existing.id === p.id)
    })
    pool = [...pool, ...supplemental]
  }

  // 2. Smart Prioritization:
  // Must Practice / High Priority > Frequently Reported > Unsolved > Remaining
  pool.sort((a, b) => {
    const aPriority =
      (a.signal === 'priority' ? 10 : 0) +
      (a.signal === 'frequent' ? 6 : 0) +
      (a.confidence === 'Very High' ? 4 : 0)
    const bPriority =
      (b.signal === 'priority' ? 10 : 0) +
      (b.signal === 'frequent' ? 6 : 0) +
      (b.confidence === 'Very High' ? 4 : 0)
    if (aPriority !== bPriority) return bPriority - aPriority

    const aFreq = a.askedCount || 0
    const bFreq = b.askedCount || 0
    if (aFreq !== bFreq) return bFreq - aFreq

    if (solvedSet) {
      const aSolved = solvedSet.has(a.id) ? 1 : 0
      const bSolved = solvedSet.has(b.id) ? 1 : 0
      if (aSolved !== bSolved) return aSolved - bSolved
    }

    return 0
  })

  const selectedProblems = pool.slice(0, Math.max(1, questionCount))
  const questionIds = selectedProblems.map(p => p.id)

  const initialResults: Record<string, PracticeQuestionResult> = {}
  selectedProblems.forEach(p => {
    initialResults[p.id] = {
      problemId: p.id,
      problemTitle: p.title,
      difficulty: p.difficulty,
      attempted: false,
      solved: false,
      failed: false,
      timeSpentSeconds: 0,
      hintsUsed: false,
      debugUsed: false,
      aiReviewUsed: false,
    }
  })

  return {
    id: `session-${companyId}-${Date.now()}`,
    companyId,
    companyName,
    role,
    experience,
    topic,
    difficulty,
    source,
    mode,
    questionIds,
    currentIndex: 0,
    startedAt: Date.now(),
    isComplete: false,
    timeLimitMinutes: mode === 'interview' ? 45 : undefined,
    results: initialResults,
  }
}

