import { getAllRecipes } from "@src/utils/database"
import { NextSeo } from "next-seo"
import { CatalogDish } from "@src/types/menu"
import { RecipeGrid } from "@src/components/RecipeGrid/RecipeGrid"

interface Props {
  recipes: CatalogDish[]
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
