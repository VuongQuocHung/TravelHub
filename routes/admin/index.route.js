const router = require('express').Router();
const accountRoutes = require("./account.route");
const dashboardRoutes = require('./dashboard.route');
const categoryRoutes = require('./category.route');
const tourRoutes = require('./tour.route');
const orderRoutes = require('./order.route');
const userRoutes = require('./user.route');
const settingRoutes  = require('./setting.route');
const contactRoutes = require('./contact.route');
const profileRoutes = require('./profile.route');
const authenMiddleware = require("../../middlewares/admin/authen.middleware");

router.use('/account', accountRoutes);

router.use('/dashboard', authenMiddleware.verifyToken, dashboardRoutes);

router.use('/category', authenMiddleware.verifyToken, categoryRoutes);

router.use('/tour', authenMiddleware.verifyToken, tourRoutes);

router.use('/order', authenMiddleware.verifyToken, orderRoutes);

router.use('/user', authenMiddleware.verifyToken, userRoutes);

router.use('/contact', authenMiddleware.verifyToken, contactRoutes);

router.use('/setting', authenMiddleware.verifyToken, settingRoutes);

router.use('/profile', authenMiddleware.verifyToken, profileRoutes);


router.use(authenMiddleware.verifyToken, (req, res) => {
  res.render('admin/pages/error-404'), {
    pageTitle: "404 Not Found"
  }
});

module.exports = router;
