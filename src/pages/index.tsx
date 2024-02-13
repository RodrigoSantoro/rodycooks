import { Box, Container, Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { Dishes } from '@src/types/custom'
import Link from 'next/link'

type Props = {
    dishes: Dishes
}

export default function HomePage({ dishes }: Props) {
    return (
        <Container>
            {dishes.map((dish) => (
                <Box key={dish.id}>
                    <Typography
                        component={Link}
                        variant="h4"
                        href={`recipes/${dish.url}`}
                    >
                        {dish.name}
                    </Typography>
                    <Typography variant="body1">{dish.description}</Typography>
                </Box>
            ))}
        </Container>
    )
}

export async function getStaticProps() {
    const { data, error } = await supabase.from('dishes').select('*')

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    return { props: { dishes: data } }
}
