import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  BellRing, 
  Cpu, 
  CheckCircle2, 
  Save,
  Database
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [carbaThreshold, setCarbaThreshold] = useState<number>(15);
  const [esblThreshold, setEsblThreshold] = useState<number>(40);
  const [autoEmailAlerts, setAutoEmailAlerts] = useState<boolean>(true);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Info */}
      <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-5 shadow-2xl flex items-center justify-between flex-wrap gap-4">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-wide">Platform Thresholds & System Parameters</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" />
                Demo / Synthetic Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Configure automated early warning alert sensitivity, demo dataset parameters, and surveillance thresholds</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Thresholds Updated!
          </span>
        )}
      </div>

      {/* Threshold Configuration Section */}
      <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Automated Alert Triggers & Sensitivity Thresholds</h4>
        </div>

        <div className="space-y-5 text-xs">
          <div>
            <div className="flex justify-between font-mono text-slate-300 mb-1.5">
              <label>Carbapenem Percentage-Point Spike Threshold (%)</label>
              <span className="text-cyan-400 font-bold">+{carbaThreshold} percentage points</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="30" 
              value={carbaThreshold}
              onChange={(e) => setCarbaThreshold(Number(e.target.value))}
              className="w-full h-2 bg-space-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[11px] text-slate-500 font-mono mt-1.5">Triggers a CRITICAL early warning alert when rolling observation window rate increase exceeds this percentage-point change.</p>
          </div>

          <div>
            <div className="flex justify-between font-mono text-slate-300 mb-1.5">
              <label>Fluoroquinolone / ESBL Outpatient Prevalence Threshold (%)</label>
              <span className="text-cyan-400 font-bold">{esblThreshold}%</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="70" 
              value={esblThreshold}
              onChange={(e) => setEsblThreshold(Number(e.target.value))}
              className="w-full h-2 bg-space-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-[11px] text-slate-500 font-mono mt-1.5">Sets warning threshold for community outpatient E. coli & K. pneumoniae ESBL emergence alerts.</p>
          </div>
        </div>
      </div>

      {/* Notifications & System Preferences */}
      <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <BellRing className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Surveillance Digest Notifications</h4>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer p-3.5 border border-white/[0.06] rounded-xl hover:bg-white/[0.02] transition-colors">
            <div>
              <span className="font-bold text-white block">Automated Epidemiological Surveillance Digests</span>
              <span className="text-slate-400 text-[11px]">Send daily summary of high-priority cluster alerts to public health authorities</span>
            </div>
            <input 
              type="checkbox" 
              checked={autoEmailAlerts}
              onChange={(e) => setAutoEmailAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Integration Roadmap (Python ML API & EHR Pipeline) */}
      <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Python ML Engine & Pipeline Architecture</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">ML Backend Engine</span>
            <h5 className="font-bold text-white mt-1">Python FastAPI Service</h5>
            <p className="text-[11px] text-slate-400 font-mono mt-1">XGBoost & Isolation Forest microservice on :8000</p>
          </div>
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">Spatial Intelligence</span>
            <h5 className="font-bold text-white mt-1">Spatio-Temporal Model</h5>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Regional resistance propagation forecasting</p>
          </div>
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">Clinical Data Ingestion</span>
            <h5 className="font-bold text-white mt-1">HL7 FHIR Diagnostics Sync</h5>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Automated microbiology lab feed sync</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
};
