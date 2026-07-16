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

// --- Meal plans ---

export interface Macros {
  calories: number
  proteinG: number
  fatG: number
  saturatedFatG: number
  carbsG: number
}

export interface MealIngredient {
  item: string
  rawWeightG: number | null
  cookedWeightG: number | null
  note?: string
}

export interface Meal {
  slot: string
  name: string
  variant?: string
  servedDays: string[]
  requiresCooking: boolean
  seasoningBlendRef?: string
  swappableWith?: string
  ingredients: MealIngredient[]
  macros: Macros
}

export interface MealWeek {
  week: number
  dailyTotals: Macros
  meals: Meal[]
}

export interface WeekendDinnerOption {
  id: string
  type: string
  name: string
  vegetarian?: boolean
  servingsBasis: number
  ingredients: MealIngredient[]
  macros: Macros
}

export interface SeasoningBlend {
  id: string
  name: string
  basis: string
  ingredients: string[]
  containsAddedSugar: boolean
}

export interface DietaryConstraints {
  noAddedSugar?: boolean
  maxSaturatedFatGramsPerDay?: number
  maxTotalFatGramsPerDay?: number
  caloriesPerDay?: { min: number; max: number }
  proteinTargetGramsPerDay?: number
  carbs?: string
  excludedFoods?: string[]
  notableInclusions?: string[]
}

export interface DietaryProfile {
  targetCondition: string
  constraints: DietaryConstraints
}

export interface GroceryItem {
  name: string
  quantity?: number
  unit?: string
  note?: string
}

export interface GroceryCategory {
  category: string
  items: GroceryItem[]
}

export interface GroceryOptionList {
  optionId: string
  name: string
  items: GroceryItem[]
}

export interface GroceryList {
  id: string
  label: string
  coverage: string
  categories?: GroceryCategory[]
  optionLists?: GroceryOptionList[]
}

export interface MealPlanDetails {
  id: string
  name: string
  description: string
  dietaryProfile: DietaryProfile
  notes: string[]
  mealSlots: string[]
  weeks: MealWeek[]
  weekendDinnerOptions: WeekendDinnerOption[]
  seasoningBlends: SeasoningBlend[]
}

export interface MealPlan {
  generatedOn: string
  mealPlan: MealPlanDetails
  groceryLists: GroceryList[]
}

