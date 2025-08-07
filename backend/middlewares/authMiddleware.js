const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware To Protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1]; // Extracing Token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } else {
      res
        .status(401)
        .json({ message: "کابر شناسایی نشد، هیچ توکنی وجود ندارد" });
    }
  } catch (error) {
    res.status(401).json({ message: "توکن پیدا نشد", error: error.message });
  }
};

// Middleware For Admin-base Access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "دسترسی رد شد. دسترسی فقط برای مدیر مقدور میباشد." });
  }
};

module.exports = {
  protect,
  adminOnly,
};
