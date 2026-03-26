const router = require('express').Router();
const accountController = require("../../controllers/admin/account.controller");
const accountValidate = require("../../validates/admin/account.validate");
const authMiddleware = require("../../middlewares/admin/authen.middleware");
const authGoogleMiddleware = require("../../middlewares/admin/authGoogle.middleware");

const passport = require('passport');

router.get('/login', accountController.login);

router.post('/login',  accountValidate.loginPost, accountController.loginPost);

router.get('/register', accountController.register);

router.post('/register',accountValidate.registerPost, accountController.registerPost);

router.get('/forgot-password', accountController.forgotPassword);

router.post('/forgot-password', accountValidate.forgotPasswordPost, accountController.forgotPasswordPost);

router.get('/otp-password', accountController.otpPassword);

router.post('/otp-password',accountValidate.otpPasswordPost, accountController.otpPasswordPost);

router.get('/reset-password', accountController.resetPassword);

router.post(
  '/reset-password', 
  authMiddleware.verifyToken, 
  accountValidate.resetPasswordPost, 
  accountController.resetPasswordPost
);


router.post('/logout', accountController.logoutPost);

// Redirect đến Google
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Redirect sang Google
router.get('/google', authGoogleMiddleware.loginGoogle);

// Callback từ Google
router.get(
  '/google/callback',
  authGoogleMiddleware.googleCallback,  // xử lý auth + token
  accountController.dashboard           // xử lý tiếp
);


module.exports = router;  