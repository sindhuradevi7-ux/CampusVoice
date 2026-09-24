import mongoose from 'mongoose';

const issueSupportSchema = new mongoose.Schema(
  {
    issueClusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IssueCluster',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate support from same student on same issue
issueSupportSchema.index({ issueClusterId: 1, userId: 1 }, { unique: true });

const IssueSupport = mongoose.model('IssueSupport', issueSupportSchema);
export default IssueSupport;
