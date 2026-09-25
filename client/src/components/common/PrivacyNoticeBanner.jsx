import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const PrivacyNoticeBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-peach-50 via-cream-100 to-peach-100/60 border border-peach-300 p-4 sm:p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-peach-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start gap-3 sm:gap-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white text-burgundy-800 border border-peach-200 shadow-sm shrink-0">
          <ShieldCheck className="w-6 h-6 text-burgundy-700" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-sm sm:text-base font-bold text-wine-900 flex items-center gap-2">
              Verified Anonymity Guaranteed
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-peach-200 text-burgundy-900 border border-peach-300">
                Active
              </span>
            </h4>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-wine-600 hover:text-burgundy-800 font-semibold flex items-center gap-1 transition-colors"
            >
              {expanded ? 'Hide details' : 'How does this protect me?'}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-wine-800 mt-1 leading-relaxed">
            Your university account is verified to prevent spam, but <strong className="text-burgundy-800 font-bold">your name, email, and Student ID are stripped</strong> from the organization API and administrative views.
          </p>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-peach-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
              <div className="p-3 rounded-xl bg-white border border-peach-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-burgundy-800 font-bold mb-1">
                  <Lock className="w-3.5 h-3.5 text-peach-600" />
                  1. Zero Identity Leak
                </div>
                <p className="text-wine-700">
                  Staff & department heads only see "Verified Anonymous Student" and the public ID.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-peach-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-burgundy-800 font-bold mb-1">
                  <Info className="w-3.5 h-3.5 text-peach-600" />
                  2. AI Content Sanitization
                </div>
                <p className="text-wine-700">
                  AI summarization processes only problem descriptions and never your personal credentials.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-peach-200 shadow-sm">
                <div className="flex items-center gap-1.5 text-burgundy-800 font-bold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-peach-600" />
                  3. Encrypted Access Map
                </div>
                <p className="text-wine-700">
                  Private mapping allows you to track updates and reply anonymously without leaking identity.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
