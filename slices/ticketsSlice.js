/**
 * ticketsSlice — Ticket CRUD + lifecycle management
 *
 * Covers all /tickets endpoints:
 *   POST   /tickets                        → createTicket
 *   GET    /tickets                        → fetchTickets  (paginated, filtered)
 *   GET    /tickets/:id                    → fetchTicketById
 *   PATCH  /tickets/:id                    → updateTicket
 *   PATCH  /tickets/:id/status             → updateTicketStatus
 *   PATCH  /tickets/:id/assign             → assignTicket
 *   GET    /tickets/:id/logs               → fetchTicketLogs
 *   POST   /tickets/:id/comments           → addComment
 *   GET    /tickets/:id/comments           → fetchComments
 *   PATCH  /tickets/:id/comments/:cid      → updateComment
 *   POST   /tickets/:id/attachments        → addAttachment
 *   GET    /tickets/:id/attachments        → fetchAttachments
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * Fetch paginated, role-filtered list of tickets.
 * @param {object} params - { page, page_size, status, priority, category_id, search }
 */
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/tickets", { params })
      return data.data // TicketListResponse { items, total, page, page_size }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch tickets.")
    }
  },
)

/**
 * Fetch a single ticket with full nested data.
 * @param {string} ticketId - UUID
 */
export const fetchTicketById = createAsyncThunk(
  "tickets/fetchTicketById",
  async (ticketId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/tickets/${ticketId}`)
      return data.data // TicketResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Ticket not found.")
    }
  },
)

/**
 * Create a new ticket (Employee / Admin).
 * @param {object} payload - TicketCreate { title, description, category_id?, priority?, ai_suggestion_id? }
 */
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/tickets", payload)
      return data.data // TicketResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to create ticket.")
    }
  },
)

/**
 * Update ticket fields (Agent / Admin).
 * @param {object} arg - { ticketId, payload: TicketUpdate }
 */
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ ticketId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/tickets/${ticketId}`, payload)
      return data.data // TicketResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update ticket.")
    }
  },
)

/**
 * Transition ticket status (Agent / Admin).
 * @param {object} arg - { ticketId, payload: TicketStatusUpdate { status, reason? } }
 */
export const updateTicketStatus = createAsyncThunk(
  "tickets/updateTicketStatus",
  async ({ ticketId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/tickets/${ticketId}/status`, payload)
      return data.data // TicketResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update status.")
    }
  },
)

/**
 * Assign a ticket to an agent (Admin only).
 * @param {object} arg - { ticketId, agentId }
 */
export const assignTicket = createAsyncThunk(
  "tickets/assignTicket",
  async ({ ticketId, agentId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/tickets/${ticketId}/assign`, {
        agent_id: agentId,
      })
      return data.data // TicketResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to assign ticket.")
    }
  },
)

/**
 * Fetch the status-change audit log for a ticket.
 * @param {string} ticketId - UUID
 */
export const fetchTicketLogs = createAsyncThunk(
  "tickets/fetchTicketLogs",
  async (ticketId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/tickets/${ticketId}/logs`)
      return { ticketId, logs: data.data } // TicketStatusLogResponse[]
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch logs.")
    }
  },
)

/**
 * Add a comment to a ticket (Agent / Admin).
 * @param {object} arg - { ticketId, payload: TicketCommentCreate { body, is_internal } }
 */
export const addComment = createAsyncThunk(
  "tickets/addComment",
  async ({ ticketId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/tickets/${ticketId}/comments`, payload)
      return { ticketId, comment: data.data } // TicketCommentResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to add comment.")
    }
  },
)

/**
 * Fetch all comments for a ticket.
 * @param {string} ticketId - UUID
 */
export const fetchComments = createAsyncThunk(
  "tickets/fetchComments",
  async (ticketId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/tickets/${ticketId}/comments`)
      return { ticketId, comments: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch comments.")
    }
  },
)

/**
 * Update (edit) a comment.
 * @param {object} arg - { ticketId, commentId, payload: TicketCommentUpdate { body?, is_internal? } }
 */
export const updateComment = createAsyncThunk(
  "tickets/updateComment",
  async ({ ticketId, commentId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(
        `/tickets/${ticketId}/comments/${commentId}`,
        payload,
      )
      return { ticketId, comment: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update comment.")
    }
  },
)

/**
 * Register attachment metadata after S3 upload.
 * @param {object} arg - { ticketId, payload: TicketAttachmentCreate }
 */
export const addAttachment = createAsyncThunk(
  "tickets/addAttachment",
  async ({ ticketId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(`/tickets/${ticketId}/attachments`, payload)
      return { ticketId, attachment: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to register attachment.")
    }
  },
)

/**
 * Fetch all attachments for a ticket.
 * @param {string} ticketId - UUID
 */
export const fetchAttachments = createAsyncThunk(
  "tickets/fetchAttachments",
  async (ticketId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/tickets/${ticketId}/attachments`)
      return { ticketId, attachments: data.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch attachments.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  // List view
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  listLoading: false,
  listError: null,

  // Detail view — keyed by ticketId
  detailsById: {},       // { [id]: TicketResponse }
  detailLoading: false,
  detailError: null,

  // Status logs — keyed by ticketId
  logsById: {},          // { [id]: TicketStatusLogResponse[] }

  // Per-ticket comments (standalone fetch, not via ticket detail)
  commentsById: {},      // { [id]: TicketCommentResponse[] }

  // Per-ticket attachments (standalone fetch)
  attachmentsById: {},   // { [id]: TicketAttachmentResponse[] }

  // Mutation state
  mutating: false,
  mutateError: null,
}

/** Replace or insert a ticket in the list items array. */
function upsertListItem(items, ticket) {
  const idx = items.findIndex((t) => t.id === ticket.id)
  if (idx >= 0) {
    items[idx] = ticket
  } else {
    items.unshift(ticket)
  }
}

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    clearTicketErrors(state) {
      state.listError = null
      state.detailError = null
      state.mutateError = null
    },
    clearTicketDetail(state, action) {
      const id = action.payload
      delete state.detailsById[id]
    },
  },
  extraReducers: (builder) => {
    // ── fetchTickets ─────────────────────────────────────────────────────
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        const { items, total, page, page_size } = action.payload
        state.listLoading = false
        state.items = items
        state.total = total
        state.page = page
        state.pageSize = page_size
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload
      })

    // ── fetchTicketById ──────────────────────────────────────────────────
    builder
      .addCase(fetchTicketById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchTicketById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.detailsById[action.payload.id] = action.payload
      })
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

    // ── createTicket ─────────────────────────────────────────────────────
    builder
      .addCase(createTicket.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.mutating = false
        const ticket = action.payload
        state.detailsById[ticket.id] = ticket
        upsertListItem(state.items, ticket)
        state.total += 1
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── updateTicket ─────────────────────────────────────────────────────
    builder
      .addCase(updateTicket.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.mutating = false
        const ticket = action.payload
        state.detailsById[ticket.id] = ticket
        upsertListItem(state.items, ticket)
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── updateTicketStatus ────────────────────────────────────────────────
    builder
      .addCase(updateTicketStatus.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(updateTicketStatus.fulfilled, (state, action) => {
        state.mutating = false
        const ticket = action.payload
        state.detailsById[ticket.id] = ticket
        upsertListItem(state.items, ticket)
      })
      .addCase(updateTicketStatus.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── assignTicket ─────────────────────────────────────────────────────
    builder
      .addCase(assignTicket.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.mutating = false
        const ticket = action.payload
        state.detailsById[ticket.id] = ticket
        upsertListItem(state.items, ticket)
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── fetchTicketLogs ──────────────────────────────────────────────────
    builder.addCase(fetchTicketLogs.fulfilled, (state, action) => {
      const { ticketId, logs } = action.payload
      state.logsById[ticketId] = logs
    })

    // ── addComment ───────────────────────────────────────────────────────
    builder.addCase(addComment.fulfilled, (state, action) => {
      const { ticketId, comment } = action.payload
      if (!state.commentsById[ticketId]) state.commentsById[ticketId] = []
      state.commentsById[ticketId].push(comment)
      // Also update nested comments in detail if loaded
      if (state.detailsById[ticketId]) {
        state.detailsById[ticketId].comments.push(comment)
      }
    })

    // ── fetchComments ────────────────────────────────────────────────────
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      const { ticketId, comments } = action.payload
      state.commentsById[ticketId] = comments
    })

    // ── updateComment ────────────────────────────────────────────────────
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const { ticketId, comment } = action.payload
      if (state.commentsById[ticketId]) {
        const idx = state.commentsById[ticketId].findIndex((c) => c.id === comment.id)
        if (idx >= 0) state.commentsById[ticketId][idx] = comment
      }
      if (state.detailsById[ticketId]) {
        const idx = state.detailsById[ticketId].comments.findIndex((c) => c.id === comment.id)
        if (idx >= 0) state.detailsById[ticketId].comments[idx] = comment
      }
    })

    // ── addAttachment ────────────────────────────────────────────────────
    builder.addCase(addAttachment.fulfilled, (state, action) => {
      const { ticketId, attachment } = action.payload
      if (!state.attachmentsById[ticketId]) state.attachmentsById[ticketId] = []
      state.attachmentsById[ticketId].push(attachment)
    })

    // ── fetchAttachments ─────────────────────────────────────────────────
    builder.addCase(fetchAttachments.fulfilled, (state, action) => {
      const { ticketId, attachments } = action.payload
      state.attachmentsById[ticketId] = attachments
    })
  },
})

export const { clearTicketErrors, clearTicketDetail } = ticketsSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectTicketItems = (state) => state.tickets.items
export const selectTicketTotal = (state) => state.tickets.total
export const selectTicketPage = (state) => state.tickets.page
export const selectTicketPageSize = (state) => state.tickets.pageSize
export const selectTicketListLoading = (state) => state.tickets.listLoading
export const selectTicketListError = (state) => state.tickets.listError

export const selectTicketDetail = (id) => (state) => state.tickets.detailsById[id] ?? null
export const selectTicketDetailLoading = (state) => state.tickets.detailLoading
export const selectTicketDetailError = (state) => state.tickets.detailError

export const selectTicketLogs = (id) => (state) => state.tickets.logsById[id] ?? []
export const selectTicketComments = (id) => (state) => state.tickets.commentsById[id] ?? []
export const selectTicketAttachments = (id) => (state) => state.tickets.attachmentsById[id] ?? []

export const selectTicketMutating = (state) => state.tickets.mutating
export const selectTicketMutateError = (state) => state.tickets.mutateError

export default ticketsSlice.reducer
