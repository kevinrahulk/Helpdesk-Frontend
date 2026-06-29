import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "../Avatar/Avatar"
import { formatDate, formatRelativeTime } from "../../utils/format"

/**
 * Comment card for displaying activity feed entries and user comments.
 * Props:
 * - author: { name: string, email?: string }
 * - content: string
 * - timestamp: ISO date string
 * - type: "comment" | "activity" (affects styling)
 */
export default function Comment({ author, content, timestamp, type = "comment" }) {
  const isActivity = type === "activity"

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        pb: 2,
        mb: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
          mb: 0,
          pb: 0,
        },
      }}
    >
      <Avatar name={author.name} size="sm" />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2">{author.name}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {formatRelativeTime(timestamp)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: isActivity ? "text.secondary" : "text.primary",
            lineHeight: 1.6,
            fontStyle: isActivity ? "italic" : "normal",
          }}
        >
          {content}
        </Typography>

        {author.email && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {author.email}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
