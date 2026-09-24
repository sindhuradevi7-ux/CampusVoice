import express from 'express';
import {
  getAllIssues,
  getIssueById,
  supportIssue,
  getMySupportedIssues,
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth helper for public explorer to identify 'isSupportedByMe'
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campusvoice_verified_anonymous_jwt_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      // ignore invalid token in optional auth
    }
  }
  next();
};

router.get('/', optionalAuth, getAllIssues);
router.get('/supported/my', protect, authorize('student'), getMySupportedIssues);
router.get('/:id', optionalAuth, getIssueById);
router.post('/:id/support', protect, authorize('student'), supportIssue);

export default router;
