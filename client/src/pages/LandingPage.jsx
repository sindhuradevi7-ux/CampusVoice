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
  Sparkles,
  Lock
} from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { PrivacyExplainerModal } from '../components/common/PrivacyExplainerModal';

export const LandingPage = () => {
  const { isAuthenticated, isStudent } = useAuth();
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
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-peach-300/30 via-burgundy-700/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Prominent Open-Book Brand Mark */}
          <div className="inline-flex flex-col items-center mb-6">
            <div className="p-3 bg-white rounded-3xl border border-cream-300 shadow-warm mb-4 hover:shadow-warm-lg transition-shadow">
              <BrandLogo className="w-16 h-16 sm:w-20 sm:h-20" showGlow={true} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-50 border border-peach-300 text-burgundy-900 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-peach-700" />
              <span>Verified Anonymous Architecture Active</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-wine-900 leading-tight">
            Speak up for your campus. <br />
            <span className="bg-gradient-to-r from-burgundy-800 via-burgundy-700 to-peach-600 bg-clip-text text-transparent">
              Without fear or retaliation.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base md:text-lg text-wine-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Our platform verifies you are an authenticated registered student, but completely isolates your personal identity from organization-facing systems. No name leaks, no social stigma—just actionable campus improvements.
          </p>

          {/* Quick Primary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 font-bold rounded-2xl shadow-warm hover:shadow-warm-lg flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5 text-peach-300" />
              Submit Anonymous Report
            </Link>

            <Link
              to="/issues"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-cream-100 text-wine-900 border border-cream-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Compass className="w-4 h-4 text-burgundy-700" />
              Explore Campus Issues
            </Link>

            <Link
              to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
              className="w-full sm:w-auto px-6 py-3.5 bg-peach-50 hover:bg-peach-100 text-burgundy-900 border border-peach-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-peach-700" />
              My Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Blocks: Quick Actions Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Block 1: Submit Reports Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-peach-300 relative overflow-hidden flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100/50 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-peach-100 text-burgundy-800 border border-peach-300 flex items-center justify-center mb-4 shadow-sm">
                <PlusCircle className="w-6 h-6 text-peach-700" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-burgundy-800">
                Action Center
              </span>
              <h3 className="text-xl font-bold text-wine-900 mt-1 mb-2">
                Submit an Anonymous Complaint
              </h3>
              <p className="text-xs sm:text-sm text-wine-700 leading-relaxed mb-6">
                Have you noticed poor Wi-Fi, broken lab equipment, hostel geyser failures, or canteen hygiene concerns? Report immediately with complete cryptographic anonymity.
              </p>

              {/* Category Quick Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Wi-Fi / Internet', 'Laboratory', 'Hostel', 'Food / Canteen', 'Classroom'].map((cat) => (
                  <span
                    key={cat}
                    className="px-2.5 py-1 rounded-xl bg-cream-100 border border-cream-300 text-[11px] text-wine-800 font-semibold"
                  >
                    #{cat}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 text-xs sm:text-sm font-bold rounded-xl shadow-warm transition-all"
            >
              <span>Launch Complaint Wizard</span>
              <ArrowRight className="w-4 h-4 text-peach-300" />
            </Link>
          </div>

          {/* Feature Block 2: Instant Public ID Tracker Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 relative overflow-hidden flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-peach-100/30 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-cream-100 text-burgundy-800 border border-cream-300 flex items-center justify-center mb-4 shadow-sm">
                <Search className="w-6 h-6 text-burgundy-700" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-burgundy-800">
                Live Resolution Tracker
              </span>
              <h3 className="text-xl font-bold text-wine-900 mt-1 mb-2">
                Track by Public Complaint ID
              </h3>
              <p className="text-xs sm:text-sm text-wine-700 leading-relaxed mb-4">
                Enter your public ID (e.g., <code className="text-burgundy-800 font-mono font-bold bg-peach-50 px-1.5 py-0.5 rounded border border-peach-200">CV-A82F91</code>) to check live status, department assignment, and resolution history instantly.
              </p>

              {/* Tracker Form */}
              <form onSubmit={handleTrackSubmit} className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackInputId}
                    onChange={(e) => setTrackInputId(e.target.value)}
                    placeholder="Enter Complaint ID (e.g. CV-A82F91)"
                    className="flex-1 bg-cream-50 border border-cream-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading || !trackInputId.trim()}
                    className="px-5 py-2.5 bg-peach-200 hover:bg-peach-300 text-burgundy-950 disabled:opacity-50 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm shrink-0 border border-peach-400"
                  >
                    {trackingLoading ? 'Checking...' : 'Track'}
                  </button>
                </div>
              </form>

              {trackError && (
                <div className="p-3 rounded-xl bg-burgundy-50 border border-burgundy-200 text-burgundy-900 text-xs mb-3 font-medium">
                  {trackError}
                </div>
              )}

              {/* Instant Result Preview */}
              {trackingResult && (
                <div className="p-4 rounded-xl bg-cream-50 border border-peach-300 text-xs space-y-2 animate-fadeIn mb-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-burgundy-800">{trackingResult.publicComplaintId}</span>
                    <StatusBadge status={trackingResult.status} />
                  </div>
                  <div className="text-wine-800">
                    <span className="text-wine-500 font-medium">Location:</span> {trackingResult.location}
                  </div>
                  {trackingResult.issueCluster && (
                    <div className="text-burgundy-900 font-semibold">
                      <span className="text-wine-500 font-medium">Cluster:</span> {trackingResult.issueCluster.title}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-cream-100 hover:bg-cream-200 text-wine-900 text-xs sm:text-sm font-bold rounded-xl transition-colors border border-cream-300"
            >
              <FileText className="w-4 h-4 text-burgundy-700" />
              <span>View All My Reports</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Block 3: Interactive Real-Time AI Triage Simulator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cream-300 shadow-warm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-burgundy-800 text-xs font-extrabold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-peach-600" /> Real-Time Intelligence
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-wine-900">
                Interactive AI Triage Simulator
              </h2>
              <p className="text-xs sm:text-sm text-wine-600 mt-1 font-medium">
                See how the platform automatically classifies, tags, and evaluates grievances before routing.
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
                className="px-3 py-1 bg-cream-50 border border-cream-300 hover:border-burgundy-400 rounded-lg text-xs font-bold text-burgundy-800 transition-colors"
              >
                Sample 1: Lab Wi-Fi
              </button>
              <button
                onClick={() => {
                  const t = 'Hostel B second floor bathroom geyser is sparking.';
                  setSimText(t);
                  handleSimulateAI(t);
                }}
                className="px-3 py-1 bg-cream-50 border border-cream-300 hover:border-burgundy-400 rounded-lg text-xs font-bold text-peach-800 transition-colors"
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
                className="w-full bg-cream-50 border border-cream-300 rounded-2xl p-4 text-xs sm:text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
              />
              <button
                onClick={() => handleSimulateAI()}
                disabled={simLoading || !simText.trim()}
                className="px-5 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 disabled:opacity-50 text-cream-50 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-peach-300" />
                {simLoading ? 'Simulating Triage...' : 'Simulate AI Triage Analysis'}
              </button>
            </div>

            {/* Simulator Output Display */}
            <div className="p-5 rounded-2xl bg-cream-50 border border-cream-300 flex flex-col justify-center">
              {simResult ? (
                <div className="space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-wine-600">Predicted Category:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-peach-100 text-burgundy-900 font-bold text-xs border border-peach-300">
                      {simResult.category}
                    </span>
                    <SeverityBadge severity={simResult.severity} />
                  </div>
                  <div className="text-xs text-wine-800">
                    <strong className="text-wine-600 font-bold">Routing Dept:</strong> {simResult.possibleDepartment}
                  </div>
                  <div className="text-xs text-wine-800">
                    <strong className="text-wine-600 font-bold">Concise Summary:</strong> {simResult.summary}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {simResult.keywords?.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-white border border-cream-300 text-wine-700 text-[11px] font-medium">
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-wine-500 text-xs py-4 font-medium">
                  Type a problem on the left or click a sample to see live AI categorization.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Verified Anonymity Visual Flow */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-warm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-burgundy-800">
              The Fundamental Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-wine-900 mt-1">
              Why Verified Anonymity Protects You
            </h2>
            <p className="text-xs sm:text-sm text-wine-600 mt-2 font-medium">
              Unlike normal complaint systems that merely hide names in the UI, our system decouples your identity inside the database and API layers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-300 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-peach-100 text-burgundy-800 flex items-center justify-center mb-4 border border-peach-300">
                <ShieldCheck className="w-5 h-5 text-burgundy-700" />
              </div>
              <h3 className="text-base font-bold text-wine-900 mb-1.5">1. Student Authentication</h3>
              <p className="text-xs text-wine-700 leading-relaxed">
                You login using your university credentials. This guarantees zero spam or bot reports.
              </p>
              <div className="mt-4 pt-3 border-t border-cream-300 text-[11px] text-peach-800 font-bold font-mono">
                ✓ Verified Genuine Student
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-peach-50 border border-peach-300 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-white text-burgundy-800 flex items-center justify-center mb-4 border border-peach-300 shadow-sm">
                <Cpu className="w-5 h-5 text-peach-600" />
              </div>
              <h3 className="text-base font-bold text-wine-900 mb-1.5">2. Identity Isolation & AI</h3>
              <p className="text-xs text-wine-700 leading-relaxed">
                Backend strips Name, Roll No & Email. AI summarizes the problem and links it with duplicate issues.
              </p>
              <div className="mt-4 pt-3 border-t border-peach-200 text-[11px] text-burgundy-800 font-bold font-mono">
                🔒 Public ID: CV-A82F91
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cream-50 border border-cream-300 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-burgundy-100 text-burgundy-800 flex items-center justify-center mb-4 border border-burgundy-200">
                <Building2 className="w-5 h-5 text-burgundy-700" />
              </div>
              <h3 className="text-base font-bold text-wine-900 mb-1.5">3. Clean Admin Triage</h3>
              <p className="text-xs text-wine-700 leading-relaxed">
                Staff sees the aggregated problem & affected student count without having any access to student identities.
              </p>
              <div className="mt-4 pt-3 border-t border-cream-300 text-[11px] text-burgundy-800 font-bold font-mono">
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
            <h3 className="text-xl sm:text-2xl font-bold text-wine-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-burgundy-700" />
              Active Campus Issue Clusters
            </h3>
            <p className="text-xs text-wine-600 mt-0.5 font-medium">
              Live problems currently being tracked and resolved by campus administration
            </p>
          </div>

          <Link
            to="/issues"
            className="text-xs font-bold text-burgundy-800 hover:text-burgundy-900 flex items-center gap-1"
          >
            Explore all issues <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredIssues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue.publicIssueId || issue._id}`}
              className="bg-white p-5 rounded-2xl border border-cream-300 hover:border-burgundy-300 shadow-sm hover:shadow-warm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-burgundy-800 bg-peach-50 px-2 py-0.5 rounded-lg border border-peach-200">
                    {issue.publicIssueId}
                  </span>
                  <StatusBadge status={issue.status} />
                </div>

                <h4 className="text-sm font-bold text-wine-900 line-clamp-2 mb-2">
                  {issue.title}
                </h4>

                <p className="text-xs text-wine-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                  {issue.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-cream-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-wine-700">
                  <Users className="w-3.5 h-3.5 text-peach-700" />
                  <span className="font-bold text-burgundy-900">{issue.affectedCount}</span>
                  <span className="text-wine-500 font-medium">affected</span>
                </div>
                <span className="text-wine-500 truncate max-w-[100px] font-medium">{issue.location}</span>
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
