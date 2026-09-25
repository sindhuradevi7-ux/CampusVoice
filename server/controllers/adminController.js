import IssueCluster from '../models/IssueCluster.js';
import Complaint from '../models/Complaint.js';
import { sanitizeIssueForPublic, sanitizeComplaintForAdmin } from '../utils/privacySanitizer.js';

/**
 * @desc    Get all issue clusters for admin dashboard with summary metrics
 * @route   GET /api/admin/issues
 * @access  Private (Admin)
 */
export const getAdminIssues = async (req, res, next) => {
  try {
    const { category, status, severity, department, search, sortBy = 'affectedCount' } = req.query;

    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (severity && severity !== 'All') filter.severity = severity;
    if (department && department !== 'All') filter.assignedDepartment = department;

    // Search strictly across non-identifying fields (title, summary, location, category, ID)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { summary: regex },
        { location: regex },
        { category: regex },
        { publicIssueId: regex },
        { assignedDepartment: regex },
      ];
    }

    let sortOptions = {};
    if (sortBy === 'affectedCount') {
      sortOptions = { affectedCount: -1, updatedAt: -1 };
    } else if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'severity') {
      sortOptions = { severity: 1 };
    } else {
      sortOptions = { updatedAt: -1 };
    }

    const issues = await IssueCluster.find(filter).sort(sortOptions).lean();

    // Calculate Admin metrics
    const allIssues = await IssueCluster.find({}).lean();
    const metrics = {
      totalIssues: allIssues.length,
      openIssues: allIssues.filter((i) => i.status === 'Submitted').length,
      underReview: allIssues.filter((i) => i.status === 'Under Review').length,
      assigned: allIssues.filter((i) => i.status === 'Assigned').length,
      inProgress: allIssues.filter((i) => i.status === 'In Progress').length,
      resolved: allIssues.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length,
      highPriority: allIssues.filter((i) => i.severity === 'High' || i.severity === 'Critical').length,
      totalAffectedStudents: allIssues.reduce((acc, i) => acc + (i.affectedCount || 1), 0),
    };

    res.status(200).json({
      success: true,
      metrics,
      count: issues.length,
      issues: issues.map((i) => sanitizeIssueForPublic(i)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed issue cluster and its associated anonymous complaints
 * @route   GET /api/admin/issues/:id
 * @access  Private (Admin)
 */
export const getAdminIssueDetails = async (req, res, next) => {
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

    // Retrieve complaints linked to this issue cluster
    const complaints = await Complaint.find({ issueClusterId: issue._id })
      .sort({ createdAt: -1 })
      .lean();

    // Sanitize every complaint to enforce zero identity leakage
    const sanitizedComplaints = complaints.map((c) => sanitizeComplaintForAdmin(c));

    res.status(200).json({
      success: true,
      issue: sanitizeIssueForPublic(issue),
      complaints: sanitizedComplaints,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update issue cluster status with official note & sync associated complaints
 * @route   PATCH /api/admin/issues/:id/status
 * @access  Private (Admin)
 */
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const isObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { publicIssueId: id.toUpperCase() }] } : { publicIssueId: id.toUpperCase() };

    const issue = await IssueCluster.findOne(query);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue Cluster not found.',
      });
    }

    const statusNote = note || `Status updated to ${status} by campus administration.`;

    issue.status = status;
    issue.statusHistory.push({
      status,
      note: statusNote,
      updatedAt: new Date(),
    });

    if (status === 'Resolved' || status === 'Closed') {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    // Sync all attached individual complaints with this status update
    await Complaint.updateMany(
      { issueClusterId: issue._id },
      {
        $set: { status },
        $push: {
          statusHistory: {
            status,
            note: statusNote,
            updatedAt: new Date(),
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Issue cluster status updated to ${status}.`,
      issue: sanitizeIssueForPublic(issue),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Assign department to issue cluster
 * @route   PATCH /api/admin/issues/:id/department
 * @access  Private (Admin)
 */
export const updateIssueDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignedDepartment } = req.body;

    if (!assignedDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name.',
      });
    }

    const isObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { $or: [{ _id: id }, { publicIssueId: id.toUpperCase() }] } : { publicIssueId: id.toUpperCase() };

    const issue = await IssueCluster.findOne(query);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue Cluster not found.',
      });
    }

    issue.assignedDepartment = assignedDepartment;
    issue.statusHistory.push({
      status: issue.status,
      note: `Assigned to ${assignedDepartment}.`,
      updatedAt: new Date(),
    });

    await issue.save();

    res.status(200).json({
      success: true,
      message: `Assigned to ${assignedDepartment} successfully.`,
      issue: sanitizeIssueForPublic(issue),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated analytics & intelligence reports for campus admin
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const issues = await IssueCluster.find({}).lean();
    const complaints = await Complaint.find({}).lean();

    // 1. Status Distribution
    const statusMap = {
      Submitted: 0,
      'Under Review': 0,
      Assigned: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
    };
    issues.forEach((i) => {
      if (statusMap[i.status] !== undefined) statusMap[i.status]++;
    });

    // 2. Category Distribution
    const categoryMap = {};
    issues.forEach((i) => {
      categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
    });

    // 3. Severity Distribution
    const severityMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    issues.forEach((i) => {
      if (severityMap[i.severity] !== undefined) severityMap[i.severity]++;
    });

    // 4. Location Hotspots (top affected locations)
    const locationMap = {};
    issues.forEach((i) => {
      locationMap[i.location] = (locationMap[i.location] || 0) + (i.affectedCount || 1);
    });
    const topLocations = Object.entries(locationMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 5. Department Workload
    const deptMap = {};
    issues.forEach((i) => {
      const dept = i.assignedDepartment || 'Unassigned';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    // 6. Resolution Metrics
    const resolvedIssues = issues.filter((i) => i.resolvedAt || i.status === 'Resolved' || i.status === 'Closed');
    const resolutionRate = issues.length > 0 ? Math.round((resolvedIssues.length / issues.length) * 100) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalClusters: issues.length,
        totalComplaints: complaints.length,
        totalAffectedStudents: issues.reduce((acc, i) => acc + (i.affectedCount || 1), 0),
        resolutionRate,
        statusDistribution: statusMap,
        categoryDistribution: categoryMap,
        severityDistribution: severityMap,
        topLocations,
        departmentDistribution: deptMap,
      },
    });
  } catch (error) {
    next(error);
  }
};
