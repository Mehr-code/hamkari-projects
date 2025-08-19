const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
} = require("../controllers/taskController");

const router = express.Router();

// Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get All Tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, createTask); // Create A Task (For Admin Role Only)
router.put("/:id", protect, updateTask); // Update Task Details
router.put("/:id/status", protect, updateTaskStatus); // Update Task Status
router.put("/:id/checklist", protect, updateTaskChecklist); // Update Task Checklist
router.delete("/:id", protect, adminOnly, deleteTask); // Delete A Task (For Admin Role Only)

module.exports = router;
