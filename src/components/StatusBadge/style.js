import { statusColors, priorityColors } from "../../theme/tokens"

// Map a ticket status string to its color config for both light & dark modes.
export function statusStyle(status, mode = "light") {
  const isLight = mode === "light"
  const map = {
    "Open": statusColors.open,
    "In Progress": statusColors.inProgress,
    "Waiting for User": statusColors.waiting,
    "Resolved": statusColors.resolved,
    "Closed": statusColors.closed,
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
    "Low": priorityColors.low,
    "Medium": priorityColors.medium,
    "High": priorityColors.high,
    "Critical": priorityColors.critical,
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
