// Shared styling for the MUI DataGrid-based table so every list looks consistent.
export const dataGridSx = {
  border: "none",
  "--DataGrid-rowBorderColor": "transparent",
  "& .MuiDataGrid-columnHeaders": {
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  "& .MuiDataGrid-columnHeader": {
    bgcolor: "background.paper",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "text.secondary",
  },
  "& .MuiDataGrid-cell": {
    borderBottom: "1px solid",
    borderColor: "divider",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    outline: "none !important",
  },
  "& .MuiDataGrid-row": {
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  "& .MuiDataGrid-row:hover": {
    bgcolor: "action.hover",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid",
    borderColor: "divider",
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
}

export const tableDensityRowHeight = {
  compact: 44,
  standard: 56,
  spacious: 64,
}
