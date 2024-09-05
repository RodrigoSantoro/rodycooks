import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material"
import { Ingredient } from "@src/types/custom"
import { useState } from "react"

interface RecipeIngredientsProps {
  ingredients: Ingredient[]
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
            let amountWithUnit = ""

            if (ingredient.amount === "to taste") {
              amountWithUnit = `${ingredient.amount}`
            } else {
              amountWithUnit = `- ${ingredient.amount}`
            }

            const output = `${ingredient.name} ${amountWithUnit}`
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
