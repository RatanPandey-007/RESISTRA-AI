import React from 'react';
import { ExplainableRationale } from '../types';
import { BrainCircuit, CheckCircle2, AlertTriangle, Layers, MapPin, ShieldAlert } from 'lucide-react';

interface ExplainableAIPanelProps {
  rationale: ExplainableRationale;
  surveillanceActions: string[];
  severity?: string;
  riskScore?: number;
  riskLevel?: string;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({
  rationale,
  surveillanceActions,
  severity,
  riskScore,
  riskLevel
}) => {
  const displayLevel = riskLevel || severity || 'HIGH';
  const displayScore = riskScore !== undefined ? riskScore : 84;

  return (
    <div className="bg-space-900/60 backdrop-blur-xl text-slate-200 rounded-2xl p-5 shadow-glass border border-white/[0.08] space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/[0.06] pb-3 gap-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-cyan-300">
            {rationale.title || 'WHY THIS ALERT WAS GENERATED'}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-md font-bold uppercase">
            Risk: {displayLevel} ({displayScore}/100)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md font-bold uppercase">
            Explainable AI
          </span>
        </div>
      </div>

      {/* Primary Metric Change Banner */}
      <div className="p-3.5 bg-space-950/80 border border-white/[0.06] rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg shrink-0 border border-rose-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Key Statistical Shift</span>
            <p className="text-xs font-bold text-white mt-0.5">{rationale.primaryMetricChange}</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-cyan-300 bg-space-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-semibold shrink-0">
          {rationale.timeWindow}
        </span>
      </div>

      {/* Decision Factors */}
      <div>
        <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-amber-400" /> Contributing Analytical Factors:
        </h5>
        <ul className="space-y-1.5 pl-1 text-xs text-slate-300">
          {rationale.factors.map((factor, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold text-xs shrink-0 mt-0.5">•</span>
              <span className="leading-relaxed">{factor}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Observed Locations */}
      {rationale.observedLocations && rationale.observedLocations.length > 0 && (
        <div className="pt-2 border-t border-white/[0.06]">
          <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Affected Facility Clusters:
          </h5>
          <div className="flex flex-wrap gap-1.5">
            {rationale.observedLocations.map((loc, i) => (
              <span key={i} className="text-[11px] font-mono bg-space-950/60 text-slate-200 px-2.5 py-0.5 rounded-lg border border-white/[0.06] font-medium">
                {loc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Surveillance Actions (Non-Prescriptive) */}
      <div className="pt-3 border-t border-white/[0.06]">
        <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Recommended Surveillance & Stewardship Actions:
        </h5>
        <div className="space-y-2">
          {surveillanceActions.map((action, i) => (
            <div key={i} className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Professional Non-Clinical Decision Support Statement */}
      <div className="pt-2.5 border-t border-white/[0.06] text-[10px] text-slate-400 flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-white font-mono">Professional Decision-Support Statement:</strong> This system is an analytical decision-support tool that assists healthcare and public-health surveillance professionals; it does not replace clinical diagnosis or individual patient treatment decisions.
        </p>
      </div>
    </div>
  );
};
