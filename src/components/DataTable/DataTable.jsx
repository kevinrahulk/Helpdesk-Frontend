import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { DataGrid } from "@mui/x-data-grid"
import { Inbox } from "@mui/icons-material"
import { dataGridSx, tableDensityRowHeight } from "./style"

function EmptyState({ message }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 6, color: "text.secondary" }}>
      <Inbox sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
      <Typography variant="body2">{message || "No tickets match the current filters."}</Typography>
    </Box>
  )
}

/**
 * Reusable data table built on the MUI X DataGrid (the MUI table template).
 *
 * Props:
 * - rows, columns: standard DataGrid data
 * - onRowClick: row selection callback (row -> details)
 * - density: "compact" | "standard" | "spacious"
 * - pageSize: default rows per page (FRD default = 20)
 * - loading: show loading state
 * - emptyMessage: custom message when no rows
 */
export default function DataTable({
  rows,
  columns,
  onRowClick,
  density = "standard",
  pageSize = 20,
  loading = false,
  emptyMessage,
}) {
  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        onRowClick={(params) => onRowClick?.(params.row)}
        rowHeight={tableDensityRowHeight[density] || tableDensityRowHeight.standard}
        columnHeaderHeight={48}
        disableRowSelectionOnClick
        disableColumnMenu
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize, page: 0 } },
        }}
        slots={{
          noRowsOverlay: () => <EmptyState message={emptyMessage} />,
        }}
        autoHeight
        sx={dataGridSx}
      />
    </Card>
  )
}
