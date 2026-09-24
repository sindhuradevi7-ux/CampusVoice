import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueAPI, complaintAPI, aiAPI } from '../services/api';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  MessageSquare, 
  Search, 
  Compass, 
  Building2, 
  Cpu, 
  TrendingUp,
  BarChart2,
  FileText,
  PlusCircle,
  Clock,
  MapPin,
  Zap,
  Activity,
  Check,
  Flame,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { PrivacyExplainerModal } from '../components/common/PrivacyExplainerModal';

export const LandingPage = () => {
  const { isAuthenticated, isStudent, isAdmin } = useAuth();
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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-shield-glow">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Anonymous Architecture Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Speak up for your campus. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Without fear or retaliation.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CampusVoice verifies you are a registered student, but completely isolates your identity from organization-facing systems. No name leaks, no social stigma—just actionable campus improvements.
          </p>

          {/* Quick Primary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5 text-emerald-300" />
              Submit Anonymous Report
            </Link>

            <Link
              to="/issues"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Explore Campus Issues
            </Link>

            <Link
              to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/60 hover:bg-slate-800/80 text-sky-300 border border-sky-500/30 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4" />
              My Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Blocks: Quick Actions Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Block 1: Submit Reports Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                Action Center
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Submit an Anonymous Complaint
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Have you noticed poor Wi-Fi, broken lab equipment, hostel geyser failures, or canteen hygiene concerns? Report immediately with complete cryptographic anonymity.
              </p>

              {/* Category Quick Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Wi-Fi / Internet', 'Laboratory', 'Hostel', 'Food / Canteen', 'Classroom'].map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-medium"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Launch Complaint Wizard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature Block 2: Instant Public ID Tracker Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Live Resolution Tracker
              </span>
              <h3 className="text-xl font-bold text-white mt-1 mb-2">
                Track by Public Complaint ID
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Enter your public ID (e.g., <code className="text-indigo-300 font-mono">CV-A82F91</code>) to check live status, department assignment, and resolution history instantly.
              </p>

              {/* Tracker Form */}
              <form onSubmit={handleTrackSubmit} className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackInputId}
                    onChange={(e) => setTrackInputId(e.target.value)}
                    placeholder="Enter Complaint ID (e.g. CV-A82F91)"
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading || !trackInputId.trim()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-600/30 shrink-0"
                  >
                    {trackingLoading ? 'Checking...' : 'Track'}
                  </button>
                </div>
              </form>

              {trackError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs mb-3">
                  {trackError}
                </div>
              )}

              {/* Instant Result Preview */}
              {trackingResult && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 text-xs space-y-2 animate-fadeIn mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-300">{trackingResult.publicComplaintId}</span>
                    <StatusBadge status={trackingResult.status} />
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500">Location:</span> {trackingResult.location}
                  </div>
                  {trackingResult.issueCluster && (
                    <div className="text-emerald-400">
                      <span className="text-slate-500">Cluster:</span> {trackingResult.issueCluster.title}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>View All My Reports</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Block 3: Interactive Real-Time AI Triage Simulator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Real-Time Intelligence
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Interactive AI Triage Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                See how CampusVoice automatically classifies, tags, and evaluates grievances before routing.
              </p>
            </div>

            {/* Pre-made sample pill buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  const t = 'Wi-Fi connection drops in Computer Lab 3 back row.';
                  setSimText(t);
                  handleSimulateAI(t);
                }}
                className="px-3 py-1 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg text-xs text-indigo-300 transition-colors"
              >
                Sample 1: Lab Wi-Fi
              </button>
              <button
                onClick={() => {
                  const t = 'Hostel B second floor bathroom geyser is sparking.';
                  setSimText(t);
                  handleSimulateAI(t);
                }}
                className="px-3 py-1 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg text-xs text-emerald-300 transition-colors"
              >
                Sample 2: Hostel Geyser
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <textarea
                rows={3}
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                placeholder="Type a campus problem description here (e.g. Broken projector in Room 304)..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleSimulateAI()}
                disabled={simLoading || !simText.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                {simLoading ? 'Simulating Triage...' : 'Simulate AI Triage Analysis'}
              </button>
            </div>

            {/* Simulator Output Display */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-center">
              {simResult ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-400">Predicted Category:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                      {simResult.category}
                    </span>
                    <SeverityBadge severity={simResult.severity} />
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-400">Routing Dept:</strong> {simResult.possibleDepartment}
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong className="text-slate-400">Concise Summary:</strong> {simResult.summary}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {simResult.keywords?.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[11px]">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs py-4">
                  Type a problem on the left or click a sample to see live AI categorization.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Anonymity Visual Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              The Fundamental Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Why Verified Anonymity Protects You
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Unlike normal complaint systems that merely hide names in the UI, CampusVoice decouples your identity inside the database and API layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">1. Student Authentication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You login using your university credentials. This guarantees zero spam or bot reports.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                ✓ Verified Genuine Student
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">2. Identity Isolation & AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Backend strips Name, Roll No & Email. AI summarizes the problem and links it with duplicate issues.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-indigo-300 font-mono">
                🔒 Public ID: CV-A82F91
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">3. Clean Admin Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Staff sees the aggregated problem & affected student count without having any access to student identities.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-400 font-mono">
                ✓ Verified Anonymous Student
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Active Issue Clusters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Active Campus Issue Clusters
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live problems currently being tracked and resolved by campus administration
            </p>
          </div>

          <Link
            to="/issues"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Explore all issues <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredIssues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue.publicIssueId || issue._id}`}
              className="glass-panel p-5 rounded-2xl glass-panel-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-semibold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                    {issue.publicIssueId}
                  </span>
                  <StatusBadge status={issue.status} />
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-2 mb-2">
                  {issue.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {issue.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-emerald-300">{issue.affectedCount}</span>
                  <span className="text-slate-400">affected</span>
                </div>
                <span className="text-slate-400 truncate max-w-[100px]">{issue.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explainer Modal */}
      <PrivacyExplainerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
