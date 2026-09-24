import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Check, X, AlertOctagon } from 'lucide-react';

export const PrivacyExplainerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Verified Anonymity Architecture</h3>
            <p className="text-xs text-emerald-400 font-medium">CampusVoice Privacy Architecture</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Traditional complaint portals force students to either expose their full identity or submit unverified spam reports. CampusVoice implements a dual-layer cryptographic separation model.
        </p>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Traditional Systems */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-3">
              <AlertOctagon className="w-4 h-4" /> Traditional Portals
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 text-rose-300/80">
                <span className="text-rose-400 font-bold">✕</span> Admin sees student Name, Roll No & Email
              </li>
              <li className="flex items-start gap-2 text-rose-300/80">
                <span className="text-rose-400 font-bold">✕</span> Anonymity is just a CSS "hide name" checkbox
              </li>
              <li className="flex items-start gap-2 text-rose-300/80">
                <span className="text-rose-400 font-bold">✕</span> High risk of academic bias or retaliation
              </li>
              <li className="flex items-start gap-2 text-rose-300/80">
                <span className="text-rose-400 font-bold">✕</span> Unverified reports lead to spam and chaos
              </li>
            </ul>
          </div>

          {/* CampusVoice Model */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-3">
              <ShieldCheck className="w-4 h-4" /> CampusVoice Privacy Model
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Student is authenticated & verified
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Backend strips identity before sending to Admin
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Isolated mapping enables private tracking
              </li>
              <li className="flex items-start gap-2 text-emerald-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> AI clusters issues without reading student data
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Data Flow */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 mb-6">
          <h5 className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-400" /> Technical Data Isolation Flow:
          </h5>
          <div className="font-mono space-y-1 text-[11px] text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-semibold">1. [Student] Auth token verified ➔ `Complaint` stored with `publicComplaintId` (CV-XXXXXX)</div>
            <div className="text-indigo-400">2. `ComplaintAccess` mapping saved separately in DB (No identity in Complaint)</div>
            <div className="text-amber-400">3. Admin APIs return only sanitized documents with badge `Verified Anonymous Student`</div>
            <div className="text-sky-400">4. AI API receives only raw problem text, never student identity</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
