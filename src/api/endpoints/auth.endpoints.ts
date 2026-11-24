export const AUTH_ENDPOINTS = {
  REQUEST_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  REFRESH: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  LOGOUT_ALL: '/api/auth/logout-all',
  ME: '/api/auth/me',
  BOOTSTRAP: '/api/auth/bootstrap-super-admin',
} as const;
