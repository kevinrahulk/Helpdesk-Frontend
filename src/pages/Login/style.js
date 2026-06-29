export const pageSx = {
  minHeight: "100vh",
  display: "flex",
  bgcolor: "background.default",
}

export const formColumnSx = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: { xs: 3, sm: 6 },
}

export const formCardSx = {
  width: "100%",
  maxWidth: 400,
}

// Right-hand brand/marketing panel (hidden on small screens).
export const brandColumnSx = {
  flex: 1.1,
  display: { xs: "none", md: "flex" },
  flexDirection: "column",
  justifyContent: "space-between",
  p: 6,
  color: "#fff",
  background: "linear-gradient(150deg, #0055cc 0%, #0c66e4 55%, #388bff 100%)",
}

export const featureRowSx = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.5,
  mb: 2.5,
}
