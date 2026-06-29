import { useEffect, useState } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Chip from "@mui/material/Chip"
import Alert from "@mui/material/Alert"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import InputAdornment from "@mui/material/InputAdornment"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import {
    Add,
    Delete,
    Search,
    PersonAdd,
    SupportAgent,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material"
import PageHeader from "../../components/PageHeader/PageHeader"
import Button from "../../components/Button/Button"
import Avatar from "../../components/Avatar/Avatar"
import { useUsers } from "../../../hooks/useUsers"
import { formatDate } from "../../utils/format"

// ── Create User Dialog ────────────────────────────────────────────────────────

function CreateUserDialog({ open, onClose, type, onSubmit, loading }) {
    const [form, setForm] = useState({ full_name: "", email: "", password: "" })
    const [showPw, setShowPw] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [apiError, setApiError] = useState("")

    useEffect(() => {
        if (!open) {
            setForm({ full_name: "", email: "", password: "" })
            setFieldErrors({})
            setApiError("")
            setShowPw(false)
        }
    }, [open])

    const validate = () => {
        const next = {}
        if (!form.full_name.trim()) next.full_name = "Full name is required"
        if (!form.email.trim()) next.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email"
        if (!form.password) next.password = "Password is required"
        else if (form.password.length < 8) next.password = "Minimum 8 characters"
        else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
            next.password = "Password must contain at least one letter and one number"
        setFieldErrors(next)
        return Object.keys(next).length === 0
    }

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }))
        if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }))
        if (apiError) setApiError("")
    }

    const handleSubmit = async () => {
        if (!validate()) return
        const result = await onSubmit(form)
        if (result?.error) {
            setApiError(result.error)
        }
    }

    const label = type === "agent" ? "Agent" : "Employee"

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>
                Create {label} Account
            </DialogTitle>
            <DialogContent>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                        {apiError}
                    </Alert>
                )}

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: apiError ? 1 : 2 }}>
                    <TextField
                        label="Full Name"
                        fullWidth
                        value={form.full_name}
                        onChange={handleChange("full_name")}
                        error={!!fieldErrors.full_name}
                        helperText={fieldErrors.full_name}
                        size="small"
                        autoFocus
                        disabled={loading}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange("email")}
                        error={!!fieldErrors.email}
                        helperText={fieldErrors.email}
                        size="small"
                        disabled={loading}
                    />
                    <TextField
                        label="Password"
                        type={showPw ? "text" : "password"}
                        fullWidth
                        value={form.password}
                        onChange={handleChange("password")}
                        error={!!fieldErrors.password}
                        helperText={fieldErrors.password || "Min 8 chars, must include a letter and a number"}
                        size="small"
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPw((s) => !s)} size="small" edge="end" disabled={loading}>
                                        {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button variant="outlined" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button loading={loading} onClick={handleSubmit} startIcon={<Add />}>
                    Create {label}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

function DeleteDialog({ open, user, onClose, onConfirm, loading }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, color: "error.main" }}>Delete User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete <strong>{user?.full_name}</strong> ({user?.email})?
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                <Button
                    loading={loading}
                    onClick={onConfirm}
                    sx={{ bgcolor: "error.main", color: "#fff", "&:hover": { bgcolor: "error.dark" } }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

// ── User Table ────────────────────────────────────────────────────────────────

function UserTable({ users, onDelete, mutating }) {
    if (!users.length) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography color="text.secondary">No users found.</Typography>
            </Box>
        )
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id} hover>
                            <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Avatar name={u.full_name} size="sm" />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.full_name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={u.role?.name ?? u.role ?? "—"}
                                    size="small"
                                    variant="outlined"
                                    color={u.role?.name === "agent" || u.role === "agent" ? "primary" : "default"}
                                    sx={{ textTransform: "capitalize" }}
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={u.is_active ? "Active" : "Inactive"}
                                    size="small"
                                    color={u.is_active ? "success" : "default"}
                                    variant={u.is_active ? "filled" : "outlined"}
                                    sx={{ fontSize: "0.7rem" }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(u.created_at)}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Delete user">
                                    <IconButton
                                        size="small"
                                        onClick={() => onDelete(u)}
                                        sx={{ color: "error.main" }}
                                        disabled={mutating}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UserManagement() {
    const { users, loading, error, mutating, mutateError, fetchUsers, createEmployee, createAgent, deleteUser } = useUsers()

    const [tab, setTab] = useState(0) // 0 = all, 1 = employees, 2 = agents
    const [search, setSearch] = useState("")
    const [createDialog, setCreateDialog] = useState(null) // "employee" | "agent" | null
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const roleFilter = [null, "employee", "agent"][tab]

    const filtered = users.filter((u) => {
        const roleMatch = !roleFilter || (u.role?.name ?? u.role) === roleFilter
        const searchMatch =
            !search ||
            u.full_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        return roleMatch && searchMatch
    })

    const handleCreate = async (form) => {
        const fn = createDialog === "agent" ? createAgent : createEmployee
        const result = await fn({ ...form, is_active: true })
        if (result.success) {
            setCreateDialog(null)
            setSuccessMsg(`${createDialog === "agent" ? "Agent" : "Employee"} account created successfully.`)
            setTimeout(() => setSuccessMsg(""), 4000)
            fetchUsers()
        }
        // Always return result so dialog can show the error
        return result
    }

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return
        setDeleteLoading(true)
        const result = await deleteUser(deleteTarget.id)
        setDeleteLoading(false)
        if (result?.success !== false) {
            fetchUsers()
            setDeleteTarget(null)
            setSuccessMsg("User has been deactivated successfully.")
            setTimeout(() => setSuccessMsg(""), 4000)
        }
    }

    const counts = {
        all: users.length,
        employee: users.filter((u) => (u.role?.name ?? u.role) === "employee").length,
        agent: users.filter((u) => (u.role?.name ?? u.role) === "agent").length,
    }

    return (
        <Box>
            <PageHeader
                title="User Management"
                subtitle="Create and manage employee and agent accounts"
                actions={
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="outlined"
                            size="sm"
                            startIcon={<PersonAdd />}
                            onClick={() => setCreateDialog("employee")}
                        >
                            Add Employee
                        </Button>
                        <Button
                            size="sm"
                            startIcon={<SupportAgent />}
                            onClick={() => setCreateDialog("agent")}
                        >
                            Add Agent
                        </Button>
                    </Box>
                }
            />

            {successMsg && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg("")}>
                    {successMsg}
                </Alert>
            )}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Card>
                <CardContent>
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2.5 }}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                            <Tab label={`All Users (${counts.all})`} />
                            <Tab label={`Employees (${counts.employee})`} />
                            <Tab label={`Agents (${counts.agent})`} />
                        </Tabs>
                    </Box>

                    {/* Search */}
                    <Box sx={{ mb: 2.5 }}>
                        <TextField
                            size="small"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 320 }}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <Typography color="text.secondary">Loading users…</Typography>
                        </Box>
                    ) : (
                        <UserTable users={filtered} onDelete={setDeleteTarget} mutating={mutating} />
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <CreateUserDialog
                open={Boolean(createDialog)}
                type={createDialog}
                onClose={() => setCreateDialog(null)}
                onSubmit={handleCreate}
                loading={mutating}
            />

            {/* Delete Confirm Dialog */}
            <DeleteDialog
                open={Boolean(deleteTarget)}
                user={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />
        </Box>
    )
}
