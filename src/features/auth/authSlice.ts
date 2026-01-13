import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../services/supabaseClient'
import type { AuthState, LoginCredentials, RegisterCredentials } from './authTypes'
import type { User } from '../../types'

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

// Check current session
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email || '',
      } as User
    }
    return null
  }
)

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email || '',
        } as User
      }

      throw new Error('Registration failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) throw error

      if (data.user) {
        return {
          id: data.user.id,
          email: data.user.email || '',
        } as User
      }

      throw new Error('Login failed')
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Check session
    builder
      .addCase(checkSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to check session'
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

