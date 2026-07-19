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
  ingredients: MealIngredient[]
  macros: PersonMacros
}

export interface MealWeek {
  week: number
  dailyTotals: PersonMacros
  meals: Meal[]
}

/** How a batch-cook component is handled: cooked ahead, kept fresh, or to taste. */
export type MealPrepPrep = "cook" | "fresh" | "toTaste"

/** One ingredient in a batch-cook session, with weekly totals + per-serving split. */
export interface MealPrepComponent {
  item: string
  prep: MealPrepPrep
  note?: string
  /** Raw amount to cook for the whole week (both people combined), grams. */
  rawTotalG: number | null
  /** Approx. cooked yield for the week (both people combined), grams. */
  cookedTotalG: number | null
  /** Raw + cooked amount per person, per single serving. */
  perServing: PersonPortions
}

/** A single batch-cook session (one dish, cooked once to cover the week). */
export interface MealPrepSession {
  slot: string
  name: string
  servedDays: string[]
  servings: number
  seasoningBlendRef?: string
  storageNote?: string
  components: MealPrepComponent[]
}

export interface MealPrepWeek {
  week: number
  coverage: string
  sessions: MealPrepSession[]
}

export interface SeasoningBlend {
  id: string
  name: string
  basis: string
  ingredients: string[]
}

export interface DietaryConstraints {
  noAddedSugar?: boolean
  maxSaturatedFatGramsPerDay?: number
  excludedFoods?: string[]
}

export interface DietaryProfile {
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

export interface GroceryList {
  id: string
  label: string
  coverage: string
  categories?: GroceryCategory[]
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
  seasoningBlends: SeasoningBlend[]
}

export interface MealPlan {
  mealPlan: MealPlanDetails
  mealPrep: MealPrepWeek[]
  groceryLists: GroceryList[]
}

