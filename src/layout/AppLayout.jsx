import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import { Outlet, useLocation, matchPath } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Sidebar from "./Sidebar/Sidebar"
import Topbar from "./Topbar/Topbar"
import { SIDEBAR_WIDTH } from "./Sidebar/style"

import { selectAccessToken } from "../slices/authSlice"
import { fetchTicketById, fetchComments, fetchTicketLogs, fetchTickets } from "../slices/ticketsSlice"
import { getTicketSummary } from "../slices/aiSlice"
import { fetchUnreadCount } from "../slices/notificationsSlice"

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const accessToken = useSelector(selectAccessToken)

  useEffect(() => {
    if (!accessToken) return

    let socket
    let reconnectTimeout
    let isClosed = false

    const connect = () => {
      if (isClosed) return

      // Derive ws:// or wss:// base URL from api base URL
      const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000"
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
      let wsBase = apiBaseUrl.replace(/^https?:/, wsProtocol)
      
      const wsUrl = `${wsBase}/ws?token=${accessToken}`
      console.log("[WebSocket] Connecting to:", wsUrl)
      
      socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        console.log("[WebSocket] Connected successfully")
      }

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log("[WebSocket] Message received:", message)

          const { type, ticket_id } = message

          // 1. If we are currently viewing the updated ticket, refresh all its details and AI panel
          const match = matchPath({ path: "/tickets/:id" }, location.pathname)
          const activeTicketId = match?.params?.id

          if (ticket_id && activeTicketId && ticket_id === activeTicketId) {
            if (type === "AI_SUMMARY_UPDATED") {
              dispatch(getTicketSummary(ticket_id))
            } else if (type === "TICKET_UPDATED") {
              dispatch(fetchTicketById(ticket_id))
              dispatch(fetchComments(ticket_id))
              dispatch(getTicketSummary(ticket_id))
              dispatch(fetchTicketLogs(ticket_id))
            }
          }

          // 2. If we are on the ticket list view, refresh the list when a ticket is created or updated
          if (location.pathname === "/tickets" || location.pathname === "/dashboard") {
            if (type === "TICKET_CREATED" || type === "TICKET_UPDATED") {
              dispatch(fetchTickets())
            }
          }

          // 3. If a new notification is received, update the Topbar badge count
          if (type === "NOTIFICATION_RECEIVED") {
            dispatch(fetchUnreadCount())
          }
        } catch (err) {
          console.error("[WebSocket] Failed to parse message:", err)
        }
      }

      socket.onclose = (e) => {
        console.log("[WebSocket] Connection closed", e.reason)
        if (!isClosed) {
          // Reconnect in 3 seconds
          reconnectTimeout = setTimeout(connect, 3000)
        }
      }

      socket.onerror = (err) => {
        console.error("[WebSocket] Connection error:", err)
        socket.close()
      }
    }

    connect()

    return () => {
      isClosed = true
      if (socket) socket.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [accessToken, location.pathname, dispatch])

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Topbar onMenuClick={() => setMobileOpen((o) => !o)} />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 60, sm: 64 } }} />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
