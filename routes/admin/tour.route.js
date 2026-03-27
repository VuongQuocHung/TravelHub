const router = require('express').Router();
const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const tourController =  require("../../controllers/admin/tour.controller");
const tourValidate = require("../../validates/admin/tour.validate");

const upload = multer({ storage: cloudinaryHelper.storage })

router.get('/list', tourController.list);
router.get('/create', tourController.create);
router.get('/trash', tourController.trash);

router.post('/create', 
  upload.single('avatar'), 
  tourValidate.createPost,
  tourController.createPost
);

router.patch('/edit/:id', 
  upload.single('avatar'), 
  tourValidate.createPost,
  tourController.editPatch
);

router.get('/edit/:id', tourController.edit);

router.patch('/delete/:id', tourController.deletePatch);

router.patch('/change-multi', tourController.changeMultiPatch);

router.patch('/undo/:id', tourController.undoPatch);

module.exports = router;  
