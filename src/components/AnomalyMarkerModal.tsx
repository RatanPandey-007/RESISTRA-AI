import React from 'react';
import { X, AlertTriangle, Cpu, Info } from 'lucide-react';

interface AnomalyMarkerModalProps {
  anomalyDetails: {
    month: string;
    organism: string;
    antibiotic: string;
    observedValue: number;
    baselineValue: number;
    deviation: number;
    anomalyScore: number;
    explanation: string;
  };
  onClose: () => void;
}

export const AnomalyMarkerModal: React.FC<AnomalyMarkerModalProps> = ({ anomalyDetails, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-space-900/95 rounded-2xl max-w-lg w-full p-6 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 backdrop-blur-xl text-slate-200">
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl shadow-glow-rose">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">Surveillance Anomaly Marker</span>
              <h3 className="text-base font-mono font-bold text-white">{anomalyDetails.organism}</h3>
              <p className="text-xs text-slate-400 font-mono">{anomalyDetails.antibiotic} • {anomalyDetails.month}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-space-950/80 border border-white/[0.06] rounded-xl">
            <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Observed Resistance</span>
            <strong className="text-rose-400 text-xl font-mono font-extrabold block mt-0.5">{anomalyDetails.observedValue}%</strong>
          </div>

          <div className="p-3 bg-space-950/80 border border-white/[0.06] rounded-xl">
            <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Rolling Baseline</span>
            <strong className="text-slate-200 text-xl font-mono font-extrabold block mt-0.5">{anomalyDetails.baselineValue}%</strong>
          </div>

          <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl">
            <span className="text-rose-300 block text-[10px] font-mono font-bold uppercase">Deviation</span>
            <strong className="text-rose-400 text-base font-mono font-bold block mt-0.5">
              +{anomalyDetails.deviation.toFixed(1)} percentage points
            </strong>
          </div>

          <div className="p-3 bg-space-950/80 border border-cyan-500/30 rounded-xl">
            <span className="text-cyan-300 block text-[10px] font-mono font-bold uppercase">Anomaly Score</span>
            <strong className="text-cyan-300 text-base font-mono font-extrabold block mt-0.5">{anomalyDetails.anomalyScore} / 100</strong>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="p-3.5 bg-space-950/90 border border-white/[0.08] text-slate-200 rounded-xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold">
            <Cpu className="w-4 h-4" />
            <span>ANOMALY EXPLANATION:</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            {anomalyDetails.explanation}
          </p>
        </div>

        {/* Surveillance Step */}
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-cyan-200 text-xs flex items-center gap-2 font-mono">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Surveillance signal active: Review local laboratory antibiogram and escalate to stewardship team.</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-glow-cyan cursor-pointer transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
