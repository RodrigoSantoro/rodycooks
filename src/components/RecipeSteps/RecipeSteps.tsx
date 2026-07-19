import { Box, Stack, Typography } from "@mui/material"

interface RecipeStepsProps {
  steps: string[]
}

export const RecipeSteps = ({ steps }: RecipeStepsProps) => {
  if (steps.length === 0) {
    return null
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Steps:</Typography>
      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Stack key={step} direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                flexShrink: 0,
                backgroundColor: "primary.main",
                borderRadius: "100px",
              }}
            >
              <Typography variant="body2" color="white">
                {index + 1}
              </Typography>
            </Box>

            <Typography>{step}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
