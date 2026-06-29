/**
 * authSlice — Authentication state
 *
 * Handles:
 *   POST /auth/login      → login thunk
 *   POST /auth/logout     → logout thunk
 *   GET  /auth/profile    → fetchProfile thunk
 *
 * Persists { access_token, user } to localStorage under "helpdesk-auth"
 * so the session survives page refreshes.
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

const STORAGE_KEY = "helpdesk-auth"

// ── Helpers ───────────────────────────────────────────────────────────────

function loadPersistedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

// ── Initial state ─────────────────────────────────────────────────────────

const persisted = loadPersistedAuth()

const initialState = {
  user: persisted?.user ?? null,
  accessToken: persisted?.access_token ?? null,
  isAuthenticated: Boolean(persisted?.access_token),
  loading: false,
  error: null,
}

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * Backend: POST /auth/login → LoginResponse { success, message, data: { access_token, user } }
 */
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/auth/login", { email, password })
      return data.data // { access_token, user }
    } catch (err) {
      const message = err.response?.data?.detail ?? "Login failed. Please try again."
      return rejectWithValue(message)
    }
  },
)

/**
 * Logout — informs the backend (stateless JWT, but good practice) then clears local state.
 * Backend: POST /auth/logout
 */
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await apiClient.post("/auth/logout")
  } catch {
    // Swallow errors — we always clear local state regardless
  }
})

/**
 * Fetch authenticated user's full profile.
 * Backend: GET /auth/profile → APIResponse<UserResponse>
 */
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/auth/profile")
      return data.data // UserResponse
    } catch (err) {
      const message = err.response?.data?.detail ?? "Failed to fetch profile."
      return rejectWithValue(message)
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Manually clear auth (e.g. called by 401 interceptor). */
    clearAuthState(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      clearAuth()
    },
    /** Clear any lingering error message. */
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // ── login ────────────────────────────────────────────────────────────
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        const { access_token, user } = action.payload
        state.loading = false
        state.accessToken = access_token
        state.user = user
        state.isAuthenticated = true
        persistAuth({ access_token, user })
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ── logout ───────────────────────────────────────────────────────────
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      clearAuth()
    })

    // ── fetchProfile ─────────────────────────────────────────────────────
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        // Update persisted user data
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const stored = JSON.parse(raw)
          persistAuth({ ...stored, user: action.payload })
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAuthState, clearAuthError } = authSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUserRole = (state) => state.auth.user?.role ?? null
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectAccessToken = (state) => state.auth.accessToken

export default authSlice.reducer
