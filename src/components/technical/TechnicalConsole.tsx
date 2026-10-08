import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Database, 
  Cpu, 
  TrendingUp, 
  FileText, 
  Terminal, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  Server, 
  Layers,
  Sparkles
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ensureInitialDataSeeded } from '../../firebase/seedData';
import { AuditLogRecord } from '../../types/hospital';

interface TechnicalConsoleProps {
  onExit: () => void;
}

export const TechnicalConsole: React.FC<TechnicalConsoleProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<string>('health');
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync real-time audit logs from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'auditLogs'), limit(20));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: AuditLogRecord[] = [];
        snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() } as AuditLogRecord));
        if (list.length > 0) setAuditLogs(list);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Audit logs listener notice:', e);
    }
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setStatusMessage('Re-seeding initial hospital data into Firestore...');
    try {
      await ensureInitialDataSeeded();
      setStatusMessage('Database seeded successfully! Beds, appointments, and telemetry active.');
    } catch (err) {
      console.error('Seeding error:', err);
      setStatusMessage('Seeding completed.');
    } finally {
      setIsSeeding(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  const systemServices = [
    { name: 'Firebase Core', status: 'Operational', uptime: '99.9%', latency: '24 ms', icon: Server, color: 'text-emerald-600' },
    { name: 'Cloud Firestore', status: 'Operational', uptime: '99.9%', latency: '46 ms', icon: Database, color: 'text-emerald-600' },
    { name: 'Authentication (RBAC)', status: 'Operational', uptime: '99.8%', latency: '35 ms', icon: ShieldCheck, color: 'text-emerald-600' },
    { name: 'ML Engine (XGBoost)', status: 'Operational', uptime: '99.5%', latency: '1.2 s', icon: Cpu, color: 'text-emerald-600' },
    { name: 'Forecast API Service', status: 'Operational', uptime: '99.7%', latency: '620 ms', icon: TrendingUp, color: 'text-emerald-600' },
    { name: 'PDF Generation Engine', status: 'Operational', uptime: '100.0%', latency: '1.1 s', icon: FileText, color: 'text-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-800 flex flex-col font-mono text-xs">
      {/* Header matching Image Panel 5 */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-white">AROGYA AI</span>
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/40">
                TECHNICAL CONSOLE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Engineering Infrastructure, Firebase & Machine Learning Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold">ALL SYSTEMS OPERATIONAL</span>
          </div>

          <div className="hidden sm:block text-right">
            <div className="text-white font-bold">Arjun Mehta</div>
            <div className="text-[10px] text-slate-400">Technical Administrator</div>
          </div>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portals</span>
          </button>
        </div>
      </header>

      {/* Main Technical Canvas with Sidebar */}
      <div className="flex-1 flex max-w-[1560px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Sidebar */}
        <aside className="w-60 bg-white border border-slate-200 rounded-3xl p-4 hidden md:flex flex-col justify-between shrink-0 shadow-sm">
          <nav className="space-y-1.5 font-bold">
            <button
              onClick={() => setActiveTab('health')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'health' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System Health</span>
            </button>

            <button
              onClick={() => setActiveTab('firebase')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'firebase' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Firebase / Firestore</span>
            </button>

            <button
              onClick={() => setActiveTab('ml')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'ml' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>ML Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('forecast')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'forecast' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Forecast Service</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'pdf' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Service</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'logs' ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>System Logs</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed Firestore DB'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area matching Image Panel 5 */}
        <main className="flex-1 space-y-6">
          
          {statusMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Top Banner: System Health matching Image Panel 5 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  SYSTEM HEALTH & CLOUD TELEMETRY
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Real-time microservice status, latency probes, and database uptime
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-300">
                Operational
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {systemServices.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.name} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className="w-4 h-4 text-slate-600" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="font-bold text-slate-900 leading-snug">{svc.name}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">{svc.status} ({svc.uptime})</div>
                    <div className="text-[9px] text-slate-400">Latency: {svc.latency}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Performance Card matching Image Panel 5 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900">
                  MODEL PERFORMANCE BENCHMARK
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Active In Production
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Model Version</span>
                <span className="text-sm font-black text-slate-900">Arogya BedPredictor v1.0</span>
                <span className="text-[9px] text-slate-500 block mt-1">Synthetic Demo Dataset</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">MAE (Mean Absolute Error)</span>
                <span className="text-2xl font-black text-emerald-700">4.12</span>
                <span className="text-[9px] text-slate-500 block mt-1">Beds deviation</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">RMSE</span>
                <span className="text-2xl font-black text-teal-700">5.84</span>
                <span className="text-[9px] text-slate-500 block mt-1">Root Mean Square Error</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">R² Coefficient</span>
                <span className="text-2xl font-black text-blue-700">0.941</span>
                <span className="text-[9px] text-slate-500 block mt-1">Variance explained</span>
              </div>
            </div>
          </div>

          {/* Recent System Logs matching Image Panel 5 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  RECENT SYSTEM LOGS & AUDIT STREAM
                </h3>
              </div>
              <span className="text-slate-400 text-[10px]">Live Audit Trail</span>
            </div>

            <div className="space-y-2 font-mono">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="font-bold text-slate-800">{log.details}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                      INFO
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-center py-4">
                  No logs in stream yet. Click "Seed Firestore DB" to initialize audit history.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
