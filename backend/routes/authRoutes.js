const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Registering A User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, updateUserProfile); // Update A Profile User
router.get("/profile", protect, getUserProfile); // Get A profile User

module.exports = router;
