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

/** A single person's portion of an ingredient (raw + cooked weight). */
export interface PersonPortion {
  rawWeightG: number | null
  cookedWeightG: number | null
}

/** Portions keyed by person id (e.g. "him", "her"). */
export type PersonPortions = Record<string, PersonPortion>

/** Macros keyed by person id (e.g. "him", "her"). */
export type PersonMacros = Record<string, Macros>

export interface MealIngredient {
  item: string
  note?: string
  portions: PersonPortions
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
  macros: PersonMacros
}

export interface MealWeek {
  week: number
  dailyTotals: PersonMacros
  meals: Meal[]
}

export interface WeekendDinnerOption {
  id: string
  type: string
  name: string
  vegetarian?: boolean
  servingsBasis: number
  ingredients: MealIngredient[]
  macros: PersonMacros
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
  carbs?: string
  excludedFoods?: string[]
  notableInclusions?: string[]
}

export interface DietaryProfile {
  targetCondition: string
  constraints: DietaryConstraints
}

/** One person the plan is portioned for (calorie/protein targets differ). */
export interface Person {
  id: string
  label: string
  caloriesPerDay: { min: number; max: number }
  proteinTargetGramsPerDay: number
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
  people: Person[]
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

