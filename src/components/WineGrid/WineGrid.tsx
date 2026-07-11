import { Wine } from "@src/types/custom"
import { useMemo, useState } from "react"
import {
  Box,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { WineCard } from "@src/components/WineCard/WineCard"

interface WineGridProps {
  wines: Wine[]
}

export const WineGrid = ({ wines }: WineGridProps) => {
  const [search, setSearch] = useState("")

  const filteredWines = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return wines
    return wines.filter(
      (wine) =>
        wine.name.toLowerCase().includes(query) ||
        wine.winery.toLowerCase().includes(query) ||
        wine.country.toLowerCase().includes(query) ||
        wine.grapes.some((grape) => grape.toLowerCase().includes(query))
    )
  }, [wines, search])

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Wines
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {wines.length} favorite wines
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search wines…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {filteredWines.length > 0 ? (
        <Grid container spacing={3}>
          {filteredWines.map((wine) => (
            <Grid item key={wine.id} xs={12} sm={6} md={4}>
              <WineCard wine={wine} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ py: 6, textAlign: "center" }}
        >
          No wines match your search.
        </Typography>
      )}
    </Stack>
  )
}
