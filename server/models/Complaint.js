import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    },
    note: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    publicComplaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Infrastructure',
        'Wi-Fi / Internet',
        'Laboratory',
        'Classroom',
        'Library',
        'Hostel',
        'Transport',
        'Food / Canteen',
        'Facilities',
        'Academic',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    affectedArea: {
      type: String,
      default: '',
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted',
    },
    issueClusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IssueCluster',
      default: null,
    },
    contactPreference: {
      type: String,
      enum: ['Anonymous In-App Thread', 'None'],
      default: 'Anonymous In-App Thread',
    },
    aiAnalysis: {
      category: String,
      severity: String,
      summary: String,
      keywords: [String],
      possibleDepartment: String,
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
