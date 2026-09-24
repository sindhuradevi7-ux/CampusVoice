import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Clock, 
  PlusCircle, 
  ShieldCheck,
  Layers,
  MapPin
} from 'lucide-react';
import { StatusBadge, SeverityBadge, VerifiedAnonymousBadge } from '../components/common/StatusBadge';
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

export const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await complaintAPI.getMyComplaints();
        if (res.data?.success) {
          setComplaints(res.data.complaints || []);
          setFilteredComplaints(res.data.complaints || []);
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (categoryFilter !== 'All') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.publicComplaintId.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    setFilteredComplaints(result);
  }, [categoryFilter, statusFilter, searchTerm, complaints]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      <PrivacyNoticeBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            My Anonymous Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track real-time progress and official resolution notes for your submissions.
          </p>
        </div>

        <Link
          to="/submit"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          Submit New Report
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, location, or keyword..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm glass-panel rounded-2xl">
          Loading your verified reports...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-slate-200">No reports found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {complaints.length === 0
              ? 'You have not submitted any complaints yet. When you submit one, it will appear here.'
              : 'No complaints match the selected filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((complaint) => (
            <Link
              key={complaint._id}
              to={`/complaints/${complaint.publicComplaintId}`}
              className="glass-panel p-5 rounded-2xl glass-panel-hover flex flex-col justify-between block"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-extrabold text-indigo-300 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-500/20">
                    {complaint.publicComplaintId}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={complaint.status} />
                    <SeverityBadge severity={complaint.severity} />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">
                  {complaint.category}: {complaint.description}
                </h4>

                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{complaint.location}</span>
                  {complaint.affectedArea && (
                    <span className="text-slate-500">({complaint.affectedArea})</span>
                  )}
                </div>

                {complaint.issueClusterId && (
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs mb-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                        <Layers className="w-3 h-3 text-emerald-400" /> Linked Cluster: {complaint.issueClusterId.publicIssueId}
                      </span>
                      <span>{complaint.issueClusterId.affectedCount} students</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <span className="text-indigo-400 font-semibold flex items-center gap-1 hover:underline">
                  Track Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
