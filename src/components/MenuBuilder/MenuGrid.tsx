import { useMemo } from "react"
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded"
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded"
import BackspaceRoundedIcon from "@mui/icons-material/BackspaceRounded"
import {
  CatalogDish,
  MealSlot,
  MEAL_SLOTS,
  MenuConfig,
  MenuSelection,
  WeekDay,
  WEEK_DAYS,
} from "@src/types/menu"
import { dayLabel, slotLabel } from "@src/utils/menuBuilder"

interface MenuGridProps {
  config: MenuConfig
  selection: MenuSelection
  catalog: CatalogDish[]
  onSetDish: (day: WeekDay, slot: MealSlot, dishId: string | null) => void
  onRepeatNextDay: (day: WeekDay, slot: MealSlot, dishId: string | null) => void
  onRepeatAcrossWeek: (slot: MealSlot, dishId: string | null) => void
  onClearSlot: (slot: MealSlot) => void
}

/**
 * A single day's dish picker for one slot, with two repeat actions: copy the
 * choice to the following day only, or repeat it across the whole week.
 */
const DayCell = ({
  day,
  slot,
  dishId,
  options,
  isLastDay,
  onSetDish,
  onRepeatNextDay,
  onRepeatWeek,
}: {
  day: WeekDay
  slot: MealSlot
  dishId: string | null
  options: CatalogDish[]
  isLastDay: boolean
  onSetDish: (dishId: string | null) => void
  onRepeatNextDay: () => void
  onRepeatWeek: () => void
}) => {
  const value = options.find((dish) => dish.id === dishId) ?? null
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Autocomplete
        options={options}
        value={value}
        onChange={(_event, newValue) => onSetDish(newValue?.id ?? null)}
        getOptionLabel={(dish) => dish.name}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        size="small"
        fullWidth
        // minWidth:0 lets the field shrink inside the flex row so a long dish
        // name truncates instead of widening the cell.
        sx={{ minWidth: 0 }}
        renderInput={(params) => (
          <TextField {...params} label={dayLabel(day)} placeholder="Search…" />
        )}
      />
      {!isLastDay && (
        <Tooltip
          title={`Copy ${dayLabel(day)}'s ${slotLabel(slot)} to the next day`}
        >
          <span>
            <IconButton
              size="small"
              onClick={onRepeatNextDay}
              disabled={!dishId}
              aria-label={`Copy ${dayLabel(day)} ${slotLabel(slot)} to the next day`}
            >
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title={`Repeat ${dayLabel(day)}'s ${slotLabel(slot)} all week`}>
        <span>
          <IconButton
            size="small"
            onClick={onRepeatWeek}
            disabled={!dishId}
            aria-label={`Repeat ${dayLabel(day)} ${slotLabel(slot)} across the week`}
          >
            <RepeatRoundedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}

const SlotSection = ({
  slot,
  config,
  selection,
  catalog,
  onSetDish,
  onRepeatNextDay,
  onRepeatAcrossWeek,
  onClearSlot,
}: {
  slot: MealSlot
} & MenuGridProps) => {
  const options = useMemo(
    () => catalog.filter((dish) => dish.slots.includes(slot)),
    [catalog, slot]
  )

  const filledCount = WEEK_DAYS.filter(
    (day) => selection[day]?.[slot]
  ).length

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <RestaurantRoundedIcon color="primary" fontSize="small" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {slotLabel(slot)}
          </Typography>
          <Chip size="small" label={`${filledCount}/7 days`} />
          <Button
            size="small"
            color="inherit"
            startIcon={<BackspaceRoundedIcon />}
            onClick={() => onClearSlot(slot)}
            disabled={filledCount === 0}
            sx={{ ml: "auto", color: "text.secondary" }}
          >
            Clear
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            // minmax(0, 1fr) keeps the columns equal and lets a long dish name
            // truncate instead of widening its track (auto min-size would grow).
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {WEEK_DAYS.map((day, index) => (
            <DayCell
              key={day}
              day={day}
              slot={slot}
              dishId={selection[day]?.[slot] ?? null}
              options={options}
              isLastDay={index === WEEK_DAYS.length - 1}
              onSetDish={(dishId) => onSetDish(day, slot, dishId)}
              onRepeatNextDay={() =>
                onRepeatNextDay(day, slot, selection[day]?.[slot] ?? null)
              }
              onRepeatWeek={() =>
                onRepeatAcrossWeek(slot, selection[day]?.[slot] ?? null)
              }
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export const MenuGrid = (props: MenuGridProps) => {
  const { config } = props
  // Render slots in canonical order (breakfast → snack2) regardless of the
  // order they were toggled on / persisted in.
  const activeSlots = MEAL_SLOTS.filter((slot) =>
    config.activeSlots.includes(slot)
  )

  if (activeSlots.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No meals are active. Turn some on in Setup.
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Pick a dish for each day. Use the{" "}
        <ArrowForwardRoundedIcon
          fontSize="inherit"
          sx={{ verticalAlign: "middle" }}
        />{" "}
        button to copy a day&apos;s choice to the next day, or the{" "}
        <RepeatRoundedIcon fontSize="inherit" sx={{ verticalAlign: "middle" }} />{" "}
        button to repeat it across the whole week, then tweak individual days.
      </Typography>
      {activeSlots.map((slot) => (
        <SlotSection key={slot} slot={slot} {...props} />
      ))}
    </Stack>
  )
}
