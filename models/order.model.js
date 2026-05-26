const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    code: String,
    fullName: String,
    phone: String,
    note: String,
    items: Array,
    subTotal: Number,
    discount: Number,
    total: Number,
    paymentMethod: String, // money - tiền mặt, vnpay - VNPay, zalopay - ZaloPay, bank - chuyển khoản
    paymentStatus: String, // unpaid - chưa thanh toán, paid - đã thanh toán
    status: String, // initial - khởi tạo, done - hoàn thành
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  }
);

const Order = mongoose.model('Order', schema, "orders");

module.exports = Order;