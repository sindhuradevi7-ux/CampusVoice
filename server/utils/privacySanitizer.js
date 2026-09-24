/**
 * Privacy Sanitizer Utility
 * Guarantees that student identity (name, email, studentId, internal userId)
 * is NEVER exposed across Organization, Admin, or Public endpoints.
 */

export const sanitizeComplaintForAdmin = (complaint) => {
  if (!complaint) return null;

  const doc = complaint.toObject ? complaint.toObject() : { ...complaint };

  // Remove any internal linking fields if present
  delete doc.userId;
  delete doc.user;
  delete doc.__v;

  return {
    _id: doc._id,
    publicComplaintId: doc.publicComplaintId,
    category: doc.category,
    description: doc.description,
    location: doc.location,
    affectedArea: doc.affectedArea,
    severity: doc.severity,
    status: doc.status,
    issueClusterId: doc.issueClusterId,
    contactPreference: doc.contactPreference,
    statusHistory: doc.statusHistory || [],
    aiAnalysis: doc.aiAnalysis,
    reporterBadge: 'Verified Anonymous Student',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const sanitizeIssueForPublic = (issue, userHasSupported = false) => {
  if (!issue) return null;

  const doc = issue.toObject ? issue.toObject() : { ...issue };
  delete doc.__v;

  return {
    _id: doc._id,
    publicIssueId: doc.publicIssueId,
    title: doc.title,
    summary: doc.summary,
    category: doc.category,
    location: doc.location,
    severity: doc.severity,
    affectedCount: doc.affectedCount,
    status: doc.status,
    assignedDepartment: doc.assignedDepartment,
    keywords: doc.keywords || [],
    statusHistory: doc.statusHistory || [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    resolvedAt: doc.resolvedAt,
    isSupportedByMe: userHasSupported,
  };
};

export const sanitizeMessage = (message) => {
  if (!message) return null;

  const doc = message.toObject ? message.toObject() : { ...message };
  delete doc.__v;

  return {
    _id: doc._id,
    complaintId: doc.complaintId,
    senderType: doc.senderType,
    senderDisplay: doc.senderType === 'admin' ? 'Campus Administration' : 'Verified Anonymous Student',
    message: doc.message,
    createdAt: doc.createdAt,
  };
};
