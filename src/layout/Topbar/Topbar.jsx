import { useState } from "react"
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
import {
  MenuRounded,
  SearchRounded,
  LightModeOutlined,
  DarkModeOutlined,
  NotificationsNoneRounded,
  LogoutRounded,
  KeyboardArrowDown,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import { useColorMode } from "../../theme/ColorModeContext"
import { roleLabels } from "../../utils/format"
import Avatar from "../../components/Avatar/Avatar"
import { appBarSx, toolbarSx, searchSx } from "./style"

export default function Topbar({ onMenuClick }) {
  const { user, role, logout } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

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
          <IconButton aria-label="Notifications">
            <Badge color="error" variant="dot">
              <NotificationsNoneRounded />
            </Badge>
          </IconButton>
        </Tooltip>

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
