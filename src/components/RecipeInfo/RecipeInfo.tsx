import { Paper, Stack, Typography } from '@mui/material'

interface RecipeInfoProps {
    prepTime: number
    cookTime: number
    servings: number
}

export const RecipeInfo = ({
    prepTime,
    cookTime,
    servings,
}: RecipeInfoProps) => {
    return (
        <Paper
            sx={{ py: 2 }}
            style={{
                maxWidth: '500px',
            }}
        >
            <Stack
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                height="100%"
            >
                <Stack>
                    <Typography fontWeight="bold">Prep Time:</Typography>
                    <Typography fontSize="20px">{`${prepTime} min`}</Typography>
                </Stack>
                <Stack>
                    <Typography fontWeight="bold">Cook Time:</Typography>
                    <Typography fontSize="20px">{`${cookTime} min`}</Typography>
                </Stack>
                <Stack>
                    <Typography fontWeight="bold">Servings:</Typography>
                    <Typography fontSize="20px">{servings}</Typography>
                </Stack>
            </Stack>
        </Paper>
    )
}
