// Base URL of the backend API
export const BASE_URL = "http://localhost:8000";

// API_PATHS contains all endpoints used in the application
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Endpoint to register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/info", // Get details of the logged-in user
  },
  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
  },
  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get dashboard data for admin
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get dashboard data for user
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all tasks, User: assigned only)
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)
    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist of a task
  },
  REPORTS: {
    EXPORT_TASKS: "/api/report/export/tasks", // Export all tasks in Excel format
    EXPORT_USERS: "/api/report/export/users", // Export user-task report
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload user profile image
  },
};
