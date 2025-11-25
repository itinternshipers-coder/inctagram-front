export type SessionItem = {
  deviceId: string
  deviceType: string
  deviceName: string
  browserName: string
  lastActive: string
}

export type GetSessionsResponse = {
  current: SessionItem
  others: SessionItem[]
}
