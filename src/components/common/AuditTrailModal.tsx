import React from 'react';
import { useDMIS } from '../../context/DMISContext';
import { Clock, ShieldCheck, X, User, MapPin, Laptop } from 'lucide-react';

export const AuditTrailModal: React.FC = () => {
  const { auditModalOpen, closeAuditModal, currentAuditFilter, auditLogs } = useDMIS();

  if (!auditModalOpen) return null;

  // Filter logs if specific entity requested
  const filteredLogs = currentAuditFilter?.entityId
    ? auditLogs.filter(
        (log) =>
          log.entityId === currentAuditFilter.entityId ||
          (currentAuditFilter.entityType && log.entityType === currentAuditFilter.entityType)
      )
    : auditLogs;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-[#1A365D] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-slate-900 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Immutable Audit Trail & Workflow History</h3>
              <p className="text-xs text-slate-300">
                Entity: <span className="font-mono text-amber-300">{currentAuditFilter?.entityId || 'All Transactions'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeAuditModal}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Timeline */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No audit logs recorded for this entity yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-2.5 top-0.5 w-5 h-5 rounded-full bg-amber-500 border-4 border-white shadow-sm flex items-center justify-center"></div>

                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-[#1A365D]">{log.action}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                      <p className="italic">"{log.remarks}"</p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>{log.performedBy}</span>
                        <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                          {log.role}
                        </span>
                      </div>

                      {log.fromStatus && log.toStatus && (
                        <div className="text-[11px]">
                          <span className="text-slate-400">{log.fromStatus}</span>
                          <span className="mx-1 text-amber-600">➔</span>
                          <span className="font-semibold text-emerald-700">{log.toStatus}</span>
                        </div>
                      )}

                      {log.ipAddress && (
                        <div className="flex items-center gap-1 font-mono text-slate-400 text-[10px]">
                          <Laptop className="w-3 h-3" />
                          <span>IP: {log.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Compliant with IT Act 2000 & Rajasthan State Audit Framework</span>
          <button
            onClick={closeAuditModal}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
