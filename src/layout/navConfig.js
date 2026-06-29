// Navigation items with the roles allowed to see each one.
// Icons are passed as string keys resolved in Sidebar to keep this file plain data.
export const navItems = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: "dashboard", roles: ["employee", "agent", "admin"] },
  { key: "create", label: "Create Ticket", path: "/tickets/new", icon: "add", roles: ["employee", "admin"] },
  { key: "tickets", label: "Tickets", path: "/tickets", icon: "tickets", roles: ["employee", "agent", "admin"] },
  { key: "users", label: "User Management", path: "/users", icon: "users", roles: ["admin"] },
  { key: "reports", label: "Reports", path: "/reports", icon: "reports", roles: ["admin"] },
]

export function navItemsForRole(role) {
  return navItems.filter((item) => item.roles.includes(role))
}
