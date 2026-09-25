const router = require('express').Router();
const uploadMiddleware = require("../../middlewares/admin/upload.middleware");
const uploadController = require("../../controllers/admin/upload.controller");
const { checkPer } = require("../../middlewares/admin/permission.middleware");

router.post(
  '/image',
  checkPer(["tour-create", "tour-edit", "category-create", "category-edit", "setting-edit"]),
  uploadMiddleware.singleImage('file'),
  uploadController.imagePost
);

module.exports = router;
