// Size presets for the reusable InputBox text field.
export const inputSizes = {
  sm: { size: "small", inputFontSize: "0.8125rem" },
  md: { size: "small", inputFontSize: "0.875rem" },
  lg: { size: "medium", inputFontSize: "0.9375rem" },
}

export const inputBaseSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    backgroundColor: "background.paper",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
  },
}
