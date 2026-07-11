import { Wine } from "@src/types/custom"
import { Box, Chip, Stack, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"

interface WineViewProps {
  wine: Wine
}

export const WineView = ({ wine }: WineViewProps) => {
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
    <Stack spacing={4}>
      {showImage ? (
        <Box
          sx={{
            backgroundColor: "#f5f3f0",
            borderRadius: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
          }}
        >
          <Box
            component="img"
            ref={imageRef}
            src={wine.imageUrl}
            alt={wine.name}
            onError={() => setImageFailed(true)}
            sx={{
              maxHeight: 420,
              maxWidth: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: 240,
            borderRadius: 3,
            background: "linear-gradient(135deg, #7b1f3a 0%, #3a0d1c 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
          }}
        >
          <span role="img" aria-hidden>
            🍷
          </span>
        </Box>
      )}

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {wine.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {wine.winery}
        </Typography>
      </Box>

      {wine.country && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            Country
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {wine.country}
          </Typography>
        </Box>
      )}

      {wine.grapes.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            {wine.grapes.length > 1 ? "Grapes" : "Grape"}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
            {wine.grapes.map((grape) => (
              <Chip key={grape} label={grape} />
            ))}
          </Box>
        </Box>
      )}

      {wine.notes && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            Tasting Notes
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {wine.notes}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}
