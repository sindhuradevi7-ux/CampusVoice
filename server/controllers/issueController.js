import IssueCluster from '../models/IssueCluster.js';
import IssueSupport from '../models/IssueSupport.js';
import Complaint from '../models/Complaint.js';
import { sanitizeIssueForPublic, sanitizeComplaintForAdmin } from '../utils/privacySanitizer.js';

/**
 * @desc    Get all public issue clusters with filters & search
 * @route   GET /api/issues
 * @access  Public (Optional auth for checking 'isSupportedByMe')
 */
export const getAllIssues = async (req, res, next) => {
  try {
    const { category, status, severity, search, department, sortBy = 'affectedCount' } = req.query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (severity && severity !== 'All') {
      filter.severity = severity;
    }

    if (department && department !== 'All') {
      filter.assignedDepartment = department;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { summary: regex },
        { location: regex },
        { category: regex },
        { publicIssueId: regex },
        { keywords: { $in: [regex] } },
      ];
    }

    let sortOptions = {};
    if (sortBy === 'affectedCount') {
      sortOptions = { affectedCount: -1, updatedAt: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'status') {
      sortOptions = { status: 1 };
    } else {
      sortOptions = { updatedAt: -1 };
    }

    const issues = await IssueCluster.find(filter).sort(sortOptions).lean();

    // Check if current user has supported any of these issues
    let userSupportedSet = new Set();
    if (req.user) {
      const userSupports = await IssueSupport.find({ userId: req.user._id }).select('issueClusterId');
      userSupportedSet = new Set(userSupports.map((s) => s.issueClusterId.toString()));
    }

    const sanitizedIssues = issues.map((issue) =>
      sanitizeIssueForPublic(issue, userSupportedSet.has(issue._id.toString()))
    );

    res.status(200).json({
      success: true,
      count: sanitizedIssues.length,
      issues: sanitizedIssues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single issue cluster details
 * @route   GET /api/issues/:id
 * @access  Public (or Private)
 */
export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { publicIssueId: id.toUpperCase() }] } : { publicIssueId: id.toUpperCase() };

    const issue = await IssueCluster.findOne(query);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue Cluster not found.',
      });
    }

    let isSupportedByMe = false;
    if (req.user) {
      const support = await IssueSupport.findOne({
        issueClusterId: issue._id,
        userId: req.user._id,
      });
      if (support) isSupportedByMe = true;
    }

    res.status(200).json({
      success: true,
      issue: sanitizeIssueForPublic(issue, isSupportedByMe),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Support an existing issue ("I am also affected")
 * @route   POST /api/issues/:id/support
 * @access  Private (Student)
 */
export const supportIssue = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { publicIssueId: id.toUpperCase() }] } : { publicIssueId: id.toUpperCase() };

    const issue = await IssueCluster.findOne(query);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue Cluster not found.',
      });
    }

    if (issue.status === 'Resolved' || issue.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: `This issue is already marked as ${issue.status}.`,
      });
    }

    // Check if student has already supported this issue
    const existingSupport = await IssueSupport.findOne({
      issueClusterId: issue._id,
      userId: req.user._id,
    });

    if (existingSupport) {
      return res.status(400).json({
        success: false,
        message: 'You have already recorded your support for this issue.',
        alreadySupported: true,
      });
    }

    // Create support entry (anonymized link)
    await IssueSupport.create({
      issueClusterId: issue._id,
      userId: req.user._id,
    });

    // Increment count on issue cluster
    issue.affectedCount += 1;
    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Support registered successfully. The affected student count has been updated.',
      affectedCount: issue.affectedCount,
      isSupportedByMe: true,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all issues supported by logged-in student
 * @route   GET /api/issues/supported/my
 * @access  Private (Student)
 */
export const getMySupportedIssues = async (req, res, next) => {
  try {
    const supports = await IssueSupport.find({ userId: req.user._id }).populate('issueClusterId');
    const validIssues = supports
      .filter((s) => s.issueClusterId)
      .map((s) => sanitizeIssueForPublic(s.issueClusterId, true));

    res.status(200).json({
      success: true,
      count: validIssues.length,
      issues: validIssues,
    });
  } catch (error) {
    next(error);
  }
};
