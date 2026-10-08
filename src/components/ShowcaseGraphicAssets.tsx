import React from 'react';

// 1. Hospital Exterior Architecture with Indian Tricolor Flag
export const HospitalBuildingGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-full rounded-3xl overflow-hidden border border-emerald-200/80 shadow-lg bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 ${className}`}>
    <svg viewBox="0 0 800 450" className="w-full h-auto block" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="glassFacade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#0284c7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="whiteStone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <linearGradient id="concretePillar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="flagSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="flagGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Sky Background */}
      <rect x="0" y="0" width="800" height="450" fill="url(#skyGrad)" />

      {/* Sun / Soft Daylight Glow */}
      <circle cx="680" cy="80" r="50" fill="#fef08a" opacity="0.6" />
      <circle cx="680" cy="80" r="70" fill="#fef9c3" opacity="0.3" />

      {/* Distant Clouds */}
      <path d="M 120 70 Q 140 50 170 60 Q 200 45 230 65 Q 260 75 250 90 Q 110 95 120 70 Z" fill="#ffffff" opacity="0.8" />
      <path d="M 460 90 Q 480 75 510 80 Q 540 70 560 85 Q 580 95 570 105 Q 450 110 460 90 Z" fill="#ffffff" opacity="0.7" />

      {/* Distant City / Green Tree Line */}
      <ellipse cx="400" cy="330" rx="440" ry="60" fill="#86efac" opacity="0.4" />
      <ellipse cx="160" cy="320" rx="120" ry="40" fill="#4ade80" opacity="0.6" />
      <ellipse cx="640" cy="320" rx="140" ry="45" fill="#4ade80" opacity="0.6" />

      {/* ================= MAIN HOSPITAL BUILDING COMPLEX ================= */}
      <g filter="url(#softShadow)">
        {/* Left Wing (6 Floors) */}
        <rect x="140" y="140" width="160" height="180" fill="url(#whiteStone)" rx="4" />
        {/* Glass Windows on Left Wing */}
        <rect x="155" y="155" width="130" height="150" fill="url(#glassFacade)" rx="2" />
        {/* Window Grid Lines */}
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6">
          <line x1="155" y1="185" x2="285" y2="185" />
          <line x1="155" y1="215" x2="285" y2="215" />
          <line x1="155" y1="245" x2="285" y2="245" />
          <line x1="155" y1="275" x2="285" y2="275" />
          <line x1="195" y1="155" x2="195" y2="305" />
          <line x1="240" y1="155" x2="240" y2="305" />
        </g>

        {/* Right Wing (6 Floors) */}
        <rect x="500" y="140" width="160" height="180" fill="url(#whiteStone)" rx="4" />
        {/* Glass Windows on Right Wing */}
        <rect x="515" y="155" width="130" height="150" fill="url(#glassFacade)" rx="2" />
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.6">
          <line x1="515" y1="185" x2="645" y2="185" />
          <line x1="515" y1="215" x2="645" y2="215" />
          <line x1="515" y1="245" x2="645" y2="245" />
          <line x1="515" y1="275" x2="645" y2="275" />
          <line x1="555" y1="155" x2="555" y2="305" />
          <line x1="600" y1="155" x2="600" y2="305" />
        </g>

        {/* Central Main Tower (8 Floors) */}
        <rect x="280" y="90" width="240" height="230" fill="url(#whiteStone)" rx="6" />
        {/* Tower Top Header Band with Red/Green Cross */}
        <rect x="280" y="90" width="240" height="36" fill="#047857" rx="4" />
        <text x="400" y="114" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="2" fontFamily="sans-serif">
          METROPOLIS GENERAL HOSPITAL
        </text>

        {/* Central Tower Glass Curtain */}
        <rect x="300" y="135" width="200" height="145" fill="url(#glassFacade)" rx="3" />
        <g stroke="#ffffff" strokeWidth="1.5" opacity="0.7">
          <line x1="300" y1="165" x2="500" y2="165" />
          <line x1="300" y1="195" x2="500" y2="195" />
          <line x1="300" y1="225" x2="500" y2="225" />
          <line x1="300" y1="255" x2="500" y2="255" />
          <line x1="340" y1="135" x2="340" y2="280" />
          <line x1="400" y1="135" x2="400" y2="280" />
          <line x1="460" y1="135" x2="460" y2="280" />
        </g>

        {/* Grand Entrance Portico Canopy */}
        <polygon points="270,285 530,285 550,305 250,305" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
        {/* Concrete Pillars */}
        <rect x="285" y="305" width="16" height="35" fill="url(#concretePillar)" />
        <rect x="360" y="305" width="16" height="35" fill="url(#concretePillar)" />
        <rect x="424" y="305" width="16" height="35" fill="url(#concretePillar)" />
        <rect x="499" y="305" width="16" height="35" fill="url(#concretePillar)" />

        {/* Sliding Glass Main Doors */}
        <rect x="340" y="295" width="120" height="40" fill="#0284c7" opacity="0.7" rx="2" />
        <rect x="380" y="295" width="40" height="40" fill="#e0f2fe" opacity="0.9" />
        <line x1="400" y1="295" x2="400" y2="335" stroke="#0369a1" strokeWidth="2" />

        {/* Emergency Bay Sign on Side */}
        <rect x="155" y="290" width="80" height="18" fill="#dc2626" rx="3" />
        <text x="195" y="302" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          EMERGENCY BAY
        </text>

        {/* ================= INDIAN TRICOLOR FLAG ON ROOFTOP ================= */}
        {/* Flagpole */}
        <rect x="398" y="25" width="4" height="68" fill="#94a3b8" />
        <circle cx="400" cy="24" r="4" fill="#f59e0b" />
        
        {/* Waving Indian National Flag */}
        <g transform="translate(402, 26)">
          {/* Top Saffron Band */}
          <path d="M 0 0 C 18 -4, 38 6, 56 0 L 56 12 C 38 18, 18 8, 0 12 Z" fill="url(#flagSaffron)" />
          {/* Middle White Band */}
          <path d="M 0 12 C 18 8, 38 18, 56 12 L 56 24 C 38 30, 18 20, 0 24 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
          {/* Ashoka Chakra in Center */}
          <circle cx="28" cy="18" r="4" fill="none" stroke="#1e3a8a" strokeWidth="1" />
          <circle cx="28" cy="18" r="1" fill="#1e3a8a" />
          {/* Bottom Green Band */}
          <path d="M 0 24 C 18 20, 38 30, 56 24 L 56 36 C 38 42, 18 32, 0 36 Z" fill="url(#flagGreen)" />
        </g>
      </g>

      {/* Ground & Landscaped Driveway */}
      <rect x="0" y="325" width="800" height="125" fill="#f1f5f9" />
      {/* Front Curving Green Lawns */}
      <path d="M 0 345 Q 160 330 240 350 L 240 450 L 0 450 Z" fill="url(#lawnGrad)" />
      <path d="M 560 350 Q 640 330 800 345 L 800 450 L 560 450 Z" fill="url(#lawnGrad)" />

      {/* Circular Lawn Flowerbed in Center Driveway */}
      <ellipse cx="400" cy="400" rx="90" ry="32" fill="url(#lawnGrad)" />
      <ellipse cx="400" cy="400" rx="80" ry="26" fill="#15803d" />
      <circle cx="400" cy="396" r="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {/* Red Cross in Center Fountain/Emblem */}
      <path d="M 397 388 H 403 V 394 H 409 V 400 H 403 V 406 H 397 V 400 H 391 V 394 H 397 Z" fill="#ef4444" />

      {/* Decorative Palm / Ornamental Trees */}
      <g>
        <rect x="220" y="340" width="5" height="25" fill="#78350f" rx="1" />
        <circle cx="222" cy="336" r="18" fill="#16a34a" />
        <circle cx="222" cy="336" r="14" fill="#22c55e" />

        <rect x="580" y="340" width="5" height="25" fill="#78350f" rx="1" />
        <circle cx="582" cy="336" r="18" fill="#16a34a" />
        <circle cx="582" cy="336" r="14" fill="#22c55e" />
      </g>

      {/* Ambulance parked in driveway */}
      <g transform="translate(180, 360)">
        <rect x="0" y="6" width="46" height="20" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <rect x="34" y="10" width="12" height="12" rx="2" fill="#38bdf8" />
        <rect x="0" y="13" width="46" height="4" fill="#dc2626" />
        <circle cx="10" cy="26" r="5" fill="#334155" />
        <circle cx="36" cy="26" r="5" fill="#334155" />
        <circle cx="20" cy="3" r="2" fill="#ef4444" />
      </g>
    </svg>
  </div>
);

// 2. High-Tech Green Robot Avatar for Ask Arogya
export const AskArogyaRobotAvatar: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="botHead" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#d1fae5" />
      </linearGradient>
      <linearGradient id="botScreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#064e3b" />
        <stop offset="100%" stopColor="#022c22" />
      </linearGradient>
    </defs>
    {/* Glow Ring */}
    <circle cx="50" cy="50" r="48" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
    {/* Antenna */}
    <line x1="50" y1="12" x2="50" y2="24" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="11" r="5" fill="#10b981" />
    {/* Robot Head Outer */}
    <rect x="22" y="24" width="56" height="46" rx="16" fill="url(#botHead)" stroke="#059669" strokeWidth="2.5" />
    {/* Headphone Ears */}
    <rect x="15" y="36" width="9" height="22" rx="4" fill="#059669" />
    <rect x="76" y="36" width="9" height="22" rx="4" fill="#059669" />
    {/* Digital Face Visor */}
    <rect x="30" y="34" width="40" height="26" rx="8" fill="url(#botScreen)" />
    {/* Glowing Friendly Eyes */}
    <circle cx="41" cy="47" r="4.5" fill="#34d399" />
    <circle cx="59" cy="47" r="4.5" fill="#34d399" />
    {/* Smile */}
    <path d="M 45 53 Q 50 56 55 53" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Body Collar */}
    <path d="M 32 74 C 36 70 64 70 68 74 L 72 88 C 50 92 50 92 28 88 Z" fill="#059669" />
    {/* Heart Indicator on Chest */}
    <path d="M 47 79 C 47 77 49 76 50 78 C 51 76 53 77 53 79 C 53 81 50 83 50 83 C 50 83 47 81 47 79 Z" fill="#34d399" />
  </svg>
);

// 3. Indian Patient Woman Avatar (Kavita Joshi)
export const PatientAvatarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div 
    style={{ width: size, height: size }} 
    className={`rounded-full overflow-hidden bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white ring-2 ring-emerald-300 ${className}`}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full block">
      <circle cx="50" cy="50" r="50" fill="#0d9488" />
      {/* Hair */}
      <ellipse cx="50" cy="38" rx="26" ry="24" fill="#1e293b" />
      {/* Neck & Shoulders */}
      <rect x="42" y="58" width="16" height="15" fill="#fcd34d" />
      <path d="M 18 96 C 22 72 78 72 82 96 Z" fill="#0f766e" />
      {/* Traditional Saree Border */}
      <path d="M 28 96 L 50 72 L 58 72 L 40 96 Z" fill="#f59e0b" />
      {/* Face */}
      <ellipse cx="50" cy="46" rx="20" ry="22" fill="#fed7aa" />
      {/* Hair front strands */}
      <path d="M 30 38 Q 50 30 70 38 Q 62 26 50 26 Q 38 26 30 38 Z" fill="#1e293b" />
      {/* Bindi */}
      <circle cx="50" cy="42" r="2" fill="#b91c1c" />
      {/* Eyes */}
      <ellipse cx="43" cy="47" rx="2.5" ry="1.5" fill="#1e293b" />
      <ellipse cx="57" cy="47" rx="2.5" ry="1.5" fill="#1e293b" />
      {/* Smile */}
      <path d="M 45 56 Q 50 60 55 56" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// 4. Doctor Avatar (Dr. Rajesh Sharma)
export const DoctorAvatarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div 
    style={{ width: size, height: size }} 
    className={`rounded-full overflow-hidden bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white ring-2 ring-emerald-300 ${className}`}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full block">
      <circle cx="50" cy="50" r="50" fill="#047857" />
      {/* Hair */}
      <ellipse cx="50" cy="34" rx="22" ry="18" fill="#1e293b" />
      {/* White Coat & Shirt */}
      <path d="M 16 98 C 20 70 80 70 84 98 Z" fill="#ffffff" />
      <path d="M 40 70 L 50 86 L 60 70 Z" fill="#0284c7" />
      {/* Tie */}
      <polygon points="48,74 52,74 54,88 50,92 46,88" fill="#0369a1" />
      {/* Stethoscope around neck */}
      <path d="M 32 74 C 34 88 44 94 44 94 M 68 74 C 66 88 56 94 56 94" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="95" r="4" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="50" cy="44" rx="19" ry="21" fill="#fed7aa" />
      {/* Hair parted */}
      <path d="M 31 34 Q 50 24 69 34 Q 60 22 50 22 Q 40 22 31 34 Z" fill="#1e293b" />
      {/* Eyes */}
      <circle cx="43" cy="44" r="2" fill="#1e293b" />
      <circle cx="57" cy="44" r="2" fill="#1e293b" />
      {/* Glasses */}
      <rect x="37" y="40" width="11" height="8" rx="2" fill="none" stroke="#475569" strokeWidth="1.2" />
      <rect x="52" y="40" width="11" height="8" rx="2" fill="none" stroke="#475569" strokeWidth="1.2" />
      <line x1="48" y1="44" x2="52" y2="44" stroke="#475569" strokeWidth="1.2" />
      {/* Warm Smile */}
      <path d="M 45 54 Q 50 58 55 54" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// 5. Hospital Staff Avatar (Meera Patel - Bed Manager)
export const StaffAvatarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div 
    style={{ width: size, height: size }} 
    className={`rounded-full overflow-hidden bg-gradient-to-tr from-slate-800 to-teal-700 flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white ring-2 ring-emerald-300 ${className}`}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full block">
      <circle cx="50" cy="50" r="50" fill="#0f172a" />
      {/* Hair */}
      <ellipse cx="50" cy="38" rx="25" ry="22" fill="#1e293b" />
      {/* Hospital Scrubs / Uniform */}
      <path d="M 18 96 C 22 72 78 72 82 96 Z" fill="#0d9488" />
      {/* ID Badge Lanyard */}
      <line x1="40" y1="72" x2="48" y2="92" stroke="#f59e0b" strokeWidth="2" />
      <line x1="60" y1="72" x2="52" y2="92" stroke="#f59e0b" strokeWidth="2" />
      <rect x="45" y="90" width="10" height="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
      {/* Face */}
      <ellipse cx="50" cy="46" rx="19" ry="21" fill="#fed7aa" />
      {/* Hair front */}
      <path d="M 31 38 Q 50 30 69 38 Q 60 26 50 26 Q 40 26 31 38 Z" fill="#1e293b" />
      <circle cx="43" cy="46" r="2" fill="#1e293b" />
      <circle cx="57" cy="46" r="2" fill="#1e293b" />
      <path d="M 45 55 Q 50 59 55 55" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// 6. Technical Admin Avatar (Arjun Mehta)
export const AdminAvatarIcon: React.FC<{ size?: number; className?: string }> = ({ size = 44, className = '' }) => (
  <div 
    style={{ width: size, height: size }} 
    className={`rounded-full overflow-hidden bg-gradient-to-tr from-slate-900 to-emerald-900 flex items-center justify-center text-white font-bold shrink-0 shadow-sm border-2 border-white ring-2 ring-emerald-300 ${className}`}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full block">
      <circle cx="50" cy="50" r="50" fill="#022c22" />
      {/* Hair */}
      <ellipse cx="50" cy="35" rx="23" ry="18" fill="#0f172a" />
      {/* Tech Polo / Jacket */}
      <path d="M 18 96 C 22 70 78 70 82 96 Z" fill="#1e293b" />
      <polygon points="40,70 50,84 60,70" fill="#0f172a" />
      {/* Face */}
      <ellipse cx="50" cy="44" rx="19" ry="21" fill="#fed7aa" />
      {/* Hair cropped */}
      <path d="M 32 35 Q 50 24 68 35 Q 60 23 50 23 Q 40 23 32 35 Z" fill="#0f172a" />
      <circle cx="43" cy="44" r="2" fill="#0f172a" />
      <circle cx="57" cy="44" r="2" fill="#0f172a" />
      <path d="M 46 54 Q 50 57 54 54" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  </div>
);

// 7. Patient Banner Illustration (Woman + Tricolor Swirl Ribbon)
export const PatientBannerIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative flex items-center gap-3 select-none ${className}`}>
    {/* Tricolor Swirl Ribbon */}
    <div className="hidden sm:flex flex-col items-end pr-2">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-emerald-200/80 shadow-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
        <span className="text-xs font-bold text-slate-800 tracking-tight font-sans">
          Quality Healthcare for a Healthier India
        </span>
      </div>
    </div>
    {/* Patient Profile Card Illustration */}
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-teal-400 via-emerald-300 to-sky-200 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full block">
          <circle cx="50" cy="50" r="50" fill="#0d9488" />
          <ellipse cx="50" cy="38" rx="26" ry="24" fill="#1e293b" />
          <rect x="42" y="58" width="16" height="15" fill="#fcd34d" />
          <path d="M 18 96 C 22 72 78 72 82 96 Z" fill="#0f766e" />
          <path d="M 28 96 L 50 72 L 58 72 L 40 96 Z" fill="#f59e0b" />
          <ellipse cx="50" cy="46" rx="20" ry="22" fill="#fed7aa" />
          <circle cx="50" cy="42" r="2" fill="#b91c1c" />
          <circle cx="43" cy="47" r="2" fill="#1e293b" />
          <circle cx="57" cy="47" r="2" fill="#1e293b" />
          <path d="M 45 56 Q 50 60 55 56" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
        ✓
      </div>
    </div>
  </div>
);
