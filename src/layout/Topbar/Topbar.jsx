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
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
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
import { useAuth } from "../../context/AuthContext"
import { useColorMode } from "../../theme/ColorModeContext"
import { ROLES } from "../../data/mockData"
import { roleLabels } from "../../utils/format"
import Avatar from "../../components/Avatar/Avatar"
import { appBarSx, toolbarSx, searchSx } from "./style"

const roleOptions = [
  { value: ROLES.EMPLOYEE, label: "Employee" },
  { value: ROLES.AGENT, label: "Agent" },
  { value: ROLES.ADMIN, label: "Admin" },
]

export default function Topbar({ onMenuClick }) {
  const { user, role, logout, switchRole } = useAuth()
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

        {/* Demo role switcher */}
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Role
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={role}
            onChange={(_, val) => val && switchRole(val)}
            sx={{
              "& .MuiToggleButton-root": {
                px: 1.5,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            {roleOptions.map((o) => (
              <ToggleButton key={o.value} value={o.value} aria-label={o.label}>
                {o.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

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
