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
  imageUrl?: string
}

export interface Wine {
  id: string
  name: string
  winery: string
  country: string
  grapes: string[]
  notes: string
  imageUrl?: string
}

