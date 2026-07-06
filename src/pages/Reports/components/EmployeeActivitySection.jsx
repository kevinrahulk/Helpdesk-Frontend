import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"

export default function EmployeeActivitySection({ loading, data }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (!data) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No employee data
      </Typography>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
            {data.total_tickets_created}
          </Typography>
          <Typography variant="caption" color="text.secondary">Total Created</Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "info.main" }}>
            {data.active_employees}
          </Typography>
          <Typography variant="caption" color="text.secondary">Active Employees</Typography>
        </Box>
      </Box>

      {data.most_active?.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block", fontWeight: 600 }}>
            Most Active Requesters
          </Typography>
          {data.most_active.slice(0, 5).map((emp) => (
            <Box
              key={emp.employee_id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0.8,
                borderBottom: "1px solid",
                borderColor: "divider",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {emp.employee_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {emp.employee_email}
                </Typography>
              </Box>
              <Chip
                label={`${emp.tickets_created} tickets`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}
