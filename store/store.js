/**
 * Redux store — combines all slices.
 *
 * Slices:
 *   auth        — authentication & user session
 *   tickets     — ticket CRUD + comments/attachments/logs
 *   users       — user management (admin)
 *   categories  — ticket categories
 *   dashboard   — role-filtered dashboard stats
 *   reports     — admin analytics
 *   ai          — AI suggestion & summary panels
 */

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import ticketsReducer from "./slices/ticketsSlice"
import usersReducer from "./slices/usersSlice"
import categoriesReducer from "./slices/categoriesSlice"
import dashboardReducer from "./slices/dashboardSlice"
import reportsReducer from "./slices/reportsSlice"
import aiReducer from "./slices/aiSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketsReducer,
    users: usersReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
    ai: aiReducer,
  },
  devTools: import.meta.env.MODE !== "production",
})

export default store
