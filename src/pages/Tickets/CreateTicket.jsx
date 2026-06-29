import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"
import Alert from "@mui/material/Alert"
import Chip from "@mui/material/Chip"
import { ArrowBack, AutoAwesome, Send } from "@mui/icons-material"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import AIPanel, { AISection } from "../../components/AIPanel/AIPanel"
import { CATEGORIES, PRIORITY, STATUS } from "../../data/mockData"

export default function CreateTicket() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: PRIORITY.MEDIUM,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category) newErrors.category = "Category is required"
    return newErrors
  }

  const handleAnalyzeWithAI = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrors({
        title: formData.title.trim() ? "" : "Title is required",
        description: formData.description.trim() ? "" : "Description is required",
      })
      return
    }

    setAiLoading(true)
    // Simulate AI analysis
    setTimeout(() => {
      setAiSuggestions({
        category: "Network/VPN",
        priority: PRIORITY.HIGH,
        summary:
          "User is experiencing VPN connectivity issues. The description mentions multiple connection attempts and reinstallation attempts, suggesting a persistent configuration or infrastructure problem.",
      })
      setAiLoading(false)
    }, 1500)
  }

  const handleApplySuggestions = () => {
    if (aiSuggestions) {
      setFormData({
        ...formData,
        category: aiSuggestions.category,
        priority: aiSuggestions.priority,
      })
      setAiSuggestions(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      navigate("/tickets?status=Open")
    }, 1000)
  }

  return (
    <Box>
      <PageHeader
        title="Create Ticket"
        subtitle="Report a new issue to get support"
        actions={
          <Button variant="outlined" size="sm" startIcon={<ArrowBack />} onClick={() => navigate("/tickets")}>
            Back
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Typography variant="subtitle2" sx={{ mb: 2.5, fontWeight: 700 }}>
                  Issue Details
                </Typography>

                {/* Title */}
                <Box sx={{ mb: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Describe your issue briefly"
                    error={!!errors.title}
                    helperText={errors.title}
                    multiline
                    rows={2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2.5 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide detailed information about your issue. Include error messages, steps you've tried, and any relevant context."
                    error={!!errors.description}
                    helperText={errors.description}
                    multiline
                    rows={6}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" sx={{ mb: 2.5, fontWeight: 700 }}>
                  Classification
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      error={!!errors.category}
                      helperText={errors.category}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                        },
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label="Priority (optional)"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                        },
                      }}
                    >
                      {[PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH, PRIORITY.CRITICAL].map((p) => (
                        <MenuItem key={p} value={p}>
                          {p}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Submit Button */}
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button type="submit" loading={loading} startIcon={<Send />}>
                    Create Ticket
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/tickets")}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Assistant Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <AIPanel title="AI Assistant" loading={aiLoading}>
            {!aiSuggestions && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Fill in your issue details above, then click the button below to let AI analyze and suggest the best category and priority for your ticket.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  onClick={handleAnalyzeWithAI}
                  disabled={!formData.title.trim() || !formData.description.trim()}
                >
                  Analyze Issue
                </Button>
              </Box>
            )}

            {aiSuggestions && (
              <Box>
                <AISection label="Summary">{aiSuggestions.summary}</AISection>

                <AISection label="Suggested Category">
                  <Chip label={aiSuggestions.category} color="primary" variant="outlined" />
                </AISection>

                <AISection label="Suggested Priority">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Chip label={aiSuggestions.priority} color="error" variant="outlined" />
                  </Box>
                </AISection>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button size="sm" fullWidth onClick={handleApplySuggestions}>
                    Apply
                  </Button>
                  <Button size="sm" fullWidth variant="outlined" onClick={() => setAiSuggestions(null)}>
                    Dismiss
                  </Button>
                </Box>
              </Box>
            )}
          </AIPanel>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, color: "text.secondary", display: "block", mb: 1 }}>
                Tips for better results
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ lineHeight: 1.6 }}>
                <ul style={{ paddingLeft: 20, margin: "0.5rem 0" }}>
                  <li>Be specific and clear in your title</li>
                  <li>Include error messages or codes if applicable</li>
                  <li>Describe what you&apos;ve already tried</li>
                  <li>Mention the device or system affected</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
