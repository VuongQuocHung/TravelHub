const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String, 
    status: String  // "initial": khởi tạo, "active": hoạt động, "inactive": tạm dừng
  },
  {
    timestamps: true
  }
)
const AccountAdmin = mongoose.model('AccountAdmin', schema, 'accounts-admin');

module.exports = AccountAdmin;
