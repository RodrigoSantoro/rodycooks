import {
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { GrocerySection } from "@src/types/custom"
import { useState } from "react"

interface GroceryListProps {
  section: GrocerySection
}

export const GroceryList = ({ section }: GroceryListProps) => {
  const [checked, setChecked] = useState(new Map<string, boolean>())

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
