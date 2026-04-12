const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
  try {
    const email = req.body.email;

    const existRecord = await Contact.findOne({ email });
    if (existRecord) {
      res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống !"
      });
      return;
    }

    const newRecord = new Contact({ email });
    await newRecord.save();

    res.json({
      code: "success",
      message: "Cảm ơn bạn đã đăng ký nhận tin tức !"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Tạo thông tin liên hệ không thành công !"
    });
  }
}