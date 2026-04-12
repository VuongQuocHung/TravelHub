const router = require('express').Router();
const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const contactRoutes = require('./contact.route');

router.use(categoryMiddleware.list);
router.use(settingMiddleware.websiteInfo)

router.use('/', homeRoutes);
router.use('/tours', tourRoutes);
router.use('/cart', cartRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
