import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Layers, 
  Clock, 
  Sparkles, 
  MessageSquare,
  Lock,
  Calendar
} from 'lucide-react';
import { StatusBadge, SeverityBadge, VerifiedAnonymousBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { MessageThread } from '../components/common/MessageThread';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';

export const ComplaintDetails = () => {
  const { publicComplaintId } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await complaintAPI.getComplaintByPublicId(publicComplaintId);
        if (res.data?.success) {
          setComplaint(res.data.complaint);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load complaint details.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [publicComplaintId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-wine-500 dark:text-cream-300 font-medium">
        Loading verified anonymous complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-wine-900 p-8 rounded-3xl border border-burgundy-200 dark:border-wine-700 shadow-warm">
          <h2 className="text-xl font-bold text-wine-900 dark:text-cream-50 mb-2">Complaint Not Found</h2>
          <p className="text-sm text-wine-600 dark:text-cream-300 mb-6 font-medium">{error || 'Unable to locate this complaint.'}</p>
          <Link
            to="/my-complaints"
            className="btn-glass btn-glass-primary px-5 py-2.5 text-cream-50 rounded-xl text-xs font-bold"
          >
            Back to My Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          to="/my-complaints"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine-600 dark:text-cream-300 hover:text-burgundy-800 dark:hover:text-peach-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          Back to Reports List
        </Link>
        <VerifiedAnonymousBadge />
      </div>

      <PrivacyNoticeBanner />

      {/* Main Complaint Header Card */}
      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-wine-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-burgundy-900 dark:text-peach-200 bg-peach-50 dark:bg-wine-950 px-3 py-1 rounded-xl border border-peach-200 dark:border-wine-700">
                {complaint.publicComplaintId}
              </span>
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-wine-900 dark:text-cream-50 mt-2">
              {complaint.category} Issue
            </h1>
          </div>

          <div className="text-right sm:text-right text-xs text-wine-600 dark:text-cream-300 space-y-1">
            <div className="flex items-center gap-1 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-wine-400 dark:text-peach-400" />
              <span>Reported on {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="text-burgundy-800 dark:text-peach-300 font-bold">
              🔒 Reporter: Verified Anonymous Student
            </div>
          </div>
        </div>

        {/* Location & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Location</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-wine-900 dark:text-cream-50">
              <MapPin className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0" />
              <span>{complaint.location}</span>
            </div>
            {complaint.affectedArea && (
              <span className="text-xs text-wine-500 dark:text-cream-400 font-medium block mt-1">Area: {complaint.affectedArea}</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Linked Issue Cluster</span>
            {complaint.issueClusterId ? (
              <Link
                to={`/issues/${complaint.issueClusterId.publicIssueId || complaint.issueClusterId._id}`}
                className="flex items-center justify-between text-sm font-bold text-burgundy-800 dark:text-peach-300 hover:underline"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Layers className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0" />
                  {complaint.issueClusterId.publicIssueId}
                </span>
                <span className="text-xs bg-peach-100 dark:bg-wine-800 px-2 py-0.5 rounded-lg text-burgundy-900 dark:text-peach-200 font-bold border border-peach-200 dark:border-wine-700">
                  {complaint.issueClusterId.affectedCount || 1} affected
                </span>
              </Link>
            ) : (
              <span className="text-xs text-wine-500 dark:text-cream-400 font-medium">Standalone report</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Contact Protocol</span>
            <span className="text-xs font-bold text-burgundy-800 dark:text-peach-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-peach-600 dark:text-peach-400" />
              {complaint.contactPreference || 'Anonymous In-App Thread'}
            </span>
          </div>
        </div>

        {/* Full Description */}
        <div className="p-5 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
          <h3 className="text-xs font-bold text-wine-700 dark:text-peach-300 uppercase tracking-wider mb-2">
            Detailed Problem Description
          </h3>
          <p className="text-sm text-wine-900 dark:text-cream-100 leading-relaxed whitespace-pre-wrap font-medium">
            {complaint.description}
          </p>
        </div>

        {/* AI Analysis Summary if present */}
        {complaint.aiAnalysis && (
          <div className="p-4 rounded-2xl bg-peach-50 dark:bg-wine-950 border border-peach-200 dark:border-wine-700 text-xs shadow-sm">
            <div className="flex items-center gap-1.5 text-burgundy-900 dark:text-peach-200 font-bold mb-1">
              <Sparkles className="w-4 h-4 text-peach-600 dark:text-peach-400" /> AI Triage Summary:
            </div>
            <p className="text-wine-800 dark:text-cream-200 font-medium">{complaint.aiAnalysis.summary}</p>
          </div>
        )}

        {/* Timeline Progress Tracking */}
        <div className="pt-4 border-t border-cream-300 dark:border-wine-800">
          <h3 className="text-sm font-bold text-wine-900 dark:text-cream-50 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
            Live Resolution Pipeline
          </h3>
          <Timeline status={complaint.status} statusHistory={complaint.statusHistory} />
        </div>
      </div>

      {/* 2-Way Anonymous Communication Thread */}
      {complaint.contactPreference !== 'None' && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
              Direct Anonymous Conversation Thread
            </h3>
            <span className="text-xs text-burgundy-800 dark:text-peach-300 font-bold font-mono">🔒 Verified Anonymous</span>
          </div>
          <MessageThread complaintId={complaint._id} currentUserRole={user?.role || 'student'} />
        </div>
      )}
    </div>
  );
};
