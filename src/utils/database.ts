import { supabase } from "@src/lib/supabaseClient"
import { Ingredient, Recipe } from "@src/types/custom"

export const getAllRecipes = async () => {
  const { data, error } = await supabase.from("recipes").select("*")

  if (error) {
    console.error(error.message)
    return {
      recipes: null,
    }
  }

  const recipes: Recipe[] = data.map((recipe) => {
    return {
      ...recipe,
      ingredients: recipe.ingredients as unknown as Ingredient[],
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
    }
  })

  return {
    recipes,
  }
}

export const getAllPaths = async () => {
  const { data } = await supabase.from("recipes").select("url")

  const paths = (data || []).map((entry) => ({
    params: { path: entry.url },
  }))

  return paths
}

export const getRecipeFromUrl = async (url: string) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("url", url)
    .single()

  if (error) {
    console.error(error.message)
    return null
  }

  const recipe: Recipe = {
    ...data,
    prepTime: data.prep_time,
    cookTime: data.cook_time,
    ingredients: data.ingredients as unknown as Ingredient[],
  }

  return recipe
}
