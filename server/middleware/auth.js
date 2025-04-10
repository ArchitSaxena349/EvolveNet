const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Token is not valid' });
      }

      // Check if token is in blacklist
      const blacklistedToken = await Token.findOne({
        user: user._id,
        token,
        blacklisted: true
      });

      if (blacklistedToken) {
        return res.status(401).json({ error: 'Token has been invalidated' });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify access token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if token is blacklisted
      const blacklistedToken = await Token.findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          error: 'Token has been revoked'
        });
      }

      // Get user and check if they exist and are verified
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          error: 'Please verify your email first'
        });
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expired',
          refreshToken: true
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Check if refresh token is blacklisted
      const blacklistedToken = await Token.findOne({ token: refreshToken });
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token has been revoked'
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      req.user = user;
      req.newAccessToken = accessToken;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  } catch (err) {
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    // Check for specific permissions if needed
    if (req.user.permissions) {
      const requiredPermissions = roles.filter(role => typeof role === 'string');
      const hasPermission = requiredPermissions.every(permission => 
        req.user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        });
      }
    }

    next();
  };
};

module.exports = auth; 