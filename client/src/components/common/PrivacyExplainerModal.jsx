import React from 'react';
import { ShieldCheck, Lock, Server, Check, X, AlertOctagon } from 'lucide-react';

export const PrivacyExplainerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-wine-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-cream-50 dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] box-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full text-wine-500 hover:text-burgundy-800 dark:text-cream-300 dark:hover:text-peach-300 hover:bg-cream-200 dark:hover:bg-wine-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3 mb-4 pr-8">
          <div className="p-2 sm:p-2.5 bg-peach-100 dark:bg-wine-800 border border-peach-300 dark:border-peach-400/20 rounded-xl sm:rounded-2xl shadow-sm text-burgundy-800 dark:text-peach-300 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-burgundy-700 dark:text-peach-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-wine-900 dark:text-cream-50">Verified Anonymity Architecture</h3>
            <p className="text-[11px] sm:text-xs text-burgundy-800 dark:text-peach-300 font-semibold">Dual-Layer Cryptographic Isolation</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-wine-800 dark:text-cream-200 mb-5 leading-relaxed">
          Traditional complaint portals force students to either expose their full identity or submit unverified spam reports. This platform implements a dual-layer cryptographic separation model.
        </p>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
          {/* Traditional Systems */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-wine-950 border border-burgundy-200 dark:border-burgundy-900 shadow-sm">
            <div className="flex items-center gap-2 text-burgundy-800 dark:text-peach-400 font-bold text-xs sm:text-sm mb-2.5">
              <AlertOctagon className="w-4 h-4 text-burgundy-600 dark:text-burgundy-400 shrink-0" /> Traditional Portals
            </div>
            <ul className="space-y-2 text-xs text-wine-800 dark:text-cream-300">
              <li className="flex items-start gap-1.5 text-burgundy-900 dark:text-peach-300">
                <span className="text-burgundy-700 dark:text-peach-400 font-bold shrink-0">✕</span> Admin sees student Name, Roll No & Email
              </li>
              <li className="flex items-start gap-1.5 text-burgundy-900 dark:text-peach-300">
                <span className="text-burgundy-700 dark:text-peach-400 font-bold shrink-0">✕</span> Anonymity is just a CSS "hide name" checkbox
              </li>
              <li className="flex items-start gap-1.5 text-burgundy-900 dark:text-peach-300">
                <span className="text-burgundy-700 dark:text-peach-400 font-bold shrink-0">✕</span> High risk of academic bias or retaliation
              </li>
              <li className="flex items-start gap-1.5 text-burgundy-900 dark:text-peach-300">
                <span className="text-burgundy-700 dark:text-peach-400 font-bold shrink-0">✕</span> Unverified reports lead to spam and chaos
              </li>
            </ul>
          </div>

          {/* Platform Model */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-peach-50 dark:bg-wine-950/80 border border-peach-300 dark:border-peach-400/30 shadow-sm">
            <div className="flex items-center gap-2 text-burgundy-900 dark:text-peach-300 font-bold text-xs sm:text-sm mb-2.5">
              <ShieldCheck className="w-4 h-4 text-peach-600 dark:text-peach-400 shrink-0" /> Platform Privacy Model
            </div>
            <ul className="space-y-2 text-xs text-wine-900 dark:text-cream-200">
              <li className="flex items-start gap-1.5 text-wine-900 dark:text-cream-100 font-medium">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach-600 dark:text-peach-400 shrink-0 font-bold mt-0.5" /> Student is authenticated & verified
              </li>
              <li className="flex items-start gap-1.5 text-wine-900 dark:text-cream-100 font-medium">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach-600 dark:text-peach-400 shrink-0 font-bold mt-0.5" /> Backend strips identity before sending to Admin
              </li>
              <li className="flex items-start gap-1.5 text-wine-900 dark:text-cream-100 font-medium">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach-600 dark:text-peach-400 shrink-0 font-bold mt-0.5" /> Isolated mapping enables private tracking
              </li>
              <li className="flex items-start gap-1.5 text-wine-900 dark:text-cream-100 font-medium">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-peach-600 dark:text-peach-400 shrink-0 font-bold mt-0.5" /> AI clusters issues without reading student data
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Data Flow */}
        <div className="bg-white dark:bg-wine-950 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-cream-300 dark:border-peach-400/20 text-xs text-wine-700 dark:text-cream-300 mb-5 shadow-sm">
          <h5 className="font-bold text-wine-900 dark:text-cream-50 mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" /> Technical Data Isolation Flow:
          </h5>
          <div className="font-mono space-y-1 text-[10px] sm:text-[11px] text-wine-900 dark:text-cream-100 bg-cream-100 dark:bg-wine-900 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-cream-300 dark:border-peach-400/20 break-words">
            <div className="text-burgundy-900 dark:text-peach-300 font-semibold">1. [Student] Auth token verified ➔ `Complaint` stored with `publicComplaintId` (CV-XXXXXX)</div>
            <div className="text-burgundy-800 dark:text-peach-200">2. `ComplaintAccess` mapping saved separately in DB</div>
            <div className="text-wine-800 dark:text-cream-200">3. Admin APIs return only sanitized documents with badge `Verified Anonymous Student`</div>
            <div className="text-wine-700 dark:text-cream-300">4. AI API receives only raw problem text, never student identity</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 btn-glass btn-glass-primary text-xs sm:text-sm shadow-warm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
