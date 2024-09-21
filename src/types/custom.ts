export interface Ingredient {
  name: string
  amount: string
}

export interface Recipe {
  id: string
  name: string
  servings: number
  prepTime: number
  cookTime: number
  calories: number
  ingredients: Ingredient[]
  steps: string[]
  url: string
  categories: string[]
}
