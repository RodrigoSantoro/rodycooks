import { getAllRecipes } from "@src/utils/database"
import { NextSeo } from "next-seo"
import { Recipe } from "@src/types/custom"
import { RecipeGrid } from "@src/components/RecipeGrid/RecipeGrid"

interface Props {
  recipes: Recipe[]
}

export default function HomePage({ recipes }: Props) {
  return (
    <>
      <NextSeo title="Home" />
      <RecipeGrid recipes={recipes} />
    </>
  )
}

export async function getStaticProps() {
  const { recipes } = await getAllRecipes()

  return {
    props: {
      recipes,
    },
  }
}
