import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Flame, 
  Layers, 
  Users, 
  MapPin, 
  Building2,
  PieChart,
  ShieldCheck
} from 'lucide-react';

export const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getAnalytics();
        if (res.data?.success) {
          setAnalytics(res.data.analytics);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Generating campus operations analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-400">
        Analytics data is currently unavailable.
      </div>
    );
  }

  const categoryEntries = Object.entries(analytics.categoryDistribution || {}).sort(
    (a, b) => b[1] - a[1]
  );
  const maxCategoryCount = Math.max(...categoryEntries.map((e) => e[1]), 1);

  const deptEntries = Object.entries(analytics.departmentDistribution || {}).sort(
    (a, b) => b[1] - a[1]
  );
  const maxDeptCount = Math.max(...deptEntries.map((e) => e[1]), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            Campus Resolution & Triage Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated intelligence on recurring campus infrastructure and academic issues.
          </p>
        </div>

        <Link
          to="/admin"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          Back to Admin Hub
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{analytics.resolutionRate}%</div>
          <p className="text-[11px] text-slate-500 mt-1">Issues marked resolved or closed</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Affected Students</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-300">{analytics.totalAffectedStudents}</div>
          <p className="text-[11px] text-slate-500 mt-1">Cumulative student impact count</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Issue Clusters</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">{analytics.totalClusters}</div>
          <p className="text-[11px] text-slate-500 mt-1">Consolidated problem clusters</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Raw Reports</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-300">{analytics.totalComplaints}</div>
          <p className="text-[11px] text-slate-500 mt-1">Individual anonymous filings</p>
        </div>
      </div>

      {/* Main Charts & Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            Most Reported Problem Categories
          </h3>

          <div className="space-y-3 pt-2">
            {categoryEntries.map(([cat, count]) => {
              const pct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-indigo-300 font-bold">{count} clusters</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            Severity Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center">
              <span className="text-xs text-rose-300 font-semibold block mb-1">Critical</span>
              <span className="text-2xl font-extrabold text-rose-400">
                {analytics.severityDistribution?.Critical || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/30 text-center">
              <span className="text-xs text-orange-300 font-semibold block mb-1">High</span>
              <span className="text-2xl font-extrabold text-orange-400">
                {analytics.severityDistribution?.High || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center">
              <span className="text-xs text-amber-300 font-semibold block mb-1">Medium</span>
              <span className="text-2xl font-extrabold text-amber-300">
                {analytics.severityDistribution?.Medium || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Low</span>
              <span className="text-2xl font-extrabold text-slate-300">
                {analytics.severityDistribution?.Low || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Affected Locations Hotspots */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            Top Affected Campus Locations
          </h3>

          <div className="space-y-2.5 pt-2">
            {analytics.topLocations?.map((loc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-400">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-200">{loc.location}</span>
                </div>
                <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  {loc.count} affected
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Workload Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            Assigned Department Workload
          </h3>

          <div className="space-y-3 pt-2">
            {deptEntries.map(([dept, count]) => {
              const pct = Math.round((count / maxDeptCount) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300 truncate max-w-[240px]">{dept}</span>
                    <span className="text-purple-300 font-bold">{count} issues</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
