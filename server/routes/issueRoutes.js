import express from 'express';
import {
  getAllIssues,
  getIssueById,
  supportIssue,
  getMySupportedIssues,
} from '../controllers/issueController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllIssues);
router.get('/supported/my', protect, authorize('student'), getMySupportedIssues);
router.get('/:id', optionalAuth, getIssueById);
router.post('/:id/support', protect, authorize('student'), supportIssue);

export default router;
