import { Recipe } from "@src/types/custom"
import { useMemo, useState } from "react"
import {
  Box,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { RecipeCard } from "@src/components/RecipeCard/RecipeCard"

interface RecipeGridProps {
  recipes: Recipe[]
}

export const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Unique categories, de-duplicated case-insensitively (keeping first casing).
  const categories = useMemo(() => {
    const byKey = new Map<string, string>()
    recipes.forEach((recipe) => {
      recipe.categories?.forEach((category) => {
        const key = category.trim().toLowerCase()
        if (key && !byKey.has(key)) byKey.set(key, category.trim())
      })
    })
    return Array.from(byKey.values()).sort((a, b) => a.localeCompare(b))
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return recipes.filter((recipe) => {
      const matchesSearch =
        !query || recipe.name.toLowerCase().includes(query)
      const matchesCategory =
        !activeCategory ||
        recipe.categories?.some(
          (category) => category.trim().toLowerCase() === activeCategory
        )
      return matchesSearch && matchesCategory
    })
  }, [recipes, search, activeCategory])

  const toggleCategory = (category: string) => {
    const key = category.toLowerCase()
    setActiveCategory((current) => (current === key ? null : key))
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Recipes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {recipes.length} recipes to explore
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search recipes…"
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

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          label="All"
          color={activeCategory === null ? "primary" : "default"}
          variant={activeCategory === null ? "filled" : "outlined"}
          onClick={() => setActiveCategory(null)}
        />
        {categories.map((category) => {
          const selected = activeCategory === category.toLowerCase()
          return (
            <Chip
              key={category}
              label={category}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              onClick={() => toggleCategory(category)}
            />
          )
        })}
      </Stack>

      {filteredRecipes.length > 0 ? (
        <Grid container spacing={3}>
          {filteredRecipes.map((recipe) => (
            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
              <RecipeCard recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ py: 6, textAlign: "center" }}
        >
          No recipes match your search.
        </Typography>
      )}
    </Stack>
  )
}
