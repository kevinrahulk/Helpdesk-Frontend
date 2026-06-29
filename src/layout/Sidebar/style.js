export const SIDEBAR_WIDTH = 252

export const drawerPaperSx = {
  width: SIDEBAR_WIDTH,
  boxSizing: "border-box",
  borderRight: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
}

export const navButtonSx = (active) => ({
  borderRadius: 1.5,
  mb: 0.25,
  px: 1.5,
  py: 1,
  color: active ? "primary.main" : "text.secondary",
  bgcolor: active ? "action.selected" : "transparent",
  fontWeight: active ? 700 : 500,
  "& .MuiListItemIcon-root": {
    color: active ? "primary.main" : "text.secondary",
    minWidth: 36,
  },
  "&:hover": { bgcolor: "action.hover" },
})

export const brandSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  px: 2.5,
  height: 64,
  borderBottom: "1px solid",
  borderColor: "divider",
}
