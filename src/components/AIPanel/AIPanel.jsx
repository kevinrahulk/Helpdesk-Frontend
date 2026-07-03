import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import { AutoAwesome } from "@mui/icons-material"
import { aiSurfaceSx, aiHeaderSx, aiBodySx } from "./style"

/**
 * Branded container for AI-generated content. Always labels output as AI
 * generated (BR-AI-006) and supports a loading and an error/unavailable state.
 *
 * Props:
 * - title: header label (e.g. "AI Suggestions", "AI Insight")
 * - loading: shows a spinner with a generating message
 * - error: shows a graceful degradation message when the AI provider is down
 *   (the request itself failed — this is distinct from a *valid* response
 *   that just came back empty; see FirstFixSteps' `degraded` prop for that
 *   case, which renders inline rather than blanking the whole panel).
 * - children: panel body when data is ready
 * - sx, ...rest: forwarded to the root Box so layout props (mb, mt, etc.)
 *   aren't silently dropped when this panel is stacked with other surfaces.
 */
export default function AIPanel({ title = "AI Assistant", loading, error, children, sx, ...rest }) {
  return (
    <Box sx={[aiSurfaceSx, ...(Array.isArray(sx) ? sx : [sx])]} {...rest}>
      <Box sx={aiHeaderSx}>
        <AutoAwesome sx={{ fontSize: "1.1rem", color: "secondary.main" }} />
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", flexGrow: 1 }}>{title}</Typography>
        <Chip label="AI generated" size="small" color="secondary" variant="outlined" sx={{ height: 22, fontSize: "0.7rem" }} />
      </Box>

      <Box sx={aiBodySx}>
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2, color: "text.secondary" }}>
            <CircularProgress size={18} color="secondary" />
            <Typography variant="body2">Analyzing ticket and generating suggestions…</Typography>
          </Box>
        )}

        {!loading && error && (
          <Typography variant="body2" color="text.secondary">
            The AI assistant is currently unavailable. You can continue working — suggestions are optional and will
            return once the service is back.
          </Typography>
        )}

        {!loading && !error && children}
      </Box>
    </Box>
  )
}

/** A labelled block inside an AI panel. */
export function AISection({ label, children, sx }) {
  return (
    <Box sx={{ mb: 2.5, "&:last-child": { mb: 0 }, ...sx }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "text.secondary", display: "block", mb: 0.75 }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  )
}
