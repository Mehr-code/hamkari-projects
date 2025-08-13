const user = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { route } = require("../routes/authRoutes");

// Generate JWT
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

    // Check Is This User Exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است." });
    }

    // Determine User Role Base Of Token, If True --> Admin , Else --> User
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    // Hashing The Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create A New User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });

    // Return User Data By JWT
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Login A User
// @route --> POST /api/auth/login
// @access --> Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "کلمه عبور یا ایمیل وارد شده، نامعتبر است" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "کلمه عبور یا ایمیل وارد شده، نامعتبر است" });
    }

    // Return User Data By JWT
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Get A Profile User
// @route --> POST /api/auth/profile
// @access --> Private (Requires JWT)
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "کاربری با این مشخصات یافت نشد" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

// @desc --> Update A Profile User
// @route --> POST /api/auth/profile
// @access --> Private (Requires JWT)
const updateUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "کاربری مورد نظر یافت نشد" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "خطای داخلی سرور", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserInfo, updateUserInfo };
