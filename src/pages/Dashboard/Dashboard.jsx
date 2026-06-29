import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import {
  ConfirmationNumber,
  HourglassTop,
  CheckCircle,
  WarningAmberRounded,
  Add,
  AutoAwesome,
  TrendingUp,
} from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useDashboard } from "../../../hooks/useDomainHooks"
import PageHeader from "../../components/PageHeader/PageHeader"
import StatCard from "../../components/StatCard/StatCard"
import SectionCard from "../../components/SectionCard/SectionCard"
import Button from "../../components/Button/Button"
import DataTable from "../../components/DataTable/DataTable"
import StatusBreakdown from "./StatusBreakdown"
import { buildTicketColumns } from "../Tickets/ticketColumns"
import { roleLabels } from "../../utils/format"
import { statGridSx, splitGridSx } from "./style"

export default function Dashboard() {
  const { user, role, isEmployee, isAgentOrAdmin } = useAuth()
  const { data, loading, error, fetch: fetchDashboard } = useDashboard()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const columns = buildTicketColumns({
    showRequester: !isEmployee,
    showAssignee: !isEmployee,
  })

  const recentTickets = data?.recent_tickets ?? data?.recently_assigned ?? []

  // Build stat values from the role-specific dashboard shape
  const stats = {
    open: data?.open_tickets ?? data?.assigned_open ?? 0,
    inProgress: data?.in_progress_tickets ?? data?.assigned_in_progress ?? 0,
    resolved: data?.closed_tickets ?? 0,
    sla: isEmployee
      ? (data?.waiting_tickets ?? 0)
      : (data?.overdue_tickets ?? data?.sla_breached ?? 0),
  }

  const statusRows = recentTickets.map((t) => ({ ...t, id: t.id ?? t.ticket_id }))

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`}
        subtitle={`${roleLabels[role] ?? role} workspace overview`}
        actions={
          <Button startIcon={<Add />} onClick={() => navigate("/tickets/new")}>
            New Ticket
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={statGridSx}>
        <StatCard
          label={isEmployee ? "My open tickets" : "Open"}
          value={stats.open}
          icon={<ConfirmationNumber />}
          tone="primary"
          onClick={() => navigate("/tickets?status=open")}
        />
        <StatCard
          label="In progress"
          value={stats.inProgress}
          icon={<HourglassTop />}
          tone="info"
          onClick={() => navigate("/tickets?status=in_progress")}
        />
        <StatCard
          label="Resolved / Closed"
          value={stats.resolved}
          icon={<CheckCircle />}
          tone="success"
          onClick={() => navigate("/tickets?status=resolved")}
        />
        <StatCard
          label={isEmployee ? "Awaiting your reply" : "SLA breached"}
          value={stats.sla}
          icon={<WarningAmberRounded />}
          tone={isEmployee ? "warning" : "error"}
          onClick={() => navigate("/tickets")}
        />
      </Box>

      <Box sx={splitGridSx}>
        <SectionCard
          title={isEmployee ? "My recent tickets" : "Recent activity"}
          action={
            <Button variant="text" size="small" onClick={() => navigate("/tickets")}>
              View all
            </Button>
          }
          padding="sm"
        >
          <DataTable
            rows={statusRows}
            columns={columns}
            density="compact"
            pageSize={10}
            onRowClick={(row) => navigate(`/tickets/${row.id}`)}
          />
        </SectionCard>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SectionCard title="Status breakdown" icon={<TrendingUp sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}>
            <StatusBreakdown tickets={statusRows} />
          </SectionCard>

          <SectionCard
            title="AI assistant"
            icon={<AutoAwesome sx={{ fontSize: "1.1rem", color: "secondary.main" }} />}
            sx={{ borderColor: "secondary.main" }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {isEmployee
                ? "Describe your issue when creating a ticket and the AI suggests a category, priority, and first-fix steps instantly."
                : "AI auto-triages incoming tickets, drafts suggested replies, and surfaces similar past tickets to speed up resolution."}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
              <Typography variant="caption" color="text.secondary">
                AI triage online
              </Typography>
            </Box>
          </SectionCard>
        </Box>
      </Box>
    </Box>
  )
}
