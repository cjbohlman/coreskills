export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
  challenges?: Challenge[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initial_code: string;
  solution_code: string;
  test_cases: TestCase[];
  path_id: string;
  order_index: number;
  created_at: string;
}

export interface TestCase {
  input: any;
  expected_output: any;
  description: string;
}

export interface UserProgress {
  user_id: string;
  challenge_id: string;
  status: 'attempted' | 'completed';
  attempts: number;
  last_submission: string;
  completed_at: string | null;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}