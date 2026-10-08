import React from 'react';

// 1. Official Government Hospital Emblem Crest
export const GovtHospitalEmblem: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="crestGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
    </defs>
    {/* Outer Circular Ring with Dashes */}
    <circle cx="50" cy="50" r="46" stroke="url(#crestGreen)" strokeWidth="3" fill="#ffffff" />
    <circle cx="50" cy="50" r="41" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 2" fill="#f0fdf4" />
    {/* Ashoka / Pillar Pillars Stylized */}
    <path d="M42 22 H58 V26 H42 Z" fill="url(#crestGold)" />
    <path d="M44 26 H46 V44 H44 Z M49 26 H51 V44 H49 Z M54 26 H56 V44 H54 Z" fill="url(#crestGold)" />
    <path d="M40 44 H60 V48 H40 Z" fill="url(#crestGold)" />
    {/* Medical Red/Green Cross in Shield */}
    <path d="M50 50 L64 56 C64 72 50 82 50 82 C50 82 36 72 36 56 Z" fill="url(#crestGreen)" />
    {/* White Cross Inside Shield */}
    <path d="M47 57 H53 V63 H59 V69 H53 V75 H47 V69 H41 V63 H47 Z" fill="#ffffff" />
    {/* Laurel Leaves Garland on Sides */}
    <path d="M22 45 C20 58 26 72 38 80" stroke="url(#crestGold)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M78 45 C80 58 74 72 62 80" stroke="url(#crestGold)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 2. NABH Accredited Hospital Seal
export const NabhAccreditedBadge: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="nabhGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <polygon points="50,5 92,25 92,75 50,95 8,75 8,25" fill="#ffffff" stroke="url(#nabhGold)" strokeWidth="3" />
    <polygon points="50,11 86,28 86,72 50,89 14,72 14,28" fill="#047857" />
    {/* Stars */}
    <circle cx="50" cy="22" r="3" fill="#fbbf24" />
    <circle cx="42" cy="25" r="2.5" fill="#fbbf24" />
    <circle cx="58" cy="25" r="2.5" fill="#fbbf24" />
    <text x="50" y="48" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900" fontFamily="sans-serif">NABH</text>
    <text x="50" y="62" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ACCREDITED</text>
    <text x="50" y="74" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">HOSPITAL</text>
  </svg>
);

// 3. PM-JAY Ayushman Bharat Health Logo
export const PmjayAyushmanLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#f97316" strokeWidth="2.5" />
    {/* Indian Tri-Color Aura Ring */}
    <circle cx="50" cy="50" r="41" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 3" />
    {/* Stylized Lotus / Hands of Protection */}
    <path d="M26 62 C32 46 50 42 50 42 C50 42 68 46 74 62 C64 74 36 74 26 62 Z" fill="#f97316" opacity="0.9" />
    <path d="M34 65 C40 54 50 50 50 50 C50 50 60 54 66 65 C58 72 42 72 34 65 Z" fill="#ffffff" />
    {/* Ashoka Wheel Center */}
    <circle cx="50" cy="32" r="8" fill="#1e3a8a" />
    <circle cx="50" cy="32" r="6" fill="#ffffff" />
    <circle cx="50" cy="32" r="2" fill="#1e3a8a" />
    <text x="50" y="85" textAnchor="middle" fill="#047857" fontSize="9" fontWeight="900" fontFamily="sans-serif">PM-JAY</text>
  </svg>
);

// 4. Level-1 Trauma Emergency Medical Cross
export const Level1TraumaCross: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="46" fill="#fef2f2" stroke="#ef4444" strokeWidth="3" />
    {/* Bold Red Cross */}
    <rect x="38" y="18" width="24" height="64" rx="4" fill="#dc2626" />
    <rect x="18" y="38" width="64" height="24" rx="4" fill="#dc2626" />
    {/* Heartbeat EKG Pulse Through Center */}
    <path d="M22 50 L36 50 L42 38 L48 62 L54 44 L60 54 L66 50 L78 50" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 5. Ministry of Health & Family Welfare (MoHFW) Seal
export const MohfwEmblem: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#047857" strokeWidth="3" />
    <circle cx="50" cy="50" r="39" fill="#ecfdf5" stroke="#d97706" strokeWidth="1.5" />
    {/* Caduceus Staff with Snakes */}
    <line x1="50" y1="20" x2="50" y2="78" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="18" r="4" fill="#f59e0b" />
    <path d="M36 32 C46 36 54 28 64 32 C54 42 46 38 36 46 C46 54 54 48 64 54 C54 64 46 60 36 68" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M64 32 C54 36 46 28 36 32 C46 42 54 38 64 46 C54 54 46 48 36 54 C46 64 54 60 64 68" stroke="#059669" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <text x="50" y="87" textAnchor="middle" fill="#065f46" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MoHFW</text>
  </svg>
);
