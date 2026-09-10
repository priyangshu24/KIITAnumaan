// ---------------------------------------------------------------------------
// Resolves the "practise this" destination for a topic-doc page.
//
//  • Tracks with a dedicated workspace (AI/ML, SQL, System Design) → that
//    workspace, carrying track / topic / question params for it to pick up.
//  • DSA → the FORCE editor, deep-linked (?problem=<id>) to the closest
//    coding problem for that subtopic, or a specific problem for a specific
//    interview question.
//  • Behavioural / HR / CS Fundamentals / Aptitude — no code to run — → the
//    generic Q&A Drill playground, scoped to the topic / question.
// ---------------------------------------------------------------------------

import type { InterviewTrack } from '@/lib/interview-tracks'

/** The playground a track's "Start practising" button opens (no topic scope). */
export function trackWorkspaceHref(track: InterviewTrack): string {
  if (track.practiceHref) return track.practiceHref
  if (track.slug === 'dsa') return '/workspace/playground/solve?mode=topics'
  return `/workspace/playground/drill/${track.slug}`
}

/** subtopic id → best-fit FORCE problem id */
const TOPIC_PROBLEM: Record<string, string> = {
  'dsa-arrays': 'longest-substring',
  'dsa-hashing': 'two-sum',
  'dsa-graphs': 'number-of-islands',
  'dsa-dp': 'coin-change',
  'dsa-sort': 'sliding-window-max',
  'dsa-greedy': 'merge-intervals',
}

/** individual interview-question id → a more specific FORCE problem id */
const QUESTION_PROBLEM: Record<string, string> = {
  'dsa-a1': 'two-sum', // two-pointer technique
  'dsa-a2': 'longest-substring', // sliding window
  'dsa-a3': 'longest-substring', // longest substring without repeating chars
  'dsa-a4': 'sliding-window-max', // trapping rain water (two-pointer scan)
  'dsa-h1': 'two-sum', // hash map complexity
  'dsa-h2': 'two-sum', // group anagrams (hash keying)
  'dsa-h3': 'lru-cache', // design an LRU cache
  'dsa-h4': 'max-subarray', // subarrays summing to k (prefix sums)
  'dsa-g1': 'number-of-islands', // BFS vs DFS
  'dsa-g2': 'binary-tree-level-order', // validate a BST
  'dsa-g3': 'number-of-islands', // cycle detection
  'dsa-g4': 'number-of-islands', // course schedule II (topo sort)
  'dsa-d1': 'coin-change', // what makes a DP problem
  'dsa-d2': 'coin-change', // 0/1 knapsack
  'dsa-d3': 'max-subarray', // LCS vs longest common substring
  'dsa-d4': 'coin-change', // edit distance
  'dsa-s1': 'sliding-window-max', // when to use a heap
  'dsa-s2': 'sliding-window-max', // kth largest element
  'dsa-s3': 'merge-intervals', // search in rotated sorted array
  'dsa-s4': 'merge-intervals', // merge k sorted lists
}

export function practiceLinkFor(track: InterviewTrack, topicId: string, questionId?: string): string {
  // Tracks that own a workspace get sent there with context params.
  if (track.practiceHref) {
    const sep = track.practiceHref.includes('?') ? '&' : '?'
    return `${track.practiceHref}${sep}track=${track.slug}&topic=${topicId}${questionId ? `&q=${questionId}` : ''}`
  }

  // DSA: jump straight into the closest coding problem.
  const problemId = (questionId && QUESTION_PROBLEM[questionId]) || TOPIC_PROBLEM[topicId]
  if (problemId) return `/workspace/playground/solve?problem=${problemId}`
  if (track.slug === 'dsa') return '/workspace/playground/solve?mode=topics'

  // Non-coding tracks (behavioural, HR, CS fundamentals, aptitude):
  // the Q&A Drill trainer, scoped to this topic / question.
  const qp = questionId ? `&q=${questionId}` : ''
  return `/workspace/playground/drill/${track.slug}?topic=${topicId}${qp}`
}
