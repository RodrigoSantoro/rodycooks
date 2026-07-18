import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { MealPlanDetails } from "@src/types/custom"
import {
  IngredientPortions,
  MacroSummary,
  PersonToggle,
  VegChip,
} from "./MealPlanShared"

interface ExtrasTabProps {
  plan: MealPlanDetails
  personId: string
  onPersonChange: (id: string) => void
}

export const ExtrasTab = ({
  plan,
  personId,
  onPersonChange,
}: ExtrasTabProps) => {
  return (
    <Stack spacing={4}>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.5,
            mb: 0.5,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Weekend dinner options
          </Typography>
          <PersonToggle
            people={plan.people}
            personId={personId}
            onChange={onPersonChange}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Swap-in dinners for the weekend — each is one serving.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}
        >
          {plan.weekendDinnerOptions.map((option) => (
            <Card key={option.id} variant="outlined" sx={{ borderRadius: 3 }}>
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
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                    >
                      {option.name}
                    </Typography>
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Chip
                        size="small"
                        label={option.type}
                        sx={{ textTransform: "capitalize" }}
                      />
                      {option.vegetarian && <VegChip />}
                    </Stack>
                  </Box>
                  <IngredientPortions
                    ingredients={option.ingredients}
                    personId={personId}
                  />
                  <MacroSummary macros={option.macros[personId]} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {plan.seasoningBlends.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Seasoning blends
          </Typography>
          <Stack spacing={2}>
            {plan.seasoningBlends.map((blend) => (
              <Card key={blend.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {blend.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 1.5 }}
                  >
                    {blend.basis}
                  </Typography>
                  <Box
                    component="ul"
                    sx={{ m: 0, pl: 2.5, "& li": { mb: 0.25 } }}
                  >
                    {blend.ingredients.map((ingredient) => (
                      <li key={ingredient}>
                        <Typography variant="body2">{ingredient}</Typography>
                      </li>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {plan.notes.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Notes
          </Typography>
          <Card
            variant="outlined"
            sx={{ borderRadius: 3, backgroundColor: "rgba(0, 0, 0, 0.02)" }}
          >
            <CardContent>
              <Stack spacing={1.5} divider={<Divider flexItem />}>
                {plan.notes.map((note, index) => (
                  <Typography key={index} variant="body2" color="text.secondary">
                    {note}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </Stack>
  )
}
