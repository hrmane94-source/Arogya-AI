import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  CheckCircle2, 
  CreditCard, 
  Building, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  User, 
  Receipt,
  Sparkles,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { PatientBillingRecord } from '../types/hospital';
import { INITIAL_BILLINGS, downloadBillingReceipt } from '../data/doctorsAndBilling';
import { GovtHospitalEmblem, PmjayAyushmanLogo, NabhAccreditedBadge } from './HospitalLogos';

interface PatientBillingViewProps {
  onNavigateToBed?: (bedCode: string) => void;
}

export const PatientBillingView: React.FC<PatientBillingViewProps> = () => {
  const [billings] = useState<PatientBillingRecord[]>(INITIAL_BILLINGS);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(billings[0].invoiceId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const selectedRecord = billings.find((b) => b.invoiceId === selectedInvoiceId) || billings[0];

  const filteredBillings = billings.filter((b) => {
    if (filterStatus !== 'ALL' && b.paymentStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.patientName.toLowerCase().includes(q);
      const matchToken = b.tokenNumber.toLowerCase().includes(q);
      const matchInv = b.invoiceId.toLowerCase().includes(q);
      const matchDoc = b.attendingDoctor.toLowerCase().includes(q);
      if (!matchName && !matchToken && !matchInv && !matchDoc) return false;
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 font-sans tracking-tight">
              PATIENT BILLING STATEMENTS & GOVT CONCESSION INVOICES
            </h2>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              ACTIVE FILE DOWNLOADS
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Click on any patient below to view the detailed itemized hospital billing breakdown, Ayushman Bharat PM-JAY concessions, and download the official computer-generated receipt file.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GovtHospitalEmblem size={40} />
          <div className="text-right font-mono hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Hospital Billing Directorate</div>
            <div className="text-[10px] text-slate-500">Government Medical Center</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Patient Selector (5 Cols) vs Active Patient Billing Statement (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, token, or invoice ID..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 text-xs text-slate-900 outline-none font-medium"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
              {['ALL', 'PAID_CASHLESS', 'PARTIALLY_SUBSIDIZED', 'SETTLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                    filterStatus === st
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'All Invoices' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Patients List Cards */}
          <div className="space-y-2.5">
            {filteredBillings.map((b) => {
              const isSelected = b.invoiceId === selectedInvoiceId;
              const isCashless = b.paymentStatus === 'PAID_CASHLESS';

              return (
                <div
                  key={b.invoiceId}
                  onClick={() => setSelectedInvoiceId(b.invoiceId)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-2 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{b.patientName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                          {b.tokenNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        {b.admittedWard} · Bed: <strong className="text-slate-800">{b.bedNumber}</strong>
                      </div>
                      <div className="text-[11px] text-emerald-800 font-medium mt-1">
                        Doctor: {b.attendingDoctor}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-slate-900">
                        {b.totalPayable === 0 ? (
                          <span className="text-emerald-700 font-extrabold">₹0 (100% Free)</span>
                        ) : (
                          <span>₹{b.totalPayable.toLocaleString()}</span>
                        )}
                      </div>
                      <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded border inline-block mt-1 ${
                        isCashless 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {b.govSchemeName ? `${b.concessionDiscountPct}% Concession` : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Itemized Patient Billing Statement (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRecord && (
            <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
              {/* Invoice Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <GovtHospitalEmblem size={44} />
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      METROPOLIS GOVERNMENT HOSPITAL
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Official Inpatient Billing Statement & Concession Certificate
                    </p>
                  </div>
                </div>

                {/* Working Download & Print Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadBillingReceipt(selectedRecord)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-all shadow-md shadow-emerald-700/20 flex items-center gap-1.5"
                    title="Download complete billing statement file (.txt)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
                    title="Print Billing Statement"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Invoice Metadata Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">INVOICE NUMBER</span>
                  <span className="text-slate-900 font-bold">{selectedRecord.invoiceId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">PATIENT TOKEN / BED</span>
                  <span className="text-emerald-700 font-bold">{selectedRecord.tokenNumber} ({selectedRecord.bedNumber})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">ADMISSION DURATION</span>
                  <span className="text-slate-900 font-bold">{selectedRecord.stayDays} Days ({selectedRecord.admissionDate.split(',')[0]} - {selectedRecord.dischargeDate.split(',')[0]})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">GOVT AUTH CODE</span>
                  <span className="text-slate-900 font-bold">{selectedRecord.authCode}</span>
                </div>
              </div>

              {/* Patient Profile Strip */}
              <div className="border border-slate-200 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">PATIENT NAME</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedRecord.patientName}</span>
                  <span className="text-[11px] text-slate-500 block">{selectedRecord.age}y / {selectedRecord.gender}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">WARD & SPECIALTY</span>
                  <span className="text-slate-800 font-bold">{selectedRecord.admittedWard}</span>
                  <span className="text-[11px] text-emerald-700 font-bold block">{selectedRecord.specialty}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">ATTENDING DOCTOR</span>
                  <span className="text-slate-900 font-bold">{selectedRecord.attendingDoctor}</span>
                  <span className="text-[11px] text-slate-500 block">Mobile: {selectedRecord.mobile}</span>
                </div>
              </div>

              {/* Itemized Charges Table */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 block">
                  Itemized Hospital & Bed Tariff Charges:
                </span>

                <div className="border border-slate-200 rounded-2xl overflow-hidden font-mono text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-2 text-center">Category</th>
                        <th className="py-2.5 px-2 text-center">Qty</th>
                        <th className="py-2.5 px-2 text-right">Rate</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {selectedRecord.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold">{item.quantity}</td>
                          <td className="py-2.5 px-2 text-right text-slate-600">₹{item.ratePerUnit.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-bold">₹{item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Calculation & Concession Strip */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/70 p-5 rounded-2xl border-2 border-emerald-300 font-mono text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Gross Hospital Charges:</span>
                  <span className="font-bold">₹{selectedRecord.subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-900 font-bold">
                  <span>Govt Scheme Concession ({selectedRecord.govSchemeName}):</span>
                  <span>- ₹{selectedRecord.discountAmount.toLocaleString()} ({selectedRecord.concessionDiscountPct}% Waiver)</span>
                </div>

                <div className="pt-2 border-t border-emerald-300 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-slate-900">Net Payable by Patient:</span>
                    <span className="text-[10px] text-slate-500 block">
                      Beneficiary ID: {selectedRecord.govCardNumber || 'N/A'}
                    </span>
                  </div>
                  <span className={`text-2xl font-black ${selectedRecord.totalPayable === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {selectedRecord.totalPayable === 0 ? '₹0 (100% Cashless Covered)' : `₹${selectedRecord.totalPayable.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Official Stamp & Sign-Off Strip */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
                <div className="flex items-center gap-2">
                  <PmjayAyushmanLogo size={28} />
                  <span>Authenticated by Arogya AI & Government Hospital Medical Superintendent</span>
                </div>

                <button
                  onClick={() => downloadBillingReceipt(selectedRecord)}
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Text Statement File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
