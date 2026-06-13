import { Typography } from "@mui/material"
import { GetStaticProps } from "next"
import { ParsedUrlQuery } from "querystring"
import { NextSeo } from "next-seo"
import { DietPlan } from "@src/types/custom"
import { getDietPlanFromMonth, getDietPlanPaths } from "@src/utils/database"
import { DietPlanView } from "@src/components/DietPlanView/DietPlanView"

interface Props {
  plan: DietPlan
}

export default function DietMonthPage({ plan }: Props) {
  if (!plan) {
    return <Typography variant="h4">Meal plan not found</Typography>
  }

  return (
    <>
      <NextSeo title={`Meal Plan — ${plan.label}`} />
      <DietPlanView plan={plan} />
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getDietPlanPaths()

  return { paths, fallback: false }
}

interface ContextParams extends ParsedUrlQuery {
  month: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { month } = context.params as ContextParams

  const plan = await getDietPlanFromMonth(month)

  return {
    props: { plan },
  }
}
