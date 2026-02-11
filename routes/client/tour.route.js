const express = require('express');
const router = express.Router();

const tourController = require("../../controllers/client/tour.controller");

router.get('/', tourController.tourList);

router.get('/detail', tourController.detail);

module.exports = router;