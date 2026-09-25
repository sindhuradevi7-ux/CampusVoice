import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  ArrowUpRight, 
  HelpCircle,
  Lock
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-peach-100 text-peach-900 border border-peach-300 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-peach-700" />
          Submitted
        </span>
      );
    case 'Under Review':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-peach-50 text-wine-800 border border-peach-200 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-peach-600" />
          Under Review
        </span>
      );
    case 'Assigned':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-burgundy-50 text-burgundy-800 border border-burgundy-200 shadow-sm">
          <ArrowUpRight className="w-3.5 h-3.5 text-burgundy-700" />
          Assigned
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-peach-200/70 text-burgundy-900 border border-peach-400 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-peach-600"></span>
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-burgundy-800 text-cream-50 border border-burgundy-900 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-peach-300" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-200 text-wine-700 border border-cream-300 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-wine-500" />
          Closed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-200 text-wine-800 border border-cream-300">
          {status || 'Unknown'}
        </span>
      );
  }
};

export const SeverityBadge = ({ severity }) => {
  switch (severity) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-burgundy-100 text-burgundy-900 border border-burgundy-300">
          <Flame className="w-3 h-3 text-burgundy-700" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-peach-200 text-burgundy-900 border border-peach-400">
          <ShieldAlert className="w-3 h-3 text-peach-700" />
          High
        </span>
      );
    case 'Medium':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-peach-100 text-wine-800 border border-peach-200">
          <AlertTriangle className="w-3 h-3 text-peach-600" />
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-cream-200 text-wine-700 border border-cream-300">
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-cream-200 text-wine-700">
          {severity || 'Medium'}
        </span>
      );
  }
};

export const VerifiedAnonymousBadge = ({ className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-peach-50 border border-peach-300 text-burgundy-900 text-xs font-bold tracking-wide shadow-sm ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-peach-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-peach-500"></span>
      </span>
      <Lock className="w-3 h-3 text-burgundy-700" />
      <span>Verified Anonymous Student</span>
    </div>
  );
};
