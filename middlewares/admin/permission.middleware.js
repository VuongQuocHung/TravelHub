
module.exports.checkPer = (permissions) => {
  return (req, res, next) => {
    const existPer = permissions.some(per => res.locals.pers.includes(per));
    if(!existPer){
      return res.json({
        code: "error",
        message: "Không có quyền truy cập!"
      })
    }
    next();
  }
}