import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AuthState = {
  accessToken: string | null
}

const initialState: AuthState = {
  accessToken: typeof window !== 'undefined' ? sessionStorage.getItem('access_token') : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload
      if (typeof window !== 'undefined') {
        if (action.payload) {
          sessionStorage.setItem('access_token', action.payload)
        } else {
          sessionStorage.removeItem('access_token')
        }
      }
    },
    logout: (state) => {
      state.accessToken = null
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('access_token')
      }
    },
  },
})

export const { setAccessToken, logout } = authSlice.actions
export default authSlice
