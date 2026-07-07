

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchTickets,
  fetchTicketById,
  createTicket as createTicketThunk,
  updateTicket as updateTicketThunk,
  updateTicketStatus,
  assignTicket as assignTicketThunk,
  fetchTicketLogs,
  addComment as addCommentThunk,
  fetchComments,
  updateComment as updateCommentThunk,
  addAttachment as addAttachmentThunk,
  fetchAttachments,
  clearTicketErrors,
  clearTicketDetail,
  selectTicketItems,
  selectTicketTotal,
  selectTicketPage,
  selectTicketPageSize,
  selectTicketListLoading,
  selectTicketListError,
  selectTicketDetail,
  selectTicketDetailLoading,
  selectTicketDetailError,
  selectTicketLogs,
  selectTicketComments,
  selectTicketAttachments,
  selectTicketMutating,
  selectTicketMutateError,
} from "../slices/ticketsSlice"

// ── useTickets (list view) ─────────────────────────────────────────────────

/**
 * Hook for the ticket list page.
 *
 * @returns {{
 *   tickets: TicketSummary[],
 *   total: number,
 *   page: number,
 *   pageSize: number,
 *   loading: boolean,
 *   error: string | null,
 *   mutating: boolean,
 *   mutateError: string | null,
 *   fetch: (params?) => void,
 *   createTicket: (payload) => Promise<{ success, ticket?, error? }>,
 *   clearErrors: () => void,
 * }}
 */
export function useTickets() {
  const dispatch = useDispatch()

  const tickets = useSelector(selectTicketItems)
  const total = useSelector(selectTicketTotal)
  const page = useSelector(selectTicketPage)
  const pageSize = useSelector(selectTicketPageSize)
  const loading = useSelector(selectTicketListLoading)
  const error = useSelector(selectTicketListError)
  const mutating = useSelector(selectTicketMutating)
  const mutateError = useSelector(selectTicketMutateError)

  /**
   * Fetch ticket list.
   * @param {object} params - { page?, page_size?, status?, priority?, category_id?, search? }
   */
  const fetch = useCallback(
    (params = {}) => {
      dispatch(fetchTickets(params))
    },
    [dispatch],
  )

  /**
   * Create a new ticket.
   * @param {object} payload - TicketCreate
   * @returns {Promise<{ success: boolean, ticket?: TicketResponse, error?: string }>}
   */
  const createTicket = useCallback(
    async (payload) => {
      const result = await dispatch(createTicketThunk(payload))
      if (createTicketThunk.fulfilled.match(result)) {
        return { success: true, ticket: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const clearErrors = useCallback(() => dispatch(clearTicketErrors()), [dispatch])

  return {
    tickets,
    total,
    page,
    pageSize,
    loading,
    error,
    mutating,
    mutateError,
    fetch,
    createTicket,
    clearErrors,
  }
}

// ── useTicketDetail (detail view) ──────────────────────────────────────────

/**
 * Hook for the ticket detail page.
 *
 * @param {string} ticketId - UUID of the ticket to manage
 * @returns full ticket data + all mutation methods
 */
export function useTicketDetail(ticketId) {
  const dispatch = useDispatch()

  const ticket = useSelector(selectTicketDetail(ticketId))
  const loading = useSelector(selectTicketDetailLoading)
  const error = useSelector(selectTicketDetailError)
  const logs = useSelector(selectTicketLogs(ticketId))
  const comments = useSelector(selectTicketComments(ticketId))
  const attachments = useSelector(selectTicketAttachments(ticketId))
  const mutating = useSelector(selectTicketMutating)
  const mutateError = useSelector(selectTicketMutateError)

  /** Load the full ticket detail. */
  const fetchDetail = useCallback(() => {
    if (ticketId) dispatch(fetchTicketById(ticketId))
  }, [dispatch, ticketId])

  /** Load the status audit log. */
  const fetchLogs = useCallback(() => {
    if (ticketId) dispatch(fetchTicketLogs(ticketId))
  }, [dispatch, ticketId])

  /** Load comments (standalone — detail already includes them). */
  const fetchTicketComments = useCallback(() => {
    if (ticketId) dispatch(fetchComments(ticketId))
  }, [dispatch, ticketId])

  /** Load attachments (standalone). */
  const fetchTicketAttachments = useCallback(() => {
    if (ticketId) dispatch(fetchAttachments(ticketId))
  }, [dispatch, ticketId])

  /**
   * Update ticket fields (agent/admin).
   * @param {object} payload - TicketUpdate
   * @returns {Promise<{ success, ticket?, error? }>}
   */
  const updateTicket = useCallback(
    async (payload) => {
      const result = await dispatch(updateTicketThunk({ ticketId, payload }))
      if (updateTicketThunk.fulfilled.match(result)) {
        return { success: true, ticket: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /**
   * Transition the ticket to a new status.
   * @param {{ status: string, reason?: string }} payload
   * @returns {Promise<{ success, ticket?, error? }>}
   */
  const updateStatus = useCallback(
    async (payload) => {
      const result = await dispatch(updateTicketStatus({ ticketId, payload }))
      if (updateTicketStatus.fulfilled.match(result)) {
        return { success: true, ticket: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /**
   * Assign ticket to an agent (admin only).
   * @param {string} agentId - UUID
   * @returns {Promise<{ success, ticket?, error? }>}
   */
  const assign = useCallback(
    async (agentId) => {
      const result = await dispatch(assignTicketThunk({ ticketId, agentId }))
      if (assignTicketThunk.fulfilled.match(result)) {
        return { success: true, ticket: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /**
   * Add a comment (agent/admin).
   * @param {{ body: string, is_internal: boolean }} payload
   * @returns {Promise<{ success, comment?, error? }>}
   */
  const addComment = useCallback(
    async (payload) => {
      const result = await dispatch(addCommentThunk({ ticketId, payload }))
      if (addCommentThunk.fulfilled.match(result)) {
        return { success: true, comment: result.payload.comment }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /**
   * Edit an existing comment.
   * @param {string} commentId - UUID
   * @param {{ body?: string, is_internal?: boolean }} payload
   * @returns {Promise<{ success, comment?, error? }>}
   */
  const updateComment = useCallback(
    async (commentId, payload) => {
      const result = await dispatch(updateCommentThunk({ ticketId, commentId, payload }))
      if (updateCommentThunk.fulfilled.match(result)) {
        return { success: true, comment: result.payload.comment }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /**
   * Register attachment metadata after S3 upload.
   * @param {object} payload - TicketAttachmentCreate
   * @returns {Promise<{ success, attachment?, error? }>}
   */
  const addAttachment = useCallback(
    async (payload) => {
      const result = await dispatch(addAttachmentThunk({ ticketId, payload }))
      if (addAttachmentThunk.fulfilled.match(result)) {
        return { success: true, attachment: result.payload.attachment }
      }
      return { success: false, error: result.payload }
    },
    [dispatch, ticketId],
  )

  /** Remove the detail from cache (e.g. on unmount). */
  const clearDetail = useCallback(() => {
    dispatch(clearTicketDetail(ticketId))
  }, [dispatch, ticketId])

  const clearErrors = useCallback(() => dispatch(clearTicketErrors()), [dispatch])

  return {
    ticket,
    loading,
    error,
    logs,
    comments,
    attachments,
    mutating,
    mutateError,
    fetchDetail,
    fetchLogs,
    fetchTicketComments,
    fetchTicketAttachments,
    updateTicket,
    updateStatus,
    assign,
    addComment,
    updateComment,
    addAttachment,
    clearDetail,
    clearErrors,
  }
}
