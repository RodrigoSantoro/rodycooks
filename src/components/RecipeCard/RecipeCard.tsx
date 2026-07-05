import { Recipe } from "@src/types/custom"
import Link from "next/link"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment"
import { useEffect, useRef, useState } from "react"
import { getCategoryStyle } from "./categoryStyle"

interface RecipeCardProps {
  recipe: Recipe
}

const InfoItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: string
}) => (
  <Stack direction="row" spacing={0.5} alignItems="center">
    {icon}
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Stack>
)

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { emoji, gradient } = getCategoryStyle(recipe.categories)
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const showImage = !!recipe.imageUrl && !imageFailed

  // The image can finish loading (or fail) before React attaches the onError
  // handler during hydration, so re-check its state once on mount.
  useEffect(() => {
    const image = imageRef.current
    if (image && image.complete && image.naturalWidth === 0) {
      setImageFailed(true)
    }
  }, [])
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
  const caloriesPerServing =
    recipe.calories && recipe.servings
      ? Math.round(recipe.calories / recipe.servings)
      : null

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`recipes/${recipe.url}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {showImage ? (
          <Box
            component="img"
            ref={imageRef}
            src={recipe.imageUrl}
            alt={recipe.name}
            onError={() => setImageFailed(true)}
            sx={{
              height: 120,
              width: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <Box
            sx={{
              height: 120,
              background: gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
            }}
          >
            <span role="img" aria-hidden>
              {emoji}
            </span>
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
            {recipe.name}
          </Typography>

          {recipe.categories?.length > 0 && (
            <Stack
              direction="row"
              spacing={0.5}
              useFlexGap
              flexWrap="wrap"
              sx={{ mb: 1.5 }}
            >
              {recipe.categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {totalTime > 0 && (
              <InfoItem
                icon={<AccessTimeIcon fontSize="small" color="action" />}
                label={`${totalTime} min`}
              />
            )}
            <InfoItem
              icon={<RestaurantIcon fontSize="small" color="action" />}
              label={`${recipe.servings} servings`}
            />
            {caloriesPerServing !== null && (
              <InfoItem
                icon={
                  <LocalFireDepartmentIcon fontSize="small" color="action" />
                }
                label={`${caloriesPerServing} cal`}
              />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
