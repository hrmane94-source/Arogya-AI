import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './firebase/authContext';
import { LoginPage } from './components/LoginPage';
import { PatientApp } from './components/patient/PatientApp';
import { DoctorApp } from './components/doctor/DoctorApp';
import { StaffApp } from './components/staff/StaffApp';
import { TechnicalConsole } from './components/technical/TechnicalConsole';
import { TechnicalAccessModal } from './components/technical/TechnicalAccessModal';
import { ensureInitialDataSeeded } from './firebase/seedData';
import { Heart } from 'lucide-react';

function AppContent() {
  const { currentUser, userProfile, activeRole, isLoading } = useAuth();
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [isTechnicalConsoleActive, setIsTechnicalConsoleActive] = useState(false);

  // Initialize and seed demo hospital data if empty
  useEffect(() => {
    ensureInitialDataSeeded();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f9f6] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 animate-pulse">
          <Heart className="w-8 h-8 fill-white" />
        </div>
        <div className="text-base font-black text-slate-900 font-sans tracking-tight">
          Arogya <span className="text-emerald-600">AI</span>
        </div>
        <p className="text-xs text-slate-500 font-mono mt-1">Connecting to Clinical Cloud Telemetry...</p>
      </div>
    );
  }

  // 1. Private Technical Console
  if (isTechnicalConsoleActive || activeRole === 'technical_admin') {
    return <TechnicalConsole onExit={() => setIsTechnicalConsoleActive(false)} />;
  }

  // 2. Unauthenticated -> Show Role-Based Master Login Page
  if (!currentUser || !activeRole) {
    return (
      <>
        <LoginPage onOpenTechnicalAccess={() => setIsTechnicalModalOpen(true)} />
        <TechnicalAccessModal
          isOpen={isTechnicalModalOpen}
          onClose={() => setIsTechnicalModalOpen(false)}
          onAccessGranted={() => setIsTechnicalConsoleActive(true)}
        />
      </>
    );
  }

  // 3. Role-Based Applications (Completely Different Workspaces)
  if (activeRole === 'patient') {
    return <PatientApp />;
  }

  if (activeRole === 'doctor') {
    return <DoctorApp />;
  }

  if (activeRole === 'staff') {
    return <StaffApp />;
  }

  // Fallback
  return (
    <LoginPage onOpenTechnicalAccess={() => setIsTechnicalModalOpen(true)} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
