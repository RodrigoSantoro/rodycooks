import { data, wines, mealPlans } from "@src/data"

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

export const getAllWines = async () => {
  return {
    wines,
  }
}

export const getAllWinePaths = async () => {
  const paths = wines.map((wine) => ({
    params: { id: wine.id },
  }))

  return paths
}

export const getWineFromId = async (id: string) => {
  const wine = wines.find((wine) => wine.id === id)

  return wine
}

export const getAllMealPlans = async () => {
  return {
    mealPlans,
  }
}

export const getAllMealPlanPaths = async () => {
  const paths = mealPlans.map((plan) => ({
    params: { id: plan.mealPlan.id },
  }))

  return paths
}

export const getMealPlanFromId = async (id: string) => {
  const plan = mealPlans.find((plan) => plan.mealPlan.id === id)

  return plan
}
