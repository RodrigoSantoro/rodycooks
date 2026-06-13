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

export interface MacroTarget {
  label: string
  symbol: string
  calories: string
  protein: string
  fat: string
  carbs: string
}

export interface DietIngredient {
  name: string
  rawMan: string
  rawWoman: string
  cookedMan: string
  cookedWoman: string
}

export interface DietMeal {
  title: string
  ingredients: DietIngredient[]
  macrosMan: string
  macrosWoman: string
}

export interface GlanceRow {
  day: string
  breakfast: string
  lunch: string
  dinner: string
}

export interface DietWeek {
  name: string
  legend: string
  ataGlance: GlanceRow[]
  meals: DietMeal[]
}

export interface GroceryItem {
  name: string
  amount: string
}

export interface GrocerySection {
  title: string
  note?: string
  items: GroceryItem[]
}

export interface DietPlan {
  month: string
  label: string
  title: string
  description: string
  targets: {
    note: string
    people: MacroTarget[]
  }
  weeks: DietWeek[]
  snacks: {
    note: string
    items: DietMeal[]
  }
  grocery: GrocerySection[]
}
