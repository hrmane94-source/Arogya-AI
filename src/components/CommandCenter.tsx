import React from 'react';
import { 
  Bed as BedIcon, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  Award,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { Ward, EarlyWarningAlert, Role } from '../types/hospital';
import { QuotesTicker } from './QuotesTicker';
import { GovtHospitalEmblem, NabhAccreditedBadge, PmjayAyushmanLogo, Level1TraumaCross, MohfwEmblem } from './HospitalLogos';

interface CommandCenterProps {
  wards: Ward[];
  alerts: EarlyWarningAlert[];
  onNavigateTab: (tab: string) => void;
  onOpenVoiceConsultant: () => void;
  activeRole: Role;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  wards,
  alerts,
  onNavigateTab,
  onOpenVoiceConsultant,
  activeRole
}) => {
  const totalBeds = wards.reduce((acc, w) => acc + w.totalBeds, 0);
  const occupiedBeds = wards.reduce((acc, w) => acc + w.occupiedBeds, 0);
  const availableBeds = wards.reduce((acc, w) => acc + w.availableBeds, 0);
  const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-5">
      {/* Inspirational Hospital & Clinical Quotes Banner */}
      <QuotesTicker />

      {/* Hospital Identity & Accreditation Banner */}
      <div className="bg-white border-2 border-emerald-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <GovtHospitalEmblem size={44} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 font-sans">
                Metropolis Government Medical College & Hospital
              </h2>
              <span className="text-[10px] font-mono font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                LEVEL-1 TRAUMA
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-0.5 font-mono">
              <span>National Health Mission (NHM)</span>
              <span>·</span>
              <span>Central Bed Monitoring Command</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">Developed by Error 404</span>
            </div>
          </div>
        </div>

        {/* Emblems & Fast Simulator Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pr-3 border-r border-slate-200">
            <NabhAccreditedBadge size={32} />
            <PmjayAyushmanLogo size={32} />
            <MohfwEmblem size={32} />
          </div>

          <button 
            onClick={() => onNavigateTab('what-if')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Hero Situation Strip: The 7 Core Metrics (Bright Glowing Accents) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {/* 1. Available Beds */}
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 relative overflow-hidden shadow-sm hover:shadow-md transition-all group">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between font-bold">
            <span>Available Beds</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-600 font-mono">87</span>
            <span className="text-xs text-slate-400 font-mono font-bold">/ 300</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-800 font-bold flex items-center gap-1">
            <span>🟢 Intake Ready Now</span>
          </div>
        </div>

        {/* 2. Occupied */}
        <div className="bg-white border border-rose-200 rounded-2xl p-4 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between font-bold">
            <span>Occupied</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-rose-600 font-mono">213</span>
            <span className="text-xs text-slate-400 font-mono">/ 300</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-700 font-semibold">
            🔴 {occupancyPercentage}% hospital load
          </div>
        </div>

        {/* 3. Predicted Demand (24h) */}
        <div className="bg-white border border-amber-200 rounded-2xl p-4 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between font-bold">
            <span>Predicted Demand</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-amber-600 font-mono">236</span>
            <span className="text-xs text-slate-400 font-mono">in 24h</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-semibold">
            🟡 +23 beds net demand
          </div>
        </div>

        {/* 4. Expected Admissions */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between font-bold">
            <span>Exp. Admissions</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-800 font-mono">42</span>
            <span className="text-xs text-slate-400 font-mono">pts</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            📈 18 ER · 14 Elec · 10 Trans
          </div>
        </div>

        {/* 5. Expected Discharges */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 flex items-center justify-between font-bold">
            <span>Exp. Discharges</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-emerald-600 font-mono">31</span>
            <span className="text-xs text-slate-400 font-mono">pts</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-mono">
            📉 12 ready in &lt;6h
          </div>
        </div>

        {/* 6. Shortage Risk */}
        <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 flex items-center justify-between font-bold">
            <span>Shortage Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-700 tracking-tight font-mono">HIGH</span>
          </div>
          <div className="mt-1 text-[11px] text-rose-800 font-bold">
            ⚠️ ICU & Trauma critical
          </div>
        </div>

        {/* 7. Estimated Time to Shortage */}
        <div className="col-span-2 md:col-span-1 bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-800 flex items-center justify-between font-bold">
            <span>Time To Shortage</span>
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-black text-amber-700 font-mono">9</span>
            <span className="text-xs text-amber-900 font-mono font-bold">hours</span>
          </div>
          <div className="mt-1 text-[11px] text-amber-800 font-bold">
            ⏱️ ~8:40 PM tonight
          </div>
        </div>
      </div>

      {/* Predictive Core Callout Banner with Glowing Accent */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border-2 border-emerald-300 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping"></span>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-900">
              Arogya AI Predictive Intelligence
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-700 font-medium">Don't just view today's beds — prepare for what happens next</span>
          </div>
          <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
            Surge window opens in 9 hours: ICU projected to hit 95% capacity by 1:45 AM
          </h2>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Historical correlation with weekend emergency intake and current ALOS (3.2 days) predicts 42 inbound admissions outstripping 31 discharges. Rapid discharge prioritization can reclaim 12 beds before midnight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
          <button
            onClick={() => onNavigateTab('forecast')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-700/20"
          >
            <span>View 24h/7d Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('what-if')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Simulate Scenario</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Department Status Matrix & AI Recommended Preparation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Department Digital Twin Overview (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 font-mono">
                Department Capacity & 24h Surge Index
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('digital-twin')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 font-mono"
            >
              <span>Explore Interactive Hospital Twin</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {wards.map((ward) => {
              const occPct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
              const isCritical = occPct >= 90;
              const isHigh = occPct >= 80 && occPct < 90;

              return (
                <div
                  key={ward.id}
                  onClick={() => onNavigateTab('digital-twin')}
                  className="bg-white border border-slate-200/90 hover:border-emerald-500 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: ward.color }}
                        ></span>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {ward.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        Code: {ward.code} · ALOS: {ward.alos} days
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className={`text-base font-black ${
                        isCritical ? 'text-rose-600' : isHigh ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {occPct}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ward.occupiedBeds}/{ward.totalBeds} Beds
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full ${
                        isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${occPct}%` }}
                    ></div>
                  </div>

                  {/* Ward Sub-Metrics */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 text-center text-[10px] font-mono text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Available</span>
                      <span className="text-slate-800 font-bold text-xs">{ward.availableBeds}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">In Turnaround</span>
                      <span className="text-amber-600 font-bold text-xs">{ward.cleaningBeds}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Exp. 24h Need</span>
                      <span className="text-emerald-700 font-bold text-xs">+{ward.expectedAdmissions - ward.expectedDischarges}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Queue Triage Preview Banner with glowing logo */}
          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-mono font-black text-xs shadow-md shadow-emerald-700/20">
                <span className="text-[9px] text-emerald-200">LIVE</span>
                <span>A034</span>
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>Live Emergency & Inpatient Triage Queue Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-slate-500">
                  6 patients awaiting bed allocation · Avg AI projected wait: 18 mins
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('queue')}
              className="px-4 py-2 text-xs font-mono font-bold rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
            >
              Open Live Queue
            </button>
          </div>
        </div>

        {/* Right Column: AI Bed Allocation Optimizer & Smart Alert Center */}
        <div className="space-y-4">
          {/* Bed Allocation Optimizer */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Bed Allocation Optimizer
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Decision Support
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Arogya AI calculated upcoming demand surges for authorized clinical staff:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-rose-800 font-bold block">ICU (Intensive Care)</span>
                  <span className="text-[11px] text-slate-500">Current available: 0 beds</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300">
                    Prepare 3 beds
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 font-bold block">General Ward</span>
                  <span className="text-[11px] text-slate-500">Current available: 47 beds</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300">
                    Prepare 8 beds
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-bold block">Emergency Holding</span>
                  <span className="text-[11px] text-slate-500">Current available: 5 beds</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300">
                    Prepare 4 beds
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => onNavigateTab('alerts')}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
              >
                <span>Execute Preparedness Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smart Alerts Feed Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Smart Alert Center
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {alerts.length} Active Alerts
              </span>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-50/90 border-rose-300 text-rose-900'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-50/90 border-amber-300 text-amber-900'
                      : 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}></span>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timeframe}</span>
                  </div>
                  <p className="mt-1 font-bold text-slate-900 leading-tight">
                    {alert.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('alerts')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage All Early Warnings & Actions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
