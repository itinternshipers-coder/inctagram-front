export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_OUT: '/auth/sign-out',
    SIGN_UP: '/auth/sign-up',
    CONFIRM_EMAIL: '/auth/confirm-email',
    RESEND_CONFIRMATION: '/auth/resend-confirmation',
    REFRESH_TOKEN: '/auth/refresh-token',
    ME: '/auth/me',
    PASSWORD_RECOVERY: '/auth/password-recovery',
    PASSWORD_RECOVERY_CONFIRM: '/auth/password-recovery-confirm',
    PASSWORD_RECOVERY_VERIFY: '/auth/password-recovery/verify',
    RESEND_PASSWORD_RECOVERY: '/auth/password-recovery/resend',
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
    FEED: '/posts/feed',
    COMMENTS: '/posts/{postId}/comments',
    REPLIES: '/posts/{postId}/comments/{commentId}/replies',
    LIKE: '/posts/{postId}/like',
    COMMENT_LIKE: '/posts/{postId}/comments/{commentId}/like',
  },
  PROFILE: {
    BASE: '/profile',
    BY_ID: '/profile/{userId}',
    UPLOAD_AVATAR: '/profile/upload-avatar',
    DELETE_AVATAR: '/profile/avatar',
    FOLLOWERS: '/profile/{userId}/followers',
    FOLLOWING: '/profile/{userId}/following',
  },
  USERS: {
    SEARCH: '/users/search',
    FOLLOW: '/users/{userId}/follow',
  },
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CREATE: '/subscriptions/create',
    CAPTURE: '/subscriptions/capture',
    CURRENT: '/subscriptions/current',
    BASE: '/subscriptions',
    MY_PAYMENTS: '/subscriptions/my-payments',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
  },
  MESSENGER: {
    IMAGE: '/messenger/image',
    VOICE: '/messenger/voice',
  },
} as const

// Хелперы для динамических путей
export const EndpointHelpers = {
  posts: {
    byId: (id: string) => `/posts/${id}`,
    byUser: (userId: string) => `/posts/user/${userId}`,
    comments: (postId: string) => `/posts/${postId}/comments`,
    reply: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}/replies`,
    like: (postId: string) => `/posts/${postId}/like`,
    commentLike: (postId: string, commentId: string) => `/posts/${postId}/comments/${commentId}/like`,
  },
  sessions: {
    byDevice: (deviceId: string) => `/sessions/${deviceId}`,
  },
  oAuth: {
    byProvider: (provider: string) => `/auth/oauth/${provider}`,
  },
  profile: {
    byId: (userId: string) => `/profile/${userId}`,
    followers: (userId: string) => `/profile/${userId}/followers`,
    following: (userId: string) => `/profile/${userId}/following`,
  },
  users: {
    follow: (userId: string) => `/users/${userId}/follow`,
  },
  subscriptions: {
    capture: (orderId: string) => `/subscriptions/capture/${orderId}`,
    autoRenewal: (subscriptionId: string) => `/subscriptions/${subscriptionId}/auto-renewal`,
  },
}
