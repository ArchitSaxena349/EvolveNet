const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').trim().notEmpty(),
    check('name', 'Name must be between 2 and 50 characters').isLength({ min: 2, max: 50 }),
    check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').trim().isEmail().normalizeEmail(),
    check('password', 'Password is required').trim().notEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   POST /api/auth/forgotpassword
// @desc    Forgot password
// @access  Public
router.post(
  '/forgotpassword',
  [check('email', 'Please include a valid email').trim().isEmail().normalizeEmail()],
  authController.forgotPassword
);

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Reset password
// @access  Public
router.put(
  '/resetpassword/:resettoken',
  [
    check('resettoken', 'Verification code is required').trim().notEmpty(),
    check('resettoken', 'Verification code must be 6 digits').isLength({ min: 6, max: 6 }),
    check('resettoken', 'Verification code must contain only digits').isNumeric(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.resetPassword
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout and revoke refresh token
// @access  Public
router.post('/logout', authController.logout);

module.exports = router;
