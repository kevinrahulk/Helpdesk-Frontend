

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/dashboard")
      return data.data // EmployeeDashboard | AgentDashboard | AdminDashboard
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch dashboard.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  data: null,   // EmployeeDashboard | AgentDashboard | AdminDashboard | null
  loading: false,
  error: null,
  lastFetched: null,  // ISO timestamp — used for cache-busting in the hook
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard(state) {
      state.data = null
      state.error = null
      state.lastFetched = null
    },
    clearDashboardError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.lastFetched = new Date().toISOString()
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearDashboard, clearDashboardError } = dashboardSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectDashboardData = (state) => state.dashboard.data
export const selectDashboardLoading = (state) => state.dashboard.loading
export const selectDashboardError = (state) => state.dashboard.error
export const selectDashboardLastFetched = (state) => state.dashboard.lastFetched

// Convenience selectors for each role-specific field
export const selectRecentTickets = (state) =>
  state.dashboard.data?.recent_tickets ?? state.dashboard.data?.recently_assigned ?? []

export const selectAgentWorkload = (state) => state.dashboard.data?.agent_workload ?? []

export default dashboardSlice.reducer
