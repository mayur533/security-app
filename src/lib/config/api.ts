/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

// Backend API Base URL
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth` 
    : 'http://localhost:8000/api/auth',
  TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_CONFIG.AUTH_BASE_URL}/login/`,
    REGISTER: `${API_CONFIG.AUTH_BASE_URL}/register/`,
    LOGOUT: `${API_CONFIG.AUTH_BASE_URL}/logout/`,
    REFRESH: `${API_CONFIG.AUTH_BASE_URL}/refresh/`,
    PROFILE: `${API_CONFIG.AUTH_BASE_URL}/profile/`,
  },
  
  // Organizations (Super Admin only)
  ORGANIZATIONS: {
    LIST: `${API_CONFIG.BASE_URL}/api/auth/admin/organizations/`,
    CREATE: `${API_CONFIG.BASE_URL}/api/auth/admin/organizations/`,
    DETAIL: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/organizations/${id}/`,
    UPDATE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/organizations/${id}/`,
    DELETE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/organizations/${id}/`,
  },
  
  // Sub-Admins (Super Admin only)
  SUB_ADMINS: {
    LIST: `${API_CONFIG.BASE_URL}/api/auth/admin/subadmins/`,
    CREATE: `${API_CONFIG.BASE_URL}/api/auth/admin/subadmins/`,
    DETAIL: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/subadmins/${id}/`,
    UPDATE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/subadmins/${id}/`,
    DELETE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/subadmins/${id}/`,
  },
  
  // Geofences
  GEOFENCES: {
    LIST: `${API_CONFIG.BASE_URL}/api/auth/admin/geofences/`,
    CREATE: `${API_CONFIG.BASE_URL}/api/auth/admin/geofences/`,
    DETAIL: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/geofences/${id}/`,
    UPDATE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/geofences/${id}/`,
    DELETE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/geofences/${id}/`,
  },
  
  // Alerts
  ALERTS: {
    LIST: `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/`,
    CREATE: `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/`,
    DETAIL: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/${id}/`,
    UPDATE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/${id}/`,
    RESOLVE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/${id}/`,
    DELETE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/alerts/${id}/`,
  },
  
  // Reports (Super Admin only)
  REPORTS: {
    LIST: `${API_CONFIG.BASE_URL}/api/auth/admin/reports/`,
    CREATE: `${API_CONFIG.BASE_URL}/api/auth/admin/reports/`,
    GENERATE: `${API_CONFIG.BASE_URL}/api/auth/reports/generate/`,
    DOWNLOAD: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/reports/${id}/download/`,
    DELETE: (id: number) => `${API_CONFIG.BASE_URL}/api/auth/admin/reports/${id}/`,
  },
  
  // Dashboard
  DASHBOARD: {
    KPIS: `${API_CONFIG.BASE_URL}/api/auth/dashboard-kpis/`,
  },
  
  // Documentation
  DOCS: {
    SCHEMA: `${API_CONFIG.BASE_URL}/api/schema/`,
    SWAGGER: `${API_CONFIG.BASE_URL}/api/docs/`,
    REDOC: `${API_CONFIG.BASE_URL}/api/redoc/`,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

// Default Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Export utility function to get auth headers
export const getAuthHeaders = (token?: string): HeadersInit => {
  const accessToken = token || (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null);
  
  return {
    ...DEFAULT_HEADERS,
    ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
  };
};


