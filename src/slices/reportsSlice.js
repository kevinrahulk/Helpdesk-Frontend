

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

export const fetchReportSummary = createAsyncThunk(
  "reports/fetchReportSummary",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/summary", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch report summary.")
    }
  },
)

export const fetchAgentPerformance = createAsyncThunk(
  "reports/fetchAgentPerformance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/agent-performance", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch agent performance.")
    }
  },
)

export const fetchSLACompliance = createAsyncThunk(
  "reports/fetchSLACompliance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/sla", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch SLA compliance.")
    }
  },
)

export const fetchTicketVolume = createAsyncThunk(
  "reports/fetchTicketVolume",
  async (params = { groupby: "month" }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/ticket-volume", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch ticket volume.")
    }
  },
)

export const fetchCategoryDistribution = createAsyncThunk(
  "reports/fetchCategoryDistribution",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/category-distribution", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch category distribution.")
    }
  },
)

export const fetchPriorityDistribution = createAsyncThunk(
  "reports/fetchPriorityDistribution",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/priority-distribution", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch priority distribution.")
    }
  },
)

export const fetchEmployeeActivity = createAsyncThunk(
  "reports/fetchEmployeeActivity",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/employee-activity", { params })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch employee activity.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  summary: null,
  summaryLoading: false,
  summaryError: null,

  agentPerformance: [],
  agentPerformanceLoading: false,
  agentPerformanceError: null,

  slaCompliance: null,
  slaLoading: false,
  slaError: null,

  ticketVolume: [],
  volumeLoading: false,
  volumeError: null,

  categoryDistribution: [],
  categoryLoading: false,
  categoryError: null,

  priorityDistribution: [],
  priorityLoading: false,
  priorityError: null,

  employeeActivity: null,
  employeeLoading: false,
  employeeError: null,
}

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportErrors(state) {
      state.summaryError = null
      state.agentPerformanceError = null
      state.slaError = null
      state.volumeError = null
      state.categoryError = null
      state.priorityError = null
      state.employeeError = null
    },
  },
  extraReducers: (builder) => {
    // ── fetchReportSummary ───────────────────────────────────────────────
    builder
      .addCase(fetchReportSummary.pending, (state) => {
        state.summaryLoading = true
        state.summaryError = null
      })
      .addCase(fetchReportSummary.fulfilled, (state, action) => {
        state.summaryLoading = false
        state.summary = action.payload
      })
      .addCase(fetchReportSummary.rejected, (state, action) => {
        state.summaryLoading = false
        state.summaryError = action.payload
      })

    // ── fetchAgentPerformance ────────────────────────────────────────────
    builder
      .addCase(fetchAgentPerformance.pending, (state) => {
        state.agentPerformanceLoading = true
        state.agentPerformanceError = null
      })
      .addCase(fetchAgentPerformance.fulfilled, (state, action) => {
        state.agentPerformanceLoading = false
        state.agentPerformance = action.payload
      })
      .addCase(fetchAgentPerformance.rejected, (state, action) => {
        state.agentPerformanceLoading = false
        state.agentPerformanceError = action.payload
      })

    // ── fetchSLACompliance ───────────────────────────────────────────────
    builder
      .addCase(fetchSLACompliance.pending, (state) => {
        state.slaLoading = true
        state.slaError = null
      })
      .addCase(fetchSLACompliance.fulfilled, (state, action) => {
        state.slaLoading = false
        state.slaCompliance = action.payload
      })
      .addCase(fetchSLACompliance.rejected, (state, action) => {
        state.slaLoading = false
        state.slaError = action.payload
      })

    // ── fetchTicketVolume ────────────────────────────────────────────────
    builder
      .addCase(fetchTicketVolume.pending, (state) => {
        state.volumeLoading = true
        state.volumeError = null
      })
      .addCase(fetchTicketVolume.fulfilled, (state, action) => {
        state.volumeLoading = false
        state.ticketVolume = action.payload
      })
      .addCase(fetchTicketVolume.rejected, (state, action) => {
        state.volumeLoading = false
        state.volumeError = action.payload
      })

    // ── fetchCategoryDistribution ────────────────────────────────────────
    builder
      .addCase(fetchCategoryDistribution.pending, (state) => {
        state.categoryLoading = true
        state.categoryError = null
      })
      .addCase(fetchCategoryDistribution.fulfilled, (state, action) => {
        state.categoryLoading = false
        state.categoryDistribution = action.payload
      })
      .addCase(fetchCategoryDistribution.rejected, (state, action) => {
        state.categoryLoading = false
        state.categoryError = action.payload
      })

    // ── fetchPriorityDistribution ────────────────────────────────────────
    builder
      .addCase(fetchPriorityDistribution.pending, (state) => {
        state.priorityLoading = true
        state.priorityError = null
      })
      .addCase(fetchPriorityDistribution.fulfilled, (state, action) => {
        state.priorityLoading = false
        state.priorityDistribution = action.payload
      })
      .addCase(fetchPriorityDistribution.rejected, (state, action) => {
        state.priorityLoading = false
        state.priorityError = action.payload
      })

    // ── fetchEmployeeActivity ────────────────────────────────────────────
    builder
      .addCase(fetchEmployeeActivity.pending, (state) => {
        state.employeeLoading = true
        state.employeeError = null
      })
      .addCase(fetchEmployeeActivity.fulfilled, (state, action) => {
        state.employeeLoading = false
        state.employeeActivity = action.payload
      })
      .addCase(fetchEmployeeActivity.rejected, (state, action) => {
        state.employeeLoading = false
        state.employeeError = action.payload
      })
  },
})

export const { clearReportErrors } = reportsSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectReportSummary = (state) => state.reports.summary
export const selectReportSummaryLoading = (state) => state.reports.summaryLoading
export const selectReportSummaryError = (state) => state.reports.summaryError

export const selectAgentPerformance = (state) => state.reports.agentPerformance
export const selectAgentPerformanceLoading = (state) => state.reports.agentPerformanceLoading

export const selectSLACompliance = (state) => state.reports.slaCompliance
export const selectSLALoading = (state) => state.reports.slaLoading

export const selectTicketVolume = (state) => state.reports.ticketVolume
export const selectVolumeLoading = (state) => state.reports.volumeLoading

export const selectCategoryDistribution = (state) => state.reports.categoryDistribution
export const selectCategoryLoading = (state) => state.reports.categoryLoading

export const selectPriorityDistribution = (state) => state.reports.priorityDistribution
export const selectPriorityLoading = (state) => state.reports.priorityLoading

export const selectEmployeeActivity = (state) => state.reports.employeeActivity
export const selectEmployeeLoading = (state) => state.reports.employeeLoading

export default reportsSlice.reducer
