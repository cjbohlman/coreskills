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
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          initial_code: string
          solution_code: string
          test_cases: Json
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty: 'easy' | 'medium' | 'hard'
          initial_code: string
          solution_code: string
          test_cases: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          initial_code?: string
          solution_code?: string
          test_cases?: Json
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          user_id: string
          challenge_id: string
          status: 'attempted' | 'completed'
          attempts: number
          last_submission: string
          completed_at: string | null
        }
        Insert: {
          user_id: string
          challenge_id: string
          status: 'attempted' | 'completed'
          attempts: number
          last_submission: string
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          challenge_id?: string
          status?: 'attempted' | 'completed'
          attempts?: number
          last_submission?: string
          completed_at?: string | null
        }
      }
    }
  }
}