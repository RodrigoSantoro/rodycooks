import { Paper, Stack, Typography } from '@mui/material'

interface RecipeInfoProps {
    children: React.ReactNode
}

export const RecipeInfo = ({ children }: RecipeInfoProps) => {
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
                {children}
            </Stack>
        </Paper>
    )
}
