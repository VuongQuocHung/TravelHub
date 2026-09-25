const multer = require("multer");
const { storage } = require("../../helpers/cloudinary.helper");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const imageUpload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    // Form tour có tối đa 1 ảnh đại diện và 10 ảnh phụ.
    files: 11
  },
  fileFilter: (req, file, callback) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(new Error("Chỉ chấp nhận file ảnh JPG, PNG, WEBP hoặc GIF"));
      return;
    }

    callback(null, true);
  }
});

// Bọc middleware Multer để mọi lỗi upload đều được trả về dưới dạng JSON.
// Frontend có thể hiển thị message này thay vì nhận một trang lỗi HTML.
const handleUpload = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          code: "error",
          message: error.message || "File tải lên không hợp lệ"
        });
      }

      next();
    });
  };
};

module.exports.singleImage = (fieldName) => {
  return handleUpload(imageUpload.single(fieldName));
};

module.exports.imageFields = (fields) => {
  return handleUpload(imageUpload.fields(fields));
};

module.exports.noFile = () => {
  return handleUpload(imageUpload.none());
};
