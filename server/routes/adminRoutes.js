import express from 'express';
import {
  getAdminIssues,
  getAdminIssueDetails,
  updateIssueStatus,
  updateIssueDepartment,
  getAdminAnalytics,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Enforce admin-only access
router.use(protect, authorize('admin'));

router.get('/issues', getAdminIssues);
router.get('/issues/:id', getAdminIssueDetails);
router.patch('/issues/:id/status', updateIssueStatus);
router.patch('/issues/:id/department', updateIssueDepartment);
router.get('/analytics', getAdminAnalytics);

export default router;
