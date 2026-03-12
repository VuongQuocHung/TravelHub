const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { randomNumberString } = require("../../helpers/random.helper");
const ForgotPassword = require("../../models/forgot-password.model");
const { sendMail } = require("../../helpers/mail.helper")

module.exports.login = async (req, res) => {
  res.render('admin/pages/login', {
    pageTitle: 'Đăng nhập',
  });
}

module.exports.register = async (req, res) => {
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
    code: "success",
    message: "Đăng ký thành công"
  })
}

module.exports.loginPost = async (req, res) => {
  const {email, password, rememberPassword } = req.body;
  const existAccount = await AccountAdmin.findOne({
    email: email
  })
  if(!existAccount){
    res.json({
      code: "error",
      message: 'Email không tồn tại'
    });
    return;
  }
  // Kiểm tra mật khẩu khớp hay không
  const isPasswordValid = await bcrypt.compare(password, existAccount.password);

  if(!isPasswordValid){
    res.json({
      code: "error",
      message: 'Mật khẩu không đúng'
    });
    return;
  }

  if(existAccount.status != "active"){
    res.json({
      code: "error",
      message: 'Tài khoản chưa được duyệt'
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
      expiresIn: rememberPassword ? "7d" : "1d" // token có hiệu lực trong 7 ngày hoặc 1 ngày
    }
  )
  res.cookie("token", token, {
    maxAge: rememberPassword ? ((1 * 24 * 60 * 60 * 1000) * 7) : (1 * 24 * 60 * 60 * 1000) * 1, // 7 ngày hoặc 1 ngày
    httpOnly: true, // Chỉ cho phép cookie được truy cận bởi server
    sameSite: 'strict', // chỉ cho phép truy cập khi cùng tên miền
  })

  res.json({
    code: "success",
    message: "Đăng nhập thành công!"
  });

  // console.log("tai khoan la: " + existAccount);

}

module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  })
}

module.exports.forgotPassword = async (req, res) => {
  res.render('admin/pages/forgot-password', {
    pageTitle: 'Quên mật khẩu',
  });
}

module.exports.forgotPasswordPost = async (req, res) => {
  const {email} = req.body;

  // Kiểm tra email đã tồn tại chưa
  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(!existAccount){
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    });
    return;
  }

  // Kiểm tra email đã tồn tại trong ForgotPassword chưa (để tránh spam mã otp)
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  });
  if(existEmailInForgotPassword){
    res.json({
      code: "error",
      message: "Mã otp đã được gửi về email, vui lòng thử lại sau 5 phút!"
    });
    return;
  }

  // Tạo mã otp
  const otp = randomNumberString(6);

  // Lưu vào CSDL: email, otp, sau 5p tự xóa bản ghi
  const newRecord = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now() + (5 * 60 * 1000)
  });
  await newRecord.save()

  // Gửi mã OTP tự động về email của người dùng
  const subject = 'Mã otp quên mật khẩu';
  const content = `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác thực mã OTP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              <tr>
                  <td style="padding: 40px 0; text-align: center; background-color: #007bff;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">XÁC THỰC TÀI KHOẢN</h1>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 40px 30px;">
                      <p style="font-size: 16px; color: #333333; line-height: 1.5; margin-bottom: 25px;">
                          Chào bạn,<br><br>
                          Bạn vừa yêu cầu mã xác thực (OTP) để thực hiện giao dịch hoặc đăng nhập. Vui lòng sử dụng mã dưới đây:
                      </p>
                      <div style="text-align: center; margin: 30px 0;">
                          <div style="display: inline-block; padding: 15px 40px; background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 10px;">
                              <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${otp}</span>
                          </div>
                      </div>
                      <p style="font-size: 14px; color: #666666; text-align: center; margin-top: 25px;">
                          Mã OTP này có hiệu lực trong <strong>5 phút</strong>.
                      </p>
                      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                          <p style="font-size: 13px; color: #856404; margin: 0;">
                              <strong>Lưu ý:</strong> Vui lòng <strong>không cung cấp mã OTP này cho bất kỳ ai</strong>, kể cả nhân viên hỗ trợ của chúng tôi. Nếu bạn không thực hiện yêu cầu này, hãy đổi mật khẩu ngay lập tức.
                          </p>
                      </div>
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px 30px; background-color: #fdfdfd; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="font-size: 12px; color: #999999; margin: 0;">
                          &copy; 2026 Công ty của bạn. Mọi quyền được bảo lưu.
                      </p>
                  </td>
              </tr>
          </table>
      </body>
    </html>
  `;

  await sendMail(email, subject, content);
  
  res.json({
    code: "success",
    message: "Đã gửi mã OTP qua email"
  })

}

module.exports.otpPassword = async (req, res) => {
  res.render('admin/pages/otp-password', {
    pageTitle: 'Nhập mã otp',
  });
}

module.exports.otpPasswordPost = async (req, res) => {
  const {email, otp} = req.body;
  const existRecord = await ForgotPassword.findOne({
    otp: otp,
    email: email
  });

  if(!existRecord){
    res.json({
      code: "error",
      message: "Mã OTP không đúng"
    });
    return;
  }

  await ForgotPassword.findOneAndDelete({
    otp: otp,
    email: email
  });

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(!existAccount){
    res.json({
      code: "error",
      message: "Tài khoản không tìm thấy"
    });
    return;
  }

  // Tạo chuỗi bảo mật JWT 
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: email
    }, 
    process.env.JWT_SECRET,
    {
      expiresIn: "1d" // token có hiệu lực trong 1 ngày
    }
  )
  res.cookie("token", token, {
    maxAge: (1 * 24 * 60 * 60 * 1000) * 1, // 1 ngày
    httpOnly: true, // Chỉ cho phép cookie được truy cận bởi server
    sameSite: 'strict', // chỉ cho phép truy cập khi cùng tên miền
  })

  res.json({
    code: "success",
    message: "Xác thực mã OTP thành công!"
  });
}

module.exports.resetPassword = async (req, res) => {
  res.render('admin/pages/reset-password', {
    pageTitle: 'Đổi mật khẩu',
  });
}



