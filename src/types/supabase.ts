export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
      }
      dish_categories: {
        Row: {
          category_id: string
          created_at: string | null
          dish_id: string
          id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          dish_id: string
          id?: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          dish_id?: string
          id?: string
        }
      }
      dish_ingredients: {
        Row: {
          amount: string
          created_at: string | null
          dish_id: string
          id: string
          ingredient_id: string
          unit: string
        }
        Insert: {
          amount: string
          created_at?: string | null
          dish_id: string
          id?: string
          ingredient_id: string
          unit: string
        }
        Update: {
          amount?: string
          created_at?: string | null
          dish_id?: string
          id?: string
          ingredient_id?: string
          unit?: string
        }
      }
      dishes: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          notes: string | null
          servings: number
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          notes?: string | null
          servings?: number
          url?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          notes?: string | null
          servings?: number
          url?: string
        }
      }
      ingredients: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
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
