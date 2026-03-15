export const TOKEN_MODULE_CONFIG = {
  INSTANCE: {
    KONGA: 'konga',
    KPAY: 'kpay',
  },
  CACHE_KEY_PREFIX: {
    KONGA: 'konga-auth',
    KPAY: 'kpay-auth',
  },
  DEFAULT_JWT_EXPIRY_SECONDS: 1800,
  GRANT_TYPE: 'client_credentials',
  CONTENT_TYPE: 'application/x-www-form-urlencoded',
  TOKEN_PATH: '/oauth/token',
} as const;
