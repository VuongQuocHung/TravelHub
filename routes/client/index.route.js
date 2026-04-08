const router = require('express').Router();
const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const settingMiddleware = require("../../middlewares/admin/setting.middleware");

router.use(settingMiddleware.websiteInfo)
router.use('/', homeRoutes);
router.use('/tours', tourRoutes);
router.use('/cart', cartRoutes);

module.exports = router;
