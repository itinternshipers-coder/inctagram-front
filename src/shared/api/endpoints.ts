export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/sign-in',
    LOGOUT: '/auth/sign-out',
    SIGNUP: '/auth/sign-up',
    CONFIRM_EMAIL: '/auth/confirm-email',
    RESEND_CONFIRMATION: '/auth/resend-confirmation',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    PASSWORD_RECOVERY: '/auth/password-recovery',
    PASSWORD_RECOVERY_CONFIRM: '/auth/password-recovery-confirm',
    OAUTH: '/auth/oauth',
  },
  SESSIONS: {
    BASE: '/sessions',
    TERMINATE_ALL: '/sessions/terminate-all',
    BY_DEVICE: '/sessions/{deviceId}',
  },
  POSTS: {
    BASE: '/posts',
    BY_ID: '/posts/{id}',
    BY_USER: '/posts/user/{userId}',
    PUBLIC_STATS: '/posts/public/stats',
  },
} as const

// Хелперы для динамических путей
export const EndpointHelpers = {
  posts: {
    byId: (id: string) => `/posts/${id}`,
    byUser: (userId: string) => `/posts/user/${userId}`,
  },
  sessions: {
    byDevice: (deviceId: string) => `/sessions/${deviceId}`,
  },
  oAuth: {
    byProvider: (provider: string) => `/auth/oauth/${provider}`,
  },
}
