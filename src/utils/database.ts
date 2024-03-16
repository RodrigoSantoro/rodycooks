import { supabase } from '@src/lib/supabaseClient'
import { Ingredient, Recipe, Step } from '@src/types/custom'

export const getDishesWithCategories = async () => {
    const { data, error } = await supabase
        .from('dishes_with_categories_view')
        .select('*')

    if (error) {
        console.error(error.message)
        return {
            dishes: null,
            categories: null,
        }
    }

    const dishes = new Map()
    // TODO change this query to use json_agg so we don't have to do this
    data?.forEach((dish) => {
        if (dishes.get(dish.dish_id)) {
            dishes.get(dish.dish_id).categories.push(dish.cat_name)
        } else {
            dishes.set(dish.dish_id, {
                id: dish.dish_id,
                name: dish.dish_name,
                url: dish.url,
                categories: [dish.cat_name],
                prepTime: dish.prep_time,
                cookTime: dish.cook_time,
            })
        }
    })

    const categoriesSet = new Set<string>()
    dishes.forEach((dish) => {
        dish.categories.forEach((category: string) => {
            categoriesSet.add(category)
        })
    })
    const categories = Array.from(categoriesSet)

    return {
        dishes: Array.from(dishes.values()),
        categories,
    }
}

export const getAllDishesPaths = async () => {
    const { data } = await supabase.from('dishes').select('url')

    const paths = (data || []).map((entry) => ({
        params: { path: entry.url },
    }))

    return paths
}

export const getRecipeFromUrl = async (url: string) => {
    const { data: data, error: error } = await supabase
        .rpc('get_dish_ingredients_by_url', {
            urlparam: url,
        })
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
        steps: ((data.steps || []) as unknown as Step[]).sort(
            (a, b) => a.order - b.order
        ),
    }

    return recipe
}
