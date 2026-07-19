import { useMemo, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { CatalogDish, MenuConfig, MenuSelection } from "@src/types/menu"
import {
  buildMenuDays,
  dayLabel,
  formatGroceryAmount,
  menuHasSelections,
  scaledAmount,
  slotLabel,
} from "@src/utils/menuBuilder"
import { MacroSummary, PersonToggle } from "@src/components/MealPlanView/MealPlanShared"
import { Person } from "@src/types/custom"

interface WeeklyMenuSummaryProps {
  config: MenuConfig
  selection: MenuSelection
  catalog: CatalogDish[]
}

/** Green when within ±10% of target, amber otherwise. */
const targetChip = (actual: number, target: number, unit: string) => {
  if (target <= 0) return null
  const ratio = actual / target
  const onTarget = ratio >= 0.9 && ratio <= 1.1
  const deltaPct = Math.round((ratio - 1) * 100)
  const sign = deltaPct > 0 ? "+" : ""
  return (
    <Chip
      size="small"
      label={`${actual} / ${target} ${unit} (${sign}${deltaPct}%)`}
      sx={{
        fontWeight: 600,
        backgroundColor: onTarget
          ? "rgba(46, 125, 50, 0.12)"
          : "rgba(237, 108, 2, 0.14)",
        color: onTarget ? "#2e7d32" : "#b25a00",
      }}
    />
  )
}

export const WeeklyMenuSummary = ({
  config,
  selection,
  catalog,
}: WeeklyMenuSummaryProps) => {
  const days = useMemo(
    () => buildMenuDays(selection, config, catalog),
    [selection, config, catalog]
  )

  const [personId, setPersonId] = useState(config.people[0]?.id ?? "")
  // Guard against a removed person: fall back to the first available.
  const activePersonId = config.people.some((p) => p.id === personId)
    ? personId
    : config.people[0]?.id ?? ""

  // PersonToggle expects the mealplan `Person` shape; adapt the menu people.
  const togglePeople: Person[] = config.people.map((p) => ({
    id: p.id,
    label: p.label,
    caloriesPerDay: { min: p.calorieTarget, max: p.calorieTarget },
    proteinTargetGramsPerDay: p.proteinTarget,
  }))

  if (!menuHasSelections(days)) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No meals picked yet. Head to <strong>Build week</strong> to choose
        dishes, and your scaled menu will appear here.
      </Typography>
    )
  }

  const daysWithFood = days.filter((day) => day.dishesBySlot.length > 0)

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Portions below are scaled to the selected person&apos;s daily calorie
          target.
        </Typography>
        <PersonToggle
          people={togglePeople}
          personId={activePersonId}
          onChange={setPersonId}
        />
      </Box>

      {daysWithFood.map((menuDay) => {
        const personDay = menuDay.people.find(
          (p) => p.personId === activePersonId
        )
        if (!personDay) return null

        return (
          <Card key={menuDay.day} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1.5,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {dayLabel(menuDay.day)}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {targetChip(
                    personDay.totals.calories,
                    personDay.calorieTarget,
                    "kcal"
                  )}
                  {targetChip(
                    personDay.totals.proteinG,
                    personDay.proteinTarget,
                    "g protein"
                  )}
                </Box>
              </Box>

              <Stack spacing={1.5} divider={<Divider flexItem />}>
                {personDay.meals.map((meal) => {
                  const factor = meal.scaleFactor
                  return (
                    <Box key={`${meal.slot}-${meal.dish.id}`}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="overline"
                            color="primary"
                            sx={{ fontWeight: 700, letterSpacing: 0.6 }}
                          >
                            {slotLabel(meal.slot)}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, lineHeight: 1.2 }}
                          >
                            {meal.dish.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ whiteSpace: "nowrap" }}
                        >
                          {meal.macros.calories} kcal · {meal.macros.proteinG} g
                          protein
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 0.75,
                        }}
                      >
                        {meal.dish.ingredients.map((ing, i) => {
                          // Ingredient amounts are per batch; show one person's
                          // portion (one serving, scaled).
                          const servings = meal.dish.servings || 1
                          const perServing =
                            ing.amount == null ? null : ing.amount / servings
                          const amt = formatGroceryAmount(
                            scaledAmount(perServing, factor),
                            ing.unit
                          )
                          return (
                            <Chip
                              key={`${ing.name}-${i}`}
                              size="small"
                              variant="outlined"
                              label={amt ? `${ing.name} · ${amt}` : ing.name}
                              sx={{ maxWidth: "100%" }}
                            />
                          )
                        })}
                      </Box>
                    </Box>
                  )
                })}
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    display: "block",
                    mb: 0.75,
                  }}
                >
                  Day total
                </Typography>
                <MacroSummary macros={personDay.totals} variant="day" />
              </Box>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  )
}
