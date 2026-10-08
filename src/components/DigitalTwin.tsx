import React, { useState } from 'react';
import { 
  Grid3X3, 
  Bed as BedIcon, 
  X
} from 'lucide-react';
import { Ward, Bed } from '../types/hospital';

interface DigitalTwinProps {
  wards: Ward[];
  beds: Bed[];
  onUpdateBedStatus: (bedId: string, newStatus: Bed['status']) => void;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  wards,
  beds,
  onUpdateBedStatus
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>(wards[0]?.id || 'ward-icu');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedWard = wards.find((w) => w.id === selectedWardId) || wards[0];
  const wardBeds = beds.filter((b) => b.wardId === selectedWardId);
  const filteredBeds = statusFilter === 'ALL' 
    ? wardBeds 
    : wardBeds.filter((b) => b.status === statusFilter);

  const getBedStatusBg = (status: Bed['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:border-emerald-500 shadow-sm';
      case 'OCCUPIED':
        return 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-400 shadow-sm';
      case 'DISCHARGING':
        return 'bg-teal-50 border-teal-300 text-teal-800 hover:border-teal-500 shadow-sm';
      case 'CLEANING':
        return 'bg-amber-50 border-amber-300 text-amber-800 hover:border-amber-500 shadow-sm';
      case 'RESERVED':
        return 'bg-purple-50 border-purple-300 text-purple-800 hover:border-purple-500 shadow-sm';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
              HOSPITAL DIGITAL TWIN · SPATIAL BED MAP
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual floorplan, micro-telemetry of individual bed units, cleaning workflows, and patient turnover
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
            <span className="text-slate-700 font-bold">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500"></span>
            <span className="text-slate-700 font-bold">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-teal-500"></span>
            <span className="text-slate-700 font-bold">Discharging</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500"></span>
            <span className="text-slate-700 font-bold">Cleaning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-purple-500"></span>
            <span className="text-slate-700 font-bold">Reserved</span>
          </div>
        </div>
      </div>

      {/* Ward Architectural Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {wards.map((ward) => {
          const occPct = Math.round((ward.occupiedBeds / ward.totalBeds) * 100);
          const isSelected = ward.id === selectedWardId;
          const isCritical = occPct >= 90;
          const isHigh = occPct >= 80 && occPct < 90;

          return (
            <button
              key={ward.id}
              onClick={() => {
                setSelectedWardId(ward.id);
                setSelectedBed(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-slate-500 uppercase font-bold">{ward.code}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isCritical ? 'bg-rose-500 animate-pulse' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </div>

              <div className="text-sm font-bold text-slate-900 truncate">{ward.name}</div>

              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-xs text-slate-500">
                  {ward.occupiedBeds}/{ward.totalBeds}
                </span>
                <span className={`text-sm font-black ${
                  isCritical ? 'text-rose-600' : isHigh ? 'text-amber-600' : 'text-emerald-700'
                }`}>
                  {occPct}%
                </span>
              </div>

              <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${occPct}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Ward Deep Dive */}
      {selectedWard && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 font-mono">
                  {selectedWard.name} ({selectedWard.code})
                </h3>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-lg font-bold border ${
                  selectedWard.riskLevel === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : selectedWard.riskLevel === 'HIGH'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                }`}>
                  {selectedWard.riskLevel} RISK
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Departmental Telemetry · Click any bed unit to inspect patient status, telemetry, or trigger turnover
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              {['ALL', 'AVAILABLE', 'OCCUPIED', 'DISCHARGING', 'CLEANING', 'RESERVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-colors font-bold ${
                    statusFilter === st
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Department Statistics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">CURRENT OCCUPANCY</span>
              <span className="text-slate-900 font-black text-sm">
                {selectedWard.occupiedBeds} / {selectedWard.totalBeds} ({Math.round((selectedWard.occupiedBeds / selectedWard.totalBeds) * 100)}%)
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">PREDICTED 24H DEMAND</span>
              <span className="text-emerald-700 font-bold text-sm">
                {selectedWard.predictedDemand24h} Beds
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">EXP. ADMISSIONS</span>
              <span className="text-slate-800 font-bold text-sm">
                +{selectedWard.expectedAdmissions} Patients
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">EXP. DISCHARGES</span>
              <span className="text-emerald-700 font-bold text-sm">
                -{selectedWard.expectedDischarges} Patients
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">AVG LENGTH OF STAY</span>
              <span className="text-slate-800 font-bold text-sm">
                {selectedWard.alos} Days
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">CLEANING TURNAROUND</span>
              <span className="text-amber-700 font-bold text-sm">
                ~{selectedWard.turnaroundMins} Mins
              </span>
            </div>
          </div>

          {/* Bed Units Grid */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
              <span>BED UNITS ({filteredBeds.length} DISPLAYED)</span>
              <span>Click bed for clinical actions</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
              {filteredBeds.map((bed) => {
                const isSelected = selectedBed?.id === bed.id;
                return (
                  <button
                    key={bed.id}
                    onClick={() => setSelectedBed(bed)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${getBedStatusBg(bed.status)} ${
                      isSelected ? 'ring-2 ring-emerald-600 scale-105 z-10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold">{bed.code}</span>
                      <BedIcon className="w-3.5 h-3.5 opacity-80" />
                    </div>

                    <div className="mt-1 text-[10px] font-mono uppercase tracking-wider font-extrabold truncate">
                      {bed.status}
                    </div>

                    {bed.patientName && (
                      <div className="mt-1 text-[10px] font-medium truncate opacity-90">
                        {bed.patientName}
                      </div>
                    )}
                    {bed.status === 'CLEANING' && (
                      <div className="mt-1 text-[9px] font-mono font-bold text-amber-800">
                        {bed.cleaningProgressMinutes}m left
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bed Detail Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-300 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in font-mono text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BedIcon className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">
                  Bed Unit: {selectedBed.code}
                </h4>
              </div>
              <button
                onClick={() => setSelectedBed(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Ward:</span>
                <span className="text-slate-900 font-bold">{selectedBed.wardName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Status:</span>
                <span className="text-emerald-700 font-bold">{selectedBed.status}</span>
              </div>

              {selectedBed.patientName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Patient:</span>
                  <span className="text-slate-900 font-medium">{selectedBed.patientName}</span>
                </div>
              )}

              {selectedBed.acuity && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Clinical Acuity:</span>
                  <span className={`font-bold ${
                    selectedBed.acuity === 'CRITICAL' ? 'text-rose-600' : 'text-emerald-700'
                  }`}>
                    {selectedBed.acuity}
                  </span>
                </div>
              )}

              {selectedBed.doctor && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Attending Physician:</span>
                  <span className="text-slate-700">{selectedBed.doctor}</span>
                </div>
              )}

              {selectedBed.expectedDischarge && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Discharge Trajectory:</span>
                  <span className="text-emerald-700 font-bold">{selectedBed.expectedDischarge}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">
                Shift Coordinator Actions:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedBed.id, 'AVAILABLE');
                    setSelectedBed({ ...selectedBed, status: 'AVAILABLE', patientName: undefined });
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-center font-bold"
                >
                  Mark Available
                </button>

                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedBed.id, 'CLEANING');
                    setSelectedBed({ ...selectedBed, status: 'CLEANING' });
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 text-center font-bold"
                >
                  Dispatch Housekeeping
                </button>

                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedBed.id, 'DISCHARGING');
                    setSelectedBed({ ...selectedBed, status: 'DISCHARGING' });
                  }}
                  className="p-2.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100 text-center font-bold"
                >
                  Sign Off Discharge
                </button>

                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedBed.id, 'RESERVED');
                    setSelectedBed({ ...selectedBed, status: 'RESERVED' });
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 border border-purple-300 text-purple-800 hover:bg-purple-100 text-center font-bold"
                >
                  Reserve for Inbound
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
