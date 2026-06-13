import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material"
import { NextSeo } from "next-seo"
import { DietPlan } from "@src/types/custom"
import { getAllDietPlans } from "@src/utils/database"

interface Props {
  plans: Pick<DietPlan, "month" | "label" | "title" | "description">[]
}

export default function DietIndexPage({ plans }: Props) {
  return (
    <>
      <NextSeo title="Meal Plans" />
      <Stack spacing={3}>
        <Typography variant="h4">Monthly Meal Plans</Typography>
        {plans.length === 0 && (
          <Typography variant="body1">No meal plans yet.</Typography>
        )}
        <Stack spacing={2}>
          {plans.map((plan) => (
            <Card key={plan.month} variant="outlined">
              <CardActionArea component="a" href={`/diet/${plan.month}`}>
                <CardContent>
                  <Typography variant="overline" color="primary.main">
                    {plan.label}
                  </Typography>
                  <Typography variant="h6">{plan.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {plan.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

export async function getStaticProps() {
  const { dietPlans } = await getAllDietPlans()

  const plans = dietPlans.map(({ month, label, title, description }) => ({
    month,
    label,
    title,
    description,
  }))

  return {
    props: {
      plans,
    },
  }
}
