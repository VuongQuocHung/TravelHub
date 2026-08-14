const router = require('express').Router();

const dashboardController = require("../../controllers/admin/dashboard.controller");
const { checkPer } = require("../../middlewares/admin/permission.middleware");

router.get('/', checkPer(["dashboard-view"]), dashboardController.dashboard);

router.post('/revenue-chart', checkPer(["dashboard-view"]), dashboardController.revenueChartPost);

module.exports = router;
