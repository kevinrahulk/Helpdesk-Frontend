import TextField from "@mui/material/TextField"
import { inputSizes, inputBaseSx } from "./style"

/**
 * Reusable text input built on MUI TextField.
 *
 * Props:
 * - boxSize: "sm" | "md" | "lg" (visual density via style.js)
 * - everything else (label, value, onChange, error, helperText, multiline, etc.)
 *   is forwarded to MUI TextField.
 */
export default function InputBox({ boxSize = "md", sx, InputProps, ...rest }) {
  const preset = inputSizes[boxSize] || inputSizes.md

  return (
    <TextField
      fullWidth
      size={preset.size}
      variant="outlined"
      sx={{ ...inputBaseSx, ...sx }}
      InputProps={{
        ...InputProps,
        sx: { fontSize: preset.inputFontSize, ...InputProps?.sx },
      }}
      {...rest}
    />
  )
}
