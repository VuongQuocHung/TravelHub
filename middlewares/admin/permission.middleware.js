
const getAccountPermissions = (res) => {
  return Array.isArray(res.locals.pers) ? res.locals.pers : [];
};

const hasAnyPermission = (accountPermissions, requiredPermissions) => {
  return requiredPermissions.some(permission => accountPermissions.includes(permission));
};

const sendForbidden = (res) => {
  return res.status(403).json({
    code: "error",
    message: "Không có quyền truy cập!"
  });
};

module.exports.checkPer = (permissions) => {
  return (req, res, next) => {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [];
    const accountPermissions = getAccountPermissions(res);

    if (
      requiredPermissions.length === 0 ||
      !hasAnyPermission(accountPermissions, requiredPermissions)
    ) {
      return sendForbidden(res);
    }

    next();
  };
};

// Với endpoint thao tác hàng loạt, quyền cần kiểm tra phụ thuộc vào option gửi lên.
module.exports.checkPerByOption = (permissionByOption) => {
  return (req, res, next) => {
    const option = req.body?.option;
    const requiredPermissions = permissionByOption[option];

    if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
      return res.status(400).json({
        code: "error",
        message: "Tùy chọn thao tác không hợp lệ!"
      });
    }

    const accountPermissions = getAccountPermissions(res);
    if (!hasAnyPermission(accountPermissions, requiredPermissions)) {
      return sendForbidden(res);
    }

    next();
  };
};
