import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { Construction } from "@mui/icons-material"
import PageHeader from "../components/PageHeader/PageHeader"
import SectionCard from "../components/SectionCard/SectionCard"

/** Placeholder for modules not yet built in this pass (User Management, Reports). */
export default function ComingSoon({ title, subtitle }) {
  return (
    <Box>
      <PageHeader title={title} subtitle={subtitle} />
      <SectionCard>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", py: 8, color: "text.secondary" }}>
          <Construction sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />
          <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>
            Module coming soon
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 420 }}>
            This screen is part of the roadmap. The core ticketing experience — dashboards, ticket creation, list and
            details with AI assistance — is fully available now.
          </Typography>
        </Box>
      </SectionCard>
    </Box>
  )
}
