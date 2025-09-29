import axios from "axios";

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable cookies for authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens or other headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Cookies are automatically included with withCredentials: true
    // No need to manually add auth headers since we're using cookies
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      console.error(
        "Server error:",
        error.response.status,
        error.response.data
      );

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = "/login";
          break;
        case 403:
          // Forbidden
          console.error("Access forbidden");
          break;
        case 404:
          // Not found
          console.error("Resource not found");
          break;
        case 500:
          // Server error
          console.error("Internal server error");
          break;
        default:
          console.error("HTTP error:", error.response.status);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error - no response received:", error.request);
    } else {
      // Other error
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
