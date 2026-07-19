import {
  CatalogDish,
  MEAL_SLOTS,
  MenuConfig,
  WeeklyMenuState,
} from "@src/types/menu"
import { dishCatalog } from "@src/data/data"

/**
 * Storage seam for the Weekly Menu Builder.
 *
 * Today this is a synchronous localStorage-backed store scoped to the browser.
 * The `MenuStore` interface is intentionally async and user-scoped so it can be
 * swapped for an API/DB implementation once auth exists — the UI (via
 * `useWeeklyMenu`) only ever talks to this interface, never to localStorage
 * directly.
 */
export interface MenuStore {
  /** The dish catalog available to build from. */
  getCatalog(): Promise<CatalogDish[]>
  /** Load the current user's saved menu, or null if none saved yet. */
  loadMenu(): Promise<WeeklyMenuState | null>
  /** Persist the current user's menu. */
  saveMenu(state: WeeklyMenuState): Promise<void>
  /** Clear the current user's saved menu. */
  clearMenu(): Promise<void>
}

/** A sensible starting household: two eaters mirroring the mealplan1 targets. */
export const defaultConfig = (): MenuConfig => ({
  people: [
    { id: "person-1", label: "Him", calorieTarget: 2000, proteinTarget: 150 },
    { id: "person-2", label: "Her", calorieTarget: 1600, proteinTarget: 130 },
  ],
  activeSlots: [...MEAL_SLOTS],
})

/** A fresh, empty menu document. */
export const emptyMenuState = (): WeeklyMenuState => ({
  config: defaultConfig(),
  selection: {},
})

// localStorage key. When auth lands, scope this per-user server-side instead.
const STORAGE_KEY = "rodycooks:weekly-menu:v1"

/** localStorage-backed store used until there's a database + login. */
class LocalMenuStore implements MenuStore {
  async getCatalog(): Promise<CatalogDish[]> {
    return dishCatalog
  }

  async loadMenu(): Promise<WeeklyMenuState | null> {
    if (typeof window === "undefined") return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as WeeklyMenuState
      // Minimal shape guard — ignore anything that isn't a usable document.
      if (!parsed?.config?.people || !Array.isArray(parsed.config.people)) {
        return null
      }
      return parsed
    } catch {
      return null
    }
  }

  async saveMenu(state: WeeklyMenuState): Promise<void> {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore write failures (private mode / quota).
    }
  }

  async clearMenu(): Promise<void> {
    if (typeof window === "undefined") return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore.
    }
  }
}

/** The active store. Swap this out for an API-backed store behind auth. */
export const menuStore: MenuStore = new LocalMenuStore()
