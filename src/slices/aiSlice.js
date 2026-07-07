import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * Request AI suggestions for a ticket before it's submitted.
 * Called by employees on the Create Ticket page.
 *
 * @param {object} payload - AITicketSuggestionRequest { title, description }
 * Returns AITicketSuggestionResponse {
 *   suggestion_id, suggested_category, suggested_priority,
 *   summary, first_fix, similar_tickets, confidence_score, low_confidence
 * }
 */
export const getTicketSuggestion = createAsyncThunk(
  "ai/getTicketSuggestion",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/ai/ticket-suggestion", payload)
      return data.data // AITicketSuggestionResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "AI suggestion request failed.")
    }
  },
)

/**
 * Request an AI summary panel for an existing ticket.
 * Called by agents/admins on the Ticket Detail page.
 *
 * @param {string} ticketId - UUID of the target ticket
 * Returns AITicketSummaryResponse {
 *   suggestion_id, summary, root_cause, suggested_reply,
 *   similar_tickets, confidence_score, low_confidence
 * }
 */
export const getTicketSummary = createAsyncThunk(
  "ai/getTicketSummary",
  async (ticketId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/ai/tickets/${ticketId}/summary`)
      return { ticketId, summary: data.data } // AITicketSummaryResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch AI summary.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  // Creation-time suggestion (one at a time — cleared when a new ticket form opens)
  suggestion: null,         // AITicketSuggestionResponse | null
  suggestionLoading: false,
  suggestionError: null,

  // Per-ticket summaries — keyed by ticketId
  summariesById: {},        // { [ticketId]: AITicketSummaryResponse }
  summaryLoading: false,
  summaryError: null,
}

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    /** Clear the creation-time suggestion (e.g. when leaving the Create Ticket page). */
    clearSuggestion(state) {
      state.suggestion = null
      state.suggestionError = null
    },
    clearAIErrors(state) {
      state.suggestionError = null
      state.summaryError = null
    },
  },
  extraReducers: (builder) => {
    // ── getTicketSuggestion ──────────────────────────────────────────────
    builder
      .addCase(getTicketSuggestion.pending, (state) => {
        state.suggestionLoading = true
        state.suggestionError = null
        state.suggestion = null
      })
      .addCase(getTicketSuggestion.fulfilled, (state, action) => {
        state.suggestionLoading = false
        state.suggestion = action.payload
      })
      .addCase(getTicketSuggestion.rejected, (state, action) => {
        state.suggestionLoading = false
        state.suggestionError = action.payload
      })

    // ── getTicketSummary ─────────────────────────────────────────────────
    builder
      .addCase(getTicketSummary.pending, (state) => {
        state.summaryLoading = true
        state.summaryError = null
      })
      .addCase(getTicketSummary.fulfilled, (state, action) => {
        state.summaryLoading = false
        const { ticketId, summary } = action.payload
        state.summariesById[ticketId] = summary
      })
      .addCase(getTicketSummary.rejected, (state, action) => {
        state.summaryLoading = false
        state.summaryError = action.payload
      })
  },
})

export const { clearSuggestion, clearAIErrors } = aiSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectAISuggestion = (state) => state.ai.suggestion
export const selectAISuggestionLoading = (state) => state.ai.suggestionLoading
export const selectAISuggestionError = (state) => state.ai.suggestionError

export const selectAITicketSummary = (ticketId) => (state) =>
  state.ai.summariesById[ticketId] ?? null
export const selectAISummaryLoading = (state) => state.ai.summaryLoading
export const selectAISummaryError = (state) => state.ai.summaryError

export default aiSlice.reducer
