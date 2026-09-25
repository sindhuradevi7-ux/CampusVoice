import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintAPI, issueAPI } from '../services/api';
import { 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  Compass
} from 'lucide-react';
import { StatusBadge, SeverityBadge, VerifiedAnonymousBadge } from '../components/common/StatusBadge';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [supportedIssues, setSupportedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintsRes, supportedRes] = await Promise.all([
          complaintAPI.getMyComplaints(),
          issueAPI.getMySupportedIssues(),
        ]);

        if (complaintsRes.data?.success) {
          setComplaints(complaintsRes.data.complaints || []);
        }
        if (supportedRes.data?.success) {
          setSupportedIssues(supportedRes.data.issues || []);
        }
      } catch (err) {
        console.error('Failed to load student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const inProgressCount = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Privacy Notice Banner */}
      <PrivacyNoticeBanner />

      {/* Welcome & Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-cream-300 dark:border-peach-400/20">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-wine-900 dark:text-cream-50">
              Student Voice Desk
            </h1>
            <VerifiedAnonymousBadge />
          </div>
          <p className="text-xs sm:text-sm text-wine-600 dark:text-cream-300 mt-1 font-medium">
            Logged in as <span className="text-burgundy-900 dark:text-peach-300 font-bold">{user?.name}</span> ({user?.studentId}) • Identity stripped on all submitted complaints.
          </p>
        </div>

        <Link
          to="/submit"
          className="px-5 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 dark:bg-burgundy-700 dark:hover:bg-burgundy-600 text-cream-50 text-sm font-bold rounded-xl shadow-warm flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-peach-300" />
          Submit Anonymous Report
        </Link>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-400 text-xs font-bold mb-2">
            <span>My Submitted Reports</span>
            <FileText className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-wine-900 dark:text-cream-50">{complaints.length}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Verified anonymous submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-400 text-xs font-bold mb-2">
            <span>Supported Clusters</span>
            <Layers className="w-4 h-4 text-peach-700 dark:text-peach-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-burgundy-800 dark:text-peach-300">{supportedIssues.length}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">"+1 I am also affected" endorsements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-400 text-xs font-bold mb-2">
            <span>Active In Progress</span>
            <Clock className="w-4 h-4 text-peach-600 dark:text-peach-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-peach-800 dark:text-peach-300">{inProgressCount}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Assigned to staff or in repair</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-400 text-xs font-bold mb-2">
            <span>Resolved Issues</span>
            <CheckCircle2 className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-burgundy-900 dark:text-cream-50">{resolvedCount}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Successfully resolved</p>
        </div>
      </div>

      {/* Main Content Sections: My Reports & Supported Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Anonymous Reports List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
              My Anonymous Reports ({complaints.length})
            </h3>
            <Link to="/my-complaints" className="text-xs font-bold text-burgundy-800 dark:text-peach-300 hover:text-burgundy-900 dark:hover:text-peach-200">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-wine-500 dark:text-cream-400 text-sm bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20">
              Loading your anonymous reports...
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20 shadow-sm">
              <ShieldCheck className="w-8 h-8 text-wine-400 dark:text-peach-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-wine-900 dark:text-cream-50">No complaints submitted yet</p>
              <p className="text-xs text-wine-600 dark:text-cream-300 mt-1 max-w-sm mx-auto font-medium">
                Have you noticed an infrastructure, Wi-Fi, or classroom issue? Submit your first verified anonymous report.
              </p>
              <Link
                to="/submit"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-burgundy-800 hover:bg-burgundy-900 dark:bg-burgundy-700 dark:hover:bg-burgundy-600 text-xs font-bold text-cream-50 rounded-xl transition-colors"
              >
                Submit New Report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 5).map((complaint) => (
                <Link
                  key={complaint._id}
                  to={`/complaints/${complaint.publicComplaintId}`}
                  className="bg-white dark:bg-wine-900 p-4 rounded-2xl border border-cream-300 dark:border-peach-400/20 hover:border-burgundy-300 dark:hover:border-peach-400/40 shadow-sm hover:shadow-warm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 block"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-burgundy-800 dark:text-peach-300 bg-peach-50 dark:bg-wine-950 px-2 py-0.5 rounded-lg border border-peach-200 dark:border-peach-400/20">
                        {complaint.publicComplaintId}
                      </span>
                      <StatusBadge status={complaint.status} />
                      <SeverityBadge severity={complaint.severity} />
                    </div>

                    <h4 className="text-sm font-bold text-wine-900 dark:text-cream-50 truncate">
                      {complaint.category}: {complaint.description.slice(0, 70)}...
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-wine-500 dark:text-cream-400 font-medium">
                      <span>📍 {complaint.location}</span>
                      <span>•</span>
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center text-xs font-bold text-burgundy-800 dark:text-peach-300 shrink-0">
                    <span>Track Status</span>
                    <ArrowUpRight className="w-4 h-4 text-peach-700 dark:text-peach-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Supported Public Clusters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
              <Layers className="w-5 h-5 text-peach-700 dark:text-peach-400" />
              Supported Issues ({supportedIssues.length})
            </h3>
            <Link to="/issues" className="text-xs font-bold text-burgundy-800 dark:text-peach-300 hover:text-burgundy-900 dark:hover:text-peach-200">
              Explorer
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-wine-500 dark:text-cream-400 text-sm bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20">
              Loading supported issues...
            </div>
          ) : supportedIssues.length === 0 ? (
            <div className="p-6 text-center bg-white dark:bg-wine-900 rounded-2xl border border-cream-300 dark:border-peach-400/20 shadow-sm">
              <Compass className="w-7 h-7 text-wine-400 dark:text-peach-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-wine-900 dark:text-cream-50">No issues endorsed yet</p>
              <p className="text-[11px] text-wine-600 dark:text-cream-300 mt-1 font-medium">
                Browse campus issue clusters and click "+1 I am also affected" to amplify common problems without duplicate spam.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {supportedIssues.map((issue) => (
                <Link
                  key={issue._id}
                  to={`/issues/${issue.publicIssueId || issue._id}`}
                  className="bg-white dark:bg-wine-900 p-3.5 rounded-2xl border border-cream-300 dark:border-peach-400/20 hover:border-burgundy-300 dark:hover:border-peach-400/40 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between block"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-burgundy-800 dark:text-peach-300">
                      {issue.publicIssueId}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>

                  <h5 className="text-xs font-bold text-wine-900 dark:text-cream-50 line-clamp-1 mb-1">
                    {issue.title}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-wine-500 dark:text-cream-400 font-medium mt-2 pt-2 border-t border-cream-300 dark:border-peach-400/20">
                    <span className="text-burgundy-800 dark:text-peach-300 font-bold">{issue.affectedCount} affected</span>
                    <span className="truncate max-w-[110px]">{issue.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
