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
  const dueAt = ticket?.sla_due_at ?? ticket?.slaDueAt
  if (!dueAt) return false
  const status = ticket?.status ?? ""
  const active = !["Resolved", "Closed"].includes(status)
  return active && new Date(dueAt).getTime() < Date.now()
}

export const roleLabels = {
  employee: "Employee",
  agent: "Support Agent",
  admin: "Administrator",
}
