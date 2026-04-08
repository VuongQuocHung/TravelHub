const SettingWebsiteInfo = require("../../models/setting-website-info.model");

module.exports.websiteInfo = async (req, res, next) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne();
  console.log(settingWebsiteInfo);
  res.locals.settingWebsiteInfo = settingWebsiteInfo;
  next();
}