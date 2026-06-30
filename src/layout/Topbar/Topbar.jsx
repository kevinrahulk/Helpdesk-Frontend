import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Badge from "@mui/material/Badge"
import Popover from "@mui/material/Popover"
import CircularProgress from "@mui/material/CircularProgress"
import {
  MenuRounded,
  SearchRounded,
  LightModeOutlined,
  DarkModeOutlined,
  NotificationsNoneRounded,
  LogoutRounded,
  KeyboardArrowDown,
  DoneAll,
  Circle,
} from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useNotifications } from "../../../hooks/useNotifications"
import { useColorMode } from "../../theme/ColorModeContext"
import { roleLabels, formatRelativeTime } from "../../utils/format"
import Avatar from "../../components/Avatar/Avatar"
import { appBarSx, toolbarSx, searchSx } from "./style"

export default function Topbar({ onMenuClick }) {
  const { user, role, logout } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifAnchor, setNotifAnchor] = useState(null)

  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    fetchAll: fetchNotifications,
    fetchCount,
    markRead,
    markAllRead,
  } = useNotifications()

  // Poll for unread count every 30 seconds
  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 30_000)
    return () => clearInterval(interval)
  }, [fetchCount])

  const handleOpenNotifications = (e) => {
    setNotifAnchor(e.currentTarget)
    fetchNotifications({ page_size: 20 })
  }

  const handleCloseNotifications = () => {
    setNotifAnchor(null)
  }

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      await markRead(notif.id)
    }
    handleCloseNotifications()
    if (notif.ticket_id) {
      navigate(`/tickets/${notif.ticket_id}`)
    }
  }

  const handleMarkAllRead = async () => {
    await markAllRead()
  }

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    navigate("/login")
  }

  return (
    <AppBar position="fixed" sx={{ ...appBarSx, zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={toolbarSx}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { lg: "none" } }} aria-label="Open navigation">
          <MenuRounded />
        </IconButton>

        <Box sx={searchSx} role="search">
          <SearchRounded sx={{ fontSize: "1.2rem" }} />
          <Typography variant="body2">Search tickets…</Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
          <IconButton onClick={toggleColorMode} aria-label="Toggle theme">
            {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton aria-label="Notifications" onClick={handleOpenNotifications}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              max={99}
              invisible={unreadCount === 0}
            >
              <NotificationsNoneRounded />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* ── Notification dropdown ──────────────────────────────────── */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={handleCloseNotifications}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                width: 380,
                maxHeight: 480,
                borderRadius: 2,
                boxShadow: 6,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={handleMarkAllRead} sx={{ color: "primary.main" }}>
                  <DoneAll sx={{ fontSize: "1.1rem" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Divider />

          {notifLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
              {notifications.map((notif) => (
                <Box
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    bgcolor: notif.is_read ? "transparent" : "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "action.selected" },
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  {!notif.is_read && (
                    <Circle
                      sx={{
                        fontSize: "0.5rem",
                        color: "primary.main",
                        mt: 0.8,
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0, ml: notif.is_read ? 2 : 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: notif.is_read ? 400 : 600,
                        lineHeight: 1.4,
                        mb: 0.3,
                      }}
                    >
                      {notif.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(notif.created_at)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Popover>

        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", ml: 0.5 }}
        >
          <Avatar name={user?.name} size="sm" />
          <Box sx={{ display: { xs: "none", md: "block" }, lineHeight: 1.1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {roleLabels[role]}
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ color: "text.secondary", display: { xs: "none", md: "block" } }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
