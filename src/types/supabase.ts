export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
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
                Relationships: []
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
                Relationships: [
                    {
                        foreignKeyName: 'dish_categories_category_id_fkey'
                        columns: ['category_id']
                        isOneToOne: false
                        referencedRelation: 'categories'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'dish_categories_dish_id_fkey'
                        columns: ['dish_id']
                        isOneToOne: false
                        referencedRelation: 'dishes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'dish_categories_dish_id_fkey'
                        columns: ['dish_id']
                        isOneToOne: false
                        referencedRelation: 'view_name'
                        referencedColumns: ['dish_id']
                    }
                ]
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
                    unit?: string
                }
                Update: {
                    amount?: string
                    created_at?: string | null
                    dish_id?: string
                    id?: string
                    ingredient_id?: string
                    unit?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'dish_ingredients_dish_id_fkey'
                        columns: ['dish_id']
                        isOneToOne: false
                        referencedRelation: 'dishes'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'dish_ingredients_dish_id_fkey'
                        columns: ['dish_id']
                        isOneToOne: false
                        referencedRelation: 'view_name'
                        referencedColumns: ['dish_id']
                    },
                    {
                        foreignKeyName: 'dish_ingredients_ingredient_id_fkey'
                        columns: ['ingredient_id']
                        isOneToOne: false
                        referencedRelation: 'ingredients'
                        referencedColumns: ['id']
                    }
                ]
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
                Relationships: []
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
                Relationships: []
            }
        }
        Views: {
            view_name: {
                Row: {
                    cat_name: string | null
                    dish_id: string | null
                    dish_name: string | null
                    url: string | null
                }
                Relationships: []
            }
        }
        Functions: {
            get_dish_ingredients_by_url: {
                Args: {
                    urlparam: string
                }
                Returns: {
                    dish_id: string
                    dish_name: string
                    amount: string
                    unit: string
                    ingredient_name: string
                    ingredient_id: string
                    servings: number
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (Database['public']['Tables'] & Database['public']['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
          Database['public']['Views'])
    ? (Database['public']['Tables'] &
          Database['public']['Views'])[PublicTableNameOrOptions] extends {
          Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
          Insert: infer I
      }
        ? I
        : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
          Update: infer U
      }
        ? U
        : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof Database['public']['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
