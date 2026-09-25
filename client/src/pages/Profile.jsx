import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  Mail, 
  BadgeAlert
} from 'lucide-react';
import { VerifiedAnonymousBadge } from '../components/common/StatusBadge';
import { PrivacyNoticeBanner } from '../components/common/PrivacyNoticeBanner';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-16">
      <PrivacyNoticeBanner />

      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-wine-800 space-y-6 shadow-warm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-300 dark:border-wine-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-burgundy-800 to-peach-500 flex items-center justify-center text-xl font-bold text-white shadow-warm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-wine-900 dark:text-cream-50 flex items-center gap-2">
                {user?.name}
              </h1>
              <p className="text-xs text-wine-600 dark:text-cream-300 capitalize font-medium">
                Role: {user?.role === 'admin' ? 'Campus Administration Staff' : 'Verified Registered Student'}
              </p>
            </div>
          </div>

          <VerifiedAnonymousBadge />
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Campus Email</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-wine-900 dark:text-cream-100">
              <Mail className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Student / Staff ID</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-wine-900 dark:text-cream-100">
              <BadgeAlert className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
              <span>{user?.studentId || 'ADM-OFFICIAL'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-wine-800 shadow-sm">
            <span className="text-xs text-wine-500 dark:text-peach-400 font-bold block mb-1">Verification Status</span>
            <span className="text-xs font-bold text-burgundy-800 dark:text-peach-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-peach-700 dark:text-peach-400" />
              Verified Authenticated
            </span>
          </div>
        </div>

        {/* Privacy Guarantees Audit Checklist */}
        <div className="p-5 rounded-2xl bg-peach-50 dark:bg-wine-950 border border-peach-200 dark:border-wine-700 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-burgundy-900 dark:text-peach-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-peach-700 dark:text-peach-400" /> Verified Anonymity Audit Report
          </h3>

          <div className="space-y-2 text-xs text-wine-800 dark:text-cream-200">
            <div className="flex items-start gap-2 text-wine-900 dark:text-cream-100 font-medium">
              <Check className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0 mt-0.5 font-bold" />
              <span>
                <strong className="text-burgundy-900 dark:text-peach-300 font-bold">Zero Name Exposure:</strong> Organization & Admin APIs never receive or query your name, student ID, or personal email address.
              </span>
            </div>
            <div className="flex items-start gap-2 text-wine-900 dark:text-cream-100 font-medium">
              <Check className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0 mt-0.5 font-bold" />
              <span>
                <strong className="text-burgundy-900 dark:text-peach-300 font-bold">Isolated Access Mapping:</strong> A decoupled internal access reference maps your complaints without linking in complaint documents.
              </span>
            </div>
            <div className="flex items-start gap-2 text-wine-900 dark:text-cream-100 font-medium">
              <Check className="w-4 h-4 text-peach-700 dark:text-peach-400 shrink-0 mt-0.5 font-bold" />
              <span>
                <strong className="text-burgundy-900 dark:text-peach-300 font-bold">AI Sanitization Layer:</strong> Complaint descriptions sent to the AI engine are scrubbed of any user-identifying metadata.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
