import React from 'react';
import { CheckCircle2, Clock, HelpCircle, ArrowUpRight, Wrench, ShieldCheck } from 'lucide-react';

const STAGES = [
  { key: 'Submitted', label: 'Submitted', icon: Clock },
  { key: 'Under Review', label: 'Under Review', icon: HelpCircle },
  { key: 'Assigned', label: 'Assigned', icon: ArrowUpRight },
  { key: 'In Progress', label: 'In Progress', icon: Wrench },
  { key: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
];

export const Timeline = ({ status, statusHistory = [] }) => {
  const currentStageIndex = STAGES.findIndex((s) => s.key === status);
  const effectiveIndex = currentStageIndex === -1 ? (status === 'Closed' ? 4 : 0) : currentStageIndex;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full">
      {/* Horizontal Step Bar */}
      <div className="relative mb-8">
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
        <div
          className="hidden sm:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(effectiveIndex / (STAGES.length - 1)) * 100}%` }}
        ></div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= effectiveIndex;
            const isCurrent = idx === effectiveIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent
                      ? 'text-indigo-300 font-bold'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Status History Log */}
      <div className="mt-6 border-t border-slate-800/80 pt-5">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Official Status Log & Resolution History
        </h4>

        <div className="space-y-4">
          {statusHistory.length > 0 ? (
            statusHistory.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 relative pl-2">
                {idx !== statusHistory.length - 1 && (
                  <div className="absolute left-[13px] top-6 bottom-0 w-0.5 bg-slate-800"></div>
                )}
                <div className="w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900 mt-1 shrink-0"></div>
                <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(item.updatedAt)}</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-1">{item.note || 'Status updated by administration.'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No historical status logs available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
