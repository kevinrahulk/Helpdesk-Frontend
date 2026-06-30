import Drawer from "@mui/material/Drawer"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import {
  SpaceDashboardOutlined,
  AddCircleOutline,
  ConfirmationNumberOutlined,
  GroupOutlined,
  InsightsOutlined,
  SupportAgent,
} from "@mui/icons-material"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import { navItemsForRole } from "../navConfig"
import { roleLabels } from "../../utils/format"
import Avatar from "../../components/Avatar/Avatar"
import { SIDEBAR_WIDTH, drawerPaperSx, navButtonSx, brandSx } from "./style"

const iconMap = {
  dashboard: SpaceDashboardOutlined,
  add: AddCircleOutline,
  tickets: ConfirmationNumberOutlined,
  users: GroupOutlined,
  reports: InsightsOutlined,
}

function SidebarContent({ onNavigate }) {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = navItemsForRole(role)

  const handleClick = (path) => {
    navigate(path)
    onNavigate?.()
  }

  return (
    <>
      <Box sx={brandSx}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SupportAgent sx={{ fontSize: "1.3rem" }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.1 }}>Helpdesk</Typography>
          <Typography variant="caption" color="text.secondary">
            AI Ticket Assistant
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 1.5, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ px: 1.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary" }}
        >
          Workspace
        </Typography>
        <List sx={{ mt: 1 }}>
          {items.map((item) => {
            const Icon = iconMap[item.icon]
            const active =
              item.path === "/tickets"
                ? location.pathname === "/tickets"
                : location.pathname.startsWith(item.path)
            return (
              <ListItemButton key={item.key} sx={navButtonSx(active)} onClick={() => handleClick(item.path)}>
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: "inherit" }} primary={item.label} />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Avatar name={user?.full_name} size="sm" />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              {user?.full_name ?? "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {roleLabels[role] ?? role}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {user?.email ?? ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

/** Responsive navigation drawer — permanent on desktop, temporary on mobile. */
export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <Box component="nav" sx={{ width: { lg: SIDEBAR_WIDTH }, flexShrink: { lg: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": drawerPaperSx,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <SidebarContent onNavigate={onClose} />
        </Box>
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": drawerPaperSx,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <SidebarContent />
        </Box>
      </Drawer>
    </Box>
  )
}
