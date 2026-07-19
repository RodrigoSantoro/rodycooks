import {
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
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import PersonRoundedIcon from "@mui/icons-material/PersonRounded"
import { MealSlot, MenuConfig, MenuPerson, MEAL_SLOTS } from "@src/types/menu"
import { slotLabel } from "@src/utils/menuBuilder"

interface SetupPanelProps {
  config: MenuConfig
  onAddPerson: () => void
  onRemovePerson: (personId: string) => void
  onUpdatePerson: (personId: string, patch: Partial<MenuPerson>) => void
  onToggleSlot: (slot: MealSlot) => void
}

/** Clamps a numeric text input to a non-negative integer (0 when blank). */
const parseNumber = (value: string): number => {
  const n = parseInt(value, 10)
  if (Number.isNaN(n) || n < 0) return 0
  return n
}

const PersonCard = ({
  person,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: {
  person: MenuPerson
  index: number
  canRemove: boolean
  onUpdate: (patch: Partial<MenuPerson>) => void
  onRemove: () => void
}) => (
  <Card variant="outlined" sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonRoundedIcon color="primary" />
            <Typography variant="subtitle2" color="text.secondary">
              Person {index + 1}
            </Typography>
          </Box>
          <Tooltip title={canRemove ? "Remove person" : "At least one person"}>
            <span>
              <IconButton
                size="small"
                onClick={onRemove}
                disabled={!canRemove}
                aria-label={`Remove ${person.label}`}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <TextField
          label="Name"
          size="small"
          value={person.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          fullWidth
        />
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            label="Calories / day"
            size="small"
            type="number"
            value={person.calorieTarget}
            onChange={(e) =>
              onUpdate({ calorieTarget: parseNumber(e.target.value) })
            }
            slotProps={{ htmlInput: { min: 0, step: 50 } }}
            fullWidth
          />
          <TextField
            label="Protein g / day"
            size="small"
            type="number"
            value={person.proteinTarget}
            onChange={(e) =>
              onUpdate({ proteinTarget: parseNumber(e.target.value) })
            }
            slotProps={{ htmlInput: { min: 0, step: 5 } }}
            fullWidth
          />
        </Box>
      </Stack>
    </CardContent>
  </Card>
)

export const SetupPanel = ({
  config,
  onAddPerson,
  onRemovePerson,
  onUpdatePerson,
  onToggleSlot,
}: SetupPanelProps) => {
  return (
    <Stack spacing={4}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Who&apos;s eating?
          </Typography>
          <Button
            startIcon={<AddRoundedIcon />}
            onClick={onAddPerson}
            variant="outlined"
            size="small"
          >
            Add person
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set each person&apos;s daily calorie and protein targets. Portions are
          scaled per person to hit their calorie target.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {config.people.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              index={index}
              canRemove={config.people.length > 1}
              onUpdate={(patch) => onUpdatePerson(person.id, patch)}
              onRemove={() => onRemovePerson(person.id)}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Which meals?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Turn off any meals you skip (e.g. no breakfast, one snack). Only active
          meals appear in the week builder.
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {MEAL_SLOTS.map((slot) => {
            const active = config.activeSlots.includes(slot)
            return (
              <Chip
                key={slot}
                label={slotLabel(slot)}
                onClick={() => onToggleSlot(slot)}
                color={active ? "primary" : "default"}
                variant={active ? "filled" : "outlined"}
                sx={{ fontWeight: 600 }}
              />
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}
