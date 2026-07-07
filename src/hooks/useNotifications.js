
import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead as markAsReadThunk,
  markAllAsRead as markAllAsReadThunk,
  clearNotifications,
  selectNotificationItems,
  selectNotificationTotal,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError,
} from "../slices/notificationsSlice"

export function useNotifications() {
  const dispatch = useDispatch()

  const notifications = useSelector(selectNotificationItems)
  const total = useSelector(selectNotificationTotal)
  const unreadCount = useSelector(selectUnreadCount)
  const loading = useSelector(selectNotificationsLoading)
  const error = useSelector(selectNotificationsError)

  const fetchAll = useCallback(
    (params = {}) => {
      dispatch(fetchNotifications(params))
    },
    [dispatch],
  )

  const fetchCount = useCallback(() => {
    dispatch(fetchUnreadCount())
  }, [dispatch])

  const markRead = useCallback(
    async (notificationId) => {
      const result = await dispatch(markAsReadThunk(notificationId))
      return markAsReadThunk.fulfilled.match(result)
    },
    [dispatch],
  )

  const markAllRead = useCallback(async () => {
    const result = await dispatch(markAllAsReadThunk())
    return markAllAsReadThunk.fulfilled.match(result)
  }, [dispatch])

  const clear = useCallback(() => dispatch(clearNotifications()), [dispatch])

  return {
    notifications,
    total,
    unreadCount,
    loading,
    error,
    fetchAll,
    fetchCount,
    markRead,
    markAllRead,
    clear,
  }
}
