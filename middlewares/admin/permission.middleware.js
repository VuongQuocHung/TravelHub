
module.exports.checkPer = (permissions) => {
  return (req, res, next) => {
    // Dùng mảng rỗng làm giá trị an toàn nếu middleware xác thực chưa gán permissions.
    const accountPermissions = Array.isArray(res.locals.pers) ? res.locals.pers : [];
    const existPer = permissions.some(per => accountPermissions.includes(per));
    
    if(!existPer){
      return res.json({
        code: "error",
        message: "Không có quyền truy cập!"
      })
    }
    next();
  }
}
