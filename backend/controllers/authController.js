const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc --> Register A New User
// @route --> POST /api/auth/register
// @access --> Public
const registerUser = async (req, res) => {};

// @desc --> Login A User
// @route --> POST /api/auth/login
// @access --> Public
const loginUser = async (req, res) => {};

// @desc --> Get A Profile User
// @route --> POST /api/auth/profile
// @access --> Private (Requires JWT)
const getUserProfile = async (req, res) => {};

// @desc --> Update A Profile User
// @route --> POST /api/auth/profile
// @access --> Private (Requires JWT)
const updateUserProfile = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
