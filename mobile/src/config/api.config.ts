/**
 * Configuration de l'API Backend
 */

export const API_CONFIG = {
  // URL du backend NestJS
  BASE_URL: __DEV__
    ? 'http://localhost:3000' // Development
    : 'https://api.votre-domaine.com', // Production

  // Version de l'API
  API_VERSION: 'v1',

  // Timeout des requêtes (ms)
  TIMEOUT: 30000,

  // Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REFRESH: '/api/v1/auth/refresh',
      LOGOUT: '/api/v1/auth/logout',
      ME: '/api/v1/auth/me',
      CHANGE_PASSWORD: '/api/v1/auth/change-password',
    },

    // Interventions
    INTERVENTIONS: {
      BASE: '/api/v1/interventions',
      MY_INTERVENTIONS: '/api/v1/interventions/my-interventions',
      SEARCH: '/api/v1/interventions/search',
      NEARBY: '/api/v1/interventions/nearby',
      BY_ID: (id: string) => `/api/v1/interventions/${id}`,
      START: (id: string) => `/api/v1/interventions/${id}/start`,
      COMPLETE: (id: string) => `/api/v1/interventions/${id}/complete`,
      CANCEL: (id: string) => `/api/v1/interventions/${id}/cancel`,
      ADD_NOTE: (id: string) => `/api/v1/interventions/${id}/notes`,
      UPLOAD_PHOTO: (id: string) => `/api/v1/interventions/${id}/photos`,
      UPLOAD_SIGNATURE: (id: string) => `/api/v1/interventions/${id}/signature`,
    },

    // Clients
    CUSTOMERS: {
      BASE: '/api/v1/customers',
      SEARCH: '/api/v1/customers/search',
      NEARBY: '/api/v1/customers/nearby',
      BY_ID: (id: string) => `/api/v1/customers/${id}`,
      CONTACTS: (id: string) => `/api/v1/customers/${id}/contacts`,
    },

    // Projets
    PROJECTS: {
      BASE: '/api/v1/projects',
      MY_PROJECTS: '/api/v1/projects/my-projects',
      SEARCH: '/api/v1/projects/search',
      NEARBY: '/api/v1/projects/nearby',
      BY_ID: (id: string) => `/api/v1/projects/${id}`,
      STATS: '/api/v1/projects/stats/global',
    },

    // Ventes
    SALES: {
      RECENT_DOCUMENTS: '/api/v1/sales/documents/recent',
      SEARCH_DOCUMENTS: '/api/v1/sales/documents/search',
      DOCUMENT_BY_ID: (id: string) => `/api/v1/sales/documents/${id}`,
      DOCUMENT_WITH_LINES: (id: string) => `/api/v1/sales/documents/${id}/with-lines`,
      MY_QUOTES: '/api/v1/sales/quotes/my-quotes',
    },

    // Synchronisation
    SYNC: {
      LAST_SYNC: '/api/v1/sync/last-sync',
      SYNC_INTERVENTIONS: '/api/v1/sync/interventions',
      SYNC_CUSTOMERS: '/api/v1/sync/customers',
      SYNC_PROJECTS: '/api/v1/sync/projects',
      FULL_SYNC: '/api/v1/sync/full',
    },

    // Calendrier
    CALENDAR: {
      MY_EVENTS: '/api/v1/calendar/my-events',
      TODAY: '/api/v1/calendar/today',
      WEEK: '/api/v1/calendar/week',
      MONTH: (year: number, month: number) => `/api/v1/calendar/month/${year}/${month}`,
      EVENT_BY_ID: (id: string) => `/api/v1/calendar/events/${id}`,
      STATS: '/api/v1/calendar/stats',
      RESCHEDULE: (id: string) => `/api/v1/calendar/events/${id}/reschedule`,
    },
  },
};

export default API_CONFIG;
