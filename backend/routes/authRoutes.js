const express = require("express");
const {
  registerUser,
  loginUser,
  getUserInfo,
  updateUserInfo,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Registering A User
router.post("/login", loginUser); // Login User
router.get("/info", protect, getUserInfo); // Get A User Info
router.put("/info", protect, updateUserInfo); // Update A User Info

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "هیچ عکسی بارگذاری نشده" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
