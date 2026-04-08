const { buildCategoryTree } = require("../../helpers/category.helper");
const Category = require("../../models/category.model");

module.exports.list = async (req, res, next) => {
  const categoryList = await Category.find({
    deleted: false
  });

  const categoryTree = buildCategoryTree(categoryList, "");

  res.locals.categoryTree = categoryTree;

  next();
} 