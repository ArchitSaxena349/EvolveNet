const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');

// Primary auth middleware: verifies access JWT and attaches user to req
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.header('Authorization');
    const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
      // Expect payload to contain { id }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by id from token
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Token is not valid' });
      }

      // Attach minimal user info to request
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Simple role-based authorizer factory
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: `User role ${req.user.role} is not authorized to access this route` });
    }

    next();
  };
};

// Export the auth function as the module, but attach helpers for convenience
auth.authorize = authorize;

module.exports = auth;