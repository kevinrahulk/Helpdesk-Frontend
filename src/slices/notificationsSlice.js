/**
 * notificationsSlice — Notification management
 *
 * GET    /notifications              → fetchNotifications
 * GET    /notifications/unread-count → fetchUnreadCount
 * PATCH  /notifications/:id/read    → markAsRead
 * PATCH  /notifications/mark-all-read → markAllAsRead
 */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/notifications", { params })
      return data.data // NotificationListResponse { items, total, unread_count }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch notifications.")
    }
  },
)

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/notifications/unread-count")
      return data.data // { unread_count: number }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch unread count.")
    }
  },
)

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.patch(`/notifications/${notificationId}/read`)
      return data.data // NotificationResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to mark as read.")
    }
  },
)

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.patch("/notifications/mark-all-read")
      return true
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to mark all as read.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  items: [],
  total: 0,
  unreadCount: 0,
  loading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.items = []
      state.total = 0
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.unreadCount = action.payload.unread_count
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload.unread_count
    })

    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const updated = action.payload
      const idx = state.items.findIndex((n) => n.id === updated.id)
      if (idx >= 0) {
        state.items[idx] = updated
      }
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    })

    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.items = state.items.map((n) => ({ ...n, is_read: true }))
      state.unreadCount = 0
    })
  },
})

export const { clearNotifications } = notificationsSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectNotificationItems = (state) => state.notifications.items
export const selectNotificationTotal = (state) => state.notifications.total
export const selectUnreadCount = (state) => state.notifications.unreadCount
export const selectNotificationsLoading = (state) => state.notifications.loading
export const selectNotificationsError = (state) => state.notifications.error

export default notificationsSlice.reducer
