import MuiButton from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import { buttonSizes, buttonBaseSx } from "./style"

/**
 * Reusable Button.
 *
 * Props:
 * - size: "xs" | "sm" | "md" | "lg"  (controls padding/typography via style.js)
 * - variant: "contained" | "outlined" | "text" (MUI variants)
 * - loading: shows a spinner and disables the button
 * - everything else is forwarded to MUI Button (color, startIcon, onClick, etc.)
 */
export default function Button({ size = "md", loading = false, disabled, children, sx, startIcon, ...rest }) {
  const preset = buttonSizes[size] || buttonSizes.md

  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      sx={{ ...buttonBaseSx, ...preset, ...sx }}
      {...rest}
    >
      {loading && <CircularProgress size={16} thickness={5} sx={{ mr: 1, color: "inherit" }} />}
      {children}
    </MuiButton>
  )
}
