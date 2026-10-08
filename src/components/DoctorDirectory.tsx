import React, { useState } from 'react';
import { 
  Stethoscope, 
  Clock, 
  MapPin, 
  Award, 
  Search, 
  Calendar, 
  Sparkles, 
  Star, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2,
  Heart,
  Baby,
  Activity,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DoctorProfile, DoctorSpecialty } from '../types/hospital';
import { INITIAL_DOCTORS } from '../data/doctorsAndBilling';
import { GovtHospitalEmblem, NabhAccreditedBadge } from './HospitalLogos';

interface DoctorDirectoryProps {
  onBookDoctorToken: (doctor: DoctorProfile) => void;
  onViewWardBeds: (wardTarget: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  onBookDoctorToken,
  onViewWardBeds
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<DoctorSpecialty | 'ALL'>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookedDoctorSuccess, setBookedDoctorSuccess] = useState<string | null>(null);

  const SPECIALTIES: { id: DoctorSpecialty; label: string; icon: string; desc: string; count: number }[] = [
    { id: 'DERMATOLOGIST', label: 'Dermatologist (Dermat)', icon: '🧴', desc: 'Skin rash, eczema, psoriasis, acne & hair care', count: 2 },
    { id: 'PEDIATRICIAN', label: 'Pediatrician', icon: '👶', desc: 'Child health, immunization, neonatal & asthma', count: 2 },
    { id: 'GYNECOLOGIST', label: 'Gynecologist (Gynac)', icon: '🤰', desc: 'Maternity, pregnancy, PCOS & women’s health', count: 2 },
    { id: 'GENERAL_PHYSICIAN', label: 'General Physician', icon: '🩺', desc: 'Fever, diabetes, hypertension, infections', count: 2 },
    { id: 'CARDIOLOGIST', label: 'Cardiologist', icon: '🫀', desc: 'Heart conditions, angina, BP & post-MI care', count: 1 },
    { id: 'ORTHOPEDIC', label: 'Orthopedic Surgeon', icon: '🦴', desc: 'Bone fractures, joints, arthritis & spine', count: 1 },
  ];

  // Common Health Issues Filter Chips
  const HEALTH_ISSUES = [
    { label: 'All Issues', value: 'ALL' },
    { label: 'Skin Rash & Eczema', value: 'Eczema' },
    { label: 'Childhood Fever & Cold', value: 'Fevers' },
    { label: 'Pregnancy & PCOS Care', value: 'Pregnancy' },
    { label: 'Diabetes & High BP', value: 'Diabetes' },
    { label: 'Severe Acne & Flaking', value: 'Acne' },
    { label: 'Chest Heaviness & Angina', value: 'Angina' },
    { label: 'Bone Fracture & Joint Pain', value: 'Fractures' },
    { label: 'Vaccination / Immunization', value: 'Vaccination' },
  ];

  const filteredDoctors = INITIAL_DOCTORS.filter((doc) => {
    // Filter by Specialty
    if (selectedSpecialty !== 'ALL' && doc.specialty !== selectedSpecialty) {
      return false;
    }
    // Filter by Health Issue
    if (selectedIssue !== 'ALL') {
      const matchIssue = doc.treatingConditions.some((c) =>
        c.toLowerCase().includes(selectedIssue.toLowerCase())
      );
      if (!matchIssue) return false;
    }
    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchSpec = doc.specialtyLabel.toLowerCase().includes(q);
      const matchCond = doc.treatingConditions.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchSpec && !matchCond) return false;
    }
    return true;
  });

  const handleBook = (doctor: DoctorProfile) => {
    onBookDoctorToken(doctor);
    setBookedDoctorSuccess(`OPD Consultation Token generated for ${doctor.name} (${doctor.opdRoom}). Added to Live Queue.`);
    setTimeout(() => {
      setBookedDoctorSuccess(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Confirmation */}
      {bookedDoctorSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-2 border-emerald-400 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in font-mono text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{bookedDoctorSuccess}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 font-sans tracking-tight">
              FIND DOCTORS BY HEALTH SPECIALTY & OPD CLINIC
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              LIVE OPD TOKENS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Consult specialized Government Hospital physicians across Dermatology, Pediatrics, Gynecology, General Medicine, Cardiology, and Orthopedics with real-time queue wait estimates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GovtHospitalEmblem size={40} />
          <div className="text-right font-mono hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Central OPD Registry</div>
            <div className="text-[10px] text-slate-500">Government Hospital Metropolitan</div>
          </div>
        </div>
      </div>

      {/* Specialty Category Selector Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
            Select Medical Department / Specialty:
          </span>
          {selectedSpecialty !== 'ALL' && (
            <button
              onClick={() => {
                setSelectedSpecialty('ALL');
                setSelectedIssue('ALL');
              }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Clear Specialty Filter (Show All)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => {
                  setSelectedSpecialty(isSelected ? 'ALL' : spec.id);
                  setSelectedIssue('ALL');
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl mb-1">{spec.icon}</div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {spec.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {spec.desc}
                </div>
                <div className="mt-2 text-[10px] font-mono font-bold text-emerald-700">
                  {spec.count} Specialist{spec.count > 1 ? 's' : ''} on Duty
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Health Issues Filter Chips & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
              Filter by Health Issue / Symptoms:
            </span>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor, symptom, or treatment..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs text-slate-800 outline-none font-medium"
            />
          </div>
        </div>

        {/* Issue Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {HEALTH_ISSUES.map((issue) => {
            const isSelected = selectedIssue === issue.value;
            return (
              <button
                key={issue.value}
                onClick={() => setSelectedIssue(issue.value)}
                className={`px-3 py-1.5 rounded-xl border transition-all font-semibold ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
                }`}
              >
                {issue.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
          <span>SHOWING {filteredDoctors.length} SPECIALIST PHYSICIANS</span>
          <span>Click "Book OPD Token" for instant slot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => {
            return (
              <div
                key={doc.id}
                className="bg-white border-2 border-slate-200/90 hover:border-emerald-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Doctor Avatar / Stethoscope */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm font-black text-sm">
                      {doc.name.split(' ').map((n) => n[0]).join('').slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 leading-tight">
                          {doc.name}
                        </h3>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          {doc.rating}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-emerald-700 mt-0.5">
                        {doc.specialtyLabel}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {doc.qualification} · {doc.experienceYears} Years Experience
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                    AVAILABLE TODAY
                  </span>
                </div>

                {/* OPD Location & Live Queue Telemetry */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">OPD CLINIC LOCATION</span>
                    <span className="text-slate-800 font-bold text-[11px]">{doc.opdRoom}</span>
                    <span className="text-[10px] text-slate-500 block">{doc.consultationTiming}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">LIVE QUEUE WAITING</span>
                    <span className="text-emerald-700 font-bold text-sm">
                      {doc.currentQueueCount} Patients in Queue
                    </span>
                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      Est. Wait: ~{doc.estWaitMins} mins
                    </span>
                  </div>
                </div>

                {/* Treating Health Conditions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                    Health Conditions Treated:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.treatingConditions.map((cond, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-lg"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 font-mono text-xs">
                  <button
                    onClick={() => {
                      const target = doc.specialty === 'CARDIOLOGIST' 
                        ? 'Cardiac Care Unit (CCU)' 
                        : doc.specialty === 'PEDIATRICIAN' 
                        ? 'Pediatric Care Unit' 
                        : 'General Medical-Surgical';
                      onViewWardBeds(target);
                    }}
                    className="text-slate-600 hover:text-emerald-700 font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Check Ward Beds</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleBook(doc)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Book OPD Token</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
