// frontend/src/config/app.config.ts
// This is the SINGLE SOURCE OF TRUTH for all branding on the frontend.

export const appConfig = {
    name: import.meta.env.VITE_APP_NAME || 'EventByte',
    tagline: import.meta.env.VITE_APP_TAGLINE || '',
    logoUrl: import.meta.env.VITE_APP_LOGO_URL || null,
    faviconUrl: import.meta.env.VITE_APP_FAVICON_URL || null,
    primaryColor: import.meta.env.VITE_APP_PRIMARY_COLOR || '#4F46E5',
    secondaryColor: import.meta.env.VITE_APP_SECONDARY_COLOR || '#06B6D4',
    supportEmail: import.meta.env.VITE_APP_SUPPORT_EMAIL || 'support@eventbyte.com',
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000',
    features: {
        calling: import.meta.env.VITE_ENABLE_CALLING === 'true',
        payments: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
        certificates: import.meta.env.VITE_ENABLE_CERTIFICATES !== 'false',
    },
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    googleAuthEnabled: import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    tenantId: import.meta.env.VITE_TENANT_ID || 'default',
} as const;
