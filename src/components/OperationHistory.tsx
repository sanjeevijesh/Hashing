import React from 'react';
import type { HistoryItem } from '../types/hashing';
import { History, Trash2, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

interface OperationHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
}

export const OperationHistory: React.FC<OperationHistoryProps> = ({
  history,
  onClearHistory
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-800">
            Operation Audit Log
          </h4>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 transition-colors font-medium"
            title="Clear History Log"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Log list */}
      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[220px] font-mono text-xs pr-1">
        {history.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No operations logged yet. Run an insert or search to generate audit events.
          </div>
        ) : (
          history.map((item, index) => {
            const num = String(history.length - index).padStart(2, '0');

            let statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
            let statusBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200';

            if (item.status === 'COLLISION') {
              statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />;
              statusBadge = 'text-amber-700 bg-amber-50 border-amber-200';
            } else if (item.status === 'NOT_FOUND' || item.status === 'FULL') {
              statusIcon = <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />;
              statusBadge = 'text-rose-700 bg-rose-50 border-rose-200';
            } else if (item.status === 'RESET') {
              statusIcon = <RefreshCw className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />;
              statusBadge = 'text-indigo-700 bg-indigo-50 border-indigo-200';
            }

            return (
              <div
                key={item.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <span className="text-[10px] text-slate-400 font-bold select-none pt-0.5">
                  #{num}
                </span>

                <div className="mt-0.5">{statusIcon}</div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-[11px]">
                      {item.operation}
                    </span>
                    {item.key !== undefined && (
                      <span className="text-indigo-600 font-bold">
                        {item.key}
                      </span>
                    )}
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${statusBadge}`}>
                      {item.status}
                    </span>
                    {item.probes > 0 && (
                      <span className="text-[10px] text-slate-500 font-normal">
                        ({item.probes} probe{item.probes > 1 ? 's' : ''})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {item.message}
                  </p>
                </div>

                <span className="text-[9px] text-slate-400 whitespace-nowrap font-medium hidden xs:inline flex-shrink-0">
                  {item.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
