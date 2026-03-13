const Category = require("../../models/category.model");

  
module.exports.list = async (req, res) => {
  res.render('admin/pages/category-list', {
    pageTitle: 'Trang danh mục',
  });
}

module.exports.create = async (req, res) => {
  res.render('admin/pages/category-create', {
    pageTitle: 'Tạo danh mục',
  });
}

module.exports.createPost = async (req, res) => {
  console.log(req.file);
  // console.log(req.body);


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
