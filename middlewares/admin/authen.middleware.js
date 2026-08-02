const jwt = require('jsonwebtoken');
const AccountAdmin = require("../../models/account-admin.model");
const Role = require("../../models/role.model");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token){
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;
    const existAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      status: "active",
      deleted: false
    });

    if(!existAccount){
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    req.account = existAccount;
    
    // Trả biến về cho bên FE
    res.locals.account = existAccount;
    // Luôn khởi tạo là mảng để các đoạn kiểm tra quyền không gọi includes trên undefined.
    res.locals.pers = [];
    // console.log("existAccount", existAccount);

    // Tìm nhóm quyền của tài khoản
    if(!existAccount.role){
      // Thiếu role thì xóa phiên đăng nhập và dừng request trước khi render view admin.
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login?authError=role-required`);
      return;
    }

    const roleInfo = await Role.findOne({
      _id: existAccount.role,
      deleted: false
    });

    // console.log("roleInfo", roleInfo);
    if(!roleInfo || !Array.isArray(roleInfo.permissions)){
      // Role đã bị xóa hoặc permissions sai định dạng cũng được xem là chưa phân quyền.
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login?authError=role-required`);
      return;
    }

    // console.log("roleInfo.name", roleInfo.name);
    res.locals.account.roleName = roleInfo.name;
    res.locals.pers = roleInfo.permissions; // Trả về cho FE để check quyền

    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
}
