const router = require('express').Router();
const uploadMiddleware = require("../../middlewares/admin/upload.middleware");
const tourController =  require("../../controllers/admin/tour.controller");
const tourValidate = require("../../validates/admin/tour.validate");
const { checkPer, checkPerByOption } = require("../../middlewares/admin/permission.middleware");

router.get('/list', checkPer(["tour-view"]), tourController.list);
router.get('/create', checkPer(["tour-create"]), tourController.create);
router.get('/trash', checkPer(["tour-trash"]), tourController.trash);

router.post('/create', 
  checkPer(["tour-create"]),
  uploadMiddleware.imageFields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), 
  tourValidate.createPost,
  tourController.createPost
);

router.patch('/edit/:id', 
  checkPer(["tour-edit"]),
  uploadMiddleware.imageFields([
    { name: 'avatar', maxCount: 1 },
    { name: 'images', maxCount: 10 }
  ]), 
  tourValidate.createPost,
  tourController.editPatch
);

router.get('/edit/:id', checkPer(["tour-edit"]), tourController.edit);

router.patch('/delete/:id', checkPer(["tour-delete"]), tourController.deletePatch);

router.patch(
  '/change-multi',
  checkPerByOption({
    active: ["tour-edit"],
    inactive: ["tour-edit"],
    delete: ["tour-delete"],
    undo: ["tour-trash"],
    "delete-eternal": ["tour-trash"]
  }),
  tourController.changeMultiPatch
);

router.patch('/undo/:id', checkPer(["tour-trash"]), tourController.undoPatch);

router.patch('/delete-eternal/:id', checkPer(["tour-trash"]), tourController.deleteEternal);

module.exports = router;  
