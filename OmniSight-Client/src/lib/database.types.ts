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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          avatar_url: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          avatar_url?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      dashboards: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          config: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          config?: Json
          created_at?: string
          updated_at?: string
        }
      }
      widgets: {
        Row: {
          id: string
          dashboard_id: string
          type: string
          title: string
          config: Json
          position: Json
          size: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dashboard_id: string
          type: string
          title: string
          config: Json
          position: Json
          size: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dashboard_id?: string
          type?: string
          title?: string
          config?: Json
          position?: Json
          size?: Json
          created_at?: string
          updated_at?: string
        }
      }
      kpis: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          value: number
          target: number | null
          unit: string
          trend: string
          change: number
          period: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          value: number
          target?: number | null
          unit: string
          trend?: string
          change?: number
          period?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          value?: number
          target?: number | null
          unit?: string
          trend?: string
          change?: number
          period?: string
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          actions: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          actions?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          actions?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      workflows: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          steps: Json
          status: string
          triggers: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          steps: Json
          status?: string
          triggers: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          steps?: Json
          status?: string
          triggers?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 