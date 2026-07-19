import { useMemo } from "react"
import Link from "next/link"
import {
  Box,
  Card,
  CardContent,
  Chip,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material"
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded"
import { CatalogDish, MenuConfig, MenuSelection } from "@src/types/menu"
import {
  buildMealPrepPlan,
  formatGroceryAmount,
  slotLabel,
} from "@src/utils/menuBuilder"
import { summarizeDays } from "@src/utils/mealplan"

interface MealPrepOutputProps {
  config: MenuConfig
  selection: MenuSelection
  catalog: CatalogDish[]
}

export const MealPrepOutput = ({
  config,
  selection,
  catalog,
}: MealPrepOutputProps) => {
  const batches = useMemo(
    () => buildMealPrepPlan(selection, config, catalog),
    [selection, config, catalog]
  )

  if (batches.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        Nothing to batch-cook yet — pick some dishes that need cooking in{" "}
        <strong>Build week</strong> and their prep amounts will appear here.
      </Typography>
    )
  }

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" color="text.secondary">
        Cook each dish once for the whole week. Amounts are the raw quantities to
        cook, summed across everyone — portion them out afterwards using the
        serving count.
      </Typography>

      {batches.map((batch) => (
        <Card key={batch.dishId} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
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
                    {batch.slots.map(slotLabel).join(" / ")} · batch cook
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {batch.name}
                  </Typography>
                </Box>
                <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
                  <Chip size="small" label={summarizeDays(batch.days)} />
                  <Typography variant="caption" color="text.secondary">
                    {batch.servings} servings
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <LocalFireDepartmentRoundedIcon
                    sx={{ fontSize: 18, color: "primary.main" }}
                  />
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
                  >
                    Cook this much
                  </Typography>
                </Box>
                <Stack divider={<Box sx={{ borderBottom: "1px solid #eee" }} />}>
                  {batch.ingredients.map((ing) => {
                    const amount = formatGroceryAmount(ing.amount, ing.unit)
                    return (
                      <Box
                        key={`${ing.name}-${ing.unit}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          gap: 2,
                          py: 0.75,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {ing.name}
                          </Typography>
                          {ing.note && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {ing.note}
                            </Typography>
                          )}
                        </Box>
                        {amount && (
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 800,
                              whiteSpace: "nowrap",
                              color: "primary.main",
                            }}
                          >
                            {amount}
                          </Typography>
                        )}
                      </Box>
                    )
                  })}
                </Stack>
              </Box>

              <MuiLink
                component={Link}
                href={`/recipes/${batch.url}`}
                underline="hover"
                variant="body2"
                sx={{ fontWeight: 600, alignSelf: "flex-start" }}
              >
                View recipe →
              </MuiLink>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
