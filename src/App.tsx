/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { ForecastView } from './components/ForecastView';
import { EarlyWarningView } from './components/EarlyWarningView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { DigitalTwin } from './components/DigitalTwin';
import { QueueSystem } from './components/QueueSystem';
import { ConcessionSystem } from './components/ConcessionSystem';
import { MLEngineView } from './components/MLEngineView';
import { DoctorDirectory } from './components/DoctorDirectory';
import { PatientBillingView } from './components/PatientBillingView';
import { VoiceConsultantModal } from './components/VoiceConsultantModal';
import { 
  INITIAL_WARDS, 
  INITIAL_ALERTS, 
  INITIAL_QUEUE, 
  generateInitialBeds 
} from './data/initialData';
import { Ward, Bed, EarlyWarningAlert, TriagePatient, Role, DoctorProfile } from './types/hospital';
import { GovtHospitalEmblem, NabhAccreditedBadge, PmjayAyushmanLogo, Level1TraumaCross, MohfwEmblem } from './components/HospitalLogos';
import { Activity, ShieldCheck, Heart, Award, Quote } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeUserRole, setActiveUserRole] = useState<Role>('ADMIN');
  const [activeUserName, setActiveUserName] = useState<string>('Hospital Staff');

  // Navigation & Data State
  const [currentTab, setCurrentTab] = useState<string>('command');
  const [wards, setWards] = useState<Ward[]>(INITIAL_WARDS);
  const [beds, setBeds] = useState<Bed[]>(generateInitialBeds());
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(INITIAL_ALERTS);
  const [queue, setQueue] = useState<TriagePatient[]>(INITIAL_QUEUE);
  
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [selectedPatientForConcession, setSelectedPatientForConcession] = useState<TriagePatient | null>(null);

  const handleLoginSuccess = (selectedRole: Role, userName: string) => {
    setActiveUserRole(selectedRole);
    setActiveUserName(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Execute Recommended Early-Warning Action
  const handleExecuteAction = (alertId: string, actionId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alt) => {
        if (alt.id !== alertId) return alt;
        return {
          ...alt,
          actions: alt.actions.map((act) =>
            act.id === actionId ? { ...act, status: 'EXECUTED' } : act
          )
        };
      })
    );

    if (actionId === 'act-1') {
      setWards((prevWards) =>
        prevWards.map((w) => {
          if (w.id === 'ward-icu') {
            return {
              ...w,
              occupiedBeds: Math.max(0, w.occupiedBeds - 4),
              availableBeds: w.availableBeds + 4,
              riskLevel: 'HIGH'
            };
          }
          return w;
        })
      );
    } else if (actionId === 'act-2') {
      setWards((prevWards) =>
        prevWards.map((w) => {
          if (w.id === 'ward-gen' || w.id === 'ward-icu') {
            return {
              ...w,
              cleaningBeds: Math.max(0, w.cleaningBeds - 1),
              availableBeds: w.availableBeds + 1
            };
          }
          return w;
        })
      );
    }
  };

  const handleUpdateBedStatus = (bedId: string, newStatus: Bed['status']) => {
    setBeds((prevBeds) => {
      const updated = prevBeds.map((b) =>
        b.id === bedId ? { ...b, status: newStatus } : b
      );
      return updated;
    });

    setWards((prevWards) =>
      prevWards.map((ward) => {
        const wardBeds = beds.filter((b) => b.wardId === ward.id);
        const occupied = wardBeds.filter((b) => b.status === 'OCCUPIED' || b.status === 'DISCHARGING').length;
        const available = wardBeds.filter((b) => b.status === 'AVAILABLE').length;
        const cleaning = wardBeds.filter((b) => b.status === 'CLEANING').length;
        const reserved = wardBeds.filter((b) => b.status === 'RESERVED').length;

        return {
          ...ward,
          occupiedBeds: occupied,
          availableBeds: available,
          cleaningBeds: cleaning,
          reservedBeds: reserved
        };
      })
    );
  };

  const handleAddPatient = (patient: TriagePatient) => {
    setQueue((prev) => [patient, ...prev]);
  };

  const handleCallPatient = (patientId: string) => {
    setQueue((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, status: 'WITH_PHYSICIAN', predictedWaitMins: 0 } : p
      )
    );
  };

  const handleOpenConcessionForPatient = (patient: TriagePatient) => {
    setSelectedPatientForConcession(patient);
    setCurrentTab('concession');
  };

  const handleViewBillingForPatient = (_patientName: string) => {
    setCurrentTab('billing');
  };

  const handleBookDoctorToken = (doctor: DoctorProfile) => {
    const tokenNum = `OPD-${doctor.specialty.slice(0, 3)}-${100 + queue.length + 1}`;
    const newPatient: TriagePatient = {
      id: `q-doc-${Date.now()}`,
      tokenNumber: tokenNum,
      patientName: `Patient (${doctor.specialtyLabel.split(' ')[0]} OPD)`,
      age: 38,
      gender: 'General',
      esiLevel: 3,
      chiefComplaint: `Consultation with ${doctor.name} at ${doctor.opdRoom}`,
      arrivalTime: 'Just now',
      predictedWaitMins: doctor.estWaitMins,
      assignedWardTarget: doctor.opdRoom,
      status: 'WAITING',
      govCardScheme: 'Ayushman Bharat (PM-JAY)',
      govCardNumber: 'AB-PMJAY-AUTO-404',
      concessionApplied: true,
      concessionPercent: 100
    };
    handleAddPatient(newPatient);
  };

  const hospitalStateSummary = {
    totalBeds: 300,
    occupiedBeds: 213,
    availableBeds: 87,
    expectedAdmissions: 42,
    expectedDischarges: 31,
    predictedDemand24h: 236,
    shortageRisk: 'HIGH',
    shortageEtaHours: 9,
    icuOccupancyPct: 90
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f9f6] text-slate-800 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 flex flex-col">
      {/* Top Bright Command Header & Role Selector */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeRole={activeUserRole}
        onRoleChange={setActiveUserRole}
        onOpenVoiceConsultant={() => setIsVoiceOpen(true)}
        isVoiceActive={isVoiceOpen}
        alertCount={alerts.filter((a) => a.severity === 'CRITICAL').length}
        userName={activeUserName}
        onLogout={handleLogout}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 md:p-6">
        {currentTab === 'command' && (
          <CommandCenter
            wards={wards}
            alerts={alerts}
            onNavigateTab={setCurrentTab}
            onOpenVoiceConsultant={() => setIsVoiceOpen(true)}
            activeRole={activeUserRole}
          />
        )}

        {currentTab === 'doctors' && (
          <DoctorDirectory
            onBookDoctorToken={handleBookDoctorToken}
            onViewWardBeds={() => setCurrentTab('digital-twin')}
          />
        )}

        {currentTab === 'billing' && <PatientBillingView />}

        {currentTab === 'forecast' && <ForecastView />}

        {currentTab === 'alerts' && (
          <EarlyWarningView
            alerts={alerts}
            onExecuteAction={handleExecuteAction}
          />
        )}

        {currentTab === 'what-if' && <WhatIfSimulator />}

        {currentTab === 'digital-twin' && (
          <DigitalTwin
            wards={wards}
            beds={beds}
            onUpdateBedStatus={handleUpdateBedStatus}
          />
        )}

        {currentTab === 'queue' && (
          <QueueSystem
            queue={queue}
            wards={wards}
            onAddPatient={handleAddPatient}
            onCallPatient={handleCallPatient}
            onOpenConcession={handleOpenConcessionForPatient}
            onViewBilling={handleViewBillingForPatient}
          />
        )}

        {currentTab === 'concession' && (
          <ConcessionSystem initialPatient={selectedPatientForConcession} />
        )}

        {currentTab === 'ml-engine' && <MLEngineView />}
      </main>

      {/* AI Voice Consultant Floating Modal */}
      <VoiceConsultantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        hospitalState={hospitalStateSummary}
      />

      {/* Enhanced Hospital Command Center Operational Footer with Hospital Logos & Quotes */}
      <footer className="mt-auto border-t border-emerald-100 bg-white px-6 py-6 text-xs text-slate-600 shadow-inner">
        <div className="max-w-[1560px] mx-auto space-y-4">
          {/* Top Row: Logos & Hospital Credentials */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <GovtHospitalEmblem size={40} />
              <div>
                <div className="font-extrabold text-slate-900 text-sm">
                  Metropolis Government Hospital & Trauma Command Center
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Affiliated with National Health Authority & Ministry of Health
                </div>
              </div>
            </div>

            {/* Accreditation Partner Logos */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" title="NABH Accredited">
                <NabhAccreditedBadge size={32} />
                <span className="text-[10px] font-mono font-bold text-slate-700 hidden sm:inline">NABH Certified</span>
              </div>
              <div className="flex items-center gap-1.5" title="Ayushman Bharat PM-JAY Partner">
                <PmjayAyushmanLogo size={32} />
                <span className="text-[10px] font-mono font-bold text-slate-700 hidden sm:inline">PM-JAY Partner</span>
              </div>
              <div className="flex items-center gap-1.5" title="Level-1 Trauma Facility">
                <Level1TraumaCross size={32} />
                <span className="text-[10px] font-mono font-bold text-slate-700 hidden sm:inline">Level-1 Trauma</span>
              </div>
              <div className="flex items-center gap-1.5" title="MoHFW Digital Mission">
                <MohfwEmblem size={32} />
              </div>
            </div>
          </div>

          {/* Bottom Row: Quote, Credits, and Live Status */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-black text-slate-900">Arogya AI v4.2</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-900 font-extrabold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Developed by Error 404
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 italic font-serif">
                “To care for him who shall have borne the battle and protect every citizen.”
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span className="text-emerald-800 font-bold">24x7 Emergency Bed Line: 108 / Ext 9911</span>
              <span className="text-slate-300">|</span>
              <span>Arogya AI — Care Beyond Technology</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
