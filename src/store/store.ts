import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/base-api'
import authSlice from '@/features/auth/model/auth-slice'
import postSlice from '@/entities/post/model/post-slice'

export const store = configureStore({
  reducer: {
    // Базовый API (включает все инжектированные endpoints)
    [baseApi.reducerPath]: baseApi.reducer,

    // Слайсы
    [authSlice.name]: authSlice.reducer,
    [postSlice.name]: postSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
