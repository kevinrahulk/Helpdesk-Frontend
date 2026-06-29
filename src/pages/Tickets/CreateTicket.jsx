import { useEffect, useState } from "react"
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
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import { ArrowBack, AutoAwesome, Send, Add } from "@mui/icons-material"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import AIPanel, { AISection } from "../../components/AIPanel/AIPanel"
import { useTickets } from "../../../hooks/useTickets"
import { useCategories, useAI } from "../../../hooks/useDomainHooks"

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
]
// ── Create Category Dialog ────────────────────────────────────────────────────
function CreateCategoryDialog({ open, onClose, onCreate, loading, error }) {
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (!open) { setName(""); setDesc(""); setNameError("") }
  }, [open])

  const handleCreate = () => {
    if (!name.trim()) { setNameError("Category name is required"); return }
    onCreate({ name: name.trim(), description: desc.trim() || undefined, is_active: true })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Create New Category</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError("") }}
            error={!!nameError}
            helperText={nameError}
            size="small"
            autoFocus
          />
          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button loading={loading} onClick={handleCreate} startIcon={<Add />}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function CreateTicket() {
  const navigate = useNavigate()
  const { createTicket, mutating, mutateError } = useTickets()
  const { categories, fetch: fetchCategories, createCategory, mutating: catMutating, mutateError: catMutateError } = useCategories()
  const { suggestion, suggestionLoading, suggestionError, getSuggestion, clearSuggestion } = useAI()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    priority: "Medium",
  })
  const [errors, setErrors] = useState({})
  const [createCatOpen, setCreateCatOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
    return () => clearSuggestion()
  }, [fetchCategories, clearSuggestion])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category_id) newErrors.category_id = "Category is required"
    return newErrors
  }

  const handleAnalyzeWithAI = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrors({
        title: formData.title.trim() ? "" : "Title is required to analyze",
        description: formData.description.trim() ? "" : "Description is required to analyze",
      })
      return
    }
    getSuggestion({ title: formData.title, description: formData.description })
  }

  const handleCreateCategory = async (payload) => {
    const result = await createCategory(payload)
    if (result?.success && result.category) {
      setFormData((prev) => ({ ...prev, category_id: result.category.id }))
      setCreateCatOpen(false)
      fetchCategories()
    }
  }

  const handleApplySuggestions = () => {
    if (!suggestion) return
    const matchedCat = categories.find(
      (c) => c.name?.toLowerCase() === suggestion.suggested_category?.toLowerCase(),
    )
    setFormData((prev) => ({
      ...prev,
      category_id: matchedCat?.id ?? prev.category_id,
      priority: suggestion.suggested_priority ?? prev.priority,
    }))
    clearSuggestion()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      category_id: formData.category_id,
      priority: formData.priority.toLocaleLowerCase(),
      ...(suggestion?.suggestion_id && { ai_suggestion_id: suggestion.suggestion_id }),
    }
    const result = await createTicket(payload)
    if (result.success) navigate("/tickets?status=open")
  }

  return (
    <><Box>
      <PageHeader
        title="Create Ticket"
        subtitle="Report a new issue to get support"
        actions={<Button variant="outlined" size="sm" startIcon={<ArrowBack />} onClick={() => navigate("/tickets")}>
          Back
        </Button>} />

      {mutateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {mutateError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Typography variant="subtitle2" sx={{ mb: 2.5, fontWeight: 700 }}>
                  Issue Details
                </Typography>

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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
                </Box>

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
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }} />
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
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      error={!!errors.category_id}
                      helperText={errors.category_id}
                      size="small"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem
                        onClick={(e) => { e.stopPropagation(); setCreateCatOpen(true) }}
                        sx={{ color: "primary.main", fontWeight: 600, gap: 1 }}
                      >
                        <Add fontSize="small" /> Create new category
                      </MenuItem>
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
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
                    >
                      {PRIORITIES.map((p) => (
                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button type="submit" loading={mutating} startIcon={<Send />}>
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

        <Grid size={{ xs: 12, md: 4 }}>
          <AIPanel title="AI Assistant" loading={suggestionLoading}>
            {suggestionError && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {suggestionError}
              </Alert>
            )}

            {!suggestion && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Fill in your issue details above, then click below to let AI analyze and suggest the best category and priority.
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AutoAwesome />}
                  onClick={handleAnalyzeWithAI}
                  disabled={!formData.title.trim() || !formData.description.trim() || suggestionLoading}
                >
                  Analyze Issue
                </Button>
              </Box>
            )}

            {suggestion && (
              <Box>
                <AISection label="Summary">{suggestion.summary}</AISection>

                <AISection label="Suggested Category">
                  <Chip label={suggestion.suggested_category} color="primary" variant="outlined" />
                </AISection>

                <AISection label="Suggested Priority">
                  <Chip label={suggestion.suggested_priority} color="error" variant="outlined" />
                </AISection>

                {suggestion.first_fix && (
                  <AISection label="First Fix">{suggestion.first_fix}</AISection>
                )}

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  <Button size="sm" fullWidth onClick={handleApplySuggestions}>
                    Apply
                  </Button>
                  <Button size="sm" fullWidth variant="outlined" onClick={() => clearSuggestion()}>
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
    </Box><CreateCategoryDialog
        open={createCatOpen}
        onClose={() => setCreateCatOpen(false)}
        onCreate={handleCreateCategory}
        loading={catMutating}
        error={catMutateError} /></>
  )
}
