const Contact = require("../../models/contact.model");

module.exports.createPost = async (req, res) => {
  const { email } = req.body;

  const existRecord = await Contact.findOne({ email });
  if(existRecord){
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống !"
    })
    return;
  }

  const newRecord = new Contact(req.body);
  newRecord.save();

  res.json({
    code: "success",
    message: "Cảm ơn bạn đã đăng ký nhận tin tức !"
  })
}