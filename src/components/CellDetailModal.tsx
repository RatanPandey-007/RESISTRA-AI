import React from 'react';
import { MatrixData } from '../types';
import { formatPercent, formatPercentagePointChange, getSeverityBadgeStyle } from '../utils/formatters';
import { X, Grid3X3, ShieldAlert, Activity } from 'lucide-react';

interface CellDetailModalProps {
  cell: MatrixData;
  onClose: () => void;
}

export const CellDetailModal: React.FC<CellDetailModalProps> = ({ cell, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-space-900/95 rounded-2xl max-w-lg w-full p-6 border border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 backdrop-blur-xl text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30 shadow-glow-cyan">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Strain Profile Details</span>
              <h3 className="text-base font-mono font-bold text-white">{cell.organism}</h3>
              <p className="text-xs font-mono font-semibold text-cyan-300">Antibiotic: {cell.antibiotic}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-space-950/80 border border-white/[0.06] rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 block font-medium">Resistance Rate</span>
            <span className="text-2xl font-mono font-extrabold text-white block mt-0.5">{formatPercent(cell.resistanceRate)}</span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">Based on n={cell.sampleSize.toLocaleString()} isolates</span>
          </div>

          <div className="p-3.5 bg-space-950/80 border border-white/[0.06] rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 block font-medium">Observed Change</span>
            <span className={`text-base font-mono font-bold block mt-1 ${cell.percentagePointChange > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatPercentagePointChange(cell.percentagePointChange)}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">Vs Previous Baseline ({cell.previousPeriodRate}%)</span>
          </div>
        </div>

        {/* Alert Status Card */}
        <div className="p-4 bg-space-950/90 border border-white/[0.08] text-slate-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Surveillance Status:
            </span>
            <span className={`text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded border ${getSeverityBadgeStyle(cell.alertStatus)}`}>
              {cell.alertStatus} Priority
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
            {cell.percentagePointChange >= 10 
              ? `Significant resistance spike detected (+${cell.percentagePointChange} percentage points). Exceeds alert threshold.`
              : cell.resistanceRate >= 50
              ? `High baseline resistance prevalence (${cell.resistanceRate}%). Standard surveillance active.`
              : `Baseline resistance profile within expected historical surveillance parameters.`}
          </p>
        </div>

        {/* Non-Prescriptive Action Guidance */}
        <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-cyan-200 text-xs space-y-1 font-mono">
          <span className="font-bold flex items-center gap-1.5 text-cyan-300">
            <Activity className="w-4 h-4 text-cyan-400" /> Recommended Surveillance Step:
          </span>
          <p className="text-slate-300 font-sans text-xs">
            Review regional hospital antibiograms and escalate findings to local antimicrobial stewardship committee if upward trend continues.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-glow-cyan transition-all cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
