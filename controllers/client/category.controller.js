const { getListProductByCategory } = require('../../helpers/category.helper');
const Category = require('../../models/category.model');
const { sanitizeRichText } = require('../../helpers/sanitize-html.helper');

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

  // View sử dụng cú pháp !{} để render HTML nên luôn làm sạch trước.
  categoryDetail.description = sanitizeRichText(categoryDetail.description);

  // Breadcrumb
  const breadcrumb = {
    name: categoryDetail.name,
    avatar: categoryDetail.avatar,
    link: `/category/${categoryDetail.slug}`
  }

  const dataDetail = await getListProductByCategory(categoryDetail.id);
  
  res.render('client/pages/tour-list', {
    pageTitle: categoryDetail.name,
    categoryDetail: categoryDetail,
    breadcrumb: breadcrumb,
    tourList: dataDetail.tourList
  });
}
