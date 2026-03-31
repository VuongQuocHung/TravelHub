const SettingWebsiteInfo = require("../../models/setting-website-info.model");

module.exports.list = (req, res) => {
  res.render('admin/pages/setting-list', {
    pageTitle: 'Trang cài đặt chung',
  });
}

module.exports.websiteInfo = async (req, res) => {
  const websiteInfo = await SettingWebsiteInfo.findOne();

  res.render('admin/pages/setting-website-info', {
    pageTitle: 'Trang thông tin website',
    websiteInfo: websiteInfo
  });
}

module.exports.websiteInfoPatch = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  if(req.files.logo){ // logo ở đây là 1 mảng các đối tượng
    req.body.logo = req.files.logo[0].path;
  } else {
    delete req.body.logo;
  }

  if(req.files.favicon){ // favicon ở đây là 1 mảng các đối tượng
    req.body.favicon = req.files.favicon[0].path;
  } else {
    delete req.body.favicon;
  }

  await SettingWebsiteInfo.findOneAndUpdate({}, req.body, {
    upsert: true // phải thêm cái này để khi chưa có bản ghi nào trong collection setting-website-infos ở db thì nó sẽ tự tạo mới, nếu không có thì nó sẽ không làm gì cả vì không tìm thấy document nào để update cả
  });

  res.json({
    code: "success",
    message: "Cập nhật website thành công"
  })

}

module.exports.accountAdminList = async (req, res) => {
  res.render('admin/pages/setting-account-admin-list', {
    pageTitle: 'Trang tài khoản quản trị',
  });
}

module.exports.accountAdminCreate = async (req, res) => {
  res.render('admin/pages/setting-account-admin-create', {
    pageTitle: 'Trang tạo mới tài khoảng quản trị',
  });
}

module.exports.roleList = async (req, res) => {
  res.render('admin/pages/setting-role-list', {
    pageTitle: 'Trang nhóm quyền',
  });
}

module.exports.roleCreate = async (req, res) => {
  res.render('admin/pages/setting-role-create', {
    pageTitle: 'Trang tạo nhóm quyền',
  });
}