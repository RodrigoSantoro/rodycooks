import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { DietMeal } from "@src/types/custom"
import { MAN_COLOR, WOMAN_COLOR } from "./colors"

interface MealCardProps {
  meal: DietMeal
}

// "same" means the ingredient is eaten raw, so the raw weight is the served amount.
const servedAmount = (raw: string, cooked: string) =>
  cooked === "same" ? raw : cooked

export const MealCard = ({ meal }: MealCardProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          {meal.title}
        </Typography>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 320 }}>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, whiteSpace: "nowrap" } }}>
                <TableCell>Ingredient</TableCell>
                <TableCell sx={{ color: MAN_COLOR }}>Amount ♂</TableCell>
                <TableCell sx={{ color: WOMAN_COLOR }}>Amount ♀</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meal.ingredients.map((ingredient) => (
                <TableRow key={ingredient.name}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>
                    {servedAmount(ingredient.rawMan, ingredient.cookedMan)}
                  </TableCell>
                  <TableCell>
                    {servedAmount(ingredient.rawWoman, ingredient.cookedWoman)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={`♂ ${meal.macrosMan}`}
            size="small"
            sx={{
              fontWeight: 600,
              color: MAN_COLOR,
              backgroundColor: "#e8f1fa",
            }}
          />
          <Chip
            label={`♀ ${meal.macrosWoman}`}
            size="small"
            sx={{
              fontWeight: 600,
              color: WOMAN_COLOR,
              backgroundColor: "#fbe9f3",
            }}
          />
        </Box>
      </Stack>
    </Paper>
  )
}
