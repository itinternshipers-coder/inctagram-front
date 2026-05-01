export type UserSearchItem = {
  id: string
  username: string
  avatarUrl: string | null
  profileLink: string
}

export type SearchUsersRequest = {
  username: string
  pageSize?: number
  cursor?: string
}

export type SearchUsersResponse = {
  items: UserSearchItem[]
  nextCursor: string | null
  hasMore: boolean
}

export type FollowsListItem = {
  id: string
  username: string
  avatarUrl: string | null
  createdAt: string
}

export type FollowsListRequest = {
  userId: string
  page?: number
  pageSize?: number
}

export type FollowsListResponse = {
  items: FollowsListItem[]
  totalCount: number
  totalPages: number
  pageSize: number
  page: number
}

export type FollowMutationArg = {
  /** id пользователя, на которого подписываемся / отписываемся */
  userId: string
  /** id текущего залогиненного пользователя — для оптимистичного апдейта своего followingCount. Если не передан, апдейт собственного профиля пропускается. */
  currentUserId?: string
}
