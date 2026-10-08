// ---------------------------------------------------------------------------
// Supabase Database TypeScript definitions matching supabase/schema.sql
// ---------------------------------------------------------------------------

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string | null
          full_name: string | null
          username: string | null
          avatar_url: string | null
          college: string | null
          course: string | null
          year: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          college?: string | null
          course?: string | null
          year?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          college?: string | null
          course?: string | null
          year?: string | null
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          slug: string
          description?: string | null
          category?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string | null
          order_index?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          topic_id: string | null
          title: string
          slug: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          description: string
          examples: Json
          constraints: string[]
          starter_code: Json
          solution: string | null
          test_cases: Json
          company: string[]
          tags: string[]
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          topic_id?: string | null
          title: string
          slug: string
          difficulty: 'Easy' | 'Medium' | 'Hard'
          description: string
          examples?: Json
          constraints?: string[]
          starter_code?: Json
          solution?: string | null
          test_cases?: Json
          company?: string[]
          tags?: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string | null
          title?: string
          slug?: string
          difficulty?: 'Easy' | 'Medium' | 'Hard'
          description?: string
          examples?: Json
          constraints?: string[]
          starter_code?: Json
          solution?: string | null
          test_cases?: Json
          company?: string[]
          tags?: string[]
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          id: string
          user_id: string | null
          question_id: string | null
          code: string
          language: string
          status: string
          runtime: number | null
          memory: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          code: string
          language: string
          status: string
          runtime?: number | null
          memory?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          code?: string
          language?: string
          status?: string
          runtime?: number | null
          memory?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          question_id: string
          status: 'attempted' | 'solved'
          attempts: number
          best_runtime: number | null
          best_memory: number | null
          solved_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          status?: 'attempted' | 'solved'
          attempts?: number
          best_runtime?: number | null
          best_memory?: number | null
          solved_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          status?: 'attempted' | 'solved'
          attempts?: number
          best_runtime?: number | null
          best_memory?: number | null
          solved_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      activity: {
        Row: {
          id: string
          user_id: string
          activity_date: string
          problems_solved: number
          submissions_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_date?: string
          problems_solved?: number
          submissions_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_date?: string
          problems_solved?: number
          submissions_count?: number
        }
        Relationships: []
      }
      boards: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          nodes: Json
          edges: Json
          notes: string
          checked: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          nodes?: Json
          edges?: Json
          notes?: string
          checked?: string[]
        }
        Update: {
          nodes?: Json
          edges?: Json
          notes?: string
          checked?: string[]
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          user_id: string
          problem_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          problem_id: string
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      drill_progress: {
        Row: {
          user_id: string
          track_slug: string
          question_id: string
          known: boolean
          updated_at: string
        }
        Insert: {
          user_id: string
          track_slug: string
          question_id: string
          known?: boolean
        }
        Update: {
          known?: boolean
        }
        Relationships: []
      }
      kv_store: {
        Row: {
          user_id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          key: string
          value: Json
        }
        Update: {
          value?: Json
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
