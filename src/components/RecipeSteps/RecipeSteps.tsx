import { Box, Stack, Typography } from '@mui/material'
import { Step } from '@src/types/custom'

interface RecipeStepsProps {
    steps: Step[]
}

export const RecipeSteps = ({ steps }: RecipeStepsProps) => {
    if (steps.length === 0) {
        return null
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h5">Steps:</Typography>
            <Stack spacing={2}>
                {steps.map((step) => (
                    <Stack
                        key={step.id}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width="24px"
                            height="24px"
                            flexShrink={0}
                            sx={{
                                backgroundColor: 'primary.main',
                                borderRadius: '100px',
                            }}
                        >
                            <Typography variant="body2" color="white">
                                {step.order}
                            </Typography>
                        </Box>

                        <Typography>{step.description}</Typography>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    )
}
