const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    cb(null, path.join(__dirname, "../uploads/profile"));
  },
  filename: (req, file, cb) => {

    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const profileUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/mov"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },
});



module.exports = profileUpload;
