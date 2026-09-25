import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Clock, 
  FileText
} from 'lucide-react';
import { StatusBadge, SeverityBadge, VerifiedAnonymousBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { MessageThread } from '../components/common/MessageThread';

const DEPARTMENTS = [
  'IT & Networking Department',
  'Estate & Maintenance',
  'Hostel Affairs & Student Housing',
  'Canteen & Hospitality Committee',
  'Campus Transport Division',
  'Laboratory & Technical Services',
  'Library Services',
  'Academic Affairs & Registrar',
  'General Administration',
];

export const AdminIssueView = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();
  const [issue, setIssue] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status & Department update forms
  const [statusForm, setStatusForm] = useState({
    status: 'In Progress',
    note: '',
  });
  const [selectedDept, setSelectedDept] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingDept, setUpdatingDept] = useState(false);

  // Active messaging thread
  const [activeComplaintForChat, setActiveComplaintForChat] = useState(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getIssueDetails(id);
      if (res.data?.success) {
        setIssue(res.data.issue);
        setComplaints(res.data.complaints || []);
        setStatusForm({
          status: res.data.issue.status,
          note: '',
        });
        setSelectedDept(res.data.issue.assignedDepartment);
        if (res.data.complaints && res.data.complaints.length > 0) {
          setActiveComplaintForChat(res.data.complaints[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching admin issue details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      const res = await adminAPI.updateStatus(issue._id || issue.publicIssueId, statusForm);
      if (res.data?.success) {
        showSuccess(`Status updated to ${statusForm.status}`);
        fetchDetails();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingDept(true);
      const res = await adminAPI.updateDepartment(issue._id || issue.publicIssueId, {
        assignedDepartment: selectedDept,
      });
      if (res.data?.success) {
        showSuccess(`Department updated to ${selectedDept}`);
        fetchDetails();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to assign department.');
    } finally {
      setUpdatingDept(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-wine-500 dark:text-cream-300 font-medium">
        Loading admin cluster details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-wine-900 p-8 rounded-3xl border border-burgundy-200 dark:border-wine-700 shadow-warm">
          <h2 className="text-xl font-bold text-wine-900 dark:text-cream-50 mb-2">Issue Not Found</h2>
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 rounded-xl text-xs font-bold"
          >
            Back to Admin Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      {/* Top Nav */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine-600 dark:text-cream-300 hover:text-burgundy-800 dark:hover:text-peach-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          Back to Admin Hub
        </Link>
        <span className="text-xs text-burgundy-800 dark:text-peach-300 font-bold font-mono">🔒 Organization View (Zero Identity Leaks)</span>
      </div>

      {/* Cluster Header Card */}
      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-wine-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-burgundy-900 dark:text-peach-200 bg-peach-50 dark:bg-wine-950 px-3 py-1 rounded-xl border border-peach-200 dark:border-wine-700">
                {issue.publicIssueId}
              </span>
              <StatusBadge status={issue.status} />
              <SeverityBadge severity={issue.severity} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-wine-900 dark:text-cream-50 mt-2">
              {issue.title}
            </h1>
          </div>

          <div className="text-right text-xs text-wine-600 dark:text-cream-300">
            <span className="inline-flex items-center gap-1.5 font-bold text-burgundy-900 dark:text-peach-200 bg-peach-100 dark:bg-wine-950 px-3.5 py-2 rounded-xl border border-peach-300 dark:border-wine-700 shadow-sm">
              <Users className="w-4 h-4 text-peach-700 dark:text-peach-400" />
              {issue.affectedCount} Verified Students Affected
            </span>
          </div>
        </div>

        {/* Action Controls: Update Status & Assign Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-cream-50 dark:bg-wine-950 p-5 rounded-2xl border border-cream-300 dark:border-wine-800 shadow-sm">
          {/* Status Update Form */}
          <form onSubmit={handleStatusSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-burgundy-900 dark:text-peach-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-peach-700 dark:text-peach-400" /> Update Cluster Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-700 rounded-xl px-3 py-2 text-xs font-bold text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
              >
                <option value="Submitted">Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              <button
                type="submit"
                disabled={updatingStatus}
                className="btn-glass btn-glass-primary px-4 py-2 disabled:opacity-50 text-cream-50 rounded-xl text-xs font-bold shadow-sm"
              >
                {updatingStatus ? 'Saving...' : 'Apply Status Update'}
              </button>
            </div>
            <input
              type="text"
              value={statusForm.note}
              onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
              placeholder="Public resolution note (e.g. Technician dispatched)..."
              className="w-full bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-700 rounded-xl px-3 py-2 text-xs text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-cream-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
            />
          </form>

          {/* Department Assignment Form */}
          <form onSubmit={handleDepartmentSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-burgundy-900 dark:text-peach-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-burgundy-700 dark:text-peach-400" /> Assign Campus Department
            </h4>
            <div className="flex gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex-1 bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-700 rounded-xl px-3 py-2 text-xs font-bold text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={updatingDept}
                className="btn-glass btn-glass-secondary px-4 py-2 text-burgundy-950 dark:text-peach-200 disabled:opacity-50 rounded-xl text-xs font-bold shadow-sm"
              >
                {updatingDept ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        </div>

        {/* Timeline */}
        <div className="pt-2">
          <Timeline status={issue.status} statusHistory={issue.statusHistory} />
        </div>
      </div>

      {/* Associated Individual Anonymous Complaints & Messaging */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Complaints list */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
            Aggregated Complaints ({complaints.length})
          </h3>
          <p className="text-[11px] text-wine-600 dark:text-cream-300 font-medium">
            Select a complaint below to review problem details and reply directly to the verified student.
          </p>

          <div className="space-y-2.5">
            {complaints.map((comp) => (
              <div
                key={comp._id}
                onClick={() => setActiveComplaintForChat(comp)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  activeComplaintForChat?._id === comp._id
                    ? 'bg-peach-50 dark:bg-wine-800 border-peach-400 dark:border-peach-500 shadow-sm'
                    : 'bg-white dark:bg-wine-900 border-cream-300 dark:border-wine-800 hover:border-burgundy-300 dark:hover:border-wine-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-burgundy-900 dark:text-peach-300">
                    {comp.publicComplaintId}
                  </span>
                  <SeverityBadge severity={comp.severity} />
                </div>
                <p className="text-xs text-wine-800 dark:text-cream-200 font-medium line-clamp-2 mb-2">
                  {comp.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-wine-500 dark:text-cream-400 pt-1.5 border-t border-cream-300 dark:border-wine-800 font-medium">
                  <span className="text-burgundy-800 dark:text-peach-300 font-bold">🔒 {comp.reporterBadge}</span>
                  <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Complaint Details + 2-Way Message Thread */}
        <div className="lg:col-span-2 space-y-4">
          {activeComplaintForChat ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-wine-900 p-5 rounded-2xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-burgundy-900 dark:text-peach-200 bg-peach-50 dark:bg-wine-950 px-2.5 py-1 rounded-lg border border-peach-200 dark:border-wine-700">
                      {activeComplaintForChat.publicComplaintId}
                    </span>
                    <VerifiedAnonymousBadge />
                  </div>
                  <StatusBadge status={activeComplaintForChat.status} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-wine-600 dark:text-peach-300 uppercase">Student Reported Problem:</h4>
                  <p className="text-sm text-wine-900 dark:text-cream-100 mt-1 leading-relaxed whitespace-pre-wrap font-medium">
                    {activeComplaintForChat.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-wine-600 dark:text-cream-400 font-medium pt-2 border-t border-cream-300 dark:border-wine-800">
                  <span>📍 {activeComplaintForChat.location}</span>
                  {activeComplaintForChat.affectedArea && (
                    <span>Area: {activeComplaintForChat.affectedArea}</span>
                  )}
                </div>
              </div>

              {/* 2-way Anonymous Chat */}
              <div>
                <MessageThread
                  complaintId={activeComplaintForChat._id}
                  currentUserRole="admin"
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-wine-500 dark:text-cream-400 bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-800 rounded-2xl shadow-sm font-medium">
              Select a complaint to inspect and communicate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
