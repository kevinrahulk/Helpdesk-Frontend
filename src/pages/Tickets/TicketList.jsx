import { useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Chip from "@mui/material/Chip"
import { Add, Search, FilterList, Close } from "@mui/icons-material"
import { useAuth } from "../../context/AuthContext"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import DataTable from "../../components/DataTable/DataTable"
import { buildTicketColumns } from "./ticketColumns"
import { tickets as allTickets, STATUS, PRIORITY, ROLES } from "../../data/mockData"
import { scopeTickets } from "../../utils/format"

const STATUSES = [STATUS.OPEN, STATUS.IN_PROGRESS, STATUS.WAITING, STATUS.RESOLVED, STATUS.CLOSED]
const PRIORITIES = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL]

export default function TicketList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchText, setSearchText] = useState(searchParams.get("q") || "")
  const [filterStatus, setFilterStatus] = useState(searchParams.get("status") || "")
  const [filterPriority, setFilterPriority] = useState(searchParams.get("priority") || "")
  const [sortBy, setSortBy] = useState("recent")

  const myTickets = useMemo(() => scopeTickets(allTickets, user), [user])

  const filtered = useMemo(() => {
    let result = [...myTickets]

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      )
    }

    if (filterStatus) {
      result = result.filter((t) => t.status === filterStatus)
    }

    if (filterPriority) {
      result = result.filter((t) => t.priority === filterPriority)
    }

    // Sort
    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === "priority") {
      const priorityOrder = { [PRIORITY.CRITICAL]: 0, [PRIORITY.HIGH]: 1, [PRIORITY.MEDIUM]: 2, [PRIORITY.LOW]: 3 }
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    return result
  }, [myTickets, searchText, filterStatus, filterPriority, sortBy])

  const columns = useMemo(
    () =>
      buildTicketColumns({
        showRequester: user.role !== ROLES.EMPLOYEE,
        showAssignee: true,
      }),
    [user.role],
  )

  const handleClearFilters = () => {
    setSearchText("")
    setFilterStatus("")
    setFilterPriority("")
    setSortBy("recent")
    setSearchParams({})
  }

  const hasFilters = searchText || filterStatus || filterPriority || sortBy !== "recent"

  return (
    <Box>
      <PageHeader
        title="Tickets"
        subtitle={`${filtered.length} ticket${filtered.length !== 1 ? "s" : ""} found`}
        actions={
          <Button
            startIcon={<Add />}
            onClick={() => navigate("/tickets/new")}
            sx={{ backgroundColor: "primary.main", color: "white" }}
          >
            New Ticket
          </Button>
        }
      />

      <Box sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search tickets by ID, title, or description..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "background.paper",
                },
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            >
              <MenuItem value="">All statuses</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            >
              <MenuItem value="">All priorities</MenuItem>
              {PRIORITIES.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
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
              <Chip
                size="small"
                label={`Search: "${searchText}"`}
                onDelete={() => setSearchText("")}
                variant="outlined"
              />
            )}
            {filterStatus && (
              <Chip
                size="small"
                label={`Status: ${filterStatus}`}
                onDelete={() => setFilterStatus("")}
                variant="outlined"
              />
            )}
            {filterPriority && (
              <Chip
                size="small"
                label={`Priority: ${filterPriority}`}
                onDelete={() => setFilterPriority("")}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <DataTable
        rows={filtered}
        columns={columns}
        density="spacious"
        pageSize={20}
        onRowClick={(row) => navigate(`/tickets/${row.id}`)}
        emptyMessage={
          filtered.length === 0 && searchText
            ? `No tickets found matching "${searchText}"`
            : filtered.length === 0
              ? "No tickets"
              : undefined
        }
      />
    </Box>
  )
}
