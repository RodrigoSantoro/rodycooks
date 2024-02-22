import { Box, Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { GetServerSideProps, GetStaticPaths } from 'next'
import { Recipe } from '@src/types/custom'

interface Props {
    recipe: Recipe
}

export default function RecipeDetails({ recipe }: Props) {
    return (
        <Box>
            <Typography variant="h3">{recipe.name}</Typography>
            <Typography variant="body1">Servings: {recipe.servings}</Typography>
            {recipe.ingredients.map((ingredient) => {
                let amountWithUnit = ''

                if (ingredient.amount === 'to taste') {
                    amountWithUnit = `${ingredient.amount}`
                } else {
                    amountWithUnit = `- ${ingredient.amount} ${ingredient.unit}`
                }

                const output = `${ingredient.name} ${amountWithUnit}`
                return (
                    <Box key={ingredient.id}>
                        <Typography variant="body1">{output}</Typography>
                    </Box>
                )
            })}
        </Box>
    )
}

export async function getStaticPaths() {
    const { data } = await supabase.from('dishes').select('url')

    const paths = (data || []).map((entry) => ({
        params: { path: entry.url },
    }))

    return { paths, fallback: false }
}

export const getStaticProps: GetServerSideProps = async (context) => {
    const { path } = context.params as any
    const { data: data, error: error } = await supabase.rpc(
        'get_dish_ingredients_by_url',
        {
            urlparam: path,
        }
    )

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    const recipe: Recipe = {
        id: data[0].dish_id,
        name: data[0].dish_name,
        servings: data[0].servings,
        ingredients: [],
    }

    data.forEach((ingredient) => {
        recipe.ingredients.push({
            id: ingredient.ingredient_id,
            name: ingredient.ingredient_name,
            amount: ingredient.amount,
            unit: ingredient.unit,
        })
    })
    return {
        props: { recipe },
    }
}
