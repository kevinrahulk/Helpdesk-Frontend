/**
 * useUsers — User management hook (Admin only)
 *
 * Usage:
 *   const { users, agents, loading, fetchUsers, createEmployee, createAgent, ... } = useUsers()
 */

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUsers as fetchUsersThunk,
  fetchUserById as fetchUserByIdThunk,
  createEmployee as createEmployeeThunk,
  createAgent as createAgentThunk,
  updateUser as updateUserThunk,
  updateUserStatus as updateUserStatusThunk,
  fetchAgents as fetchAgentsThunk,
  clearUserErrors,
  selectUserItems,
  selectUserTotal,
  selectUserPage,
  selectUserPageSize,
  selectUserListLoading,
  selectUserListError,
  selectUserById,
  selectUserDetailLoading,
  selectAgents,
  selectAgentsLoading,
  selectAgentsError,
  selectUserMutating,
  selectUserMutateError,
} from "../slices/usersSlice"

export function useUsers() {
  const dispatch = useDispatch()

  const users = useSelector(selectUserItems)
  const total = useSelector(selectUserTotal)
  const page = useSelector(selectUserPage)
  const pageSize = useSelector(selectUserPageSize)
  const loading = useSelector(selectUserListLoading)
  const error = useSelector(selectUserListError)
  const agents = useSelector(selectAgents)
  const agentsLoading = useSelector(selectAgentsLoading)
  const agentsError = useSelector(selectAgentsError)
  const mutating = useSelector(selectUserMutating)
  const mutateError = useSelector(selectUserMutateError)

  /**
   * Fetch user list with optional filters.
   * @param {object} params - { page?, page_size?, role?, is_active?, search? }
   */
  const fetchUsers = useCallback(
    (params = {}) => {
      dispatch(fetchUsersThunk(params))
    },
    [dispatch],
  )

  /**
   * Fetch a single user by UUID.
   * @param {string} userId
   */
  const fetchUser = useCallback(
    (userId) => {
      dispatch(fetchUserByIdThunk(userId))
    },
    [dispatch],
  )

  /**
   * Create a new employee account.
   * @param {object} payload - UserCreate
   * @returns {Promise<{ success, user?, error? }>}
   */
  const createEmployee = useCallback(
    async (payload) => {
      const result = await dispatch(createEmployeeThunk(payload))
      if (createEmployeeThunk.fulfilled.match(result)) {
        return { success: true, user: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Create a new support agent account.
   * @param {object} payload - UserCreate
   * @returns {Promise<{ success, user?, error? }>}
   */
  const createAgent = useCallback(
    async (payload) => {
      const result = await dispatch(createAgentThunk(payload))
      if (createAgentThunk.fulfilled.match(result)) {
        return { success: true, user: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Update a user's details.
   * @param {string} userId
   * @param {object} payload - UserUpdate { full_name?, email?, role_id? }
   * @returns {Promise<{ success, user?, error? }>}
   */
  const updateUser = useCallback(
    async (userId, payload) => {
      const result = await dispatch(updateUserThunk({ userId, payload }))
      if (updateUserThunk.fulfilled.match(result)) {
        return { success: true, user: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Activate or deactivate a user account.
   * @param {string} userId
   * @param {boolean} isActive
   * @returns {Promise<{ success, user?, error? }>}
   */
  const updateUserStatus = useCallback(
    async (userId, isActive) => {
      const result = await dispatch(updateUserStatusThunk({ userId, isActive }))
      if (updateUserStatusThunk.fulfilled.match(result)) {
        return { success: true, user: result.payload }
      }
      return { success: false, error: result.payload }
    },
    [dispatch],
  )

  /**
   * Fetch all active agents with their open ticket counts.
   */
  const fetchAgents = useCallback(() => {
    dispatch(fetchAgentsThunk())
  }, [dispatch])

  const clearErrors = useCallback(() => dispatch(clearUserErrors()), [dispatch])

  return {
    users,
    total,
    page,
    pageSize,
    loading,
    error,
    agents,
    agentsLoading,
    agentsError,
    mutating,
    mutateError,
    fetchUsers,
    fetchUser,
    createEmployee,
    createAgent,
    updateUser,
    updateUserStatus,
    fetchAgents,
    clearErrors,
    // Selector factory — use in component: const user = useSelector(selectUserById(id))
    selectUserById,
  }
}
