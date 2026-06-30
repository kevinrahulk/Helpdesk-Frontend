import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import { Add, Search, Close } from "@mui/icons-material"
import { useAuth } from "../../../hooks/useAuth"
import { useTickets } from "../../../hooks/useTickets"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import DataTable from "../../components/DataTable/DataTable"
import { buildTicketColumns } from "./ticketColumns"

const STATUSES = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting for User", value: "waiting_for_user" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
]
const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]
export default function TicketList() {
  const { isEmployee } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchText, setSearchText] = useState(searchParams.get("q") || "")
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "")
  const [filterPriority, setFilterPriority] = useState(searchParams.get("priority") || "")
  const [sortBy, setSortBy] = useState("recent")

  const { tickets, total, loading, error, fetch } = useTickets()

  // Always refetch on mount to ensure fresh data after navigating back
  useEffect(() => {
    const params = {}
    if (filterStatus) params.status = filterStatus
    if (filterPriority) params.priority = filterPriority
    if (searchText.trim()) params.search = searchText.trim()
    fetch(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, filterStatus, filterPriority])

  const filtered = useMemo(() => {
    let result = [...tickets]

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(
        (t) =>
          (t.ticket_no ?? "").toLowerCase().includes(q) ||
          (t.id ?? "").toLowerCase().includes(q) ||
          (t.title ?? "").toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q),
      )
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.created_at ?? b.createdAt) - new Date(a.created_at ?? a.createdAt))
    } else if (sortBy === "priority") {
      const order = { critical: 0, high: 1, medium: 2, low: 3 }
      result.sort((a, b) => (order[a.priority] ?? 99) - (order[b.priority] ?? 99))
    }

    return result
  }, [tickets, searchText, sortBy])

  const columns = useMemo(
    () =>
      buildTicketColumns({
        showRequester: !isEmployee,
        showAssignee: true,
      }),
    [isEmployee],
  )

  const handleClearFilters = () => {
    setSearchText("")
    setFilterStatus("")
    setFilterPriority("")
    setSortBy("recent")
    setSearchParams({})
    fetch({})
  }

  const hasFilters = searchText || filterStatus || filterPriority || sortBy !== "recent"

  return (
    <Box>
      <PageHeader
        title="Tickets"
        subtitle={`${total} ticket${total !== 1 ? "s" : ""} found`}
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

      <Box sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search tickets by ID, title, or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetch({ search: searchText.trim(), status: filterStatus, priority: filterPriority })
              }}
              InputProps={{ startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} /> }}
              size="small"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1, bgcolor: "background.paper" } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {STATUSES.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
            >
              <MenuItem value="">All priorities</MenuItem>
              {PRIORITIES.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
            >
              <MenuItem value="recent">Most recent</MenuItem>
              <MenuItem value="priority">By priority</MenuItem>
            </TextField>
          </Grid>

          {hasFilters && (
            <Grid size={{ xs: 12, sm: "auto" }}>
              <Button size="sm" variant="outlined" startIcon={<Close />} onClick={handleClearFilters}>
                Clear
              </Button>
            </Grid>
          )}
        </Grid>

        {(searchText || filterStatus || filterPriority) && (
          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {searchText && (
              <Chip size="small" label={`Search: "${searchText}"`} onDelete={() => setSearchText("")} variant="outlined" />
            )}
            {filterStatus && (
              <Chip size="small" label={`Status: ${filterStatus}`} onDelete={() => setFilterStatus("")} variant="outlined" />
            )}
            {filterPriority && (
              <Chip size="small" label={`Priority: ${filterPriority}`} onDelete={() => setFilterPriority("")} variant="outlined" />
            )}
          </Box>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          density="spacious"
          pageSize={20}
          onRowClick={(row) => navigate(`/tickets/${row.id}`)}
          emptyMessage={
            filtered.length === 0 && searchText
              ? `No tickets found matching "${searchText}"`
              : "No tickets"
          }
        />
      )}
    </Box>
  )
}
