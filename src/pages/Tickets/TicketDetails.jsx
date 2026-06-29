import { useMemo, useState } from "react"
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
import { ArrowBack, Edit, CheckCircle, Schedule, MoreVert } from "@mui/icons-material"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import Avatar from "../../components/Avatar/Avatar"
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge/StatusBadge"
import AIPanel, { AISection } from "../../components/AIPanel/AIPanel"
import { tickets, users, STATUS, PRIORITY } from "../../data/mockData"
import { formatDate, formatRelativeTime } from "../../utils/format"

export default function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const ticket = useMemo(() => tickets.find((t) => t.id === id), [id])
  const requester = useMemo(() => users.find((u) => u.id === ticket?.createdBy), [ticket])
  const assignee = useMemo(() => users.find((u) => u.id === ticket?.assignedTo), [ticket])

  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(
    ticket
      ? {
          status: ticket.status,
          priority: ticket.priority,
          assignedTo: ticket.assignedTo || "",
        }
      : {},
  )

  if (!ticket) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Ticket not found
        </Typography>
        <Button variant="text" onClick={() => navigate("/tickets")} sx={{ mt: 2 }}>
          Back to tickets
        </Button>
      </Box>
    )
  }

  const handleSaveChanges = () => {
    setEditMode(false)
    // In a real app, this would trigger an API call
  }

  const isOverdue = new Date(ticket.slaDueAt) < new Date()

  return (
    <Box>
      <PageHeader
        title={ticket.id}
        subtitle={ticket.title}
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" size="sm" startIcon={<ArrowBack />} onClick={() => navigate("/tickets")}>
              Back
            </Button>
            <Button size="sm" startIcon={<Edit />} onClick={() => setEditMode(!editMode)}>
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </Box>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Ticket Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ pb: 0 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {ticket.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ticket.description}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mb: 3,
                  pb: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Status
                  </Typography>
                  {editMode ? (
                    <TextField
                      select
                      size="small"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      sx={{ minWidth: 120 }}
                    >
                      {[STATUS.OPEN, STATUS.IN_PROGRESS, STATUS.WAITING, STATUS.RESOLVED, STATUS.CLOSED].map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <StatusBadge status={ticket.status} size="medium" />
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
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      sx={{ minWidth: 120 }}
                    >
                      {[PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL].map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <PriorityBadge priority={ticket.priority} />
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Category
                  </Typography>
                  <Chip label={ticket.category} size="small" variant="outlined" />
                </Box>
              </Box>

              {/* Metadata */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">{formatDate(ticket.createdAt)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeTime(ticket.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      SLA Due
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">{formatDate(ticket.slaDueAt)}</Typography>
                      {isOverdue && (
                        <Chip label="Overdue" size="small" color="error" variant="outlined" />
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Attachments
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {ticket.attachments.map((att) => (
                        <Paper key={att.name} sx={{ p: 1.5, flex: "0 0 auto", cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}>
                          <Typography variant="caption">{att.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.7rem" }}>
                            {att.size}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          {ticket.ai && <AIPanel title="AI Insights">{ticket.ai.summary && <AISection label="Summary">{ticket.ai.summary}</AISection>}</AIPanel>}
        </Grid>

        {/* Right Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                Details
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Assigned to
                </Typography>
                {editMode ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    sx={{ mt: 0.5 }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users
                      .filter((u) => u.role === "agent")
                      .map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.name}
                        </MenuItem>
                      ))}
                  </TextField>
                ) : assignee ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Avatar name={assignee.name} size="sm" />
                    <Box>
                      <Typography variant="body2">{assignee.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {assignee.email}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Unassigned
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Requested by
                </Typography>
                {requester && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Avatar name={requester.name} size="sm" />
                    <Box>
                      <Typography variant="body2">{requester.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {requester.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {editMode && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Button fullWidth onClick={handleSaveChanges} sx={{ mb: 1 }}>
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
