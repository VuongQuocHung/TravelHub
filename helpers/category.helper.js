const buildCategoryTree = (categoryList, parentId) => {
  const result = [];

  for(const item of categoryList){
    if(item.parent === parentId){
      const children = buildCategoryTree(categoryList, item.id);
      result.push({
        id: item.id,
        name: item.name,
        children: children
      })
    }
  }
  return result;
}

module.exports.buildCategoryTree = buildCategoryTree;