const router = require('express').Router();

const contactController =  require('../../controllers/admin/contact.controller');
const { checkPer, checkPerByOption } = require("../../middlewares/admin/permission.middleware");

router.get('/list', checkPer(["contact-view"]), contactController.list);

router.patch(
  '/change-multi',
  checkPerByOption({
    delete: ["contact-delete"],
    undo: ["contact-trash"]
  }),
  contactController.changeMultiPatch
);

router.patch('/delete/:id', checkPer(["contact-delete"]), contactController.deletePatch);

router.get('/trash', checkPer(["contact-trash"]), contactController.trash);

module.exports = router;
