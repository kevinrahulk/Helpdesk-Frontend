/**
 * Axios API client — pre-configured for the AI Helpdesk backend.
 * Base URL defaults to http://localhost:8000 (override via VITE_API_URL).
 * Automatically attaches the JWT from localStorage on every request.
 * On 401, clears auth and redirects to /login.
 */

import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

// Default timeout for regular CRUD calls.
const DEFAULT_TIMEOUT_MS = 15_000

// AI routes (/ai/*) run a multi-node LangGraph workflow on the backend —
// several sequential LLM calls (intent → category/priority/summary →
// first-fix → similar tickets → confidence), each with its own
// AI_REQUEST_TIMEOUT_SECONDS (20s) budget plus retries, so the worst-case
// end-to-end latency is well above the default 15s CRUD timeout. Give
// these calls a much longer runway rather than failing them client-side
// while the backend is still legitimately working.
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
