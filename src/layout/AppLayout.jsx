import { useState } from "react"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar/Sidebar"
import Topbar from "./Topbar/Topbar"
import { SIDEBAR_WIDTH } from "./Sidebar/style"

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
