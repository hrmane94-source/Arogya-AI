import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  UserPlus, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  Receipt,
  FileText,
  Download
} from 'lucide-react';
import { TriagePatient, Ward } from '../types/hospital';

interface QueueSystemProps {
  queue: TriagePatient[];
  wards: Ward[];
  onAddPatient: (patient: TriagePatient) => void;
  onCallPatient: (patientId: string) => void;
  onOpenConcession: (patient: TriagePatient) => void;
  onViewBilling: (patientName: string) => void;
}

export const QueueSystem: React.FC<QueueSystemProps> = ({
  queue,
  wards,
  onAddPatient,
  onCallPatient,
  onOpenConcession,
  onViewBilling
}) => {
  const [filterEsi, setFilterEsi] = useState<number | 'ALL'>('ALL');
  const [isAddingPatient, setIsAddingPatient] = useState(false);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [esi, setEsi] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [complaint, setComplaint] = useState('');
  const [targetWard, setTargetWard] = useState('General Medical-Surgical');
  const [govCard, setGovCard] = useState('Ayushman Bharat (PM-JAY)');
  const [govCardNumber, setGovCardNumber] = useState('AB-PMJAY-7721-9904');

  const filteredQueue = filterEsi === 'ALL'
    ? queue
    : queue.filter((p) => p.esiLevel === filterEsi);

  const avgWait = Math.round(
    queue.reduce((acc, p) => acc + p.predictedWaitMins, 0) / (queue.length || 1)
  );

  const getEsiBadge = (level: 1 | 2 | 3 | 4 | 5) => {
    switch (level) {
      case 1:
        return { label: 'ESI 1: RESUSCITATION', color: 'text-rose-700 bg-rose-50 border-rose-300 font-bold' };
      case 2:
        return { label: 'ESI 2: EMERGENT', color: 'text-amber-700 bg-amber-50 border-amber-300 font-bold' };
      case 3:
        return { label: 'ESI 3: URGENT', color: 'text-yellow-800 bg-yellow-50 border-yellow-300 font-bold' };
      case 4:
        return { label: 'ESI 4: LESS URGENT', color: 'text-teal-700 bg-teal-50 border-teal-300 font-bold' };
      case 5:
        return { label: 'ESI 5: NON-URGENT', color: 'text-emerald-700 bg-emerald-50 border-emerald-300 font-bold' };
    }
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tokenNum = `A0${34 + queue.length}`;
    
    const wardObj = wards.find((w) => w.name.includes(targetWard) || targetWard.includes(w.name));
    const vacancy = wardObj ? wardObj.availableBeds : 5;
    const baseWait = esi === 1 ? 0 : esi === 2 ? 5 : esi === 3 ? 18 : esi === 4 ? 32 : 55;
    const vacancyPenalty = vacancy === 0 ? 15 : vacancy < 3 ? 8 : 0;
    const calculatedWait = Math.max(0, baseWait + vacancyPenalty);

    const newPatient: TriagePatient = {
      id: `q-${Date.now()}`,
      tokenNumber: tokenNum,
      patientName: name,
      age: Number(age) || 35,
      gender,
      esiLevel: esi,
      chiefComplaint: complaint || 'General acute triage evaluation',
      arrivalTime: 'Just now',
      predictedWaitMins: calculatedWait,
      assignedWardTarget: targetWard,
      status: 'WAITING',
      govCardScheme: govCard,
      govCardNumber: govCardNumber,
      concessionApplied: !!govCard,
      concessionPercent: govCard.includes('Ayushman') || govCard.includes('BPL') ? 100 : 80
    };

    onAddPatient(newPatient);
    setName('');
    setAge('');
    setComplaint('');
    setIsAddingPatient(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
              AROGYA AI LIVE QUEUE & WAIT-TIME PREDICTION ENGINE
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic ESI acuity scoring, doctor load modeling, and automated bed clearance velocity
          </p>
        </div>

        <button
          onClick={() => setIsAddingPatient(!isAddingPatient)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-700/20 self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAddingPatient ? 'Close Form' : '+ Issue Patient Token'}</span>
        </button>
      </div>

      {/* Dynamic Wait-Time Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 block text-[10px]">ACTIVE QUEUE COUNT</span>
          <span className="text-slate-900 font-black text-2xl">{queue.length} Patients</span>
        </div>

        <div className="bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
          <span className="text-slate-500 block text-[10px]">AI PREDICTED AVG WAIT</span>
          <span className="text-emerald-700 font-black text-2xl">{avgWait} Minutes</span>
        </div>

        <div className="bg-white border border-rose-200 p-4 rounded-2xl shadow-sm bg-rose-50/40">
          <span className="text-slate-500 block text-[10px]">FAST-TRACK (ESI 1)</span>
          <span className="text-rose-700 font-black text-2xl">0 Mins (Priority 1)</span>
        </div>

        <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-sm bg-emerald-50/40">
          <span className="text-slate-500 block text-[10px]">GOVT CARD CONCESSION</span>
          <span className="text-emerald-800 font-black text-2xl">
            {queue.filter((p) => p.govCardScheme).length} / {queue.length} Eligible
          </span>
        </div>
      </div>

      {/* New Patient Token Form Drawer */}
      {isAddingPatient && (
        <form 
          onSubmit={handleCreatePatient}
          className="bg-white border-2 border-emerald-400 rounded-3xl p-6 space-y-4 animate-fade-in font-mono text-xs shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-sm font-black text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              New Patient Triage Intake & Token Issuance
            </span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Generates instant token & wait estimate
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-600 block mb-1 font-bold">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-bold">Age & Gender *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Age (e.g. 52)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-bold">ESI Acuity Level *</label>
              <select
                value={esi}
                onChange={(e) => setEsi(Number(e.target.value) as any)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
              >
                <option value={1}>Level 1: Resuscitation (Immediate)</option>
                <option value={2}>Level 2: Emergent (&lt; 10 min)</option>
                <option value={3}>Level 3: Urgent (&lt; 20 min)</option>
                <option value={4}>Level 4: Less Urgent (&lt; 35 min)</option>
                <option value={5}>Level 5: Non-Urgent (&gt; 50 min)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-bold">Target Admission Ward</label>
              <select
                value={targetWard}
                onChange={(e) => setTargetWard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
              >
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="General Medical-Surgical">General Medical-Surgical</option>
                <option value="Emergency & Trauma Holding">Emergency & Trauma Holding</option>
                <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
                <option value="Pediatric Care Unit">Pediatric Care Unit</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="text-slate-600 block mb-1 font-bold">Chief Clinical Complaint</label>
              <input
                type="text"
                placeholder="e.g. Sudden severe chest pain, shortness of breath on exertion"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-bold">Government Health Card</label>
              <select
                value={govCard}
                onChange={(e) => setGovCard(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none"
              >
                <option value="Ayushman Bharat (PM-JAY)">Ayushman Bharat (PM-JAY) [100% Free]</option>
                <option value="ABHA Digital Health Card">ABHA Digital Health Card [75% Off]</option>
                <option value="Central Govt Health Scheme (CGHS)">Central Govt Health Scheme [90% Off]</option>
                <option value="State BPL / Antyodaya Health Card">State BPL / Antyodaya [100% Free]</option>
                <option value="None / Private Cash">None / Private Cash [Standard Rate]</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-bold">Card / Beneficiary ID</label>
              <input
                type="text"
                placeholder="e.g. AB-PMJAY-9042-8821"
                value={govCardNumber}
                onChange={(e) => setGovCardNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-slate-800 outline-none font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingPatient(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Issue Token & Queue
            </button>
          </div>
        </form>
      )}

      {/* Queue Table */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase">
              Triage Priority Filter:
            </span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              {['ALL', 1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={String(lvl)}
                  onClick={() => setFilterEsi(lvl as any)}
                  className={`px-3 py-1 rounded-lg transition-colors font-bold ${
                    filterEsi === lvl
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'ALL' ? 'All ESI' : `ESI ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-500">
            Showing {filteredQueue.length} patient tokens
          </span>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredQueue.map((patient) => {
            const badge = getEsiBadge(patient.esiLevel);
            const isWaiting = patient.status === 'WAITING';

            return (
              <div
                key={patient.id}
                className="bg-slate-50/80 border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Token & Patient Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-sm">
                      <span className="text-[10px] text-emerald-200 font-bold">TOKEN</span>
                      <span className="text-base font-black">{patient.tokenNumber}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-mono">
                        <span className="text-sm font-bold text-slate-900">
                          {patient.patientName} ({patient.age}y, {patient.gender})
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400">Arrived: {patient.arrivalTime}</span>
                      </div>

                      <p className="text-xs text-slate-600">
                        {patient.chiefComplaint}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                        <span>Target: <strong className="text-slate-800">{patient.assignedWardTarget}</strong></span>
                        <span>·</span>
                        {patient.govCardScheme ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" />
                            {patient.govCardScheme} ({patient.concessionPercent}% Concession)
                          </span>
                        ) : (
                          <span className="text-slate-400">No Govt Card</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Projected Wait & Actions */}
                  <div className="flex flex-wrap items-center gap-3 lg:self-center font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Projected Wait</span>
                      <span className={`text-base font-black ${
                        patient.predictedWaitMins <= 5 ? 'text-rose-600' : 'text-emerald-700'
                      }`}>
                        {patient.predictedWaitMins === 0 ? 'Immediate / Call Now' : `~${patient.predictedWaitMins} Mins`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isWaiting ? (
                        <button
                          onClick={() => onCallPatient(patient.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Call Patient</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{patient.status}</span>
                        </span>
                      )}

                      {/* View Billing & Download button on patient card */}
                      <button
                        onClick={() => onViewBilling(patient.patientName)}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                        title="View and download patient billing statement"
                      >
                        <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Billing</span>
                      </button>

                      <button
                        onClick={() => onOpenConcession(patient)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                        <span>Concession</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
