import { Wine } from "@src/types/custom"
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
import { useEffect, useRef, useState } from "react"

interface WineCardProps {
  wine: Wine
}

export const WineCard = ({ wine }: WineCardProps) => {
  const [imageFailed, setImageFailed] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const showImage = !!wine.imageUrl && !imageFailed

  // The image can finish loading (or fail) before React attaches the onError
  // handler during hydration, so re-check its state once on mount.
  useEffect(() => {
    const image = imageRef.current
    if (image && image.complete && image.naturalWidth === 0) {
      setImageFailed(true)
    }
  }, [])

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={`/wines/${wine.id}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {showImage ? (
          <Box
            sx={{
              height: 200,
              width: "100%",
              backgroundColor: "#f5f3f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1.5,
            }}
          >
            <Box
              component="img"
              ref={imageRef}
              src={wine.imageUrl}
              alt={wine.name}
              onError={() => setImageFailed(true)}
              sx={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              height: 200,
              background: "linear-gradient(135deg, #7b1f3a 0%, #3a0d1c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
            }}
          >
            <span role="img" aria-hidden>
              🍷
            </span>
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {wine.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {wine.country ? `${wine.winery} · ${wine.country}` : wine.winery}
              </Typography>
            </Box>
            {wine.grapes.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {wine.grapes.map((grape) => (
                  <Chip key={grape} label={grape} size="small" />
                ))}
              </Box>
            )}
            {wine.notes && (
              <Typography variant="body2" color="text.secondary">
                {wine.notes}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
