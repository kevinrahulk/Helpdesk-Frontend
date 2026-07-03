// Centralized design tokens shared by the light & dark MUI themes.
// Keeping these in one place keeps the palette consistent and easy to tune.

export const brand = {
  // Primary professional blue (Atlassian/Jira-like)
  50: "#e9f2ff",
  100: "#cce0ff",
  200: "#85b8ff",
  300: "#579dff",
  400: "#388bff",
  500: "#0c66e4",
  600: "#0055cc",
  700: "#09326c",
}

// Semantic status colors used by tickets / badges.
export const statusColors = {
  open: { light: "#0c66e4", bg: "#e9f2ff", dark: "#579dff", darkBg: "#082145" },
  inProgress: { light: "#a54800", bg: "#fff3e6", dark: "#fea362", darkBg: "#3d2208" },
  waiting: { light: "#5e4db2", bg: "#f1ecff", dark: "#b8acf6", darkBg: "#221c4d" },
  resolved: { light: "#216e4e", bg: "#dcfff1", dark: "#7ee2b8", darkBg: "#0d2e22" },
  closed: { light: "#626f86", bg: "#f1f2f4", dark: "#9aa5b1", darkBg: "#22272b" },
}

export const priorityColors = {
  low: { light: "#216e4e", dark: "#7ee2b8" },
  medium: { light: "#a54800", dark: "#fea362" },
  high: { light: "#c9372c", dark: "#fd9891" },
  critical: { light: "#ae2a19", dark: "#ff6b5e" },
}

// Spacing & radius scale (rem-based) reused by component style files.
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
}

// Shared vertical rhythm between stacked surfaces (AIPanel / SectionCard /
// Card). Keeping this in one place stops each page from picking its own
// ad-hoc mb/mt value alongside a panel's own internal padding.
export const spacing = {
  panelGap: 3,      // gap between stacked panels/cards on a page
  panelPadding: 2.5, // internal padding for AIPanel / SectionCard "md"
}
