// Size presets for the reusable Avatar.
export const avatarSizes = {
  xs: { width: 24, height: 24, fontSize: "0.7rem" },
  sm: { width: 32, height: 32, fontSize: "0.8rem" },
  md: { width: 40, height: 40, fontSize: "0.9rem" },
  lg: { width: 56, height: 56, fontSize: "1.2rem" },
}

// Deterministic background color derived from a name, so each user keeps a
// consistent avatar color across the app.
const palette = ["#0c66e4", "#5e4db2", "#216e4e", "#a54800", "#c9372c", "#206a83", "#943d73"]

export function colorFromName(name = "") {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
}
