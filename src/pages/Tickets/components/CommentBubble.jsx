import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import { Lock } from "@mui/icons-material"
import Avatar from "../../../components/Avatar/Avatar"
import { formatRelativeTime } from "../../../utils/format"

export default function CommentBubble({ comment, isAgentOrAdmin }) {
  const author = comment.author ?? {}
  const name = author.full_name ?? author.name ?? "Unknown"
  const isInternal = comment.is_internal

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        mb: 2,
        border: isInternal ? "1px dashed" : "1px solid",
        borderColor: isInternal ? "warning.light" : "divider",
        borderRadius: 2,
        bgcolor: isInternal ? "warning.50" : "background.paper",
        transition: "all .2s ease",
        "&:hover": {
          boxShadow: 1,
          bgcolor: isInternal ? "warning.100" : "grey.50",
        },
      }}
    >
      <Avatar name={name} size="sm" />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
            }}
          >
            {name}
          </Typography>

          {author.role && (
            <Chip
              label={author.role}
              size="small"
              variant="outlined"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                textTransform: "capitalize",
              }}
            />
          )}

          {isInternal && isAgentOrAdmin && (
            <Chip
              icon={<Lock sx={{ fontSize: "0.8rem !important" }} />}
              label="Internal"
              size="small"
              color="warning"
              sx={{
                height: 22,
                fontSize: "0.7rem",
              }}
            />
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              ml: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {formatRelativeTime(comment.created_at)}
          </Typography>
        </Box>

        {/* Message */}
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.8,
            color: "text.primary",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {comment.body}
        </Typography>
      </Box>
    </Box>
  )
}
