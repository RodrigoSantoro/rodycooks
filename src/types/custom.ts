export type Dish = {
    id: string
    name: string
    url: string
    categories: string[]
}
export type Dishes = Dish[]
export type Ingredient = {
    id: string
    name: string
    unit: string
    amount: string
}
export type Recipe = {
    id: string
    name: string
    servings: number
    ingredients: Ingredient[]
}
