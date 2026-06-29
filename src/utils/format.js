import { ROLES, STATUS } from "../data/mockData"

export function formatDate(iso) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

export function formatDateTime(iso) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Relative "x ago" / "in x" helper for SLA + timeline labels.
export function timeFromNow(iso) {
  if (!iso) return "—"
  const diffMs = new Date(iso).getTime() - Date.now()
  const abs = Math.abs(diffMs)
  const day = 86400000
  const hour = 3600000
  let label
  if (abs >= day) label = `${Math.round(abs / day)}d`
  else if (abs >= hour) label = `${Math.round(abs / hour)}h`
  else label = `${Math.max(1, Math.round(abs / 60000))}m`
  return diffMs >= 0 ? `in ${label}` : `${label} ago`
}

// Relative time formatted nicely (e.g., "2 hours ago", "3 days ago")
export function formatRelativeTime(iso) {
  if (!iso) return "—"
  const diffMs = Date.now() - new Date(iso).getTime()
  const abs = Math.abs(diffMs)
  const day = 86400000
  const hour = 3600000
  const minute = 60000
  
  if (abs < minute) return "just now"
  if (abs < hour) return `${Math.round(abs / minute)} minute${Math.round(abs / minute) > 1 ? "s" : ""} ago`
  if (abs < day) return `${Math.round(abs / hour)} hour${Math.round(abs / hour) > 1 ? "s" : ""} ago`
  return `${Math.round(abs / day)} day${Math.round(abs / day) > 1 ? "s" : ""} ago`
}

export function isOverdue(ticket) {
  if (!ticket.slaDueAt) return false
  const active = ![STATUS.RESOLVED, STATUS.CLOSED].includes(ticket.status)
  return active && new Date(ticket.slaDueAt).getTime() < Date.now()
}

export const roleLabels = {
  [ROLES.EMPLOYEE]: "Employee",
  [ROLES.AGENT]: "Support Agent",
  [ROLES.ADMIN]: "Administrator",
}

// Returns the tickets a given user is allowed to see (FRD role scoping).
export function scopeTickets(tickets, user) {
  if (!user) return []
  if (user.role === ROLES.ADMIN) return tickets
  if (user.role === ROLES.AGENT) return tickets.filter((t) => t.assignedTo === user.id)
  return tickets.filter((t) => t.createdBy === user.id)
}
