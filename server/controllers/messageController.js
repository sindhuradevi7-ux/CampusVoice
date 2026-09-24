import Message from '../models/Message.js';
import Complaint from '../models/Complaint.js';
import ComplaintAccess from '../models/ComplaintAccess.js';
import { sanitizeMessage } from '../utils/privacySanitizer.js';

/**
 * @desc    Get messages for a complaint thread
 * @route   GET /api/complaints/:id/messages
 * @access  Private (Student owner or Admin)
 */
export const getMessagesForComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find complaint by MongoDB ID or Public ID
    const complaint = await Complaint.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { publicComplaintId: id }],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Authorization check
    if (req.user.role !== 'admin') {
      const access = await ComplaintAccess.findOne({
        complaintId: complaint._id,
        userId: req.user._id,
      });

      if (!access) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view messages for this complaint.',
        });
      }
    }

    const messages = await Message.find({ complaintId: complaint._id })
      .sort({ createdAt: 1 })
      .lean();

    const sanitized = messages.map((m) => sanitizeMessage(m));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      messages: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Post a new message in complaint thread
 * @route   POST /api/complaints/:id/messages
 * @access  Private (Student owner or Admin)
 */
export const postMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.',
      });
    }

    const complaint = await Complaint.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { publicComplaintId: id }],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    // Determine sender type based on role and verify ownership
    let senderType = 'student';

    if (req.user.role === 'admin') {
      senderType = 'admin';
    } else {
      const access = await ComplaintAccess.findOne({
        complaintId: complaint._id,
        userId: req.user._id,
      });

      if (!access) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to message in this complaint thread.',
        });
      }
    }

    const newMsg = await Message.create({
      complaintId: complaint._id,
      senderType,
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully.',
      data: sanitizeMessage(newMsg),
    });
  } catch (error) {
    next(error);
  }
};
