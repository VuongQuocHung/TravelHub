module.exports.pathAdmin = "admin";

module.exports.permissionsList = [
  {
    label: "Xem trang Tổng quan",
    value: "dashboard-view"
  },
  // Danh mục
  {
    label: "Xem danh mục",
    value: "category-view"
  },
  {
    label: "Tạo danh mục",
    value: "category-create"
  },
  {
    label: "Sửa danh mục",
    value: "category-edit"
  },
  {
    label: "Xóa danh mục",
    value: "category-delete"
  },
  {
    label: "Thùng rác danh mục",
    value: "category-trash"
  },
  
  // Tour
  {
    label: "Xem tour",
    value: "tour-view"
  },
  {
    label: "Tạo tour",
    value: "tour-create"
  },
  {
    label: "Sửa tour",
    value: "tour-edit"
  },
  {
    label: "Xóa tour",
    value: "tour-delete"
  },
  {
    label: "Thùng rác tour",
    value: "tour-trash"
  },

  // Đơn hàng
  {
    label: "Xem đơn hàng",
    value: "order-view"
  },
  {
    label: "Tạo đơn hàng",
    value: "order-create"
  },
  {
    label: "Sửa đơn hàng",
    value: "order-edit"
  },
  {
    label: "Xóa đơn hàng",
    value: "order-delete"
  },
  {
    label: "Thùng rác đơn hàng",
    value: "order-trash"
  },

  // Người dùng
  {
    label: "Xem người dùng",
    value: "user-view"
  },
  {
    label: "Tạo người dùng",
    value: "user-create"
  },
  {
    label: "Sửa người dùng",
    value: "user-edit"
  },
  {
    label: "Xóa người dùng",
    value: "user-delete"
  },
  {
    label: "Thùng rác người dùng",
    value: "user-trash"
  },

  // Liên hệ
  {
    label: "Xem thông tin liên hệ",
    value: "contact-view"
  },
  {
    label: "Xóa thông tin liên hệ",
    value: "contact-delete"
  },
  {
    label: "Thùng rác thông tin liên hệ",
    value: "contact-trash"
  },

  // Cấu hình website
  {
    label: "Xem cấu hình website",
    value: "setting-view"
  },
  {
    label: "Sửa cấu hình website",
    value: "setting-edit"
  },

  // Tài khoản quản trị
  {
    label: "Xem tài khoản quản trị",
    value: "account-admin-view"
  },
  {
    label: "Tạo tài khoản quản trị",
    value: "account-admin-create"
  },
  {
    label: "Sửa tài khoản quản trị",
    value: "account-admin-edit"
  },

  // Nhóm quyền
  {
    label: "Xem nhóm quyền",
    value: "role-view"
  },
  {
    label: "Tạo nhóm quyền",
    value: "role-create"
  },
  {
    label: "Sửa nhóm quyền",
    value: "role-edit"
  },
  {
    label: "Xóa nhóm quyền",
    value: "role-delete"
  },
  {
    label: "Thùng rác nhóm quyền",
    value: "role-trash"
  },

];

module.exports.paymentMethodList = [
  {
    label: "Tiền mặt",
    value: "money"
  },
  {
    label: "ZaloPay",
    value: "zalopay"
  },
  {
    label: "VNPay",
    value: "vnpay"
  },
  {
    label: "Chuyển khoản ngân hàng",
    value: "bank"
  },
]

module.exports.paymentStatusList = [
  {
    label: "Chưa thanh toán",
    value: "unpaid"
  },
  {
    label: "Đã thanh toán",
    value: "paid"
  },
]

module.exports.orderStatusList = [
  {
    label: "Khởi tạo",
    value: "initial",
    color: "orange"
  },
  {
    label: "Hoàn thành",
    value: "done",
    color: "green"
  },
  {
    label: "Đã hủy",
    value: "cancel",
    color: "red"
  },
]
