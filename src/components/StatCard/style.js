// Tone presets map a semantic meaning to an icon tint used by StatCard.
export const statTones = {
  default: { color: "text.primary", soft: "action.hover" },
  primary: { color: "primary.main", soft: "primary.main" },
  success: { color: "success.main", soft: "success.main" },
  warning: { color: "warning.main", soft: "warning.main" },
  error: { color: "error.main", soft: "error.main" },
  info: { color: "info.main", soft: "info.main" },
}

export const statIconWrapSx = {
  width: 44,
  height: 44,
  borderRadius: 2,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}
