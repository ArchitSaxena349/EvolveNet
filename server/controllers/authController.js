const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME || process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
  }
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password
    });

    // Generate access token
    const token = user.getSignedJwtToken();

    // Generate and save refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Token.create({ user: user._id, refreshToken, expiresAt });

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // Generate token
    const token = user.getSignedJwtToken();

    // Generate refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save refresh token
    await Token.create({
      user: user._id,
      refreshToken,
      expiresAt
    });

    res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordAttempts = 0;
    await user.save({ validateBeforeSave: false });

    try {
      await transporter.sendMail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        subject: 'Your EvolveNet password reset code',
        text: `Your EvolveNet password reset code is ${otp}. It expires in 10 minutes.`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>Reset your EvolveNet password</h2>
            <p>Enter this verification code to reset your password:</p>
            <p style="font-size:32px;font-weight:700;letter-spacing:8px">${otp}</p>
            <p>This code expires in 10 minutes. If you did not request it, ignore this email.</p>
          </div>
        `
      });

      return res.status(200).json({ success: true, message: 'OTP sent to your registered email' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      user.resetPasswordAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ error: 'Email could not be sent' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Refresh JWT token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Find the refresh token (stored as plain string)
    const refreshTokenDoc = await Token.findOne({ refreshToken: token });
    if (!refreshTokenDoc) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check blacklist/expiry
    if (refreshTokenDoc.blacklisted) {
      return res.status(401).json({ error: 'Refresh token revoked' });
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      await Token.findByIdAndDelete(refreshTokenDoc._id).catch(() => {});
      return res.status(401).json({ error: 'Refresh token expired' });
    }

    // Get user and generate new access token
    const user = await User.findById(refreshTokenDoc.user);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = user.getSignedJwtToken();

    res.status(200).json({ success: true, newToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}; 

// @desc    Logout (revoke refresh token)
// @route   POST /api/auth/logout
// @access  Public (requires refresh token in body)
exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // Find refresh token and mark blacklisted (or remove)
    const refreshTokenDoc = await Token.findOne({ refreshToken: token });
    if (!refreshTokenDoc) {
      // idempotent: token already gone
      return res.status(200).json({ success: true });
    }

    refreshTokenDoc.blacklisted = true;
    await refreshTokenDoc.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
