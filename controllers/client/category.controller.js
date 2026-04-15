const Category = require('../../models/category.model');

module.exports.list = async (req, res) => {
  const slug = await req.params.slug;
  
  const categoryDetail = await Category.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if(!categoryDetail){
    return res.redirect('/');
  }

  const breadcrumb = {
    name: categoryDetail.name,
    avatar: categoryDetail.avatar,
    link: `/category/${categoryDetail.slug}`
  }

  res.render('client/pages/tour-list', {
    pageTitle: categoryDetail.name,
    categoryDetail: categoryDetail,
    breadcrumb: breadcrumb
  });
}