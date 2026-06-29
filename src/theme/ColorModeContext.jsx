import { createContext, useContext, useMemo, useState, useCallback } from "react"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { getTheme } from "./theme"

const ColorModeContext = createContext({ mode: "light", toggleColorMode: () => {} })

export function useColorMode() {
  return useContext(ColorModeContext)
}

const STORAGE_KEY = "helpdesk-color-mode"

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light"
    return window.localStorage.getItem(STORAGE_KEY) || "light"
  })

  const toggleColorMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light"
      window.localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const theme = useMemo(() => getTheme(mode), [mode])
  const value = useMemo(() => ({ mode, toggleColorMode }), [mode, toggleColorMode])

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
