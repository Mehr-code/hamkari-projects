const multer = require("multer");

// Config Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedType = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("فقط عکس هایی با فرمت jpeg، jpg و png قابل قبول است."), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
