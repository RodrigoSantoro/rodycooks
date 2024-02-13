import { Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { Dishes } from '@src/types/custom'
import Link from 'next/link'

type Props = {
    dishes: Dishes
}

export default function HomePage({ dishes }: Props) {
    return <Typography variant="h1">Welcome to Rody Cooks</Typography>
}
