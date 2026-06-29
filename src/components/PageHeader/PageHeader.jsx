import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { pageHeaderSx } from "./style"

/** Standard page title row with an optional subtitle and actions slot. */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <Box sx={pageHeaderSx}>
      <Box>
        <Typography variant="h4">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>{actions}</Box>}
    </Box>
  )
}
