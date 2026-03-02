const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");

module.exports.login = (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Đăng nhập',
  });
}

module.exports.register = (req, res) => {
  res.render('admin/pages/register', {
    pageTitle: 'Đăng ký',
  });
}

module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const {fullName, email, password} = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(existAccount){
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  // Mã hóa mật khẩu với bcryptjs 
  const salt = await bcrypt.genSalt(10); // Tạo salt - chuỗi ngẫu nhiên có 10 ký tự 
  const hashedPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu


  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "initial"
  });

  await newAccount.save();
  
  // hàm của express: chuyển js sang json và trả về cho frontend json
  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!"
  })
}

module.exports.forgotPassword = (req, res) => {
  res.render('admin/pages/forgot-password', {
    pageTitle: 'Quên mật khẩu',
  });
}

module.exports.otpPassword = (req, res) => {
  res.render('admin/pages/otp-password', {
    pageTitle: 'Nhập mã otp',
  });
}

module.exports.resetPassword = (req, res) => {
  res.render('admin/pages/reset-password', {
    pageTitle: 'Đổi mật khẩu',
  });
}



