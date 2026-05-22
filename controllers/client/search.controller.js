const { formatProduct } = require('../../helpers/product.helper');
const Tour = require('../../models/tour.model');
const Category = require('../../models/category.model');
const { getListSubCategoryId } = require('../../helpers/category.helper');
const slugify = require('slugify');

module.exports.result = async (req, res) => {
  const find = {
    deleted: false,
    status: "active",
  };

  // Danh mục
  const categoryId = req.query.category;
  let categoryDetail = await Category.findOne({
    _id: categoryId,
    deleted: false,
    status: "active"
  });

  if (categoryDetail) {
    const listSubCategoryId = await getListSubCategoryId(categoryId);

    find.category = {
      $in: [
        categoryDetail.id,
        ...listSubCategoryId
      ]
     };
  } else {
    categoryDetail = {};
  }
  // Hết Danh mục

  // Điểm đi
  if(req.query.locationFrom) {
    find.locations = req.query.locationFrom; // xem trong mảng locations có phần tử locationFrom không
  }
  // Hết Điểm đi

  // Điểm đến
  if(req.query.locationTo) {
    const keyword = slugify(req.query.locationTo);
    const regex = new RegExp(keyword, "i");
    find.slug = regex;
  }
  // Hết Điểm đến

  // Ngày khởi hành
  if(req.query.departureDate) {
    find.departureDate = req.query.departureDate;
  }
  // Hết Ngày khởi hành

  // Số lượng người lớn
  if(req.query.stockAdult) {
    // $gte: >=
    find.stockAdult = {
      $gte: parseInt(req.query.stockAdult)
    };
  }
  // Hết Số lượng người lớn

  // Số lượng trẻ em
  if(req.query.stockChildren) {
    // $gte: >=
    find.stockChildren = {
      $gte: parseInt(req.query.stockChildren)
    };
  }
  // Hết Số lượng trẻ em

  // Số lượng em bé
  if(req.query.stockBaby) {
    // $gte: >=
    find.stockBaby = {
      $gte: parseInt(req.query.stockBaby)
    };
  }
  // Hết Số lượng em bé

  // Khoảng giá người lớn
  if(req.query.price) {
    const [ priceMin, priceMax ] = req.query.price.split("-").map(item => parseInt(item));
    find.priceNewAdult = {
      $gte: priceMin,
      $lte: priceMax
    };
  }
  // Hết Khoảng giá người lớn

  const tourList = await Tour
    .find(find)
    .sort({
      position: "desc"
    });

  for (const item of tourList) {
    formatProduct(item);
  }

  res.render('client/pages/search-result.pug', {
    pageTitle: "Kết quả tìm kiếm",
    tourList: tourList,
    categoryDetail: categoryDetail
  });
}
