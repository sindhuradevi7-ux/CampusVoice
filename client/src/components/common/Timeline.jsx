import React from 'react';
import { CheckCircle2, Clock, HelpCircle, ArrowUpRight, Wrench, ShieldCheck, Check } from 'lucide-react';

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
      {/* Desktop/Tablet Horizontal Tracker (sm and above) */}
      <div className="hidden sm:block relative mb-8">
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-cream-200 -translate-y-1/2 z-0 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-peach-400 to-burgundy-800 -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
          style={{ width: `${(effectiveIndex / (STAGES.length - 1)) * 100}%` }}
        ></div>

        <div className="grid grid-cols-5 gap-2 relative z-10">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= effectiveIndex;
            const isCurrent = idx === effectiveIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCurrent
                      ? 'bg-burgundy-800 border-burgundy-600 text-cream-50 shadow-md shadow-burgundy-800/20 scale-110'
                      : isCompleted
                      ? 'bg-peach-100 border-peach-400 text-burgundy-800'
                      : 'bg-white border-cream-300 text-wine-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2.5 font-bold truncate max-w-full px-1 ${
                    isCurrent
                      ? 'text-burgundy-900 font-extrabold'
                      : isCompleted
                      ? 'text-peach-800'
                      : 'text-wine-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper (below sm screens) */}
      <div className="sm:hidden space-y-3 mb-6 bg-white p-4 rounded-2xl border border-cream-300 shadow-sm">
        <span className="text-[11px] font-bold text-wine-600 uppercase tracking-wider block mb-2">
          Current Progress Status:
        </span>
        <div className="space-y-2.5">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= effectiveIndex;
            const isCurrent = idx === effectiveIndex;
            const Icon = stage.icon;

            return (
              <div key={stage.key} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs shrink-0 ${
                    isCurrent
                      ? 'bg-burgundy-800 border-burgundy-700 text-cream-50 font-bold'
                      : isCompleted
                      ? 'bg-peach-100 border-peach-400 text-burgundy-800'
                      : 'bg-white border-cream-300 text-wine-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-burgundy-900 font-bold'
                        : isCompleted
                        ? 'text-wine-900'
                        : 'text-wine-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
                {isCurrent && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-burgundy-100 text-burgundy-900 font-bold border border-burgundy-200 shrink-0">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Status History Log */}
      <div className="mt-6 border-t border-cream-300 pt-5">
        <h4 className="text-xs uppercase tracking-wider font-bold text-wine-700 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-burgundy-700" />
          Official Status Log & Resolution History
        </h4>

        <div className="space-y-3 sm:space-y-4">
          {statusHistory.length > 0 ? (
            statusHistory.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 sm:gap-3 relative pl-1 sm:pl-2">
                {idx !== statusHistory.length - 1 && (
                  <div className="absolute left-[11px] sm:left-[13px] top-6 bottom-0 w-0.5 bg-cream-300"></div>
                )}
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-burgundy-700 border-2 border-white mt-1 shrink-0"></div>
                <div className="flex-1 bg-white border border-cream-300 rounded-xl p-3 sm:p-3.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded-lg border border-burgundy-200">
                      {item.status}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-wine-500">{formatDate(item.updatedAt)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-wine-800 mt-1 leading-relaxed">{item.note || 'Status updated by administration.'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-wine-500 italic">No historical status logs available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
