export interface Dish {
  id: string
  name: string
  url: string
  categories: string[]
  prepTime: number
  cookTime: number
}

export interface Ingredient {
  name: string
  amount: string
}

export interface Step {
  id: string
  order: number
  description: string
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
}
