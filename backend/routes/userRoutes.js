const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getUserById,
  getUsers,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// User Routes Management
router.get("/", protect, adminOnly, getUsers); // Get All User (For Admin Role)
router.get("/:id", protect, getUserById); // Get A Specefic User
router.delete("/:id", protect, adminOnly, deleteUser); // Delete A Specefic User (For Admin Role)

module.exports = router;
