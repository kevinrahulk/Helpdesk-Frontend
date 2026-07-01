import { statusColors, priorityColors } from "../../theme/tokens"

// Map a ticket status string to its color config for both light & dark modes.
export function statusStyle(status, mode = "light") {
  const isLight = mode === "light"
  const map = {
    "Open": statusColors.open,
    "open": statusColors.open,
    "In Progress": statusColors.inProgress,
    "in_progress": statusColors.inProgress,
    "Waiting for User": statusColors.waiting,
    "waiting_for_user": statusColors.waiting,
    "Resolved": statusColors.resolved,
    "resolved": statusColors.resolved,
    "Closed": statusColors.closed,
    "closed": statusColors.closed,
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
    "low": priorityColors.low,
    "Medium": priorityColors.medium,
    "medium": priorityColors.medium,
    "High": priorityColors.high,
    "high": priorityColors.high,
    "Critical": priorityColors.critical,
    "critical": priorityColors.critical,
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
