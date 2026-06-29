/**
 * reportsSlice — Admin reporting & analytics
 *
 * Covers:
 *   GET /reports/summary           → fetchReportSummary
 *   GET /reports/agent-performance → fetchAgentPerformance
 *   GET /reports/sla               → fetchSLACompliance
 *   GET /reports/ticket-volume     → fetchTicketVolume
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * High-level metrics: totals, resolution time, SLA compliance, volume.
 * @param {object} params - { date_from?, date_to?, priority?, category_id? }
 */
export const fetchReportSummary = createAsyncThunk(
  "reports/fetchReportSummary",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/summary", { params })
      return data.data // ReportSummary
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch report summary.")
    }
  },
)

/**
 * Per-agent performance metrics.
 * @param {object} params - { date_from?, date_to? }
 */
export const fetchAgentPerformance = createAsyncThunk(
  "reports/fetchAgentPerformance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/agent-performance", { params })
      return data.data // AgentPerformanceRow[]
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch agent performance.")
    }
  },
)

/**
 * SLA compliance stats.
 * @param {object} params - { date_from?, date_to? }
 */
export const fetchSLACompliance = createAsyncThunk(
  "reports/fetchSLACompliance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/sla", { params })
      return data.data // SLAComplianceReport { resolved_within_sla, resolved_breached_sla, compliance_rate_pct }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch SLA compliance.")
    }
  },
)

/**
 * Ticket volume grouped by day, week, or month.
 * @param {object} params - { groupby?: "day"|"week"|"month", date_from?, date_to? }
 */
export const fetchTicketVolume = createAsyncThunk(
  "reports/fetchTicketVolume",
  async (params = { groupby: "month" }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/reports/ticket-volume", { params })
      return data.data // TicketVolumePoint[] { period, count }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch ticket volume.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  summary: null,             // ReportSummary | null
  summaryLoading: false,
  summaryError: null,

  agentPerformance: [],      // AgentPerformanceRow[]
  agentPerformanceLoading: false,
  agentPerformanceError: null,

  slaCompliance: null,       // SLAComplianceReport | null
  slaLoading: false,
  slaError: null,

  ticketVolume: [],          // TicketVolumePoint[]
  volumeLoading: false,
  volumeError: null,
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

export default reportsSlice.reducer
