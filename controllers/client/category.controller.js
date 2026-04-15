const { getListProductByCategory } = require('../../helpers/category.helper');
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

  // Breadcrumb
  const breadcrumb = {
    name: categoryDetail.name,
    avatar: categoryDetail.avatar,
    link: `/category/${categoryDetail.slug}`
  }

  const dataDetail = await getListProductByCategory(categoryDetail.id);
  console.log(dataDetail);

  res.render('client/pages/tour-list', {
    pageTitle: categoryDetail.name,
    categoryDetail: categoryDetail,
    breadcrumb: breadcrumb,
    tourList: dataDetail.tourList
  });
}