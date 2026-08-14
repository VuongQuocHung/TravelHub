const router = require('express').Router();

const userController =  require("../../controllers/admin/user.controller");
const { checkPer } = require("../../middlewares/admin/permission.middleware");

router.get('/manage', checkPer(["user-view"]), userController.manage);


module.exports = router;  
