import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import AppLayout from "./layout/AppLayout"
import Login from "./pages/Login/Login"
import Signup from "./pages/Signup/Signup"
import Dashboard from "./pages/Dashboard/Dashboard"
import TicketList from "./pages/Tickets/TicketList"
import TicketDetails from "./pages/Tickets/TicketDetails"
import CreateTicket from "./pages/Tickets/CreateTicket"
import UserManagement from "./pages/UserManagement/UserManagement"
import Reports from "./pages/Reports/Reports"
import Observability from "./pages/Observability/Observability"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
            <ProtectedRoute allow={["employee", "admin", "agent"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route path="/tickets/:id" element={<TicketDetails />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute allow={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/observability"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Observability />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  )
)

export default function App() {
  return null
}
