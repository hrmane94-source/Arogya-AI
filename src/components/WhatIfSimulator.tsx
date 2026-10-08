import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  ArrowDown, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  Biohazard, 
  Building2, 
  RotateCcw
} from 'lucide-react';

interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  icon: any;
  admissionSurgePct: number;
  dischargeReductionPct: number;
  massCasualtyCount: number;
  wardClosureBeds: number;
}

export const WhatIfSimulator: React.FC = () => {
  const [admissionSurge, setAdmissionSurge] = useState<number>(20);
  const [dischargeReduction, setDischargeReduction] = useState<number>(0);
  const [massCasualty, setMassCasualty] = useState<number>(0);
  const [wardClosures, setWardClosures] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string>('custom');

  const totalHospitalBeds = 300;
  const currentOccupied = 213;
  const currentAvailable = 87;
  const baselineAdmissions = 42;
  const baselineDischarges = 31;

  const PRESETS: ScenarioPreset[] = [
    {
      id: 'default-20',
      name: '+20% Admissions Surge',
      description: 'Standard prompt benchmark: Expected admissions jump by 20% tomorrow.',
      icon: Sparkles,
      admissionSurgePct: 20,
      dischargeReductionPct: 0,
      massCasualtyCount: 0,
      wardClosureBeds: 0
    },
    {
      id: 'mass-casualty',
      name: '🚑 Mass-Casualty Event',
      description: 'Highway multi-vehicle crash: Immediate +25 acute surgical trauma patients.',
      icon: Flame,
      admissionSurgePct: 15,
      dischargeReductionPct: 10,
      massCasualtyCount: 25,
      wardClosureBeds: 0
    },
    {
      id: 'festival-spike',
      name: '📈 Festival-Season Spike',
      description: 'Holiday surge: Gastrointestinal and trauma admissions increase by +35%.',
      icon: Calendar,
      admissionSurgePct: 35,
      dischargeReductionPct: 15,
      massCasualtyCount: 0,
      wardClosureBeds: 0
    },
    {
      id: 'outbreak',
      name: '🦠 Viral Disease Outbreak',
      description: 'Acute respiratory epidemic: Admissions jump +50%, discharges delayed +25%.',
      icon: Biohazard,
      admissionSurgePct: 50,
      dischargeReductionPct: 25,
      massCasualtyCount: 0,
      wardClosureBeds: 0
    },
    {
      id: 'weekend-staffing',
      name: '👨‍⚕️ Reduced Discharge Rate',
      description: 'Holiday weekend physician coverage: Discharge sign-offs drop by 40%.',
      icon: AlertTriangle,
      admissionSurgePct: 0,
      dischargeReductionPct: 40,
      massCasualtyCount: 0,
      wardClosureBeds: 0
    },
    {
      id: 'ward-closure',
      name: '🏥 Ward 3B Maintenance Leak',
      description: 'Temporary decontamination: 25 General beds taken offline.',
      icon: Building2,
      admissionSurgePct: 10,
      dischargeReductionPct: 0,
      massCasualtyCount: 0,
      wardClosureBeds: 25
    }
  ];

  const applyPreset = (preset: ScenarioPreset) => {
    setActivePreset(preset.id);
    setAdmissionSurge(preset.admissionSurgePct);
    setDischargeReduction(preset.dischargeReductionPct);
    setMassCasualty(preset.massCasualtyCount);
    setWardClosures(preset.wardClosureBeds);
  };

  const resetToBaseline = () => {
    setActivePreset('custom');
    setAdmissionSurge(0);
    setDischargeReduction(0);
    setMassCasualty(0);
    setWardClosures(0);
  };

  const effectiveTotalBeds = totalHospitalBeds - wardClosures;
  const projectedAdmissions = Math.round(baselineAdmissions * (1 + admissionSurge / 100)) + massCasualty;
  const projectedDischarges = Math.round(baselineDischarges * (1 - dischargeReduction / 100));
  const netInflow = projectedAdmissions - projectedDischarges;

  const predictedOccupied = Math.min(effectiveTotalBeds, currentOccupied + netInflow);
  const predictedAvailable = Math.max(0, effectiveTotalBeds - predictedOccupied);
  const occupancyPct = Math.round((predictedOccupied / effectiveTotalBeds) * 100);

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  let shortageHours = 'No Shortage';
  let shortageExactTime = 'Capacity nominal';

  if (predictedAvailable <= 5 || occupancyPct >= 98) {
    riskLevel = 'CRITICAL';
    shortageHours = '3.5 Hours';
    shortageExactTime = 'Today 2:30 PM (Immediate Code Red)';
  } else if (predictedAvailable <= 39 || occupancyPct >= 87) {
    riskLevel = 'HIGH';
    shortageHours = '9 Hours';
    shortageExactTime = 'Tomorrow 8:40 PM';
  } else if (predictedAvailable <= 60 || occupancyPct >= 78) {
    riskLevel = 'MODERATE';
    shortageHours = '18 Hours';
    shortageExactTime = 'Tomorrow morning 10:00 AM';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
              AROGYA AI "WHAT IF?" CRISIS & CAPACITY SIMULATOR
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Decision-support simulator for admission spikes, pandemic outbreaks, and disaster surge protocols
          </p>
        </div>

        <button
          onClick={resetToBaseline}
          className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold transition-colors flex items-center gap-1.5 self-start md:self-auto shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset to Baseline (0% Surge)</span>
        </button>
      </div>

      {/* Scenario Presets Strip */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-600 uppercase tracking-wider block font-bold">
          Select or Benchmark Scenario Presets:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold font-mono truncate">{p.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulator Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              Simulation Variables
            </span>
            <span className="text-[10px] font-mono text-slate-400">Live Recalculation</span>
          </div>

          {/* Slider 1: Admission Surge */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-700 font-medium">Admission Surge Rate</span>
              <span className="text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +{admissionSurge}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={admissionSurge}
              onChange={(e) => {
                setActivePreset('custom');
                setAdmissionSurge(Number(e.target.value));
              }}
              className="w-full accent-emerald-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Baseline (42)</span>
              <span>Projected: {projectedAdmissions - massCasualty}</span>
              <span>+100% (84)</span>
            </div>
          </div>

          {/* Slider 2: Discharge Reduction / Delay */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-700 font-medium">Discharge Latency / Delay</span>
              <span className="text-amber-700 font-bold font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                -{dischargeReduction}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={dischargeReduction}
              onChange={(e) => {
                setActivePreset('custom');
                setDischargeReduction(Number(e.target.value));
              }}
              className="w-full accent-amber-500 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Standard (31)</span>
              <span>Projected: {projectedDischarges}</span>
              <span>-60% (12)</span>
            </div>
          </div>

          {/* Slider 3: Mass Casualty Event Added Patients */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-700 font-medium">Mass-Casualty Sudden Influx</span>
              <span className="text-rose-700 font-bold font-mono bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                +{massCasualty} acute pts
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={massCasualty}
              onChange={(e) => {
                setActivePreset('custom');
                setMassCasualty(Number(e.target.value));
              }}
              className="w-full accent-rose-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 (None)</span>
              <span>+20 (Multi-vehicle)</span>
              <span>+40 (Disaster)</span>
            </div>
          </div>

          {/* Slider 4: Ward Offline Beds */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-700 font-medium">Ward Maintenance Offline Beds</span>
              <span className="text-purple-700 font-bold font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                -{wardClosures} beds
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={wardClosures}
              onChange={(e) => {
                setActivePreset('custom');
                setWardClosures(Number(e.target.value));
              }}
              className="w-full accent-purple-600 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 offline</span>
              <span>Usable Capacity: {effectiveTotalBeds}</span>
              <span>50 offline</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Pipeline Result Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Immediate Decision Support Impact</span>
              <span className="text-emerald-700 font-bold">Simulation Output</span>
            </div>

            {/* Step-by-Step Flow: CURRENT -> EVENT -> PREDICTED -> RISK */}
            <div className="space-y-3 font-mono">
              {/* Box 1: Current */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block font-bold">CURRENT STATUS</span>
                  <span className="text-base font-bold text-slate-900">
                    Available Beds: <strong className="text-emerald-700 font-mono font-black">{currentAvailable}</strong> / 300
                  </span>
                </div>
                <div className="text-right text-xs text-slate-500">
                  Census: 213 Occupied (71%)
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex items-center justify-center py-0.5">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
                  <ArrowDown className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                  <span>
                    Simulated Inflow: +{projectedAdmissions} Adm vs -{projectedDischarges} Disch (Net +{netInflow})
                  </span>
                </div>
              </div>

              {/* Box 2: Predicted */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block font-bold">PREDICTED POST-SURGE</span>
                  <span className="text-base font-bold text-slate-900">
                    Available Beds: <strong className={`font-mono font-black ${predictedAvailable <= 20 ? 'text-rose-600' : 'text-amber-600'}`}>{predictedAvailable}</strong> / {effectiveTotalBeds}
                  </span>
                </div>
                <div className="text-right text-xs text-slate-600 font-mono font-bold">
                  {occupancyPct}% Projected Load
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex items-center justify-center py-0.5">
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>

              {/* Box 3: Risk & Shortage Time Callout */}
              <div className={`p-5 rounded-2xl border text-xs shadow-sm ${
                riskLevel === 'CRITICAL'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : riskLevel === 'HIGH'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm flex items-center gap-1.5 font-mono">
                    <AlertTriangle className="w-4 h-4" />
                    {riskLevel} SHORTAGE RISK
                  </span>
                  <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-current shadow-sm">
                    Est. Shortage: {shortageHours}
                  </span>
                </div>

                <div className="font-mono text-slate-900 text-sm font-bold">
                  Estimated critical shortage window: {shortageExactTime}
                </div>

                {/* Mitigation Checklist */}
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2 text-[11px]">
                  <span className="font-bold text-slate-900 block">Automated Mitigation Protocol:</span>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Trigger electronic priority discharge for 18 general ward patients (Expected yield: +18 beds)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mobilize 15-minute rapid housekeeping turnover in Post-Anesthesia Care</span>
                  </div>
                  {riskLevel === 'CRITICAL' && (
                    <div className="flex items-center gap-2 text-rose-800 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Issue Code Yellow Hospital Surge: Defer elective surgical admissions for 48 hours</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
