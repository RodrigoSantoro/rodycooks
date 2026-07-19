import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded"
import SpaRoundedIcon from "@mui/icons-material/SpaRounded"
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded"
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded"
import {
  MealPlanDetails,
  MealPrepComponent,
  MealPrepSession,
  MealPrepWeek,
  Person,
  PersonPortion,
} from "@src/types/custom"
import { formatGrams, summarizeDays } from "@src/utils/mealplan"

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack1: "Snack 1",
  dinner: "Dinner",
  snack2: "Snack 2",
}

const slotLabel = (slot: string) => SLOT_LABELS[slot] ?? slot

/** What lands on one plate — cooked weight if we have it, otherwise raw. */
const servingText = (portion?: PersonPortion): string => {
  if (!portion) return "—"
  if (portion.cookedWeightG != null) return `${portion.cookedWeightG} g`
  if (portion.rawWeightG != null) return `${portion.rawWeightG} g`
  return "to taste"
}

/** "Him 120 g · Her 83 g" — the per-serving split for one component. */
const perServingLine = (people: Person[], component: MealPrepComponent): string =>
  people
    .map((person) => `${person.label} ${servingText(component.perServing[person.id])}`)
    .join(" · ")

/** A single batch-cook line: item on the left, weekly raw total on the right. */
const CookRow = ({
  component,
  people,
}: {
  component: MealPrepComponent
  people: Person[]
}) => (
  <Box sx={{ py: 0.9 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 2,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {component.item}
      </Typography>
      <Box sx={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.1 }}
        >
          {formatGrams(component.rawTotalG)} raw
        </Typography>
        {component.cookedTotalG != null && (
          <Typography variant="caption" color="text.secondary">
            ≈ {formatGrams(component.cookedTotalG)} cooked
          </Typography>
        )}
      </Box>
    </Box>
    <Typography variant="caption" color="text.secondary">
      {component.note ? `${component.note} · ` : ""}
      Portion each: {perServingLine(people, component)}
    </Typography>
  </Box>
)

/** A fresh / to-taste line — shown but not part of the batch cook. */
const SideRow = ({
  component,
  people,
}: {
  component: MealPrepComponent
  people: Person[]
}) => {
  const total = formatGrams(component.rawTotalG)
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 2,
        py: 0.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {component.item}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {component.prep === "toTaste"
            ? component.note
            : `Portion each: ${perServingLine(people, component)}`}
        </Typography>
      </Box>
      {component.rawTotalG != null && (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, whiteSpace: "nowrap", color: "text.secondary" }}
        >
          {total} total
        </Typography>
      )}
    </Box>
  )
}

const SectionHeading = ({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
    {icon}
    <Typography
      variant="subtitle2"
      color="text.secondary"
      sx={{ textTransform: "uppercase", letterSpacing: 0.6 }}
    >
      {children}
    </Typography>
  </Box>
)

const SessionCard = ({
  session,
  people,
  seasoningName,
}: {
  session: MealPrepSession
  people: Person[]
  seasoningName?: string
}) => {
  const cookItems = session.components.filter((c) => c.prep === "cook")
  const sideItems = session.components.filter((c) => c.prep !== "cook")

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: 0.6 }}
              >
                {slotLabel(session.slot)} · batch cook
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {session.name}
              </Typography>
            </Box>
            <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
              <Chip size="small" label={summarizeDays(session.servedDays)} />
              <Typography variant="caption" color="text.secondary">
                {session.servings} servings
              </Typography>
            </Stack>
          </Box>

          {seasoningName && (
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              icon={<AutoAwesomeRoundedIcon />}
              label={`Season with: ${seasoningName}`}
              sx={{ alignSelf: "flex-start" }}
            />
          )}

          <Box>
            <SectionHeading
              icon={
                <LocalFireDepartmentRoundedIcon
                  sx={{ fontSize: 18, color: "primary.main" }}
                />
              }
            >
              Cook this much
            </SectionHeading>
            <Stack divider={<Box sx={{ borderBottom: "1px solid #eee" }} />}>
              {cookItems.map((component) => (
                <CookRow
                  key={component.item}
                  component={component}
                  people={people}
                />
              ))}
            </Stack>
          </Box>

          {sideItems.length > 0 && (
            <Box>
              <SectionHeading
                icon={<SpaRoundedIcon sx={{ fontSize: 18, color: "#2e7d32" }} />}
              >
                Add fresh at serving
              </SectionHeading>
              <Stack>
                {sideItems.map((component) => (
                  <SideRow
                    key={component.item}
                    component={component}
                    people={people}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {session.storageNote && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.75,
                p: 1.25,
                borderRadius: 2,
                backgroundColor: "rgba(0, 70, 134, 0.04)",
              }}
            >
              <Inventory2RoundedIcon
                sx={{ fontSize: 18, color: "text.secondary", mt: 0.2 }}
              />
              <Typography variant="caption" color="text.secondary">
                {session.storageNote}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

interface MealPrepTabProps {
  plan: MealPlanDetails
  mealPrep: MealPrepWeek[]
}

export const MealPrepTab = ({ plan, mealPrep }: MealPrepTabProps) => {
  const [weekIndex, setWeekIndex] = useState(0)

  if (mealPrep.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No batch-cook summary is available for this plan.
      </Typography>
    )
  }

  const week = mealPrep[weekIndex] ?? mealPrep[0]
  const seasoningName = (ref?: string) =>
    plan.seasoningBlends.find((blend) => blend.id === ref)?.name

  return (
    <Stack spacing={2.5}>
      {mealPrep.length > 1 && (
        <ToggleButtonGroup
          exclusive
          color="primary"
          size="small"
          value={weekIndex}
          onChange={(_event, value) => {
            if (value !== null) setWeekIndex(value)
          }}
          aria-label="Select week"
        >
          {mealPrep.map((weekOption, index) => (
            <ToggleButton key={weekOption.week} value={index}>
              Week {weekOption.week}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      <Typography variant="body2" color="text.secondary">
        {week.coverage} Weights are for both people combined — cook once, then
        portion each meal using the per-serving split.
      </Typography>

      <Stack spacing={2}>
        {week.sessions.map((session) => (
          <SessionCard
            key={`${session.slot}-${session.name}`}
            session={session}
            people={plan.people}
            seasoningName={seasoningName(session.seasoningBlendRef)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
