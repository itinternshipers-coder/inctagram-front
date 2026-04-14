import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type NotificationsState = {
  unreadCount: number
}

const initialState: NotificationsState = {
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },
    incrementUnread: (state) => {
      state.unreadCount += 1
    },
    decrementUnread: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, state.unreadCount - action.payload)
    },
  },
})

export const { setUnreadCount, incrementUnread, decrementUnread } = notificationsSlice.actions
export default notificationsSlice
