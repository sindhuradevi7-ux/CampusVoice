import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { issueAPI } from '../services/api';
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
  ChevronRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { PrivacyExplainerModal } from '../components/common/PrivacyExplainerModal';

export const LandingPage = () => {
  const { isAuthenticated, isStudent, isAdmin, login } = useAuth();
  const [featuredIssues, setFeaturedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const res = await issueAPI.getAllIssues({ sortBy: 'affectedCount' });
        if (res.data?.success) {
          setFeaturedIssues(res.data.issues.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading featured issues:', err);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 text-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-emerald-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-shield-glow">
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

          {/* Quick Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {isAuthenticated ? (
              isStudent ? (
                <Link
                  to="/submit"
                  className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                  Submit Anonymous Complaint
                </Link>
              ) : (
                <Link
                  to="/admin"
                  className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Building2 className="w-5 h-5" />
                  Go to Admin Hub
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4" />
                  Get Verified Account
                </Link>
                <Link
                  to="/issues"
                  className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Compass className="w-4 h-4 text-indigo-400" />
                  Explore Active Issues
                </Link>
              </>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3.5 text-xs text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How Anonymity Works
            </button>
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
            {/* Step 1 */}
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

            {/* Step 2 */}
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

            {/* Step 3 */}
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

      {/* Key Innovation Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            Core Differentiators
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Smart Resolution Innovations
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel-hover">
            <Cpu className="w-6 h-6 text-indigo-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">AI Classification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-suggests category, severity, and department routing from problem descriptions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel-hover">
            <Layers className="w-6 h-6 text-emerald-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">Duplicate Issue Clusters</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consolidates multiple reports into high-impact clusters to highlight scale of problem.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel-hover">
            <Users className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">"I Am Also Affected"</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click community support increments issue count without creating redundant complaints.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel-hover">
            <MessageSquare className="w-6 h-6 text-sky-400 mb-3" />
            <h4 className="text-sm font-bold text-white mb-1">2-Way Anonymous Threads</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Admins can ask for clarifications and students reply securely without uncovering identities.
            </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                <span className="text-slate-400 truncate max-w-[120px]">{issue.location}</span>
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
