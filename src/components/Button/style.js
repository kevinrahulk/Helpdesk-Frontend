// Size presets for the reusable Button. Import the size you need where you use it,
// e.g. <Button size="sm" /> for compact toolbars, <Button size="lg" /> for primary CTAs.
export const buttonSizes = {
  xs: {
    fontSize: "0.75rem",
    padding: "2px 10px",
    minHeight: 28,
    borderRadius: 6,
  },
  sm: {
    fontSize: "0.8125rem",
    padding: "5px 14px",
    minHeight: 34,
    borderRadius: 6,
  },
  md: {
    fontSize: "0.875rem",
    padding: "8px 18px",
    minHeight: 40,
    borderRadius: 8,
  },
  lg: {
    fontSize: "0.9375rem",
    padding: "11px 24px",
    minHeight: 46,
    borderRadius: 8,
  },
}

// Base style applied to every button regardless of size.
export const buttonBaseSx = {
  fontWeight: 600,
  textTransform: "none",
  whiteSpace: "nowrap",
  lineHeight: 1.2,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}
