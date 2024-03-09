import { Stack, Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { GetStaticProps } from 'next'
import { Recipe } from '@src/types/custom'
import { ParsedUrlQuery } from 'querystring'
import { RecipeInfo } from '@src/components/RecipeInfo/RecipeInfo'
import { RecipeIngredients } from '@src/components/RecipeIngredients/RecipeIngredients'
import { RecipeSteps } from '@src/components/RecipeSteps/RecipeSteps'

interface Props {
    recipe: Recipe
}

export default function RecipeDetails({ recipe }: Props) {
    return (
        <Stack spacing={6}>
            <Typography variant="h4">{recipe.name}</Typography>
            <RecipeInfo
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
                servings={recipe.servings}
            />
            <RecipeIngredients ingredients={recipe.ingredients} />
            <RecipeSteps steps={recipe.steps} />
        </Stack>
    )
}

export async function getStaticPaths() {
    const { data } = await supabase.from('dishes').select('url')

    const paths = (data || []).map((entry) => ({
        params: { path: entry.url },
    }))

    return { paths, fallback: false }
}

interface ContextParams extends ParsedUrlQuery {
    path: string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { path } = context.params as ContextParams

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
        prepTime: data[0].prep_time,
        cookTime: data[0].cook_time,
        ingredients: [],
        steps: [],
    }

    data.forEach((ingredient) => {
        recipe.ingredients.push({
            id: ingredient.ingredient_id,
            name: ingredient.ingredient_name,
            amount: ingredient.amount,
            unit: ingredient.unit,
        })
    })

    // recipe.steps = [
    //     { id: '1', order: 1, description: 'Do something1' },
    //     { id: '2', order: 2, description: 'Do something2' },
    //     { id: '3', order: 3, description: 'Do something3' },
    // ]

    return {
        props: { recipe },
    }
}
