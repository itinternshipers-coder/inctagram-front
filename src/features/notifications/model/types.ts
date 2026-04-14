export type Notification = {
  id: string
  message: string
  isReady: boolean
  createdAt: string
}

export type NotificationsResponse = {
  totalCount: number
  pageSize: number
  items: Notification[]
  nextCursor?: string | null
  hasMore?: boolean
}

export type NotificationsParams = {
  cursor?: string
  pageSize?: number
  sortDirection?: 'asc' | 'desc'
  sortBy?: 'createdAt'
}

export type MarkAsReadRequest = {
  ids: string[]
}
