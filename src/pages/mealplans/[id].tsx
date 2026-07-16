import { Typography } from "@mui/material"
import { GetStaticProps } from "next"
import { MealPlan } from "@src/types/custom"
import { ParsedUrlQuery } from "querystring"
import { getAllMealPlanPaths, getMealPlanFromId } from "@src/utils/database"
import { MealPlanView } from "@src/components/MealPlanView/MealPlanView"
import { NextSeo } from "next-seo"

interface Props {
  plan: MealPlan
}

export default function MealPlanPage({ plan }: Props) {
  if (!plan) {
    return <Typography variant="h4">Meal plan not found</Typography>
  }

  return (
    <>
      <NextSeo title={plan.mealPlan.name} />
      <MealPlanView plan={plan} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getAllMealPlanPaths()

  return { paths, fallback: false }
}

interface ContextParams extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as ContextParams

  const plan = await getMealPlanFromId(id)

  return {
    props: { plan },
  }
}
