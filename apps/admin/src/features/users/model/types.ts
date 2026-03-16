export type User = {
  id: string
  username: string
  profileLink: string
  email: string
  isBanned: boolean
  banReason: string | null
  bannedAt: string | null
  dataAdded: string
  avatarUrl: string | null
}

export type UsersListInput = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDirection?: string
  filterBanned?: string
}

export type UsersListOutput = {
  items: User[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type UserFilter = 'all' | 'blocked' | 'not-blocked'

export type SortDirection = 'asc' | 'desc' | null
