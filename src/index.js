/**
 * Redux — Central export barrel
 *
 * Import everything from this single entry point:
 *   import { useAuth, useTickets, useTicketDetail, store } from "@/redux"
 *   import { login, fetchTickets } from "@/redux"
 *
 * Hooks:
 *   useAuth         — login, logout, profile, role helpers
 *   useTickets      — ticket list + create
 *   useTicketDetail — single ticket + comments/attachments/logs/status/assign
 *   useUsers        — user management (admin)
 *   useCategories   — category CRUD
 *   useDashboard    — role-scoped dashboard stats
 *   useReports      — admin analytics
 *   useAI           — AI suggestion + ticket summary panel
 */

// ── Store ────────────────────────────────────────────────────────────────────
export { default as store } from "./store/store"

// ── API Client ───────────────────────────────────────────────────────────────
export { default as apiClient } from "./api/apiClient"

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useAuth } from "./hooks/useAuth"
export { useTickets, useTicketDetail } from "./hooks/useTickets"
export { useUsers } from "./hooks/useUsers"
export {
  useCategories,
  useDashboard,
  useReports,
  useAI,
} from "./hooks/useDomainHooks"

// ── Auth slice ────────────────────────────────────────────────────────────────
export {
  login,
  logout,
  fetchProfile,
  clearAuthState,
  clearAuthError,
  selectUser,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
} from "./slices/authSlice"

// ── Tickets slice ─────────────────────────────────────────────────────────────
export {
  fetchTickets,
  fetchTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  fetchTicketLogs,
  addComment,
  fetchComments,
  updateComment,
  addAttachment,
  fetchAttachments,
  clearTicketErrors,
  clearTicketDetail,
  selectTicketItems,
  selectTicketTotal,
  selectTicketListLoading,
  selectTicketDetail,
  selectTicketMutating,
} from "./slices/ticketsSlice"

// ── Users slice ───────────────────────────────────────────────────────────────
export {
  fetchUsers,
  fetchUserById,
  createEmployee,
  createAgent,
  updateUser,
  updateUserStatus,
  fetchAgents,
  selectUserItems,
  selectAgents,
} from "./slices/usersSlice"

// ── Categories slice ──────────────────────────────────────────────────────────
export {
  fetchCategories,
  createCategory,
  updateCategory,
  deactivateCategory,
  selectCategories,
  selectCategoryById,
} from "./slices/categoriesSlice"

// ── Dashboard slice ───────────────────────────────────────────────────────────
export {
  fetchDashboard,
  clearDashboard,
  selectDashboardData,
  selectDashboardLoading,
  selectRecentTickets,
  selectAgentWorkload,
} from "./slices/dashboardSlice"

// ── Reports slice ─────────────────────────────────────────────────────────────
export {
  fetchReportSummary,
  fetchAgentPerformance,
  fetchSLACompliance,
  fetchTicketVolume,
  selectReportSummary,
  selectAgentPerformance,
  selectSLACompliance,
  selectTicketVolume,
} from "./slices/reportsSlice"

// ── AI slice ──────────────────────────────────────────────────────────────────
export {
  getTicketSuggestion,
  getTicketSummary,
  clearSuggestion,
  selectAISuggestion,
  selectAITicketSummary,
  selectAISuggestionLoading,
  selectAISummaryLoading,
} from "./slices/aiSlice"
