import { useMemo, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded"
import BlenderRoundedIcon from "@mui/icons-material/BlenderRounded"
import { MealPlanDetails, Meal } from "@src/types/custom"
import { summarizeDays } from "@src/utils/mealplan"
import {
  IngredientPortions,
  MacroSummary,
  PersonToggle,
} from "./MealPlanShared"

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack1: "Snack 1",
  dinner: "Dinner",
  snack2: "Snack 2",
}

const slotLabel = (slot: string) => SLOT_LABELS[slot] ?? slot

/** Orders a week's meals by the plan's slot order (dinner variants kept). */
const orderMeals = (meals: Meal[], slotOrder: string[]): Meal[] => {
  return [...meals].sort((a, b) => {
    const slotDiff = slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot)
    if (slotDiff !== 0) return slotDiff
    // Keep weekday variant before weekend within the same slot.
    return (a.variant ?? "").localeCompare(b.variant ?? "")
  })
}

const MealCard = ({ meal, personId }: { meal: Meal; personId: string }) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
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
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {meal.name}
              </Typography>
            </Box>
            <Stack spacing={0.5} alignItems="flex-end">
              <Chip size="small" label={summarizeDays(meal.servedDays)} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                }}
              >
                {meal.requiresCooking ? (
                  <RestaurantRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <BlenderRoundedIcon sx={{ fontSize: 16 }} />
                )}
                <Typography variant="caption" color="text.secondary">
                  {meal.requiresCooking ? "Cook" : "No cook"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <IngredientPortions
            ingredients={meal.ingredients}
            personId={personId}
          />

          <MacroSummary macros={meal.macros[personId]} />
        </Stack>
      </CardContent>
    </Card>
  )
}

interface MealsTabProps {
  plan: MealPlanDetails
  personId: string
  onPersonChange: (id: string) => void
}

export const MealsTab = ({ plan, personId, onPersonChange }: MealsTabProps) => {
  const [weekIndex, setWeekIndex] = useState(0)
  const week = plan.weeks[weekIndex]

  const orderedMeals = useMemo(
    () => orderMeals(week.meals, plan.mealSlots),
    [week.meals, plan.mealSlots]
  )

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          justifyContent: "space-between",
        }}
      >
        {plan.weeks.length > 1 && (
          <ToggleButtonGroup
            exclusive
            color="primary"
            size="small"
            value={weekIndex}
            onChange={(_event, value) => {
              if (value !== null) setWeekIndex(value)
            }}
            aria-label="Select week"
          >
            {plan.weeks.map((weekOption, index) => (
              <ToggleButton key={weekOption.week} value={index}>
                Week {weekOption.week}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}

        <PersonToggle
          people={plan.people}
          personId={personId}
          onChange={onPersonChange}
        />
      </Box>

      <Card sx={{ borderRadius: 3, backgroundColor: "rgba(0, 70, 134, 0.04)" }}>
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 0.6 }}
          >
            Daily totals
          </Typography>
          <MacroSummary macros={week.dailyTotals[personId]} variant="day" />
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {orderedMeals.map((meal, index) => (
          <MealCard
            key={`${meal.slot}-${meal.variant ?? index}`}
            meal={meal}
            personId={personId}
          />
        ))}
      </Stack>
    </Stack>
  )
}
