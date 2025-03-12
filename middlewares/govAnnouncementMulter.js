const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "media") {
      cb(null, path.join(__dirname, "../uploads/govAnnouncementMedia"));
    } else if (file.fieldname === "documents") {
      cb(null, path.join(__dirname, "../uploads/govAnnouncementFiles"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});


const fileFilter = (req, file, cb) => {
  if (file.fieldname === "media") {

    const allowedMediaTypes = ["image/jpeg", "image/png", "video/mp4"];
    if (allowedMediaTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed for media!"), false);
    }
  } else if (file.fieldname === "documents") {

    const allowedDocTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, or .docx files are allowed for documents!"), false);
    }
  }
};


const govAnnouncementMulter = multer({
  storage,
  fileFilter,
  limits: { fileSize: 55 * 1024 * 1024 },
});

module.exports = { govAnnouncementMulter };
