import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { FORECAST_SERIES_24H, FORECAST_SERIES_7D } from '../data/initialData';
import { ForecastPoint } from '../types/hospital';

type TimeHorizon = '6h' | '24h' | '3d' | '7d';

export const ForecastView: React.FC = () => {
  const [horizon, setHorizon] = useState<TimeHorizon>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<ForecastPoint | null>(null);

  const rawPoints = horizon === '7d' || horizon === '3d' ? FORECAST_SERIES_7D : FORECAST_SERIES_24H;
  const points = horizon === '6h' 
    ? rawPoints.slice(0, 6) 
    : horizon === '3d' 
    ? rawPoints.slice(0, 7) 
    : rawPoints;

  const width = 860;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minBeds = 180;
  const maxBeds = 320;

  const getX = (index: number) => padding.left + (index / (points.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minBeds) / (maxBeds - minBeds)) * chartH;

  const currentIndex = points.findIndex((p) => p.isCurrent);
  
  let historicalPath = '';
  for (let i = 0; i <= currentIndex; i++) {
    const val = points[i].historical ?? points[i].predicted ?? 213;
    const x = getX(i);
    const y = getY(val);
    historicalPath += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  let predictedPath = '';
  for (let i = currentIndex; i < points.length; i++) {
    const val = points[i].predicted ?? points[i].historical ?? 213;
    const x = getX(i);
    const y = getY(val);
    predictedPath += i === currentIndex ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  let confidencePolygon = '';
  if (currentIndex >= 0 && currentIndex < points.length) {
    for (let i = currentIndex; i < points.length; i++) {
      const upper = points[i].upperConfidence ?? points[i].predicted ?? 213;
      const x = getX(i);
      const y = getY(upper);
      confidencePolygon += i === currentIndex ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    for (let i = points.length - 1; i >= currentIndex; i--) {
      const lower = points[i].lowerConfidence ?? points[i].predicted ?? 213;
      const x = getX(i);
      const y = getY(lower);
      confidencePolygon += ` L ${x} ${y}`;
    }
    confidencePolygon += ' Z';
  }

  const activeHover = hoveredPoint || points[points.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
              AROGYA AI BED CAPACITY & DEMAND FORECAST
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Machine Learning ensemble projection with 95% confidence intervals and surge threshold indicators
          </p>
        </div>

        {/* Time Horizon Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['6h', '24h', '3d', '7d'] as TimeHorizon[]).map((h) => (
            <button
              key={h}
              onClick={() => {
                setHorizon(h);
                setHoveredPoint(null);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                horizon === h
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {h === '6h' ? '6 Hours' : h === '24h' ? '24 Hours' : h === '3d' ? '3 Days' : '7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Card */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-4 shadow-sm">
        {/* ML Prediction Callout Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                Predicted Peak Trajectory
              </div>
              <div className="text-sm font-bold text-slate-900">
                “Tomorrow 6:00 PM: approximately <span className="text-rose-600 font-mono font-black">274 beds</span> occupied (91.3% capacity)”
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-700 bg-white px-3.5 py-2 rounded-lg border border-emerald-200 flex items-center gap-2 font-medium shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>95% Confidence Band: [262 – 286 Beds]</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono pt-1">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-slate-400"></span>
              <span>Past Actual (Census)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1 bg-emerald-600"></span>
              <span className="text-emerald-700 font-bold">🔮 AI Demand Prediction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3 bg-emerald-100 border border-emerald-400 rounded-sm"></span>
              <span>Confidence Interval (95%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500"></span>
              <span className="text-rose-600 font-bold">Capacity Ceiling (300 Beds)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Model: Arogya Surge Net (Trained on Government Hospital Datasets)
          </div>
        </div>

        {/* SVG Graph Container */}
        <div className="relative overflow-x-auto bg-[#fafdfb] rounded-xl p-2 border border-slate-100">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[650px] select-none"
          >
            <defs>
              <linearGradient id="brightConfidenceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[200, 240, 280, 300].map((bedLevel) => {
              const y = getY(bedLevel);
              const isCapacity = bedLevel === 300;
              return (
                <g key={bedLevel}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke={isCapacity ? '#f43f5e' : '#e2e8f0'}
                    strokeDasharray={isCapacity ? '5 5' : undefined}
                    strokeWidth={isCapacity ? 1.5 : 1}
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill={isCapacity ? '#e11d48' : '#64748b'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={isCapacity ? 'bold' : 'normal'}
                  >
                    {bedLevel} {isCapacity ? 'MAX' : ''}
                  </text>
                </g>
              );
            })}

            {/* Confidence Interval Band */}
            {confidencePolygon && (
              <path
                d={confidencePolygon}
                fill="url(#brightConfidenceGrad)"
                stroke="#10b981"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            )}

            {/* Historical Solid Line */}
            {historicalPath && (
              <path
                d={historicalPath}
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Predicted Futuristic Glowing Line */}
            {predictedPath && (
              <path
                d={predictedPath}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeDasharray="5 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((p, idx) => {
              const x = getX(idx);
              const isNow = p.isCurrent;
              const bedVal = p.predicted ?? p.historical ?? 213;
              const y = getY(bedVal);

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredPoint(p)}
                >
                  <line
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={height - padding.bottom}
                    stroke={isNow ? '#059669' : '#cbd5e1'}
                    strokeWidth={isNow ? 1.5 : 0.8}
                    strokeDasharray={isNow ? '2 2' : undefined}
                  />

                  <circle
                    cx={x}
                    cy={y}
                    r={isNow ? 5.5 : 4}
                    fill={isNow ? '#059669' : p.predicted ? '#10b981' : '#64748b'}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />

                  {isNow && (
                    <circle
                      cx={x}
                      cy={y}
                      r={9}
                      fill="none"
                      stroke="#059669"
                      strokeWidth={1.5}
                      className="animate-ping"
                      opacity={0.6}
                    />
                  )}

                  <text
                    x={x}
                    y={height - padding.bottom + 18}
                    textAnchor="middle"
                    fill={isNow ? '#047857' : '#64748b'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isNow ? 'bold' : 'normal'}
                  >
                    {p.label}
                  </text>

                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fill={bedVal >= 280 ? '#e11d48' : bedVal >= 240 ? '#d97706' : '#059669'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {bedVal}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Inspector Card */}
        {activeHover && (
          <div className="bg-[#f0fdf4] border border-emerald-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Forecast Timestamp</span>
              <span className="text-sm font-bold text-slate-900">{activeHover.label}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Projected Total Census</span>
              <span className="text-sm font-bold text-emerald-700">
                {activeHover.predicted ?? activeHover.historical} / 300 Beds
              </span>
              <span className="text-[10px] text-slate-500 block">
                {Math.round(((activeHover.predicted ?? activeHover.historical ?? 213) / 300) * 100)}% Occupancy
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Expected Inbound / Outbound</span>
              <span className="text-sm font-bold text-slate-800">
                <span className="text-emerald-600">+{activeHover.admissions} Adm</span> / <span className="text-slate-600">-{activeHover.discharges} Disch</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Shortage Delta</span>
              <span className={`text-sm font-bold ${
                300 - (activeHover.predicted ?? activeHover.historical ?? 213) < 25 ? 'text-rose-600' : 'text-emerald-700'
              }`}>
                {300 - (activeHover.predicted ?? activeHover.historical ?? 213)} Beds Available
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ward Breakdown Table */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 space-y-3.5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Ward-Level Predicted Influx (Next 24 Hours)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3">Ward Name</th>
                <th className="py-2.5 px-3 text-center">Capacity</th>
                <th className="py-2.5 px-3 text-center">Current Occupied</th>
                <th className="py-2.5 px-3 text-center">Predicted 24h</th>
                <th className="py-2.5 px-3 text-center">Admissions</th>
                <th className="py-2.5 px-3 text-center">Discharges</th>
                <th className="py-2.5 px-3 text-center">Risk Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-bold text-rose-700">Intensive Care Unit (ICU)</td>
                <td className="py-3 px-3 text-center font-bold">20</td>
                <td className="py-3 px-3 text-center text-rose-700 font-bold">18 (90%)</td>
                <td className="py-3 px-3 text-center font-black text-rose-700">22 (110% Over Limit)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">+6</td>
                <td className="py-3 px-3 text-center text-slate-600">-2</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">🔴 CRITICAL DEFICIT</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">General Medical-Surgical</td>
                <td className="py-3 px-3 text-center">180</td>
                <td className="py-3 px-3 text-center">122 (68%)</td>
                <td className="py-3 px-3 text-center text-amber-700 font-bold">142 (79%)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">+24</td>
                <td className="py-3 px-3 text-center text-slate-600">-18</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">🟠 HIGH DEMAND</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Emergency & Trauma Holding</td>
                <td className="py-3 px-3 text-center">35</td>
                <td className="py-3 px-3 text-center">25 (71%)</td>
                <td className="py-3 px-3 text-center text-amber-700 font-bold">33 (94%)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">+18</td>
                <td className="py-3 px-3 text-center text-slate-600">-12</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">🟠 NEAR SATURATION</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-900">Cardiac Care Unit (CCU)</td>
                <td className="py-3 px-3 text-center">15</td>
                <td className="py-3 px-3 text-center">12 (80%)</td>
                <td className="py-3 px-3 text-center text-rose-700 font-bold">14 (93%)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">+3</td>
                <td className="py-3 px-3 text-center text-slate-600">-1</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">🔴 HIGH STRESS</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-emerald-800">Pediatric Care Unit</td>
                <td className="py-3 px-3 text-center">30</td>
                <td className="py-3 px-3 text-center">22 (73%)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">26 (86%)</td>
                <td className="py-3 px-3 text-center text-emerald-700 font-bold">+4</td>
                <td className="py-3 px-3 text-center text-slate-600">-3</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">🟢 MANAGEABLE</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
