import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAuthenticated, selectUserRole } from "../../slices/authSlice"

/** Guards authenticated routes and optionally restricts by role. */
export default function ProtectedRoute({ children, allow }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role = useSelector(selectUserRole)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
