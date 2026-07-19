import { Stack, Typography } from '@mui/material'

interface RecipeInfoColumnProps {
    title: string
    value: string | number
}

export const RecipeInfoColumn = ({ title, value }: RecipeInfoColumnProps) => (
    <Stack>
        <Typography sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Typography sx={{ fontSize: '20px' }}>{value}</Typography>
    </Stack>
)
