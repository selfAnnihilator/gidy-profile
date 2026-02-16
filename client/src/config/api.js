export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Validate that the API base URL is configured
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("API base URL not configured in environment variables. Using default.");
}