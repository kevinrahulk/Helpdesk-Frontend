// Static mock data for the AI Helpdesk frontend.
// No backend is wired yet — these objects drive the entire UI.

export const ROLES = {
  EMPLOYEE: "employee",
  AGENT: "agent",
  ADMIN: "admin",
}

export const STATUS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING: "Waiting for User",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
}

export const PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
}

export const CATEGORIES = [
  "Network/VPN",
  "Hardware",
  "Software",
  "Access/Permissions",
  "Email",
  "Account",
  "Other",
]

export const users = [
  { id: "u1", name: "John Carter", email: "john@company.com", role: ROLES.EMPLOYEE, isActive: true, avatar: "" },
  { id: "u2", name: "Maya Patel", email: "maya@company.com", role: ROLES.EMPLOYEE, isActive: true, avatar: "" },
  { id: "u3", name: "Liam Nguyen", email: "liam@company.com", role: ROLES.EMPLOYEE, isActive: false, avatar: "" },
  { id: "a1", name: "Sofia Rossi", email: "sofia@company.com", role: ROLES.AGENT, isActive: true, avatar: "" },
  { id: "a2", name: "David Kim", email: "david@company.com", role: ROLES.AGENT, isActive: true, avatar: "" },
  { id: "a3", name: "Aisha Khan", email: "aisha@company.com", role: ROLES.AGENT, isActive: true, avatar: "" },
  { id: "ad1", name: "Elena Petrov", email: "admin@company.com", role: ROLES.ADMIN, isActive: true, avatar: "" },
]

// Demo accounts shown on the login screen — map straight to a role.
export const demoAccounts = [
  { label: "Employee", email: "john@company.com", role: ROLES.EMPLOYEE, userId: "u1" },
  { label: "Support Agent", email: "sofia@company.com", role: ROLES.AGENT, userId: "a1" },
  { label: "Admin", email: "admin@company.com", role: ROLES.ADMIN, userId: "ad1" },
]

export const agents = users.filter((u) => u.role === ROLES.AGENT)

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}
function daysAhead(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const tickets = [
  {
    id: "TKT-1024",
    title: "Unable to connect to corporate VPN",
    description:
      "VPN keeps disconnecting a few seconds after a successful login. Happens on both office Wi-Fi and home network. Reinstalling the client did not help.",
    category: "Network/VPN",
    priority: PRIORITY.MEDIUM,
    status: STATUS.IN_PROGRESS,
    createdBy: "u1",
    assignedTo: "a1",
    createdAt: daysAgo(2),
    slaDueAt: daysAhead(1),
    attachments: [{ name: "vpn-error-log.txt", size: "12 KB" }],
    ai: {
      summary: "VPN authentication succeeds but the tunnel drops within seconds, suggesting an MTU or token-renewal issue.",
      rootCause: "Likely an MTU mismatch on the tunnel interface or an expiring session token after handshake.",
      suggestedCategory: "Network/VPN",
      suggestedPriority: PRIORITY.MEDIUM,
      firstFix: ["Restart the VPN client", "Verify corporate credentials", "Lower the tunnel MTU to 1400", "Reconnect to the company network"],
      suggestedReply:
        "Hi John, thanks for the details. Please try lowering your VPN client MTU to 1400 and reconnect. If it still drops, capture a fresh client log so we can inspect the handshake.",
      similarTickets: [
        { ticket_no: "TKT-0875", title: "VPN login failed after update" },
        { ticket_no: "TKT-0912", title: "VPN drops every 30 seconds" },
      ],
      confidence: 0.93,
    },
  },
  {
    id: "TKT-1023",
    title: "Laptop will not power on after Windows update",
    description:
      "After last night's update the laptop shows a black screen with no boot. Power LED blinks twice then stops.",
    category: "Hardware",
    priority: PRIORITY.HIGH,
    status: STATUS.OPEN,
    createdBy: "u2",
    assignedTo: null,
    createdAt: daysAgo(1),
    slaDueAt: daysAhead(0),
    attachments: [],
    ai: {
      summary: "Device fails to POST after an OS update, indicated by a two-blink power LED error code.",
      rootCause: "Two-blink code typically maps to a memory/CMOS fault possibly triggered by a firmware update.",
      suggestedCategory: "Hardware",
      suggestedPriority: PRIORITY.HIGH,
      firstFix: ["Drain residual power (hold power 30s)", "Reseat RAM modules", "Clear CMOS", "Boot to recovery"],
      suggestedReply:
        "Hi Maya, this looks like a POST failure. Please hold the power button for 30 seconds to drain power, then try booting. If it persists, we will arrange a hardware swap.",
      similarTickets: [{ ticket_no: "TKT-0640", title: "No boot after BIOS update" }],
      confidence: 0.78,
    },
  },
  {
    id: "TKT-1022",
    title: "Request access to Finance shared drive",
    description: "Need read/write access to the Q3 Finance shared folder for the upcoming audit.",
    category: "Access/Permissions",
    priority: PRIORITY.LOW,
    status: STATUS.WAITING,
    createdBy: "u1",
    assignedTo: "a2",
    createdAt: daysAgo(4),
    slaDueAt: daysAhead(2),
    attachments: [],
    ai: {
      summary: "Standard access request to a Finance shared drive pending manager approval.",
      rootCause: "Access not provisioned; requires approver sign-off before group membership change.",
      suggestedCategory: "Access/Permissions",
      suggestedPriority: PRIORITY.LOW,
      firstFix: ["Confirm manager approval", "Add user to Finance-RW AD group", "Verify access"],
      suggestedReply: "Hi John, we have requested manager approval for the Finance drive. We'll grant access as soon as it's confirmed.",
      similarTickets: [{ ticket_no: "TKT-0588", title: "Shared drive access for audit" }],
      confidence: 0.95,
    },
  },
  {
    id: "TKT-1021",
    title: "Outlook not syncing emails on mobile",
    description: "Emails stopped syncing on the iPhone Outlook app since yesterday. Desktop works fine.",
    category: "Email",
    priority: PRIORITY.MEDIUM,
    status: STATUS.RESOLVED,
    createdBy: "u2",
    assignedTo: "a1",
    createdAt: daysAgo(6),
    slaDueAt: daysAgo(1),
    attachments: [],
    ai: {
      summary: "Mobile Outlook stopped syncing while desktop is unaffected, pointing to a mobile profile/token issue.",
      rootCause: "Stale OAuth token on the mobile account profile.",
      suggestedCategory: "Email",
      suggestedPriority: PRIORITY.MEDIUM,
      firstFix: ["Remove and re-add the account", "Clear app cache", "Verify modern auth enabled"],
      suggestedReply: "Hi Maya, please remove and re-add your account in the mobile Outlook app to refresh the sign-in token.",
      similarTickets: [{ ticket_no: "TKT-0701", title: "Mobile mail not syncing" }],
      confidence: 0.88,
    },
  },
  {
    id: "TKT-1020",
    title: "Password reset for HR portal",
    description: "Locked out of the HR self-service portal after multiple failed attempts.",
    category: "Account",
    priority: PRIORITY.LOW,
    status: STATUS.CLOSED,
    createdBy: "u1",
    assignedTo: "a3",
    createdAt: daysAgo(9),
    slaDueAt: daysAgo(7),
    attachments: [],
    ai: {
      summary: "Account lockout on the HR portal due to repeated failed sign-in attempts.",
      rootCause: "Lockout policy threshold exceeded.",
      suggestedCategory: "Account",
      suggestedPriority: PRIORITY.LOW,
      firstFix: ["Verify identity", "Unlock account", "Trigger password reset"],
      suggestedReply: "Hi John, your HR portal account has been unlocked and a reset link sent to your email.",
      similarTickets: [{ ticket_no: "TKT-0510", title: "HR portal lockout" }],
      confidence: 0.97,
    },
  },
  {
    id: "TKT-1019",
    title: "Microsoft Teams crashing on launch",
    description: "Teams desktop crashes immediately on launch after the latest company image update.",
    category: "Software",
    priority: PRIORITY.HIGH,
    status: STATUS.IN_PROGRESS,
    createdBy: "u2",
    assignedTo: "a2",
    createdAt: daysAgo(3),
    slaDueAt: daysAhead(0),
    attachments: [{ name: "crash-dump.dmp", size: "1.2 MB" }],
    ai: {
      summary: "Teams crashes on startup following an image update, likely a corrupted local cache.",
      rootCause: "Corrupted Teams cache or incompatible add-in after the image rollout.",
      suggestedCategory: "Software",
      suggestedPriority: PRIORITY.HIGH,
      firstFix: ["Clear Teams cache folder", "Reinstall Teams", "Disable conflicting add-ins"],
      suggestedReply: "Hi Maya, please clear your Teams cache folder and relaunch. We're also checking the new image for add-in conflicts.",
      similarTickets: [{ ticket_no: "TKT-0844", title: "Teams won't open after update" }],
      confidence: 0.71,
    },
  },
  {
    id: "TKT-1018",
    title: "New monitor not detected via docking station",
    description: "Second external monitor is not detected when connected through the docking station.",
    category: "Hardware",
    priority: PRIORITY.MEDIUM,
    status: STATUS.OPEN,
    createdBy: "u1",
    assignedTo: null,
    createdAt: daysAgo(1),
    slaDueAt: daysAhead(2),
    attachments: [],
    ai: {
      summary: "External monitor undetected through dock, likely a driver or firmware mismatch on the docking station.",
      rootCause: "Outdated dock firmware or display driver.",
      suggestedCategory: "Hardware",
      suggestedPriority: PRIORITY.MEDIUM,
      firstFix: ["Update dock firmware", "Update GPU driver", "Try a different display cable"],
      suggestedReply: "Hi John, please update your docking station firmware and graphics driver, then reconnect the monitor.",
      similarTickets: [{ ticket_no: "TKT-0777", title: "Dock not detecting monitor" }],
      confidence: 0.82,
    },
  },
  {
    id: "TKT-1017",
    title: "VPN client install fails with error 1603",
    description: "Cannot install the VPN client; the installer fails near the end with error code 1603.",
    category: "Network/VPN",
    priority: PRIORITY.CRITICAL,
    status: STATUS.OPEN,
    createdBy: "u2",
    assignedTo: null,
    createdAt: daysAgo(0),
    slaDueAt: daysAgo(0),
    attachments: [],
    ai: {
      summary: "VPN installer terminates with MSI error 1603, a generic fatal install failure.",
      rootCause: "Leftover registry keys from a prior install or insufficient permissions.",
      suggestedCategory: "Network/VPN",
      suggestedPriority: PRIORITY.CRITICAL,
      firstFix: ["Run installer as administrator", "Remove leftover registry keys", "Clear temp and retry"],
      suggestedReply: "Hi Maya, please run the installer as administrator. If it still fails, we'll remotely clear the leftover install keys.",
      similarTickets: [{ ticket_no: "TKT-0623", title: "Error 1603 installing client" }],
      confidence: 0.46,
    },
  },
]

export const comments = {
  "TKT-1024": [
    { id: "c1", author: "u1", body: "It started right after the client auto-updated yesterday.", isInternal: false, createdAt: daysAgo(2) },
    { id: "c2", author: "a1", body: "Thanks John, taking a look now. Can you share a fresh client log?", isInternal: false, createdAt: daysAgo(1) },
    { id: "c3", author: "a1", body: "Internal: checking MTU settings on the gateway for this subnet.", isInternal: true, createdAt: daysAgo(1) },
  ],
  "TKT-1019": [
    { id: "c4", author: "u2", body: "Happens every single time, no error message.", isInternal: false, createdAt: daysAgo(3) },
    { id: "c5", author: "a2", body: "Internal: reproduced on the new image build 22H2-04.", isInternal: true, createdAt: daysAgo(2) },
  ],
}

export const statusLogs = {
  "TKT-1024": [
    { id: "s1", from: null, to: STATUS.OPEN, by: "u1", at: daysAgo(2) },
    { id: "s2", from: STATUS.OPEN, to: STATUS.IN_PROGRESS, by: "a1", at: daysAgo(1) },
  ],
  "TKT-1019": [
    { id: "s3", from: null, to: STATUS.OPEN, by: "u2", at: daysAgo(3) },
    { id: "s4", from: STATUS.OPEN, to: STATUS.IN_PROGRESS, by: "a2", at: daysAgo(2) },
  ],
}

export function getUserById(id) {
  return users.find((u) => u.id === id) || null
}
