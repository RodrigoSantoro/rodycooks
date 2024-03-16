import { Stack, Typography } from '@mui/material'

interface RecipeInfoColumnProps {
    title: string
    value: string | number
}

export const RecipeInfoColumn = ({ title, value }: RecipeInfoColumnProps) => (
    <Stack>
        <Typography fontWeight="bold">{title}</Typography>
        <Typography fontSize="20px">{value}</Typography>
    </Stack>
)
