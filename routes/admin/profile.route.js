const uploadMiddleware = require("../../middlewares/admin/upload.middleware");
const router = require('express').Router();
const profileController =  require("../../controllers/admin/profile.controller");

router.get('/edit', profileController.edit);

router.patch('/edit', uploadMiddleware.singleImage('avatar'), profileController.editPatch);

router.get('/change-password', profileController.changePassword);

router.patch('/change-password', profileController.changePasswordPatch);

module.exports = router;  
