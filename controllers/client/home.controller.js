const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");
const { formatProduct } = require("../../helpers/product.helper");
const { getListProductByCategory } = require("../../helpers/category.helper");
module.exports.home = async (req, res) => {
  const tourListSection2 = await Tour
    .find({
    deleted: false,
    status: "active",
    featured: "1"
  })
    .sort({
       position: "desc" 
    })
    .limit(6);

  for(const item of tourListSection2){
    formatProduct(item);
  }

  const dataSection4 = await getListProductByCategory(res.locals.settingWebsiteInfo.categoryIdSection4);
  console.log(dataSection4.tourList);

  res.render('client/pages/home', {
    pageTitle: 'Trang chủ',
    tourListSection2: tourListSection2,
    tourListSection4: dataSection4.tourList,
    categoryDetailSection4: dataSection4.categoryDetail
  });
}