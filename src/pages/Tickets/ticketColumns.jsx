import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import { WarningAmberRounded, AutoAwesome } from "@mui/icons-material"
import Avatar from "../../components/Avatar/Avatar"
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge/StatusBadge"
import { formatDate, timeFromNow, isOverdue } from "../../utils/format"

/**
 * Column factory for the tickets DataTable.
 * Backend response shape: ticket.requester, ticket.assignee as nested objects,
 * or top-level created_by / assigned_to if the API returns flat format.
 */
export function buildTicketColumns({ showRequester = true, showAssignee = true } = {}) {
  const columns = [
    {
      field: "ticket_no",
      headerName: "Key",
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
          {params.row.ai_suggestion_id && (
            <Tooltip title="AI insights available">
              <AutoAwesome sx={{ fontSize: "0.95rem", color: "secondary.main" }} />
            </Tooltip>
          )}
          {params.value}
        </Box>
      ),
    },
    {
      field: "title",
      headerName: "Summary",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          {isOverdue(params.row) && (
            <Tooltip title="SLA breached">
              <WarningAmberRounded sx={{ fontSize: "1.05rem", color: "error.main", flexShrink: 0 }} />
            </Tooltip>
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.category?.name ?? params.row.category}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => <PriorityBadge priority={params.value} />,
    },
  ]

  if (showRequester) {
    columns.push({
      field: "requester",
      headerName: "Requester",
      width: 170,
      valueGetter: (_val, row) => row.creator?.full_name ?? row.requester?.name ?? row.created_by_user?.name ?? "—",
      renderCell: (params) => {
        const name = params.row.creator?.full_name ?? params.row.requester?.name ?? params.row.created_by_user?.name
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar name={name} size="xs" />
            <Typography variant="body2" noWrap>
              {name ?? "—"}
            </Typography>
          </Box>
        )
      },
    })
  }

  if (showAssignee) {
    columns.push({
      field: "assignee",
      headerName: "Assignee",
      width: 170,
      valueGetter: (_val, row) => row.assignee?.full_name ?? row.assigned_to_user?.name ?? "Unassigned",
      renderCell: (params) => {
        const name = params.row.assignee?.full_name ?? params.row.assigned_to_user?.name
        if (!name)
          return (
            <Typography variant="body2" color="text.secondary">
              Unassigned
            </Typography>
          )
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar name={name} size="xs" />
            <Typography variant="body2" noWrap>
              {name}
            </Typography>
          </Box>
        )
      },
    })
  }

  columns.push(
    {
      field: "created_at",
      headerName: "Created",
      width: 130,
      valueGetter: (_val, row) => row.created_at ?? row.createdAt,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "sla_due_at",
      headerName: "SLA",
      width: 110,
      valueGetter: (_val, row) => row.sla_due_at ?? row.slaDueAt,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: isOverdue(params.row) ? "error.main" : "text.secondary" }}
        >
          {timeFromNow(params.value)}
        </Typography>
      ),
    },
  )

  return columns
}
