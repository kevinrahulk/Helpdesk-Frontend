import { useEffect, useState, useCallback } from "react"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import Divider from "@mui/material/Divider"
import Chip from "@mui/material/Chip"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import LinearProgress from "@mui/material/LinearProgress"
import { alpha } from "@mui/material/styles"
import {
  Assessment,
  FileDownload,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  People,
  Speed,
  ConfirmationNumber,
  CheckCircle,
  HourglassTop,
  WarningAmberRounded,
  AccessTime,
  Category,
} from "@mui/icons-material"
import { BarChart, PieChart, LineChart } from "@mui/x-charts"

import { useReports } from "../../hooks/useDomainHooks"
import PageHeader from "../../components/PageHeader/PageHeader"
import StatCard from "../../components/StatCard/StatCard"
import SectionCard from "../../components/SectionCard/SectionCard"
import Button from "../../components/Button/Button"
import apiClient from "../../api/apiClient"
import AgentPerformanceTable from "./components/AgentPerformanceTable"
import EmployeeActivitySection from "./components/EmployeeActivitySection"

const VOLUME_GROUPS = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
  { label: "Monthly", value: "month" },
]

const PRIORITY_COLORS = {
  low: "#66bb6a",
  medium: "#42a5f5",
  high: "#ffa726",
  critical: "#ef5350",
}

export default function Reports() {
  const {
    summary,
    summaryLoading,
    summaryError,
    agentPerformance,
    agentPerformanceLoading,
    ticketVolume,
    volumeLoading,
    categoryDistribution,
    categoryLoading,
    priorityDistribution,
    priorityLoading,
    employeeActivity,
    employeeLoading,
    fetchAll,
    fetchVolume,
  } = useReports()

  const [volumeGroup, setVolumeGroup] = useState("month")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleVolumeGroupChange = (group) => {
    setVolumeGroup(group)
    fetchVolume({ groupby: group })
  }

  const handleExport = useCallback(async (format) => {
    setExporting(true)
    try {
      const response = await apiClient.get("/reports/export", {
        params: { format },
        responseType: "blob",
      })
      const ext = format === "excel" ? "xls" : "csv"
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `tickets_report.${ext}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      // silently fail
    } finally {
      setExporting(false)
    }
  }, [])

  const handlePrintPdf = () => {
    window.print()
  }

  const anyLoading = summaryLoading || agentPerformanceLoading || volumeLoading ||
    categoryLoading || priorityLoading || employeeLoading

  if (anyLoading && !summary) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  const sla = summary?.sla_compliance

  // Chart palette
  const chartPalette = ["#5c6bc0", "#26a69a", "#ffa726", "#ef5350", "#ab47bc", "#42a5f5", "#66bb6a", "#ec407a"]

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Comprehensive insights into your helpdesk operations"
        actions={
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="sm"
              startIcon={<FileDownload />}
              onClick={() => handleExport("csv")}
              loading={exporting}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              size="sm"
              startIcon={<FileDownload />}
              onClick={() => handleExport("excel")}
              loading={exporting}
            >
              Export Excel
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={handlePrintPdf}
            >
              Print / PDF
            </Button>
          </Box>
        }
      />

      {summaryError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {summaryError}
        </Alert>
      )}

      {/* ── Overview Stat Cards ──────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2.5,
          mb: 4,
        }}
      >
        <StatCard
          label="Total Tickets"
          value={summary?.total_tickets ?? 0}
          icon={<ConfirmationNumber />}
          tone="default"
        />
        <StatCard
          label="Open"
          value={summary?.open_tickets ?? 0}
          icon={<ConfirmationNumber />}
          tone="primary"
        />
        <StatCard
          label="In Progress"
          value={summary?.in_progress_tickets ?? 0}
          icon={<HourglassTop />}
          tone="info"
        />
        <StatCard
          label="Resolved"
          value={summary?.resolved_tickets ?? 0}
          icon={<CheckCircle />}
          tone="success"
        />
        <StatCard
          label="Closed"
          value={summary?.closed_tickets ?? 0}
          icon={<CheckCircle />}
          tone="default"
        />
        <StatCard
          label="Overdue"
          value={summary?.overdue_tickets ?? 0}
          icon={<WarningAmberRounded />}
          tone="error"
        />
        <StatCard
          label="Avg Resolution"
          value={summary?.avg_resolution_hours != null ? `${summary.avg_resolution_hours}h` : "—"}
          icon={<AccessTime />}
          tone="info"
        />
        <StatCard
          label="Avg Response"
          value={summary?.avg_response_hours != null ? `${summary.avg_response_hours}h` : "—"}
          icon={<Speed />}
          tone="warning"
        />
      </Box>

      {/* ── SLA Compliance Bar ──────────────────────────────────────────── */}
      {sla && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Speed sx={{ color: "primary.main" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                SLA Compliance
              </Typography>
              <Chip
                label={`${sla.compliance_rate_pct}%`}
                size="small"
                color={sla.compliance_rate_pct >= 80 ? "success" : sla.compliance_rate_pct >= 50 ? "warning" : "error"}
                sx={{ fontWeight: 700, ml: "auto" }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={sla.compliance_rate_pct}
              sx={{
                height: 12,
                borderRadius: 2,
                bgcolor: (t) => alpha(t.palette.error.main, 0.12),
                "& .MuiLinearProgress-bar": {
                  borderRadius: 2,
                  bgcolor: sla.compliance_rate_pct >= 80 ? "success.main" : sla.compliance_rate_pct >= 50 ? "warning.main" : "error.main",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                Within SLA: <strong>{sla.resolved_within_sla}</strong>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Breached: <strong>{sla.resolved_breached_sla}</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ── Ticket Trends ──────────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <SectionCard
            title="Ticket Trends"
            icon={<TrendingUp sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
            action={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {VOLUME_GROUPS.map((g) => (
                  <Chip
                    key={g.value}
                    label={g.label}
                    size="small"
                    variant={volumeGroup === g.value ? "filled" : "outlined"}
                    color={volumeGroup === g.value ? "primary" : "default"}
                    onClick={() => handleVolumeGroupChange(g.value)}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </Box>
            }
          >
            {volumeLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            ) : ticketVolume.length > 0 ? (
              <Box sx={{ height: 320, width: "100%" }}>
                <LineChart
                  xAxis={[{
                    data: ticketVolume.map((v) => v.period),
                    scaleType: "band",
                    label: volumeGroup === "day" ? "Date" : volumeGroup === "week" ? "Week" : "Month",
                  }]}
                  series={[{
                    data: ticketVolume.map((v) => v.count),
                    label: "Tickets",
                    color: "#5c6bc0",
                    area: true,
                  }]}
                  height={300}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No volume data available
              </Typography>
            )}
          </SectionCard>
        </Grid>

        {/* ── Category Distribution ──────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <SectionCard
            title="By Category"
            icon={<Category sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
          >
            {categoryLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            ) : categoryDistribution.length > 0 ? (
              <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                <PieChart
                  series={[{
                    data: categoryDistribution.map((c, i) => ({
                      id: i,
                      value: c.count,
                      label: c.category_name,
                      color: chartPalette[i % chartPalette.length],
                    })),
                    innerRadius: 40,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  }]}
                  height={280}
                  slotProps={{ legend: { hidden: true } }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No category data
              </Typography>
            )}
            {/* Legend */}
            {categoryDistribution.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, justifyContent: "center" }}>
                {categoryDistribution.map((c, i) => (
                  <Chip
                    key={c.category_name}
                    label={`${c.category_name} (${c.count})`}
                    size="small"
                    sx={{
                      bgcolor: alpha(chartPalette[i % chartPalette.length], 0.12),
                      color: chartPalette[i % chartPalette.length],
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                ))}
              </Box>
            )}
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* ── Priority Distribution ──────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="By Priority"
            icon={<BarChartIcon sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
          >
            {priorityLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            ) : priorityDistribution.length > 0 ? (
              <Box sx={{ height: 280 }}>
                <BarChart
                  xAxis={[{
                    data: priorityDistribution.map((p) => p.priority),
                    scaleType: "band",
                  }]}
                  series={[{
                    data: priorityDistribution.map((p) => p.count),
                    label: "Tickets",
                    color: "#5c6bc0",
                  }]}
                  height={260}
                  colors={priorityDistribution.map((p) => PRIORITY_COLORS[p.priority] || "#5c6bc0")}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
                No priority data
              </Typography>
            )}
          </SectionCard>
        </Grid>

        {/* ── Employee Activity ──────────────────────────────────────── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard
            title="Employee Activity"
            icon={<People sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
          >
            <EmployeeActivitySection loading={employeeLoading} data={employeeActivity} />
          </SectionCard>
        </Grid>
      </Grid>

      {/* ── Agent Performance Table ──────────────────────────────────── */}
      <SectionCard
        title="Agent Performance"
        icon={<Assessment sx={{ fontSize: "1.1rem", color: "text.secondary" }} />}
        sx={{ mb: 4 }}
      >
        <AgentPerformanceTable loading={agentPerformanceLoading} data={agentPerformance} />
      </SectionCard>
    </Box>
  )
}
