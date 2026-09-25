import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { complaintAPI, aiAPI, issueAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  RefreshCw,
  Users
} from 'lucide-react';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';
import { StatusBadge } from '../components/common/StatusBadge';

const CATEGORIES = [
  'Infrastructure',
  'Wi-Fi / Internet',
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

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];

export const SubmitComplaint = () => {
  const [formData, setFormData] = useState({
    category: 'Wi-Fi / Internet',
    description: '',
    location: '',
    affectedArea: '',
    severity: 'Medium',
    contactPreference: 'Anonymous In-App Thread',
    preferredClusterId: null,
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [similarIssues, setSimilarIssues] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Run AI analysis & duplicate check on demand
  const handleRunAIAnalysis = async () => {
    if (!formData.description || formData.description.trim().length < 8) {
      showError('Please provide a descriptive explanation of the problem first.');
      return;
    }

    try {
      setAiLoading(true);
      setCheckingDuplicates(true);

      const [aiRes, dupRes] = await Promise.all([
        aiAPI.analyzeComplaint({
          description: formData.description,
          location: formData.location,
          category: formData.category,
          severity: formData.severity,
        }),
        aiAPI.checkRelatedIssues({
          description: formData.description,
          location: formData.location,
          category: formData.category,
        }),
      ]);

      if (aiRes.data?.success) {
        const analysis = aiRes.data.analysis;
        setAiSuggestion(analysis);
        // Auto-apply category and severity if suggested
        if (analysis.category && CATEGORIES.includes(analysis.category)) {
          setFormData((prev) => ({ ...prev, category: analysis.category, severity: analysis.severity || prev.severity }));
        }
        showSuccess('AI triage analysis completed.');
      }

      if (dupRes.data?.success) {
        setSimilarIssues(dupRes.data.matches || []);
      }
    } catch (err) {
      console.error('AI check error:', err);
      showError('Could not complete AI analysis at this moment.');
    } finally {
      setAiLoading(false);
      setCheckingDuplicates(false);
    }
  };

  const handleSupportInstead = async (clusterId) => {
    try {
      const res = await issueAPI.supportIssue(clusterId);
      if (res.data?.success) {
        showSuccess('Your support has been added to the existing campus issue cluster!');
        navigate(`/issues/${clusterId}`);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to record support.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.description || !formData.location) {
      showError('Please fill in category, location, and description.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await complaintAPI.submitComplaint(formData);
      if (res.data?.success) {
        setSubmittedComplaint(res.data.complaint);
        showSuccess('Verified Anonymous Complaint Submitted!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4 animate-fadeIn">
        <div className="bg-white dark:bg-wine-900 p-6 sm:p-10 rounded-3xl border border-peach-300 dark:border-peach-400/20 text-center shadow-warm-lg">
          <div className="w-16 h-16 bg-peach-100 dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-peach-300 dark:border-peach-400/30 shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-peach-700 dark:text-peach-400" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-wine-900 dark:text-cream-50 mb-1">
            Complaint Filed Anonymously!
          </h2>
          <p className="text-xs sm:text-sm text-wine-700 dark:text-cream-300 max-w-md mx-auto mb-6 font-medium">
            Your report is verified, cryptographically isolated, and entered into the campus triage pipeline.
          </p>

          {/* Public Tracking ID Card */}
          <div className="bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 p-5 rounded-2xl mb-6 text-left max-w-md mx-auto shadow-sm">
            <div className="flex items-center justify-between border-b border-cream-300 dark:border-peach-400/20 pb-3 mb-3">
              <span className="text-xs text-wine-600 dark:text-cream-400 font-bold">Public Complaint ID</span>
              <span className="font-mono text-base font-extrabold text-burgundy-900 dark:text-peach-300 bg-peach-100 dark:bg-wine-900 px-3 py-1 rounded-xl border border-peach-300 dark:border-peach-400/30">
                {submittedComplaint.publicComplaintId}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-wine-800 dark:text-cream-200">
              <div className="flex justify-between">
                <span className="text-wine-500 dark:text-cream-400 font-medium">Category:</span>
                <span className="font-bold text-wine-900 dark:text-cream-50">{submittedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wine-500 dark:text-cream-400 font-medium">Location:</span>
                <span className="font-bold text-wine-900 dark:text-cream-50">{submittedComplaint.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-wine-500 dark:text-cream-400 font-medium">Severity:</span>
                <span className="font-bold text-wine-900 dark:text-cream-50">{submittedComplaint.severity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-wine-500 dark:text-cream-400 font-medium">Initial Status:</span>
                <StatusBadge status={submittedComplaint.status} />
              </div>
              {submittedComplaint.issueClusterId && (
                <div className="flex justify-between pt-2 border-t border-cream-300 dark:border-peach-400/20 text-burgundy-900 dark:text-peach-300 font-semibold">
                  <span>Linked Issue Cluster:</span>
                  <span className="font-bold">{submittedComplaint.issueClusterId.publicIssueId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/complaints/${submittedComplaint.publicComplaintId}`}
              className="w-full sm:w-auto px-6 py-3 bg-burgundy-800 hover:bg-burgundy-900 dark:bg-burgundy-700 dark:hover:bg-burgundy-600 text-cream-50 text-sm font-bold rounded-xl shadow-warm flex items-center justify-center gap-2"
            >
              <span>Track Resolution & Timeline</span>
              <ArrowRight className="w-4 h-4 text-peach-300" />
            </Link>
            <button
              onClick={() => {
                setSubmittedComplaint(null);
                setFormData({
                  category: 'Wi-Fi / Internet',
                  description: '',
                  location: '',
                  affectedArea: '',
                  severity: 'Medium',
                  contactPreference: 'Anonymous In-App Thread',
                  preferredClusterId: null,
                });
                setAiSuggestion(null);
                setSimilarIssues([]);
              }}
              className="w-full sm:w-auto px-5 py-3 bg-cream-100 dark:bg-wine-950 hover:bg-cream-200 dark:hover:bg-wine-800 text-wine-900 dark:text-cream-100 text-sm font-bold rounded-xl border border-cream-300 dark:border-peach-400/20"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-6 pb-16">
      {/* Privacy Notice Header */}
      <PrivacyNoticeBanner />

      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-peach-400/20 shadow-warm">
        <div className="flex items-center justify-between border-b border-cream-300 dark:border-peach-400/20 pb-5 mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-burgundy-700 dark:text-peach-400" />
              File Verified Anonymous Complaint
            </h2>
            <p className="text-xs text-wine-600 dark:text-cream-300 mt-0.5 font-medium">
              Your identity is separated. Campus administrators will only see problem details.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunAIAnalysis}
            disabled={aiLoading || !formData.description.trim()}
            className="px-3.5 py-2 bg-peach-100 dark:bg-wine-800 hover:bg-peach-200 dark:hover:bg-wine-700 text-burgundy-950 dark:text-peach-200 border border-peach-300 dark:border-peach-400/30 disabled:opacity-40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 text-peach-700 dark:text-peach-400 ${aiLoading ? 'animate-spin' : ''}`} />
            {aiLoading ? 'Analyzing Text...' : 'AI Auto-Classify & Duplicate Check'}
          </button>
        </div>

        {/* AI Suggestions Box (if generated) */}
        {aiSuggestion && (
          <div className="mb-6 p-4 rounded-2xl bg-peach-50 dark:bg-wine-950 border border-peach-300 dark:border-peach-400/30 animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-burgundy-900 dark:text-peach-300 mb-2">
              <Sparkles className="w-4 h-4 text-peach-700 dark:text-peach-400" />
              AI Assistant Recommendations:
            </div>
            <p className="text-xs text-wine-800 dark:text-cream-200 mb-2 font-medium">
              <strong>Summary:</strong> {aiSuggestion.summary}
            </p>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-wine-900 text-burgundy-900 dark:text-peach-300 border border-peach-200 dark:border-peach-400/30 font-bold shadow-sm">
                Department: {aiSuggestion.possibleDepartment}
              </span>
              {aiSuggestion.keywords?.map((kw, i) => (
                <span key={i} className="px-2 py-1 rounded-lg bg-cream-100 dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-700 dark:text-cream-300 font-medium">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Duplicate / Related Issue Alert Card */}
        {similarIssues.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-peach-50 dark:bg-wine-950 border border-peach-300 dark:border-peach-400/30 animate-fadeIn shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-peach-200 dark:bg-wine-800 text-burgundy-900 dark:text-peach-300 rounded-xl shrink-0 mt-0.5">
                <Layers className="w-5 h-5 text-peach-700 dark:text-peach-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-burgundy-900 dark:text-peach-300 flex items-center gap-2">
                  Similar Active Campus Issue Detected!
                  <span className="text-[10px] px-2 py-0.5 rounded bg-peach-200 dark:bg-burgundy-900 text-burgundy-950 dark:text-peach-200 font-bold">
                    {similarIssues[0].confidence}% Match
                  </span>
                </h4>
                <p className="text-xs text-wine-700 dark:text-cream-300 mt-1 font-medium">
                  A cluster already exists matching your report. You can support it directly to boost its priority without creating duplicate records.
                </p>

                {/* Similar issue item */}
                <div className="mt-3 p-3.5 rounded-xl bg-white dark:bg-wine-900 border border-peach-200 dark:border-peach-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-burgundy-800 dark:text-peach-300 bg-peach-50 dark:bg-wine-950 px-2 py-0.5 rounded border border-peach-200 dark:border-peach-400/20">
                        {similarIssues[0].cluster.publicIssueId}
                      </span>
                      <StatusBadge status={similarIssues[0].cluster.status} />
                    </div>
                    <p className="text-xs font-bold text-wine-900 dark:text-cream-50">{similarIssues[0].cluster.title}</p>
                    <div className="flex items-center gap-2 text-[11px] text-wine-600 dark:text-cream-400 mt-1 font-medium">
                      <span>📍 {similarIssues[0].cluster.location}</span>
                      <span>•</span>
                      <span className="text-burgundy-800 dark:text-peach-300 font-bold">{similarIssues[0].cluster.affectedCount} students affected</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSupportInstead(similarIssues[0].cluster._id)}
                    className="px-4 py-2 bg-burgundy-800 hover:bg-burgundy-900 dark:bg-burgundy-700 dark:hover:bg-burgundy-600 text-cream-50 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-peach-300" />
                    Support This Issue Instead (+1)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
                Complaint Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
                Severity Level *
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                required
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
                Campus Location / Building *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Computer Lab 3, CS Block 2nd Floor"
                required
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
              />
            </div>

            {/* Affected Area (Optional) */}
            <div>
              <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
                Specific Area / Room / Wing (Optional)
              </label>
              <input
                type="text"
                value={formData.affectedArea}
                onChange={(e) => setFormData({ ...formData, affectedArea: e.target.value })}
                placeholder="e.g. Back row workstations 15 to 30"
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-wine-800 dark:text-cream-200">
                Detailed Problem Description *
              </label>
              <span className="text-[11px] text-wine-500 dark:text-cream-400 font-medium">
                {formData.description.length}/2000 chars
              </span>
            </div>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what is broken, how often it occurs, and how it impacts your studies or campus life..."
              maxLength={2000}
              required
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl p-3.5 text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400"
            />
          </div>

          {/* Contact Preference */}
          <div>
            <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
              Anonymous Communication Preference
            </label>
            <select
              value={formData.contactPreference}
              onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
              className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-sm text-wine-900 dark:text-cream-100 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 font-medium"
            >
              <option value="Anonymous In-App Thread">
                Anonymous In-App Thread (Admin can ask follow-ups without seeing my identity)
              </option>
              <option value="None">
                No Communication (Report only, no follow-up thread)
              </option>
            </select>
          </div>

          {/* Submission Button */}
          <div className="pt-4 border-t border-cream-300 dark:border-peach-400/20 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-burgundy-800 dark:text-peach-300 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-peach-600 dark:text-peach-400" />
              <span>Identity stripped before saving to organization database</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3.5 bg-burgundy-800 hover:bg-burgundy-900 dark:bg-burgundy-700 dark:hover:bg-burgundy-600 disabled:opacity-50 text-cream-50 text-sm font-bold rounded-xl shadow-warm flex items-center gap-2 transition-all"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-peach-300" />
                  <span>Encrypting & Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-peach-300" />
                  <span>Submit Verified Anonymous Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
