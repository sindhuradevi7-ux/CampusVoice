import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { issueAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  Building2, 
  Check, 
  Clock
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';

export const IssueDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const { showSuccess, showError } = useToast();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supporting, setSupporting] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        const res = await issueAPI.getIssueById(id);
        if (res.data?.success) {
          setIssue(res.data.issue);
        }
      } catch (err) {
        console.error('Failed to load issue details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleSupport = async () => {
    if (!isAuthenticated) {
      showError('Please log in with your verified student account to endorse this issue.');
      return;
    }
    if (!isStudent) {
      showError('Only verified students can endorse issues.');
      return;
    }

    try {
      setSupporting(true);
      const res = await issueAPI.supportIssue(issue._id || issue.publicIssueId);
      if (res.data?.success) {
        showSuccess('Your support has been added anonymously (+1)!');
        setIssue((prev) => ({
          ...prev,
          affectedCount: res.data.affectedCount,
          isSupportedByMe: true,
        }));
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to record support.');
    } finally {
      setSupporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-wine-500 dark:text-cream-400 font-medium">
        Loading campus issue cluster...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-wine-900 p-8 rounded-3xl border border-burgundy-200 dark:border-peach-400/20 shadow-warm">
          <h2 className="text-xl font-bold text-wine-900 dark:text-cream-50 mb-2">Issue Cluster Not Found</h2>
          <p className="text-sm text-wine-600 dark:text-cream-300 mb-6">Unable to find this issue cluster.</p>
          <Link
            to="/issues"
            className="btn-glass btn-glass-primary px-5 py-2.5 text-cream-50 rounded-xl text-xs font-bold"
          >
            Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/issues"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine-600 dark:text-cream-400 hover:text-burgundy-800 dark:hover:text-peach-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          Back to Issue Explorer
        </Link>
        <span className="text-xs text-burgundy-800 dark:text-peach-300 font-semibold font-mono">🔒 Aggregated Public View</span>
      </div>

      <PrivacyNoticeBanner />

      {/* Main Issue Header Card */}
      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-peach-400/20 shadow-warm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-peach-400/20 pb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-extrabold text-burgundy-900 dark:text-peach-300 bg-peach-50 dark:bg-wine-950 px-3 py-1 rounded-xl border border-peach-200 dark:border-peach-400/20">
                {issue.publicIssueId}
              </span>
              <StatusBadge status={issue.status} />
              <SeverityBadge severity={issue.severity} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-wine-900 dark:text-cream-50 mt-2">
              {issue.title}
            </h1>
          </div>

          {/* Support Action Button */}
          <div>
            {issue.status === 'Resolved' || issue.status === 'Closed' ? (
              <span className="px-4 py-2 bg-peach-100 dark:bg-wine-800 border border-peach-300 dark:border-peach-400/30 text-burgundy-900 dark:text-peach-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <Check className="w-4 h-4 text-peach-700 dark:text-peach-400" /> Resolved by Administration
              </span>
            ) : issue.isSupportedByMe ? (
              <span className="px-4 py-2 bg-peach-100 dark:bg-wine-800 border border-peach-300 dark:border-peach-400/30 text-burgundy-900 dark:text-peach-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
                <Check className="w-4 h-4 text-peach-700 dark:text-peach-400" /> Supported (+1)
              </span>
            ) : (
              <button
                onClick={handleSupport}
                disabled={supporting}
                className="btn-glass btn-glass-primary px-5 py-2.5 text-cream-50 rounded-xl text-xs font-bold shadow-warm flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-peach-300" />
                {supporting ? 'Saving...' : 'I am also affected (+1)'}
              </button>
            )}
          </div>
        </div>

        {/* Stats and metadata cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-cream-400 font-bold block mb-1">Affected Students</span>
            <div className="flex items-center gap-2 text-burgundy-900 dark:text-peach-300 text-lg font-bold">
              <Users className="w-5 h-5 text-peach-700 dark:text-peach-400" />
              <span>{issue.affectedCount} Verified Students</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-cream-400 font-bold block mb-1">Campus Location</span>
            <div className="flex items-center gap-2 text-wine-900 dark:text-cream-100 text-sm font-semibold truncate">
              <MapPin className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0" />
              <span className="truncate">{issue.location}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-cream-400 font-bold block mb-1">Assigned Department</span>
            <div className="flex items-center gap-2 text-burgundy-800 dark:text-peach-300 text-sm font-semibold truncate">
              <Building2 className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
              <span className="truncate">{issue.assignedDepartment}</span>
            </div>
          </div>
        </div>

        {/* Issue Summary */}
        <div className="p-5 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 shadow-sm">
          <h3 className="text-xs font-bold text-wine-700 dark:text-peach-400 uppercase tracking-wider mb-2">
            Issue Cluster Overview
          </h3>
          <p className="text-sm text-wine-900 dark:text-cream-200 leading-relaxed font-medium">
            {issue.summary}
          </p>

          {issue.keywords && issue.keywords.length > 0 && (
            <div className="mt-4 pt-3 border-t border-cream-300 dark:border-peach-400/20 flex flex-wrap gap-1.5">
              {issue.keywords.map((kw, i) => (
                <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-700 dark:text-cream-300 font-medium">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Resolution Timeline */}
        <div className="pt-4 border-t border-cream-300 dark:border-peach-400/20">
          <h3 className="text-sm font-bold text-wine-900 dark:text-cream-50 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
            Official Resolution Timeline
          </h3>
          <Timeline status={issue.status} statusHistory={issue.statusHistory} />
        </div>
      </div>
    </div>
  );
};
