import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import { WarningAmberRounded, AutoAwesome } from "@mui/icons-material"
import Avatar from "../../components/Avatar/Avatar"
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge/StatusBadge"
import { getUserById } from "../../data/mockData"
import { formatDate, timeFromNow, isOverdue } from "../../utils/format"

/**
 * Column factory for the tickets DataTable.
 * Pass options to tailor columns per role/context.
 */
export function buildTicketColumns({ showRequester = true, showAssignee = true } = {}) {
  const columns = [
    {
      field: "id",
      headerName: "Key",
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontWeight: 600 }}>
          {params.row.ai?.confidence != null && (
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
              {params.row.category}
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
      field: "createdBy",
      headerName: "Requester",
      width: 170,
      valueGetter: (value) => getUserById(value)?.name || "—",
      renderCell: (params) => {
        const u = getUserById(params.row.createdBy)
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar name={u?.name} size="xs" />
            <Typography variant="body2" noWrap>
              {u?.name || "—"}
            </Typography>
          </Box>
        )
      },
    })
  }

  if (showAssignee) {
    columns.push({
      field: "assignedTo",
      headerName: "Assignee",
      width: 170,
      valueGetter: (value) => getUserById(value)?.name || "Unassigned",
      renderCell: (params) => {
        const u = getUserById(params.row.assignedTo)
        if (!u)
          return (
            <Typography variant="body2" color="text.secondary">
              Unassigned
            </Typography>
          )
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar name={u.name} size="xs" />
            <Typography variant="body2" noWrap>
              {u.name}
            </Typography>
          </Box>
        )
      },
    })
  }

  columns.push(
    {
      field: "createdAt",
      headerName: "Created",
      width: 130,
      valueGetter: (value) => value,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "slaDueAt",
      headerName: "SLA",
      width: 110,
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
