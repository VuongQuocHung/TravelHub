const router = require('express').Router();
const multer  = require('multer')
const cloudinaryHelper = require("../../helpers/cloudinary.helper")
const tourController =  require("../../controllers/admin/tour.controller");
const tourValidate = require("../../validates/admin/tour.validate");
const { checkPer } = require("../../middlewares/admin/permission.middleware");

const upload = multer({ storage: cloudinaryHelper.storage })

router.get('/list', tourController.list);
router.get('/create', tourController.create);
router.get('/trash', tourController.trash);

router.post('/create', 
  checkPer(["tour-create"]),
  upload.single('avatar'), 
  tourValidate.createPost,
  tourController.createPost
);

router.patch('/edit/:id', 
  checkPer(["tour-edit"]),
  upload.single('avatar'), 
  tourValidate.createPost,
  tourController.editPatch
);

router.get('/edit/:id', tourController.edit);

router.patch('/delete/:id', checkPer(["tour-delete"]), tourController.deletePatch);

router.patch('/change-multi', checkPer(["tour-edit", "tour-delete", "tour-trash"]), tourController.changeMultiPatch);

router.patch('/undo/:id', checkPer(["tour-trash"]), tourController.undoPatch);

router.patch('/delete-eternal/:id', checkPer(["tour-trash"]), tourController.deleteEternal);

module.exports = router;  
