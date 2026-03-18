const { buildCategoryTree } = require("../../helpers/category.helper");
const AccountAdmin = require("../../models/account-admin.model");
const Category = require("../../models/category.model");
const moment = require("moment");

module.exports.list = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  }).sort({
    position: "desc"
  });

  for(const item of categoryList){
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

 
  res.render('admin/pages/category-list', {
    pageTitle: 'Trang danh mục',
    categoryList: categoryList,
  });
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  });

  const categoryTree = buildCategoryTree(categoryList, "");
  // console.log(categoryTree);

  res.render('admin/pages/category-create', {
    pageTitle: 'Tạo danh mục',
    categoryList: categoryTree
  });
}

module.exports.createPost = async (req, res) => {
  // console.time("upload");

  // console.log(req.file);

  // console.timeEnd("upload");

  if(req.body.position){
    req.body.position = parseInt(req.body.position);
  } else {
    const recordPositionMax = await Category.findOne({}).sort({
      position: "desc"
    })
    if(recordPositionMax){
      req.body.position = recordPositionMax.position + 1;
    } else {
      req.body.position = 1;
    }
  }

  req.body.createdBy = req.account.id; // account được lưu ở trong hàm verifyToken
  req.body.avatar = req.file ? req.file.path : "";
  // Cách 1: Tạo 1 bản ghi, không trả về dữ liệu
  // await Category.create(req.body);


  // Cách 2: Tạo 1 bản ghi, có trả về dữ liệu
  const newRecord = new Category(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo danh mục thành công"
  })

}
