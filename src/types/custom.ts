import { Database } from '@src/types/supabase'

export type Dish = Database['public']['Tables']['dishes']['Row']
export type Ingredients = Database['public']['Tables']['ingredients']['Row']
export type DishIngredients =
    Database['public']['Tables']['dish_ingredients']['Row']
export type Category = string
export type DishInfo = {
    id: string
    name: string
    url: string
    categories: string[]
}
export type Dishes = DishInfo[]
export type Recipe = Dish & {
    ingredients: (DishIngredients & {
        details: { name: string }
    })[]
}
