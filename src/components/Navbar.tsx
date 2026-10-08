import React, { useState, useEffect } from 'react';
import { 
  Heart,
  Activity, 
  Mic, 
  ShieldAlert, 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  Sliders, 
  Grid3X3, 
  Users, 
  CreditCard, 
  Cpu,
  Volume2,
  LogOut,
  Building2,
  Sparkles,
  Stethoscope,
  Receipt
} from 'lucide-react';
import { Role } from '../types/hospital';
import { GovtHospitalEmblem, NabhAccreditedBadge, PmjayAyushmanLogo, Level1TraumaCross } from './HospitalLogos';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenVoiceConsultant: () => void;
  isVoiceActive: boolean;
  alertCount: number;
  userName: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  activeRole,
  onRoleChange,
  onOpenVoiceConsultant,
  isVoiceActive,
  alertCount,
  userName,
  onLogout
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles: { id: Role; label: string; icon: string }[] = [
    { id: 'ADMIN', label: 'Admin / Ops', icon: '🏢' },
    { id: 'BED_MANAGER', label: 'Staff / Bed Mgr', icon: '🛏️' },
    { id: 'DOCTOR', label: 'Doctor', icon: '🩺' },
    { id: 'EMERGENCY_CHIEF', label: 'Emergency', icon: '🚑' }
  ];

  const tabs = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors & Specialties', icon: Stethoscope },
    { id: 'billing', label: 'Patient Billings', icon: Receipt },
    { id: 'queue', label: 'Live Queue & Triage', icon: Users },
    { id: 'forecast', label: 'AI Forecast', icon: TrendingUp },
    { id: 'alerts', label: 'Surge Alerts', icon: AlertTriangle, badge: alertCount },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders },
    { id: 'digital-twin', label: 'Hospital Digital Twin', icon: Grid3X3 },
    { id: 'concession', label: 'Govt Card Concession', icon: CreditCard },
    { id: 'ml-engine', label: 'ML Engine & Models', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Bright Telemetry Strip */}
      <div className="px-4 md:px-8 py-1.5 bg-[#f0fdf4] border-b border-emerald-100/90 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-800 font-black tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            AROGYA AI TELEMETRY
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-800 font-bold flex items-center gap-1">
            <GovtHospitalEmblem size={16} />
            Metropolis Govt Hospital · 300 Beds
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-amber-800 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            EST. SHORTAGE: 9.2 HOURS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-extrabold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-sm">
            Developed by Error 404
          </span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-rose-700 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>SURGE DEFCON 2</span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-bold">{time}</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Hospital Seals */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-700/10">
            <div className="relative">
              <Heart className="w-7 h-7 fill-emerald-100 stroke-emerald-600 stroke-[2.2]" />
              <Activity className="w-4 h-4 text-emerald-700 absolute inset-0 m-auto animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Arogya<span className="text-emerald-600"> AI</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-300 rounded">
                SMART CARE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Smart Care | Smarter Tomorrow · BedPulse Command
            </p>
          </div>

          {/* Hospital Emblems in Navbar */}
          <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <GovtHospitalEmblem size={30} />
            <NabhAccreditedBadge size={28} />
            <PmjayAyushmanLogo size={28} />
          </div>
        </div>

        {/* Center / Right Controls: Role Selector, AI Voice, User Profile, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Segmented Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 px-2">Role:</span>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => onRoleChange(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeRole === r.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* AI Voice Consultant Trigger */}
          <button
            onClick={onOpenVoiceConsultant}
            className={`relative group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border font-bold text-xs transition-all ${
              isVoiceActive
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 shadow-sm'
            }`}
          >
            <div className="relative">
              {isVoiceActive ? (
                <Volume2 className="w-4 h-4 text-rose-600 animate-bounce" />
              ) : (
                <Mic className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              )}
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="leading-none text-xs font-bold">AI Voice Consultant</div>
              <span className="text-[9px] text-emerald-700 font-mono">Real-time Triage Audio</span>
            </div>
          </button>

          {/* User & Logout Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">{userName}</div>
              <div className="text-[10px] text-slate-500 font-mono">Government Hospital</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout & return to login screen"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="px-4 md:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-100 bg-[#fbfdfc]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
