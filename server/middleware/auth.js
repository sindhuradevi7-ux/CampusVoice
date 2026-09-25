import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined' && parts[1] !== '') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. Please log in.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'campusvoice_verified_anonymous_jwt_secret_key_2026';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this session token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or session expired. Please log in again.',
      error: error.message,
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[1] && parts[1] !== 'null' && parts[1] !== 'undefined' && parts[1] !== '') {
      try {
        const token = parts[1];
        const secret = process.env.JWT_SECRET || 'campusvoice_verified_anonymous_jwt_secret_key_2026';
        const decoded = jwt.verify(token, secret);
        req.user = await User.findById(decoded.id).select('-passwordHash');
      } catch (e) {
        // Silently proceed for unauthenticated/expired optional auth requests
      }
    }
  }
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'unauthenticated'}) is not authorized to access this route.`,
      });
    }
    next();
  };
};
