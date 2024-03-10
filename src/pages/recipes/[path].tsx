import { Stack, Typography } from '@mui/material'
import { GetStaticProps } from 'next'
import { Recipe } from '@src/types/custom'
import { ParsedUrlQuery } from 'querystring'
import { RecipeInfo } from '@src/components/RecipeInfo/RecipeInfo'
import { RecipeIngredients } from '@src/components/RecipeIngredients/RecipeIngredients'
import { RecipeSteps } from '@src/components/RecipeSteps/RecipeSteps'
import { getAllDishesPaths, getRecipeFromUrl } from '@src/utils/database'

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
    const paths = await getAllDishesPaths()

    return { paths, fallback: false }
}

interface ContextParams extends ParsedUrlQuery {
    path: string
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { path } = context.params as ContextParams

    const recipe = await getRecipeFromUrl(path)

    return {
        props: { recipe },
    }
}
