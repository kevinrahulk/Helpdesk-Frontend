import { useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import {
    SupportAgent,
    AutoAwesome,
    InsightsOutlined,
    VerifiedUserOutlined,
    Visibility,
    VisibilityOff,
    LightModeOutlined,
    DarkModeOutlined,
} from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import apiClient from "../../../api/apiClient"
import { login } from "../../../slices/authSlice"
import { useColorMode } from "../../theme/ColorModeContext"
import Button from "../../components/Button/Button"
import InputBox from "../../components/InputBox/InputBox"
import { Form, FormField } from "../../components/Form/Form"
import Tooltip from "@mui/material/Tooltip"
import { pageSx, formColumnSx, formCardSx, brandColumnSx, featureRowSx } from "../Login/style"

const features = [
    { icon: AutoAwesome, title: "AI-assisted triage", desc: "Smart category, priority and first-fix suggestions on every ticket." },
    { icon: InsightsOutlined, title: "Real-time insight", desc: "Role-scoped dashboards, SLA tracking and agent workload at a glance." },
    { icon: VerifiedUserOutlined, title: "Built for teams", desc: "Employees, agents and admins each get a tailored workspace." },
]

export default function Signup() {
    const { mode, toggleColorMode } = useColorMode()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
    })
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState("")

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
        if (apiError) setApiError("")
    }

    const validate = () => {
        const next = {}
        if (!formData.full_name.trim()) next.full_name = "Full name is required"
        if (!formData.email.trim()) next.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Enter a valid email"
        if (!formData.password) next.password = "Password is required"
        else if (formData.password.length < 8) next.password = "Password must be at least 8 characters"
        if (!formData.confirm_password) next.confirm_password = "Please confirm your password"
        else if (formData.password !== formData.confirm_password) next.confirm_password = "Passwords do not match"
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            await apiClient.post("/auth/register", {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                role: "admin",
            })
            // Auto-login after successful registration
            const result = await dispatch(login({ email: formData.email, password: formData.password }))
            if (login.fulfilled.match(result)) {
                navigate("/dashboard", { replace: true })
            } else {
                navigate("/login", { replace: true })
            }
        } catch (err) {
            setApiError(err.response?.data?.detail ?? "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={pageSx}>
            <Box sx={formColumnSx}>
                <Box sx={formCardSx}>
                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                            <Box
                                sx={{
                                    width: 40, height: 40, borderRadius: 2,
                                    bgcolor: "primary.main", color: "primary.contrastText",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                <SupportAgent />
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>Helpdesk</Typography>
                                <Typography variant="caption" color="text.secondary">AI Ticket Assistant</Typography>
                            </Box>
                        </Box>
                        <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
                            <IconButton onClick={toggleColorMode} size="small" aria-label="Toggle theme">
                                {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Typography variant="h4" sx={{ mb: 0.5 }}>Create admin account</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Set up your administrator account to get started.
                    </Typography>

                    {apiError && (
                        <Alert severity="error" sx={{ mb: 2.5 }}>{apiError}</Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <FormField label="Full Name" required>
                            <InputBox
                                placeholder="Your full name"
                                value={formData.full_name}
                                onChange={handleChange("full_name")}
                                error={Boolean(errors.full_name)}
                                helperText={errors.full_name}
                                autoComplete="name"
                            />
                        </FormField>

                        <FormField label="Work Email" required>
                            <InputBox
                                type="email"
                                placeholder="you@company.com"
                                value={formData.email}
                                onChange={handleChange("email")}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                autoComplete="email"
                            />
                        </FormField>

                        <FormField label="Password" required>
                            <InputBox
                                type={showPw ? "text" : "password"}
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange("password")}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPw((s) => !s)} edge="end" size="small" aria-label="Toggle password visibility">
                                                {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormField>

                        <FormField label="Confirm Password" required>
                            <InputBox
                                type={showConfirm ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={formData.confirm_password}
                                onChange={handleChange("confirm_password")}
                                error={Boolean(errors.confirm_password)}
                                helperText={errors.confirm_password}
                                autoComplete="new-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end" size="small" aria-label="Toggle confirm visibility">
                                                {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormField>

                        <Button type="submit" size="lg" variant="contained" loading={loading} fullWidth>
                            Create Account
                        </Button>
                    </Form>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, textAlign: "center" }}>
                        Already have an account?{" "}
                        <Typography
                            component={Link}
                            to="/login"
                            variant="body2"
                            sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}
                        >
                            Sign in
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            <Box sx={brandColumnSx}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesome />
                    <Typography sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>AI Helpdesk</Typography>
                </Box>

                <Box>
                    <Typography variant="h3" sx={{ fontSize: "2.25rem", mb: 2, lineHeight: 1.15 }}>
                        Set up your helpdesk in minutes.
                    </Typography>
                    <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 420 }}>
                        Create your admin account to start managing your support team with AI-powered triage, smart routing, and real-time analytics.
                    </Typography>

                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <Box key={f.title} sx={featureRowSx}>
                                <Box
                                    sx={{
                                        width: 38, height: 38, borderRadius: 2,
                                        bgcolor: "rgba(255,255,255,0.16)",
                                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                                    }}
                                >
                                    <Icon sx={{ fontSize: "1.2rem" }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{f.title}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.82 }}>{f.desc}</Typography>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>

                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    © {new Date().getFullYear()} AI Helpdesk. All rights reserved.
                </Typography>
            </Box>
        </Box>
    )
}
