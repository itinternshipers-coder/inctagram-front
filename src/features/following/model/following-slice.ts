import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type FollowingState = {
  followStatus: Record<string, boolean> // userId → isFollowed
}

const initialState: FollowingState = {
  followStatus: {},
}

const followingSlice = createSlice({
  name: 'following',
  initialState,
  reducers: {
    setFollowed: (state, action: PayloadAction<{ userId: string }>) => {
      state.followStatus[action.payload.userId] = true
    },
    setUnfollowed: (state, action: PayloadAction<{ userId: string }>) => {
      state.followStatus[action.payload.userId] = false
    },
    setFollowStatuses: (state, action: PayloadAction<Record<string, boolean>>) => {
      Object.assign(state.followStatus, action.payload)
    },
  },
})

export const { setFollowed, setUnfollowed, setFollowStatuses } = followingSlice.actions
export default followingSlice
