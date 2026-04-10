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
      status: "active"
    });

    if(!existAccount){
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    }

    req.account = existAccount;
    
    // Trả biến về cho bên FE
    res.locals.account = existAccount;
    // console.log("existAccount", existAccount);

    // Tìm nhóm quyền của tài khoản
    const roleInfo = await Role.findOne({
      _id: existAccount.role
    });

    // console.log("roleInfo", roleInfo);
    if(roleInfo){
      // console.log("roleInfo.name", roleInfo.name);
      res.locals.account.roleName = roleInfo.name;
      res.locals.pers = roleInfo.permissions; // Trả về cho FE để check quyền
    }

    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
}
