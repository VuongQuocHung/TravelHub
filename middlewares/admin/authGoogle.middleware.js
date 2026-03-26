const passport = require('passport');
const jwt = require('jsonwebtoken');

// Khi user click nút đăng nhập Google, hàm này redirect user sang trang đăng nhập của Google. scope là danh sách thông tin xin phép lấy từ tài khoản Google của user — ở đây ta lấy lấy tên và email.
module.exports.loginGoogle = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
};

// Hàm này là callback sau khi đăng nhập Google thành công, dùng Passport.js để:
//  - Xác thực user từ Google
//  - Tạo JWT
//  - Lưu vào cookie
//  - Redirect vào dashboard
module.exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: `/${pathAdmin}/account/login`,
    session: false
  }, (err, account) => {

    if (err || !account) {
      return res.redirect(`/${pathAdmin}/account/login`);
    }

    // Tạo token
    const token = jwt.sign(
      { id: account.id, email: account.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Gắn cookie
    res.cookie('token', token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
    });

    // Lưu user vào req để controller dùng (nếu cần)
    req.user = account;

    next(); //  chuyển sang controller
  })(req, res, next);
};