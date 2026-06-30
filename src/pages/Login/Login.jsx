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
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useColorMode } from "../../theme/ColorModeContext"
import Button from "../../components/Button/Button"
import InputBox from "../../components/InputBox/InputBox"
import { Form, FormField } from "../../components/Form/Form"
import { pageSx, formColumnSx, formCardSx, brandColumnSx, featureRowSx } from "./style"
import Tooltip from "@mui/material/Tooltip"

const features = [
  { icon: AutoAwesome, title: "AI-assisted triage", desc: "Smart category, priority and first-fix suggestions on every ticket." },
  { icon: InsightsOutlined, title: "Real-time insight", desc: "Role-scoped dashboards, SLA tracking and agent workload at a glance." },
  { icon: VerifiedUserOutlined, title: "Built for teams", desc: "Employees, agents and admins each get a tailored workspace." },
]

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const { mode, toggleColorMode } = useColorMode()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})

  const from = location.state?.from?.pathname || "/dashboard"

  const validate = () => {
    const next = {}
    if (!email.trim()) next.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email"
    if (!password) next.password = "Password is required"
    else if (password.length < 8) next.password = "Password must be at least 8 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (error) clearError()
    if (!validate()) return
    const result = await login({ email, password })
    if (result.success) navigate(from, { replace: true })
  }

  return (
    <Box sx={pageSx}>
      <Box sx={formColumnSx}>
        <Box sx={formCardSx}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SupportAgent />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>Helpdesk</Typography>
                <Typography variant="caption" color="text.secondary">
                  AI Ticket Assistant
                </Typography>
              </Box>
            </Box>
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton onClick={toggleColorMode} size="small" aria-label="Toggle theme">
                {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to manage and resolve support tickets.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormField label="Email" required>
              <InputBox
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" required>
              <InputBox
                type={showPw ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
                autoComplete="current-password"
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

            <Button type="submit" size="lg" variant="contained" loading={loading} fullWidth>
              Sign in
            </Button>
          </Form>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, textAlign: "center" }}>
            Need an admin account?{" "}
            <Typography
              component={Link}
              to="/signup"
              variant="body2"
              sx={{ color: "primary.main", textDecoration: "none", fontWeight: 600 }}
            >
              Create one
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
            Resolve tickets faster with AI in the loop.
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 420 }}>
            A modern support workspace that triages, summarizes and suggests fixes — so your team spends less time
            sorting and more time solving.
          </Typography>

          {features.map((f) => {
            const Icon = f.icon
            return (
              <Box key={f.title} sx={featureRowSx}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2,
                    bgcolor: "rgba(255,255,255,0.16)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: "1.2rem" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.82 }}>
                    {f.desc}
                  </Typography>
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
