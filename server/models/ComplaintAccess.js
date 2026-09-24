import mongoose from 'mongoose';

const complaintAccessSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
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

// Compound index to ensure uniqueness and fast lookup
complaintAccessSchema.index({ complaintId: 1, userId: 1 }, { unique: true });

const ComplaintAccess = mongoose.model('ComplaintAccess', complaintAccessSchema);
export default ComplaintAccess;
