import { Typography } from '@mui/material'
import { GetStaticProps } from 'next'
import { Recipe } from '@src/types/custom'
import { ParsedUrlQuery } from 'querystring'
import { getAllDishesPaths, getRecipeFromUrl } from '@src/utils/database'
import { RecipeView } from '@src/components/RecipeView/RecipeView'

interface Props {
    recipe: Recipe
}

export default function RecipePage({ recipe }: Props) {
    if (!recipe) {
        return <Typography variant="h4">Recipe not found</Typography>
    }

    return <RecipeView recipe={recipe} />
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
