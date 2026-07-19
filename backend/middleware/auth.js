const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Provider = require('../models/Provider');
const Admin = require('../models/Admin');

// Protect routes middleware
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jwt_secret_fallback_key_12345');

      // Add user/provider/admin payload to request
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      // Retrieve full document if needed by downstream routes
      if (decoded.role === 'customer') {
        req.userDoc = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'provider') {
        req.userDoc = await Provider.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        req.userDoc = await Admin.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error('JWT Token Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token found' });
  }
};

// Authorize roles middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
