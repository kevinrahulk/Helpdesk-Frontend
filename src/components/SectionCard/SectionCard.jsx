import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { cardPadding, cardHeaderSx } from "./style"

/**
 * Reusable surface/panel with an optional title row and action slot.
 *
 * Props:
 * - title: heading text (optional)
 * - icon: leading icon node (optional)
 * - action: node rendered on the right of the header (optional)
 * - padding: "sm" | "md" | "lg"
 */
export default function SectionCard({ title, icon, action, padding = "md", children, sx, ...rest }) {
  return (
    <Card sx={{ p: cardPadding[padding] ?? cardPadding.md, height: "100%", ...sx }} {...rest}>
      {(title || action) && (
        <Box sx={cardHeaderSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {icon}
            {title && (
              <Typography variant="h6" sx={{ fontSize: "0.95rem" }}>
                {title}
              </Typography>
            )}
          </Box>
          {action}
        </Box>
      )}
      {children}
    </Card>
  )
}
