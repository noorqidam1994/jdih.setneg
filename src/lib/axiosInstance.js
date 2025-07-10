import axios from "axios";
import https from "https";
import { server } from "../config";

const Agent = new https.Agent({
  rejectUnauthorized: false,
});

// For server-side rendering in Docker, use localhost:3000 directly
const getBaseURL = () => {
  // Check if we're on server-side (no window object) and in production
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // In Docker container, use localhost for internal API calls
    return 'http://localhost:3000';
  }
  // For client-side or development, use the configured server
  return server;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  httpsAgent: Agent,
  timeout: 30000, // 30 seconds for large database operations
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
  function (config) {
    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      config.url,
      config.data
    );
    return config;
  },
  function (error) {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  function (error) {
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, logging out...");
    }

    // Add retry logic for timeout errors
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.log("Request timeout, you may want to retry");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
