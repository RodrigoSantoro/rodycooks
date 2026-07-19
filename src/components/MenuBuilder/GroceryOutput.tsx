import { useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material"
import { CatalogDish, MenuConfig, MenuSelection } from "@src/types/menu"
import {
  buildGroceryList,
  formatGroceryAmount,
} from "@src/utils/menuBuilder"

interface GroceryOutputProps {
  config: MenuConfig
  selection: MenuSelection
  catalog: CatalogDish[]
}

const STORAGE_KEY = "rodycooks:weekly-menu:groceries-checked:v1"

export const GroceryOutput = ({
  config,
  selection,
  catalog,
}: GroceryOutputProps) => {
  const groups = useMemo(
    () => buildGroceryList(selection, config, catalog),
    [selection, config, catalog]
  )

  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      // Ignore malformed / unavailable storage.
    }
  }, [])

  const persist = (next: Record<string, boolean>) => {
    setChecked(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Ignore write failures.
    }
  }

  const toggle = (key: string) => persist({ ...checked, [key]: !checked[key] })
  const clearChecked = () => persist({})

  const totalItems = groups.reduce((n, g) => n + g.items.length, 0)
  const checkedCount = groups.reduce(
    (n, g) => n + g.items.filter((it) => checked[`${g.category}::${it.item}`]).length,
    0
  )

  if (totalItems === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No ingredients yet — pick some meals in <strong>Build week</strong> and
        the grocery list will build itself.
      </Typography>
    )
  }

  return (
    <Stack spacing={2.5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Quantities are the scaled portions summed across everyone for the whole
          week ({checkedCount}/{totalItems} checked).
        </Typography>
        {checkedCount > 0 && (
          <Button size="small" onClick={clearChecked}>
            Clear checked
          </Button>
        )}
      </Box>

      {groups.map((group) => (
        <Box key={group.category}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 0.6,
              mb: 0.5,
            }}
          >
            {group.category}
          </Typography>
          <Stack>
            {group.items.map((item) => {
              const key = `${group.category}::${item.item}`
              const isChecked = !!checked[key]
              const quantity = formatGroceryAmount(item.amount, item.unit)
              return (
                <FormControlLabel
                  key={key}
                  onChange={() => toggle(key)}
                  control={<Checkbox checked={isChecked} size="small" />}
                  sx={{
                    alignItems: "flex-start",
                    mr: 0,
                    ".MuiFormControlLabel-label": { flexGrow: 1 },
                  }}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        py: 0.25,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            textDecoration: isChecked ? "line-through" : "none",
                            color: isChecked ? "text.disabled" : "text.primary",
                          }}
                        >
                          {item.item}
                        </Typography>
                        {item.note && (
                          <Typography variant="caption" color="text.secondary">
                            {item.note}
                          </Typography>
                        )}
                      </Box>
                      {quantity && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            color: isChecked ? "text.disabled" : "primary.main",
                          }}
                        >
                          {quantity}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              )
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}
