import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles"
import { statTones, statIconWrapSx } from "./style"

/**
 * Clickable summary statistic card used across dashboards.
 *
 * Props:
 * - label: caption text
 * - value: the headline number/string
 * - icon: icon node
 * - tone: "default" | "primary" | "success" | "warning" | "error" | "info"
 * - hint: small sub-text under the value (optional)
 * - onClick: makes the card behave like a link to a filtered list
 */
export default function StatCard({ label, value, icon, tone = "default", hint, onClick }) {
  const t = statTones[tone] || statTones.default

  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color .15s ease, transform .15s ease",
        "&:hover": onClick
          ? { borderColor: "primary.main", transform: "translateY(-2px)" }
          : undefined,
      }}
    >
      {icon && (
        <Box
          sx={{
            ...statIconWrapSx,
            color: t.color,
            bgcolor: (theme) =>
              tone === "default" ? theme.palette.action.hover : alpha(theme.palette[tone].main, 0.12),
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" sx={{ fontSize: "1.75rem", lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }} noWrap>
          {label}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Box>
    </Card>
  )
}
