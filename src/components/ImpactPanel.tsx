import React from 'react';
import { 
  FileText, 
  BrainCircuit, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface ImpactPanelProps {
  className?: string;
}

export const ImpactPanel: React.FC<ImpactPanelProps> = ({ className = '' }) => {
  return (
    <div className={`bg-space-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-glass p-6 space-y-5 text-slate-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg shadow-sm">
              <Award className="w-4 h-4 text-emerald-400" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              System Architecture & Public Health Impact Framework
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Bridging disconnected microbiology diagnostic data into proactive community surveillance intelligence
          </p>
        </div>
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md shrink-0">
          Lenovo / SIH Hackathon Evaluation Model
        </span>
      </div>

      {/* 4 Pillars Grid: INPUT -> AI -> OUTPUT -> IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* INPUT */}
        <div className="p-4 bg-space-950/60 border border-white/[0.06] rounded-xl space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded">
                STAGE 1
              </span>
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-mono font-extrabold text-white mt-2">INPUT</h4>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              Laboratory & Microbiology Reports
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Antimicrobial Susceptibility Testing (AST)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Minimum Inhibitory Concentration (MIC)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Multi-facility diagnostic lab records</span>
              </li>
            </ul>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">De-identified / synthetic feeds</span>
        </div>

        {/* AI */}
        <div className="p-4 bg-space-950/60 border border-white/[0.06] rounded-xl space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">
                STAGE 2
              </span>
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-sm font-mono font-extrabold text-white mt-2">AI CORE</h4>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              Pattern + Trend + Anomaly Analysis
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400">•</span>
                <span>CLSI breakpoint phenotype mapping</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400">•</span>
                <span>XGBoost risk classification (95.2% accuracy)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400">•</span>
                <span>Isolation Forest multivariate anomaly detection</span>
              </li>
            </ul>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Real Python ML inference engine</span>
        </div>

        {/* OUTPUT */}
        <div className="p-4 bg-space-950/60 border border-white/[0.06] rounded-xl space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded">
                STAGE 3
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-sm font-mono font-extrabold text-white mt-2">OUTPUT</h4>
            <p className="text-xs font-semibold text-slate-200 mt-0.5">
              Early Warning Signals for Public Health
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1.5 font-medium">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Quantitative risk score (0–100)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Transparent "Why this alert?" factors</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Spatial-temporal cluster notifications</span>
              </li>
            </ul>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Aggregated population indicators</span>
        </div>

        {/* IMPACT */}
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                BENEFIT
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-mono font-extrabold text-emerald-300 mt-2">PUBLIC HEALTH IMPACT</h4>
            <p className="text-xs font-semibold text-emerald-200 mt-0.5">
              Proactive Antimicrobial Containment
            </p>
            <ul className="text-xs text-slate-300 mt-2 space-y-1.5 font-medium">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Earlier detection of emerging AMR trends</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Better community-level surveillance</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Faster public-health response</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Support for antimicrobial stewardship</span>
              </li>
            </ul>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Non-prescriptive decision support</span>
        </div>
      </div>

      {/* Mandatory Synthetic Data Transparency Statement (Task 6) */}
      <div className="p-3.5 bg-space-950/60 border border-white/[0.06] rounded-xl flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="font-medium">
          <strong className="text-white font-mono">SYNTHETIC DEMONSTRATION DATA:</strong> This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
        </p>
      </div>
    </div>
  );
};
