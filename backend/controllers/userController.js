const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc    Get All Users (For Admin Role Only)
// @route   GET /api/users/
// @access  Private (For Admin Role Only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add Task Counts For Each User
    const userWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const compeletedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Compeleted",
        });
        return {
          ...user._doc, // Include ALl Existing User Data
          pendingTasks,
          inProgressTasks,
          compeletedTasks,
        };
      })
    );
    res.json(userWithTaskCounts);
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Get User By ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

// @desc    Delete A User (For Admin Role Only)
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "خطای داخلی سرور", error: err.message });
  }
};

module.exports = { getUsers, getUserById, deleteUser };
