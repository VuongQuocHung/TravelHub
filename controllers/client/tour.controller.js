const Tour = require('../../models/tour.model');  
const Category = require('../../models/category.model');
const City = require('../../models/city.model');
const moment = require("moment");
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const tourDetail = await Tour.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });
  // console.log("tourDetail: ", tourDetail);

  if(!tourDetail){
    return res.redirect("/");
  }
  const categoryDetail = await Category.findOne({
    _id: tourDetail.category,
    deleted: false,
    status: "active"
  });

  const breadcrumb = {
    name: tourDetail.name,
    avatar: tourDetail.avatar,
    categoryName: categoryDetail ? categoryDetail.name : "",
    link: `/tour/detail/${tourDetail.slug}`,
    linkCategory: categoryDetail ? `/category/${categoryDetail.slug}` : ""
  }

  tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("DD/MM/YYYY"); 

  const cityList = await City.find({
    _id: { $in: tourDetail.locations }
  });

  res.render('client/pages/tour-detail', {
    pageTitle: 'Chi tiết tour',
    tourDetail: tourDetail,
    breadcrumb: breadcrumb,
    cityList: cityList
  });
}