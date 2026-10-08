import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Users, 
  Stethoscope, 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Sparkles, 
  Terminal, 
  FileCheck,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  KeyRound
} from 'lucide-react';
import { AppRole } from '../types/hospital';
import { useAuth } from '../firebase/authContext';
import { GovtHospitalEmblem, NabhAccreditedBadge, PmjayAyushmanLogo, MohfwEmblem } from './HospitalLogos';
import { HospitalBuildingGraphic } from './ShowcaseGraphicAssets';

interface LoginPageProps {
  onOpenTechnicalAccess?: () => void;
  onSelectRoleDirect?: (role: AppRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onOpenTechnicalAccess,
  onSelectRoleDirect 
}) => {
  const { loginWithRole, loginWithOtp, error, clearError, isLoading, switchRole } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<AppRole>('patient');
  const [activeTab, setActiveTab] = useState<'password' | 'otp'>('password');
  
  const [identifier, setIdentifier] = useState('patient.demo@arogya-ai.demo');
  const [password, setPassword] = useState('Arogya@Patient2026');
  const [otp, setOtp] = useState('404404');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Quick switch role context
  const handleSelectRole = (role: AppRole) => {
    setSelectedRole(role);
    clearError();
    setNoticeMessage(null);
    if (role === 'patient') {
      setIdentifier('patient.demo@arogya-ai.demo');
      setPassword('Arogya@Patient2026');
    } else if (role === 'doctor') {
      setIdentifier('doctor.demo@arogya-ai.demo');
      setPassword('Arogya@Doctor2026');
    } else if (role === 'staff') {
      setIdentifier('staff.demo@arogya-ai.demo');
      setPassword('Arogya@Staff2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setNoticeMessage(null);

    if (activeTab === 'password') {
      await loginWithRole(selectedRole, identifier, password);
    } else {
      await loginWithOtp(selectedRole, identifier, otp);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f6] text-slate-800 flex flex-col justify-between font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      
      {/* 1. TOP HEADER matching Image 1 */}
      <header className="px-6 md:px-12 py-3 bg-white/95 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between shadow-xs">
        {/* Left: Arogya AI Logo + Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xs">
            <div className="relative">
              <Heart className="w-6 h-6 fill-emerald-100 stroke-emerald-600 stroke-[2.2]" />
              <Activity className="w-3.5 h-3.5 text-emerald-700 absolute inset-0 m-auto animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">Arogya</span>
              <span className="text-2xl font-black text-emerald-600">AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-tight">
              Smart Care | Smarter Tomorrow
            </p>
          </div>
        </div>

        {/* Center / Right: Government Hospital & Indian National Initiative Ribbon */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <GovtHospitalEmblem size={34} />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-slate-900 leading-tight">Government Hospital</div>
              <div className="text-[10px] text-slate-500 font-medium">Ministry of Health & Family Welfare</div>
            </div>
          </div>

          {/* Tricolor Ribbon: For a Healthier India */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-xs">
            <div className="flex flex-col gap-0.5">
              <span className="w-3.5 h-1 rounded-xs bg-orange-500"></span>
              <span className="w-3.5 h-1 rounded-xs bg-white border border-slate-300"></span>
              <span className="w-3.5 h-1 rounded-xs bg-emerald-600"></span>
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              For a Healthier India
            </span>
          </div>

          {/* Quick Technical Access */}
          {onOpenTechnicalAccess && (
            <button
              onClick={onOpenTechnicalAccess}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Restricted Technical Team Console"
            >
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Tech Access</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN TWO-COLUMN BODY matching Image 1 */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual Showcase & Brand Mission (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Better Healthcare <br />
                <span className="text-emerald-600">with AI</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed pt-1">
                Smart appointments, real-time queues, intelligent bed management and quality care for every citizen.
              </p>
            </div>

            {/* Hospital Architecture Graphic with Indian Flag */}
            <HospitalBuildingGraphic />

            {/* 4 Feature Badges matching Image 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* Badge 1: Easy Appointments */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-3 shadow-xs flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Easy Appointments</div>
                  <div className="text-[10px] text-slate-500">Book from home</div>
                </div>
              </div>

              {/* Badge 2: Live Queue Updates */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-3 shadow-xs flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Live Queue Updates</div>
                  <div className="text-[10px] text-slate-500">Know your wait time</div>
                </div>
              </div>

              {/* Badge 3: AI-Powered Hospital Operations */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-3 shadow-xs flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">AI-Powered Hospital Operations</div>
                  <div className="text-[10px] text-slate-500">Faster, smarter care</div>
                </div>
              </div>

              {/* Badge 4: Secure & Government Aligned */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-3 shadow-xs flex flex-col items-center text-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Secure & Government Aligned</div>
                  <div className="text-[10px] text-slate-500">Your data is safe</div>
                </div>
              </div>
            </div>

            {/* Bottom Slogan Banner Ribbon matching Image 1 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="text-xs sm:text-sm font-bold tracking-tight">
                Healthy People, Stronger Communities
              </span>
            </div>
          </div>

          {/* Right Column: Functional Role-Based Login Card matching Image 1 (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              
              {/* Card Header matching Image 1 */}
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                  <Heart className="w-6 h-6 fill-emerald-100 stroke-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Arogya <span className="text-emerald-600">AI</span>
                  </h2>
                  <div className="text-sm font-bold text-slate-700">Welcome Back</div>
                  <p className="text-xs text-slate-500">Choose your role to continue</p>
                </div>
              </div>

              {/* 3 Role Selection Cards Grid matching Image 1 */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Patient Role */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('patient')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] cursor-pointer ${
                    selectedRole === 'patient'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500 text-emerald-950 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'patient' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black">Patient</span>
                  <span className="text-[9px] text-slate-500 leading-tight">
                    Book, track and manage your care
                  </span>
                </button>

                {/* 2. Doctor Role */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('doctor')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] cursor-pointer ${
                    selectedRole === 'doctor'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500 text-emerald-950 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'doctor' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black">Doctor</span>
                  <span className="text-[9px] text-slate-500 leading-tight">
                    View patients & manage appointments
                  </span>
                </button>

                {/* 3. Hospital Staff Role */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('staff')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[110px] cursor-pointer ${
                    selectedRole === 'staff'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500 text-emerald-950 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 ${
                    selectedRole === 'staff' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black">Hospital Staff</span>
                  <span className="text-[9px] text-slate-500 leading-tight">
                    Handle queues, beds & hospital operations
                  </span>
                </button>
              </div>

              {/* Instant 1-Click Role Direct Preview Action */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center justify-between gap-2">
                <div className="text-[11px] text-emerald-900 font-medium">
                  <span className="font-bold">Instant Preview:</span> Open {selectedRole === 'patient' ? 'Patient Portal' : selectedRole === 'doctor' ? 'Doctor Dashboard' : 'Hospital Operations Command'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectRoleDirect) {
                      onSelectRoleDirect(selectedRole);
                    } else {
                      switchRole(selectedRole);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs cursor-pointer"
                >
                  Enter Now ➔
                </button>
              </div>

              {/* Login Method Tab Pills matching Image 1 */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'password'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('otp')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === 'otp'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Login with OTP
                </button>
              </div>

              {/* Form matching Image 1 inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Input 1: Mobile Number / Email */}
                <div className="space-y-1">
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Mobile Number / Email"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-emerald-500 font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Input 2: Password or OTP */}
                {activeTab === 'password' ? (
                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-emerald-500 font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP (e.g. 404404)"
                        className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-emerald-500 font-mono font-bold tracking-widest text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setOtp('404404');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 cursor-pointer"
                      >
                        {otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password Row matching Image 1 */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNoticeMessage('Password reset link dispatched to registered clinical contact.')}
                    className="text-slate-500 hover:text-emerald-700 font-medium hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {noticeMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
                    {noticeMessage}
                  </div>
                )}

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
                    {error}
                  </div>
                )}

                {/* Main Green Action Button: → Login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm tracking-wide shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>→ Login</span>
                </button>

                {/* OR Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-mono uppercase font-bold">OR</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Secondary Button: Login with OTP */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('otp');
                    setOtpSent(true);
                    setOtp('404404');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  <span>Login with OTP</span>
                </button>

                {/* Footer Link: New here? Create an account */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNoticeMessage('Citizen self-registration is pre-configured. Use instant demo preview or standard credentials.');
                    }}
                    className="text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                  >
                    New here? <span className="font-bold text-slate-900 underline">Create an account →</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* 3. BOTTOM FOOTER BAR matching Image 1 */}
      <footer className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-slate-300 py-3.5 px-6 md:px-12 border-t border-emerald-900/60 shadow-inner">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
          {/* Left Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encrypted Data</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role-based Access</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Government Initiative</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure & Reliable</span>
            </span>
          </div>

          {/* Right Brand Slogan with ECG Line */}
          <div className="flex items-center gap-2 text-emerald-300 font-sans font-bold">
            <span>Arogya AI — Care Beyond Technology</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
        </div>
      </footer>

    </div>
  );
};
