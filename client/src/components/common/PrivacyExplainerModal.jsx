import React from 'react';
import { ShieldCheck, Lock, Server, Check, X, AlertOctagon } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PrivacyExplainerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wine-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-cream-50 border border-cream-300 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-wine-500 hover:text-burgundy-800 hover:bg-cream-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white border border-cream-300 rounded-2xl shadow-sm">
            <BrandLogo className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-wine-900">Verified Anonymity Architecture</h3>
            <p className="text-xs text-burgundy-800 font-semibold">Dual-Layer Cryptographic Isolation</p>
          </div>
        </div>

        <p className="text-sm text-wine-800 mb-6 leading-relaxed">
          Traditional complaint portals force students to either expose their full identity or submit unverified spam reports. This platform implements a dual-layer cryptographic separation model.
        </p>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Traditional Systems */}
          <div className="p-4 rounded-2xl bg-white border border-burgundy-200 shadow-sm">
            <div className="flex items-center gap-2 text-burgundy-800 font-bold text-sm mb-3">
              <AlertOctagon className="w-4 h-4 text-burgundy-600" /> Traditional Portals
            </div>
            <ul className="space-y-2 text-xs text-wine-800">
              <li className="flex items-start gap-2 text-burgundy-900">
                <span className="text-burgundy-700 font-bold">✕</span> Admin sees student Name, Roll No & Email
              </li>
              <li className="flex items-start gap-2 text-burgundy-900">
                <span className="text-burgundy-700 font-bold">✕</span> Anonymity is just a CSS "hide name" checkbox
              </li>
              <li className="flex items-start gap-2 text-burgundy-900">
                <span className="text-burgundy-700 font-bold">✕</span> High risk of academic bias or retaliation
              </li>
              <li className="flex items-start gap-2 text-burgundy-900">
                <span className="text-burgundy-700 font-bold">✕</span> Unverified reports lead to spam and chaos
              </li>
            </ul>
          </div>

          {/* Platform Model */}
          <div className="p-4 rounded-2xl bg-peach-50 border border-peach-300 shadow-sm">
            <div className="flex items-center gap-2 text-burgundy-900 font-bold text-sm mb-3">
              <ShieldCheck className="w-4 h-4 text-peach-600" /> Platform Privacy Model
            </div>
            <ul className="space-y-2 text-xs text-wine-900">
              <li className="flex items-start gap-2 text-wine-900 font-medium">
                <Check className="w-4 h-4 text-peach-600 shrink-0 font-bold" /> Student is authenticated & verified
              </li>
              <li className="flex items-start gap-2 text-wine-900 font-medium">
                <Check className="w-4 h-4 text-peach-600 shrink-0 font-bold" /> Backend strips identity before sending to Admin
              </li>
              <li className="flex items-start gap-2 text-wine-900 font-medium">
                <Check className="w-4 h-4 text-peach-600 shrink-0 font-bold" /> Isolated mapping enables private tracking
              </li>
              <li className="flex items-start gap-2 text-wine-900 font-medium">
                <Check className="w-4 h-4 text-peach-600 shrink-0 font-bold" /> AI clusters issues without reading student data
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Data Flow */}
        <div className="bg-white p-4 rounded-2xl border border-cream-300 text-xs text-wine-700 mb-6 shadow-sm">
          <h5 className="font-bold text-wine-900 mb-2 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-burgundy-700" /> Technical Data Isolation Flow:
          </h5>
          <div className="font-mono space-y-1 text-[11px] text-wine-900 bg-cream-100 p-3 rounded-xl border border-cream-300">
            <div className="text-burgundy-900 font-semibold">1. [Student] Auth token verified ➔ `Complaint` stored with `publicComplaintId` (CV-XXXXXX)</div>
            <div className="text-burgundy-800">2. `ComplaintAccess` mapping saved separately in DB (No identity in Complaint)</div>
            <div className="text-wine-800">3. Admin APIs return only sanitized documents with badge `Verified Anonymous Student`</div>
            <div className="text-wine-700">4. AI API receives only raw problem text, never student identity</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 text-sm font-bold rounded-xl transition-all shadow-md shadow-burgundy-800/20"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
