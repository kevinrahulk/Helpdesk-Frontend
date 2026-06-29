// Layout helpers for the Dashboard grid.
export const statGridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
  mb: 3,
}

export const splitGridSx = {
  display: "grid",
  gap: 3,
  gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
  alignItems: "start",
}

export const breakdownRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  py: 1,
  borderBottom: "1px solid",
  borderColor: "divider",
  "&:last-of-type": { borderBottom: "none" },
}
