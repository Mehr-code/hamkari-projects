import axios from "axios";
import { BASE_URL } from "./apiPaths";

// Create a custom Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all API requests
  timeout: 10000, // Request timeout in milliseconds (10s)
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Accept JSON responses
  },
});

// Request interceptor to add Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Add Bearer token
    }
    return config; // Return modified config
  },
  (error) => {
    return Promise.reject(error); // Reject the promise on request error
  }
);

// Response interceptor to handle common API errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return response directly if successful
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Only logout on real unauthorized
        console.warn("دسترسی غیرمجاز! در حال انتقال به صفحه ورود...");
        window.location.href = "/login";
      } else if (status === 500) {
        // Server error: log a message
        console.error("خطای سرور. لطفاً بعداً دوباره تلاش کنید.");
      } else if (error.code === "ECONNABORTED") {
        // Request timeout: log a message
        console.error("مهلت درخواست به پایان رسید. لطفاً دوباره امتحان کنید.");
      } else {
        console.error("خطای شبکه یا ناشناخته:", error.message);
      }
    }
    return Promise.reject(error); // Reject the promise for further handling
  }
);

export default axiosInstance; // Export the configured Axios instance
