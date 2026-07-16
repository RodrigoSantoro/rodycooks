import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material"
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded"
import { GroceryItem, GroceryList } from "@src/types/custom"
import { formatQuantity } from "@src/utils/mealplan"

interface GroceriesTabProps {
  planId: string
  groceryLists: GroceryList[]
}

const storageKey = (planId: string) => `mealplan-groceries:${planId}`

/** Stable key for a single grocery line so its checked state can persist. */
const itemKey = (listId: string, group: string, name: string) =>
  `${listId}::${group}::${name}`

const GroceryRow = ({
  item,
  checked,
  onToggle,
}: {
  item: GroceryItem
  checked: boolean
  onToggle: () => void
}) => {
  const quantity = formatQuantity(item.quantity, item.unit)
  return (
    <FormControlLabel
      onChange={onToggle}
      control={<Checkbox checked={checked} size="small" />}
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
                textDecoration: checked ? "line-through" : "none",
                color: checked ? "text.disabled" : "text.primary",
              }}
            >
              {item.name}
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
                color: checked ? "text.disabled" : "primary.main",
              }}
            >
              {quantity}
            </Typography>
          )}
        </Box>
      }
    />
  )
}

export const GroceriesTab = ({ planId, groceryLists }: GroceriesTabProps) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Load persisted check state on the client (SSG renders everything unchecked).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(planId))
      if (raw) setChecked(JSON.parse(raw))
    } catch {
      // Ignore malformed / unavailable storage.
    }
  }, [planId])

  const persist = (next: Record<string, boolean>) => {
    setChecked(next)
    try {
      window.localStorage.setItem(storageKey(planId), JSON.stringify(next))
    } catch {
      // Ignore storage write failures (e.g. private mode).
    }
  }

  const toggle = (key: string) => {
    persist({ ...checked, [key]: !checked[key] })
  }

  const clearList = (listId: string) => {
    const next = { ...checked }
    Object.keys(next).forEach((key) => {
      if (key.startsWith(`${listId}::`)) delete next[key]
    })
    persist(next)
  }

  return (
    <Stack spacing={1.5}>
      {groceryLists.map((list, listIndex) => {
        const groups: Array<{ heading: string; items: GroceryItem[] }> = [
          ...(list.categories ?? []).map((category) => ({
            heading: category.category,
            items: category.items,
          })),
          ...(list.optionLists ?? []).map((option) => ({
            heading: option.name,
            items: option.items,
          })),
        ]

        const allItems = groups.flatMap((group) =>
          group.items.map((item) => itemKey(list.id, group.heading, item.name))
        )
        const checkedCount = allItems.filter((key) => checked[key]).length

        return (
          <Accordion
            key={list.id}
            defaultExpanded={listIndex === 0}
            disableGutters
            sx={{
              borderRadius: 3,
              "&:before": { display: "none" },
              border: "1px solid #e6e6e6",
              boxShadow: "none",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {list.label}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${checkedCount}/${allItems.length}`}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {list.coverage}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {groups.map((group) => (
                  <Box key={group.heading}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        mb: 0.5,
                      }}
                    >
                      {group.heading}
                    </Typography>
                    <Stack>
                      {group.items.map((item) => {
                        const key = itemKey(list.id, group.heading, item.name)
                        return (
                          <GroceryRow
                            key={key}
                            item={item}
                            checked={!!checked[key]}
                            onToggle={() => toggle(key)}
                          />
                        )
                      })}
                    </Stack>
                  </Box>
                ))}
                {checkedCount > 0 && (
                  <Box>
                    <Button size="small" onClick={() => clearList(list.id)}>
                      Clear checked
                    </Button>
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Stack>
  )
}
