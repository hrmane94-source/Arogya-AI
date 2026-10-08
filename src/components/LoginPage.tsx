import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Calendar, 
  Users, 
  Brain, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  CheckCircle2,
  Stethoscope,
  UserCheck,
  Building,
  Quote,
  Sparkles,
  Award
} from 'lucide-react';
import { Role } from '../types/hospital';
import { 
  GovtHospitalEmblem, 
  NabhAccreditedBadge, 
  PmjayAyushmanLogo, 
  Level1TraumaCross, 
  MohfwEmblem 
} from './HospitalLogos';

interface LoginPageProps {
  onLoginSuccess: (selectedRole: Role, userName: string) => void;
}

export type LoginUserRole = 'PATIENT' | 'DOCTOR' | 'STAFF';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<LoginUserRole>('STAFF');
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('staff@arogya.gov.in');
  const [password, setPassword] = useState('arogya123');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleRoleSelect = (role: LoginUserRole) => {
    setSelectedRole(role);
    if (role === 'STAFF') {
      setIdentifier('staff@arogya.gov.in');
      setPassword('arogya123');
    } else if (role === 'DOCTOR') {
      setIdentifier('dr.sen@arogya.gov.in');
      setPassword('doctor123');
    } else {
      setIdentifier('+91 98765 43210');
      setPassword('patient123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let appRole: Role = 'BED_MANAGER';
    let userName = 'Staff Coordinator';

    if (selectedRole === 'DOCTOR') {
      appRole = 'DOCTOR';
      userName = 'Dr. Aditi Sen (Intensivist)';
    } else if (selectedRole === 'PATIENT') {
      appRole = 'ADMIN';
      userName = 'Patient / Citizen Portal';
    } else {
      appRole = 'ADMIN';
      userName = 'Hospital Operations Staff';
    }

    onLoginSuccess(appRole, userName);
  };

  return (
    <div className="min-h-screen bg-[#f3f9f6] text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Header with Government Hospital Logos & Accreditations */}
      <header className="px-6 md:px-12 py-3.5 flex items-center justify-between border-b border-emerald-100/90 bg-white/90 backdrop-blur-md shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-700/10">
            <div className="relative">
              <Heart className="w-7 h-7 fill-emerald-100 stroke-emerald-600 stroke-[2.2]" />
              <Activity className="w-4 h-4 text-emerald-700 absolute inset-0 m-auto animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900">Arogya</span>
              <span className="text-2xl font-black text-emerald-600">AI</span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                GOVT RECOGNIZED
              </span>
            </div>
            <p className="text-[11px] font-semibold text-emerald-800/80 tracking-wide">
              Smart Care | Smarter Tomorrow · Developed by Error 404
            </p>
          </div>
        </div>

        {/* Official Hospital Emblems Strip */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
            <GovtHospitalEmblem size={38} />
            <div className="text-left font-mono">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Metropolis Govt Hospital
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">
                Ministry of Health & Family Welfare
              </div>
            </div>
          </div>

          {/* Accreditation Badges */}
          <div className="flex items-center gap-2">
            <NabhAccreditedBadge size={34} />
            <PmjayAyushmanLogo size={34} />
            <Level1TraumaCross size={34} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Hero (6.5 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Accreditation Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>NABH Accredited & Ayushman Bharat PM-JAY Level-1 Trauma Center</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Better Healthcare <br />
              <span className="text-emerald-600 relative inline-block">
                with AI
                <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-emerald-400/40 rounded-full"></span>
              </span>
            </h1>
            <p className="text-base text-slate-600 max-w-lg leading-relaxed pt-1">
              Book appointments, manage queues, predict hospital bed surges, and get quality care — faster and easier.
            </p>
          </div>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-2 gap-3.5 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-start gap-3 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Online Appointments</div>
                <div className="text-[11px] text-slate-500">Book & manage your visits</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-start gap-3 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Live Queue Tracking</div>
                <div className="text-[11px] text-slate-500">Know your turn in real-time</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-start gap-3 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">AI Assisted Routing</div>
                <div className="text-[11px] text-slate-500">Right care, right time</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm flex items-start gap-3 hover:border-emerald-300 transition-all hover:shadow-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Secure & Safe</div>
                <div className="text-[11px] text-slate-500">Your health data is protected</div>
              </div>
            </div>
          </div>

          {/* Hospital Building Graphical Card with Glowing Live Queue Widget */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-400 bg-gradient-to-br from-emerald-800 via-teal-900 to-emerald-950 p-6 text-white shadow-xl shadow-emerald-950/20">
            {/* Glowing EKG Background Wave */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-300 font-mono text-xs">
                  <GovtHospitalEmblem size={24} />
                  <span className="font-bold uppercase tracking-wider">GOVERNMENT METROPOLIS HOSPITAL</span>
                </div>
                <div className="text-xl font-bold mt-1 text-white">
                  Active Emergency & Bed Command
                </div>
                <div className="text-xs text-emerald-200/90 mt-0.5 font-mono">
                  300 Total Beds · 87 Available · AI Surge Detection Active
                </div>
              </div>

              {/* Glowing Translucent Live Queue Token Widget */}
              <div className="bg-emerald-950/80 border-2 border-emerald-400/80 backdrop-blur-md rounded-2xl p-4 shadow-xl shadow-emerald-950/60 min-w-[200px]">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-300 font-mono uppercase font-bold">Live Queue</div>
                    <div className="text-base font-black text-white font-mono tracking-tight">Token No. A034</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-800/60 flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>Est. Waiting Time: <strong className="text-white font-bold">18 mins</strong></span>
                </div>
              </div>
            </div>

            {/* Handwriting Tagline & Inspiring Quote */}
            <div className="mt-4 pt-3 border-t border-emerald-700/60 flex flex-wrap items-center justify-between text-xs gap-2">
              <span className="italic font-serif text-emerald-200 text-sm tracking-wide">
                “Healthy People, Stronger Communities”
              </span>
              <span className="text-[11px] font-mono text-emerald-300/90 flex items-center gap-1.5 font-semibold">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Powered by AI | Government Initiative
              </span>
            </div>
          </div>

          {/* Inspirational Healthcare Quote Callout */}
          <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-start gap-3">
            <Quote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="italic text-slate-700 font-serif">
                “Wherever the art of medicine is loved, there is also a love of humanity.”
              </p>
              <span className="font-mono text-[10px] font-bold text-emerald-800 block mt-0.5">
                — Hippocrates, Father of Modern Medicine
              </span>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl border border-emerald-200 p-6 md:p-8 shadow-2xl shadow-emerald-950/10 space-y-5">
            {/* Form Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-2xl">
                <Heart className="w-7 h-7 fill-emerald-100 stroke-emerald-600 stroke-[2.2]" />
                <span className="text-slate-900 font-extrabold">Arogya</span>
                <span className="text-emerald-600 font-extrabold">AI</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 pt-1">Welcome Back</h2>
              <p className="text-xs text-slate-500">
                Choose your role and login to continue
              </p>
            </div>

            {/* Role Cards: Patient, Doctor, Hospital Staff */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('PATIENT')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedRole === 'PATIENT'
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Patient</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                  Appointments & health records
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('DOCTOR')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedRole === 'DOCTOR'
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Doctor</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                  Clinical rounds & discharges
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('STAFF')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedRole === 'STAFF'
                    ? 'border-emerald-500 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Hospital Staff</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">
                  Bed command & live triage
                </div>
              </button>
            </div>

            {/* Login / OTP Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'password'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('otp')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'otp'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                OTP Login
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your registered mobile number or email ID"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>

              {activeTab === 'password' ? (
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 404404)"
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 font-mono font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setOtp('404404');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 whitespace-nowrap"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                  {otpSent && (
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>OTP sent to your number. (Demo code: 404404)</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset instructions dispatched to registered mobile.')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Green CTA Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2"
              >
                <span>➔ Login to Command Center</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-bold absolute">
                  OR
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab(activeTab === 'password' ? 'otp' : 'password');
                  if (!otpSent) {
                    setOtpSent(true);
                    setOtp('404404');
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:border-emerald-400 bg-white text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>{activeTab === 'password' ? 'Login with OTP' : 'Login with Password'}</span>
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => alert('New Registration: Please present your Ayushman ABHA ID or Aadhaar Card at the Government Hospital Admissions desk.')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Create an account ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Bottom Footer Strip with Logos and Credits */}
      <footer className="px-6 md:px-12 py-3.5 border-t border-emerald-100 bg-white flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            Encrypted Healthcare Data
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Role-based Access
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Secure & Reliable
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="font-extrabold text-slate-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Developed by Error 404
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-800 font-bold flex items-center gap-1">
            <span>Arogya AI — Care Beyond Technology</span>
            <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
          </span>
        </div>
      </footer>
    </div>
  );
};
