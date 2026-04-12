const router = require('express').Router();

const contactController = require('../../controllers/client/contact.controller');

const contactValidate = require('../../validates/client/contact.validate');

router.post('/create', contactValidate.createPost, contactController.createPost);

module.exports = router;  