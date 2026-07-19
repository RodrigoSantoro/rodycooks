import { Macros } from "./custom"

/**
 * Types for the Weekly Menu Builder.
 *
 * The builder lets a household pick dishes into a 7-day grid (one dish per
 * active meal slot per day), sets per-person calorie/protein targets, and gets
 * back a portion-scaled weekly menu plus an aggregated grocery list.
 *
 * Everything here is storage-agnostic: the same shapes are produced by the
 * in-memory store today and could be served by an API/DB behind a login later.
 */

/** The five meal slots a day can contain, in display order. */
export const MEAL_SLOTS = [
  "breakfast",
  "lunch",
  "snack1",
  "dinner",
  "snack2",
] as const

export type MealSlot = (typeof MEAL_SLOTS)[number]

/** The seven days of the week, in display order. */
export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const

export type WeekDay = (typeof WEEK_DAYS)[number]

/**
 * A single ingredient line for one *base serving* of a dish. Numeric amounts
 * scale with a person's portion factor; a null amount means "to taste" or
 * negligible and is passed through unscaled.
 */
export interface CatalogIngredient {
  name: string
  note?: string
  /** Amount per one base serving. null = to taste / negligible. */
  amount: number | null
  /** Unit for `amount`, e.g. "g", "count", "slice", "tbsp". Empty = unitless. */
  unit: string
  /** Optional grocery-category override; otherwise inferred from the name. */
  category?: string
}

/**
 * A dish in the selectable catalog. Each dish is one JSON file under
 * `src/data/dishes` (following the recipe file pattern) and is collected into
 * `dishCatalog` in `src/data/data.ts`. Macros and ingredient amounts are given
 * for a single reference serving; the builder scales them per person to hit
 * each person's calorie target.
 */
export interface CatalogDish {
  id: string
  name: string
  /** URL slug for the dish detail page (unique). */
  url: string
  /** Slots this dish is appropriate for (a dish may fit several). */
  slots: MealSlot[]
  /** Recipe-style categories, e.g. ["Breakfast", "Vegetarian"]. */
  categories: string[]
  requiresCooking: boolean
  vegetarian?: boolean
  tags?: string[]
  /** Prep / cook time in minutes (recipe-style). */
  prepTime: number
  cookTime: number
  /**
   * How many servings the ingredient list yields. Macros are per serving; the
   * builder divides ingredient amounts by this to get one person's portion.
   */
  servings: number
  /** Macros for one serving. */
  baseMacros: Macros
  /**
   * Suitability for a high-cholesterol / LDL-lowering diet, per a dietitian +
   * cardiologist panel review. "green" = actively LDL-lowering or clearly
   * appropriate; "yellow" = acceptable/neutral but not actively lowering, or a
   * minor red flag (added sugar, processed meat, small sat-fat contributor).
   */
  cholesterolRating?: 'green' | 'yellow'
  /** Cooking instructions. */
  steps: string[]
  ingredients: CatalogIngredient[]
  /** Optional card/hero image. */
  imageUrl?: string
}

/** One eater in the household, with daily targets used to scale portions. */
export interface MenuPerson {
  id: string
  label: string
  calorieTarget: number
  proteinTarget: number
}

/** Household + which slots are in play for the week. */
export interface MenuConfig {
  people: MenuPerson[]
  activeSlots: MealSlot[]
}

/**
 * The user's picks: selection[day][slot] = dish id (or null/absent = empty).
 * Kept as a plain nested record so it serialises cleanly to storage/DB.
 */
export type MenuSelection = {
  [day in WeekDay]?: {
    [slot in MealSlot]?: string | null
  }
}

/** The full builder document that gets persisted (config + picks). */
export interface WeeklyMenuState {
  config: MenuConfig
  selection: MenuSelection
}

// --- Computed / derived shapes (produced by utils/menuBuilder) ---

/** A dish as it lands on one person's plate for one day, portion-scaled. */
export interface ScaledMeal {
  slot: MealSlot
  dish: CatalogDish
  /** Multiplier applied to the base serving for this person on this day. */
  scaleFactor: number
  macros: Macros
}

/** One person's fully-scaled day. */
export interface PersonDay {
  personId: string
  meals: ScaledMeal[]
  totals: Macros
  calorieTarget: number
  proteinTarget: number
}

/** A day of the plan across all people. */
export interface MenuDay {
  day: WeekDay
  /** Distinct dishes chosen for the day, in slot order. */
  dishesBySlot: Array<{ slot: MealSlot; dish: CatalogDish }>
  people: PersonDay[]
}

/** A single aggregated grocery line. */
export interface GroceryLine {
  item: string
  /** Total amount across the week and all people; null = to taste. */
  amount: number | null
  unit: string
  note?: string
}

/** Grocery lines grouped by category for display. */
export interface GroceryGroup {
  category: string
  items: GroceryLine[]
}

/** One raw ingredient line for a batch-cook, summed across the week + people. */
export interface MealPrepItem {
  name: string
  /** Total raw amount to cook for the whole batch; null = to taste. */
  amount: number | null
  unit: string
  note?: string
}

/**
 * A batch-cook session: one cook-requiring dish, with the total raw amounts to
 * cook once to cover every time it appears in the week (all people, all days).
 */
export interface MealPrepBatch {
  dishId: string
  name: string
  /** Recipe slug, for linking to the dish's steps. */
  url: string
  /** Meal slots this dish fills across the week, in slot order. */
  slots: MealSlot[]
  /** Days this dish is served, in week order. */
  days: WeekDay[]
  /** Number of person-day portions this batch covers. */
  servings: number
  ingredients: MealPrepItem[]
}
