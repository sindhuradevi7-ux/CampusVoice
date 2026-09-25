import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { 
  FileText, 
  Search, 
  ArrowUpRight, 
  PlusCircle, 
  Layers,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-wine-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-burgundy-700" />
            My Anonymous Reports
          </h1>
          <p className="text-xs sm:text-sm text-wine-600 mt-1 font-medium">
            Track real-time progress and official resolution notes for your submissions.
          </p>
        </div>

        <Link
          to="/submit"
          className="px-5 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 text-xs sm:text-sm font-bold rounded-xl shadow-warm flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-peach-300" />
          Submit New Report
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, location, or keyword..."
            className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 font-medium"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 focus:outline-none focus:border-burgundy-700 font-medium"
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
            className="w-full bg-cream-50 border border-cream-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-wine-900 focus:outline-none focus:border-burgundy-700 font-medium"
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
        <div className="p-12 text-center text-wine-500 text-sm bg-white rounded-2xl border border-cream-300">
          Loading your verified reports...
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-cream-300 shadow-sm">
          <FileText className="w-10 h-10 text-wine-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-wine-900">No reports found</h3>
          <p className="text-xs text-wine-600 mt-1 max-w-sm mx-auto font-medium">
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
              className="bg-white p-5 rounded-2xl border border-cream-300 hover:border-burgundy-300 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between block"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-extrabold text-burgundy-900 bg-peach-50 px-2.5 py-0.5 rounded-lg border border-peach-200">
                    {complaint.publicComplaintId}
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={complaint.status} />
                    <SeverityBadge severity={complaint.severity} />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-wine-900 mb-2 line-clamp-2">
                  {complaint.category}: {complaint.description}
                </h4>

                <div className="flex items-center gap-2 text-xs text-wine-600 mb-3 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-peach-700" />
                  <span className="truncate">{complaint.location}</span>
                  {complaint.affectedArea && (
                    <span className="text-wine-400">({complaint.affectedArea})</span>
                  )}
                </div>

                {complaint.issueClusterId && (
                  <div className="p-2.5 rounded-xl bg-peach-50/60 border border-peach-200 text-xs mb-3">
                    <div className="flex items-center justify-between text-[11px] text-wine-700">
                      <span className="flex items-center gap-1 text-burgundy-900 font-bold">
                        <Layers className="w-3 h-3 text-peach-700" /> Linked Cluster: {complaint.issueClusterId.publicIssueId}
                      </span>
                      <span className="font-semibold text-peach-800">{complaint.issueClusterId.affectedCount} students</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-cream-300 flex items-center justify-between text-xs">
                <span className="text-wine-500 font-medium">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
                <span className="text-burgundy-800 font-bold flex items-center gap-1 hover:underline">
                  Track Details <ArrowUpRight className="w-3.5 h-3.5 text-peach-700" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
