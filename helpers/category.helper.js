const Category = require("../models/category.model");
const Tour = require("../models/tour.model");
const { formatProduct } = require("./product.helper");

const buildCategoryTree = (categoryList, parentId) => {
  const result = [];

  for(const item of categoryList){
    if(item.parent === parentId){
      const children = buildCategoryTree(categoryList, item.id);
      result.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  }
  return result;
}

module.exports.buildCategoryTree = buildCategoryTree;

// Lấy ra mảng id của các danh mục con của cha 
const getListSubCaregoryId = async (parentId) => {
  const listSubCategoryId = [];
  const findListSubCaregory = async (parentId) => {
    const listSubCategory = await Category.find({
      parent: parentId,
      deleted: false,
      status: "active"
    });
    for(const item of listSubCategory){
      listSubCategoryId.push(item.id);
      await findListSubCaregory(item.id);
    }
    return listSubCategoryId;
  }
  await findListSubCaregory(parentId);
  return listSubCategoryId;
}
module.exports.getListSubCaregoryId = getListSubCaregoryId;

// Lấy ra mảng sản phẩm theo danh mục 
module.exports.getListProductByCategory = async (categoryId) => {
  const listSubCategoryId = await getListSubCaregoryId(categoryId);
  const categoryDetail = await Category.findOne({
    _id: categoryId,
    deleted: false,
    status: "active"
  });
  // console.log("categoryDetail:" + categoryDetail);

  const tourList = await Tour
    .find({
      deleted: false,
      status: "active",
      category: { $in : [
        categoryId, 
        ...listSubCategoryId
      ]}
    })
    .sort({
      position: "desc"
    })
    .limit(8);
    // console.log("tourList:" + tourList);

    for(const item of tourList){
      formatProduct(item);
    }

    return {
      categoryDetail: categoryDetail,
      tourList: tourList
    }
}

