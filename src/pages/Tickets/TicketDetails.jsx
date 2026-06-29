import { useEffect, useState } from "react"
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
import { ArrowBack, Edit } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useTicketDetail } from "../../../hooks/useTickets"
import { useAI } from "../../../hooks/useDomainHooks"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import Avatar from "../../components/Avatar/Avatar"
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge/StatusBadge"
import AIPanel, { AISection } from "../../components/AIPanel/AIPanel"
import { formatDate, formatRelativeTime } from "../../utils/format"

const STATUSES = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting for User", value: "waiting_for_user" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },]

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]

export default function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAgentOrAdmin } = useAuth()
  const { ticket, loading, error, mutating, mutateError, fetchDetail, updateStatus, updateTicket, clearDetail } = useTicketDetail(id)
  const { summary, summaryLoading, getTicketSummary } = useAI(id)

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ status: "", priority: "", assigned_to: "" })

  useEffect(() => {
    fetchDetail()
    if (isAgentOrAdmin) getTicketSummary(id)
    return () => clearDetail()
  }, [id])

  useEffect(() => {
    if (ticket) {
      setFormData({
        status: ticket.status ?? "",
        priority: ticket.priority ?? "",
        assigned_to: ticket.assigned_to ?? ticket.assignedTo ?? "",
      })
    }
  }, [ticket])

  const handleSaveChanges = async () => {
    const result = await updateTicket({
      priority: formData.priority,
      assigned_to: formData.assigned_to || null,
    })
    if (formData.status !== ticket.status) {
      await updateStatus({ status: formData.status })
    }
    if (result.success) setEditMode(false)
  }

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
        <Typography variant="h6" color="error">
          {error ?? "Ticket not found"}
        </Typography>
        <Button variant="text" onClick={() => navigate("/tickets")} sx={{ mt: 2 }}>
          Back to tickets
        </Button>
      </Box>
    )
  }

  const isOverdue = ticket?.sla_due_at
    ? new Date(ticket.sla_due_at) < new Date()
    : ticket?.slaDueAt
      ? new Date(ticket.slaDueAt) < new Date()
      : false

  const requester = ticket?.requester ?? ticket?.created_by_user
  const assignee = ticket?.assignee ?? ticket?.assigned_to_user
  const createdAt = ticket?.created_at ?? ticket?.createdAt
  const slaDueAt = ticket?.sla_due_at ?? ticket?.slaDueAt
  const attachments = ticket?.attachments ?? []

  return (
    <Box>
      <PageHeader
        title={ticket?.id ?? id}
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

      {(error || mutateError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error ?? mutateError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {ticket?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket?.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 3, pb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Status
                  </Typography>
                  {editMode ? (
                    <TextField
                      select
                      size="small"
                      value={formData.status}
                      onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                      sx={{ minWidth: 140 }}
                    >
                      {STATUSES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <StatusBadge status={ticket?.status} size="medium" />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Priority
                  </Typography>
                  {editMode ? (
                    <TextField
                      select
                      size="small"
                      value={formData.priority}
                      onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                      sx={{ minWidth: 120 }}
                    >
                      {PRIORITIES.map((p) => (
                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <PriorityBadge priority={ticket?.priority} />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Category
                  </Typography>
                  <Chip
                    label={ticket?.category?.name ?? ticket?.category ?? "—"}
                    size="small"
                    variant="outlined"
                  />
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
                        <Paper
                          key={att.id ?? att.name}
                          sx={{ p: 1.5, flex: "0 0 auto", cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                        >
                          <Typography variant="caption">{att.filename ?? att.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.7rem" }}>
                            {att.size_display ?? att.size}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {isAgentOrAdmin && (
            <AIPanel title="AI Insights" loading={summaryLoading}>
              {summary && (
                <>
                  {summary.summary && <AISection label="Summary">{summary.summary}</AISection>}
                  {summary.root_cause && <AISection label="Root Cause">{summary.root_cause}</AISection>}
                  {summary.suggested_reply && <AISection label="Suggested Reply">{summary.suggested_reply}</AISection>}
                </>
              )}
            </AIPanel>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>Details</Typography>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">Assigned to</Typography>
                {editMode && isAgentOrAdmin ? (
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Agent ID or username"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData((p) => ({ ...p, assigned_to: e.target.value }))}
                    sx={{ mt: 0.5 }}
                  />
                ) : assignee ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Avatar name={assignee.name ?? assignee.full_name} size="sm" />
                    <Box>
                      <Typography variant="body2">{assignee.name ?? assignee.full_name}</Typography>
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
                    <Avatar name={requester.name ?? requester.full_name} size="sm" />
                    <Box>
                      <Typography variant="body2">{requester.name ?? requester.full_name}</Typography>
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
                  <Button fullWidth variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
