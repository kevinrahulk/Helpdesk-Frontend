import { createTheme } from "@mui/material/styles"
import { brand, radius } from "./tokens"

// Build a full MUI theme for the requested color mode.
// Light mode uses mild, professional grays typical of ticketing tools.
// Dark mode uses a calm slate palette.
export function getTheme(mode) {
  const isLight = mode === "light"

  const palette = isLight
    ? {
        mode: "light",
        primary: { main: brand[500], light: brand[300], dark: brand[600], contrastText: "#ffffff" },
        secondary: { main: "#5e4db2", contrastText: "#ffffff" },
        success: { main: "#216e4e" },
        warning: { main: "#a54800" },
        error: { main: "#c9372c" },
        info: { main: brand[500] },
        background: { default: "#f7f8fa", paper: "#ffffff" },
        text: { primary: "#172b4d", secondary: "#626f86" },
        divider: "#dfe1e6",
        action: {
          hover: "#f1f2f4",
          selected: "#e9f2ff",
        },
      }
    : {
        mode: "dark",
        primary: { main: brand[300], light: brand[200], dark: brand[500], contrastText: "#091e42" },
        secondary: { main: "#b8acf6", contrastText: "#091e42" },
        success: { main: "#7ee2b8" },
        warning: { main: "#fea362" },
        error: { main: "#fd9891" },
        info: { main: brand[300] },
        background: { default: "#0e1117", paper: "#161b22" },
        text: { primary: "#e6edf3", secondary: "#9aa5b1" },
        divider: "#2d333b",
        action: {
          hover: "#1c2128",
          selected: "#0d2847",
        },
      }

  return createTheme({
    palette,
    shape: { borderRadius: radius.md },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.015em" },
      h4: { fontWeight: 700, letterSpacing: "-0.01em", fontSize: "1.5rem" },
      h5: { fontWeight: 600, fontSize: "1.2rem" },
      h6: { fontWeight: 600, fontSize: "1rem" },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, color: palette.text.secondary },
      button: { textTransform: "none", fontWeight: 600 },
      body2: { lineHeight: 1.5 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isLight ? "#c1c7d0 transparent" : "#3a3f47 transparent",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": { width: 8, height: 8 },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: isLight ? "#c1c7d0" : "#3a3f47",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: radius.sm },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${palette.divider}`,
            boxShadow: isLight
              ? "0 1px 2px rgba(9,30,66,0.06)"
              : "0 1px 2px rgba(0,0,0,0.4)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: radius.sm },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontSize: "0.75rem", borderRadius: radius.sm },
        },
      },
    },
  })
}
