const router = require('express').Router();
const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const categoryController =  require("../../controllers/admin/category.controller");
const categoryValidate = require('../../validates/admin/category.validate');
const { checkPer, checkPerByOption } = require("../../middlewares/admin/permission.middleware");

const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', checkPer(["category-view"]), categoryController.list);

router.get('/create', checkPer(["category-create"]), categoryController.create);

router.get('/trash', checkPer(["category-trash"]), categoryController.trash);

router.post('/create', 
  checkPer(["category-create"]),
  upload.single('avatar'), 
  categoryValidate.createPost,
  categoryController.createPost);

router.get('/edit/:id', checkPer(["category-edit"]), categoryController.edit);

router.patch(
  '/edit/:id', 
  checkPer(["category-edit"]),
  upload.single('avatar'), 
  categoryValidate.createPost,
  categoryController.editPatch
);

router.patch('/delete/:id', checkPer(["category-delete"]), categoryController.deletePatch);

router.patch(
  '/change-multi',
  checkPerByOption({
    active: ["category-edit"],
    inactive: ["category-edit"],
    delete: ["category-delete"]
  }),
  categoryController.changeMultiPatch
);

router.patch('/undo/:id', checkPer(["category-trash"]), categoryController.undoPatch);

router.patch('/delete-eternal/:id', checkPer(["category-trash"]), categoryController.deleteEternal);

module.exports = router;
