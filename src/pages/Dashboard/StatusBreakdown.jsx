import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import { useColorMode } from "../../theme/ColorModeContext"
import { statusStyle } from "../../components/StatusBadge/style"
import { breakdownRowSx } from "./style"

const STATUSES = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting for User", value: "waiting_for_user" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
]
/** Simple status distribution list with proportion bars. */
export default function StatusBreakdown({ tickets, statuses = STATUSES }) {
  const { mode } = useColorMode()
  const total = tickets.length || 1

  return (
    <Box>
      {statuses.map((status) => {
        const count = tickets.filter((t) => t.status === status.value).length
        const pct = Math.round((count / total) * 100)
        const s = statusStyle(status.value, mode)
        return (
          <Box key={status.value} sx={breakdownRowSx}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {status.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {count}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "action.hover",
                  "& .MuiLinearProgress-bar": { backgroundColor: s.color, borderRadius: 3 },
                }}
              />
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
