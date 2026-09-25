import React from 'react';
import { Lock, Database, Code2, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-cream-300 dark:border-peach-400/10 bg-cream-100/90 dark:bg-wine-950 mt-auto py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Mission */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-peach-100 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/20 text-burgundy-800 dark:text-peach-300 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-burgundy-700 dark:text-peach-400" />
              </div>
              <span className="font-bold text-base text-wine-900 dark:text-cream-50">
                Verified Anonymous Grievance & Resolution Platform
              </span>
            </div>
            <p className="text-xs text-wine-700 dark:text-cream-300 leading-relaxed max-w-md">
              A privacy-preserving resolution ecosystem for universities. Verified credentials authenticate student status while cryptographic separation guarantees zero personal identity is exposed to administrative personnel.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-burgundy-800 dark:text-peach-300 font-medium">
              <Lock className="w-3 h-3 text-peach-600 dark:text-peach-400" /> Cryptographic Identity Isolation Active
            </div>
          </div>

          {/* Privacy Architecture Details */}
          <div>
            <h4 className="text-xs font-bold text-wine-900 dark:text-cream-50 uppercase tracking-wider mb-3">
              Privacy Architecture
            </h4>
            <ul className="space-y-2 text-xs text-wine-700 dark:text-cream-300">
              <li>• Decoupled User Isolation Mapping</li>
              <li>• AI Description Summarization</li>
              <li>• Duplicate Issue Clustering</li>
              <li>• Anonymous 2-Way Message Threads</li>
            </ul>
          </div>

          {/* Storage & Tech Specs */}
          <div>
            <h4 className="text-xs font-bold text-wine-900 dark:text-cream-50 uppercase tracking-wider mb-3">
              Infrastructure Specs
            </h4>
            <div className="space-y-2.5 text-xs text-wine-700 dark:text-cream-300">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-burgundy-700 dark:text-peach-400" />
                <span>MongoDB Atlas (Lightweight Schema)</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-peach-600 dark:text-peach-400" />
                <span>Node.js / Express / React / Tailwind</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-cream-300 dark:border-peach-400/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wine-600 dark:text-cream-400">
          <p>© {new Date().getFullYear()} Verified Academic Issue Resolution Platform.</p>
          <p className="flex items-center gap-1">
            Application-Level Verified Anonymity System
          </p>
        </div>
      </div>
    </footer>
  );
};
