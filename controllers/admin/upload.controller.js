module.exports.imagePost = async (req, res) => {
  // TinyMCE luôn phải gửi kèm một ảnh hợp lệ.
  if (!req.file) {
    return res.status(400).json({
      code: "error",
      message: "Vui lòng chọn ảnh cần tải lên"
    });
  }

  res.json({
    location: req.file.path
  });
}
