import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material"
import { MealPlanDetails } from "@src/types/custom"

interface ExtrasTabProps {
  plan: MealPlanDetails
}

export const ExtrasTab = ({ plan }: ExtrasTabProps) => {
  return (
    <Stack spacing={4}>
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
