const router = require('express').Router();

const orderController =  require("../../controllers/admin/order.controller");
const orderValidate = require('../../validates/admin/order.validate');
const { checkPer } = require("../../middlewares/admin/permission.middleware");

router.get('/list', checkPer(["order-view"]), orderController.list);
router.get('/edit/:id', checkPer(["order-edit"]), orderController.edit);
router.patch('/edit/:id', checkPer(["order-edit"]), orderValidate.editPatch, orderController.editPatch);

module.exports = router;
