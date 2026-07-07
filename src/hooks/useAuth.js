

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  login as loginThunk,
  logout as logoutThunk,
  fetchProfile,
  clearAuthError,
  clearAuthState,
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
  selectAccessToken,
} from "../slices/authSlice"

export function useAuth() {
  const dispatch = useDispatch()

  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const accessToken = useSelector(selectAccessToken)

  /**
   * Log in with email + password.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const login = useCallback(
    async (credentials) => {
      const result = await dispatch(loginThunk(credentials))
      if (loginThunk.fulfilled.match(result)) {
        return { success: true }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Log out and clear all local auth state.
   */
  const logout = useCallback(() => {
    dispatch(logoutThunk())
  }, [dispatch])

  /**
   * Refresh the current user's profile from the backend.
   */
  const refreshProfile = useCallback(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  /**
   * Manually clear any lingering error message (e.g. after displaying it).
   */
  const clearError = useCallback(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  /**
   * Hard-reset auth state (e.g. called by 401 interceptor).
   */
  const forceLogout = useCallback(() => {
    dispatch(clearAuthState())
  }, [dispatch])

  // Role helpers
  const isEmployee = role === "employee"
  const isAgent = role === "agent"
  const isAdmin = role === "admin"
  const isAgentOrAdmin = isAgent || isAdmin

  return {
    user,
    role,
    accessToken,
    isAuthenticated,
    isEmployee,
    isAgent,
    isAdmin,
    isAgentOrAdmin,
    loading,
    error,
    login,
    logout,
    refreshProfile,
    clearError,
    forceLogout,
  }
}
