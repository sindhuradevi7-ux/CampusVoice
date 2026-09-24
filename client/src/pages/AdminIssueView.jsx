import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Send,
  Lock,
  Layers,
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading admin cluster details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30">
          <h2 className="text-xl font-bold text-white mb-2">Issue Not Found</h2>
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
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
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Hub
        </Link>
        <span className="text-xs text-emerald-400 font-mono">🔒 Organization View (Zero Identity Leaks)</span>
      </div>

      {/* Cluster Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-500/30">
                {issue.publicIssueId}
              </span>
              <StatusBadge status={issue.status} />
              <SeverityBadge severity={issue.severity} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {issue.title}
            </h1>
          </div>

          <div className="text-right text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <Users className="w-4 h-4 text-emerald-400" />
              {issue.affectedCount} Verified Students Affected
            </span>
          </div>
        </div>

        {/* Action Controls: Update Status & Assign Department */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
          {/* Status Update Form */}
          <form onSubmit={handleStatusSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Update Cluster Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100"
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                {updatingStatus ? 'Saving...' : 'Apply Status Update'}
              </button>
            </div>
            <input
              type="text"
              value={statusForm.note}
              onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
              placeholder="Public resolution note (e.g. Technician dispatched)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500"
            />
          </form>

          {/* Department Assignment Form */}
          <form onSubmit={handleDepartmentSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Assign Campus Department
            </h4>
            <div className="flex gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100"
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
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30"
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
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Aggregated Complaints ({complaints.length})
          </h3>
          <p className="text-[11px] text-slate-400">
            Select a complaint below to review problem details and reply directly to the verified student.
          </p>

          <div className="space-y-2.5">
            {complaints.map((comp) => (
              <div
                key={comp._id}
                onClick={() => setActiveComplaintForChat(comp)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                  activeComplaintForChat?._id === comp._id
                    ? 'bg-slate-800 border-indigo-500/80 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-300">
                    {comp.publicComplaintId}
                  </span>
                  <SeverityBadge severity={comp.severity} />
                </div>
                <p className="text-xs text-slate-200 line-clamp-2 mb-2">
                  {comp.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-medium">🔒 {comp.reporterBadge}</span>
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
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-500/20">
                      {activeComplaintForChat.publicComplaintId}
                    </span>
                    <VerifiedAnonymousBadge />
                  </div>
                  <StatusBadge status={activeComplaintForChat.status} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Student Reported Problem:</h4>
                  <p className="text-sm text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                    {activeComplaintForChat.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
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
            <div className="p-12 text-center text-slate-500 glass-panel rounded-2xl">
              Select a complaint to inspect and communicate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
