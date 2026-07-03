import { alpha } from "@mui/material/styles"
import { spacing } from "../../theme/tokens"

// The AI panel uses a subtle tinted surface so AI output is visually
// distinct from user-entered data (BR-AI: label all AI output as AI-generated).
export const aiSurfaceSx = (theme) => ({
  borderRadius: 3,
  border: `1px solid ${alpha(theme.palette.secondary.main, theme.palette.mode === "light" ? 0.3 : 0.4)}`,
  background:
    theme.palette.mode === "light"
      ? alpha(theme.palette.secondary.main, 0.05)
      : alpha(theme.palette.secondary.main, 0.1),
  overflow: "hidden",
})

export const aiHeaderSx = (theme) => ({
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: spacing.panelPadding,
  py: 1.75,
  borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
})

// Matches SectionCard's "md" padding so AI panel body content sits at the
// same rhythm as other surfaces on the page.
export const aiBodySx = { p: spacing.panelPadding }

// Confidence thresholds → label/color. < 0.5 triggers a low-confidence warning.
export function confidenceLevel(score) {
  if (score >= 0.8) return { label: "High confidence", color: "success" }
  if (score >= 0.5) return { label: "Moderate confidence", color: "warning" }
  return { label: "Low confidence — please verify", color: "error" }
}
