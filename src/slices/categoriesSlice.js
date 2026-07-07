

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import apiClient from "../api/apiClient"

// ── Async thunks ──────────────────────────────────────────────────────────

/**
 * Fetch all ticket categories.
 * @param {object} params - { active_only?: boolean }  defaults to true
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = { active_only: true }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/categories", { params })
      return data.data // TicketCategoryResponse[]
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to fetch categories.")
    }
  },
)

/**
 * Fetch a single category.
 * @param {string} categoryId - UUID
 */
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/categories/${categoryId}`)
      return data.data // TicketCategoryResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Category not found.")
    }
  },
)

/**
 * Create a new category (Admin only).
 * @param {object} payload - TicketCategoryCreate { name, description?, is_active? }
 */
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/categories", payload)
      return data.data // TicketCategoryResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to create category.")
    }
  },
)

/**
 * Update a category (Admin only).
 * @param {object} arg - { categoryId, payload: TicketCategoryUpdate }
 */
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, payload }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/categories/${categoryId}`, payload)
      return data.data // TicketCategoryResponse
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to update category.")
    }
  },
)

/**
 * Soft-delete a category by setting is_active=false (Admin only).
 * @param {string} categoryId - UUID
 */
export const deactivateCategory = createAsyncThunk(
  "categories/deactivateCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/categories/${categoryId}`)
      return categoryId
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? "Failed to deactivate category.")
    }
  },
)

// ── Slice ─────────────────────────────────────────────────────────────────

const initialState = {
  items: [],             // TicketCategoryResponse[]
  categoriesById: {},    // { [id]: TicketCategoryResponse }
  loading: false,
  error: null,
  mutating: false,
  mutateError: null,
}

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoryErrors(state) {
      state.error = null
      state.mutateError = null
    },
  },
  extraReducers: (builder) => {
    // ── fetchCategories ──────────────────────────────────────────────────
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        // Also index by id for quick lookup
        state.categoriesById = Object.fromEntries(action.payload.map((c) => [c.id, c]))
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // ── fetchCategoryById ────────────────────────────────────────────────
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.categoriesById[action.payload.id] = action.payload
    })

    // ── createCategory ───────────────────────────────────────────────────
    builder
      .addCase(createCategory.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.mutating = false
        const cat = action.payload
        state.items.push(cat)
        state.categoriesById[cat.id] = cat
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── updateCategory ───────────────────────────────────────────────────
    builder
      .addCase(updateCategory.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.mutating = false
        const cat = action.payload
        state.categoriesById[cat.id] = cat
        const idx = state.items.findIndex((c) => c.id === cat.id)
        if (idx >= 0) state.items[idx] = cat
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })

    // ── deactivateCategory ───────────────────────────────────────────────
    builder
      .addCase(deactivateCategory.pending, (state) => {
        state.mutating = true
        state.mutateError = null
      })
      .addCase(deactivateCategory.fulfilled, (state, action) => {
        state.mutating = false
        const id = action.payload
        state.items = state.items.filter((c) => c.id !== id)
        delete state.categoriesById[id]
      })
      .addCase(deactivateCategory.rejected, (state, action) => {
        state.mutating = false
        state.mutateError = action.payload
      })
  },
})

export const { clearCategoryErrors } = categoriesSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

export const selectCategories = (state) => state.categories.items
export const selectCategoryById = (id) => (state) => state.categories.categoriesById[id] ?? null
export const selectCategoriesLoading = (state) => state.categories.loading
export const selectCategoriesError = (state) => state.categories.error
export const selectCategoriesMutating = (state) => state.categories.mutating
export const selectCategoriesMutateError = (state) => state.categories.mutateError

export default categoriesSlice.reducer
