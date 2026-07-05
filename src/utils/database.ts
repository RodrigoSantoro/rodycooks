import { data } from "@src/data"

export const getAllRecipes = async () => {
  return {
    recipes: data,
  }
}

export const getAllPaths = async () => {
  const paths = data.map((recipe) => ({
    params: { path: recipe.url },
  }))

  return paths
}

export const getRecipeFromUrl = async (url: string) => {
  const recipe = data.find((recipe) => recipe.url === url)

  return recipe
}
