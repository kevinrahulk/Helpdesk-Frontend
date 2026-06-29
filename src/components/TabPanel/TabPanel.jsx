import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

/**
 * TabPanel wrapper component for MUI Tabs.
 * Displays or hides content based on current tab selection.
 */
export default function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  )
}
