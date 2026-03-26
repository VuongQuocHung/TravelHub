// Tìm account trong DB theo email
// Nếu chưa có thì tạo mới
// Nếu có rồi thì kiểm tra status
// Gọi done(null, account) để truyền account sang bước tiếp theo

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AccountAdmin = require('../models/account-admin.model');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const fullName = profile.displayName;

   //  console.log(profile);

    let account = await AccountAdmin.findOne({ email });

    console.log("Account tìm được:", account);

    if (!account) {
      // Tự động tạo tài khoản nếu chưa có
      account = new AccountAdmin({
        fullName,
        email,
        password: '', // Không cần mật khẩu khi đăng nhập Google
        status: 'active', // Tự động active vì đã xác thực qua Google
        googleId: profile.id,
      });
      await account.save();
      // console.log("Đã tạo account mới:", account);
    } else if (account.status !== 'active') {
      // console.log("Account status:", account.status); 
      return done(null, false, { message: 'Tài khoản chưa được duyệt' });
    }

    return done(null, account);
  } catch (err) {
    console.log("Lỗi passport:", err);
    return done(err, null);
  }
}));

module.exports = passport;