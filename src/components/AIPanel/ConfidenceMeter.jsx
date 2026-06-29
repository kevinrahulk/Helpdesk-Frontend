import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import { confidenceLevel } from "./style"

/** Visualizes an AI confidence score (0–1) with a colored bar + label. */
export default function ConfidenceMeter({ score = 0 }) {
  const pct = Math.round(score * 100)
  const level = confidenceLevel(score)

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {level.label}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: `${level.color}.main` }}>
          {pct}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={level.color}
        sx={{ height: 6, borderRadius: 3, bgcolor: "action.hover" }}
      />
    </Box>
  )
}
