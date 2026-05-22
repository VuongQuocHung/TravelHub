const router = require('express').Router();
const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const uploadController = require("../../controllers/admin/upload.controller");

const upload = multer({ storage: cloudinaryHelper.storage });

router.post('/image', upload.single('file'), uploadController.imagePost);

module.exports = router;  