const { buildCategoryTree } = require("../../helpers/category.helper");
const Category = require("../../models/category.model");
const Tour = require("../../models/tour.model")
const City = require("../../models/city.model");

module.exports.list = async (req, res) => {
  res.render('admin/pages/tour-list', {
    pageTitle: 'Trang danh sách tour',
  });
}


module.exports.create = async (req, res) => {
  // Lấy ra danh sách danh mục
  const categoryList = await Category.find({
    deleted: false
  });

  const categoryTree = buildCategoryTree(categoryList, "");


  // Lấy ra danh sách tỉnh thành 
  const cityList = await City.find({});

  res.render('admin/pages/tour-create', {
    pageTitle: 'Trang tạo tour',
    categoryList: categoryTree,
    cityList: cityList,
  });
}

module.exports.createPost = async (req, res) => {
  try {
    if(req.body.position){
      req.body.position = parseInt(req.body.position);
    } else {
      const recordPositionMax = await Tour
      .findOne({})
      .sort({
        position: "desc"
      })
      if(recordPositionMax){
        req.body.position = recordPositionMax.position + 1;
      } else {
        req.body.position = 1;
      }
    }

    req.body.avatar = req.file ? req.file.path : "";

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : []; //locations phải ở dạng mảng
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : []; // schedules phải ở dạng mảng
    req.body.createdBy = req.account.id;

    // Tạo 1 bản ghi, có trả về dữ liệu
    const newRecord = new Tour(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Tạo Tour thành công"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Tạo Tour không thành công"
    })
  }
}

module.exports.trash = async (req, res) => {
  res.render('admin/pages/tour-trash', {
    pageTitle: 'Trang các tour đã xóa',
  });
}

