import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import {
  PROBLEMS,
  HIERARCHICAL_TOPICS,
  type Problem,
  type Topic,
  type Difficulty,
  type Language,
  type TestCase,
} from '@/lib/playground-data'
import type { Database } from '@/lib/supabase/types'

type DbQuestion = Database['public']['Tables']['questions']['Row']
type DbTopic = Database['public']['Tables']['topics']['Row']

export interface TopicItem {
  id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  order_index: number
}

/**
 * Converts a Supabase question row into the rich Problem interface
 * used throughout the UI.
 */
export function dbQuestionToProblem(q: DbQuestion): Problem {
  const starterCode = (typeof q.starter_code === 'object' && q.starter_code !== null)
    ? (q.starter_code as unknown as Partial<Record<Language, string>>)
    : {}

  const examples = Array.isArray(q.examples)
    ? (q.examples as unknown as { input: string; output: string; explanation?: string }[])
    : []

  const testCases = Array.isArray(q.test_cases)
    ? (q.test_cases as unknown as TestCase[])
    : []

  // Map topic_id to a valid Topic string
  let topicName: Topic = 'Arrays'
  if (q.topic_id) {
    const matched = HIERARCHICAL_TOPICS.find(
      (t) => t.key.toLowerCase() === q.topic_id?.toLowerCase() || t.id.toLowerCase() === q.topic_id?.toLowerCase(),
    )
    if (matched) topicName = matched.id
  }

  return {
    id: q.id,
    title: q.title,
    difficulty: q.difficulty as Difficulty,
    companies: q.company || [],
    topics: [topicName],
    description: q.description,
    examples,
    constraints: q.constraints || [],
    testCases,
    starterCode,
    askedCount: 1,
    patterns: q.tags as Problem['patterns'],
  }
}

/**
 * Fetches all DSA topics from Supabase, falling back to local topics.
 */
export async function fetchTopics(): Promise<TopicItem[]> {
  if (!isSupabaseConfigured) {
    return HIERARCHICAL_TOPICS.map((t, idx) => ({
      id: t.key,
      name: t.id,
      slug: t.key,
      description: null,
      category: 'DSA',
      order_index: idx + 1,
    }))
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('order_index', { ascending: true })

    if (error || !data || data.length === 0) {
      return HIERARCHICAL_TOPICS.map((t, idx) => ({
        id: t.key,
        name: t.id,
        slug: t.key,
        description: null,
        category: 'DSA',
        order_index: idx + 1,
      }))
    }

    return data
  } catch {
    return HIERARCHICAL_TOPICS.map((t, idx) => ({
      id: t.key,
      name: t.id,
      slug: t.key,
      description: null,
      category: 'DSA',
      order_index: idx + 1,
    }))
  }
}

/**
 * Fetches all questions from Supabase, merging with fallback local questions.
 */
export async function fetchAllQuestions(): Promise<Problem[]> {
  if (!isSupabaseConfigured) {
    return PROBLEMS
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('order_index', { ascending: true })

    if (error || !data || data.length === 0) {
      return PROBLEMS
    }

    const dbProblems = data.map(dbQuestionToProblem)
    // Merge DB problems with static PROBLEMS (avoiding duplicates by id)
    const dbIds = new Set(dbProblems.map((p) => p.id))
    const extraProblems = PROBLEMS.filter((p) => !dbIds.has(p.id))

    return [...dbProblems, ...extraProblems]
  } catch {
    return PROBLEMS
  }
}

/**
 * Fetches a single question by id or slug from Supabase.
 */
export async function fetchQuestionById(idOrSlug: string): Promise<Problem | null> {
  if (!isSupabaseConfigured) {
    return PROBLEMS.find((p) => p.id === idOrSlug) || null
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .single()

    if (error || !data) {
      return PROBLEMS.find((p) => p.id === idOrSlug) || null
    }

    return dbQuestionToProblem(data)
  } catch {
    return PROBLEMS.find((p) => p.id === idOrSlug) || null
  }
}
