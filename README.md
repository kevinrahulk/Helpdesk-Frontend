# AI Helpdesk Ticket Assistant - Frontend Web App

A modern, responsive react-based customer support portal dashboard built with **React**, **Vite**, **Material UI (MUI)**, and **Redux Toolkit**. It connects to the FastAPI backend API to provide real-time AI categorization, smart ticket recommendations, and active notification alerts.

---

## ✨ Features & Highlights

- **Dynamic Role Dashboards**: Custom interfaces for **Employees** (submitting tickets, checking status), **Agents** (managing queues, applying AI suggestions, commenting), and **Admins** (system configuration, user administration).
- **AI Ticket Suggestions**: Real-time evaluation of tickets during drafting using the "Analyze Issue" trigger.
- **Data Tables & Charts**: Uses `@mui/x-data-grid` for ticket queues and `@mui/x-charts` for analytical visualization.
- **Real-Time Synchronization**: Connects to the backend via WebSockets to push instant notification overlays for comments, updates, and AI suggestions.
- **Redux Global State Management**: Centralized application state for active user sessions, ticket listings, and report statistics.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) (v18) built with [Vite](https://vitejs.dev/) for ultra-fast bundling.
- **UI Components & Icons**: [Material UI (MUI)](https://mui.com/) v6 & `@mui/icons-material`.
- **Charting & Data Grids**: `@mui/x-charts` and `@mui/x-data-grid`.
- **State Management**: [@reduxjs/toolkit](https://redux-toolkit.js.org/) and `react-redux`.
- **Routing**: `react-router-dom` (v6).
- **HTTP Client**: `axios` with interceptors (includes JWT headers propagation and custom timeout limits for AI routes).

---

## 📂 Project Structure

```
Frontend/ai-helpdesk-assistant/
├── public/                 # Static assets
└── src/
    ├── api/                # Axios API client configuration
    ├── components/         # Reusable global layout elements (Cards, Alerts, etc.)
    ├── context/            # Local Context API providers (e.g. WebSocket connection context)
    ├── data/               # Static definitions (status mappings, priorities, etc.)
    ├── hooks/              # Custom React hooks (useTickets, useUsers, etc.)
    ├── layout/             # Master app shells & Navigation Sidebars
    ├── pages/              # Primary view controllers:
    │   ├── Dashboard/      # Analytics overview charts
    │   ├── Login/          # User authentication login page
    │   ├── Reports/        # Custom report generation pages
    │   ├── Signup/         # Registration page
    │   ├── Tickets/        # Ticket details, creation panels, and list tables
    │   └── UserManagement/ # Administrator control tables
    ├── routes/             # Client-side router mappings (Protected & Public routes)
    ├── slices/             # Redux state slices (auth, tickets, reports, etc.)
    ├── store/              # Redux store index configurator
    ├── theme/              # Custom MUI design theme config
    ├── utils/              # Helper utilities (date formatters, token extractors)
    ├── App.jsx             # Root layout organizer
    ├── index.css           # Global CSS rules
    ├── index.js            # Entry configurations
    └── main.jsx            # Main React bootstrapper
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `18.x` or higher
- **npm** or **yarn**

### 2. Installation

1. Navigate to the frontend workspace directory:
   ```bash
   cd Frontend/ai-helpdesk-assistant
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

### 3. Environment Setup

Create an environment configuration file:
```bash
touch .env
```

Configure the backend api endpoint inside `.env`:
```env
VITE_API_URL=http://localhost:8000
```
*(If omitted, Axios defaults to `http://localhost:8000`)*

### 4. Running the Development Server

Start the local development server:

```bash
npm run dev
```

The application will run by default on [http://localhost:5173](http://localhost:5173).

### 5. Production Build

To compile static assets for production:

```bash
npm run build
```

This compiles optimized assets into the `dist/` directory, which can be deployed to static hosting platforms like Vercel, Netlify, or an Nginx host.
