import { useState } from "react"
import Link from "next/link"
import {
  Box,
  Breadcrumbs,
  Chip,
  Link as MuiLink,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { MealPlan } from "@src/types/custom"
import { MealsTab } from "./MealsTab"
import { GroceriesTab } from "./GroceriesTab"
import { ExtrasTab } from "./ExtrasTab"

interface MealPlanViewProps {
  plan: MealPlan
}

/** Summarises the dietary constraints into a row of at-a-glance chips. */
const constraintChips = (plan: MealPlan): string[] => {
  const { constraints } = plan.mealPlan.dietaryProfile
  const chips: string[] = []

  plan.mealPlan.people.forEach((person) => {
    chips.push(
      `${person.label}: ${person.caloriesPerDay.min}–${person.caloriesPerDay.max} kcal · ${person.proteinTargetGramsPerDay} g protein`
    )
  })
  if (constraints.maxSaturatedFatGramsPerDay) {
    chips.push(`≤ ${constraints.maxSaturatedFatGramsPerDay} g sat fat/day`)
  }
  if (constraints.noAddedSugar) chips.push("No added sugar")
  ;(constraints.excludedFoods ?? []).forEach((food) =>
    chips.push(`No ${food}`)
  )

  return chips
}

export const MealPlanView = ({ plan }: MealPlanViewProps) => {
  const [tab, setTab] = useState(0)
  const details = plan.mealPlan
  const [personId, setPersonId] = useState(details.people[0]?.id ?? "")
  const chips = constraintChips(plan)

  return (
    <Stack spacing={3}>
      <Box>
        <Breadcrumbs sx={{ mb: 1 }}>
          <MuiLink component={Link} href="/mealplans" underline="hover">
            Meal Plans
          </MuiLink>
          <Typography color="text.primary">{details.name}</Typography>
        </Breadcrumbs>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {details.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {details.description}
        </Typography>

        {chips.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 2 }}>
            {chips.map((chip) => (
              <Chip key={chip} label={chip} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          aria-label="Meal plan sections"
        >
          <Tab label="Meals" />
          <Tab label="Groceries" />
          <Tab label="Extras" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && (
          <MealsTab
            plan={details}
            personId={personId}
            onPersonChange={setPersonId}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && (
          <GroceriesTab planId={details.id} groceryLists={plan.groceryLists} />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && (
          <ExtrasTab
            plan={details}
            personId={personId}
            onPersonChange={setPersonId}
          />
        )}
      </Box>
    </Stack>
  )
}
