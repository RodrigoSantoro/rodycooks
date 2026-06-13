import { data } from "@src/data"
import { dietPlans } from "@src/data/diet"

export const getAllRecipes = async () => {
  return {
    recipes: data,
  }
}

export const getAllDietPlans = async () => {
  return {
    dietPlans,
  }
}

export const getDietPlanPaths = async () => {
  const paths = dietPlans.map((plan) => ({
    params: { month: plan.month },
  }))

  return paths
}

export const getDietPlanFromMonth = async (month: string) => {
  const plan = dietPlans.find((plan) => plan.month === month)

  return plan
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
