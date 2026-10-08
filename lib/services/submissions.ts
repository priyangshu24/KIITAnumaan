import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import type { Database } from '@/lib/supabase/types'

type SubmissionRow = Database['public']['Tables']['submissions']['Row']

export interface NewSubmissionData {
  userId?: string | null
  questionId: string
  code: string
  language: string
  status: 'success' | 'error' | 'timeout'
  runtime?: number | null
  memory?: number | null
}

/**
 * Inserts a new submission record into Supabase.
 */
export async function createSubmission(data: NewSubmissionData): Promise<SubmissionRow | null> {
  if (!isSupabaseConfigured) return null

  try {
    const supabase = createClient()
    const { data: inserted, error } = await supabase
      .from('submissions')
      .insert({
        user_id: data.userId || null,
        question_id: data.questionId,
        code: data.code,
        language: data.language,
        status: data.status,
        runtime: data.runtime ?? null,
        memory: data.memory ?? null,
      })
      .select('*')
      .single()

    if (error) {
      // eslint-disable-next-line no-console
      console.error('[supabase] createSubmission error:', error.message)
      return null
    }

    return inserted
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[supabase] createSubmission exception:', err)
    return null
  }
}

/**
 * Fetches user submissions from Supabase.
 */
export async function fetchUserSubmissions(
  userId: string,
  questionId?: string,
): Promise<SubmissionRow[]> {
  if (!isSupabaseConfigured || !userId) return []

  try {
    const supabase = createClient()
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (questionId) {
      query = query.eq('question_id', questionId)
    }

    const { data, error } = await query
    if (error) return []
    return data || []
  } catch {
    return []
  }
}
