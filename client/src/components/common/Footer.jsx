import React from 'react';
import { ShieldCheck, Lock, Heart, Database, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-slate-100">CampusVoice Privacy Platform</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A privacy-preserving Verified Anonymous grievance resolution platform for universities. Verified accounts guarantee authenticity while zero personal identity is exposed to administrative personnel.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <Lock className="w-3 h-3" /> Zero Identity Leakage Guarantee Enabled
            </div>
          </div>

          {/* Privacy Architecture Details */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Privacy Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Decoupled User Isolation Mapping</li>
              <li>• AI Description Summarization</li>
              <li>• Duplicate Issue Clustering</li>
              <li>• Anonymous 2-Way Message Threads</li>
            </ul>
          </div>

          {/* Storage & Tech Specs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Infrastructure Specs
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>MongoDB Atlas (Lightweight Schema)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Node.js / Express / React / Tailwind</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusVoice. Designed for Verified Academic Freedom.</p>
          <p className="flex items-center gap-1">
            Application-level Verified Anonymity Model
          </p>
        </div>
      </div>
    </footer>
  );
};
