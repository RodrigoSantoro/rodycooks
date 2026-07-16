import { getAllMealPlans } from "@src/utils/database"
import { NextSeo } from "next-seo"
import { MealPlan } from "@src/types/custom"
import { MealPlanGrid } from "@src/components/MealPlanGrid/MealPlanGrid"

interface Props {
  mealPlans: MealPlan[]
}

export default function MealPlansPage({ mealPlans }: Props) {
  return (
    <>
      <NextSeo title="Meal Plans" />
      <MealPlanGrid mealPlans={mealPlans} />
    </>
  )
}

export async function getStaticProps() {
  const { mealPlans } = await getAllMealPlans()

  return {
    props: {
      mealPlans,
    },
  }
}
