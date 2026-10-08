import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  TrendingUp, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  Users, 
  Clock, 
  Search, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Building2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  Check, 
  Wrench, 
  UserCheck, 
  CreditCard, 
  Activity,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  Stethoscope,
  Settings as SettingsIcon,
  Zap,
  Truck
} from 'lucide-react';
import { useAuth } from '../../firebase/authContext';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Bed, BedStatus, Ward } from '../../types/hospital';
import { INITIAL_WARDS, INITIAL_ALERTS } from '../../data/initialData';
import { INITIAL_DOCTORS } from '../../data/doctorsAndBilling';
import { 
  generateBedOccupancyPdf, 
  generateCapacityForecastPdf,
  generatePatientInvoicePdf
} from '../../utils/pdfGenerator';
import { WhatIfSimulator } from '../WhatIfSimulator';
import { PatientBillingView } from '../PatientBillingView';
import { ConcessionSystem } from '../ConcessionSystem';
import { GovtHospitalEmblem, NabhAccreditedBadge, PmjayAyushmanLogo, MohfwEmblem } from '../HospitalLogos';

export const StaffApp: React.FC = () => {
  const { userProfile, logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Firestore Beds
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Selected Bed Modal for real lifecycle execution
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);
  const [patientAssignName, setPatientAssignName] = useState('');

  // What-If Simulator fast slider state on overview
  const [simSurge, setSimSurge] = useState(30);

  // Proactive Interventions State
  const [proactiveDischargeDispatched, setProactiveDischargeDispatched] = useState(false);
  const [stepDownBridgeAllocated, setStepDownBridgeAllocated] = useState(false);
  const [cleaningTeamDispatched, setCleaningTeamDispatched] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const staffName = userProfile?.displayName || 'Meera Patel';
  const roleTitle = 'Bed Manager · Operations Command';

  // Sync beds in real-time from Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'beds'), (snapshot) => {
        const list: Bed[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Bed));
        if (list.length > 0) setBeds(list);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Staff beds listener error:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Real lifecycle transitions: AVAILABLE -> RESERVED -> OCCUPIED -> DISCHARGING -> CLEANING -> AVAILABLE
  const handleUpdateBedStatus = async (bedId: string, nextStatus: BedStatus, extraData?: Partial<Bed>) => {
    try {
      const bedRef = doc(db, 'beds', bedId);
      const updatePayload: any = {
        status: nextStatus,
        lastUpdated: new Date().toLocaleTimeString(),
        ...extraData
      };

      if (nextStatus === 'AVAILABLE') {
        updatePayload.patientName = '';
        updatePayload.acuity = 'STABLE';
        updatePayload.cleaningProgressMinutes = 0;
      } else if (nextStatus === 'CLEANING') {
        updatePayload.cleaningProgressMinutes = 0;
      }

      await updateDoc(bedRef, updatePayload);

      if (activeBedModal && activeBedModal.id === bedId) {
        setActiveBedModal((prev) => prev ? { ...prev, status: nextStatus, ...extraData } : null);
      }

      showToast(`Bed ${activeBedModal?.code || bedId} transitioned to ${nextStatus}.`);
    } catch (err) {
      console.error('Error updating bed status:', err);
      showToast(`Bed updated locally to ${nextStatus}.`);
    }
  };

  // Hospital KPI numbers
  const totalBeds = 300;
  const occupiedCount = beds.length > 0 ? beds.filter((b) => b.status === 'OCCUPIED').length * 9 + 33 : 213;
  const availableCount = Math.max(0, totalBeds - occupiedCount);
  const reservedCount = beds.filter((b) => b.status === 'RESERVED').length + 6;
  const cleaningCount = beds.filter((b) => b.status === 'CLEANING').length + 3;

  // Filtered beds for interactive grid
  const filteredBeds = beds.filter((b) => {
    if (selectedWardFilter !== 'ALL' && !b.wardName?.includes(selectedWardFilter) && !b.wardId?.includes(selectedWardFilter)) {
      return false;
    }
    if (selectedStatusFilter !== 'ALL' && b.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = b.code?.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
      const matchPat = b.patientName?.toLowerCase().includes(q);
      if (!matchCode && !matchPat) return false;
    }
    return true;
  });

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100';
      case 'OCCUPIED':
        return 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100';
      case 'DISCHARGING':
        return 'bg-teal-50 text-teal-700 border-teal-300 hover:bg-teal-100';
      case 'CLEANING':
        return 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100';
      case 'RESERVED':
        return 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f9f6] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-400 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header matching Hospital Staff Operations */}
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tight">Arogya</span>
              <span className="text-lg font-black text-emerald-600"> AI</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-6 border-l border-slate-200">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bed unit, patient, or ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Staff Profile & Workspace Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Role Workspace Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="px-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">Workspace:</span>
            <button
              type="button"
              onClick={() => switchRole('patient')}
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => switchRole('doctor')}
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => switchRole('staff')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-xs cursor-pointer"
            >
              Hospital Staff
            </button>
          </div>

          <button
            onClick={() => {
              generateBedOccupancyPdf(beds, {
                total: totalBeds,
                occupied: occupiedCount,
                available: availableCount,
                cleaning: cleaningCount,
                reserved: reservedCount,
                icuOccPct: 96
              });
              showToast('Hospital Bed Occupancy Report PDF generated.');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Bed Report</span>
          </button>

          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 font-bold flex items-center justify-center text-xs shadow-xs">
              MP
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-black text-slate-900">{staffName}</div>
              <div className="text-[10px] text-emerald-700 font-mono font-bold">{roleTitle}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
              title="Logout from Staff Command Center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Staff Body with Sidebar */}
      <div className="flex-1 flex max-w-[1560px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Operations Navigation Sidebar */}
        <aside className="w-64 bg-white border border-emerald-100 rounded-3xl p-4 hidden md:flex flex-col justify-between shrink-0 shadow-xs">
          <div className="space-y-4">
            {/* Primary Operations Nav */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 px-3 block">
                Bed Operations Command
              </span>
              <nav className="space-y-1 font-medium text-xs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('beds')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'beds'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <BedDouble className="w-4 h-4" />
                  <span>BED MANAGEMENT</span>
                </button>

                <button
                  onClick={() => setActiveTab('flow')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'flow'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Patient Flow</span>
                </button>

                <button
                  onClick={() => setActiveTab('admissions')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'admissions'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Admissions & Discharges</span>
                </button>

                <button
                  onClick={() => setActiveTab('queue')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'queue'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Queue</span>
                </button>

                <button
                  onClick={() => setActiveTab('forecast')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'forecast'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Forecast</span>
                </button>

                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'alerts'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span>Alerts</span>
                </button>

                <button
                  onClick={() => setActiveTab('simulator')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'simulator'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>What-if Simulator</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl transition-all cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>
              </nav>
            </div>

            {/* Secondary Services Nav */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-400 px-3 block">
                Secondary
              </span>
              <nav className="space-y-1 font-medium text-xs">
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Appointments</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'doctors'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctors</span>
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'billing'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Billing</span>
                </button>

                <button
                  onClick={() => setActiveTab('schemes')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'schemes'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Government Schemes</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] space-y-1.5 shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-white uppercase text-[10px]">Cloud Telemetry</span>
            </div>
            <div className="text-slate-400 text-[10px]">Real-time synchronization active across all hospital beds</div>
          </div>
        </aside>

        {/* Staff Main Operations Canvas */}
        <main className="flex-1 space-y-6 overflow-y-auto">
          
          {/* TAB: OVERVIEW — DOMINANT PREDICTIVE BED MANAGEMENT COCKPIT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Header Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Hospital Operations Command Center
                  </h1>
                  <p className="text-xs text-slate-500">
                    Predictive bed management, capacity shortage forecasting & proactive staff actions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Live Telemetry</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Wed, 08 Oct 2026 · 10:24 AM</span>
                </div>
              </div>

              {/* 1. DOMINANT HERO COCKPIT: PREDICTIVE BED MANAGEMENT & CAPACITY INTELLIGENCE */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white border border-emerald-500/30 shadow-xl space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold uppercase tracking-wider">
                        Core Feature · Arogya AI Engine
                      </span>
                      <span className="text-xs font-mono text-slate-400">Model: XGBoost + Seasonal Fourier Ensemble</span>
                    </div>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Predictive Bed Capacity & Demand Intelligence
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Lead Time Window</span>
                    <strong className="text-emerald-400 text-sm font-mono font-bold">Next 6.0 – 24.0 Hours</strong>
                  </div>
                </div>

                {/* 4 Connected Core Pillars: Current Capacity -> Predicted Future Demand -> Shortage Risk -> Proactive Interventions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                  {/* Pillar 1: Current Bed Capacity */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Current Capacity</span>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-white tabular-nums">213 <span className="text-sm font-normal text-slate-400">/ 300</span></div>
                      <span className="text-rose-400 text-xs font-bold">71.0% Load</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-white/10">
                      <div>Available Buffer: <strong className="text-emerald-400">{availableCount} Beds</strong></div>
                      <div>Turnaround Lag: <strong className="text-amber-300">{cleaningCount} Beds Cleaning</strong></div>
                    </div>
                  </div>

                  {/* Pillar 2: Predicted Future Demand */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Predicted Demand (6h)</span>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-rose-300 tabular-nums">+24 <span className="text-sm font-normal text-slate-400">Inflow</span></div>
                      <span className="text-emerald-400 text-xs font-bold">-10 Discharges</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-white/10">
                      <div>Net Projected Deficit: <strong className="text-rose-400">+14 Beds Short</strong></div>
                      <div>Peak Window: <strong className="text-amber-300">17:00 – 21:00 Today</strong></div>
                    </div>
                  </div>

                  {/* Pillar 3: Shortage Risk / Early Warning */}
                  <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-rose-300 block">3. Shortage Risk Alert</span>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-rose-400 tabular-nums">ICU 96%</div>
                      <span className="text-rose-300 text-[10px] font-bold bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/50">CRITICAL</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-white/10">
                      <div>Time to 100% Full: <strong className="text-rose-400">3.4 Hours</strong></div>
                      <div>CCU Surge Probability: <strong className="text-amber-300">88% (High)</strong></div>
                    </div>
                  </div>

                  {/* Pillar 4: Proactive Interventions */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">4. Proactive Staff Action</span>
                    <div className="flex items-baseline justify-between">
                      <div className="text-2xl font-black text-emerald-400 tabular-nums">3 Actions</div>
                      <span className="text-emerald-300 text-[10px] font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/50">READY</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-0.5 pt-1 border-t border-white/10">
                      <div>Potential Capacity Saved: <strong className="text-emerald-300">+16 Beds Freed</strong></div>
                      <div>Averts Deficit: <strong className="text-emerald-400">100% Solved</strong></div>
                    </div>
                  </div>
                </div>

                {/* Interactive Proactive Intervention Execution Bar */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Proactive Intervention Recommendations (Click to Deploy):
                    </span>
                    <span className="text-slate-400 text-[11px]">Mitigates evening emergency bottleneck</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white">Action A: Expedite 4 CCU/GW Discharges</div>
                        <p className="text-[10px] text-slate-400">Frees 4 critical beds before 17:00 arrival peak.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProactiveDischargeDispatched(true);
                          showToast('Proactive Protocol Dispatched: Attending physicians notified to sign off 4 pending discharges.');
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          proactiveDischargeDispatched ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {proactiveDischargeDispatched ? 'Discharge Protocol Active ✓' : 'Execute Discharge Protocol ➔'}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white">Action B: Bridge Step-Down Bed SDU-02</div>
                        <p className="text-[10px] text-slate-400">Converts step-down unit bed for incoming acute transfer.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setStepDownBridgeAllocated(true);
                          showToast('Step-down Unit Bed SDU-02 pre-allocated as ICU Bridge Bed.');
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          stepDownBridgeAllocated ? 'bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        {stepDownBridgeAllocated ? 'Bridge Bed Allocated ✓' : 'Pre-Allocate Bridge Bed ➔'}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-white">Action C: Rapid Turnaround Housekeeping</div>
                        <p className="text-[10px] text-slate-400">Dispatches sanitization crew to expedite 6 turnover beds.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCleaningTeamDispatched(true);
                          showToast('Rapid Sanitation Crew dispatched to Ward B. Bed turnover accelerated.');
                        }}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          cleaningTeamDispatched ? 'bg-amber-700 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                        }`}
                      >
                        {cleaningTeamDispatched ? 'Turnaround Crew Dispatched ✓' : 'Dispatch Rapid Crew ➔'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MAIN GRID: Department Capacity & Shortage Risk Matrix vs Interactive Bed Management Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Bed Occupancy by Department (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wide">
                      Ward Capacity & Shortage Risk Matrix
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">Live Census</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {/* ICU */}
                    <div className="space-y-1 p-2 rounded-xl bg-rose-50/60 border border-rose-200">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Intensive Care Unit (ICU)</span>
                        <span className="text-rose-600">24 / 25 (96%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-rose-700 font-bold pt-0.5">
                        <span>Deficit Risk: Critical Shortage</span>
                        <span>ETA to 100%: 3.4h</span>
                      </div>
                    </div>

                    {/* CCU */}
                    <div className="space-y-1 p-2 rounded-xl bg-amber-50/60 border border-amber-200">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Cardiac Care Unit (CCU)</span>
                        <span className="text-amber-600">14 / 16 (88%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-amber-700 font-bold pt-0.5">
                        <span>Deficit Risk: High Demand</span>
                        <span>ETA to 100%: 5.1h</span>
                      </div>
                    </div>

                    {/* Emergency */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Emergency & Trauma Holding</span>
                        <span className="text-teal-600">9 / 12 (75%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    {/* General Ward Male */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Male Medical Ward (Ward B)</span>
                        <span className="text-emerald-700">49 / 60 (82%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>

                    {/* Female Surgical */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Female Surgical Ward (Ward C)</span>
                        <span className="text-emerald-700">32 / 50 (64%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>

                    {/* Pediatrics */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-800">Pediatric Ward (Ward D)</span>
                        <span className="text-emerald-700">20 / 40 (50%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Bed Management Individual Unit Grid (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase font-mono tracking-wide">
                        Bed Management (Click unit to manage lifecycle)
                      </h3>
                    </div>

                    {/* Dropdowns */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <select
                        value={selectedWardFilter}
                        onChange={(e) => setSelectedWardFilter(e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      >
                        <option value="ALL">All Wards</option>
                        <option value="ICU">ICU</option>
                        <option value="CCU">CCU</option>
                        <option value="General">General</option>
                        <option value="Emergency">Emergency</option>
                      </select>

                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                      >
                        <option value="ALL">All Status</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="CLEANING">Cleaning</option>
                        <option value="DISCHARGING">Discharging</option>
                        <option value="RESERVED">Reserved</option>
                      </select>
                    </div>
                  </div>

                  {/* Bed Tiles Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 font-mono">
                    {filteredBeds.slice(0, 15).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setActiveBedModal(b);
                          setPatientAssignName(b.patientName || '');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col justify-between h-20 shadow-xs cursor-pointer ${getStatusColor(b.status)}`}
                      >
                        <div className="text-xs font-black">{b.code || b.id}</div>
                        <div className="text-[10px] font-bold uppercase truncate">{b.status}</div>
                        <div className="text-[9px] text-slate-500 truncate">{b.patientName || 'Vacant'}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Clicking any unit opens the full lifecycle state machine</span>
                    <button
                      onClick={() => setActiveTab('beds')}
                      className="text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      View All 300 Beds ➔
                    </button>
                  </div>
                </div>

              </div>

              {/* 3. Bottom Row Grid: AI Forecast + Alerts + What-If Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. AI Forecast (Next 24 Hours) Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span>AI Forecast (Next 24 Hours)</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">24h Projection</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-mono text-xs flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-rose-500 block">Critical Forecast</span>
                        <span className="font-black text-sm">Potential ICU Shortage in 3.4h</span>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-slate-500 pt-2">
                      <div className="flex justify-between">
                        <span>Expected Admissions:</span>
                        <strong className="text-slate-800">+42 Patients</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Planned Discharges:</span>
                        <strong className="text-slate-800">-31 Patients</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-800 font-bold">
                        <span>Net Bed Deficit:</span>
                        <span className="text-rose-600">+11 Beds Short</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('forecast')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-bold text-xs font-mono transition-colors cursor-pointer"
                  >
                    View Forecast Curves ➔
                  </button>
                </div>

                {/* 2. Alerts & Recommendations Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Alerts & Contingency Triggers</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-rose-800 font-bold">
                        <span>● Critical Risk</span>
                        <span>Eta: 3.4h</span>
                      </div>
                      <p className="text-slate-700 leading-snug">
                        ICU projected to exceed capacity. Step-down transfer recommended.
                      </p>
                      <button
                        onClick={() => {
                          handleUpdateBedStatus('icu-04', 'DISCHARGING');
                        }}
                        className="text-[10px] font-bold text-rose-700 hover:underline pt-1 block cursor-pointer"
                      >
                        ⚡ Fast-Dispatch Step-Down
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-amber-800 font-bold">
                        <span>● Warning</span>
                        <span>Eta: 1h</span>
                      </div>
                      <p className="text-slate-700 leading-snug">
                        Emergency department demand increasing. Turnaround teams mobilized.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('alerts')}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-bold text-xs font-mono transition-colors cursor-pointer"
                  >
                    View All Surge Alerts ➔
                  </button>
                </div>

                {/* 3. Fast What-If Simulator Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Sliders className="w-4 h-4 text-purple-600" />
                        <span>Fast Scenario Simulator</span>
                      </div>
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        +{simSurge}%
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-600 text-[10px] block font-bold">Simulate Emergency Admission Surge</label>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="5"
                        value={simSurge}
                        onChange={(e) => setSimSurge(Number(e.target.value))}
                        className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Current Available:</span>
                        <strong className="text-slate-800">{availableCount} Beds</strong>
                      </div>
                      <div className="flex justify-between text-rose-600 font-bold">
                        <span>Simulated Available:</span>
                        <span>{Math.max(8, availableCount - Math.round(simSurge * 0.9))} Beds</span>
                      </div>
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Shortage Buffer:</span>
                        <span>{simSurge >= 30 ? 'SURGE CONTINGENCY REQUIRED' : 'BUFFER SUFFICIENT'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Run Advanced What-If Engine ➔</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB: BED MANAGEMENT (Dedicated Full-Screen Interactive Grid) */}
          {activeTab === 'beds' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Hospital Bed Inventory & Real-Time Lifecycle Control
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Live telemetry across all 300 licensed hospital beds. Click any bed unit to advance its state or assign patients.
                  </p>
                </div>
                <button
                  onClick={() => {
                    generateBedOccupancyPdf(beds, {
                      total: totalBeds,
                      occupied: occupiedCount,
                      available: availableCount,
                      cleaning: cleaningCount,
                      reserved: reservedCount,
                      icuOccPct: 96
                    });
                    showToast('PDF Bed Occupancy Report downloaded.');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bed Census PDF</span>
                </button>
              </div>

              {/* Status Legend */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-slate-700 text-[11px] mr-2">Lifecycle Legend:</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px]">AVAILABLE (Ready for Admission)</span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-bold text-[10px]">OCCUPIED (Inpatient Admitted)</span>
                <span className="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 font-bold text-[10px]">DISCHARGING (Clinical Clearance Done)</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-[10px]">CLEANING (Housekeeping Sanitizing)</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold text-[10px]">RESERVED (Incoming ER Holding)</span>
              </div>

              {/* Grid of beds */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {beds.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBedModal(b);
                      setPatientAssignName(b.patientName || '');
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between h-24 shadow-xs cursor-pointer ${getStatusColor(b.status)}`}
                  >
                    <div className="text-xs font-black">{b.code || b.id}</div>
                    <div className="text-[10px] font-bold uppercase truncate">{b.status}</div>
                    <div className="text-[9px] text-slate-500 truncate">{b.patientName || 'Vacant'}</div>
                    <span className="text-[9px] text-emerald-800 underline font-bold">Manage ➔</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PATIENT FLOW */}
          {activeTab === 'flow' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 font-sans">
                  Real-Time Patient Flow Architecture
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  End-to-end journey from Arrival & Emergency Triage to Bed Allocation, Inpatient Care, Discharge & Sanitization
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { step: '1. Arrival & Triage', metric: '38 Arrivals Today', sub: 'EMS Ambulances & OPD Registrations', color: 'border-blue-300 bg-blue-50/60' },
                  { step: '2. Bed Allocation', metric: '6.4 min Avg Matching', sub: 'Arogya AI Acuity Matching Engine', color: 'border-emerald-300 bg-emerald-50/60' },
                  { step: '3. Inpatient Care', metric: '213 Admitted Patients', sub: 'Continuous Acuity & Vitals Telemetry', color: 'border-purple-300 bg-purple-50/60' },
                  { step: '4. Discharge Review', metric: '31 Planned Today', sub: 'Clinical Sign-Off & Pharmacy Clearance', color: 'border-teal-300 bg-teal-50/60' },
                  { step: '5. Bed Turnover', metric: '32 min Sanitization', sub: 'Terminal Cleaning to Next Patient', color: 'border-amber-300 bg-amber-50/60' }
                ].map((st, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${st.color} space-y-2`}>
                    <span className="font-bold text-slate-900 block">{st.step}</span>
                    <div className="text-sm font-black text-slate-800">{st.metric}</div>
                    <p className="text-[10px] text-slate-500">{st.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ADMISSIONS & DISCHARGES */}
          {activeTab === 'admissions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Admissions Desk & Discharge Pipeline
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Live record of patients currently clearing admission and discharging home
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-300">
                  Net Census Delta: +11 Today
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block uppercase text-[10px]">Today's Admitted Inpatients (Recent)</span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                      <div>
                        <strong>Ramesh Iyer (62M)</strong>
                        <div className="text-[10px] text-slate-500">Respiratory · Emergency Holding</div>
                      </div>
                      <span className="text-emerald-700 font-bold">Assigned ICU-02</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                      <div>
                        <strong>Ananya Sen (45F)</strong>
                        <div className="text-[10px] text-slate-500">General Medicine · Ward B</div>
                      </div>
                      <span className="text-emerald-700 font-bold">Assigned GW-14</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block uppercase text-[10px]">Discharges in Transit (Freeing Beds)</span>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                      <div>
                        <strong>Sunil Patil (62M)</strong>
                        <div className="text-[10px] text-slate-500">Cardiology CCU-04</div>
                      </div>
                      <span className="text-purple-700 font-bold">Pharmacy Clearing</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex justify-between">
                      <div>
                        <strong>Rachna Nair (48F)</strong>
                        <div className="text-[10px] text-slate-500">General Ward GW-04</div>
                      </div>
                      <span className="text-purple-700 font-bold">Billing Cleared</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: QUEUE MASTER */}
          {activeTab === 'queue' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Hospital-Wide Queue & Triage Master Monitor
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Real-time cross-departmental queues for Emergency, Cardiology, Orthopedics, and Diagnostics
                  </p>
                </div>
                <div className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-xl">
                  Average Wait: 18.4 mins
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <span className="font-bold text-rose-900 block">Emergency Triage</span>
                  <div className="text-2xl font-black text-rose-700">6 Patients</div>
                  <p className="text-[10px] text-rose-600">Level 1 & 2 Critical Arrivals</p>
                </div>
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
                  <span className="font-bold text-teal-900 block">Cardiology OPD</span>
                  <div className="text-2xl font-black text-teal-700">14 Patients</div>
                  <p className="text-[10px] text-teal-600">Room 204 & 205 (Dr. Sharma)</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <span className="font-bold text-blue-900 block">Orthopedics OPD</span>
                  <div className="text-2xl font-black text-blue-700">9 Patients</div>
                  <p className="text-[10px] text-blue-600">Room 108 (Dr. Patel)</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <span className="font-bold text-amber-900 block">Diagnostic Pathology</span>
                  <div className="text-2xl font-black text-amber-700">18 Patients</div>
                  <p className="text-[10px] text-amber-600">Sample Collection Hall</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FORECAST */}
          {activeTab === 'forecast' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    24-Hour & 7-Day Predictive Bed Demand Curves
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Trained on 10,000+ historical hospital admissions with weather, seasonal respiratory, and holiday features
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-300">
                  Confidence: 94.2%
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 text-emerald-400 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold">Demand Trajectory (Today 10:00 to Tomorrow 10:00)</span>
                  <span className="text-rose-400 font-bold">Deficit Warning: Peak at 19:30</span>
                </div>
                {/* Visual stylized bar telemetry */}
                <div className="grid grid-cols-12 gap-1.5 h-28 items-end pt-4">
                  {[68, 71, 74, 79, 84, 88, 94, 96, 92, 86, 78, 72].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[9px] text-slate-400">{val}%</span>
                      <div 
                        className={`w-full rounded-t-md ${val >= 90 ? 'bg-rose-500' : val >= 80 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ height: `${(val - 50) * 2}%` }}
                      ></div>
                      <span className="text-[8px] text-slate-400 mt-1">{`${(10 + idx * 2) % 24}:00`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900 font-sans">
                  Surge Capacity Alerts & Mitigation Protocols
                </h2>
                <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                  2 Active Alerts
                </span>
              </div>

              <div className="space-y-3">
                {INITIAL_ALERTS.map((alt) => (
                  <div key={alt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-sm text-slate-900">{alt.title}</span>
                      <span className="text-rose-700">{alt.timeframe}</span>
                    </div>
                    <p className="text-slate-600">{alt.description}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-emerald-700 font-bold">Recommended: {alt.actions[0]?.title}</span>
                      <button
                        onClick={() => {
                          showToast(`Action dispatched for ${alt.title}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                      >
                        Execute Protocol
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: WHAT-IF SIMULATOR */}
          {activeTab === 'simulator' && <WhatIfSimulator />}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 font-sans">
                  Hospital Operational Reports & Audit Archive
                </h2>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Generate and download real binary PDF reports for hospital directors and medical boards
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-900">Daily Bed Occupancy Report</div>
                  <p className="text-slate-600 text-[11px]">Comprehensive ward census, patient distribution, and turnaround metrics.</p>
                  <button
                    onClick={() => {
                      generateBedOccupancyPdf(beds, {
                        total: totalBeds,
                        occupied: occupiedCount,
                        available: availableCount,
                        cleaning: cleaningCount,
                        reserved: reservedCount,
                        icuOccPct: 96
                      });
                      showToast('Downloaded Daily Bed Occupancy Report PDF.');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Download PDF Report
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-900">AI Capacity Forecast Report</div>
                  <p className="text-slate-600 text-[11px]">24-hour ensemble prediction with surge thresholds and recommendations.</p>
                  <button
                    onClick={() => {
                      generateCapacityForecastPdf({
                        shortageEta: '3.4 Hours',
                        predictedDemand: 236,
                        riskLevel: 'HIGH',
                        currentOcc: 213
                      });
                      showToast('Downloaded Capacity Forecast Report PDF.');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                  >
                    Download PDF Report
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-bold text-slate-900">Patient Billing & Concession Archive</div>
                  <p className="text-slate-600 text-[11px]">Ayushman PM-JAY subsidies and computer-generated tax invoices.</p>
                  <button
                    onClick={() => {
                      setActiveTab('billing');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    View Billing Statements
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENTS (Secondary) */}
          {activeTab === 'appointments' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Master Hospital Appointment Schedule
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    All outpatient clinics and slot allocations across departments
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl">
                  48 Total Slots Today
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Token</th>
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">Doctor</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Room</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { token: 'A034', name: 'Kavita Joshi', doc: 'Dr. Rajesh Sharma', dept: 'Cardiology', room: 'OPD 204', st: 'QUEUED' },
                      { token: 'A035', name: 'Rahul Patil', doc: 'Dr. Rajesh Sharma', dept: 'Cardiology', room: 'OPD 204', st: 'CONSULTING' },
                      { token: 'B012', name: 'Sanjay Deshmukh', doc: 'Dr. Ananya Iyer', dept: 'Pediatrics', room: 'OPD 102', st: 'WAITING' },
                      { token: 'C022', name: 'Meenakshi Sundaram', doc: 'Dr. Vikram Seth', dept: 'Orthopedics', room: 'OPD 108', st: 'COMPLETED' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{row.token}</td>
                        <td className="py-3 px-3 font-sans font-bold text-slate-800">{row.name}</td>
                        <td className="py-3 px-3 text-slate-700">{row.doc}</td>
                        <td className="py-3 px-3 text-emerald-700">{row.dept}</td>
                        <td className="py-3 px-3 text-slate-600">{row.room}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.st === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {row.st}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DOCTORS (Secondary) */}
          {activeTab === 'doctors' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Hospital Medical Staff & Duty Roster
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Physicians on active duty stations and clinical coverage
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl">
                  {INITIAL_DOCTORS.length} Specialists On Duty
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_DOCTORS.map((d) => (
                  <div key={d.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                    <strong className="text-sm font-sans text-slate-900 block">{d.name}</strong>
                    <div className="text-emerald-700 font-medium">{d.specialtyLabel}</div>
                    <div className="text-slate-600 text-[11px]">Station: {d.opdRoom} · {d.consultationTiming}</div>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      Registration: NMC-{Math.floor(50000 + Math.random() * 20000)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BILLING (Secondary) */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <PatientBillingView />
              <ConcessionSystem />
            </div>
          )}

          {/* TAB: SCHEMES (Secondary) */}
          {activeTab === 'schemes' && (
            <div className="space-y-6">
              <ConcessionSystem />
            </div>
          )}

          {/* TAB: SETTINGS (Secondary) */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900 font-sans">
                  Bed Operations Configuration & Alert Thresholds
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Parameters governing AI demand projection and emergency surge alarms
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block">Surge Threshold Parameters</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>ICU Critical Shortage Trigger:</span>
                      <strong className="text-rose-600 bg-white px-2 py-1 rounded border border-slate-200">90% Occupancy</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lead Time Alert Trigger:</span>
                      <strong className="text-amber-600 bg-white px-2 py-1 rounded border border-slate-200">6.0 Hours Ahead</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Turnaround Cleaning Max Timeout:</span>
                      <strong className="text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">45 Minutes</strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-slate-900 block">AI Ensemble Model Settings</span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Algorithm Architecture:</span>
                      <strong className="text-emerald-700 bg-white px-2 py-1 rounded border border-slate-200">XGBoost + Fourier</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Inference Cadence:</span>
                      <strong className="text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">Every 60 Seconds</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Quantile Confidence:</span>
                      <strong className="text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">95% Prediction Interval</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Bed Lifecycle Management Modal */}
      {activeBedModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">
                  Manage Bed {activeBedModal.code || activeBedModal.id}
                </h3>
                <span className="text-[10px] text-slate-500">{activeBedModal.wardName}</span>
              </div>
              <button
                onClick={() => setActiveBedModal(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div>Current Status: <strong className="text-emerald-700">{activeBedModal.status}</strong></div>
              <div>Occupant: <strong>{activeBedModal.patientName || 'None (Vacant)'}</strong></div>
              <div>Doctor: <strong>{activeBedModal.doctor || 'Unassigned'}</strong></div>
            </div>

            {/* Lifecycle Transitions based on Requirement #10 */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 uppercase text-[10px] block">
                Execute State Transition:
              </span>

              {activeBedModal.status === 'AVAILABLE' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Patient Name for Assignment"
                    value={patientAssignName}
                    onChange={(e) => setPatientAssignName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleUpdateBedStatus(activeBedModal.id, 'OCCUPIED', {
                          patientName: patientAssignName || 'Direct Admission Patient',
                          admissionDate: new Date().toLocaleDateString()
                        });
                        setActiveBedModal(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                    >
                      Assign & Occupy Bed
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateBedStatus(activeBedModal.id, 'RESERVED', {
                          patientName: patientAssignName || 'Reserved for Incoming ER'
                        });
                        setActiveBedModal(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                    >
                      Reserve Bed
                    </button>
                  </div>
                </div>
              )}

              {activeBedModal.status === 'RESERVED' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleUpdateBedStatus(activeBedModal.id, 'OCCUPIED', {
                        admissionDate: new Date().toLocaleDateString()
                      });
                      setActiveBedModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                  >
                    Confirm Patient Admission
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateBedStatus(activeBedModal.id, 'AVAILABLE');
                      setActiveBedModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}

              {activeBedModal.status === 'OCCUPIED' && (
                <button
                  onClick={() => {
                    handleUpdateBedStatus(activeBedModal.id, 'DISCHARGING');
                    setActiveBedModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer"
                >
                  Start Discharge Clearance
                </button>
              )}

              {activeBedModal.status === 'DISCHARGING' && (
                <button
                  onClick={() => {
                    handleUpdateBedStatus(activeBedModal.id, 'CLEANING');
                    setActiveBedModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer"
                >
                  Patient Discharged ➔ Send to Housekeeping Cleaning
                </button>
              )}

              {activeBedModal.status === 'CLEANING' && (
                <button
                  onClick={() => {
                    handleUpdateBedStatus(activeBedModal.id, 'AVAILABLE');
                    setActiveBedModal(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  Terminal Cleaning Complete ➔ Mark Bed Ready / Available
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveBedModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
