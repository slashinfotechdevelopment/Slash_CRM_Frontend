/**
 * Environment configuration.
 * Base URL does not include /api because endpoints already start with /api.
 * Use the browser's hostname by default so the app works when opened through
 * either localhost or a machine's LAN IP address.
 */
const getDefaultApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:5000`;
  }

  return 'http://192.168.0.16:5000';
};

export const ENV = {
  API_BASE_URL: (import.meta.env.VITE_API_BASE_URL as string) || getDefaultApiBaseUrl(),
  APP_NAME: 'Slash Infotech CRM',
  TIMEOUT_MS: 30000,
} as const;
