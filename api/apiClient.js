/**
 * Axios API client — pre-configured for the AI Helpdesk backend.
 * Base URL defaults to http://localhost:8000 (override via VITE_API_URL).
 * Automatically attaches the JWT from localStorage on every request.
 * On 401, clears auth and redirects to /login.
 */

import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
})

// ── Request interceptor: attach Bearer token ──────────────────────────────
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
