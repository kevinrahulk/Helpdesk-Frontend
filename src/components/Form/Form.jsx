import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { formGapSx, fieldLabelSx } from "./style"

/** Vertical form layout wrapper. density: "compact" | "comfortable". */
export function Form({ density = "comfortable", onSubmit, children, sx }) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ ...(formGapSx[density] || formGapSx.comfortable), ...sx }}>
      {children}
    </Box>
  )
}

/** A labelled field group: renders a label above any control. */
export function FormField({ label, required, hint, children }) {
  return (
    <Box>
      {label && (
        <Typography component="label" sx={fieldLabelSx}>
          {label}
          {required && (
            <Box component="span" sx={{ color: "error.main" }}>
              *
            </Box>
          )}
        </Typography>
      )}
      {children}
      {hint && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {hint}
        </Typography>
      )}
    </Box>
  )
}
