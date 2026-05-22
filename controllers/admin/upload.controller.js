module.exports.imagePost = async (req, res) => {
  const link = req.file ? req.file.path : "";
  res.json({
    location: link
  });
}