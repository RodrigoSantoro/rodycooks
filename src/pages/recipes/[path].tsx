import { Stack, Typography } from '@mui/material'
import { supabase } from '@src/lib/supabaseClient'
import { GetStaticProps } from 'next'
import { Ingredient, Recipe, Step } from '@src/types/custom'
import { ParsedUrlQuery } from 'querystring'
import { RecipeInfo } from '@src/components/RecipeInfo/RecipeInfo'
import { RecipeIngredients } from '@src/components/RecipeIngredients/RecipeIngredients'
import { RecipeSteps } from '@src/components/RecipeSteps/RecipeSteps'

interface Props {
    recipe: Recipe
}

export default function RecipePage({ recipe }: Props) {
    if (!recipe) {
        return <Typography variant="h4">Recipe not found</Typography>
    }

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

    const { data: data, error: error } = await supabase
        .rpc('get_dish_ingredients_by_url', {
            urlparam: path,
        })
        .single()

    if (error) {
        console.error(error.message)
        return { props: {} }
    }

    const recipe: Recipe = {
        id: data.id,
        name: data.name,
        servings: data.servings,
        prepTime: data.prep_time,
        cookTime: data.cook_time,
        ingredients: data.ingredients as Ingredient[],
        steps: (data.steps || []) as Step[],
    }

    return {
        props: { recipe },
    }
}
