import axios from "axios";
import { env } from "../config/env.config";

const api = axios.create({
  baseURL: env.api_base_url ?? "http://localhost:5000",
  withCredentials: true, // required for httpOnly JWT cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: global 401 interceptor to handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally redirect or notify — AuthContext handles this via getMeApi
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;