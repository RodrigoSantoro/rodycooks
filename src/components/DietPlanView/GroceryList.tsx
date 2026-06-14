import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { GrocerySection } from "@src/types/custom"
import { useEffect, useState } from "react"

interface GroceryListProps {
  section: GrocerySection
  month: string
}

export const GroceryList = ({ section, month }: GroceryListProps) => {
  const storageKey = `rodycooks:grocery-checked:${month}:${section.title}`
  const [checked, setChecked] = useState(new Map<string, boolean>())
  const [hydrated, setHydrated] = useState(false)

  // Load any previously saved selection once on mount. Done in an effect
  // (rather than lazy initial state) so server and first client render match.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        setChecked(new Map(Object.entries(JSON.parse(raw) as Record<string, boolean>)))
      }
    } catch {
      // Ignore unavailable or malformed storage.
    }
    setHydrated(true)
  }, [storageKey])

  // Persist whenever the selection changes, but not before the load above runs,
  // otherwise we'd overwrite the saved selection with the empty initial map.
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(checked)))
    } catch {
      // Ignore storage write failures (e.g. private mode / quota).
    }
  }, [checked, hydrated, storageKey])

  const toggle = (name: string) => {
    const next = new Map(checked)
    next.set(name, !checked.get(name))
    setChecked(next)
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h6">{section.title}</Typography>
      {section.note && (
        <Typography variant="body2" color="text.secondary">
          {section.note}
        </Typography>
      )}
      <Paper variant="outlined">
        <Stack divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
          {section.items.map((item) => {
            const isChecked = !!checked.get(item.name)
            return (
              <Box
                key={item.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pr: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggle(item.name)}
                    />
                  }
                  label={item.name}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      textDecoration: isChecked ? "line-through" : "none",
                      color: isChecked ? "text.secondary" : "text.primary",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {item.amount}
                </Typography>
              </Box>
            )
          })}
        </Stack>
      </Paper>
    </Stack>
  )
}
