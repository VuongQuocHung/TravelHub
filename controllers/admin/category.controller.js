  
module.exports.list = async (req, res) => {
  res.render('admin/pages/category-list', {
    pageTitle: 'Trang danh mục',
  });
}

module.exports.create = async (req, res) => {
  res.render('admin/pages/category-create', {
    pageTitle: 'Tạo danh mục',
  });
}
