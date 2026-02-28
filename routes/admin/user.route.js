const router = require('express').Router();

const userController =  require("../../controllers/admin/user.controller");

router.get('/manage', userController.manage);

module.exports = router;  