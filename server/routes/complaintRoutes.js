import express from 'express';
import {
  submitComplaint,
  getMyComplaints,
  getComplaintByPublicId,
} from '../controllers/complaintController.js';
import {
  getMessagesForComplaint,
  postMessage,
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student submission and retrieval
router.post('/', protect, authorize('student'), submitComplaint);
router.get('/my', protect, authorize('student'), getMyComplaints);
router.get('/:publicComplaintId', protect, getComplaintByPublicId);

// Anonymous messaging threads
router.get('/:id/messages', protect, getMessagesForComplaint);
router.post('/:id/messages', protect, postMessage);

export default router;
