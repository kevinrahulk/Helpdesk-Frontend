import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import {
  ConfirmationNumber,
  HourglassTop,
  CheckCircle,
  WarningAmberRounded,
  Add,
  AutoAwesome,
  TrendingUp,
} from "@mui/icons-material"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/PageHeader/PageHeader"
import StatCard from "../../components/StatCard/StatCard"
import SectionCard from "../../components/SectionCard/SectionCard"
import Button from "../../components/Button/Button"
import DataTable from "../../components/DataTable/DataTable"
import StatusBreakdown from "./StatusBreakdown"
import { buildTicketColumns } from "../Tickets/ticketColumns"
import { tickets as allTickets, STATUS, ROLES } from "../../data/mockData"
import { scopeTickets, isOverdue, roleLabels } from "../../utils/format"
import { statGridSx, splitGridSx } from "./style"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const myTickets = useMemo(() => scopeTickets(allTickets, user), [user])

  const stats = useMemo(() => {
    const open = myTickets.filter((t) => t.status === STATUS.OPEN).length
    const inProgress = myTickets.filter((t) => t.status === STATUS.IN_PROGRESS).length
    const resolved = myTickets.filter((t) => [STATUS.RESOLVED, STATUS.CLOSED].includes(t.status)).length
    const overdue = myTickets.filter((t) => isOverdue(t)).length
    const unassigned = myTickets.filter((t) => !t.assignedTo).length
    return { open, inProgress, resolved, overdue, unassigned, total: myTickets.length }
  }, [myTickets])

  const columns = useMemo(
    () =>
      buildTicketColumns({
        showRequester: user.role !== ROLES.EMPLOYEE,
        showAssignee: user.role !== ROLES.EMPLOYEE,
      }),
    [user.role],
  )

  const recent = useMemo(
    () => [...myTickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6),
    [myTickets],
  )

  const isEmployee = user.role === ROLES.EMPLOYEE

  return (
    <Box>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle={`${roleLabels[user.role]} workspace overview`}
        actions={
          <Button startIcon={<Add />} onClick={() => navigate("/tickets/new")}>
            New Ticket
          </Button>
        }
      />

      <Box sx={statGridSx}>
        <StatCard
          label={isEmployee ? "My open tickets" : "Open"}
          value={stats.open}
          icon={<ConfirmationNumber />}
          tone="primary"
          onClick={() => navigate("/tickets?status=Open")}
        />
        <StatCard
          label="In progress"
          value={stats.inProgress}
          icon={<HourglassTop />}
          tone="info"
          onClick={() => navigate("/tickets?status=In Progress")}
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          icon={<CheckCircle />}
          tone="success"
          onClick={() => navigate("/tickets?status=Resolved")}
        />
        <StatCard
          label={isEmployee ? "Awaiting your reply" : "SLA breached"}
          value={isEmployee ? myTickets.filter((t) => t.status === STATUS.WAITING).length : stats.overdue}
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
          <DataTable rows={recent} columns={columns} density="compact" pageSize={10} onRowClick={(row) => navigate(`/tickets/${row.id}`)} />
        </SectionCard>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SectionCard title="Status breakdown" icon={<TrendingUp sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}>
            <StatusBreakdown
              tickets={myTickets}
              statuses={[STATUS.OPEN, STATUS.IN_PROGRESS, STATUS.WAITING, STATUS.RESOLVED, STATUS.CLOSED]}
            />
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
