const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const { getUserById, getUsers } = require("../controllers/userController");

const router = express.Router();

// User Routes Management
router.get("/", protect, adminOnly, getUsers); // Get All User (For Admin Role)
router.get("/:id", protect, getUserById); // Get A Specefic User

module.exports = router;
