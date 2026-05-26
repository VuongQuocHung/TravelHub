const router = require('express').Router();
const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const searchRoutes = require('./search.route');
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const contactRoutes = require('./contact.route');
const categoryRoutes = require('./category.route');
const cityMiddleware = require('../../middlewares/client/city.middleware');
const orderRoutes = require('./order.route');

router.use(categoryMiddleware.list);
router.use(settingMiddleware.websiteInfo)
router.use(cityMiddleware.list);

router.use('/', homeRoutes);
router.use('/tour', tourRoutes);
router.use('/cart', cartRoutes);
router.use('/contact', contactRoutes);
router.use('/category', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/order', orderRoutes);

module.exports = router;

