import express from 'express';
import {
  analyzeDraftComplaint,
  checkRelatedIssues,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze-complaint', protect, authorize('student'), analyzeDraftComplaint);
router.post('/check-related-issue', protect, authorize('student'), checkRelatedIssues);

export default router;
