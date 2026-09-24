import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Building2, 
  Search, 
  Filter, 
  Layers, 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  Edit,
  Flame,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';

const CATEGORIES = [
  'All',
  'Wi-Fi / Internet',
  'Infrastructure',
  'Laboratory',
  'Classroom',
  'Library',
  'Hostel',
  'Transport',
  'Food / Canteen',
  'Facilities',
  'Academic',
  'Other',
];

const STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
const DEPARTMENTS = [
  'All',
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

export const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [metrics, setMetrics] = useState({
    totalIssues: 0,
    openIssues: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    totalAffectedStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');
  const { showSuccess, showError } = useToast();

  // Status update modal state
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getIssues({
        category,
        status,
        department,
        search,
      });
      if (res.data?.success) {
        setIssues(res.data.issues || []);
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
      }
    } catch (err) {
      console.error('Error fetching admin issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [category, status, department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleOpenStatusModal = (issue, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setStatusNote('');
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;

    try {
      setUpdating(true);
      const res = await adminAPI.updateStatus(selectedIssue._id || selectedIssue.publicIssueId, {
        status: newStatus,
        note: statusNote,
      });
      if (res.data?.success) {
        showSuccess(`Issue ${selectedIssue.publicIssueId} updated to ${newStatus}`);
        setSelectedIssue(null);
        fetchAdminData();
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Privacy Guarantee Header for Admin */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Campus Administration Grievance Hub
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Privacy-Safe View
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Verified Anonymity Active: All individual complaint records are stripped of student names, emails, and IDs.
            </p>
          </div>
        </div>

        <Link
          to="/analytics"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-md shadow-indigo-600/30"
        >
          <BarChart3 className="w-4 h-4" />
          Campus Analytics
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Clusters</span>
          <div className="text-2xl font-extrabold text-white">{metrics.totalIssues}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{metrics.totalAffectedStudents} students</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30">
          <span className="text-xs text-sky-400 font-medium block mb-1">Open Reports</span>
          <div className="text-2xl font-extrabold text-sky-300">{metrics.openIssues}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Newly submitted</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30">
          <span className="text-xs text-amber-400 font-medium block mb-1">Under Review</span>
          <div className="text-2xl font-extrabold text-amber-300">{metrics.underReview}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">In triage</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30">
          <span className="text-xs text-indigo-400 font-medium block mb-1">In Progress</span>
          <div className="text-2xl font-extrabold text-indigo-300">{metrics.inProgress}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Staff working</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium block mb-1">Resolved</span>
          <div className="text-2xl font-extrabold text-emerald-300">{metrics.resolved}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Fixed & closed</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30">
          <span className="text-xs text-rose-400 font-medium block mb-1">High Priority</span>
          <div className="text-2xl font-extrabold text-rose-400">{metrics.highPriority}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Critical / High</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title, Location, Issue ID, or Department..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  Department: {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issue Clusters Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Active Issue Clusters ({issues.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click any issue to inspect individual anonymous reports & send replies
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            Loading privacy-safe issue clusters...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            No issues match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Issue ID</th>
                  <th className="py-3.5 px-4">Problem / Cluster Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Affected</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned Department</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {issues.map((issue) => (
                  <tr
                    key={issue._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                      {issue.publicIssueId}
                    </td>
                    <td className="py-3.5 px-4 font-medium max-w-xs">
                      <Link
                        to={`/admin/issues/${issue.publicIssueId || issue._id}`}
                        className="text-white hover:text-indigo-300 line-clamp-1"
                      >
                        {issue.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{issue.category}</td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[150px] truncate">
                      {issue.location}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        <Users className="w-3 h-3" />
                        {issue.affectedCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <SeverityBadge severity={issue.severity} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-[160px] truncate">
                      {issue.assignedDepartment}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => handleOpenStatusModal(issue, e)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                        title="Quick Status Update"
                      >
                        Update
                      </button>
                      <Link
                        to={`/admin/issues/${issue.publicIssueId || issue._id}`}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors inline-block"
                      >
                        View & Reply
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Update Issue Status: {selectedIssue.publicIssueId}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{selectedIssue.title}</p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Official Public Resolution Note
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Electrician team replaced the faulty geyser circuit breaker."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  {updating ? 'Saving...' : 'Save Update & Notify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
