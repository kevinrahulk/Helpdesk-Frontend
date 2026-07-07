import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

// Default timeout for regular CRUD calls.
const DEFAULT_TIMEOUT_MS = 15_000

const AI_TIMEOUT_MS = 60_000

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: DEFAULT_TIMEOUT_MS,
})

// ── Request interceptor: attach Bearer token + per-route timeout ─────────
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("helpdesk-auth")
  if (raw) {
    try {
      const { access_token } = JSON.parse(raw)
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`
      }
    } catch {
      // corrupt storage — ignore
    }
  }

  // Give /ai/* calls (and any absolute AI URL) a longer timeout to match
  // the backend's actual worst-case latency instead of the CRUD default.
  if (config.url && /^\/?ai\//.test(config.url)) {
    config.timeout = AI_TIMEOUT_MS
  }

  return config
})

// ── Response interceptor: normalise errors & handle 401 ──────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("helpdesk-auth")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default apiClient
