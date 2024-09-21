import { supabase } from "@src/lib/supabaseClient"
import { Dish, Ingredient, Recipe } from "@src/types/custom"

export const getDishesWithCategories = async () => {
  const { data, error } = await supabase.from("recipes").select("*")

  if (error) {
    console.error(error.message)
    return {
      dishes: null,
      categories: null,
    }
  }

  const categoriesSet = new Set<string>()
  data.forEach((dish) => {
    dish.categories.forEach((category: string) => {
      categoriesSet.add(category)
    })
  })
  const categories = Array.from(categoriesSet)

  const dishes: Dish[] = data.map((dish) => {
    return {
      ...dish,
      prepTime: dish.prep_time,
      cookTime: dish.cook_time,
    }
  })
  return {
    dishes,
    categories,
  }
}

export const getAllDishesPaths = async () => {
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
    id: data.id,
    name: data.name,
    servings: data.servings,
    prepTime: data.prep_time,
    cookTime: data.cook_time,
    calories: data.calories,
    ingredients: data.ingredients as unknown as Ingredient[],
    steps: data.steps as string[],
  }

  return recipe
}
