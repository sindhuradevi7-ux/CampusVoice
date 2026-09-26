import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueAPI, complaintAPI, aiAPI } from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Search, 
  Compass, 
  Building2, 
  Cpu, 
  TrendingUp,
  FileText,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { PrivacyExplainerModal } from '../components/common/PrivacyExplainerModal';
import { useTheme } from '../context/ThemeContext';

export const LandingPage = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [featuredIssues, setFeaturedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live Track by Public ID feature state
  const [trackInputId, setTrackInputId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  // AI Live Triage Simulator state
  const [simText, setSimText] = useState('');
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const res = await issueAPI.getAllIssues({ sortBy: 'affectedCount' });
        if (res.data?.success) {
          setFeaturedIssues(res.data.issues.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading featured issues:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!trackInputId.trim()) return;

    try {
      setTrackingLoading(true);
      setTrackError('');
      setTrackingResult(null);
      const res = await complaintAPI.trackPublicly(trackInputId.trim());
      if (res.data?.success) {
        setTrackingResult(res.data.complaint);
      }
    } catch (err) {
      setTrackError(err.response?.data?.message || 'Complaint not found. Check your ID format (e.g. CV-A82F91).');
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleSimulateAI = async (text) => {
    const promptText = text || simText;
    if (!promptText || promptText.trim().length < 4) return;
    try {
      setSimLoading(true);
      const res = await aiAPI.analyzeComplaint({
        description: promptText,
        location: 'Campus General',
      });
      if (res.data?.success) {
        setSimResult(res.data.analysis);
      }
    } catch (e) {
      // NLP fallback handles automatically
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Foreground Content */}
      <div className="relative z-10 space-y-12 sm:space-y-20 pb-16 sm:pb-20 w-full max-w-full">
        {/* Hero Section */}
        <section className="relative pt-6 sm:pt-12 text-center overflow-hidden px-4 sm:px-6 w-full box-border">
          {/* Subtle Ambient Glows - Scaled safely on mobile */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] sm:max-w-[550px] h-[160px] sm:h-[300px] bg-gradient-to-tr from-peach-300/25 via-burgundy-700/8 to-transparent dark:from-burgundy-600/15 dark:via-peach-500/8 rounded-full blur-2xl sm:blur-3xl pointer-events-none -z-10"></div>

          <div className="max-w-4xl mx-auto w-full box-border">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-wine-900/90 backdrop-blur-md border border-peach-300/50 dark:border-peach-400/20 text-burgundy-900 dark:text-peach-200 text-[11px] sm:text-xs font-semibold shadow-xs mb-4 sm:mb-5 max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach-600 dark:text-peach-400 shrink-0" />
              <span className="truncate">Verified Anonymous Architecture Active</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-wine-950 dark:text-cream-50 leading-[1.2] sm:leading-[1.15] break-words">
              Speak up for your campus <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-peach-600 dark:from-peach-300 dark:via-peach-400 dark:to-peach-200 bg-clip-text text-transparent">
                Without fear or retaliation.
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-wine-800/85 dark:text-cream-200 max-w-2xl mx-auto leading-relaxed font-normal px-2">
              Our platform verifies you are an authenticated registered student, but completely isolates your personal identity from organization-facing systems. No name leaks, no social stigma—just actionable campus improvements.
            </p>
          </div>
        </section>

        {/* Feature Blocks: Quick Actions Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full box-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
            {/* Feature Block 1: Submit Reports Card */}
            <div className="bg-white/95 dark:bg-wine-900/95 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-peach-300/40 dark:border-peach-400/20 relative overflow-hidden flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all group w-full box-border">
              <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-peach-100/40 dark:bg-peach-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-peach-100/80 dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 border border-peach-300/50 dark:border-peach-400/30 flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
                  <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 text-peach-700 dark:text-peach-400" />
                </div>
                <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-burgundy-800 dark:text-peach-400">
                  Action Center
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-wine-900 dark:text-cream-50 mt-1 mb-2">
                  Submit an Anonymous Complaint
                </h3>
                <p className="text-xs sm:text-sm text-wine-700 dark:text-cream-300 leading-relaxed mb-5 font-normal">
                  Have you noticed poor Wi-Fi, broken lab equipment, hostel geyser failures, or canteen hygiene concerns? Report immediately with complete cryptographic anonymity.
                </p>

                {/* Category Quick Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                  {['Wi-Fi / Internet', 'Laboratory', 'Hostel', 'Food / Canteen', 'Classroom'].map((cat) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-lg sm:rounded-xl bg-cream-100/80 dark:bg-wine-950/80 border border-cream-300/80 dark:border-peach-400/20 text-[11px] text-wine-800 dark:text-cream-200 font-semibold"
                    >
                      #{cat}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/submit"
                className="inline-flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 btn-glass btn-glass-primary text-xs sm:text-sm shadow-warm"
              >
                <span>Launch Complaint Wizard</span>
                <ArrowRight className="w-4 h-4 text-peach-300" />
              </Link>
            </div>

            {/* Feature Block 2: Instant Public ID Tracker Card */}
            <div className="bg-white/95 dark:bg-wine-900/95 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-peach-300/40 dark:border-peach-400/20 relative overflow-hidden flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all w-full box-border">
              <div className="absolute top-0 right-0 w-28 sm:w-32 h-28 sm:h-32 bg-peach-100/30 dark:bg-burgundy-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cream-100/80 dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 border border-cream-300/80 dark:border-peach-400/30 flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-700 dark:text-peach-400" />
                </div>
                <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-wider text-burgundy-800 dark:text-peach-400">
                  Live Resolution Tracker
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-wine-900 dark:text-cream-50 mt-1 mb-2">
                  Track by Public Complaint ID
                </h3>
                <p className="text-xs sm:text-sm text-wine-700 dark:text-cream-300 leading-relaxed mb-4 font-normal">
                  Enter your public ID (e.g., <code className="text-burgundy-800 dark:text-peach-300 font-mono font-bold bg-peach-50 dark:bg-wine-950 px-1.5 py-0.5 rounded border border-peach-200 dark:border-peach-400/20">CV-A82F91</code>) to check live status, department assignment, and resolution history instantly.
                </p>

                {/* Tracker Form */}
                <form onSubmit={handleTrackSubmit} className="space-y-3 mb-2 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={trackInputId}
                      onChange={(e) => setTrackInputId(e.target.value)}
                      placeholder="Enter Complaint ID (e.g. CV-A82F91)"
                      className="w-full sm:flex-1 bg-cream-50/80 dark:bg-wine-950/80 border border-cream-300 dark:border-peach-400/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 focus:ring-1 focus:ring-burgundy-700 box-border"
                    />
                    <button
                      type="submit"
                      disabled={trackingLoading || !trackInputId.trim()}
                      className="w-full sm:w-auto px-5 py-2.5 btn-glass btn-glass-secondary text-xs sm:text-sm shrink-0"
                    >
                      {trackingLoading ? 'Checking...' : 'Track'}
                    </button>
                  </div>
                </form>

                {trackError && (
                  <div className="p-3 rounded-xl bg-burgundy-50 dark:bg-burgundy-950/80 border border-burgundy-200 dark:border-burgundy-800 text-burgundy-900 dark:text-peach-300 text-xs mb-3 font-medium break-words">
                    {trackError}
                  </div>
                )}

                {/* Instant Result Preview */}
                {trackingResult && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-cream-50 dark:bg-wine-950 border border-peach-300 dark:border-peach-400/30 text-xs space-y-2 animate-fadeIn shadow-xs w-full box-border">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-mono font-bold text-burgundy-800 dark:text-peach-300">{trackingResult.publicComplaintId}</span>
                      <StatusBadge status={trackingResult.status} />
                    </div>
                    <div className="text-wine-800 dark:text-cream-300 break-words">
                      <span className="text-wine-500 dark:text-cream-400 font-medium">Location:</span> {trackingResult.location}
                    </div>
                    {trackingResult.issueCluster && (
                      <div className="text-burgundy-900 dark:text-cream-100 font-semibold break-words">
                        <span className="text-wine-500 dark:text-cream-400 font-medium">Cluster:</span> {trackingResult.issueCluster.title}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Block 3: Interactive Real-Time AI Triage Simulator */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full box-border">
          <div className="bg-white dark:bg-wine-900 p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-cream-300 dark:border-peach-400/20 shadow-warm w-full box-border">
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6 w-full">
              <div>
                <div className="flex items-center gap-2 text-burgundy-800 dark:text-peach-400 text-xs font-extrabold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-peach-600 dark:text-peach-400 shrink-0" /> Real-Time Intelligence
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-wine-900 dark:text-cream-50">
                  Interactive AI Triage Simulator
                </h2>
                <p className="text-xs sm:text-sm text-wine-600 dark:text-cream-300 mt-1 font-medium">
                  See how the platform automatically classifies, tags, and evaluates grievances before routing.
                </p>
              </div>

              {/* Pre-made sample pill buttons */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const t = 'Wi-Fi connection drops in Computer Lab 3 back row.';
                    setSimText(t);
                    handleSimulateAI(t);
                  }}
                  className="px-2.5 xs:px-3 py-1.5 btn-glass btn-glass-subtle text-[11px] sm:text-xs flex-1 sm:flex-initial text-center"
                >
                  Sample 1: Lab Wi-Fi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = 'Hostel B second floor bathroom geyser is sparking.';
                    setSimText(t);
                    handleSimulateAI(t);
                  }}
                  className="px-2.5 xs:px-3 py-1.5 btn-glass btn-glass-secondary text-[11px] sm:text-xs flex-1 sm:flex-initial text-center"
                >
                  Sample 2: Hostel Geyser
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full">
              <div className="space-y-3 w-full">
                <textarea
                  rows={3}
                  value={simText}
                  onChange={(e) => setSimText(e.target.value)}
                  placeholder="Type a campus problem description here (e.g. Broken projector in Room 304)..."
                  className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 focus:ring-1 focus:ring-burgundy-700 box-border"
                />
                <button
                  type="button"
                  onClick={() => handleSimulateAI()}
                  disabled={simLoading || !simText.trim()}
                  className="w-full sm:w-auto px-5 sm:px-6 py-3 btn-glass btn-glass-primary text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-peach-300 shrink-0" />
                  <span>{simLoading ? 'Simulating Triage...' : 'Simulate AI Triage Analysis'}</span>
                </button>
              </div>

              {/* Simulator Output Display */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 flex flex-col justify-center w-full box-border">
                {simResult ? (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-wine-600 dark:text-cream-400">Predicted Category:</span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-peach-100 dark:bg-wine-900 text-burgundy-900 dark:text-peach-300 font-bold text-xs border border-peach-300 dark:border-peach-400/30">
                        {simResult.category}
                      </span>
                      <SeverityBadge severity={simResult.severity} />
                    </div>
                    <div className="text-xs text-wine-800 dark:text-cream-200 break-words">
                      <strong className="text-wine-600 dark:text-cream-400 font-bold">Routing Dept:</strong> {simResult.possibleDepartment}
                    </div>
                    <div className="text-xs text-wine-800 dark:text-cream-200 break-words">
                      <strong className="text-wine-600 dark:text-cream-400 font-bold">Concise Summary:</strong> {simResult.summary}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {simResult.keywords?.map((k, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-700 dark:text-cream-300 text-[11px] font-medium">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-wine-500 dark:text-cream-400 text-xs py-4 font-medium">
                    Type a problem on the left or click a sample to see live AI categorization.
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Verified Anonymity Visual Flow */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full box-border">
          <div className="bg-white dark:bg-wine-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-cream-300 dark:border-peach-400/20 shadow-warm w-full box-border">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-burgundy-800 dark:text-peach-400">
                The Fundamental Difference
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-wine-900 dark:text-cream-50 mt-1">
                Why Verified Anonymity Protects You
              </h2>
              <p className="text-xs sm:text-sm text-wine-600 dark:text-cream-300 mt-2 font-medium">
                Unlike normal complaint systems that merely hide names in the UI, our system decouples your identity inside the database and API layers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
              <div className="p-5 sm:p-6 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 relative shadow-sm w-full box-border">
                <div className="w-10 h-10 rounded-xl bg-peach-100 dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 flex items-center justify-center mb-3 sm:mb-4 border border-peach-300 dark:border-peach-400/30">
                  <ShieldCheck className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-wine-900 dark:text-cream-50 mb-1.5">1. Student Authentication</h3>
                <p className="text-xs text-wine-700 dark:text-cream-300 leading-relaxed">
                  You login using your university credentials. This guarantees zero spam or bot reports.
                </p>
                <div className="mt-4 pt-3 border-t border-cream-300 dark:border-peach-400/20 text-[11px] text-peach-800 dark:text-peach-300 font-bold font-mono">
                  ✓ Verified Genuine Student
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-peach-50 dark:bg-wine-950/80 border border-peach-300 dark:border-peach-400/20 relative shadow-sm w-full box-border">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 flex items-center justify-center mb-3 sm:mb-4 border border-peach-300 dark:border-peach-400/30 shadow-sm">
                  <Cpu className="w-5 h-5 text-peach-600 dark:text-peach-400" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-wine-900 dark:text-cream-50 mb-1.5">2. Identity Isolation & AI</h3>
                <p className="text-xs text-wine-700 dark:text-cream-300 leading-relaxed">
                  Backend strips Name, Roll No & Email. AI summarizes the problem and links it with duplicate issues.
                </p>
                <div className="mt-4 pt-3 border-t border-peach-200 dark:border-peach-400/20 text-[11px] text-burgundy-800 dark:text-peach-300 font-bold font-mono">
                  🔒 Public ID: CV-A82F91
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 relative shadow-sm w-full box-border">
                <div className="w-10 h-10 rounded-xl bg-burgundy-100 dark:bg-wine-800 text-burgundy-800 dark:text-peach-300 flex items-center justify-center mb-3 sm:mb-4 border border-burgundy-200 dark:border-peach-400/30">
                  <Building2 className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-wine-900 dark:text-cream-50 mb-1.5">3. Clean Admin Triage</h3>
                <p className="text-xs text-wine-700 dark:text-cream-300 leading-relaxed">
                  Staff sees the aggregated problem & affected student count without having any access to student identities.
                </p>
                <div className="mt-4 pt-3 border-t border-cream-300 dark:border-peach-400/20 text-[11px] text-burgundy-800 dark:text-peach-300 font-bold font-mono">
                  ✓ Verified Anonymous Student
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Active Issue Clusters */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full box-border">
          <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6 flex-col sm:flex-row w-full">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-burgundy-700 dark:text-peach-400 shrink-0" />
                Active Campus Issue Clusters
              </h3>
              <p className="text-xs text-wine-600 dark:text-cream-300 mt-0.5 font-medium">
                Live problems currently being tracked and resolved by campus administration
              </p>
            </div>

            <Link
              to="/issues"
              className="text-xs font-bold text-burgundy-800 dark:text-peach-300 hover:text-burgundy-900 dark:hover:text-peach-200 flex items-center gap-1 shrink-0"
            >
              Explore all issues <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
            {featuredIssues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue.publicIssueId || issue._id}`}
                className="bg-white dark:bg-wine-900 p-4 sm:p-5 rounded-2xl border border-cream-300 dark:border-peach-400/20 hover:border-burgundy-300 dark:hover:border-peach-400/40 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between w-full box-border"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-burgundy-800 dark:text-peach-300 bg-peach-50 dark:bg-wine-950 px-2 py-0.5 rounded-lg border border-peach-200 dark:border-peach-400/20">
                      {issue.publicIssueId}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>

                  <h4 className="text-sm font-bold text-wine-900 dark:text-cream-50 line-clamp-2 mb-2">
                    {issue.title}
                  </h4>

                  <p className="text-xs text-wine-600 dark:text-cream-300 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {issue.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-300 dark:border-peach-400/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-wine-700 dark:text-cream-300">
                    <Users className="w-3.5 h-3.5 text-peach-700 dark:text-peach-400 shrink-0" />
                    <span className="font-bold text-burgundy-900 dark:text-peach-300">{issue.affectedCount}</span>
                    <span className="text-wine-500 dark:text-cream-400 font-medium">affected</span>
                  </div>
                  <span className="text-wine-500 dark:text-cream-400 truncate max-w-[100px] font-medium">{issue.location}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Explainer Modal */}
        <PrivacyExplainerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};
