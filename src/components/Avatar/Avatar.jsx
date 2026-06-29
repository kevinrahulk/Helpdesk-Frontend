import MuiAvatar from "@mui/material/Avatar"
import { avatarSizes, colorFromName, initials } from "./style"

/**
 * Reusable Avatar that shows an image if provided, otherwise colored initials.
 *
 * Props:
 * - name: full name used for initials + deterministic color
 * - src: optional image url
 * - size: "xs" | "sm" | "md" | "lg"
 */
export default function Avatar({ name = "", src, size = "md", sx, ...rest }) {
  const preset = avatarSizes[size] || avatarSizes.md

  return (
    <MuiAvatar
      src={src || undefined}
      alt={name}
      sx={{
        ...preset,
        bgcolor: src ? undefined : colorFromName(name),
        fontWeight: 600,
        ...sx,
      }}
      {...rest}
    >
      {!src && initials(name)}
    </MuiAvatar>
  )
}
