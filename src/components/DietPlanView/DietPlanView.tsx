import { useState } from "react"
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material"
import { DietPlan } from "@src/types/custom"
import { TargetCards } from "./TargetCards"
import { GlanceTable } from "./GlanceTable"
import { MealCard } from "./MealCard"
import { GroceryList } from "./GroceryList"

interface DietPlanViewProps {
  plan: DietPlan
}

interface TabPanelProps {
  children: React.ReactNode
  value: number
  index: number
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) return null
  return <Box sx={{ pt: 3 }}>{children}</Box>
}

export const DietPlanView = ({ plan }: DietPlanViewProps) => {
  const [tab, setTab] = useState(0)

  // Tabs: Targets, one per week, Snacks, Grocery.
  const weekTabOffset = 1
  const snacksIndex = weekTabOffset + plan.weeks.length
  const groceryIndex = snacksIndex + 1

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4">{plan.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {plan.label}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {plan.description}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Targets" />
          {plan.weeks.map((week) => (
            <Tab key={week.name} label={week.name} />
          ))}
          <Tab label="Snacks" />
          <Tab label="Grocery" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}>
        <Stack spacing={3}>
          <Stack spacing={1.5}>
            <Typography variant="h5">Daily macro targets</Typography>
            <TargetCards people={plan.targets.people} />
            <Typography variant="body2" color="text.secondary">
              {plan.targets.note}
            </Typography>
          </Stack>
          {plan.weeks.map((week) => (
            <Stack key={week.name} spacing={1}>
              <Typography variant="h6">{week.name} at a glance</Typography>
              <GlanceTable rows={week.ataGlance} />
            </Stack>
          ))}
        </Stack>
      </TabPanel>

      {plan.weeks.map((week, weekIndex) => (
        <TabPanel
          key={week.name}
          value={tab}
          index={weekTabOffset + weekIndex}
        >
          <Stack spacing={2}>
            <Typography variant="h5">{week.name} — meals & portions</Typography>
            <Typography variant="body2" color="text.secondary">
              {week.legend}
            </Typography>
            {week.meals.map((meal) => (
              <MealCard key={meal.title} meal={meal} />
            ))}
          </Stack>
        </TabPanel>
      ))}

      <TabPanel value={tab} index={snacksIndex}>
        <Stack spacing={2}>
          <Typography variant="h5">Snack menu — pick any one per day</Typography>
          <Typography variant="body2" color="text.secondary">
            {plan.snacks.note}
          </Typography>
          {plan.snacks.items.map((meal) => (
            <MealCard key={meal.title} meal={meal} />
          ))}
        </Stack>
      </TabPanel>

      <TabPanel value={tab} index={groceryIndex}>
        <Stack spacing={3}>
          {plan.grocery.map((section) => (
            <GroceryList
              key={section.title}
              section={section}
              month={plan.month}
            />
          ))}
        </Stack>
      </TabPanel>
    </Stack>
  )
}
