const { buildCategoryTree } = require("../../helpers/category.helper");
const Category = require("../../models/category.model");
const AccountAdmin = require("../../models/account-admin.model");
const Tour = require("../../models/tour.model")
const City = require("../../models/city.model");
const moment = require("moment");
const slugify = require('slugify');

module.exports.list = async (req, res) => {
  const target = {
    deleted: false
  };

  // Lọc theo trạng thái
  if(req.query.status){
    target.status = req.query.status
  }
  // Hết lọc theo trạng thái

  // Lọc theo người tạo
  if(req.query.createdBy){
    target.createdBy = req.query.createdBy
  }
  // Hết lọc theo người tạo

  // Lọc theo ngày 
  if(req.query.fromDate){
    target.createdAt = {
      $gte: new Date(req.query.fromDate)
    }
  }

  if(req.query.toDate){
    target.createdAt = {
      ...target.createdAt,
      $lte: new Date(req.query.fromDate)
    }
  }
  // Hết lọc theo ngày

  // Tìm kiếm
  if(req.query.keyword){
    const keyword = slugify(req.query.keyword);
    const regex = new RegExp(keyword, "i");
    target.slug = regex;
  }
  // Hết Tìm Kiếm

  // Pagination
  const limit = 3;
  let page = 1;
  if(req.query.page) {
    const currentPage = parseInt(req.query.page);
    if(currentPage > 0) {
      page = currentPage;
    }
  }
  const skip = (page - 1) * limit;
  const totalRecord = await Tour.countDocuments(target); // đếm các bản ghi thỏa mãn điều kiện
  const totalPage = Math.ceil(totalRecord/limit); // làm tròn lên
  const paginationData = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };
  // Hết Pagination

  const tourList = await Tour
    .find(target)
    .sort({
      position: "desc"
    })
    .limit(limit)
    .skip(skip);

  for(const item of tourList){
    if(item.createdAt){
      const infoCreater = await AccountAdmin.findOne({
        _id: item.createdBy 
      })
      if(infoCreater){
        item.createByName = infoCreater.fullName
        item.createAtFormat = moment(item.createdAt).format("HH:mm DD/MM/YYYY");
      }
    }

    if(item.updatedAt){
      const infoUpdater = await AccountAdmin.findOne({
        _id: item.updatedBy   
      })
      if(infoUpdater){  
        item.updatedByName = infoUpdater.fullName
        item.updatedAtFormat = moment(item.updatedAt).format("HH:mm DD/MM/YYYY");
      }
    }
  }

  // Danh sách tài khoản quản trị viên 
  const accountAdminList = await AccountAdmin.find({}).select("id fullName email");
  // console.log("accountadminlist: " + accountAdminList);
  res.render('admin/pages/tour-list', {
    pageTitle: 'Trang danh sách tour',
    tourList: tourList,
    accountAdminList: accountAdminList,
    paginationData: paginationData
  });
}


module.exports.create = async (req, res) => {
  // Danh sách danh mục
  const categoryList = await Category.find({
    deleted: false
  });
  const categoryTree = buildCategoryTree(categoryList, "");

  // Danh sách tỉnh thành
  const cityList = await City.find({});
  
  res.render('admin/pages/tour-create', {
    pageTitle: "Tạo tour",
    categoryList: categoryTree,
    cityList: cityList
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

module.exports.edit = async (req, res) => {
  // console.log("Chạy vào tour edit");
  try {
    const id = req.params.id;
    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    });
    console.log(tourDetail);

    if(!tourDetail){
      res.redirect(`/${pathAdmin}/tour/list`);
      return;
    }

    tourDetail.departureDateFormat = moment(tourDetail.departureDate).format('YYYY-MM-DD');

     // Danh sách danh mục
    const categoryList = await Category.find({
      deleted: false
    });
    const categoryTree = buildCategoryTree(categoryList, "");

    const cityList = await City.find({});

    res.render('admin/pages/tour-edit', {
      pageTitle: 'Chỉnh sửa tour',
      tourDetail: tourDetail,
      categoryList: categoryTree,
      cityList: cityList,
    });
  } catch (error) {
    console.log("Lỗi: " + error);
    res.redirect(`/${pathAdmin}/tour/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    });
    console.log(tourDetail);

    if(!tourDetail){
      res.json({
        code: "error",
        message: "Tour không tồn tại"
      })
      return;
    }

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
    req.body.updatedBy = req.account.id;

    await Tour.updateOne({
      _id: id,
    }, req.body);

    res.json({
      code: "success",
      message: "Cập nhật Tour thành công"
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ"
    })
  }
}


module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    });

    if(!tourDetail) {
      res.json({
        code: "error",
        message: "Tour không tồn tại!"
      })
      return;
    }
    

    await Tour.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });

    res.json({
      code: "success",
      message: "Xóa tour thành công!"
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    });
  }
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { listId, option } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await Tour.updateMany({
          _id: { $in: listId },
          deleted: false
        }, {
          status: option,
          updatedBy: req.account.id
        });
        res.json({
          code: "success",
          message: "Đã cập nhật trạng thái!"
        })
        break;
      case "delete":
        await Tour.updateMany({
          _id: { $in: listId },
          deleted: false
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
        res.json({
          code: "success",
          message: "Đã xóa tour!"
        })
        break;
      default:
        res.json({
          code: "error",
          message: "Dữ liệu không hợp lệ!"
        })
        break;
    }
  } catch (error) {
    res.json({
      code: "error",
      message: "Dữ liệu không hợp lệ!"
    })
  }
}

module.exports.trash = async (req, res) => {
  res.render('admin/pages/tour-trash', {
    pageTitle: 'Trang các tour đã xóa',
  });
}

