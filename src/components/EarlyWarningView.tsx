import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  UserCheck, 
  Wrench, 
  CalendarX, 
  GitFork,
  CheckCircle2,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import { EarlyWarningAlert, RecommendedAction } from '../types/hospital';

interface EarlyWarningViewProps {
  alerts: EarlyWarningAlert[];
  onExecuteAction: (alertId: string, actionId: string) => void;
}

export const EarlyWarningView: React.FC<EarlyWarningViewProps> = ({
  alerts,
  onExecuteAction
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || 'alert-1');
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];

  const handleAction = (alertId: string, action: RecommendedAction) => {
    onExecuteAction(alertId, action.id);
    setNotificationToast(`Executed: ${action.title} — Notification dispatched to hospital teams.`);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const getCategoryIcon = (category: RecommendedAction['category']) => {
    switch (category) {
      case 'DISCHARGE':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'PREPARE_BEDS':
        return <Wrench className="w-4 h-4 text-teal-600" />;
      case 'REVIEW_ELECTIVE':
        return <CalendarX className="w-4 h-4 text-amber-600" />;
      case 'STEP_DOWN':
        return <GitFork className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-400 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                PROACTIVE SURGE EARLY-WARNING SYSTEM
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">Arogya AI Prevention</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Preventing Hospital Bed Crises Before Physical Saturation
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Arogya AI detects impending bed deficits 9 to 14 hours in advance by modeling inbound emergency ambulance trajectory, clinical turnaround latency, and surgical scheduling queues.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">CURRENT LEAD TIME</span>
              <span className="text-amber-700 font-bold text-sm">14 Hours Advance Notice</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div>
              <span className="text-slate-500 block text-[10px]">DECISION MODE</span>
              <span className="text-emerald-700 font-bold text-sm">Human-in-the-Loop</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Grid & Active Alert Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alert List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
            <span>PRIORITIZED SHORTAGE ALERTS</span>
            <span className="font-bold">{alerts.length} ACTIVE</span>
          </div>

          <div className="space-y-2.5">
            {alerts.map((alert) => {
              const isSelected = alert.id === selectedAlertId;
              const isCrit = alert.severity === 'CRITICAL';
              const isWarn = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : isCrit
                      ? 'bg-white border-rose-200 hover:border-rose-400'
                      : isWarn
                      ? 'bg-white border-amber-200 hover:border-amber-400'
                      : 'bg-white border-emerald-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className={`font-bold flex items-center gap-1.5 ${
                      isCrit ? 'text-rose-700' : isWarn ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isCrit ? 'bg-rose-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}></span>
                      {alert.severity}
                    </span>
                    <span className="text-slate-500">{alert.timeframe}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {alert.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{alert.ward}</span>
                    <span className="text-emerald-700 font-bold">{alert.actions.length} Recommendations</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Alert Deep Dive & AI Recommended Actions (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {selectedAlert && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              {/* Alert Header Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-slate-50 to-rose-50 border border-rose-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700">
                      {selectedAlert.severity} EARLY-WARNING NOTIFICATION
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-bold">
                    ETA: {selectedAlert.timeframe}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {selectedAlert.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedAlert.description}
                </p>

                {/* Key Numbers Telemetry Strip */}
                <div className="mt-4 pt-3 border-t border-rose-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">CURRENT OCCUPANCY</span>
                    <span className="text-rose-700 font-bold text-sm">{selectedAlert.currentOccupancyPct}% (Near Max)</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">PROJECTED OCCUPANCY</span>
                    <span className="text-rose-700 font-bold text-sm">{selectedAlert.projectedOccupancyPct}% (Breach)</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">EXPECTED ADMISSIONS</span>
                    <span className="text-emerald-700 font-bold text-sm">+{selectedAlert.expectedAdmissions} Patients</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
                    <span className="text-slate-500 block text-[10px]">EXPECTED DISCHARGES</span>
                    <span className="text-emerald-700 font-bold text-sm">-{selectedAlert.expectedDischarges} Patients</span>
                  </div>
                </div>
              </div>

              {/* AI Recommended Actions Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-mono tracking-wide">
                        AI RECOMMENDED PREPARATION ACTIONS
                      </h4>
                      <p className="text-xs text-slate-500">
                        Human-in-the-loop decision support for authorized hospital staff
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                    Recommend, not dictate
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedAlert.actions.map((act, index) => {
                    const isExecuted = act.status === 'EXECUTED';
                    return (
                      <div
                        key={act.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isExecuted
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-mono font-bold text-emerald-700 shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-mono text-xs">
                                {getCategoryIcon(act.category)}
                                <span className="font-bold text-slate-900 text-sm">
                                  {act.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1">
                                {act.description}
                              </p>
                              <div className="mt-2 text-[11px] font-mono text-emerald-700 flex items-center gap-1.5 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>Estimated Impact: <strong>{act.impactDescription}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 sm:self-center">
                            {isExecuted ? (
                              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 font-bold bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-300">
                                <CheckCircle className="w-4 h-4" />
                                <span>Action Dispatched</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAction(selectedAlert.id, act)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors shadow-sm flex items-center gap-1.5"
                              >
                                <span>{act.actionLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Governance Footnote */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-800">Clinical Protocol:</strong> Arogya AI recommendations preserve full physician supervisory autonomy. All dispatch orders require confirmation by the shift clinical bed coordinator.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
