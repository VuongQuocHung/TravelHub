// Tìm account trong DB theo email.
// Nếu chưa có thì tạo mới, tự động kích hoạt và gán role admin mặc định.
// Nếu đã có thì kiểm tra trạng thái và role trước khi cho đăng nhập.
// Gọi done(null, account) để truyền account sang bước tiếp theo.

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AccountAdmin = require('../models/account-admin.model');
const Role = require('../models/role.model');
const { permissionsList } = require('./variable.config');

// Lấy role được cấu hình; nếu chưa cấu hình thì dùng hoặc tạo role có toàn bộ quyền.
const getGoogleAdminRole = async () => {
  const configuredRoleId = process.env.GOOGLE_DEFAULT_ROLE_ID?.trim();

  if (configuredRoleId) {
    const configuredRole = await Role.findOne({
      _id: configuredRoleId,
      deleted: false
    });

    if (
      !configuredRole ||
      !Array.isArray(configuredRole.permissions) ||
      !configuredRole.permissions.includes('dashboard-view')
    ) {
      throw new Error('GOOGLE_DEFAULT_ROLE_ID không trỏ tới role admin hợp lệ');
    }

    return configuredRole;
  }

  const adminPermissions = permissionsList.map(permission => permission.value);

  // Ưu tiên dùng lại một role đang có đầy đủ quyền để tránh tạo role trùng lặp.
  let adminRole = await Role.findOne({
    deleted: false,
    permissions: { $all: adminPermissions }
  });

  if (adminRole) {
    return adminRole;
  }

  // Nếu database chưa có role toàn quyền, tạo role dành riêng cho tài khoản Google.
  adminRole = await Role.findOne({ name: 'Quản trị viên Google' });

  if (!adminRole) {
    adminRole = new Role({
      name: 'Quản trị viên Google',
      description: 'Nhóm quyền được tạo tự động cho tài khoản đăng nhập bằng Google.',
      permissions: adminPermissions,
      deleted: false
    });
  } else {
    // Khôi phục role cũ nếu role tự động này từng bị đưa vào thùng rác.
    adminRole.permissions = adminPermissions;
    adminRole.deleted = false;
    adminRole.deletedAt = null;
    adminRole.deletedBy = '';
  }

  await adminRole.save();
  return adminRole;
};

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

    // Chỉ cho phép liên kết với tài khoản quản trị chưa bị xóa.
    let account = await AccountAdmin.findOne({
      email,
      deleted: false
    });

    if (!account) {
      // CẢNH BÁO: mọi tài khoản Google mới đều được cấp quyền truy cập admin.
      const adminRole = await getGoogleAdminRole();

      account = new AccountAdmin({
        fullName,
        email,
        password: '', // Không cần mật khẩu khi đăng nhập Google
        role: adminRole.id,
        status: 'active',
        googleId: profile.id,
      });
      await account.save();

      return done(null, account);
    }

    // Không tự động mở lại tài khoản đã bị quản trị viên chủ động tạm dừng.
    if (account.status === 'inactive') {
      return done(null, false, { code: 'account-not-active' });
    }

    if (account.status !== 'active' && account.status !== 'initial') {
      return done(null, false, { code: 'account-not-active' });
    }

    let accountChanged = false;

    // Tự động nâng cấp tài khoản Google đang chờ duyệt hoặc dữ liệu cũ chưa có role.
    if (account.status === 'initial' || !account.role) {
      const adminRole = await getGoogleAdminRole();
      account.status = 'active';
      account.role = adminRole.id;
      accountChanged = true;
    }

    // Kiểm tra role còn tồn tại và dữ liệu permissions có đúng định dạng mảng.
    const roleInfo = await Role.findOne({
      _id: account.role,
      deleted: false
    });

    if (!roleInfo || !Array.isArray(roleInfo.permissions)) {
      return done(null, false, { code: 'role-required' });
    }

    // Liên kết Google cho tài khoản admin đã được tạo trước bằng email/mật khẩu.
    if (!account.googleId) {
      account.googleId = profile.id;
      accountChanged = true;
    }

    // Chỉ ghi database khi tài khoản thực sự có thay đổi.
    if (accountChanged) {
      await account.save();
    }

    return done(null, account);
  } catch (err) {
    console.log("Lỗi passport:", err);
    return done(err, null);
  }
}));

module.exports = passport;
