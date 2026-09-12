import React from 'react';
import { DemoStepStatus, DemoRunResult } from '../intelligence/demoEngine';
import { PageId } from '../types';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  RotateCcw, 
  LayoutDashboard, 
  TrendingUp, 
  ShieldAlert,
  Zap,
  BrainCircuit,
  X
} from 'lucide-react';

interface LiveDemoModalProps {
  isRunning: boolean;
  currentStepIndex: number;
  steps: DemoStepStatus[];
  result: DemoRunResult | null;
  onClose: () => void;
  onReset: () => void;
  onNavigate: (page: PageId) => void;
}

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isRunning,
  currentStepIndex,
  steps,
  result,
  onClose,
  onReset,
  onNavigate
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative overflow-hidden bg-space-900/95 rounded-2xl max-w-2xl w-full p-6 border border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Zap className="w-5 h-5 fill-cyan-400 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-md">
                  HACKATHON DEMO MODE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">End-to-End AMR Pipeline</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide mt-0.5">Live Intelligence Surveillance Pipeline</h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Progress Stepper */}
        <div className="space-y-2 bg-space-950/60 p-4 rounded-xl border border-white/[0.08]">
          <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Pipeline Execution Sequence</span>
            <span className="text-cyan-400">
              {isRunning ? `Running Step ${currentStepIndex + 1} of 7...` : result ? 'Pipeline Complete (7/7)' : 'Ready to Run'}
            </span>
          </h4>

          <div className="grid grid-cols-1 gap-2">
            {steps.map((step, idx) => {
              const isCurrent = isRunning && idx === currentStepIndex;
              const isPast = (result !== null) || (isRunning && idx < currentStepIndex);

              return (
                <div 
                  key={step.step}
                  className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between transition-all duration-150 ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200 ring-1 ring-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : isPast
                      ? 'bg-space-900/80 border-emerald-500/30 text-emerald-300 font-medium'
                      : 'bg-space-950/40 border-white/[0.05] text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-extrabold text-[10px] uppercase w-12 text-slate-400">
                      {step.label}
                    </span>
                    <span className="font-medium text-slate-200">{step.description}</span>
                  </div>

                  <div className="shrink-0">
                    {isCurrent && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {!isCurrent && !isPast && <span className="text-[10px] text-slate-600 font-mono">Pending</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Result Card: EMERGING RESISTANCE SIGNAL */}
        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-4 bg-space-950/80 text-white rounded-xl border border-white/[0.1] shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </span>
                  <h4 className="font-mono font-bold text-sm uppercase tracking-wider text-rose-300">
                    EMERGING RESISTANCE SIGNAL
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 bg-rose-950/80 text-rose-300 font-mono font-bold text-[10px] uppercase rounded border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                  Severity: HIGH
                </span>
              </div>

              {/* Organism + Drug + Shift Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-space-900/80 rounded-lg border border-white/[0.08] text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Pathogen & Drug</span>
                  <strong className="text-white text-sm block mt-0.5">{result.trend.organism}</strong>
                  <span className="text-cyan-400 font-mono text-[11px] mt-0.5 block">{result.trend.antibiotic}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Prevalence Shift</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-slate-300 text-sm font-mono">31%</span>
                    <span className="text-slate-500 font-mono">→</span>
                    <span className="text-rose-400 font-mono font-extrabold text-base">48%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Community Outpatient Network</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Observed Difference</span>
                  <strong className="text-rose-400 text-base font-mono font-extrabold block mt-0.5">
                    +17 percentage points
                  </strong>
                  <span className="text-[10px] text-emerald-400 block mt-0.5 font-mono">+54.8% relative increase</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Surveillance Threshold</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-slate-300 text-xs font-mono font-semibold">Cutoff: 40%</span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase animate-pulse">
                    THRESHOLD EXCEEDED
                  </span>
                </div>
              </div>

              {/* WHY WAS THIS SIGNAL GENERATED? */}
              <div className="pt-2 border-t border-white/[0.08] text-xs space-y-2">
                <h5 className="font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  WHY WAS THIS SIGNAL GENERATED?
                </h5>
                <ul className="space-y-1.5 pl-1 text-slate-300 text-xs font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Resistance increased over the surveillance window (from 31% to 48%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Observed increase (+17 percentage points) exceeded the configured surveillance threshold.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Persistent upward trend detected across consecutive reporting periods.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Signal observed across multiple reporting sources (4 community outpatient facilities).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Deviation from historical baseline detected (Statistical Anomaly Score: 78/100, Z-score &gt; 2.5).</span>
                  </li>
                </ul>
              </div>

              {/* ML MODEL EVIDENCE (XGBoost + Isolation Forest) */}
              {result.mlEvidence && (
                <div className="pt-2.5 border-t border-white/[0.08] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 text-[11px]">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                      ML EVIDENCE: XGBoost ({result.mlEvidence.modelVersion})
                    </h5>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      Held-out Test Acc: {(result.mlEvidence.evaluationMetrics.accuracy * 100).toFixed(1)}% | ROC-AUC: {result.mlEvidence.evaluationMetrics.rocAuc.toFixed(3)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-space-900/90 p-2.5 rounded-lg border border-white/[0.08]">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">ML Risk Classification</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-xs">
                          {result.mlEvidence.predictedRisk}
                        </span>
                        <span className="text-white font-mono text-xs">
                          Probability: <strong>{(result.mlEvidence.riskProbability * 100).toFixed(1)}%</strong>
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono font-bold uppercase">Multivariate Anomaly Detector</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                          {result.mlEvidence.isAnomaly ? 'ANOMALY DETECTED' : 'NORMAL'}
                        </span>
                        <span className="text-white font-mono text-xs">
                          Score: <strong>{result.mlEvidence.anomalyScore.toFixed(1)}/100</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Model Contributing Signals ("Why did the model flag this?") */}
                  {result.mlEvidence.contributingSignals.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Model Contributing Signals ("Why did the model flag this?"):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                        {result.mlEvidence.contributingSignals.map((sig, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-slate-300">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{sig.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 italic pt-1">
                    {result.mlEvidence.disclaimer}
                  </p>
                </div>
              )}

              {/* Recommended Surveillance Action (Non-Prescriptive) */}
              <div className="pt-2 border-t border-white/[0.08] text-xs space-y-1.5">
                <h5 className="font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  RECOMMENDED SURVEILLANCE ACTIONS:
                </h5>
                <div className="space-y-1 text-emerald-100 font-medium">
                  {result.alert.recommendedSurveillanceAction.slice(0, 3).map((act, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Synthetic Data Transparency Note */}
            <div className="p-3 bg-space-950/60 border border-white/[0.08] rounded-xl text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed font-mono">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">SYNTHETIC DEMONSTRATION DATA:</strong> This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
              </p>
            </div>

            {/* Quick Navigation / Reset Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={onReset}
                className="px-4 py-2 text-xs font-mono font-bold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo to Baseline
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('dashboard');
                  }}
                  className="px-3.5 py-2 text-xs font-mono font-bold text-slate-200 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" /> View on Dashboard
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('trends');
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> View in AMR Trends <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
