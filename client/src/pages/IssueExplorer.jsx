import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { issueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Compass, 
  Search, 
  Users, 
  Check, 
  Layers, 
  Building2, 
  MapPin
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';

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
const SEVERITIES = ['All', 'Low', 'Medium', 'High', 'Critical'];

export const IssueExplorer = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const { showSuccess, showError } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [sortBy, setSortBy] = useState('affectedCount');
  const [supportingId, setSupportingId] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await issueAPI.getAllIssues({
        category,
        status,
        severity,
        search,
        sortBy,
      });
      if (res.data?.success) {
        setIssues(res.data.issues || []);
      }
    } catch (err) {
      console.error('Failed to fetch issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, severity, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const handleSupport = async (issueId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showError('Please log in with your verified student account to endorse this issue.');
      return;
    }

    if (!isStudent) {
      showError('Only authenticated students can endorse campus issues.');
      return;
    }

    try {
      setSupportingId(issueId);
      const res = await issueAPI.supportIssue(issueId);
      if (res.data?.success) {
        showSuccess('Your support has been recorded anonymously (+1)!');
        setIssues((prev) =>
          prev.map((item) =>
            item._id === issueId || item.publicIssueId === issueId
              ? { ...item, affectedCount: res.data.affectedCount, isSupportedByMe: true }
              : item
          )
        );
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to record support.');
    } finally {
      setSupportingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      <PrivacyNoticeBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-peach-400/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <Compass className="w-6 h-6 text-burgundy-700 dark:text-peach-400" />
            Campus Issue Explorer
          </h1>
          <p className="text-xs sm:text-sm text-wine-600 dark:text-cream-300 mt-1 font-medium">
            Browse aggregated campus problem clusters. Click "I am also affected" to highlight scale without duplicate complaints.
          </p>
        </div>

        {isStudent && (
          <Link
            to="/submit"
            className="btn-glass btn-glass-primary px-5 py-2.5 text-cream-50 text-xs sm:text-sm font-bold rounded-xl shadow-warm flex items-center gap-1.5"
          >
            Submit New Report
          </Link>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-wine-900 p-4 sm:p-5 rounded-2xl border border-cream-300 dark:border-peach-400/20 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-wine-400 dark:text-wine-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, location, or issue ID (e.g. Lab 3, Wi-Fi, CV-ISSUE-104)..."
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="btn-glass btn-glass-primary px-5 py-2.5 text-cream-50 text-xs sm:text-sm font-bold rounded-xl shrink-0 shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
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
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
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
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
            >
              {SEVERITIES.map((sev) => (
                <option key={sev} value={sev}>
                  Severity: {sev}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
            >
              <option value="affectedCount">Sort: Most Affected</option>
              <option value="newest">Sort: Newest First</option>
              <option value="status">Sort: By Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issue Clusters Grid */}
      {loading ? (
        <div className="p-16 text-center text-wine-500 dark:text-cream-400 text-sm bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20 shadow-sm">
          Loading active campus issue clusters...
        </div>
      ) : issues.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <Layers className="w-10 h-10 text-wine-400 dark:text-peach-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-wine-900 dark:text-cream-50">No issue clusters found</h3>
          <p className="text-xs text-wine-600 dark:text-cream-300 mt-1 max-w-sm mx-auto font-medium">
            Try adjusting your search terms or filter selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white dark:bg-wine-900 p-5 rounded-2xl border border-cream-300 dark:border-peach-400/20 hover:border-burgundy-300 dark:hover:border-peach-400/40 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-extrabold text-burgundy-900 dark:text-peach-300 bg-peach-50 dark:bg-wine-950 px-2.5 py-0.5 rounded-lg border border-peach-200 dark:border-peach-400/20">
                    {issue.publicIssueId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={issue.status} />
                    <SeverityBadge severity={issue.severity} />
                  </div>
                </div>

                <Link
                  to={`/issues/${issue.publicIssueId || issue._id}`}
                  className="block group"
                >
                  <h3 className="text-sm font-bold text-wine-900 dark:text-cream-50 group-hover:text-burgundy-800 dark:group-hover:text-peach-300 transition-colors line-clamp-2 mb-2">
                    {issue.title}
                  </h3>
                </Link>

                <p className="text-xs text-wine-600 dark:text-cream-300 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {issue.summary}
                </p>

                <div className="space-y-1.5 text-xs text-wine-700 dark:text-cream-300 mb-4 bg-cream-50 dark:bg-wine-950 p-3 rounded-xl border border-cream-300 dark:border-peach-400/20">
                  <div className="flex items-center gap-1.5 text-wine-900 dark:text-cream-100 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-peach-700 dark:text-peach-400 shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-wine-600 dark:text-cream-400 truncate font-medium">
                    <Building2 className="w-3.5 h-3.5 text-burgundy-700 dark:text-peach-400 shrink-0" />
                    <span className="truncate">{issue.assignedDepartment}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-cream-300 dark:border-peach-400/20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Users className="w-3.5 h-3.5 text-peach-700 dark:text-peach-400" />
                  <span className="font-extrabold text-burgundy-900 dark:text-peach-300 text-sm">{issue.affectedCount}</span>
                  <span className="text-wine-500 dark:text-cream-400 text-[11px] font-medium">affected</span>
                </div>

                {issue.status === 'Resolved' || issue.status === 'Closed' ? (
                  <span className="text-[11px] text-burgundy-900 dark:text-peach-300 font-bold px-2.5 py-1 bg-peach-100 dark:bg-wine-800 rounded-lg border border-peach-300 dark:border-peach-400/30">
                    ✓ Resolved
                  </span>
                ) : issue.isSupportedByMe ? (
                  <button
                    disabled
                    className="btn-glass btn-glass-subtle px-3 py-1.5 text-burgundy-900 dark:text-peach-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5 text-peach-700 dark:text-peach-400" />
                    Supported
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleSupport(issue._id, e)}
                    disabled={supportingId === issue._id}
                    className="btn-glass btn-glass-primary px-3 py-1.5 text-cream-50 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1"
                  >
                    <Users className="w-3.5 h-3.5 text-peach-300" />
                    {supportingId === issue._id ? 'Saving...' : 'I am also affected (+1)'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
