const AccountAdmin = require("../../models/account-admin.model");
const jwt = require('jsonwebtoken');

module.exports.edit = async (req, res) => {
  res.render('admin/pages/profile-edit', {
    pageTitle: 'Trang chỉnh sửa thông tin cá nhân',
  });
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.account.id;

    const existEmail = await AccountAdmin.findOne({
      email: req.body.email,
      _id: { $ne: id }
    });

    if(existEmail){
      res.json({
        code: "error",
        message: "Email đã tồn tại trên hệ thống"
      });
      return;
    }
    
    const existPhone = await AccountAdmin.findOne({
      phone: req.body.phone,
      _id: { $ne: id }
    });

    if(existPhone){
      res.json({
        code: "error",
        message: "Số điện thoại đã tồn tại trên hệ thống"
      });
      return;
    } 

    req.body.avatar = req.file ? req.file.path : "";
    req.body.updateBy = id;

    await AccountAdmin.updateOne({
      _id: id
    }, req.body);

    const token = jwt.sign({
      id: id,
      email: req.body.email
    }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie("token", token, {
      maxAge: 1 * (24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      sameSite: "strict", // Chỉ cho phép truy cập khi cùng tên miền
    });

    res.json({
      code: "success",
      message: "Cập nhật thông tin cá nhân thành công",
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Có lỗi xảy ra khi cập nhật thông tin cá nhân"
    });
  }
}

module.exports.changePassword = async (req, res) => {
  res.render('admin/pages/profile-change-password', {
    pageTitle: 'Trang đổi mật khẩu',
  });
}