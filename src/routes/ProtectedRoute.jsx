import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/** Guards authenticated routes and optionally restricts by role. */
export default function ProtectedRoute({ children, allow }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
