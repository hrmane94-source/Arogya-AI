import React from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Sparkles
} from 'lucide-react';
import { ML_MODELS_BENCHMARK } from '../data/initialData';

export const MLEngineView: React.FC = () => {
  const pipelineSteps = [
    {
      step: 1,
      title: 'Data Ingestion & Cleaning',
      desc: '3 years of multi-ward admissions, EHR discharge timestamps, EMS dispatch feeds, weather/air quality telemetry.',
      icon: Database
    },
    {
      step: 2,
      title: 'Feature Engineering',
      desc: 'Day-of-week sinusoidal encoding, 48h rolling average admissions, holiday regressors, dynamic ALOS decay by ward.',
      icon: Layers
    },
    {
      step: 3,
      title: 'ML Model Inference',
      desc: 'XGBoost Surge Net Ensemble combined with Fourier Seasonal time-series regressors.',
      icon: Cpu
    },
    {
      step: 4,
      title: 'Demand & Bed Availability',
      desc: 'Probabilistic demand forecasting with 95% quantile uncertainty intervals.',
      icon: TrendingUp
    },
    {
      step: 5,
      title: 'Surge Risk Classification',
      desc: 'DEFCON 1 to 4 threshold alerting with actionable clinical mitigation recommendations.',
      icon: Zap
    }
  ];

  const featureImportance = [
    { name: 'Emergency Room Influx (Lag 6h - 24h)', importance: 28, color: '#059669' },
    { name: 'Day of Week & Weekend Discharge Dip', importance: 22, color: '#0d9488' },
    { name: 'Ward-Specific Historical ALOS Decay', importance: 19, color: '#10b981' },
    { name: 'Seasonal Outbreak & Pollution Index', importance: 16, color: '#d97706' },
    { name: 'Scheduled Elective Surgical Pipeline', importance: 15, color: '#6366f1' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900 font-mono tracking-wide">
              AROGYA AI ML PREDICTION PIPELINE & BENCHMARK ARCHITECTURE
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Technical architecture, input feature engineering, and model validation benchmarks (MAE / RMSE / R²)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl font-mono text-xs text-emerald-800 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Champion Model: Arogya XGBoost Net v4.2</span>
        </div>
      </div>

      {/* End-to-End Pipeline Visualization */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
          End-to-End Predictive Machine Learning Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.step}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 relative group hover:border-emerald-400 hover:bg-emerald-50/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono text-xs font-black shadow-sm">
                    {step.step}
                  </div>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 font-mono">{step.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Empirical Model Comparison (Past 90-Day Validation Set)
          </h3>
          <span className="text-[10px] font-mono text-slate-400">Target: Bed Census (Count)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Algorithmic Approach</th>
                <th className="py-2.5 px-3 text-center">MAE (Beds)</th>
                <th className="py-2.5 px-3 text-center">RMSE</th>
                <th className="py-2.5 px-3 text-center">R² Score</th>
                <th className="py-2.5 px-3 text-center">Latency</th>
                <th className="py-2.5 px-3 text-center">Deployment State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ML_MODELS_BENCHMARK.map((m) => {
                const isActive = m.status === 'ACTIVE_DEPLOYED';
                return (
                  <tr key={m.name} className={isActive ? 'bg-emerald-50/50' : ''}>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {isActive && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] max-w-xs">{m.type}</td>
                    <td className={`py-3.5 px-3 text-center font-bold ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {m.mae}
                    </td>
                    <td className={`py-3.5 px-3 text-center font-bold ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {m.rmse}
                    </td>
                    <td className={`py-3.5 px-3 text-center font-bold ${isActive ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {m.r2}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-500">{m.latencyMs}ms</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold border ${
                        isActive 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {isActive ? 'ACTIVE IN PRODUCTION' : 'BENCHMARK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Importance Ranking */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
          SHAP Feature Importance & Predictive Weights
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {featureImportance.map((feat) => (
            <div key={feat.name} className="space-y-1">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">{feat.name}</span>
                <span className="font-bold text-slate-900">{feat.importance}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${feat.importance * 3.2}%`, backgroundColor: feat.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
