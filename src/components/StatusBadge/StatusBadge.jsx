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
import { statusStyle, priorityStyle, badgeBaseSx } from "./style"

const STATUS_LABELS = {
  open: "Open",
  in_progress: "In Progress",
  waiting_for_user: "Waiting for User",
  resolved: "Resolved",
  closed: "Closed",
}

/** Colored chip representing a ticket status. */
export function StatusBadge({ status, size = "small" }) {
  const { mode } = useColorMode()
  const s = statusStyle(status, mode)
  const label = STATUS_LABELS[status] ?? status
  return (
    <Chip
      size={size}
      label={label}
      icon={<FiberManualRecord sx={{ fontSize: "0.65rem !important", color: `${s.color} !important` }} />}
      sx={{ ...badgeBaseSx, color: s.color, backgroundColor: s.backgroundColor, pl: 0.5 }}
    />
  )
}

const priorityIcon = {
  low: KeyboardArrowDown,
  medium: Remove,
  high: KeyboardArrowUp,
  critical: KeyboardDoubleArrowUp,
  // Keep Title Case as fallback for any legacy data
  "Low": KeyboardArrowDown,
  "Medium": Remove,
  "High": KeyboardArrowUp,
  "Critical": KeyboardDoubleArrowUp,
}

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

/** Priority indicator with an arrow icon + label (Jira-style). */
export function PriorityBadge({ priority, showLabel = true }) {
  const { mode } = useColorMode()
  const p = priorityStyle(priority, mode)
  const Icon = priorityIcon[priority] || Remove
  const label = PRIORITY_LABELS[priority] ?? priority
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: p.color, fontWeight: 600, fontSize: "0.8125rem" }}>
      <Icon sx={{ fontSize: "1.1rem" }} />
      {showLabel && label}
    </Box>
  )
}
