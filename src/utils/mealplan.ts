import { MealIngredient } from "@src/types/custom"

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

const DAY_SHORT: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
}

/**
 * Turns a list of served days into a compact label for the daily portion
 * lookup, e.g. "Every day", "Weekdays", "Weekend", or "Mon, Wed, Fri".
 */
export const summarizeDays = (days: string[]): string => {
  const set = new Set(days.map((day) => day.toLowerCase()))

  if (set.size === 7) return "Every day"

  const isWeekdays =
    set.size === 5 &&
    ["monday", "tuesday", "wednesday", "thursday", "friday"].every((day) =>
      set.has(day)
    )
  if (isWeekdays) return "Weekdays"

  const isWeekend =
    set.size === 2 && set.has("saturday") && set.has("sunday")
  if (isWeekend) return "Weekend"

  return DAY_ORDER.filter((day) => set.has(day))
    .map((day) => DAY_SHORT[day])
    .join(", ")
}

/**
 * Human-readable portion string for an ingredient, favouring the cooked
 * weight (what ends up on the plate) and noting the raw weight for prep.
 */
export const formatPortion = (ingredient: MealIngredient): string => {
  const { rawWeightG, cookedWeightG } = ingredient

  if (cookedWeightG != null && rawWeightG != null) {
    if (cookedWeightG === rawWeightG) return `${cookedWeightG} g`
    return `${cookedWeightG} g cooked · ${rawWeightG} g raw`
  }
  if (cookedWeightG != null) return `${cookedWeightG} g`
  if (rawWeightG != null) return `${rawWeightG} g`
  return "to taste"
}

/** Formats a grocery quantity + unit, e.g. "1.2 kg" or "7 count". */
export const formatQuantity = (quantity?: number, unit?: string): string => {
  if (quantity == null && !unit) return ""
  if (quantity == null) return unit ?? ""
  return unit ? `${quantity} ${unit}` : `${quantity}`
}
