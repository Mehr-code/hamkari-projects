import axios from "axios";
import { BASE_URL } from "./apiPaths";
import Swal from "sweetalert2";

// Create a custom Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL for all API requests
  timeout: 10000, // Request timeout in milliseconds (10s)
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Accept JSON responses
  },
});

// Health check function: checks if server & MongoDB are up
const checkDbHealth = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/healthDB`);
    return res.data.status === "ok" && res.data.database === "connected";
  } catch (err) {
    console.log(err);
    return false;
  }
};

// Request interceptor: Health check + add Authorization token
axiosInstance.interceptors.request.use(
  async (config) => {
    const DbIsHealthy = await checkDbHealth();
    if (!DbIsHealthy) {
      Swal.fire({
        icon: "error",
        title: "مشکل اتصال به سرور",
        text: "دیتابیس یا سرور در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.",
        showConfirmButton: true,
        confirmButtonText: "باشه",
        confirmButtonColor: "#1368EC",
      });
      return Promise.reject(new Error("Server or DB is down"));
    }
    // Add Bearer token if exists
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
      if (status === 401 && window.location.pathname !== "/login") {
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
