import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  Download, 
  BadgeCheck,
  Quote,
  Building
} from 'lucide-react';
import { GOV_CARD_SCHEMES } from '../data/initialData';
import { TokenConcessionSlip, TriagePatient } from '../types/hospital';
import { GovtHospitalEmblem, PmjayAyushmanLogo, NabhAccreditedBadge, MohfwEmblem } from './HospitalLogos';

interface ConcessionSystemProps {
  initialPatient?: TriagePatient | null;
}

export const ConcessionSystem: React.FC<ConcessionSystemProps> = ({ initialPatient }) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pmjay');
  const [tokenInput, setTokenInput] = useState<string>(initialPatient?.tokenNumber || 'A034');
  const [patientName, setPatientName] = useState<string>(initialPatient?.patientName || 'Kavita Joshi');
  const [age, setAge] = useState<number>(initialPatient?.age || 58);
  const [cardNumber, setCardNumber] = useState<string>(initialPatient?.govCardNumber || 'AB-PMJAY-9042-8821');
  const [wardType, setWardType] = useState<string>(initialPatient?.assignedWardTarget || 'Intensive Care Unit (ICU)');
  const [stayDays, setStayDays] = useState<number>(3);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  
  const [concessionSlip, setConcessionSlip] = useState<TokenConcessionSlip | null>({
    tokenNumber: 'A034',
    patientName: 'Kavita Joshi',
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
  });

  const activeScheme = GOV_CARD_SCHEMES.find((s) => s.id === selectedSchemeId) || GOV_CARD_SCHEMES[0];

  const getBaseFeePerDay = (ward: string) => {
    if (ward.includes('ICU')) return 8500;
    if (ward.includes('Cardiac') || ward.includes('CCU')) return 7200;
    if (ward.includes('Emergency')) return 2200;
    if (ward.includes('Pediatric')) return 2000;
    return 1800;
  };

  const baseDailyFee = getBaseFeePerDay(wardType);
  const isIcu = wardType.includes('ICU') || wardType.includes('CCU');
  const discountPct = isIcu ? activeScheme.icuConcessionRate : activeScheme.bedConcessionRate;
  const netDailyPayable = Math.round(baseDailyFee * (1 - discountPct / 100));
  const totalGross = baseDailyFee * stayDays;
  const totalConcessionDiscount = Math.round(totalGross * (discountPct / 100));
  const totalNetPayable = totalGross - totalConcessionDiscount;

  const handleVerifyAndGenerateSlip = () => {
    const slip: TokenConcessionSlip = {
      tokenNumber: tokenInput,
      patientName,
      age,
      schemeName: activeScheme.name,
      cardNumber,
      triagePriority: isIcu ? 'Level 1: Critical Inpatient' : 'Level 3: Regular Admission',
      targetWard: wardType,
      assignedBed: isIcu ? 'ICU-04 (Bridge Res)' : 'GEN-MED-22',
      standardDailyBedFee: baseDailyFee,
      concessionDiscountPct: discountPct,
      netPayableDaily: netDailyPayable,
      issuedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      validUntil: '72 Hours from Admission',
      authCode: `AUTH-NHA-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setConcessionSlip(slip);
  };

  const handlePrintSlip = () => {
    if (!concessionSlip) return;
    setNotificationToast(`Concession Certificate for Token ${concessionSlip.tokenNumber} sent to printer.`);
    setTimeout(() => setNotificationToast(null), 4000);
    window.print();
  };

  const handleExportSlip = () => {
    if (!concessionSlip) return;
    const certText = `================================================================================
GOVERNMENT CONCESSION CERTIFICATE & BED SUBSIDY CLEARANCE
METROPOLIS GOVERNMENT MEDICAL COLLEGE & LEVEL-1 TRAUMA HOSPITAL
================================================================================
Token Number    : ${concessionSlip.tokenNumber}
Patient Name    : ${concessionSlip.patientName} (${concessionSlip.age} Years)
Entitled Scheme : ${concessionSlip.schemeName}
Card / ABHA ID  : ${concessionSlip.cardNumber}
Priority        : ${concessionSlip.triagePriority}
Target Ward     : ${concessionSlip.targetWard}
Assigned Bed    : ${concessionSlip.assignedBed}
Standard Fee    : Rs. ${concessionSlip.standardDailyBedFee.toLocaleString()} / day
Discount Subsidy: ${concessionSlip.concessionDiscountPct}%
Net Daily Fee   : Rs. ${concessionSlip.netPayableDaily.toLocaleString()}
Issued At       : ${concessionSlip.issuedAt}
Valid Until     : ${concessionSlip.validUntil}
Auth Code       : ${concessionSlip.authCode}
================================================================================
STATUS: ${concessionSlip.concessionDiscountPct === 100 ? '100% CASHLESS BENEFIT AUTHORIZED' : 'SUBSIDY APPLIED'}
Authenticated under NHA & PM-JAY Ayushman Bharat digital gateway.
================================================================================`;
    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Concession_Slip_${concessionSlip.tokenNumber}_${concessionSlip.patientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotificationToast(`Digital Certificate downloaded for ${concessionSlip.patientName}.`);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-400 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}
      {/* Header with Hospital Logos */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <PmjayAyushmanLogo size={44} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 font-mono tracking-wide">
                GOVERNMENT HEALTH CARD TOKEN & BILLING CONCESSION SYSTEM
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ayushman Bharat (PM-JAY), ABHA ID, CGHS, and State Welfare verification for 100% cashless hospital bed subsidies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GovtHospitalEmblem size={36} />
          <MohfwEmblem size={36} />
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl font-mono text-xs text-emerald-800 font-bold">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span>NHA Verified Gateway</span>
          </div>
        </div>
      </div>

      {/* Quote Banner on Universal Health Coverage */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Quote className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="italic text-emerald-950 font-serif">
            “No citizen should be deprived of a hospital bed or lifesaving treatment due to inability to pay.”
          </span>
          <span className="text-[11px] font-mono font-bold text-emerald-800">
            — National Health Mission Charter
          </span>
        </div>
        <span className="hidden sm:inline text-[10px] font-mono font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-300">
          ZERO COPAY
        </span>
      </div>

      {/* Main Grid: Card Configuration & Concession Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheme Selection & Patient Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              Select Entitled Health Scheme
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Direct Cashless Subsidy
            </span>
          </div>

          {/* Scheme Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {GOV_CARD_SCHEMES.map((scheme) => {
              const isSelected = selectedSchemeId === scheme.id;
              return (
                <button
                  key={scheme.id}
                  onClick={() => {
                    setSelectedSchemeId(scheme.id);
                    setCardNumber(scheme.sampleNumber);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="font-bold text-slate-900 truncate">{scheme.name}</span>
                    <span className="text-emerald-700 font-bold shrink-0">{scheme.bedConcessionRate}% Bed Free</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Issuer: {scheme.verificationIssuer}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Limit: {scheme.annualCoverage}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="space-y-4 pt-2 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-600 block mb-1 font-bold">Patient Token Number</label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-900 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Govt Card / ABHA ID Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-emerald-800 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Target Ward Bed Tier</label>
                <select
                  value={wardType}
                  onChange={(e) => setWardType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-900 outline-none"
                >
                  <option value="Intensive Care Unit (ICU)">ICU (₹8,500/day base)</option>
                  <option value="Cardiac Care Unit (CCU)">CCU (₹7,200/day base)</option>
                  <option value="General Medical-Surgical">General Ward (₹1,800/day base)</option>
                  <option value="Emergency & Trauma Holding">Emergency Holding (₹2,200/day base)</option>
                  <option value="Pediatric Care Unit">Pediatric Unit (₹2,000/day base)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-bold">Estimated Inpatient Stay (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={stayDays}
                  onChange={(e) => setStayDays(Number(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-900 outline-none font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleVerifyAndGenerateSlip}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Card & Generate Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Billing Calculation & Printable Slip (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time Calculation Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 font-mono text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 uppercase">
                Final Bed Billing Breakdown
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {discountPct}% Concession Applied
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Standard Daily Bed Tariff:</span>
                <span className="font-bold">₹{baseDailyFee.toLocaleString()} / day</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Duration of Inpatient Care:</span>
                <span className="font-bold">{stayDays} Days</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Total Gross Bed Charges:</span>
                <span className="line-through">₹{totalGross.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Govt Card Subsidy / Waiver:</span>
                <span>-₹{totalConcessionDiscount.toLocaleString()} ({discountPct}%)</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Net Bed Payable by Patient:</span>
                <span className={`text-2xl font-black ${totalNetPayable === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {totalNetPayable === 0 ? '₹0 (100% Cashless)' : `₹${totalNetPayable.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          {/* Official Digital Concession Slip Certificate with Logos */}
          {concessionSlip && (
            <div className="bg-gradient-to-b from-[#f0fdf4] to-white border-2 border-emerald-500 rounded-3xl p-6 space-y-4 shadow-lg font-mono text-xs relative overflow-hidden">
              <div className="flex items-start justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-3">
                  <GovtHospitalEmblem size={34} />
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-black text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>GOVT CONCESSION CERTIFICATE</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Government Hospital · Token Clearance</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 p-1 flex items-center justify-center shrink-0 shadow-sm">
                  <QrCode className="w-10 h-10 text-emerald-800" />
                </div>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Token ID:</span>
                  <span className="text-slate-900 font-black">{concessionSlip.tokenNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary Name:</span>
                  <span className="text-slate-900 font-bold">{concessionSlip.patientName} ({concessionSlip.age}y)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Entitled Scheme:</span>
                  <span className="text-emerald-700 font-bold">{concessionSlip.schemeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Card / ABHA ID:</span>
                  <span className="text-slate-700 font-mono">{concessionSlip.cardNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reserved Bed Unit:</span>
                  <span className="text-emerald-800 font-bold">{concessionSlip.assignedBed} ({concessionSlip.targetWard})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authorization Code:</span>
                  <span className="text-slate-900 font-bold">{concessionSlip.authCode}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-center text-emerald-900 font-black text-xs">
                {concessionSlip.concessionDiscountPct === 100 
                  ? 'FULL 100% BED FEE WAIVER AUTHORIZED' 
                  : `${concessionSlip.concessionDiscountPct}% GOVERNMENT CONCESSION APPLIED`}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportSlip}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Export PDF / Slip</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
