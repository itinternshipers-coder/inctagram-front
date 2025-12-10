export const ROUTES = {
  // Публичные
  PUBLIC: {
    HOME: '/',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    PASSWORD_RECOVERY: '/auth/password-recovery',
    CONFIRM_EMAIL: '/auth/confirm-email',
    TERMS: '/auth/terms-of-service',
    PRIVACY: '/auth/privacy-policy',
    CUSTOM_ERROR: '/custom-error',
  },

  // Защищенные
  PROTECTED: {
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },

  // Модальные роуты (если нужны)
  MODALS: {
    POST: (postId: string) => `/post/${postId}`,
    // CREATE_POST: '/post/create',
  },

  // Динамические (функции)
  DYNAMIC: {
    PROFILE: (userId: string) => `/profile/${userId}`,
    POST_MODAL: (postId: string) => `/post/${postId}`,
    SETTINGS_TAB: (tab: string) => `/settings?part=${tab}`,
  },
} as const
