/**
 * API service layer using Axios
 * All backend calls are centralized here
 */

import axios from 'axios';
import { getAppOrigin } from '../utils/helpers';

const BASE_URL = `${getAppOrigin()}/api`;

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// ── Response interceptor for consistent error handling ──────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Generate a SIF file from employee data
 * @param {Object} formData - Employee form data
 * @returns {Promise<Object>} - API response with downloadUrl, fileName, sifContent
 */
export const generateSIF = async (formData) => {
  const response = await apiClient.post('/generate-sif', formData);
  return response.data;
};

/**
 * Fetch all previously generated SIF records
 * @returns {Promise<Object>} - API response with records array
 */
export const fetchHistory = async () => {
  const response = await apiClient.get('/history');
  return response.data;
};

export default apiClient;
