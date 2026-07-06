import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Chip from "@mui/material/Chip"

export default function AgentPerformanceTable({ loading, data }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No agent performance data available
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ fontWeight: 700 }}>Agent</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>Assigned</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>Resolved</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>Open</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>Avg Resolution</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700 }}>SLA Compliance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((agent) => (
            <TableRow
              key={agent.agent_id}
              sx={{ "&:hover": { bgcolor: "action.hover" } }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {agent.agent_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {agent.agent_email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Chip label={agent.assigned_tickets} size="small" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Chip label={agent.resolved_tickets} size="small" color="success" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Chip label={agent.open_tickets} size="small" color="info" variant="outlined" />
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">
                  {agent.avg_resolution_hours != null ? `${agent.avg_resolution_hours}h` : "—"}
                </Typography>
              </TableCell>
              <TableCell align="center">
                {agent.sla_compliance_pct != null ? (
                  <Chip
                    label={`${agent.sla_compliance_pct}%`}
                    size="small"
                    color={agent.sla_compliance_pct >= 80 ? "success" : agent.sla_compliance_pct >= 50 ? "warning" : "error"}
                    sx={{ fontWeight: 700 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">—</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
