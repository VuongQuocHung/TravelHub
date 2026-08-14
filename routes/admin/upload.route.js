const router = require('express').Router();
const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const uploadController = require("../../controllers/admin/upload.controller");
const { checkPer } = require("../../middlewares/admin/permission.middleware");

const upload = multer({ storage: cloudinaryHelper.storage });

router.post(
  '/image',
  checkPer(["tour-create", "tour-edit", "category-create", "category-edit", "setting-edit"]),
  upload.single('file'),
  uploadController.imagePost
);

module.exports = router;
