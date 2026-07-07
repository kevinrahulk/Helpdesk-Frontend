import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * Fetch paginated user list with optional filters.
 * @param {object} params - { page, page_size, role, is_active, search }
 */
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/users", { params })
      return data.data // UserListResponse { items, total, page, page_size }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch users.")
    }
  },
)

/**
 * Fetch a single user by ID.
 * @param {string} userId - UUID
 */
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/users/${userId}`)
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "User not found.")
    }
  },
)

/**
 * Create a new employee account (Admin only).
 * @param {object} payload - UserCreate { full_name, email, password, role_id, is_active }
 */
export const createEmployee = createAsyncThunk(
  "users/createEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/users", payload)
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to create employee.")
    }
  },
)

/**
 * Create a new support agent account (Admin only).
 * @param {object} payload - UserCreate { full_name, email, password, role_id, is_active }
 */
export const createAgent = createAsyncThunk(
  "users/createAgent",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/agents", payload)
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to create agent.")
    }
  },
)

/**
 * Update user details (Admin only).
 * @param {object} arg - { userId, payload: UserUpdate { full_name?, email?, role_id? } }
 */
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/users/${userId}`, payload)
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update user.")
    }
  },
)

/**
 * Activate or deactivate a user account (Admin only).
 * @param {object} arg - { userId, isActive: boolean }
 */
export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/users/${userId}/status`, {
        is_active: isActive,
      })
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update user status.")
    }
  },
)

/**
 * Delete (deactivate) a user account (Admin only).
 * Calls PATCH /users/:id/status with is_active=false.
 * @param {string} userId - UUID
 */
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/users/${userId}/status`, { is_active: false })
      return data.data // UserResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to delete user.")
    }
  },
)

/**
 * Fetch all active agents with their open ticket workload counts (Admin only).
 * Returns AgentWorkload[] { id, full_name, email, open_ticket_count }
 */
export const fetchAgents = createAsyncThunk(
  "users/fetchAgents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/agents")
      return data.data // AgentWorkload[]
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch agents.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  // User list
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  listLoading: false,
  listError: null,

  // Individual user detail — keyed by userId
  usersById: {},        // { [id]: UserResponse }
  detailLoading: false,
  detailError: null,

  // Agents with workload
  agents: [],           // AgentWorkload[]
  agentsLoading: false,
  agentsError: null,

  // Mutation state
  mutating: false,
  mutateError: null,
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserErrors(state) {
      state.listError = null
      state.detailError = null
      state.mutateError = null
      state.agentsError = null
    },
  },
  extraReducers: (builder) => {
    // ── fetchUsers ───────────────────────────────────────────────────────
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const { items, total, page, page_size } = action.payload
        state.listLoading = false
        state.items = items
        state.total = total
        state.page = page
        state.pageSize = page_size
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload
      })

    // ── fetchUserById ────────────────────────────────────────────────────
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.detailLoading = false
        state.usersById[action.payload.id] = action.payload
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload
      })

    // ── createEmployee ───────────────────────────────────────────────────
    builder
      .addCase(createEmployee.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.mutating = false
        const user = action.payload
        state.usersById[user.id] = user
        state.items.unshift(user)
        state.total += 1
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── createAgent ──────────────────────────────────────────────────────
    builder
      .addCase(createAgent.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.mutating = false
        const user = action.payload
        state.usersById[user.id] = user
        state.items.unshift(user)
        state.total += 1
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── updateUser ───────────────────────────────────────────────────────
    builder
      .addCase(updateUser.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.mutating = false
        const user = action.payload
        state.usersById[user.id] = user
        const idx = state.items.findIndex((u) => u.id === user.id)
        if (idx >= 0) state.items[idx] = user
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── updateUserStatus ─────────────────────────────────────────────────
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.mutating = false
        const user = action.payload
        state.usersById[user.id] = user
        const idx = state.items.findIndex((u) => u.id === user.id)
        if (idx >= 0) state.items[idx] = user
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── deleteUser ────────────────────────────────────────────────────────
    builder
      .addCase(deleteUser.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.mutating = false
        const user = action.payload
        // Update user in list (now is_active=false)
        state.usersById[user.id] = user
        const idx = state.items.findIndex((u) => u.id === user.id)
        if (idx >= 0) state.items[idx] = user
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── fetchAgents ──────────────────────────────────────────────────────
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.agentsLoading = true
        state.agentsError = null
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agentsLoading = false
        state.agents = action.payload
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.agentsLoading = false
        state.agentsError = action.payload
      })
  },
})

export const { clearUserErrors } = usersSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectUserItems = (state) => state.users.items
export const selectUserTotal = (state) => state.users.total
export const selectUserPage = (state) => state.users.page
export const selectUserPageSize = (state) => state.users.pageSize
export const selectUserListLoading = (state) => state.users.listLoading
export const selectUserListError = (state) => state.users.listError

export const selectUserById = (id) => (state) => state.users.usersById[id] ?? null
export const selectUserDetailLoading = (state) => state.users.detailLoading

export const selectAgents = (state) => state.users.agents
export const selectAgentsLoading = (state) => state.users.agentsLoading
export const selectAgentsError = (state) => state.users.agentsError

export const selectUserMutating = (state) => state.users.mutating
export const selectUserMutateError = (state) => state.users.mutateError

export default usersSlice.reducer
