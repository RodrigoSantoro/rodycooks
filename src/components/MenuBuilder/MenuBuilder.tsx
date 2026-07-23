import { useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded"
import { useWeeklyMenu } from "@src/hooks/useWeeklyMenu"
import { SetupPanel } from "./SetupPanel"
import { MenuGrid } from "./MenuGrid"
import { WeeklyMenuSummary } from "./WeeklyMenuSummary"
import { GroceryOutput } from "./GroceryOutput"
import { MealPrepOutput } from "./MealPrepOutput"

export const MenuBuilder = () => {
  const menu = useWeeklyMenu()
  const [tab, setTab] = useState(0)

  if (menu.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Weekly Menu Builder
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Set your household, pick dishes for the week, and get a
            portion-scaled menu and grocery list. Everything is cholesterol
            friendly — no added sugar, low saturated fat.
          </Typography>
        </Box>
        <Button
          startIcon={<RestartAltRoundedIcon />}
          onClick={menu.resetAll}
          color="inherit"
          size="small"
        >
          Reset
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_e, value) => setTab(value)}
          aria-label="Menu builder steps"
          variant="scrollable"
          allowScrollButtonsMobile
        >
          <Tab label="1 · Setup" />
          <Tab label="2 · Build week" />
          <Tab label="3 · Menu" />
          <Tab label="4 · Groceries" />
          <Tab label="5 · Meal prep" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={tab !== 0}>
        {tab === 0 && (
          <SetupPanel
            config={menu.config}
            onAddPerson={menu.addPerson}
            onRemovePerson={menu.removePerson}
            onUpdatePerson={menu.updatePerson}
            onToggleSlot={menu.toggleSlot}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 1}>
        {tab === 1 && (
          <MenuGrid
            config={menu.config}
            selection={menu.selection}
            catalog={menu.catalog}
            onSetDish={menu.setDish}
            onRepeatNextDay={menu.repeatNextDay}
            onRepeatAcrossWeek={menu.repeatAcrossWeek}
            onClearSlot={menu.clearSlot}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 2}>
        {tab === 2 && (
          <WeeklyMenuSummary
            config={menu.config}
            selection={menu.selection}
            catalog={menu.catalog}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 3}>
        {tab === 3 && (
          <GroceryOutput
            config={menu.config}
            selection={menu.selection}
            catalog={menu.catalog}
          />
        )}
      </Box>
      <Box role="tabpanel" hidden={tab !== 4}>
        {tab === 4 && (
          <MealPrepOutput
            config={menu.config}
            selection={menu.selection}
            catalog={menu.catalog}
          />
        )}
      </Box>
    </Stack>
  )
}
