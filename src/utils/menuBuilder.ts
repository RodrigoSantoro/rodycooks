import { Macros } from "@src/types/custom"
import {
  CatalogDish,
  GroceryGroup,
  GroceryLine,
  MealSlot,
  MenuConfig,
  MenuDay,
  MenuPerson,
  MenuSelection,
  MEAL_SLOTS,
  PersonDay,
  ScaledMeal,
  WeekDay,
  WEEK_DAYS,
} from "@src/types/menu"

export const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack1: "Snack 1",
  dinner: "Dinner",
  snack2: "Snack 2",
}

export const DAY_LABELS: Record<WeekDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
}

export const slotLabel = (slot: MealSlot): string => SLOT_LABELS[slot] ?? slot
export const dayLabel = (day: WeekDay): string => DAY_LABELS[day] ?? day

const EMPTY_MACROS: Macros = {
  calories: 0,
  proteinG: 0,
  fatG: 0,
  saturatedFatG: 0,
  carbsG: 0,
}

/** Rounds to one decimal place, avoiding "-0" and floating-point noise. */
const round1 = (n: number): number => Math.round(n * 10) / 10

/** Scales a base-serving macro block by a per-person factor. */
export const scaleMacros = (macros: Macros, factor: number): Macros => ({
  calories: Math.round(macros.calories * factor),
  proteinG: round1(macros.proteinG * factor),
  fatG: round1(macros.fatG * factor),
  saturatedFatG: round1(macros.saturatedFatG * factor),
  carbsG: round1(macros.carbsG * factor),
})

const addMacros = (a: Macros, b: Macros): Macros => ({
  calories: a.calories + b.calories,
  proteinG: round1(a.proteinG + b.proteinG),
  fatG: round1(a.fatG + b.fatG),
  saturatedFatG: round1(a.saturatedFatG + b.saturatedFatG),
  carbsG: round1(a.carbsG + b.carbsG),
})

/** Fast id → dish lookup for a catalog. */
export const indexCatalog = (
  catalog: CatalogDish[]
): Map<string, CatalogDish> => new Map(catalog.map((dish) => [dish.id, dish]))

/**
 * The dishes chosen for one day, in slot order, resolved against the catalog.
 * Slots that are inactive, empty, or reference an unknown dish are skipped.
 */
export const dishesForDay = (
  selection: MenuSelection,
  day: WeekDay,
  activeSlots: MealSlot[],
  catalogById: Map<string, CatalogDish>
): Array<{ slot: MealSlot; dish: CatalogDish }> => {
  const daySel = selection[day] ?? {}
  const result: Array<{ slot: MealSlot; dish: CatalogDish }> = []
  // Iterate MEAL_SLOTS (not activeSlots) to keep a stable display order.
  MEAL_SLOTS.forEach((slot) => {
    if (!activeSlots.includes(slot)) return
    const dishId = daySel[slot]
    if (!dishId) return
    const dish = catalogById.get(dishId)
    if (dish) result.push({ slot, dish })
  })
  return result
}

/**
 * Per-person portion factor for a day. The base servings for the day sum to a
 * calorie total; each person scales every dish by (their target ÷ that total)
 * so their day lands on their calorie budget. Protein then falls out
 * proportionally and is reported, not independently forced.
 *
 * Returns 1 when the day has no base calories (nothing to scale).
 */
export const dayScaleFactor = (
  dishes: Array<{ dish: CatalogDish }>,
  person: MenuPerson
): number => {
  const baseCalories = dishes.reduce(
    (sum, { dish }) => sum + dish.baseMacros.calories,
    0
  )
  if (baseCalories <= 0) return 1
  return person.calorieTarget / baseCalories
}

/** Builds one person's scaled day (per-meal macros + day totals). */
const buildPersonDay = (
  dishes: Array<{ slot: MealSlot; dish: CatalogDish }>,
  person: MenuPerson
): PersonDay => {
  const factor = dayScaleFactor(dishes, person)
  const meals: ScaledMeal[] = dishes.map(({ slot, dish }) => ({
    slot,
    dish,
    scaleFactor: factor,
    macros: scaleMacros(dish.baseMacros, factor),
  }))
  const totals = meals.reduce(
    (acc, meal) => addMacros(acc, meal.macros),
    { ...EMPTY_MACROS }
  )
  return {
    personId: person.id,
    meals,
    totals,
    calorieTarget: person.calorieTarget,
    proteinTarget: person.proteinTarget,
  }
}

/** Assembles the full week (per day, per person) from a selection + config. */
export const buildMenuDays = (
  selection: MenuSelection,
  config: MenuConfig,
  catalog: CatalogDish[]
): MenuDay[] => {
  const catalogById = indexCatalog(catalog)
  return WEEK_DAYS.map((day) => {
    const dishesBySlot = dishesForDay(
      selection,
      day,
      config.activeSlots,
      catalogById
    )
    return {
      day,
      dishesBySlot,
      people: config.people.map((person) =>
        buildPersonDay(dishesBySlot, person)
      ),
    }
  })
}

/** True when at least one slot on at least one day has a dish. */
export const menuHasSelections = (days: MenuDay[]): boolean =>
  days.some((day) => day.dishesBySlot.length > 0)

// --- Grocery aggregation ---

interface CategoryRule {
  category: string
  keywords: string[]
}

/**
 * Keyword rules to bucket an ingredient into a grocery aisle. Ordered by
 * priority — the first rule whose keyword appears in the (lower-cased) item
 * name wins. Falls back to "Other".
 */
const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "Proteins",
    keywords: [
      "chicken",
      "turkey",
      "tofu",
      "egg",
      "protein powder",
      "vega sport",
      "edamame",
    ],
  },
  {
    category: "Dairy & alternatives",
    keywords: [
      "yogurt",
      "greek yogurt",
      "parmesan",
      "soy milk",
      "almond milk",
      "milk",
    ],
  },
  {
    category: "Legumes & canned",
    keywords: [
      "beans",
      "chickpea",
      "lentil",
      "pinto",
      "cannellini",
      "kidney",
      "black bean",
      "crushed tomato",
      "marinara",
      "salsa",
      "hummus",
    ],
  },
  {
    category: "Grains & pantry",
    keywords: [
      "rice",
      "oats",
      "quinoa",
      "barley",
      "pasta",
      "bread",
      "roll",
      "tortilla",
      "muesli",
      "oatcakes",
      "fibre",
      "chia",
      "sweetcorn",
      "corn",
    ],
  },
  {
    category: "Nuts & seeds",
    keywords: ["walnut", "almond butter", "nuts", "seeds"],
  },
  {
    category: "Fats & oils",
    keywords: ["olive oil", "sesame oil", "avocado", "oil"],
  },
  {
    category: "Produce",
    keywords: [
      "broccoli",
      "lettuce",
      "spinach",
      "kale",
      "tomato",
      "cucumber",
      "sweet potato",
      "banana",
      "apple",
      "pear",
      "blueberr",
      "berries",
      "berry",
      "pepper",
      "onion",
      "carrot",
      "celery",
      "zucchini",
      "brussels",
      "squash",
      "cauliflower",
      "peas",
      "mushroom",
      "parsley",
      "cilantro",
      "kale",
      "veg",
      "salad",
      "daikon",
      "lime",
      "lemon",
      "garlic",
      "ginger",
    ],
  },
  {
    category: "Spices & condiments",
    keywords: [
      "cinnamon",
      "paprika",
      "cumin",
      "turmeric",
      "chili",
      "curry",
      "mustard",
      "salt",
      "pepper",
      "herbs",
      "spices",
      "vinegar",
      "soy",
      "aminos",
      "sauce",
    ],
  },
]

/** Infers a grocery category from an item name (see CATEGORY_RULES). */
export const categorizeItem = (name: string): string => {
  const lower = name.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.category
    }
  }
  return "Other"
}

const CATEGORY_ORDER = [
  "Proteins",
  "Legumes & canned",
  "Dairy & alternatives",
  "Grains & pantry",
  "Produce",
  "Nuts & seeds",
  "Fats & oils",
  "Spices & condiments",
  "Other",
]

interface Accumulator {
  item: string
  unit: string
  category: string
  amount: number | null // null = to-taste only (no numeric amount seen)
  note?: string
}

/**
 * Aggregates every scaled ingredient across the whole week and all people into
 * a categorised grocery list. Same item + unit are summed; "to taste" items
 * (null amount) collapse to a single unquantified line.
 */
export const buildGroceryList = (
  selection: MenuSelection,
  config: MenuConfig,
  catalog: CatalogDish[]
): GroceryGroup[] => {
  const catalogById = indexCatalog(catalog)
  // Key on item + unit so e.g. "Bell peppers (count)" never merges with grams.
  const acc = new Map<string, Accumulator>()

  WEEK_DAYS.forEach((day) => {
    const dishes = dishesForDay(
      selection,
      day,
      config.activeSlots,
      catalogById
    )
    if (dishes.length === 0) return

    config.people.forEach((person) => {
      const factor = dayScaleFactor(dishes, person)
      dishes.forEach(({ dish }) => {
        const servings = dish.servings || 1
        dish.ingredients.forEach((ing) => {
          const category = ing.category ?? categorizeItem(ing.name)
          const key = `${ing.name}__${ing.unit}`
          const existing = acc.get(key)
          // Ingredient amounts are for the whole batch; take one serving, then
          // scale to this person's portion.
          const scaled =
            ing.amount == null ? null : (ing.amount / servings) * factor

          if (!existing) {
            acc.set(key, {
              item: ing.name,
              unit: ing.unit,
              category,
              amount: scaled,
              note: ing.note,
            })
            return
          }
          if (scaled != null) {
            existing.amount = (existing.amount ?? 0) + scaled
          }
        })
      })
    })
  })

  // Bucket accumulators into categories.
  const byCategory = new Map<string, GroceryLine[]>()
  acc.forEach((entry) => {
    const line: GroceryLine = {
      item: entry.item,
      amount: entry.amount == null ? null : Math.round(entry.amount),
      unit: entry.unit,
      note: entry.note,
    }
    const list = byCategory.get(entry.category) ?? []
    list.push(line)
    byCategory.set(entry.category, list)
  })

  const groups: GroceryGroup[] = []
  CATEGORY_ORDER.forEach((category) => {
    const items = byCategory.get(category)
    if (items && items.length > 0) {
      items.sort((a, b) => a.item.localeCompare(b.item))
      groups.push({ category, items })
    }
  })
  // Any category not in CATEGORY_ORDER (shouldn't happen, but be safe).
  byCategory.forEach((items, category) => {
    if (!CATEGORY_ORDER.includes(category)) {
      items.sort((a, b) => a.item.localeCompare(b.item))
      groups.push({ category, items })
    }
  })

  return groups
}

/** A base ingredient amount scaled by a person's factor, rounded to grams. */
export const scaledAmount = (
  amount: number | null,
  factor: number
): number | null => (amount == null ? null : Math.round(amount * factor))

/**
 * Human-friendly grocery amount: grams roll up to kg past 1000 g; other units
 * pass through. A null amount (to-taste) renders as an empty string.
 */
export const formatGroceryAmount = (
  amount: number | null,
  unit: string
): string => {
  if (amount == null) return ""
  if (unit === "g" && amount >= 1000) {
    return `${round1(amount / 1000)} kg`
  }
  if (unit === "" ) return `${amount}`
  return `${amount} ${unit}`
}
