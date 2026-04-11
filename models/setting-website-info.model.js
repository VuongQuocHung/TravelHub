const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    websiteName: String,
    phone: String,
    email: String, 
    address: String,  // "initial": khởi tạo, "active": hoạt động, "inactive": tạm dừng
    logo: String,
    favicon: String,
    categoryIdSection4: String,
  },
  {
    timestamps: true
  }
)
const SettingWebsiteInfo = mongoose.model('SettingWebsiteInfo', schema, 'setting-website-info');

module.exports = SettingWebsiteInfo;
