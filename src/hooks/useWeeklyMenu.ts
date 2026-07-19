import { useCallback, useEffect, useRef, useState } from "react"
import {
  CatalogDish,
  MealSlot,
  MEAL_SLOTS,
  MenuConfig,
  MenuPerson,
  MenuSelection,
  WeekDay,
  WEEK_DAYS,
  WeeklyMenuState,
} from "@src/types/menu"
import { emptyMenuState, menuStore } from "@src/store/menuStore"

let personSeq = 0
const nextPersonId = (): string => {
  personSeq += 1
  return `person-${Date.now()}-${personSeq}`
}

export interface UseWeeklyMenu {
  loading: boolean
  config: MenuConfig
  selection: MenuSelection
  catalog: CatalogDish[]
  // config mutators
  addPerson: () => void
  removePerson: (personId: string) => void
  updatePerson: (personId: string, patch: Partial<MenuPerson>) => void
  toggleSlot: (slot: MealSlot) => void
  // selection mutators
  setDish: (day: WeekDay, slot: MealSlot, dishId: string | null) => void
  repeatAcrossWeek: (slot: MealSlot, dishId: string | null) => void
  clearSlot: (slot: MealSlot) => void
  clearSelection: () => void
  resetAll: () => void
}

/**
 * Owns the builder document (config + selection), hydrates it from the store on
 * mount, and debounces writes back. All persistence goes through `menuStore`,
 * so moving to a DB/login later is a store swap, not a UI change.
 */
export const useWeeklyMenu = (): UseWeeklyMenu => {
  const [loading, setLoading] = useState(true)
  const [catalog, setCatalog] = useState<CatalogDish[]>([])
  const [state, setState] = useState<WeeklyMenuState>(() => emptyMenuState())
  const hydrated = useRef(false)

  // Hydrate from the store once on mount.
  useEffect(() => {
    let active = true
    Promise.all([menuStore.getCatalog(), menuStore.loadMenu()]).then(
      ([loadedCatalog, savedMenu]) => {
        if (!active) return
        setCatalog(loadedCatalog)
        if (savedMenu) setState(savedMenu)
        hydrated.current = true
        setLoading(false)
      }
    )
    return () => {
      active = false
    }
  }, [])

  // Persist on change, but only after hydration (never clobber saved data
  // with the initial empty state before it has loaded).
  useEffect(() => {
    if (!hydrated.current) return
    menuStore.saveMenu(state)
  }, [state])

  const addPerson = useCallback(() => {
    setState((prev) => {
      const index = prev.config.people.length + 1
      const person: MenuPerson = {
        id: nextPersonId(),
        label: `Person ${index}`,
        calorieTarget: 2000,
        proteinTarget: 140,
      }
      return {
        ...prev,
        config: { ...prev.config, people: [...prev.config.people, person] },
      }
    })
  }, [])

  const removePerson = useCallback((personId: string) => {
    setState((prev) => {
      // Keep at least one person.
      if (prev.config.people.length <= 1) return prev
      return {
        ...prev,
        config: {
          ...prev.config,
          people: prev.config.people.filter((p) => p.id !== personId),
        },
      }
    })
  }, [])

  const updatePerson = useCallback(
    (personId: string, patch: Partial<MenuPerson>) => {
      setState((prev) => ({
        ...prev,
        config: {
          ...prev.config,
          people: prev.config.people.map((p) =>
            p.id === personId ? { ...p, ...patch } : p
          ),
        },
      }))
    },
    []
  )

  const toggleSlot = useCallback((slot: MealSlot) => {
    setState((prev) => {
      const active = prev.config.activeSlots.includes(slot)
      const nextSlots = active
        ? prev.config.activeSlots.filter((s) => s !== slot)
        : [...prev.config.activeSlots, slot]
      // Keep slots in canonical order (breakfast → snack2) so re-enabling a
      // slot doesn't push it to the bottom of the builder.
      const activeSlots = MEAL_SLOTS.filter((s) => nextSlots.includes(s))
      return { ...prev, config: { ...prev.config, activeSlots } }
    })
  }, [])

  const setDish = useCallback(
    (day: WeekDay, slot: MealSlot, dishId: string | null) => {
      setState((prev) => {
        const daySel = { ...(prev.selection[day] ?? {}) }
        if (dishId) daySel[slot] = dishId
        else delete daySel[slot]
        return {
          ...prev,
          selection: { ...prev.selection, [day]: daySel },
        }
      })
    },
    []
  )

  const repeatAcrossWeek = useCallback(
    (slot: MealSlot, dishId: string | null) => {
      setState((prev) => {
        const selection: MenuSelection = { ...prev.selection }
        WEEK_DAYS.forEach((day) => {
          const daySel = { ...(selection[day] ?? {}) }
          if (dishId) daySel[slot] = dishId
          else delete daySel[slot]
          selection[day] = daySel
        })
        return { ...prev, selection }
      })
    },
    []
  )

  const clearSlot = useCallback((slot: MealSlot) => {
    setState((prev) => {
      const selection: MenuSelection = { ...prev.selection }
      WEEK_DAYS.forEach((day) => {
        if (!selection[day]) return
        const daySel = { ...selection[day] }
        delete daySel[slot]
        selection[day] = daySel
      })
      return { ...prev, selection }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selection: {} }))
  }, [])

  const resetAll = useCallback(() => {
    setState(emptyMenuState())
  }, [])

  return {
    loading,
    config: state.config,
    selection: state.selection,
    catalog,
    addPerson,
    removePerson,
    updatePerson,
    toggleSlot,
    setDish,
    repeatAcrossWeek,
    clearSlot,
    clearSelection,
    resetAll,
  }
}
