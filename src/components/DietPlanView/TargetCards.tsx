import { Box, Paper, Stack, Typography } from "@mui/material"
import { MacroTarget } from "@src/types/custom"
import { MAN_COLOR, WOMAN_COLOR } from "./colors"

interface TargetCardsProps {
  people: MacroTarget[]
}

const Line = ({ label, value }: { label: string; value: string }) => (
  <Typography variant="body2" color="text.secondary">
    {label} <b style={{ color: "#243024" }}>{value}</b>
  </Typography>
)

export const TargetCards = ({ people }: TargetCardsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      {people.map((person, index) => (
        <Paper
          key={person.label}
          variant="outlined"
          sx={{ p: 2, flex: "1 1 220px" }}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ color: index === 0 ? MAN_COLOR : WOMAN_COLOR }}
            >
              {person.symbol} {person.label}
            </Typography>
            <Line label="Calories" value={person.calories} />
            <Line label="Protein" value={person.protein} />
            <Line label="Fat" value={person.fat} />
            <Line label="Carbs" value={person.carbs} />
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}
