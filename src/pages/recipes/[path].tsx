import { Box, Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { GetServerSideProps } from 'next'
import { Recipe } from '@src/types/custom'

type Props = {
    recipe: Recipe
}

export default function RecipeDetails({ recipe }: Props) {
    return (
        <Box>
            <Typography variant="h3">{recipe.name}</Typography>
            <Typography variant="body1">{recipe.description}</Typography>
            <Typography variant="body1">{recipe.servings}</Typography>
            <Typography variant="body1">{recipe.notes}</Typography>
            {recipe.ingredients.map((ingredient) => {
                let amountWithUnit = ''

                if (ingredient.amount === 'to taste') {
                    amountWithUnit = `${ingredient.amount}`
                } else {
                    amountWithUnit = `- ${ingredient.amount} ${ingredient.unit}`
                }

                const output = `${ingredient.details.name} ${amountWithUnit}`
                return (
                    <Box key={ingredient.id}>
                        <Typography variant="caption">{output}</Typography>
                    </Box>
                )
            })}
        </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { path } = context.query
    const { data: dishData, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('url', path)
        .single()

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    const { data: ingredientsData } = await supabase
        .from('dish_ingredients')
        .select(
            `
            *,
            details:ingredients (
            name
            )
        `
        )
        .eq('dish_id', dishData.id)

    return {
        props: { recipe: { ...dishData, ingredients: ingredientsData } },
    }
}
