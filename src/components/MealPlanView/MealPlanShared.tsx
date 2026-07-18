import {
  Box,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { Macros, MealIngredient, Person } from "@src/types/custom"
import { formatPortion } from "@src/utils/mealplan"

/** Him / Her (or any person) selector shared by the portion-aware tabs. */
export const PersonToggle = ({
  people,
  personId,
  onChange,
}: {
  people: Person[]
  personId: string
  onChange: (id: string) => void
}) => {
  if (people.length < 2) return null
  return (
    <ToggleButtonGroup
      exclusive
      color="primary"
      size="small"
      value={personId}
      onChange={(_event, value) => {
        if (value !== null) onChange(value)
      }}
      aria-label="Select person"
    >
      {people.map((person) => (
        <ToggleButton key={person.id} value={person.id}>
          {person.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/** A compact macro readout used for meals and daily totals. */
export const MacroSummary = ({
  macros,
  variant = "meal",
}: {
  macros: Macros
  variant?: "meal" | "day"
}) => {
  const items: Array<{ label: string; value: string; highlight?: boolean }> = [
    { label: "kcal", value: `${macros.calories}`, highlight: true },
    { label: "protein", value: `${macros.proteinG} g`, highlight: true },
    { label: "fat", value: `${macros.fatG} g` },
    { label: "sat fat", value: `${macros.saturatedFatG} g` },
    { label: "carbs", value: `${macros.carbsG} g` },
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: variant === "day" ? 1 : 0.75,
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: variant === "day" ? 72 : 56,
            px: 1,
            py: variant === "day" ? 1 : 0.5,
            borderRadius: 2,
            backgroundColor: item.highlight
              ? "rgba(0, 70, 134, 0.08)"
              : "rgba(0, 0, 0, 0.04)",
          }}
        >
          <Typography
            variant={variant === "day" ? "h6" : "subtitle2"}
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: item.highlight ? "primary.main" : "text.primary",
            }}
          >
            {item.value}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

/**
 * Ingredient list with portion sizes — the core daily-lookup view. Cooked
 * weight is emphasised; raw weight and notes are shown as secondary text.
 */
export const IngredientPortions = ({
  ingredients,
  personId,
}: {
  ingredients: MealIngredient[]
  personId: string
}) => {
  return (
    <Stack divider={<Box sx={{ borderBottom: "1px solid #eee" }} />}>
      {ingredients.map((ingredient, index) => {
        const portion = formatPortion(ingredient.portions[personId])
        // Avoid repeating the same text on both sides (e.g. Cinnamon → "to taste").
        const showNote = ingredient.note && ingredient.note !== portion
        return (
          <Box
            key={`${ingredient.item}-${index}`}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 2,
              py: 0.75,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {ingredient.item}
              </Typography>
              {showNote && (
                <Typography variant="caption" color="text.secondary">
                  {ingredient.note}
                </Typography>
              )}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                whiteSpace: "nowrap",
                textAlign: "right",
                color: "primary.main",
              }}
            >
              {portion}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}

export const VegChip = () => (
  <Chip
    size="small"
    label="Vegetarian"
    sx={{
      backgroundColor: "rgba(46, 125, 50, 0.12)",
      color: "#2e7d32",
      fontWeight: 600,
    }}
  />
)
