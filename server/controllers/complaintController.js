import Complaint from '../models/Complaint.js';
import ComplaintAccess from '../models/ComplaintAccess.js';
import IssueCluster from '../models/IssueCluster.js';
import { generateComplaintId } from '../utils/idGenerator.js';
import { analyzeComplaintContent } from '../services/aiService.js';
import { processComplaintClustering } from '../services/clusterService.js';

/**
 * @desc    Submit a verified anonymous complaint
 * @route   POST /api/complaints
 * @access  Private (Student)
 */
export const submitComplaint = async (req, res, next) => {
  try {
    const {
      category,
      description,
      location,
      affectedArea,
      severity,
      contactPreference,
      preferredClusterId,
    } = req.body;

    if (!category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Category, description, and location are required fields.',
      });
    }

    // 1. Run AI analysis on sanitized content (NO user identity sent)
    const aiAnalysis = await analyzeComplaintContent({
      description,
      location,
      categoryInput: category,
      severityInput: severity || 'Medium',
    });

    // 2. Determine / link issue cluster
    const assignedCluster = await processComplaintClustering({
      category,
      location,
      description,
      severity: severity || aiAnalysis.severity || 'Medium',
      aiAnalysis,
      preferredClusterId,
    });

    // 3. Generate public complaint ID (e.g. CV-A82F91)
    const publicComplaintId = generateComplaintId();

    // 4. Create the complaint (Complaint document does NOT store user identifying data)
    const complaint = await Complaint.create({
      publicComplaintId,
      category,
      description: description.trim(),
      location: location.trim(),
      affectedArea: affectedArea ? affectedArea.trim() : '',
      severity: severity || aiAnalysis.severity || 'Medium',
      status: 'Submitted',
      issueClusterId: assignedCluster ? assignedCluster._id : null,
      contactPreference: contactPreference || 'Anonymous In-App Thread',
      aiAnalysis,
      statusHistory: [
        {
          status: 'Submitted',
          note: 'Complaint successfully received and verified anonymously.',
          updatedAt: new Date(),
        },
      ],
    });

    // 5. Create secure isolation mapping for the student
    await ComplaintAccess.create({
      complaintId: complaint._id,
      userId: req.user._id,
    });

    // 6. Return response to student with public tracking ID
    res.status(201).json({
      success: true,
      message: 'Complaint submitted anonymously and verified.',
      complaint: {
        _id: complaint._id,
        publicComplaintId: complaint.publicComplaintId,
        category: complaint.category,
        description: complaint.description,
        location: complaint.location,
        affectedArea: complaint.affectedArea,
        severity: complaint.severity,
        status: complaint.status,
        issueClusterId: assignedCluster
          ? {
              _id: assignedCluster._id,
              publicIssueId: assignedCluster.publicIssueId,
              title: assignedCluster.title,
              affectedCount: assignedCluster.affectedCount,
            }
          : null,
        contactPreference: complaint.contactPreference,
        statusHistory: complaint.statusHistory,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all complaints created by the logged in student
 * @route   GET /api/complaints/my
 * @access  Private (Student)
 */
export const getMyComplaints = async (req, res, next) => {
  try {
    // Look up complaint access mappings for this authenticated student
    const accessRecords = await ComplaintAccess.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const complaintIds = accessRecords.map((r) => r.complaintId);

    const complaints = await Complaint.find({ _id: { $in: complaintIds } })
      .populate('issueClusterId', 'publicIssueId title status affectedCount assignedDepartment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complaint details by publicComplaintId
 * @route   GET /api/complaints/:publicComplaintId
 * @access  Private (Student owner or Admin)
 */
export const getComplaintByPublicId = async (req, res, next) => {
  try {
    const { publicComplaintId } = req.params;

    const isObjectId = publicComplaintId && /^[0-9a-fA-F]{24}$/.test(publicComplaintId);
    const query = isObjectId
      ? { $or: [{ _id: publicComplaintId }, { publicComplaintId: publicComplaintId.toUpperCase() }] }
      : { publicComplaintId: publicComplaintId.toUpperCase() };

    const complaint = await Complaint.findOne(query)
      .populate('issueClusterId', 'publicIssueId title summary category location severity status affectedCount assignedDepartment statusHistory');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found with the specified Public ID.',
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
          message: 'You are not authorized to view this complaint.',
        });
      }
    }

    res.status(200).json({
      success: true,
      complaint: {
        _id: complaint._id,
        publicComplaintId: complaint.publicComplaintId,
        category: complaint.category,
        description: complaint.description,
        location: complaint.location,
        affectedArea: complaint.affectedArea,
        severity: complaint.severity,
        status: complaint.status,
        issueClusterId: complaint.issueClusterId,
        contactPreference: complaint.contactPreference,
        statusHistory: complaint.statusHistory,
        aiAnalysis: complaint.aiAnalysis,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        reporterBadge: 'Verified Anonymous Student',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Public status tracker by public complaint ID (no auth required for basic status lookup)
 * @route   GET /api/complaints/track/:publicComplaintId
 * @access  Public
 */
export const trackComplaintPublicly = async (req, res, next) => {
  try {
    const { publicComplaintId } = req.params;

    const isObjectId = publicComplaintId && /^[0-9a-fA-F]{24}$/.test(publicComplaintId);
    const query = isObjectId
      ? { $or: [{ _id: publicComplaintId }, { publicComplaintId: publicComplaintId.trim().toUpperCase() }] }
      : { publicComplaintId: publicComplaintId.trim().toUpperCase() };

    const complaint = await Complaint.findOne(query).populate('issueClusterId', 'publicIssueId title status affectedCount assignedDepartment');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'No complaint found with this Public ID.',
      });
    }

    res.status(200).json({
      success: true,
      complaint: {
        publicComplaintId: complaint.publicComplaintId,
        category: complaint.category,
        location: complaint.location,
        affectedArea: complaint.affectedArea,
        severity: complaint.severity,
        status: complaint.status,
        statusHistory: complaint.statusHistory || [],
        issueCluster: complaint.issueClusterId
          ? {
              publicIssueId: complaint.issueClusterId.publicIssueId,
              title: complaint.issueClusterId.title,
              affectedCount: complaint.issueClusterId.affectedCount,
              status: complaint.issueClusterId.status,
            }
          : null,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

