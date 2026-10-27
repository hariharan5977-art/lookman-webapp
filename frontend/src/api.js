// Centralized API Base URL configuration
// In development: defaults to '/api' (forwarded to localhost:5000 via Vite proxy)
// In production: defaults to '/api' or the VITE_API_URL environment variable if deployed separately
export const API_BASE = import.meta.env.VITE_API_URL || '/api';
