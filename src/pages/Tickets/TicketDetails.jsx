import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Tooltip from "@mui/material/Tooltip"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import { ArrowBack, Edit, Send, Lock, LockOpen, SpeakerNotesOff } from "@mui/icons-material"
import { useAuth } from "../../hooks/useAuth"
import { useTicketDetail } from "../../hooks/useTickets"
import { useUsers } from "../../hooks/useUsers"
import { useAI } from "../../hooks/useDomainHooks"
import apiClient from "../../api/apiClient"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import Avatar from "../../components/Avatar/Avatar"
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge/StatusBadge"
import AIPanel, { AISection } from "../../components/AIPanel/AIPanel"
import FirstFixSteps from "../../components/AIPanel/FirstFixSteps"
import { spacing } from "../../theme/tokens"
import { formatDate, formatRelativeTime, formatDateTime } from "../../utils/format"

const STATUSES = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting for User", value: "waiting_for_user" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
]

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]

// ── Comment bubble ────────────────────────────────────────────────────────────
function CommentBubble({ comment, isAgentOrAdmin }) {
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

// ── Comment composer ──────────────────────────────────────────────────────────
function CommentComposer({ onSubmit, mutating, isAgentOrAdmin }) {
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

// Ticket.ai_first_fix is persisted as either a raw JSON string or an
// already-parsed { steps: [...] } object depending on how it was written —
// normalize both shapes into a plain steps array here, once, so the render
// below can guard on `.length > 0` instead of re-parsing inline.
function parseFirstFixSteps(raw) {
  if (!raw) return []
  try {
    const fixObj = typeof raw === "string" ? JSON.parse(raw) : raw
    return Array.isArray(fixObj?.steps) ? fixObj.steps : []
  } catch {
    return []
  }
}

function parseSimilarTickets(raw) {
  if (!raw) return []
  try {
    const list = typeof raw === "string" ? JSON.parse(raw) : raw
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, isEmployee, isAgentOrAdmin } = useAuth()
  const {
    ticket, loading, error, mutating, mutateError,
    fetchDetail, updateStatus, updateTicket, assign, addComment, clearDetail,
  } = useTicketDetail(id)
  console.log("TICKET:", ticket);
  const { summary, summaryLoading, getTicketSummary } = useAI(id)

  // Agents list for admin assign dropdown
  const { agents, agentsLoading, fetchAgents } = useUsers()

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ status: "", priority: "", agent_id: "" })
  const [saveError, setSaveError] = useState("")
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [commentsCheckDone, setCommentsCheckDone] = useState(false)

  useEffect(() => {
    fetchDetail()
    if (isAgentOrAdmin) getTicketSummary(id)
    if (isAdmin) fetchAgents()
    // Check employee comment permission

    if (isEmployee) {
      apiClient.get("/settings/comment-permissions")
        .then(({ data }) => {
          setCommentsEnabled(data.data?.employee_comments_enabled ?? true)
          setCommentsCheckDone(true)
        })
        .catch(() => {
          setCommentsEnabled(true)
          setCommentsCheckDone(true)
        })
    } else {
      setCommentsCheckDone(true)
    }
    return () => clearDetail()
  }, [id])

  useEffect(() => {
    if (ticket) {
      if (!editMode) {
        setFormData({
          status: ticket.status ?? "",
          priority: ticket.priority ?? "",
          agent_id: ticket.assigned_to ?? "",
        })
      }

      // Polling for background AI updates
      const updatedAt = new Date(ticket.updated_at || ticket.createdAt);
      const aiUpdatedAt = ticket.last_ai_updated_at ? new Date(ticket.last_ai_updated_at) : new Date(0);

      // If AI hasn't updated since the ticket was updated (give it a 1s buffer), poll after 2 seconds
      if (aiUpdatedAt < new Date(updatedAt.getTime() - 1000)) {
        const timer = setTimeout(() => {
          fetchDetail()
        }, 2500)
        return () => clearTimeout(timer)
      }
    }
  }, [ticket, fetchDetail, editMode])

  const handleSaveChanges = async () => {
    setSaveError("")
    let ok = true

    // Update fields (priority)
    const fieldResult = await updateTicket({ priority: formData.priority })
    if (!fieldResult.success) { setSaveError(fieldResult.error ?? "Update failed."); ok = false }

    // Update status if changed
    if (ok && formData.status !== ticket.status) {
      const statusResult = await updateStatus({ status: formData.status })
      if (!statusResult.success) { setSaveError(statusResult.error ?? "Status update failed."); ok = false }
    }

    // Assign agent if changed (admin only)
    if (ok && isAdmin && formData.agent_id !== (ticket.assigned_to ?? "")) {
      const assignResult = await assign(formData.agent_id)
      if (!assignResult.success) { setSaveError(assignResult.error ?? "Assignment failed."); ok = false }
    }

    if (ok) {
      setEditMode(false)
      fetchDetail()
    }
  }

  // ── Render guards ───────────────────────────────────────────────────────────
  if (loading && !ticket) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!ticket && !loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">{error ?? "Ticket not found"}</Typography>
        <Button variant="text" onClick={() => navigate("/tickets")} sx={{ mt: 2 }}>
          Back to tickets
        </Button>
      </Box>
    )
  }

  const isOverdue = (() => {
    const due = ticket?.sla_due_at ?? ticket?.slaDueAt
    if (!due) return false
    const status = ticket?.status ?? ""
    return !["resolved", "closed"].includes(status) && new Date(due) < new Date()
  })()

  const requester = ticket?.creator ?? ticket?.requester ?? ticket?.created_by_user
  const assignee = ticket?.assignee ?? ticket?.assigned_to_user
  const createdAt = ticket?.created_at ?? ticket?.createdAt
  const slaDueAt = ticket?.sla_due_at ?? ticket?.slaDueAt
  const attachments = ticket?.attachments ?? []
  const comments = ticket?.comments ?? []

  return (
    <Box>
      <PageHeader
        title={ticket?.ticket_no ?? ticket?.id ?? id}
        subtitle={ticket?.title}
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" size="sm" startIcon={<ArrowBack />} onClick={() => navigate("/tickets")}>
              Back
            </Button>
            {isAgentOrAdmin && (
              <Button size="sm" startIcon={<Edit />} onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit"}
              </Button>
            )}
          </Box>
        }
      />

      {(error || mutateError || saveError) && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSaveError("")}>
          {saveError || error || mutateError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left column ────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Ticket body */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>{ticket?.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {ticket?.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Status</Typography>
                  {editMode ? (
                    <TextField select size="small" value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                      sx={{ minWidth: 160 }}>
                      {STATUSES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <StatusBadge status={ticket?.status} size="medium" />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Priority</Typography>
                  {editMode ? (
                    <TextField select size="small" value={formData.priority}
                      onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                      sx={{ minWidth: 120 }}>
                      {PRIORITIES.map((p) => (
                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <PriorityBadge priority={ticket?.priority} />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>Category</Typography>
                  <Chip label={ticket?.category?.name ?? ticket?.category ?? "—"} size="small" variant="outlined" />
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2">{formatDate(createdAt)}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatRelativeTime(createdAt)}</Typography>
                  </Box>
                </Grid>
                {slaDueAt && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">SLA Due</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2">{formatDate(slaDueAt)}</Typography>
                        {isOverdue && <Chip label="Overdue" size="small" color="error" variant="outlined" />}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {attachments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {attachments.map((att) => (
                        <Paper key={att.id ?? att.name}
                          sx={{ p: 1.5, flex: "0 0 auto", cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}>
                          <Typography variant="caption">{att.file_name ?? att.filename ?? att.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.7rem" }}>
                            {att.size_display ?? att.file_size_bytes
                              ? `${Math.round((att.file_size_bytes ?? 0) / 1024)} KB`
                              : att.size}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI insights */}
          {(isAgentOrAdmin && (ticket?.ai_summary || ticket?.ai_first_fix || summary)) && (
            <AIPanel title="AI Insights" loading={summaryLoading} sx={{ mb: spacing.panelGap }}>
              {(ticket?.ai_summary || summary?.summary) && (
                <AISection label="Summary">{ticket?.ai_summary || summary?.summary}</AISection>
              )}
              {ticket?.ai_first_fix != null && (
                <AISection label="First Fix">
                  <FirstFixSteps
                    steps={parseFirstFixSteps(ticket.ai_first_fix)}
                    degraded={parseFirstFixSteps(ticket.ai_first_fix).length === 0}
                  />
                </AISection>
              )}
              {(!(parseFirstFixSteps(ticket?.ai_first_fix).length > 0) && summary?.suggested_reply) && (
                <AISection label="Suggested Reply">{summary.suggested_reply}</AISection>
              )}
              {parseSimilarTickets(ticket?.ai_similar_tickets || summary?.similar_tickets).length > 0 && (
                <AISection label="Similar Tickets">
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {parseSimilarTickets(ticket?.ai_similar_tickets || summary?.similar_tickets).map((item, idx) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 1.25,
                          borderRadius: 1,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          borderColor: "divider",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "action.hover",
                          },
                        }}
                        onClick={() => navigate(`/tickets/${item.ticket_id || item.id}`)}
                      >
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700, display: "block" }}>
                          {item.ticket_no}
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500, mt: 0.25 }}>
                          {item.title}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </AISection>
              )}
            </AIPanel>
          )}

          {/* ── Comments section ──────────────────────────────────────────── */}
          <Card sx={{ mt: spacing.panelGap }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Comments {comments.length > 0 && (
                  <Chip label={comments.length} size="small" sx={{ ml: 1, height: 20, fontSize: "0.7rem" }} />
                )}
              </Typography>

              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No comments yet.
                </Typography>
              ) : (
                <Box sx={{ p: 1, }}>
                  {comments.map((c) => (
                    <CommentBubble key={c.id} comment={c} isAgentOrAdmin={isAgentOrAdmin} />
                  ))}
                </Box>
              )}

              {/* Composer — conditionally shown based on permissions */}
              {isEmployee && !commentsEnabled ? (
                <Alert
                  severity="info"
                  icon={<SpeakerNotesOff />}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    "& .MuiAlert-message": { fontWeight: 500 },
                  }}
                >
                  Comments have been disabled by the administrator.
                </Alert>
              ) : (
                <CommentComposer
                  onSubmit={addComment}
                  mutating={mutating}
                  isAgentOrAdmin={isAgentOrAdmin}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right column ───────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Details</Typography>

              {/* Assign to agent (admin only, edit mode) */}
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">Assigned to</Typography>
                {editMode && isAdmin ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={formData.agent_id}
                    onChange={(e) => setFormData((p) => ({ ...p, agent_id: e.target.value }))}
                    sx={{ mt: 0.5 }}
                    disabled={agentsLoading}
                    helperText={agentsLoading ? "Loading agents…" : ""}
                  >
                    <MenuItem value="">— Unassigned —</MenuItem>
                    {agents.map((agent) => (
                      <MenuItem key={agent.id} value={agent.id}>
                        {agent.full_name ?? agent.name}
                        {agent.open_ticket_count != null && (
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({agent.open_ticket_count} open)
                          </Typography>
                        )}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : assignee ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Avatar name={assignee.full_name ?? assignee.name} size="sm" />
                    <Box>
                      <Typography variant="body2">{assignee.full_name ?? assignee.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{assignee.email}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Unassigned</Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">Requested by</Typography>
                {requester ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Avatar name={requester.full_name ?? requester.name} size="sm" />
                    <Box>
                      <Typography variant="body2">{requester.full_name ?? requester.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{requester.email}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>—</Typography>
                )}
              </Box>

              {editMode && isAgentOrAdmin && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Button fullWidth loading={mutating} onClick={handleSaveChanges} sx={{ mb: 1 }}>
                    Save Changes
                  </Button>
                  <Button fullWidth variant="outlined" onClick={() => { setEditMode(false); setSaveError("") }}>
                    Cancel
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Activity / status log */}
          {ticket?.status_logs?.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Activity</Typography>
                {ticket.status_logs.map((log) => (
                  <Box key={log.id}
                    sx={{ display: "flex", gap: 1.5, pb: 1.5, mb: 1.5, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { border: 0, mb: 0, pb: 0 } }}>
                    <Avatar name={log.changed_by_user?.full_name ?? "?"} size="xs" />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        <strong>{log.changed_by_user?.full_name ?? "Someone"}</strong>
                        {" changed status "}
                        {log.from_status && <><em>{log.from_status}</em>{" → "}</>}
                        <em>{log.to_status}</em>
                      </Typography>
                      {log.reason && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontStyle: "italic" }}>
                          "{log.reason}"
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.7rem" }}>
                        {formatDateTime(log.changed_at)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
