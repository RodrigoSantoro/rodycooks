import { Recipe } from '@src/types/custom'
import { Stack, Typography } from '@mui/material'
import { RecipeInfo } from '@src/components/RecipeInfo/RecipeInfo'
import { RecipeInfoColumn } from '@src/components/RecipeInfo/RecipeInfoColumn'
import { RecipeIngredients } from '@src/components/RecipeIngredients/RecipeIngredients'
import { RecipeSteps } from '@src/components/RecipeSteps/RecipeSteps'

interface RecipeViewProps {
    recipe: Recipe
}

export const RecipeView = ({ recipe }: RecipeViewProps) => {
    return (
        <Stack spacing={6}>
            <Typography variant="h4">{recipe.name}</Typography>
            <Stack spacing={1}>
                <RecipeInfo>
                    <RecipeInfoColumn
                        title="Prep Time"
                        value={`${recipe.prepTime} min`}
                    />
                    <RecipeInfoColumn
                        title="Cook Time"
                        value={`${recipe.cookTime} min`}
                    />
                    <RecipeInfoColumn
                        title="Servings"
                        value={recipe.servings}
                    />
                </RecipeInfo>
                {!!recipe.calories && (
                    <Typography variant="body2">{`Calories per serving: ${recipe.calories}`}</Typography>
                )}
            </Stack>
            <RecipeIngredients ingredients={recipe.ingredients} />
            <RecipeSteps steps={recipe.steps} />
        </Stack>
    )
}
