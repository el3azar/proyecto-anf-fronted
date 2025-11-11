// src/services/apiClient.js
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "analisis_token";

export const getApiBase = () => API_URL;

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
