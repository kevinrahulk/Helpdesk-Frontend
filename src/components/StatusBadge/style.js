import { STATUS, PRIORITY } from "../../data/mockData"
import { statusColors, priorityColors } from "../../theme/tokens"

// Map a ticket status string to its color config for both light & dark modes.
export function statusStyle(status, mode = "light") {
  const isLight = mode === "light"
  const map = {
    [STATUS.OPEN]: statusColors.open,
    [STATUS.IN_PROGRESS]: statusColors.inProgress,
    [STATUS.WAITING]: statusColors.waiting,
    [STATUS.RESOLVED]: statusColors.resolved,
    [STATUS.CLOSED]: statusColors.closed,
  }
  const c = map[status] || statusColors.closed
  return {
    color: isLight ? c.light : c.dark,
    backgroundColor: isLight ? c.bg : c.darkBg,
  }
}

export function priorityStyle(priority, mode = "light") {
  const isLight = mode === "light"
  const map = {
    [PRIORITY.LOW]: priorityColors.low,
    [PRIORITY.MEDIUM]: priorityColors.medium,
    [PRIORITY.HIGH]: priorityColors.high,
    [PRIORITY.CRITICAL]: priorityColors.critical,
  }
  const c = map[priority] || priorityColors.medium
  return { color: isLight ? c.light : c.dark }
}

export const badgeBaseSx = {
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 600,
  borderRadius: 1,
}
