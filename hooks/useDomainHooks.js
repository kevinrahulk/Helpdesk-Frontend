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
  clearSuggestion as clearSuggestionAction,
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

export function useCategories() {
  const dispatch = useDispatch()

  const categories = useSelector(selectCategories)
  const loading = useSelector(selectCategoriesLoading)
  const error = useSelector(selectCategoriesError)
  const mutating = useSelector(selectCategoriesMutating)
  const mutateError = useSelector(selectCategoriesMutateError)

  const fetch = useCallback(
    (params = { active_only: true }) => {
      dispatch(fetchCategoriesThunk(params))
    },
    [dispatch],
  )

  const fetchCategory = useCallback(
    (categoryId) => dispatch(fetchCategoryByIdThunk(categoryId)),
    [dispatch],
  )

  const createCategory = useCallback(
    async (payload) => {
      const result = await dispatch(createCategoryThunk(payload))
      if (createCategoryThunk.fulfilled.match(result)) return { success: true, category: result.payload }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const updateCategory = useCallback(
    async (categoryId, payload) => {
      const result = await dispatch(updateCategoryThunk({ categoryId, payload }))
      if (updateCategoryThunk.fulfilled.match(result)) return { success: true, category: result.payload }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

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
    fetch,
    fetchCategory,
    createCategory,
    updateCategory,
    deactivateCategory,
    clearErrors,
    selectCategoryById,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useDashboard
// ─────────────────────────────────────────────────────────────────────────────

export function useDashboard() {
  const dispatch = useDispatch()

  const data = useSelector(selectDashboardData)
  const loading = useSelector(selectDashboardLoading)
  const error = useSelector(selectDashboardError)
  const lastFetched = useSelector(selectDashboardLastFetched)
  const recentTickets = useSelector(selectRecentTickets)
  const agentWorkload = useSelector(selectAgentWorkload)

  const fetch = useCallback(() => {
    dispatch(fetchDashboardThunk())
  }, [dispatch])

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
    fetch,
    reset,
    clearError,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useReports
// ─────────────────────────────────────────────────────────────────────────────

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

  const fetchSummary = useCallback(
    (params = {}) => dispatch(fetchReportSummaryThunk(params)),
    [dispatch],
  )

  const fetchAgentPerformance = useCallback(
    (params = {}) => dispatch(fetchAgentPerformanceThunk(params)),
    [dispatch],
  )

  const fetchSLA = useCallback(
    (params = {}) => dispatch(fetchSLAComplianceThunk(params)),
    [dispatch],
  )

  const fetchVolume = useCallback(
    (params = { groupby: "month" }) => dispatch(fetchTicketVolumeThunk(params)),
    [dispatch],
  )

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
 * Creation-time (CreateTicket page):
 *   getSuggestion({ title, description }) → populates `suggestion`
 *   clearSuggestion() → clears it on unmount
 *
 * Per-ticket summary (TicketDetails page):
 *   getTicketSummary(ticketId) → populates `summary` via selectAITicketSummary
 */
export function useAI(ticketId) {
  const dispatch = useDispatch()

  const suggestion = useSelector(selectAISuggestion)
  const suggestionLoading = useSelector(selectAISuggestionLoading)
  const suggestionError = useSelector(selectAISuggestionError)
  const summaryLoading = useSelector(selectAISummaryLoading)
  const summaryError = useSelector(selectAISummaryError)

  // Per-ticket summary (only meaningful when ticketId is provided)
  const summary = useSelector(ticketId ? selectAITicketSummary(ticketId) : () => null)

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

  const getTicketSummary = useCallback(
    async (id) => {
      const result = await dispatch(getTicketSummaryThunk(id))
      if (getTicketSummaryThunk.fulfilled.match(result)) {
        return { success: true, summary: result.payload.summary }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  const clearSuggestion = useCallback(() => dispatch(clearSuggestionAction()), [dispatch])

  const clearErrors = useCallback(() => dispatch(clearAIErrors()), [dispatch])

  return {
    suggestion,
    suggestionLoading,
    suggestionError,
    getSuggestion,
    clearSuggestion,
    summary,
    summaryLoading,
    summaryError,
    getTicketSummary,
    clearErrors,
  }
}
