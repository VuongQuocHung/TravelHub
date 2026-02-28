module.exports.manage = async (req, res) => {
  res.render('admin/pages/user-list', {
    pageTitle: 'Trang quản lý người dùng',
  });
}