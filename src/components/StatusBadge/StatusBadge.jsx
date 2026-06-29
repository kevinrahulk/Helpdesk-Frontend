import Chip from "@mui/material/Chip"
import Box from "@mui/material/Box"
import {
  FiberManualRecord,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
  Remove,
  KeyboardArrowDown,
} from "@mui/icons-material"
import { useColorMode } from "../../theme/ColorModeContext"
import { PRIORITY } from "../../data/mockData"
import { statusStyle, priorityStyle, badgeBaseSx } from "./style"

/** Colored chip representing a ticket status. */
export function StatusBadge({ status, size = "small" }) {
  const { mode } = useColorMode()
  const s = statusStyle(status, mode)
  return (
    <Chip
      size={size}
      label={status}
      icon={<FiberManualRecord sx={{ fontSize: "0.65rem !important", color: `${s.color} !important` }} />}
      sx={{ ...badgeBaseSx, color: s.color, backgroundColor: s.backgroundColor, pl: 0.5 }}
    />
  )
}

const priorityIcon = {
  [PRIORITY.LOW]: KeyboardArrowDown,
  [PRIORITY.MEDIUM]: Remove,
  [PRIORITY.HIGH]: KeyboardArrowUp,
  [PRIORITY.CRITICAL]: KeyboardDoubleArrowUp,
}

/** Priority indicator with an arrow icon + label (Jira-style). */
export function PriorityBadge({ priority, showLabel = true }) {
  const { mode } = useColorMode()
  const p = priorityStyle(priority, mode)
  const Icon = priorityIcon[priority] || Remove
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: p.color, fontWeight: 600, fontSize: "0.8125rem" }}>
      <Icon sx={{ fontSize: "1.1rem" }} />
      {showLabel && priority}
    </Box>
  )
}
