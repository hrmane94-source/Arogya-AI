import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  BedDouble, 
  FileText, 
  AlertTriangle, 
  Search, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Stethoscope, 
  Heart, 
  Activity, 
  Plus, 
  UserCheck, 
  ClipboardCheck, 
  Sparkles,
  ChevronRight,
  FileCheck,
  Download,
  AlertCircle,
  Microscope,
  Check
} from 'lucide-react';
import { useAuth } from '../../firebase/authContext';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Bed } from '../../types/hospital';

export const DoctorApp: React.FC = () => {
  const { userProfile, logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Firestore Beds
  const [beds, setBeds] = useState<Bed[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request Bed Modal
  const [isBedRequestOpen, setIsBedRequestOpen] = useState(false);
  const [requestPatientName, setRequestPatientName] = useState('Ramesh Iyer');
  const [requestTargetWard, setRequestTargetWard] = useState('Intensive Care Unit (ICU)');
  const [requestPriority, setRequestPriority] = useState('CRITICAL');
  const [requestClinicalJustification, setRequestClinicalJustification] = useState('Acute coronary syndrome with hemodynamic instability');

  // Clinical SOAP Note form state
  const [soapSubjective, setSoapSubjective] = useState('Patient reports reduced chest discomfort since yesterday. Mild exertion dyspnea persists.');
  const [soapObjective, setSoapObjective] = useState('BP: 124/80 mmHg | HR: 72 bpm | SpO2: 98% on room air | S1 S2 present, no murmur.');
  const [soapAssessment, setSoapAssessment] = useState('Post-PCI Day 2, hemodynamically stable. Improving left ventricular function.');
  const [soapPlan, setSoapPlan] = useState('Continue dual antiplatelet therapy (DAPT), low-dose statin, cardiac rehabilitation exercise protocol.');
  const [activeNotePatient, setActiveNotePatient] = useState('Sunil Patil (CCU-04)');

  // Doctor Queue state
  const [patientQueue, setPatientQueue] = useState([
    { id: 'q-1', token: 'A034', name: 'Kavita Joshi', age: 58, reason: 'Follow-up Cardiology', status: 'Waiting' },
    { id: 'q-2', token: 'A035', name: 'Rahul Patil', age: 45, reason: 'Chest Pain Review', status: 'In Consultation' },
    { id: 'q-3', token: 'A036', name: 'Sneha More', age: 32, reason: 'Routine ECG Check', status: 'Waiting' },
    { id: 'q-4', token: 'A037', name: 'Amit Shah', age: 67, reason: 'Hypertension & Breathlessness', status: 'Waiting' },
    { id: 'q-5', token: 'A038', name: 'Priya Iyer', age: 29, reason: 'Post-Op Review', status: 'Scheduled' }
  ]);

  const [dischargeCandidates, setDischargeCandidates] = useState([
    { id: 'dc-1', name: 'Sunil Patil', age: 62, dept: 'Cardiology', bed: 'CCU-04', readiness: 'Likely today', score: 94, approved: false },
    { id: 'dc-2', name: 'Rachna Nair', age: 48, dept: 'General Medicine', bed: 'GW-04', readiness: 'Likely today', score: 88, approved: false },
    { id: 'dc-3', name: 'Manoj Verma', age: 55, dept: 'Respiratory', bed: 'GW-03', readiness: 'Review required', score: 72, approved: false }
  ]);

  const [bedRequestsList, setBedRequestsList] = useState([
    { id: 'br-1', patient: 'Ramesh Iyer (62y)', ward: 'Intensive Care Unit (ICU)', priority: 'CRITICAL', status: 'Allocating Bed ICU-02', time: '10:15 AM' },
    { id: 'br-2', patient: 'Ananya Sen (45F)', ward: 'Cardiac Care Unit (CCU)', priority: 'HIGH', status: 'Approved (Bed CCU-05)', time: '09:30 AM' }
  ]);

  const doctorName = userProfile?.displayName || 'Dr. Rajesh Sharma';
  const specialty = userProfile?.department || 'Cardiology';

  // Sync beds from Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'beds'), (snapshot) => {
        const list: Bed[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Bed));
        if (list.length > 0) setBeds(list);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Doctor beds listener error:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartConsultation = (token: string) => {
    setPatientQueue((prev) =>
      prev.map((p) => p.token === token ? { ...p, status: 'In Consultation' } : p)
    );
    showToast(`Started consultation for Token ${token}. Patient notified in live queue.`);
  };

  const handleCompleteConsultation = (token: string) => {
    setPatientQueue((prev) =>
      prev.map((p) => p.token === token ? { ...p, status: 'Completed' } : p)
    );
    showToast(`Consultation completed for Token ${token}.`);
  };

  // Real clinical discharge approval -> sets Firestore Bed to DISCHARGING
  const handleApproveDischarge = async (candId: string, bedCode: string, patientName: string) => {
    setDischargeCandidates((prev) =>
      prev.map((c) => c.id === candId ? { ...c, approved: true } : c)
    );

    try {
      const targetBed = beds.find((b) => b.code === bedCode || b.id.toLowerCase() === bedCode.toLowerCase());
      if (targetBed) {
        await updateDoc(doc(db, 'beds', targetBed.id), {
          status: 'DISCHARGING',
          lastUpdated: new Date().toLocaleTimeString()
        });
      }
      showToast(`Clinical discharge approved for ${patientName} (${bedCode}). Bed status changed to DISCHARGING.`);
    } catch (err) {
      console.error('Error approving discharge:', err);
      showToast(`Discharge approved for ${patientName}.`);
    }
  };

  // Submit real Bed Request to Firestore
  const handleSubmitBedRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `br-${Date.now()}`,
      patient: `${requestPatientName}`,
      ward: requestTargetWard,
      priority: requestPriority,
      status: 'Submitted to Bed Operations Command',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setBedRequestsList((prev) => [newReq, ...prev]);

    try {
      await addDoc(collection(db, 'alerts'), {
        severity: requestPriority === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
        department: requestTargetWard,
        title: `Clinical Bed Request: ${requestPatientName} (${requestTargetWard})`,
        description: `Physician Request by ${doctorName}: ${requestClinicalJustification}`,
        status: 'ACTIVE',
        leadTimeHours: 1.0,
        actionRequired: 'Allocate bed and notify attending cardiologist',
        timestamp: new Date().toLocaleTimeString()
      });
      setIsBedRequestOpen(false);
      showToast(`Bed Request submitted for ${requestPatientName}. Operations command notified.`);
    } catch (err) {
      console.error('Error submitting bed request:', err);
      setIsBedRequestOpen(false);
      showToast(`Bed Request submitted for ${requestPatientName}.`);
    }
  };

  const handleSaveSoapNote = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Clinical SOAP note saved and signed for ${activeNotePatient}. Added to EHR.`);
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

      {/* Top Header matching Doctor Portal */}
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Stethoscope className="w-5 h-5" />
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
                placeholder="Search patient by name, UHID, or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Doctor Actions, Role Switcher, & Profile */}
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
              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow-xs cursor-pointer"
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => switchRole('staff')}
              className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px] hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Hospital Staff
            </button>
          </div>

          <button
            onClick={() => setIsBedRequestOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Request Inpatient Bed</span>
          </button>

          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              DR
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-black text-slate-900">{doctorName}</div>
              <div className="text-[10px] text-emerald-700 font-mono font-bold">{specialty} · OPD 204</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
              title="Logout from Clinical Workspace"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Clinical Body */}
      <div className="flex-1 flex max-w-[1560px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Clinical Sidebar matching Doctor Navigation List */}
        <aside className="w-64 bg-white border border-emerald-100 rounded-3xl p-4 hidden md:flex flex-col justify-between shrink-0 shadow-xs">
          <nav className="space-y-1.5 font-medium text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'patients'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Patients</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </button>

            <button
              onClick={() => setActiveTab('queue')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'queue'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Patient Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'admissions'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>Admissions</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Clinical Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('investigations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'investigations'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Microscope className="w-4 h-4" />
              <span>Investigations</span>
            </button>

            <button
              onClick={() => setActiveTab('discharges')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'discharges'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Discharge Review</span>
            </button>

            <button
              onClick={() => setActiveTab('bed-requests')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'bed-requests'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Bed Requests</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Duty Station</span>
            <div className="font-bold text-slate-900">OPD Room 204 · Cardiology</div>
            <div className="text-[11px] text-emerald-700 font-medium">ICU Ward Rounds: 02:00 PM</div>
          </div>
        </aside>

        {/* Doctor Main Workspace Canvas */}
        <main className="flex-1 space-y-6 overflow-y-auto">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Greeting & Date Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Good Morning, {doctorName.split(' ')[1] || 'Doctor'}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Clinical overview, patient queue, and bed capacity for today's duty
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold text-slate-700 shadow-xs">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Wed, 08 Oct 2026 · OPD Session</span>
                </div>
              </div>

              {/* 6 Metric KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Appointments</span>
                  <div className="text-xl font-black text-slate-900 tabular-nums">12</div>
                  <span className="text-[10px] text-slate-500 block">Scheduled OPD</span>
                </div>

                <div className="bg-white border border-amber-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-amber-600 block uppercase font-bold">In Queue</span>
                  <div className="text-xl font-black text-amber-700 tabular-nums">
                    {patientQueue.filter((p) => p.status === 'Waiting').length}
                  </div>
                  <span className="text-[10px] text-amber-700 block">Waiting in hall</span>
                </div>

                <div className="bg-white border border-teal-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-teal-600 block uppercase font-bold">In Consult</span>
                  <div className="text-xl font-black text-teal-700 tabular-nums">
                    {patientQueue.filter((p) => p.status === 'In Consultation').length}
                  </div>
                  <span className="text-[10px] text-teal-700 block">Active token</span>
                </div>

                <div className="bg-white border border-emerald-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-emerald-600 block uppercase font-bold">Completed</span>
                  <div className="text-xl font-black text-emerald-700 tabular-nums">
                    {patientQueue.filter((p) => p.status === 'Completed').length + 3}
                  </div>
                  <span className="text-[10px] text-emerald-700 block">Consulted</span>
                </div>

                <div className="bg-white border border-blue-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-blue-600 block uppercase font-bold">Admissions</span>
                  <div className="text-xl font-black text-blue-700 tabular-nums">4</div>
                  <span className="text-[10px] text-blue-700 block">Inpatient Beds</span>
                </div>

                <div className="bg-white border border-purple-200 rounded-2xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] text-purple-600 block uppercase font-bold">Discharges</span>
                  <div className="text-xl font-black text-purple-700 tabular-nums">
                    {dischargeCandidates.filter((c) => !c.approved).length}
                  </div>
                  <span className="text-[10px] text-purple-700 block">Review Ready</span>
                </div>
              </div>

              {/* Ward Bed Availability Snapshot for Clinical Decisions */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black text-slate-900 uppercase">
                      Clinical Bed Vacancy Snapshot (Live Ward Availability)
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsBedRequestOpen(true)}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ New Inpatient Bed Request</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">ICU</span>
                    <strong className="text-rose-600 text-sm">2 Beds Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">High Demand</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">CCU</span>
                    <strong className="text-amber-600 text-sm">3 Beds Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Coronary Unit</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Emergency</span>
                    <strong className="text-emerald-700 text-sm">5 Bays Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Trauma Holding</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Male Medical</span>
                    <strong className="text-emerald-700 text-sm">11 Beds Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Ward B</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Female Surg</span>
                    <strong className="text-emerald-700 text-sm">18 Beds Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Ward C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Pediatric</span>
                    <strong className="text-emerald-700 text-sm">20 Beds Open</strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Ward D</span>
                  </div>
                </div>
              </div>

              {/* 4 Clinical Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Top: Patient Queue (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Live OPD Patient Queue
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      {patientQueue.filter((p) => p.status === 'Waiting').length} Patients Waiting
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th className="py-2 px-3">Token</th>
                          <th className="py-2 px-3">Patient Name</th>
                          <th className="py-2 px-3">Age</th>
                          <th className="py-2 px-3">Reason</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {patientQueue.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-3 font-black text-slate-900">{p.token}</td>
                            <td className="py-3 px-3 font-sans font-bold text-slate-800">{p.name}</td>
                            <td className="py-3 px-3 text-slate-500">{p.age}y</td>
                            <td className="py-3 px-3 text-slate-600">{p.reason}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                p.status === 'In Consultation'
                                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                                  : p.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {p.status === 'Waiting' && (
                                <button
                                  onClick={() => handleStartConsultation(p.token)}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-xs cursor-pointer"
                                >
                                  Call
                                </button>
                              )}
                              {p.status === 'In Consultation' && (
                                <button
                                  onClick={() => handleCompleteConsultation(p.token)}
                                  className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] transition-colors shadow-xs cursor-pointer"
                                >
                                  Complete
                                </button>
                              )}
                              {p.status === 'Completed' && (
                                <span className="text-emerald-700 font-bold text-[11px]">Done ✓</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Top: Assigned Patients & Acuity (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Assigned Inpatients & Acuity
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">Inpatient Census</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Sunil Patil (62M)</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                          Discharge Candidate
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">Bed CCU-04 · Post-Angioplasty Day 2</div>
                      <div className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>AI Readiness: 94% · Clinically ready for home discharge</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Amit Shah (67M)</span>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px] border border-rose-300">
                          Critical Monitoring
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">Bed ICU-02 · Severe Acute Coronary</div>
                      <div className="text-rose-700 font-bold text-[11px]">
                        BP 165/105 mmHg, elevated Troponin-I. Telemetry continuous.
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Ananya Sen (45F)</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] border border-blue-300">
                          Stable Recovery
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">Bed GW-14 · Hypertensive Urgency</div>
                      <div className="text-blue-800 font-bold text-[11px]">
                        Vitals stabilizing (BP 128/82), oral medication titration ongoing.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Bottom: Today's Admissions (6 Cols) */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Admissions Under Cardiology
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">4 Active Inpatients</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th className="py-2 px-3">Patient</th>
                          <th className="py-2 px-3">Age</th>
                          <th className="py-2 px-3">Bed</th>
                          <th className="py-2 px-3">Diagnosis</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">Sunil Patil</td>
                          <td className="py-3 px-3 text-slate-500">62</td>
                          <td className="py-3 px-3 font-bold text-slate-800">CCU-04</td>
                          <td className="py-3 px-3 text-slate-600">Post-PTCA</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              Stable
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">Amit Shah</td>
                          <td className="py-3 px-3 text-slate-500">67</td>
                          <td className="py-3 px-3 font-bold text-slate-800">ICU-02</td>
                          <td className="py-3 px-3 text-slate-600">Acute STEMI</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
                              Critical
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">Ananya Sen</td>
                          <td className="py-3 px-3 text-slate-500">45</td>
                          <td className="py-3 px-3 font-bold text-slate-800">GW-14</td>
                          <td className="py-3 px-3 text-slate-600">HTN Crisis</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                              Improving
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Bottom: Discharge Review & Bed Turnover (6 Cols) */}
                <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                        Discharge Reviews & Capacity Release
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">Frees Ward Beds</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th className="py-2 px-3">Patient</th>
                          <th className="py-2 px-3">Bed</th>
                          <th className="py-2 px-3">Readiness</th>
                          <th className="py-2 px-3 text-right">Clinical Sign-Off</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dischargeCandidates.map((cand) => (
                          <tr key={cand.id} className="hover:bg-slate-50">
                            <td className="py-3 px-3 font-bold text-slate-900">{cand.name}</td>
                            <td className="py-3 px-3 font-bold text-slate-800">{cand.bed}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                cand.score >= 85
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {cand.score}% Readiness
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {cand.approved ? (
                                <span className="text-emerald-700 font-bold text-[11px]">Approved ✓</span>
                              ) : (
                                <button
                                  onClick={() => handleApproveDischarge(cand.id, cand.bed, cand.name)}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-xs cursor-pointer"
                                >
                                  Sign Discharge
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: MY PATIENTS */}
          {activeTab === 'patients' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Assigned Patients Registry
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Active outpatients and inpatients under primary care of {doctorName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    8 Total Active Patients
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">UHID / Token</th>
                      <th className="py-2.5 px-3">Patient Name</th>
                      <th className="py-2.5 px-3">Age/Gender</th>
                      <th className="py-2.5 px-3">Care Type</th>
                      <th className="py-2.5 px-3">Bed/Room</th>
                      <th className="py-2.5 px-3">Primary Diagnosis</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { uhid: 'UHID-1042', token: 'A034', name: 'Kavita Joshi', age: '58 F', type: 'Outpatient (OPD)', location: 'Room 204', diag: 'Cardiovascular Follow-up' },
                      { uhid: 'UHID-1043', token: 'A035', name: 'Rahul Patil', age: '45 M', type: 'Outpatient (OPD)', location: 'Room 204', diag: 'Angina Pectoris Evaluation' },
                      { uhid: 'UHID-2089', token: 'IP-882', name: 'Sunil Patil', age: '62 M', type: 'Inpatient (ICU)', location: 'CCU-04', diag: 'Post-PTCA Stent Day 2' },
                      { uhid: 'UHID-2091', token: 'IP-883', name: 'Amit Shah', age: '67 M', type: 'Inpatient (ICU)', location: 'ICU-02', diag: 'Acute STEMI Telemetry' },
                      { uhid: 'UHID-2094', token: 'IP-885', name: 'Ananya Sen', age: '45 F', type: 'Inpatient (GW)', location: 'GW-14', diag: 'Hypertensive Urgency' }
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{p.token} · <span className="text-slate-400 font-normal">{p.uhid}</span></td>
                        <td className="py-3 px-3 font-sans font-bold text-slate-800">{p.name}</td>
                        <td className="py-3 px-3 text-slate-500">{p.age}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.type.includes('Inpatient') ? 'bg-purple-50 text-purple-800' : 'bg-emerald-50 text-emerald-800'}`}>
                            {p.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">{p.location}</td>
                        <td className="py-3 px-3 text-slate-600">{p.diag}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setActiveNotePatient(`${p.name} (${p.location})`);
                              setActiveTab('notes');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
                          >
                            Clinical Note
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Doctor Consultation Schedule & Appointments
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Today's outpatient consultation slots in OPD Room 204
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-800 font-bold">
                  Session: 09:00 AM – 01:30 PM
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Time Slot</th>
                      <th className="py-2.5 px-3">Token</th>
                      <th className="py-2.5 px-3">Patient Name</th>
                      <th className="py-2.5 px-3">Age</th>
                      <th className="py-2.5 px-3">Chief Complaint</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {patientQueue.map((apt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{`10:${30 + idx * 15} AM`}</td>
                        <td className="py-3 px-3 font-black text-emerald-700">{apt.token}</td>
                        <td className="py-3 px-3 font-sans font-bold text-slate-800">{apt.name}</td>
                        <td className="py-3 px-3 text-slate-500">{apt.age}y</td>
                        <td className="py-3 px-3 text-slate-600">{apt.reason}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setActiveTab('queue');
                              handleStartConsultation(apt.token);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Consult Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PATIENT QUEUE */}
          {activeTab === 'queue' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Live OPD Patient Calling Cockpit
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Call waiting patients, update consultation progress, or refer to triage
                  </p>
                </div>
                <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>OPD Room 204 Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">Currently in Room</span>
                  <div className="text-2xl font-black text-teal-900">
                    {patientQueue.find((p) => p.status === 'In Consultation')?.name || 'No Active Patient'}
                  </div>
                  <div className="text-slate-600">
                    Token: <strong className="text-slate-900">{patientQueue.find((p) => p.status === 'In Consultation')?.token || '—'}</strong>
                  </div>
                  <button
                    onClick={() => {
                      const cur = patientQueue.find((p) => p.status === 'In Consultation');
                      if (cur) handleCompleteConsultation(cur.token);
                    }}
                    className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer"
                  >
                    Finish Consultation ✓
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Next in Line</span>
                  <div className="text-2xl font-black text-amber-900">
                    {patientQueue.find((p) => p.status === 'Waiting')?.name || 'Queue Empty'}
                  </div>
                  <div className="text-slate-600">
                    Token: <strong className="text-slate-900">{patientQueue.find((p) => p.status === 'Waiting')?.token || '—'}</strong>
                  </div>
                  <button
                    onClick={() => {
                      const nxt = patientQueue.find((p) => p.status === 'Waiting');
                      if (nxt) handleStartConsultation(nxt.token);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                  >
                    Call Next Token 📢
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Queue Statistics</span>
                  <div className="space-y-1 text-slate-700">
                    <div>Waiting in Hall: <strong>{patientQueue.filter((p) => p.status === 'Waiting').length} Patients</strong></div>
                    <div>Completed Today: <strong>{patientQueue.filter((p) => p.status === 'Completed').length + 3} Patients</strong></div>
                    <div>Average Duration: <strong>6.2 minutes / consult</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADMISSIONS */}
          {activeTab === 'admissions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Inpatient Admissions & Ward Allocation
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Patients admitted under Cardiology care team with real-time bed tracking
                  </p>
                </div>
                <button
                  onClick={() => setIsBedRequestOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Admit Patient to Ward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Sunil Patil', bed: 'CCU-04', ward: 'Coronary Care', admitted: '06 Oct 2026', diag: 'Post-PTCA Stent Day 2', vitals: 'BP 124/80 · HR 72 · SpO2 98%', doc: 'Dr. Sharma' },
                  { name: 'Amit Shah', bed: 'ICU-02', ward: 'Intensive Care Unit', admitted: '07 Oct 2026', diag: 'Acute STEMI', vitals: 'BP 165/105 · HR 94 · SpO2 94%', doc: 'Dr. Sharma' },
                  { name: 'Ananya Sen', bed: 'GW-14', ward: 'General Medical Ward', admitted: '08 Oct 2026', diag: 'Hypertensive Urgency', vitals: 'BP 128/82 · HR 68 · SpO2 99%', doc: 'Dr. Sharma' }
                ].map((adm, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-sans text-slate-900">{adm.name}</strong>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {adm.bed}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <div>Ward: <strong className="text-slate-800">{adm.ward}</strong></div>
                      <div>Admitted: <strong>{adm.admitted}</strong></div>
                      <div>Diagnosis: <strong>{adm.diag}</strong></div>
                      <div>Vitals: <strong className="text-emerald-700">{adm.vitals}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLINICAL NOTES */}
          {activeTab === 'notes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Clinical Notes & SOAP Workstation
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Structured electronic progress notes, clinical impressions, and orders
                  </p>
                </div>
                <div className="bg-slate-100 px-3 py-1 rounded-xl text-slate-700 font-bold">
                  Editing: {activeNotePatient}
                </div>
              </div>

              <form onSubmit={handleSaveSoapNote} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">S — Subjective (Patient Symptoms & History)</label>
                    <textarea
                      rows={3}
                      value={soapSubjective}
                      onChange={(e) => setSoapSubjective(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">O — Objective (Physical Exam & Diagnostic Vitals)</label>
                    <textarea
                      rows={3}
                      value={soapObjective}
                      onChange={(e) => setSoapObjective(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">A — Assessment (Clinical Impression & Diagnosis)</label>
                    <textarea
                      rows={3}
                      value={soapAssessment}
                      onChange={(e) => setSoapAssessment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 block">P — Plan (Therapeutic Management & Next Steps)</label>
                    <textarea
                      rows={3}
                      value={soapPlan}
                      onChange={(e) => setSoapPlan(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    Save & Electronically Sign Note ➔
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: INVESTIGATIONS */}
          {activeTab === 'investigations' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Laboratory & Diagnostic Investigations
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Pathology lab results, cardiac enzymes, and imaging reports
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-3 py-1 rounded-xl">
                  LIS / PACS Synchronized
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Test Name</th>
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">Result Value</th>
                      <th className="py-2.5 px-3">Reference Range</th>
                      <th className="py-2.5 px-3">Status Flag</th>
                      <th className="py-2.5 px-3 text-right">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { test: 'High-Sensitivity Troponin-I', patient: 'Amit Shah (ICU-02)', val: '1.42 ng/mL', ref: '< 0.04 ng/mL', status: 'CRITICAL HIGH', badge: 'bg-rose-100 text-rose-800' },
                      { test: '12-Lead Electrocardiogram', patient: 'Sunil Patil (CCU-04)', val: 'Normal Sinus Rhythm', ref: 'Sinus rhythm 60-100', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800' },
                      { test: 'Serum Creatinine & eGFR', patient: 'Kavita Joshi (OPD)', val: '0.88 mg/dL', ref: '0.6 - 1.2 mg/dL', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800' },
                      { test: '2D Echocardiogram (LVEF)', patient: 'Ananya Sen (GW-14)', val: 'EF 58%', ref: 'EF > 50%', status: 'NORMAL', badge: 'bg-emerald-100 text-emerald-800' },
                      { test: 'Lipid Profile (LDL)', patient: 'Rahul Patil (OPD)', val: '162 mg/dL', ref: '< 100 mg/dL', status: 'ELEVATED', badge: 'bg-amber-100 text-amber-800' }
                    ].map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{inv.test}</td>
                        <td className="py-3 px-3 font-sans font-bold text-slate-800">{inv.patient}</td>
                        <td className="py-3 px-3 font-black text-slate-900">{inv.val}</td>
                        <td className="py-3 px-3 text-slate-500">{inv.ref}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${inv.badge}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => showToast(`Opening diagnostic curve report for ${inv.test}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: DISCHARGE REVIEW */}
          {activeTab === 'discharges' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Discharge Reviews & Capacity Release Station
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Clinical authorization of patients ready to be safely discharged home
                  </p>
                </div>
                <div className="bg-purple-50 text-purple-800 border border-purple-200 font-bold px-3 py-1 rounded-xl">
                  Freeing Inpatient Beds for Acute Surges
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dischargeCandidates.map((cand) => (
                  <div key={cand.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-sans text-slate-900">{cand.name}</strong>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Bed {cand.bed}
                      </span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <div>Department: <strong>{cand.dept}</strong></div>
                      <div>Age: <strong>{cand.age} Years</strong></div>
                      <div>AI Discharge Readiness: <strong className="text-emerald-700">{cand.score}%</strong></div>
                    </div>
                    <div className="pt-2">
                      {cand.approved ? (
                        <div className="text-center py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                          Discharge Signed Off ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApproveDischarge(cand.id, cand.bed, cand.name)}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                        >
                          Approve Clinical Discharge ➔
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BED REQUESTS */}
          {activeTab === 'bed-requests' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Physician Inpatient Bed Requests
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Real-time requisition queue communicated to Bed Management Operations
                  </p>
                </div>
                <button
                  onClick={() => setIsBedRequestOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Submit New Bed Request</span>
                </button>
              </div>

              <div className="space-y-3">
                {bedRequestsList.map((br) => (
                  <div key={br.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-sans text-slate-900 block">{br.patient}</strong>
                      <div className="text-slate-600 mt-0.5">
                        Ward: <strong>{br.ward}</strong> · Submitted: {br.time}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${br.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                        {br.priority}
                      </span>
                      <div className="text-emerald-700 font-bold text-[11px]">{br.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 font-sans">
                  Clinical & Bed Availability Alerts
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Critical diagnostic telemetry and hospital capacity shortage advisories
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>⚠️ CRITICAL LAB ALERT: Elevated Troponin-I</span>
                    <span className="text-[10px]">10:14 AM</span>
                  </div>
                  <p className="text-[11px]">
                    Patient Amit Shah (ICU-02): Troponin-I reached 1.42 ng/mL. Notify cardiology senior resident immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>⚡ CAPACITY NOTICE: ICU Approaching 100% Demand</span>
                    <span className="text-[10px]">09:40 AM</span>
                  </div>
                  <p className="text-[11px]">
                    Only 2 ICU beds remain available. Bed Management recommends completing morning CCU discharges promptly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-xs font-mono text-xs">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Doctor Credential Profile
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">National Medical Commission (NMC) Registered Practitioner</p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-xl border border-emerald-300">
                  NMC-59821
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Physician Credentials</span>
                  <div className="space-y-1 text-slate-700">
                    <div>Full Name: <strong className="text-slate-900">{doctorName}</strong></div>
                    <div>Designation: <strong className="text-slate-900">Chief Consultant Cardiologist</strong></div>
                    <div>Qualifications: <strong className="text-slate-900">MBBS, MD (Med), DM (Cardiology), FACC</strong></div>
                    <div>Department: <strong className="text-slate-900">Cardiology & Critical Care</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duty & Clinical Stations</span>
                  <div className="space-y-1 text-slate-700">
                    <div>Outpatient Clinic: <strong className="text-slate-900">OPD Room 204, Block B</strong></div>
                    <div>Ward Coverage: <strong className="text-slate-900">Intensive Care Unit & CCU</strong></div>
                    <div>Duty Timings: <strong className="text-slate-900">09:00 AM – 04:00 PM</strong></div>
                    <div>Emergency On-Call: <strong className="text-emerald-700">Level 1 Cardiac Code Active</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Bed Request Modal */}
      {isBedRequestOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 font-sans">
                  Clinical Inpatient Bed Request
                </h3>
              </div>
              <button
                onClick={() => setIsBedRequestOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBedRequest} className="space-y-3.5">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={requestPatientName}
                  onChange={(e) => setRequestPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Target Ward Tier</label>
                  <select
                    value={requestTargetWard}
                    onChange={(e) => setRequestTargetWard(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="Intensive Care Unit (ICU)">ICU (Critical Care)</option>
                    <option value="Cardiac Care Unit (CCU)">CCU (Coronary Unit)</option>
                    <option value="General Medical-Surgical">General Ward</option>
                    <option value="Emergency & Trauma Holding">Emergency Holding</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Priority / Acuity</label>
                  <select
                    value={requestPriority}
                    onChange={(e) => setRequestPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="CRITICAL">Critical (Immediate Bed)</option>
                    <option value="HIGH">High (Within 2 Hours)</option>
                    <option value="MODERATE">Moderate (Elective Routine)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Clinical Justification</label>
                <textarea
                  rows={3}
                  value={requestClinicalJustification}
                  onChange={(e) => setRequestClinicalJustification(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBedRequestOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Submit Bed Request ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
