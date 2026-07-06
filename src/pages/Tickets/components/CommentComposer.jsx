import { useState, useRef } from "react"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import { Send, Lock, LockOpen } from "@mui/icons-material"
import Button from "../../../components/Button/Button"

export default function CommentComposer({ onSubmit, mutating, isAgentOrAdmin }) {
  const [body, setBody] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [error, setError] = useState("")
  const textRef = useRef(null)

  const handleSubmit = async () => {
    if (!body.trim()) { setError("Comment cannot be empty."); return }
    setError("")
    const result = await onSubmit({ body: body.trim(), is_internal: isInternal })
    if (result?.success) {
      setBody("")
      setIsInternal(false)
    } else if (result?.error) {
      setError(typeof result.error === "string" ? result.error : "Failed to post comment.")
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
        Add a Comment
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 1.5 }}>{error}</Alert>}
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder={isInternal ? "Write an internal note (not visible to employee)…" : "Write a reply or update…"}
        value={body}
        onChange={(e) => { setBody(e.target.value); if (error) setError("") }}
        inputRef={textRef}
        size="small"
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": { borderRadius: 1 },
          ...(isInternal && {
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              bgcolor: "warning.lighter",
              borderColor: "warning.light",
            },
          }),
        }}
      />
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Button
          startIcon={<Send />}
          loading={mutating}
          onClick={handleSubmit}
          disabled={!body.trim()}
        >
          {isInternal ? "Post Internal Note" : "Post Comment"}
        </Button>

        {/* Internal toggle: only agents and admins see this */}
        {isAgentOrAdmin && (
          <Tooltip title={isInternal ? "Only agents and admins can see internal notes" : "Make this an internal-only note"}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {isInternal
                    ? <Lock sx={{ fontSize: "0.9rem", color: "warning.main" }} />
                    : <LockOpen sx={{ fontSize: "0.9rem", color: "text.secondary" }} />}
                  <Typography variant="caption" color={isInternal ? "warning.main" : "text.secondary"}>
                    {isInternal ? "Internal note" : "Public reply"}
                  </Typography>
                </Box>
              }
              sx={{ m: 0 }}
            />
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
