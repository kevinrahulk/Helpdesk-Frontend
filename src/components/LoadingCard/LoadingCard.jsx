import Skeleton from "@mui/material/Skeleton"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Box from "@mui/material/Box"

/**
 * Loading skeleton card for displaying while content loads.
 * Props:
 * - lines: number of text lines to show (default 3)
 * - height: card height in pixels (default auto)
 */
export default function LoadingCard({ lines = 3, height, ...rest }) {
  const skeletonLines = Array.from({ length: lines })

  return (
    <Card sx={{ height, ...rest }}>
      <CardContent>
        <Skeleton variant="rectangular" width="60%" height={20} sx={{ mb: 1.5 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {skeletonLines.map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={16}
              width={i === skeletonLines.length - 1 ? "70%" : "100%"}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
