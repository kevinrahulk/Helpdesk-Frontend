import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { InfoOutlined } from "@mui/icons-material"

/**
 * Renders AI-suggested first-fix steps as a numbered list.
 *
 * Single source of truth for first-fix rendering — reused by
 * CreateTicket.jsx (creation-time suggestion) and TicketDetails.jsx
 * (persisted ticket.ai_first_fix) so the two don't drift.
 *
 * Guards on `steps?.length > 0`, not just truthiness: an empty array is
 * a valid-but-empty AI result, not "no data".
 *
 * Props:
 * - steps: array of step strings (may be empty/undefined)
 * - degraded: pass true when the AI call succeeded but genuinely produced
 *   no self-serve fix (e.g. the backend flagged this suggestion as
 *   degraded and there are no steps). Renders an explicit "AI degraded"
 *   notice instead of silently rendering nothing — which otherwise reads
 *   the same as "still loading" or "the panel crashed".
 */
function normalizeSteps(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return []
  
  // If we have a single string that contains numbered items, split it
  if (steps.length === 1 && typeof steps[0] === "string") {
    const singleStr = steps[0];
    const matches = singleStr.split(/\s*(?:\d+[\.\)]\s+)+/);
    const filtered = matches.map(m => m.trim()).filter(m => m.length > 0);
    if (filtered.length > 1) {
      return filtered;
    }
  }

  return steps.map(step => {
    if (typeof step !== "string") return step;
    return step.replace(/^\s*(?:Step\s+)?\d+[\.\):]\s*/i, "").trim();
  }).filter(step => step.length > 0);
}

export default function FirstFixSteps({ steps, degraded }) {
  const normalized = normalizeSteps(steps)
  if (normalized.length > 0) {
    return (
      <Box component="ol" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {normalized.map((step, idx) => (
          <Typography key={idx} component="li" variant="body2" sx={{ pl: 0.5 }}>
            {step}
          </Typography>
        ))}
      </Box>
    )
  }

  if (degraded) {
    return (
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <InfoOutlined sx={{ fontSize: "1rem", color: "text.secondary", mt: "2px" }} />
        <Typography variant="body2" color="text.secondary">
          AI degraded — no self-serve fix could be generated for this one. It likely needs an agent.
        </Typography>
      </Box>
    )
  }

  return null
}
