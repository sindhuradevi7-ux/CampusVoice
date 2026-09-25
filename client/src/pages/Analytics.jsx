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
  PieChart
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-wine-500 dark:text-cream-300 font-medium">
        Generating campus operations analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center text-wine-500 dark:text-cream-300 font-medium">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-wine-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-burgundy-700 dark:text-peach-400" />
            Campus Resolution & Triage Analytics
          </h1>
          <p className="text-xs sm:text-sm text-wine-600 dark:text-cream-300 mt-1 font-medium">
            Aggregated intelligence on recurring campus infrastructure and academic issues.
          </p>
        </div>

        <Link
          to="/admin"
          className="px-4 py-2 bg-cream-100 dark:bg-wine-900 hover:bg-cream-200 dark:hover:bg-wine-800 text-wine-900 dark:text-cream-100 border border-cream-300 dark:border-wine-700 rounded-xl text-xs font-bold"
        >
          Back to Admin Hub
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-800 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-300 text-xs font-bold mb-2">
            <span>Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          </div>
          <div className="text-3xl font-extrabold text-burgundy-900 dark:text-peach-300">{analytics.resolutionRate}%</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Issues marked resolved or closed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-800 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-300 text-xs font-bold mb-2">
            <span>Total Affected Students</span>
            <Users className="w-4 h-4 text-peach-700 dark:text-peach-400" />
          </div>
          <div className="text-3xl font-extrabold text-burgundy-800 dark:text-peach-200">{analytics.totalAffectedStudents}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Cumulative student impact count</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-800 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-300 text-xs font-bold mb-2">
            <span>Issue Clusters</span>
            <Layers className="w-4 h-4 text-peach-600 dark:text-peach-400" />
          </div>
          <div className="text-3xl font-extrabold text-wine-900 dark:text-cream-50">{analytics.totalClusters}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Consolidated problem clusters</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-wine-800 shadow-sm">
          <div className="flex items-center justify-between text-wine-600 dark:text-cream-300 text-xs font-bold mb-2">
            <span>Total Raw Reports</span>
            <TrendingUp className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
          </div>
          <div className="text-3xl font-extrabold text-burgundy-900 dark:text-peach-300">{analytics.totalComplaints}</div>
          <p className="text-[11px] text-wine-500 dark:text-cream-400 mt-1 font-medium">Individual anonymous filings</p>
        </div>
      </div>

      {/* Main Charts & Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution Bar Chart */}
        <div className="bg-white dark:bg-wine-900 p-6 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-4">
          <h3 className="text-base font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
            Most Reported Problem Categories
          </h3>

          <div className="space-y-3 pt-2">
            {categoryEntries.map(([cat, count]) => {
              const pct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-wine-800 dark:text-cream-200">{cat}</span>
                    <span className="text-burgundy-800 dark:text-peach-300 font-bold">{count} clusters</span>
                  </div>
                  <div className="w-full h-2.5 bg-cream-100 dark:bg-wine-950 rounded-full overflow-hidden border border-cream-300 dark:border-wine-800">
                    <div
                      className="h-full bg-gradient-to-r from-peach-400 to-burgundy-800 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white dark:bg-wine-900 p-6 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-4">
          <h3 className="text-base font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <Flame className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
            Severity Breakdown
          </h3>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-burgundy-50 dark:bg-wine-950 border border-burgundy-200 dark:border-wine-700 text-center shadow-sm">
              <span className="text-xs text-burgundy-900 dark:text-peach-300 font-bold block mb-1">Critical</span>
              <span className="text-2xl font-extrabold text-burgundy-800 dark:text-peach-200">
                {analytics.severityDistribution?.Critical || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-peach-100 dark:bg-wine-950 border border-peach-300 dark:border-wine-700 text-center shadow-sm">
              <span className="text-xs text-burgundy-900 dark:text-peach-300 font-bold block mb-1">High</span>
              <span className="text-2xl font-extrabold text-peach-900 dark:text-peach-200">
                {analytics.severityDistribution?.High || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-peach-50 dark:bg-wine-950 border border-peach-200 dark:border-wine-700 text-center shadow-sm">
              <span className="text-xs text-wine-700 dark:text-cream-300 font-bold block mb-1">Medium</span>
              <span className="text-2xl font-extrabold text-peach-800 dark:text-peach-300">
                {analytics.severityDistribution?.Medium || 0}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cream-100 dark:bg-wine-950 border border-cream-300 dark:border-wine-700 text-center shadow-sm">
              <span className="text-xs text-wine-600 dark:text-cream-400 font-bold block mb-1">Low</span>
              <span className="text-2xl font-extrabold text-wine-900 dark:text-cream-100">
                {analytics.severityDistribution?.Low || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Affected Locations Hotspots */}
        <div className="bg-white dark:bg-wine-900 p-6 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-4">
          <h3 className="text-base font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-peach-700 dark:text-peach-400" />
            Top Affected Campus Locations
          </h3>

          <div className="space-y-2.5 pt-2">
            {analytics.topLocations?.map((loc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 text-xs shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-peach-100 dark:bg-wine-800 text-burgundy-900 dark:text-peach-300 flex items-center justify-center font-bold text-[10px] border border-peach-300 dark:border-wine-700">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-wine-900 dark:text-cream-100">{loc.location}</span>
                </div>
                <span className="font-bold text-burgundy-900 dark:text-peach-200 bg-peach-100 dark:bg-wine-800 px-2 py-0.5 rounded-lg border border-peach-200 dark:border-wine-700">
                  {loc.count} affected
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Workload Distribution */}
        <div className="bg-white dark:bg-wine-900 p-6 rounded-3xl border border-cream-300 dark:border-wine-800 shadow-warm space-y-4">
          <h3 className="text-base font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
            Assigned Department Workload
          </h3>

          <div className="space-y-3 pt-2">
            {deptEntries.map(([dept, count]) => {
              const pct = Math.round((count / maxDeptCount) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-wine-800 dark:text-cream-200 truncate max-w-[240px]">{dept}</span>
                    <span className="text-burgundy-800 dark:text-peach-300 font-bold">{count} issues</span>
                  </div>
                  <div className="w-full h-2 bg-cream-100 dark:bg-wine-950 rounded-full overflow-hidden border border-cream-300 dark:border-wine-800">
                    <div
                      className="h-full bg-gradient-to-r from-peach-500 to-burgundy-800 rounded-full"
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
