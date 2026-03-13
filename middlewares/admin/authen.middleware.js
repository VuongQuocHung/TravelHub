const { pathAdmin } = require("../../configs/variable.config");
const jwt = require('jsonwebtoken');
const AccountAdmin = require("../../models/account-admin.model");

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
    }

    req.account = existAccount;

    // Trả biến về cho bên FE
    res.locals.account = {
      id: existAccount.id,
      fullName: existAccount.fullName,
      email: existAccount.email
    };

    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }


}
