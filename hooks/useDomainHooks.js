/**
 * useCategories — Ticket category management hook
 * useDashboard  — Role-scoped dashboard hook
 * useReports    — Admin analytics hooks
 * useAI         — AI suggestion & summary hook
 */

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"

// Categories
import {
  fetchCategories as fetchCategoriesThunk,
  fetchCategoryById as fetchCategoryByIdThunk,
  createCategory as createCategoryThunk,
  updateCategory as updateCategoryThunk,
  deactivateCategory as deactivateCategoryThunk,
  clearCategoryErrors,
  selectCategories,
  selectCategoryById,
  selectCategoriesLoading,
  selectCategoriesError,
  selectCategoriesMutating,
  selectCategoriesMutateError,
} from "../slices/categoriesSlice"

// Dashboard
import {
  fetchDashboard as fetchDashboardThunk,
  clearDashboard,
  clearDashboardError,
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
  selectDashboardLastFetched,
  selectRecentTickets,
  selectAgentWorkload,
} from "../slices/dashboardSlice"

// Reports
import {
  fetchReportSummary as fetchReportSummaryThunk,
  fetchAgentPerformance as fetchAgentPerformanceThunk,
  fetchSLACompliance as fetchSLAComplianceThunk,
  fetchTicketVolume as fetchTicketVolumeThunk,
  clearReportErrors,
  selectReportSummary,
  selectReportSummaryLoading,
  selectReportSummaryError,
  selectAgentPerformance,
  selectAgentPerformanceLoading,
  selectSLACompliance,
  selectSLALoading,
  selectTicketVolume,
  selectVolumeLoading,
} from "../slices/reportsSlice"

// AI
import {
  getTicketSuggestion as getTicketSuggestionThunk,
  getTicketSummary as getTicketSummaryThunk,
  clearSuggestion,
  clearAIErrors,
  selectAISuggestion,
  selectAISuggestionLoading,
  selectAISuggestionError,
  selectAITicketSummary,
  selectAISummaryLoading,
  selectAISummaryError,
} from "../slices/aiSlice"

// ─────────────────────────────────────────────────────────────────────────────
// useCategories
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for ticket categories — used in Create Ticket forms, admin management.
 *
 * Usage:
 *   const { categories, loading, fetchCategories, createCategory } = useCategories()
 */
export function useCategories() {
  const dispatch = useDispatch()

  const categories = useSelector(selectCategories)
  const loading = useSelector(selectCategoriesLoading)
  const error = useSelector(selectCategoriesError)
  const mutating = useSelector(selectCategoriesMutating)
  const mutateError = useSelector(selectCategoriesMutateError)

  /** Fetch active categories. Pass { active_only: false } to include inactive. */
  const fetchCategories = useCallback(
    (params = { active_only: true }) => {
      dispatch(fetchCategoriesThunk(params))
    },
    [dispatch],
  )

  /** Fetch a single category by UUID. */
  const fetchCategory = useCallback(
    (categoryId) => dispatch(fetchCategoryByIdThunk(categoryId)),
    [dispatch],
  )

  /**
   * Create a category (admin only).
   * @param {{ name, description?, is_active? }} payload
   */
  const createCategory = useCallback(
    async (payload) => {
      const result = await dispatch(createCategoryThunk(payload))
      if (createCategoryThunk.fulfilled.match(result)) return { success: true, category: result.payload }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Update a category (admin only).
   * @param {string} categoryId
   * @param {object} payload - TicketCategoryUpdate
   */
  const updateCategory = useCallback(
    async (categoryId, payload) => {
      const result = await dispatch(updateCategoryThunk({ categoryId, payload }))
      if (updateCategoryThunk.fulfilled.match(result)) return { success: true, category: result.payload }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Soft-delete a category (admin only).
   * @param {string} categoryId
   */
  const deactivateCategory = useCallback(
    async (categoryId) => {
      const result = await dispatch(deactivateCategoryThunk(categoryId))
      if (deactivateCategoryThunk.fulfilled.match(result)) return { success: true }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const clearErrors = useCallback(() => dispatch(clearCategoryErrors()), [dispatch])

  return {
    categories,
    loading,
    error,
    mutating,
    mutateError,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deactivateCategory,
    clearErrors,
    // Selector factory for individual lookups
    selectCategoryById,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useDashboard
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for the role-adaptive dashboard page.
 *
 * The backend determines which dashboard shape to return based on the JWT role.
 * The hook exposes the raw `data` plus convenience selectors.
 *
 * Usage:
 *   const { data, loading, recentTickets, agentWorkload, refresh } = useDashboard()
 *
 * Type narrowing in the component:
 *   if (role === 'admin') { data.total_tickets ... data.agent_workload ... }
 *   if (role === 'agent') { data.assigned_open ... data.sla_breached ... }
 *   if (role === 'employee') { data.open_tickets ... data.closed_tickets ... }
 */
export function useDashboard() {
  const dispatch = useDispatch()

  const data = useSelector(selectDashboardData)
  const loading = useSelector(selectDashboardLoading)
  const error = useSelector(selectDashboardError)
  const lastFetched = useSelector(selectDashboardLastFetched)
  const recentTickets = useSelector(selectRecentTickets)
  const agentWorkload = useSelector(selectAgentWorkload)

  /** Fetch dashboard data for the current user. */
  const refresh = useCallback(() => {
    dispatch(fetchDashboardThunk())
  }, [dispatch])

  /** Clear cached dashboard data (e.g. on logout). */
  const reset = useCallback(() => {
    dispatch(clearDashboard())
  }, [dispatch])

  const clearError = useCallback(() => {
    dispatch(clearDashboardError())
  }, [dispatch])

  return {
    data,
    loading,
    error,
    lastFetched,
    recentTickets,
    agentWorkload,
    refresh,
    reset,
    clearError,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useReports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for the admin reports page.
 *
 * Usage:
 *   const { summary, fetchSummary, agentPerformance, ... } = useReports()
 */
export function useReports() {
  const dispatch = useDispatch()

  const summary = useSelector(selectReportSummary)
  const summaryLoading = useSelector(selectReportSummaryLoading)
  const summaryError = useSelector(selectReportSummaryError)

  const agentPerformance = useSelector(selectAgentPerformance)
  const agentPerformanceLoading = useSelector(selectAgentPerformanceLoading)

  const slaCompliance = useSelector(selectSLACompliance)
  const slaLoading = useSelector(selectSLALoading)

  const ticketVolume = useSelector(selectTicketVolume)
  const volumeLoading = useSelector(selectVolumeLoading)

  /**
   * @param {object} params - { date_from?, date_to?, priority?, category_id? }
   */
  const fetchSummary = useCallback(
    (params = {}) => dispatch(fetchReportSummaryThunk(params)),
    [dispatch],
  )

  /**
   * @param {object} params - { date_from?, date_to? }
   */
  const fetchAgentPerformance = useCallback(
    (params = {}) => dispatch(fetchAgentPerformanceThunk(params)),
    [dispatch],
  )

  /**
   * @param {object} params - { date_from?, date_to? }
   */
  const fetchSLA = useCallback(
    (params = {}) => dispatch(fetchSLAComplianceThunk(params)),
    [dispatch],
  )

  /**
   * @param {object} params - { groupby?: "day"|"week"|"month", date_from?, date_to? }
   */
  const fetchVolume = useCallback(
    (params = { groupby: "month" }) => dispatch(fetchTicketVolumeThunk(params)),
    [dispatch],
  )

  /** Fetch all four reports at once. */
  const fetchAll = useCallback(
    (params = {}) => {
      dispatch(fetchReportSummaryThunk(params))
      dispatch(fetchAgentPerformanceThunk(params))
      dispatch(fetchSLAComplianceThunk(params))
      dispatch(fetchTicketVolumeThunk({ groupby: "month", ...params }))
    },
    [dispatch],
  )

  const clearErrors = useCallback(() => dispatch(clearReportErrors()), [dispatch])

  return {
    summary,
    summaryLoading,
    summaryError,
    agentPerformance,
    agentPerformanceLoading,
    slaCompliance,
    slaLoading,
    ticketVolume,
    volumeLoading,
    fetchSummary,
    fetchAgentPerformance,
    fetchSLA,
    fetchVolume,
    fetchAll,
    clearErrors,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useAI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for AI assistant features.
 *
 * Two modes:
 *  1. Creation-time suggestion — call getSuggestion(title, description) before ticket submit.
 *     The returned suggestion_id should be passed in TicketCreate.ai_suggestion_id.
 *
 *  2. Ticket summary panel — call fetchSummary(ticketId) to populate the AIPanel component.
 *
 * Usage:
 *   const { suggestion, getSuggestion, fetchSummary, selectTicketSummary } = useAI()
 */
export function useAI() {
  const dispatch = useDispatch()

  const suggestion = useSelector(selectAISuggestion)
  const suggestionLoading = useSelector(selectAISuggestionLoading)
  const suggestionError = useSelector(selectAISuggestionError)
  const summaryLoading = useSelector(selectAISummaryLoading)
  const summaryError = useSelector(selectAISummaryError)

  /**
   * Request AI suggestions for a draft ticket (employee flow).
   * @param {{ title: string, description: string }} payload
   * @returns {Promise<{ success, suggestion?, error? }>}
   */
  const getSuggestion = useCallback(
    async (payload) => {
      const result = await dispatch(getTicketSuggestionThunk(payload))
      if (getTicketSuggestionThunk.fulfilled.match(result)) {
        return { success: true, suggestion: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Fetch or regenerate the AI summary for an existing ticket (agent/admin flow).
   * @param {string} ticketId - UUID
   * @returns {Promise<{ success, summary?, error? }>}
   */
  const fetchSummary = useCallback(
    async (ticketId) => {
      const result = await dispatch(getTicketSummaryThunk(ticketId))
      if (getTicketSummaryThunk.fulfilled.match(result)) {
        return { success: true, summary: result.payload.summary }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /** Clear the creation-time suggestion (call on unmount of Create Ticket page). */
  const resetSuggestion = useCallback(() => dispatch(clearSuggestion()), [dispatch])

  const clearErrors = useCallback(() => dispatch(clearAIErrors()), [dispatch])

  return {
    // Creation-time suggestion
    suggestion,
    suggestionLoading,
    suggestionError,
    getSuggestion,
    resetSuggestion,

    // Per-ticket summary (selector factory — call with ticketId)
    summaryLoading,
    summaryError,
    fetchSummary,
    selectTicketSummary: selectAITicketSummary, // usage: useSelector(selectTicketSummary(ticketId))

    clearErrors,
  }
}
