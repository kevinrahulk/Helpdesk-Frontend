import { useEffect, useState, useCallback } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Chip from "@mui/material/Chip"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import TextField from "@mui/material/TextField"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Link from "@mui/material/Link"
import { alpha, useTheme } from "@mui/material/styles"
import {
  Refresh,
  Settings,
  Speed,
  ConfirmationNumber,
  HourglassTop,
  CheckCircle,
  WarningAmberRounded,
  Close,
  ChevronRight,
  ExpandMore,
  Troubleshoot,
  Check,
  ErrorOutline,
  Storage,
  Hub,
  Build,
  SmartToy,
  Search,
  AccountTree,
} from "@mui/icons-material"
import { BarChart, LineChart } from "@mui/x-charts"

import apiClient from "../../api/apiClient"
import PageHeader from "../../components/PageHeader/PageHeader"
import StatCard from "../../components/StatCard/StatCard"
import SectionCard from "../../components/SectionCard/SectionCard"
import Button from "../../components/Button/Button"
import DataTable from "../../components/DataTable/DataTable"

// Helper to determine node icons based on run_type
function getNodeIcon(runType, size = "small") {
  const sx = { fontSize: size === "small" ? "1.1rem" : "1.4rem", color: "primary.main" }
  switch (runType?.toLowerCase()) {
    case "chain":
    case "graph":
      return <Hub sx={sx} />
    case "llm":
      return <SmartToy sx={{ ...sx, color: "secondary.main" }} />
    case "tool":
      return <Build sx={{ ...sx, color: "warning.main" }} />
    case "retriever":
      return <Search sx={{ ...sx, color: "info.main" }} />
    default:
      return <AccountTree sx={sx} />
  }
}

// Recursive component for drawing trace node hierarchy
function TraceNode({ node, level = 0 }) {
  const [expanded, setExpanded] = useState(level === 0)
  const [inputsExpanded, setInputsExpanded] = useState(false)
  const [outputsExpanded, setOutputsExpanded] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  const theme = useTheme()
  const isLight = theme.palette.mode === "light"

  const latencyStr = node.latency_ms != null
    ? node.latency_ms >= 1000
      ? `${(node.latency_ms / 1000).toFixed(2)}s`
      : `${Math.round(node.latency_ms)}ms`
    : "running"

  const tokenStr = node.total_tokens
    ? `${node.total_tokens} tkn`
    : null

  return (
    <Box
      sx={{
        ml: level > 0 ? 3 : 0,
        pl: level > 0 ? 2 : 0,
        borderLeft: level > 0 ? `1px dashed ${theme.palette.divider}` : "none",
        position: "relative",
        mb: 2,
        "&::before": level > 0 ? {
          content: '""',
          position: "absolute",
          top: 16,
          left: 0,
          width: 12,
          height: 1,
          borderBottom: `1px dashed ${theme.palette.divider}`,
        } : {},
      }}
    >
      {/* Node Info Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1.25,
          borderRadius: 2,
          bgcolor: level === 0
            ? alpha(theme.palette.primary.main, 0.08)
            : "background.paper",
          border: `1px solid ${level === 0 ? theme.palette.primary.main : theme.palette.divider}`,
          flexWrap: "wrap",
        }}
      >
        {hasChildren && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0.25 }}>
            <ExpandMore
              sx={{
                transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </IconButton>
        )}
        
        {getNodeIcon(node.run_type)}
        
        <Box sx={{ flexGrow: 1, minWidth: 150 }}>
          <Typography variant="subtitle2" sx={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {node.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", fontSize: "0.65rem", fontWeight: 700 }}>
            {node.run_type}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {tokenStr && (
            <Chip
              label={tokenStr}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.7rem", fontWeight: 600 }}
            />
          )}

          <Chip
            label={latencyStr}
            size="small"
            color={node.status === "error" ? "error" : "default"}
            sx={{
              height: 20,
              fontSize: "0.75rem",
              fontWeight: 700,
              bgcolor: node.status === "error"
                ? alpha(theme.palette.error.main, 0.12)
                : node.latency_ms ? alpha(theme.palette.action.hover, 0.8) : "warning.main",
            }}
          />

          <Chip
            label={node.status}
            size="small"
            color={node.status === "success" ? "success" : node.status === "error" ? "error" : "warning"}
            sx={{ height: 20, fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 700 }}
          />
        </Box>
      </Box>

      {/* Inputs / Outputs Accordions */}
      <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5, pl: hasChildren ? 4 : 0 }}>
        {node.error && (
          <Alert severity="error" sx={{ py: 0.25, px: 1.5, my: 0.5, fontSize: "0.8rem", borderRadius: 1.5 }}>
            {node.error}
          </Alert>
        )}
        
        {node.inputs && Object.keys(node.inputs).length > 0 && (
          <Accordion
            expanded={inputsExpanded}
            onChange={() => setInputsExpanded(!inputsExpanded)}
            disableGutters
            square={false}
            sx={{
              bgcolor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "6px !important",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 32, height: 32, px: 1.5 }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {level === 0 ? "Initial Graph State" : "Input State"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <pre
                style={{
                  margin: 0,
                  padding: "10px",
                  backgroundColor: isLight ? "#f4f5f7" : "#0e1117",
                  color: isLight ? "#172b4d" : "#e6edf3",
                  borderRadius: "0 0 6px 6px",
                  fontFamily: '"SFMono-Medium", "SF Mono", "Segoe UI Mono", monospace',
                  fontSize: "0.75rem",
                  overflowX: "auto",
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                {JSON.stringify(node.inputs, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
        )}

        {node.outputs && Object.keys(node.outputs).length > 0 && (
          <Accordion
            expanded={outputsExpanded}
            onChange={() => setOutputsExpanded(!outputsExpanded)}
            disableGutters
            square={false}
            sx={{
              bgcolor: "transparent",
              backgroundImage: "none",
              boxShadow: "none",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "6px !important",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 32, height: 32, px: 1.5 }}>
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                {level === 0 ? "Final Graph State" : "State Updates"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <pre
                style={{
                  margin: 0,
                  padding: "10px",
                  backgroundColor: isLight ? "#f4f5f7" : "#0e1117",
                  color: isLight ? "#172b4d" : "#e6edf3",
                  borderRadius: "0 0 6px 6px",
                  fontFamily: '"SFMono-Medium", "SF Mono", "Segoe UI Mono", monospace',
                  fontSize: "0.75rem",
                  overflowX: "auto",
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                {JSON.stringify(node.outputs, null, 2)}
              </pre>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Recursive Children Spans */}
      {expanded && hasChildren && (
        <Box sx={{ mt: 1.5 }}>
          {node.children.map((child) => (
            <TraceNode key={child.id} node={child} level={level + 1} />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default function Observability() {
  const theme = useTheme()
  
  // States
  const [status, setStatus] = useState({
    tracing_enabled: false,
    connected: false,
    project: "helpdesk-assistant",
    endpoint: "https://api.smith.langchain.com",
    has_api_key: false,
    error: null,
  })
  const [stats, setStats] = useState({
    total_runs: 0,
    success_count: 0,
    error_count: 0,
    success_rate_pct: 0,
    avg_latency_ms: 0,
    total_prompt_tokens: 0,
    total_completion_tokens: 0,
    total_tokens: 0,
    runs_by_day: {},
    latency_by_name: {},
  })
  const [runs, setRuns] = useState([])
  
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingRuns, setLoadingRuns] = useState(true)
  const [globalError, setGlobalError] = useState(null)
  
  // Configuration Dialog Form States
  const [configOpen, setConfigOpen] = useState(false)
  const [formTracingEnabled, setFormTracingEnabled] = useState(false)
  const [formApiKey, setFormApiKey] = useState("")
  const [formProject, setFormProject] = useState("helpdesk-assistant")
  const [formEndpoint, setFormEndpoint] = useState("https://api.smith.langchain.com")
  const [savingConfig, setSavingConfig] = useState(false)
  const [configError, setConfigError] = useState(null)

  // Trace Details Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRunId, setSelectedRunId] = useState(null)
  const [runDetail, setRunDetail] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [detailError, setDetailError] = useState(null)

  // API Callbacks
  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true)
    try {
      const res = await apiClient.get("/observability/status")
      if (res.data?.success) {
        setStatus(res.data.data)
        // Preset form values
        setFormTracingEnabled(res.data.data.tracing_enabled)
        setFormProject(res.data.data.project)
        setFormEndpoint(res.data.data.endpoint)
        setFormApiKey(res.data.data.has_api_key ? "••••••••••••••••" : "")
      }
    } catch (err) {
      // Ignored
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const res = await apiClient.get("/observability/stats")
      if (res.data?.success) {
        setStats(res.data.data)
      }
    } catch (err) {
      // Ignored
    } finally {
      setLoadingStats(false)
    }
  }, [])

  const fetchRuns = useCallback(async () => {
    setLoadingRuns(true)
    setGlobalError(null)
    try {
      const res = await apiClient.get("/observability/runs")
      if (res.data?.success) {
        setRuns(res.data.data || [])
      }
    } catch (err) {
      setGlobalError(err.response?.data?.detail || "Failed to load recent traces.")
    } finally {
      setLoadingRuns(false)
    }
  }, [])

  const fetchAll = useCallback(() => {
    fetchStatus()
    fetchStats()
    fetchRuns()
  }, [fetchStatus, fetchStats, fetchRuns])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Save Configuration Handler
  const handleSaveConfig = async () => {
    setSavingConfig(true)
    setConfigError(null)
    
    // If the user left it as placeholders, don't submit the dots
    const cleanApiKey = formApiKey === "••••••••••••••••" ? null : formApiKey

    try {
      const res = await apiClient.post("/observability/config", {
        tracing_enabled: formTracingEnabled,
        api_key: cleanApiKey,
        project: formProject,
        endpoint: formEndpoint,
      })
      
      if (res.data?.success) {
        setStatus(res.data.data)
        setConfigOpen(false)
        fetchAll()
      }
    } catch (err) {
      setConfigError(err.response?.data?.detail || "Failed to update configuration.")
    } finally {
      setSavingConfig(false)
    }
  }

  // View Spans Drawer Handler
  const handleViewSpans = async (runId) => {
    setSelectedRunId(runId)
    setDrawerOpen(true)
    setLoadingDetail(true)
    setDetailError(null)
    setRunDetail(null)

    try {
      const res = await apiClient.get(`/observability/runs/${runId}`)
      if (res.data?.success) {
        setRunDetail(res.data.data)
      }
    } catch (err) {
      setDetailError(err.response?.data?.detail || "Failed to load span details.")
    } finally {
      setLoadingDetail(false)
    }
  }

  // Pre-process chart data
  const lineChartData = Object.entries(stats.runs_by_day || {})
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const barChartData = Object.entries(stats.latency_by_name || {})
    .map(([name, latency]) => ({ name, latency }))

  // DataGrid Columns for Trace runs
  const columns = [
    {
      field: "id",
      headerName: "Trace ID",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          onClick={() => handleViewSpans(params.row.id)}
          sx={{
            fontFamily: "monospace",
            fontSize: "0.8rem",
            fontWeight: 700,
            cursor: "pointer",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Chain Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Chip
          icon={getNodeIcon(params.row.run_type)}
          label={params.value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: "latency_ms",
      headerName: "Latency",
      width: 120,
      valueGetter: (value) => value,
      renderCell: (params) => {
        const val = params.value
        if (val == null) return <Typography variant="body2" color="text.secondary">—</Typography>
        const formatted = val >= 1000 ? `${(val / 1000).toFixed(2)}s` : `${Math.round(val)}ms`
        return (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {formatted}
          </Typography>
        )
      },
    },
    {
      field: "total_tokens",
      headerName: "Tokens",
      width: 110,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? `${params.value} total` : "—"}
        </Typography>
      ),
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 180,
      renderCell: (params) => {
        if (!params.value) return "—"
        try {
          return new Date(params.value).toLocaleString()
        } catch {
          return params.value
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const success = params.value === "success"
        return (
          <Chip
            label={params.value}
            size="small"
            color={success ? "success" : params.value === "error" ? "error" : "warning"}
            sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: "0.7rem", height: 22 }}
          />
        )
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="xs"
          onClick={() => handleViewSpans(params.row.id)}
        >
          View Spans
        </Button>
      ),
    },
  ]

  return (
    <Box>
      <PageHeader
        title="LangSmith Observability"
        subtitle="Configure, trace, and audit LangGraph LLM chains in real time."
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="sm"
              startIcon={<Settings />}
              onClick={() => setConfigOpen(true)}
            >
              Configure API
            </Button>
            <Button
              variant="contained"
              size="sm"
              startIcon={<Refresh />}
              onClick={fetchAll}
              loading={loadingStatus || loadingStats || loadingRuns}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {/* Tracing Config Connection Box */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Storage sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  LangSmith Connection
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  {status.tracing_enabled ? (
                    <Chip
                      icon={status.connected ? <Check fontSize="small" /> : <Close fontSize="small" />}
                      label={status.connected ? "Connected" : "API Connection Error"}
                      color={status.connected ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  ) : (
                    <Chip
                      label="Tracing Disabled"
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  )}
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Project:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{status.project || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0, mr: 1 }}>Endpoint:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {status.endpoint}
                  </Typography>
                </Box>
              </Box>

              {status.error && (
                <Alert severity="error" sx={{ mt: 2, py: 0.2, px: 1.5, fontSize: "0.8rem", borderRadius: 1.5 }}>
                  {status.error}
                </Alert>
              )}

              {status.tracing_enabled && status.connected && (
                <Box sx={{ mt: 2 }}>
                  <Link
                    href={`https://smith.langchain.com/o/arm/projects/p/${status.project}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Open LangSmith Dashboard ↗
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tracing Analytics Stats */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2.5,
              height: "100%",
            }}
          >
            <StatCard
              label="Traced Executions"
              value={stats.total_runs ?? 0}
              icon={<ConfirmationNumber />}
              tone="primary"
              hint="Total root chains logged"
            />
            <StatCard
              label="Success Rate"
              value={stats.total_runs > 0 ? `${stats.success_rate_pct}%` : "—"}
              icon={<CheckCircle />}
              tone={stats.success_rate_pct >= 90 ? "success" : stats.success_rate_pct >= 70 ? "warning" : "error"}
              hint={`${stats.success_count} succeeded / ${stats.error_count} failed`}
            />
            <StatCard
              label="Avg Chain Latency"
              value={stats.total_runs > 0 ? (stats.avg_latency_ms >= 1000 ? `${(stats.avg_latency_ms / 1000).toFixed(2)}s` : `${Math.round(stats.avg_latency_ms)}ms`) : "—"}
              icon={<Speed />}
              tone="info"
              hint="End-to-end execution time"
            />
            <StatCard
              label="Tokens Consumed"
              value={stats.total_tokens ? stats.total_tokens.toLocaleString() : "0"}
              icon={<HourglassTop />}
              tone="warning"
              hint={`${stats.total_prompt_tokens.toLocaleString()} prompt / ${stats.total_completion_tokens.toLocaleString()} comp.`}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Visual Analytics Charts */}
      {status.tracing_enabled && stats.total_runs > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Daily runs trends */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <SectionCard
              title="Execution Volume Trend"
              icon={<Troubleshoot sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
            >
              {loadingStats ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : lineChartData.length > 0 ? (
                <Box sx={{ height: 280, width: "100%" }}>
                  <LineChart
                    xAxis={[{
                      data: lineChartData.map((d) => d.date),
                      scaleType: "band",
                      label: "Date",
                    }]}
                    series={[{
                      data: lineChartData.map((d) => d.count),
                      label: "Executions",
                      color: theme.palette.primary.main,
                      area: true,
                    }]}
                    height={260}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No volume data available.
                </Typography>
              )}
            </SectionCard>
          </Grid>

          {/* Average latency by chain name */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <SectionCard
              title="Avg Latency by Chain (ms)"
              icon={<Speed sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
            >
              {loadingStats ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : barChartData.length > 0 ? (
                <Box sx={{ height: 280, width: "100%" }}>
                  <BarChart
                    xAxis={[{
                      data: barChartData.map((d) => d.name),
                      scaleType: "band",
                    }]}
                    series={[{
                      data: barChartData.map((d) => d.latency),
                      label: "Latency (ms)",
                      color: theme.palette.secondary.main,
                    }]}
                    height={260}
                  />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                  No latency breakdown available.
                </Typography>
              )}
            </SectionCard>
          </Grid>
        </Grid>
      )}

      {/* Traces List Table */}
      <SectionCard
        title="Traces Run Log"
        icon={<Troubleshoot sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
        sx={{ mb: 4 }}
      >
        {globalError ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {globalError}
          </Alert>
        ) : (
          <DataTable
            rows={runs}
            columns={columns}
            loading={loadingRuns}
            emptyMessage={
              !status.tracing_enabled
                ? "LangSmith tracing is disabled. Use 'Configure API' to enable tracing."
                : "No executions have been traced yet."
            }
          />
        )}
      </SectionCard>

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Configure LangSmith API</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formTracingEnabled}
                  onChange={(e) => setFormTracingEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Enable LangChain Tracing (LANGCHAIN_TRACING_V2)"
            />

            <TextField
              label="LangSmith API Key"
              type="password"
              placeholder="Enter your api key"
              value={formApiKey}
              onChange={(e) => setFormApiKey(e.target.value)}
              disabled={!formTracingEnabled}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="LangSmith Project Name"
              value={formProject}
              onChange={(e) => setFormProject(e.target.value)}
              disabled={!formTracingEnabled}
              fullWidth
              variant="outlined"
            />

            <TextField
              label="LangSmith Endpoint Url"
              value={formEndpoint}
              onChange={(e) => setFormEndpoint(e.target.value)}
              disabled={!formTracingEnabled}
              fullWidth
              variant="outlined"
            />

            {configError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {configError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button variant="outlined" onClick={() => setConfigOpen(false)} disabled={savingConfig}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveConfig} loading={savingConfig}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trace Spans Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", md: "60%" },
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundImage: "none",
            bgcolor: "background.default",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Trace Run Details
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>
              ID: {selectedRunId}
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        {loadingDetail ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 12, gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">Fetching trace node hierarchy...</Typography>
          </Box>
        ) : detailError ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {detailError}
          </Alert>
        ) : runDetail ? (
          <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
            {/* Run summary parameters */}
            <Card sx={{ mb: 3, bgcolor: alpha(theme.palette.action.hover, 0.4) }}>
              <CardContent sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>NAME</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{runDetail.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>TOTAL LATENCY</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {runDetail.latency_ms != null
                      ? runDetail.latency_ms >= 1000
                        ? `${(runDetail.latency_ms / 1000).toFixed(2)}s`
                        : `${Math.round(runDetail.latency_ms)}ms`
                      : "running"
                    }
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>TOTAL TOKENS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {runDetail.total_tokens ? runDetail.total_tokens.toLocaleString() : "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontWeight: 700 }}>STATUS</Typography>
                  <Chip
                    label={runDetail.status}
                    size="small"
                    color={runDetail.status === "success" ? "success" : runDetail.status === "error" ? "error" : "warning"}
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", mt: 0.2 }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Execution Spans Tree
            </Typography>

            <Box sx={{ pl: 0.5 }}>
              <TraceNode node={runDetail} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6, color: "text.secondary" }}>
            <ErrorOutline sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No trace detail retrieved.</Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}
