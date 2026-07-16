import { MealPlan } from "@src/types/custom"
import Link from "next/link"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material"

interface MealPlanGridProps {
  mealPlans: MealPlan[]
}

export const MealPlanGrid = ({ mealPlans }: MealPlanGridProps) => {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Meal Plans
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Pick a plan to view portions, meals and grocery lists
        </Typography>
      </Box>

      {mealPlans.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {mealPlans.map(({ mealPlan }) => {
            const slotsPerDay = mealPlan.mealSlots.length
            const weekCount = mealPlan.weeks.length
            return (
              <Card
                key={mealPlan.id}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/mealplans/${mealPlan.id}`}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      background:
                        "linear-gradient(135deg, #004686 0%, #0a5aa8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 56,
                    }}
                  >
                    <span role="img" aria-hidden>
                      🥗
                    </span>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                    <Stack spacing={1.25}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {mealPlan.name}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        <Chip
                          size="small"
                          label={`${weekCount} ${
                            weekCount === 1 ? "week" : "weeks"
                          }`}
                        />
                        <Chip
                          size="small"
                          label={`${slotsPerDay} meals/day`}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {mealPlan.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          })}
        </Box>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ py: 6, textAlign: "center" }}
        >
          No meal plans yet.
        </Typography>
      )}
    </Stack>
  )
}
