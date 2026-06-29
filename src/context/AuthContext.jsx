import { createContext, useContext, useState, useMemo, useCallback } from "react"
import { demoAccounts, getUserById, ROLES } from "../data/mockData"

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

const STORAGE_KEY = "helpdesk-auth-user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const persist = useCallback((u) => {
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else window.localStorage.removeItem(STORAGE_KEY)
  }, [])

  // Mock login: validate against demo accounts (any password >= 8 chars works).
  const login = useCallback(
    ({ email, password }) => {
      const account = demoAccounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
      if (!account) {
        return { success: false, message: "Invalid email or password" }
      }
      if (!password || password.length < 8) {
        return { success: false, message: "Invalid email or password" }
      }
      const profile = getUserById(account.userId)
      if (profile && !profile.isActive) {
        return { success: false, message: "Account is disabled. Please contact admin." }
      }
      const nextUser = { ...profile }
      setUser(nextUser)
      persist(nextUser)
      return { success: true, user: nextUser }
    },
    [persist],
  )

  const logout = useCallback(() => {
    setUser(null)
    persist(null)
  }, [persist])

  // Quick role switcher for demo / preview purposes.
  const switchRole = useCallback(
    (role) => {
      const account = demoAccounts.find((a) => a.role === role)
      if (!account) return
      const profile = getUserById(account.userId)
      const nextUser = { ...profile }
      setUser(nextUser)
      persist(nextUser)
    },
    [persist],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      role: user?.role || null,
      login,
      logout,
      switchRole,
      ROLES,
    }),
    [user, login, logout, switchRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
