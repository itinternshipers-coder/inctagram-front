import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AuthState = {
  accessToken: string | null
  isLoggedIn: boolean
  user: {
    userId: string
    userName: string
    email: string
  } | null
}

const initialState: AuthState = {
  accessToken: null,
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isLoggedIn = true
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.accessToken = null
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export const { setAccessToken, setUser, logout } = authSlice.actions
export default authSlice
