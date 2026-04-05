const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    role: String,
    positionCompany: String,
    password: String, 
    status: String,  // "initial": khởi tạo, "active": hoạt động, "inactive": tạm dừng
    googleId: { type: String, default: '' },
    avatar: String,
    createdBy: String,
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true
  }
)
const AccountAdmin = mongoose.model('AccountAdmin', schema, 'accounts-admin');

module.exports = AccountAdmin;
