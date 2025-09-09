const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { route } = require("../routes/authRoutes");

// Generate JWT token for authentication
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc --> Register A New User
// @route --> POST /api/auth/register
// @access --> Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    // Check if the user already exists by email
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است." });
    }

    // Determine user role based on admin invite token
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    // Hash the password before saving to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    // Return user data along with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Internal server error handling
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Login A User
// @route --> POST /api/auth/login
// @access --> Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "کلمه عبور یا ایمیل وارد شده، نامعتبر است" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "کلمه عبور یا ایمیل وارد شده، نامعتبر است" });
    }

    // Return user data along with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Internal server error handling
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Get Profile Information of Logged-in User
// @route --> GET /api/auth/profile
// @access --> Private (Requires JWT)
const getUserInfo = async (req, res) => {
  try {
    // Find user by ID extracted from JWT
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "کاربری با این مشخصات یافت نشد" });
    }
    res.status(200).json(user);
  } catch (error) {
    // Internal server error handling
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Update Profile Information of Logged-in User
// @route --> PUT /api/auth/profile
// @access --> Private (Requires JWT)
const updateUserInfo = async (req, res) => {
  try {
    // Find user by ID from JWT
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "کاربری مورد نظر یافت نشد" });
    }

    // Update name and email if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If password provided, hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user data along with new JWT
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    // Internal server error handling
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// Export the controller functions
module.exports = { registerUser, loginUser, getUserInfo, updateUserInfo };
