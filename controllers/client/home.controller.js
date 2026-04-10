const Tour = require("../../models/tour.model");
const { formatProduct } = require("../../helpers/product.helper");
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
  console.log(tourListSection2);

  res.render('client/pages/home', {
    pageTitle: 'Trang chủ',
    tourListSection2: tourListSection2
  });
}