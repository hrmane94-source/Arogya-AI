import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Clock, 
  Activity, 
  CreditCard, 
  FileText, 
  Bot, 
  User, 
  Search, 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Sparkles, 
  Download, 
  ShieldCheck, 
  MapPin, 
  LogOut,
  BedDouble,
  Heart,
  Volume2,
  VolumeX,
  Stethoscope,
  Plus
} from 'lucide-react';
import { useAuth } from '../../firebase/authContext';
import { collection, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { AppointmentRecord, PatientBillingRecord, TokenConcessionSlip } from '../../types/hospital';
import { INITIAL_DOCTORS, INITIAL_BILLINGS } from '../../data/doctorsAndBilling';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, createSpeechRecognizer } from '../../utils/speech';
import { 
  generateAppointmentSlipPdf, 
  generatePatientInvoicePdf, 
  generateConcessionCertificatePdf 
} from '../../utils/pdfGenerator';
import { GovtHospitalEmblem, PmjayAyushmanLogo } from '../HospitalLogos';
import { 
  PatientAvatarIcon, 
  DoctorAvatarIcon, 
  AskArogyaRobotAvatar, 
  PatientBannerIllustration 
} from '../ShowcaseGraphicAssets';

export const PatientApp: React.FC = () => {
  const { userProfile, logout, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Firestore Appointments
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(INITIAL_DOCTORS[0].id);
  const [appointmentDate, setAppointmentDate] = useState('08 Oct 2026');
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [reason, setReason] = useState('General Consultation & Blood Pressure Checkup');

  // AI Assistant Ask Arogya State
  const [askArogyaQuery, setAskArogyaQuery] = useState('');
  const [askArogyaReply, setAskArogyaReply] = useState<string>(
    'Hello Kavita! I am Ask Arogya, your AI health assistant. Your next appointment with Dr. Rajesh Sharma is today at 10:30 AM (Token #A034). How can I assist you?'
  );
  const [isAsking, setIsAsking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const patientName = userProfile?.displayName || 'Kavita Joshi';
  const uhid = userProfile?.uhid || 'UHID-AROGYA-1042';

  // Listen to Firestore Appointments
  useEffect(() => {
    try {
      const q = collection(db, 'appointments');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list: AppointmentRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as AppointmentRecord);
        });
        if (list.length > 0) {
          setAppointments(list);
        }
      }, (err) => {
        console.warn('Appointments snapshot listener error:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error setting up appointments listener:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const docObj = INITIAL_DOCTORS.find((d) => d.id === selectedDoctorId) || INITIAL_DOCTORS[0];
    const token = `A0${34 + appointments.length}`;

    const newApt: Omit<AppointmentRecord, 'id'> = {
      patientId: userProfile?.uid || 'pt-1042',
      patientName,
      doctorId: docObj.id,
      doctorName: docObj.name,
      department: docObj.specialtyLabel.split(' ')[0],
      date: appointmentDate,
      time: appointmentTime,
      tokenNumber: token,
      status: 'UPCOMING',
      reason,
      createdAt: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    try {
      await addDoc(collection(db, 'appointments'), newApt);
      setIsBookingOpen(false);
      showToast(`Appointment booked successfully! Token No. ${token}`);
    } catch (err) {
      console.error('Error creating appointment:', err);
      showToast('Appointment created locally.');
    }
  };

  const handleAskArogya = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAsking(true);
    setAskArogyaQuery(promptText);

    try {
      const res = await fetch('/api/ai-consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: promptText,
          hospitalState: { userRole: 'patient', patientName, appointmentToken: 'A034' }
        })
      });
      const data = await res.json();
      const reply = data.reply || 'Your appointment is confirmed. Please report to OPD Room 101.';
      setAskArogyaReply(reply);
      stopSpeaking();
      setIsSpeaking(true);
      speakText(reply, () => setIsSpeaking(false));
    } catch (err) {
      console.warn('Ask Arogya error:', err);
      const fallback = `Your appointment with Dr. Rajesh Sharma (Cardiology) is today at 10:30 AM at OPD Room 204. You are token #A034 with an estimated wait time of 22 minutes.`;
      setAskArogyaReply(fallback);
      speakText(fallback, () => setIsSpeaking(false));
    } finally {
      setIsAsking(false);
    }
  };

  const nextAppointment = appointments.find((a) => a.status === 'UPCOMING') || appointments[0] || {
    id: 'apt-default',
    patientId: 'pt-1042',
    patientName: 'Kavita Joshi',
    doctorId: 'doc-cardio-1',
    doctorName: 'Dr. Rajesh Sharma',
    department: 'Cardiology',
    date: 'Today, 08 Oct 2026',
    time: '10:30 AM',
    tokenNumber: 'A034',
    status: 'UPCOMING',
    reason: 'Routine Cardiology Follow-up'
  };

  const patientBillings = INITIAL_BILLINGS;

  const concessionSlip: TokenConcessionSlip = {
    tokenNumber: 'A034',
    patientName,
    age: 58,
    schemeName: 'Ayushman Bharat (PM-JAY)',
    cardNumber: 'AB-PMJAY-9042-8821',
    triagePriority: 'Level 1: Critical Inpatient',
    targetWard: 'Intensive Care Unit (ICU)',
    assignedBed: 'ICU-04 (Bridge Res)',
    standardDailyBedFee: 8500,
    concessionDiscountPct: 100,
    netPayableDaily: 0,
    issuedAt: '10:30 AM',
    validUntil: '72 Hours from Admission',
    authCode: 'AUTH-NHA-404289'
  };

  return (
    <div className="min-h-screen bg-[#f4f8f6] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-400 text-emerald-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Patient Header matching Image Panel 2 */}
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <span className="text-xl font-bold leading-none select-none">☰</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white" />
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
                placeholder="Search doctors, departments, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Right Hospital Location & Profile matching Image 2 */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Metropolis Government Hospital</span>
            <span className="text-slate-400 font-normal">· Bengaluru, Karnataka</span>
          </div>

          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* User Profile Chip matching Image 2 */}
          <div className="flex items-center gap-2.5 pl-1">
            <PatientAvatarIcon size={38} />
            <div className="hidden md:block text-left">
              <div className="text-xs font-black text-slate-900 leading-tight">{patientName}</div>
              <div className="text-[10px] text-slate-500 font-medium">Patient | {uhid}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
              title="Logout from Patient Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body with Left Navigation Sidebar */}
      <div className="flex-1 flex max-w-[1560px] w-full mx-auto p-4 md:p-6 gap-6">
        
        {/* Left Navigation Sidebar matching Image Panel 2 */}
        <aside className="w-64 bg-white border border-emerald-100 rounded-3xl p-4 hidden md:flex flex-col justify-between shrink-0 shadow-sm">
          <nav className="space-y-1.5 font-medium text-xs">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
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
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>My Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('admission')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'admission'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BedDouble className="w-4 h-4" />
              <span>My Admission</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctors</span>
            </button>

            <button
              onClick={() => setActiveTab('bills')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'bills'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Bills</span>
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'schemes'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Government Schemes</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </button>

            <button
              onClick={() => setActiveTab('ask')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'ask'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Ask Arogya</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Ayushman Bharat Citizen Shield */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-2">
            <PmjayAyushmanLogo size={32} className="mx-auto" />
            <div className="text-[11px] font-black text-slate-900">PM-JAY Beneficiary</div>
            <p className="text-[10px] text-slate-500 leading-tight">
              100% Cashless Inpatient & ICU Hospitalization Covered
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 overflow-y-auto">
          
          {/* TAB: HOME DASHBOARD matching Image Panel 2 */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Greeting Banner matching Image 2 */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/90 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
                <div className="space-y-1 z-10 max-w-xl">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Good Morning, {patientName.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">
                    Your health journey, our priority
                  </p>
                </div>

                <div className="z-10 shrink-0">
                  <PatientBannerIllustration />
                </div>
              </div>

              {/* 3 Prominent Cards Grid: Next Appointment, Live Queue, Ask Arogya */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Card 1: Next Appointment matching Image 2 */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Next Appointment
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Upcoming
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mt-3.5">
                      <DoctorAvatarIcon size={48} />
                      <div>
                        <div className="text-sm font-black text-slate-900">{nextAppointment.doctorName}</div>
                        <div className="text-xs text-emerald-700 font-medium">{nextAppointment.department}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                          <div>📅 {nextAppointment.date}</div>
                          <div>🕒 {nextAppointment.time}</div>
                          <div className="text-slate-900 font-bold">🎫 Token No. <strong className="text-emerald-700">{nextAppointment.tokenNumber}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('queue')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Track Queue →</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: Live Queue Status matching Image 2 */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Live Queue Status
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                        Live OPD
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-2.5">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-bold text-xs font-mono">
                        <span>You are</span>
                        <span className="text-emerald-700 text-sm font-black">#4</span>
                        <span>in queue</span>
                      </div>
                      
                      <div className="text-xs text-slate-600 font-mono">
                        Estimated waiting time: <strong className="text-slate-900 font-bold">22 minutes</strong>
                      </div>

                      {/* Progress Track Nodes */}
                      <div className="pt-2 space-y-1.5">
                        <div className="relative flex items-center justify-between">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 z-10"></div>
                          <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-200 z-10 animate-pulse"></div>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono text-center pt-1">
                          3 ahead of you
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => setActiveTab('queue')}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Queue →</span>
                    </button>
                  </div>
                </div>

                {/* Card 3: Ask Arogya (AI Health Assistant) matching Image 2 */}
                <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-600" />
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Ask Arogya
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        Your AI Health Assistant
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <AskArogyaRobotAvatar size={48} />
                      <div className="flex-1 space-y-1.5">
                        <button
                          onClick={() => handleAskArogya('When is my next appointment?')}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 text-[11px] font-medium transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>🕒</span>
                          <span>When is my appointment?</span>
                        </button>
                        <button
                          onClick={() => handleAskArogya('Where is the Cardiology dept located?')}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 text-[11px] font-medium transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>📍</span>
                          <span>Where is the Cardiology dept?</span>
                        </button>
                        <button
                          onClick={() => handleAskArogya('What documents do I need for hospital admission?')}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 text-[11px] font-medium transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>📄</span>
                          <span>What documents do I need?</span>
                        </button>
                        <button
                          onClick={() => handleAskArogya('How do I download my bill statement?')}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 text-[11px] font-medium transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>💳</span>
                          <span>How do I download my bill?</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => handleAskArogya('Give me an updated briefing on hospital bed readiness and queue status.')}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>{isAsking ? 'Thinking...' : 'Tap to speak'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6 Quick Action Tiles matching Image Panel 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">Book Appointment</div>
                </button>

                <button
                  onClick={() => setActiveTab('bills')}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">My Bills</div>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">My Reports</div>
                </button>

                <button
                  onClick={() => setActiveTab('admission')}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">Admission Info</div>
                </button>

                <button
                  onClick={() => setActiveTab('schemes')}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">Govt Schemes</div>
                </button>

                <button
                  onClick={() => {
                    setIsBookingOpen(true);
                  }}
                  className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-2xl text-center space-y-2 transition-all hover:shadow-md group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-900">Find a Doctor</div>
                </button>
              </div>

              {/* Patient-Facing AI Bed & Capacity Availability Section */}
              <div className="bg-white border border-emerald-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-emerald-600" />
                      <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                        AI Bed & Admission Capacity Availability
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time inpatient capacity telemetry and proactive admission readiness
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                    AI Capacity Status: ● Stable
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">General Ward Readiness</span>
                    <div className="text-xl font-black text-slate-900">12 Beds Available</div>
                    <p className="text-[10px] text-slate-500">Immediate admission clearance active</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                    <span className="text-[11px] font-bold text-amber-800">ICU & Critical Care</span>
                    <div className="text-xl font-black text-amber-900">3 Beds Available</div>
                    <p className="text-[10px] text-amber-700">Triage priority allocation active</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800">Emergency & Trauma</span>
                    <div className="text-xl font-black text-emerald-900">5 Beds Available</div>
                    <p className="text-[10px] text-emerald-700">Avg. bed turnaround time: ~35 mins</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-800 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI Forecast: Capacity expected to remain stable for next 12 hours.
                  </span>
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="text-emerald-700 font-black hover:underline"
                  >
                    View Admission Readiness ➔
                  </button>
                </div>
              </div>

              {/* Recent Appointments Table matching Image Panel 2 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                      Recent Appointments & Consultation History
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Book New Slot</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Doctor</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Token</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { id: '1', date: '08 Oct 2026, 10:30 AM', doc: 'Dr. Rajesh Sharma', dept: 'Cardiology', token: 'A034', status: 'Upcoming', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
                        { id: '2', date: '02 Oct 2026, 11:00 AM', doc: 'Dr. Mehta', dept: 'General Medicine', token: 'A021', status: 'Completed', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                        { id: '3', date: '18 Sep 2026, 02:30 PM', doc: 'Dr. Iyer', dept: 'Dermatology', token: 'D018', status: 'Completed', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                        ...appointments.filter(a => !['A034', 'A021', 'D018'].includes(a.tokenNumber)).map(a => ({
                          id: a.id,
                          date: `${a.date}, ${a.time}`,
                          doc: a.doctorName,
                          dept: a.department,
                          token: a.tokenNumber,
                          status: a.status === 'UPCOMING' ? 'Upcoming' : 'Completed',
                          badge: a.status === 'UPCOMING' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }))
                      ].slice(0, 5).map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-900 font-mono">
                            {apt.date}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800">
                            {apt.doc}
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            {apt.dept}
                          </td>
                          <td className="py-3 px-3 font-black text-slate-900 font-mono">
                            {apt.token}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${apt.badge}`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                const found = appointments.find(a => a.tokenNumber === apt.token) || nextAppointment;
                                generateAppointmentSlipPdf(found);
                                showToast(`Appointment slip PDF downloaded for Token ${apt.token}`);
                              }}
                              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY QUEUE */}
          {activeTab === 'queue' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    LIVE CLINICAL QUEUE & ESTIMATED WAIT TRACKER
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time outpatient consultation position for Token {nextAppointment.tokenNumber}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                  Room 204 · Cardiology OPD
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-emerald-100 block uppercase">Your Assigned Token</span>
                    <span className="text-4xl font-black">{nextAppointment.tokenNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-emerald-100 block uppercase">Position in Queue</span>
                    <span className="text-3xl font-black">#4</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <span>Estimated Wait: <strong>~22 Minutes</strong></span>
                  <span>Doctor: <strong>{nextAppointment.doctorName}</strong></span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 font-mono text-xs">
                <h4 className="font-bold text-slate-700 uppercase">Consultation Flow Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Token Generated & Verified at Reception Desk (08 Oct, 09:45 AM)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vital Signs Triage Checked (BP 128/82, SpO2 98%)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                    <span>Currently with Physician: Token A033 · You are next in sequence</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY BILLS */}
          {activeTab === 'bills' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    PATIENT BILLING STATEMENTS & INVOICES
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official itemized computer-generated hospital bills with Ayushman Bharat subsidy breakdown
                  </p>
                </div>
                <GovtHospitalEmblem size={36} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientBillings.map((bill) => (
                  <div key={bill.invoiceId} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-slate-900">Invoice #{bill.invoiceId}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        {bill.paymentStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600">
                      <div>Admitted: <strong>{bill.admittedWard}</strong> (Bed: {bill.bedNumber})</div>
                      <div>Doctor: <strong>{bill.attendingDoctor}</strong></div>
                      <div>Stay: {bill.admissionDate} to {bill.dischargeDate} ({bill.stayDays} Days)</div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Net Payable</span>
                        <span className="text-base font-black text-emerald-700">
                          {bill.totalPayable === 0 ? '₹0 (100% Cashless)' : `₹${bill.totalPayable.toLocaleString()}`}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          generatePatientInvoicePdf(bill);
                          showToast(`Official PDF Invoice downloaded for #${bill.invoiceId}`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF Bill</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GOVERNMENT SCHEMES */}
          {activeTab === 'schemes' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <PmjayAyushmanLogo size={40} />
                  <div>
                    <h2 className="text-base font-black text-slate-900 font-mono">
                      AYUSHMAN BHARAT & GOVERNMENT HEALTH CARDS
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      National Health Authority (NHA) verified citizen subsidy entitlements
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Digital Health Card */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    PM-JAY GOLD CARD
                  </span>
                  <PmjayAyushmanLogo size={32} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-200 font-mono block">BENEFICIARY</span>
                  <div className="text-lg font-black">{patientName}</div>
                  <div className="text-xs font-mono text-emerald-100">AB-PMJAY-9042-8821</div>
                </div>

                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[11px] font-mono">
                  <span>Coverage: <strong>₹5,00,000 / Family / Year</strong></span>
                  <span className="text-emerald-300 font-bold">100% Cashless</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    generateConcessionCertificatePdf(concessionSlip);
                    showToast('Government Concession Certificate PDF downloaded.');
                  }}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono inline-flex items-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Government Concession Certificate PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: MY ADMISSION & BEDS */}
          {activeTab === 'admission' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900 font-mono">
                  ADMISSION STATUS & CAPACITY INTELLIGENCE
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your bed allocation readiness and hospital-wide predictive capacity telemetry
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Active Inpatient Reservation</span>
                  <span className="bg-emerald-200 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                    Bed Unit: ICU-04
                  </span>
                </div>
                <p className="text-slate-700">
                  Your bridge bed unit at Intensive Care Unit (ICU) is currently undergoing sanitization and terminal cleaning.
                </p>
                <div className="text-slate-600">
                  Estimated Bed Allocation Readiness: <strong>~35 Minutes</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ASK AROGYA FULL VIEW */}
          {activeTab === 'ask' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    ASK AROGYA · AI PATIENT ASSISTANT
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Voice and text guidance for hospital appointments, queue, and admission questions
                  </p>
                </div>
                <Bot className="w-7 h-7 text-emerald-600" />
              </div>

              <div className="p-5 rounded-2xl bg-[#f8faf9] border border-slate-200 min-h-[200px] flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2 text-xs text-slate-800 leading-relaxed font-mono">
                  <div className="font-bold text-emerald-800">Arogya AI Response:</div>
                  <p>{askArogyaReply}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a hospital, appointment, or queue question..."
                  value={askArogyaQuery}
                  onChange={(e) => setAskArogyaQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskArogya(askArogyaQuery);
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:border-emerald-500 font-medium"
                />
                <button
                  onClick={() => handleAskArogya(askArogyaQuery)}
                  disabled={isAsking || !askArogyaQuery.trim()}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {isAsking ? 'Thinking...' : 'Send'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: DOCTORS DIRECTORY */}
          {activeTab === 'doctors' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    HOSPITAL SPECIALIST DIRECTORY
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consult qualified senior physicians and surgeons across all medical departments
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_DOCTORS.map((doc) => (
                  <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-emerald-300 transition-all space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                        {doc.name.replace('Dr. ', '').split(' ')[0][0]}{doc.name.replace('Dr. ', '').split(' ')[1]?.[0] || ''}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">{doc.name}</h4>
                        <div className="text-xs text-emerald-700 font-medium truncate">{doc.specialtyLabel}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.qualification}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs text-slate-600 font-mono">
                      <div className="flex justify-between">
                        <span>Clinic Station:</span>
                        <strong className="text-slate-800">{doc.opdRoom}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>OPD Schedule:</span>
                        <strong className="text-slate-800">{doc.consultationTiming}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Consultation Fee:</span>
                        <strong className="text-emerald-700">₹0 (Free via PM-JAY)</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setIsBookingOpen(true);
                      }}
                      className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Book with {doc.name.split(' ')[1] || 'Doctor'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DOCUMENTS & DIGITAL HEALTH RECORDS */}
          {activeTab === 'documents' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    DIGITAL HEALTH RECORDS & OFFICIAL REPORTS
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified clinical diagnostic reports, discharge summaries, and prescriptions linked to UHID {uhid}
                  </p>
                </div>
                <GovtHospitalEmblem size={34} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Inpatient Discharge Summary & Epicrisis',
                    dept: 'Cardiology / Intensive Care Unit',
                    doctor: 'Dr. Rajesh Sharma, MD, DM',
                    date: '05 Oct 2026',
                    type: 'DISCHARGE_SUMMARY',
                    badge: 'Discharge Record'
                  },
                  {
                    title: '12-Lead Electrocardiogram (ECG) Tracing',
                    dept: 'Non-Invasive Diagnostic Lab',
                    doctor: 'Dr. Rajesh Sharma',
                    date: '04 Oct 2026',
                    type: 'ECG_REPORT',
                    badge: 'Diagnostics'
                  },
                  {
                    title: 'Comprehensive Metabolic & Lipid Panel',
                    dept: 'Clinical Pathology Laboratory',
                    doctor: 'Dr. Amit Trivedi, MD Path',
                    date: '04 Oct 2026',
                    type: 'LAB_REPORT',
                    badge: 'Pathology'
                  },
                  {
                    title: 'PM-JAY National Health Cashless Certificate',
                    dept: 'Ayushman Bharat Beneficiary Desk',
                    doctor: 'Medical Superintendent',
                    date: '03 Oct 2026',
                    type: 'SCHEME_CERTIFICATE',
                    badge: 'Government Scheme'
                  }
                ].map((docItem, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 font-mono text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-sans">{docItem.title}</h4>
                        <div className="text-[11px] text-slate-500 mt-0.5">{docItem.dept}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 shrink-0">
                        {docItem.badge}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                      <div>Physician: <strong>{docItem.doctor}</strong></div>
                      <div>Date Issued: <strong>{docItem.date}</strong></div>
                      <div>Verification: <strong className="text-emerald-700">Digitally Verified (ABHA)</strong></div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          generateConcessionCertificatePdf(concessionSlip);
                          showToast(`Downloaded verified document: ${docItem.title}`);
                        }}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Official PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 font-sans">
                    Patient Health Profile & ABHA Identity
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Ayushman Bharat Digital Mission (ABDM) Profile</p>
                </div>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300">
                  {uhid}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Personal Demographics</span>
                  <div className="space-y-1 text-slate-700">
                    <div>Full Name: <strong className="text-slate-900">{patientName}</strong></div>
                    <div>Age & Gender: <strong className="text-slate-900">58 Years · Female</strong></div>
                    <div>Blood Group: <strong className="text-slate-900">O Positive (O+)</strong></div>
                    <div>Registered Mobile: <strong className="text-slate-900">+91 98765 43210</strong></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Digital Government Identifiers</span>
                  <div className="space-y-1 text-slate-700">
                    <div>ABHA Health Number: <strong className="text-slate-900">91-4402-9811-0942</strong></div>
                    <div>PM-JAY Scheme ID: <strong className="text-emerald-700">AB-PMJAY-9042-8821</strong></div>
                    <div>Primary Health Facility: <strong className="text-slate-900">Metropolis Govt Hospital</strong></div>
                    <div>Subsidy Entitlement: <strong className="text-emerald-700">100% Cashless Secondary/Tertiary</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Clinical Alerts & Allergies</span>
                <div className="text-slate-700 space-y-1">
                  <div>Known Allergies: <strong>Penicillin (Mild urticaria noted 2021)</strong></div>
                  <div>Chronic Conditions: <strong>Essential Hypertension, Mild Dyslipidemia</strong></div>
                  <div>Current Inpatient Status: <strong>Pre-Admission / Outpatient Queued (Token A034)</strong></div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Appointment Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-400 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 font-mono">
                  Book Doctor Consultation Slot
                </h3>
              </div>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Select Specialist Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-emerald-500 outline-none"
                >
                  {INITIAL_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialtyLabel} ({d.opdRoom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preferred Date</label>
                  <input
                    type="text"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Chief Reason for Consultation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Chest pain follow-up, ECG review"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  Confirm & Generate Token ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
