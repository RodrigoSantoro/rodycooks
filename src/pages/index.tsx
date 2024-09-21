import { MaterialReactTable } from "material-react-table"
import { useRecipesTable } from "@src/hooks/useRecipesTable"
import { getAllRecipes } from "@src/utils/database"
import { NextSeo } from "next-seo"
import { Recipe } from "@src/types/custom"

interface Props {
  recipes: Recipe[]
}

export default function HomePage({ recipes }: Props) {
  const table = useRecipesTable(recipes)

  return (
    <>
      <NextSeo title="Home" />
      <MaterialReactTable table={table} />
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
