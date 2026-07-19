import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material"
import { CatalogIngredient } from "@src/types/menu"
import { useState } from "react"

interface RecipeIngredientsProps {
  ingredients: CatalogIngredient[]
}

/** "165 g", "2", "1 tsp", or "to taste" for a null amount. */
const formatAmount = (amount: number | null, unit: string): string => {
  if (amount == null) return "to taste"
  if (unit === "" || unit === "count") return `${amount}`
  if (unit === "g" || unit === "ml" || unit === "kg" || unit === "l") {
    return `${amount}${unit}`
  }
  return `${amount} ${unit}`
}

export const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  const [selectedItems, setSelectedItems] = useState(new Map<string, boolean>())

  const onItemSelected = (id: string) => {
    const newSelectedItems = new Map(selectedItems)
    newSelectedItems.set(id, !selectedItems.get(id))
    setSelectedItems(newSelectedItems)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Ingredients:</Typography>
      <FormGroup>
        <Stack>
          {ingredients.map((ingredient) => {
            const amount = formatAmount(ingredient.amount, ingredient.unit)
            const output = `${ingredient.name} — ${amount}`
            const isSelected = selectedItems.get(ingredient.name)
            return (
              <FormControlLabel
                key={ingredient.name}
                control={<Checkbox />}
                label={output}
                onChange={() => onItemSelected(ingredient.name)}
                sx={{
                  maxWidth: "fit-content",
                  "& .Mui-checked": {
                    color: "primary.main",
                  },
                  textDecoration: isSelected ? "line-through" : "none",
                }}
              />
            )
          })}
        </Stack>
      </FormGroup>
    </Stack>
  )
}
