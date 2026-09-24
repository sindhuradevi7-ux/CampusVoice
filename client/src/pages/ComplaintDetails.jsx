import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  Layers, 
  Clock, 
  Building2, 
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading verified anonymous complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30">
          <h2 className="text-xl font-bold text-white mb-2">Complaint Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">{error || 'Unable to locate this complaint.'}</p>
          <Link
            to="/my-complaints"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
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
      <div className="flex items-center justify-between">
        <Link
          to="/my-complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports List
        </Link>
        <VerifiedAnonymousBadge />
      </div>

      <PrivacyNoticeBanner />

      {/* Main Complaint Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-500/30">
                {complaint.publicComplaintId}
              </span>
              <StatusBadge status={complaint.status} />
              <SeverityBadge severity={complaint.severity} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {complaint.category} Issue
            </h1>
          </div>

          <div className="text-right sm:text-right text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Reported on {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="text-emerald-400 font-medium">
              🔒 Reporter: Verified Anonymous Student
            </div>
          </div>
        </div>

        {/* Location & Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium block mb-1">Location</span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{complaint.location}</span>
            </div>
            {complaint.affectedArea && (
              <span className="text-xs text-slate-400 block mt-1">Area: {complaint.affectedArea}</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium block mb-1">Linked Issue Cluster</span>
            {complaint.issueClusterId ? (
              <Link
                to={`/issues/${complaint.issueClusterId.publicIssueId || complaint.issueClusterId._id}`}
                className="flex items-center justify-between text-sm font-semibold text-emerald-400 hover:underline"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <Layers className="w-4 h-4 shrink-0" />
                  {complaint.issueClusterId.publicIssueId}
                </span>
                <span className="text-xs bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                  {complaint.issueClusterId.affectedCount || 1} affected
                </span>
              </Link>
            ) : (
              <span className="text-xs text-slate-400">Standalone report</span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-500 font-medium block mb-1">Contact Protocol</span>
            <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              {complaint.contactPreference || 'Anonymous In-App Thread'}
            </span>
          </div>
        </div>

        {/* Full Description */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Detailed Problem Description
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </p>
        </div>

        {/* AI Analysis Summary if present */}
        {complaint.aiAnalysis && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" /> AI Triage Summary:
            </div>
            <p className="text-slate-300">{complaint.aiAnalysis.summary}</p>
          </div>
        )}

        {/* Timeline Progress Tracking */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Live Resolution Pipeline
          </h3>
          <Timeline status={complaint.status} statusHistory={complaint.statusHistory} />
        </div>
      </div>

      {/* 2-Way Anonymous Communication Thread */}
      {complaint.contactPreference !== 'None' && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Direct Anonymous Conversation Thread
            </h3>
            <span className="text-xs text-emerald-400 font-mono">🔒 Verified Anonymous</span>
          </div>
          <MessageThread complaintId={complaint._id} currentUserRole={user?.role || 'student'} />
        </div>
      )}
    </div>
  );
};
