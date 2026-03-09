const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

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

  console.log("Chạy vào controller");

  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "initial"
  });

  await newAccount.save();
  
  // hàm của express: chuyển js sang json và trả về cho frontend json
  res.json({
    code: "error",
    message: "Đăng nhập thành công"
  })
}

module.exports.loginPost = async (req, res) => {
  const {email, password} = req.body;
  const existAccount = await AccountAdmin.findOne({
    email: email
  })
  if(!existAccount){
    res.json({
      code: "error",
      message: 'Email khong ton tai trong he thong'
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);

  if(!isPasswordValid){
    res.json({
      code: "error",
      message: 'Mat khau khong dung'
    });
    return;
  }

  if(existAccount.status != "active"){
    res.json({
      code: "error",
      message: 'Tai khoan chua duoc duyet'
    });
    return;
  }

  // Tạo chuỗi bảo mật JWT 
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email
    }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "1d" // token có hiệu lực 1 ngày
    }
  )
  res.cookie("token", token, {
    maxAge: (1 * 24 * 60 * 60 * 1000) * 1,
    httpOnly: true, // Chỉ cho phép cookie được truy cận bởi server
    sameSite: 'strict', // chỉ cho phép truy cập khi cùng tên miền
  })

  res.json({
    code: "success",
    message: 'Email khong ton tai trong he thong'
  });

  console.log("tai khoan la: " + existAccount);

}

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
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



