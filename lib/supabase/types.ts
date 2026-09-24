// ---------------------------------------------------------------------------
// Hand-written to match supabase/schema.sql. Once the project is provisioned,
// replace this file with the real generated types:
//
//   npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts
//
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; avatar_url: string | null; is_admin: boolean; created_at: string }
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null; is_admin?: boolean }
        Update: { full_name?: string | null; avatar_url?: string | null }
        Relationships: []
      }
      boards: {
        Row: {
          id: string; user_id: string; prompt_id: string
          nodes: unknown; edges: unknown; notes: string; checked: string[]
          updated_at: string
        }
        Insert: {
          id?: string; user_id: string; prompt_id: string
          nodes?: unknown; edges?: unknown; notes?: string; checked?: string[]
        }
        Update: { nodes?: unknown; edges?: unknown; notes?: string; checked?: string[] }
        Relationships: []
      }
      bookmarks: {
        Row: { user_id: string; problem_id: string; created_at: string }
        Insert: { user_id: string; problem_id: string }
        Update: Record<string, never>
        Relationships: []
      }
      drill_progress: {
        Row: { user_id: string; track_slug: string; question_id: string; known: boolean; updated_at: string }
        Insert: { user_id: string; track_slug: string; question_id: string; known?: boolean }
        Update: { known?: boolean }
        Relationships: []
      }
      kv_store: {
        Row: { user_id: string; key: string; value: unknown; updated_at: string }
        Insert: { user_id: string; key: string; value: unknown }
        Update: { value?: unknown }
        Relationships: []
      }
      submissions: {
        Row: {
          id: string; user_id: string | null; problem_id: string | null
          language: string; source_code: string; stdin: string | null
          status: string; stdout: string | null; stderr: string | null
          time_ms: number | null; memory_kb: number | null; created_at: string
        }
        Insert: {
          id?: string; user_id?: string | null; problem_id?: string | null
          language: string; source_code: string; stdin?: string | null
          status: string; stdout?: string | null; stderr?: string | null
          time_ms?: number | null; memory_kb?: number | null
        }
        Update: Record<string, never>
        Relationships: []
      }
      tracks: {
        Row: {
          slug: string; title: string; short: string; icon: string; accent: string
          tagline: string; description: string; tags: string[]; practice_href: string | null
        }
        Insert: Partial<Database['public']['Tables']['tracks']['Row']> & { slug: string; title: string; short: string; icon: string; accent: string; tagline: string; description: string }
        Update: Partial<Database['public']['Tables']['tracks']['Row']>
        Relationships: []
      }
      topics: {
        Row: { id: string; track_slug: string; title: string; icon: string; tagline: string; definition: string; reading: unknown; sort_order: number }
        Insert: Partial<Database['public']['Tables']['topics']['Row']> & { id: string; track_slug: string; title: string; icon: string; tagline: string; definition: string }
        Update: Partial<Database['public']['Tables']['topics']['Row']>
        Relationships: []
      }
      questions: {
        Row: { id: string; topic_id: string; level: string; q: string; outline: string[]; follow_up: string | null; source: unknown }
        Insert: Partial<Database['public']['Tables']['questions']['Row']> & { id: string; topic_id: string; level: string; q: string }
        Update: Partial<Database['public']['Tables']['questions']['Row']>
        Relationships: []
      }
      problems: {
        Row: {
          id: string; title: string; difficulty: string; topics: string[]; patterns: string[]; companies: string[]
          description: string; examples: unknown; constraints: string[]; test_cases: unknown; starter_code: unknown
        }
        Insert: Partial<Database['public']['Tables']['problems']['Row']> & { id: string; title: string; difficulty: string; description: string }
        Update: Partial<Database['public']['Tables']['problems']['Row']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
