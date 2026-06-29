import { Routes, Route, Navigate } from "react-router-dom"
import { ROLES } from "./data/mockData"
import ProtectedRoute from "./routes/ProtectedRoute"
import AppLayout from "./layout/AppLayout"
import Login from "./pages/Login/Login"
import Dashboard from "./pages/Dashboard/Dashboard"
import TicketList from "./pages/Tickets/TicketList"
import TicketDetails from "./pages/Tickets/TicketDetails"
import CreateTicket from "./pages/Tickets/CreateTicket"
import ComingSoon from "./pages/ComingSoon"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute allow={[ROLES.EMPLOYEE, ROLES.ADMIN]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN]}>
              <ComingSoon title="User Management" subtitle="Create and manage employee and agent accounts." />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allow={[ROLES.ADMIN]}>
              <ComingSoon title="Reports" subtitle="Analytics, SLA compliance and agent performance." />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
