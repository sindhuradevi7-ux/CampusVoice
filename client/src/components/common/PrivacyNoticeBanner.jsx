import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export const PrivacyNoticeBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-indigo-950/40 border border-emerald-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-start gap-3 sm:gap-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-sm sm:text-base font-semibold text-emerald-300 flex items-center gap-2">
              Verified Anonymity Guaranteed
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </h4>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              {expanded ? 'Hide details' : 'How does this protect me?'}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Your university account is verified to prevent spam, but <strong className="text-emerald-300 font-semibold">your name, email, and Student ID are stripped</strong> from the organization API and administrative views.
          </p>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  1. Zero Identity Leak
                </div>
                <p className="text-slate-400">
                  Staff & department heads only see "Verified Anonymous Student" and the public ID.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-indigo-400 font-medium mb-1">
                  <Info className="w-3.5 h-3.5" />
                  2. AI Content Sanitization
                </div>
                <p className="text-slate-400">
                  AI summarization processes only problem descriptions and never your personal credentials.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  3. Encrypted Access Map
                </div>
                <p className="text-slate-400">
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
