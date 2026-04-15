const router = require('express').Router();
const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const contactRoutes = require('./contact.route');
const categoryRoutes = require('./category.route');

router.use(categoryMiddleware.list);
router.use(settingMiddleware.websiteInfo)

router.use('/', homeRoutes);
router.use('/tours', tourRoutes);
router.use('/cart', cartRoutes);
router.use('/contact', contactRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
