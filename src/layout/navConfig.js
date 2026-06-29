import { ROLES } from "../data/mockData"

// Navigation items with the roles allowed to see each one.
// Icons are passed as string keys resolved in Sidebar to keep this file plain data.
export const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: "dashboard", roles: [ROLES.EMPLOYEE, ROLES.AGENT, ROLES.ADMIN] },
  { key: "create", label: "Create Ticket", path: "/tickets/new", icon: "add", roles: [ROLES.EMPLOYEE, ROLES.ADMIN] },
  { key: "tickets", label: "Tickets", path: "/tickets", icon: "tickets", roles: [ROLES.EMPLOYEE, ROLES.AGENT, ROLES.ADMIN] },
  { key: "users", label: "User Management", path: "/users", icon: "users", roles: [ROLES.ADMIN] },
  { key: "reports", label: "Reports", path: "/reports", icon: "reports", roles: [ROLES.ADMIN] },
]

export function navItemsForRole(role) {
  return navItems.filter((item) => item.roles.includes(role))
}
