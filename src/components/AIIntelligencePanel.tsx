import React, { useState, useEffect } from 'react';
import { MLEvidence, MLModelInfo } from '../types/intelligence';
import { getMLSurveillancePrediction, getMLModelInfo } from '../intelligence/mlClient';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AIIntelligencePanelProps {
  organism?: string;
  antibiotic?: string;
  resistanceRate: number;
  previousRate: number;
  resistanceChange: number;
  facilityCount?: number;
  isDemoActive?: boolean;
}

export const AIIntelligencePanel: React.FC<AIIntelligencePanelProps> = ({
  organism = 'Escherichia coli',
  antibiotic = 'Ciprofloxacin',
  resistanceRate,
  previousRate,
  resistanceChange,
  facilityCount = 4,
  isDemoActive = false
}) => {
  const [evidence, setEvidence] = useState<MLEvidence | null>(null);
  const [modelInfo, setModelInfo] = useState<MLModelInfo | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getMLSurveillancePrediction({
        organism,
        antibiotic,
        resistanceRate,
        previousResistanceRate: previousRate,
        resistanceChange,
        facilityCount,
        reportingVolume: 1800
      }),
      getMLModelInfo()
    ]).then(([pred, info]) => {
      if (isMounted) {
        setEvidence(pred);
        setModelInfo(info);
        setLoading(false);
      }
    }).catch(err => {
      console.error('Failed to load ML inference:', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [organism, antibiotic, resistanceRate, previousRate, resistanceChange, facilityCount, isDemoActive]);

  if (loading && !evidence) {
    return (
      <div className="bg-space-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 shadow-glass animate-pulse">
        <div className="h-5 w-48 bg-space-800/80 rounded mb-3"></div>
        <div className="h-16 bg-space-950/60 rounded"></div>
      </div>
    );
  }

  const isHighRisk = evidence?.predictedRisk === 'HIGH_RISK';
  const probPercent = evidence ? (evidence.riskProbability * 100).toFixed(1) : '0.0';
  const metrics = modelInfo?.classificationMetrics || evidence?.evaluationMetrics;

  return (
    <div className="bg-space-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-glass p-5 space-y-4 text-slate-200">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white rounded-xl shadow-glow-cyan">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">AI Intelligence Engine</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md">
                {modelInfo?.modelVersion || 'resistra-prototype-v1'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Dual-Model Architecture: <strong className="text-cyan-300">XGBoost</strong> (Risk) + <strong className="text-indigo-300">Isolation Forest</strong> (Anomaly)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.08] font-mono font-semibold px-2 py-0.5 rounded">
            Dataset: Synthetic (n=2,500)
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {showDetails ? 'Hide Model Metrics' : 'Model Specs & Evaluation'}
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Live Inference Output */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        {/* Risk Classification Result */}
        <div className="p-3.5 bg-space-950/60 rounded-xl border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            ML Resistance Risk
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-base font-extrabold px-2 py-0.5 rounded border font-mono ${
              isHighRisk 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {evidence?.predictedRisk || 'LOW_RISK'}
            </span>
            <span className="text-slate-400 font-semibold text-xs">
              Probability: <strong className="text-white">{probPercent}%</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5 font-mono">
            Model: XGBoost Classifier (stratified 80/20 split)
          </span>
        </div>

        {/* Anomaly Detection Result */}
        <div className="p-3.5 bg-space-950/60 rounded-xl border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Multivariate Anomaly Detection
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-base font-extrabold px-2 py-0.5 rounded border font-mono ${
              evidence?.isAnomaly 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800/60 text-slate-300 border-slate-700'
            }`}>
              {evidence?.isAnomaly ? 'DETECTED' : 'NORMAL'}
            </span>
            <span className="text-slate-400 font-semibold text-xs">
              Score: <strong className="text-white">{evidence?.anomalyScore.toFixed(1)}/100</strong>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block pt-0.5 font-mono">
            Model: Isolation Forest (contamination=0.15)
          </span>
        </div>

        {/* Focus Target Pathogen */}
        <div className="p-3.5 bg-space-950/60 rounded-xl border border-white/[0.06] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Current Evaluated Signal
          </span>
          <strong className="text-sm font-bold text-white block mt-1">
            {organism} × {antibiotic}
          </strong>
          <span className="text-[11px] text-slate-300 block">
            Prevalence: <strong className="text-cyan-300">{resistanceRate.toFixed(1)}%</strong> ({resistanceChange >= 0 ? '+' : ''}{resistanceChange.toFixed(1)} pp)
          </span>
        </div>
      </div>

      {/* Model Contributing Signals ("Why did the model flag this?") */}
      {evidence && evidence.contributingSignals.length > 0 && (
        <div className="p-3.5 bg-space-950/80 text-slate-200 rounded-xl border border-white/[0.06] text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold uppercase tracking-wider text-amber-300 text-[11px] flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Model Contributing Signals: "Why did the model flag this?"
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Statistical Feature Attribution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {evidence.contributingSignals.map((sig, idx) => (
              <div key={idx} className="p-2 bg-space-900/60 rounded-lg border border-white/[0.06] text-xs flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded font-mono ${
                  sig.direction === 'up' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {sig.direction === 'up' ? '↑' : sig.direction === 'down' ? '↓' : '•'}
                </span>
                <span className="text-slate-200 font-medium leading-snug">{sig.impact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Model Transparency & Held-Out Metrics */}
      {showDetails && metrics && (
        <div className="p-4 bg-space-950/80 rounded-xl border border-white/[0.06] text-xs space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs font-mono">
              <Activity className="w-4 h-4 text-cyan-400" />
              Held-Out Test Set Performance (n=500, Seed: 42)
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Evaluated on Held-Out Split</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="p-2 bg-space-900/60 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Accuracy</span>
              <strong className="text-cyan-300 text-sm font-extrabold font-mono">{(metrics.accuracy * 100).toFixed(2)}%</strong>
            </div>
            <div className="p-2 bg-space-900/60 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Precision</span>
              <strong className="text-cyan-300 text-sm font-extrabold font-mono">{(metrics.precision * 100).toFixed(2)}%</strong>
            </div>
            <div className="p-2 bg-space-900/60 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Recall</span>
              <strong className="text-cyan-300 text-sm font-extrabold font-mono">{(metrics.recall * 100).toFixed(2)}%</strong>
            </div>
            <div className="p-2 bg-space-900/60 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">F1 Score</span>
              <strong className="text-cyan-300 text-sm font-extrabold font-mono">{(metrics.f1Score * 100).toFixed(2)}%</strong>
            </div>
            <div className="p-2 bg-space-900/60 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">ROC-AUC</span>
              <strong className="text-cyan-300 text-sm font-extrabold font-mono">{metrics.rocAuc.toFixed(4)}</strong>
            </div>
          </div>

          {/* Model Distinction Note */}
          <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Architecture Separation:</strong> The ML model provides empirical probabilistic evidence (e.g. {probPercent}% risk probability) to inform the human public-health analyst. The final alert classification (HIGH / CRITICAL / WATCH) remains orchestrated by transparent surveillance rules.
            </p>
          </div>
        </div>
      )}

      {/* Mandatory Medical Safety Disclaimer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/[0.06]">
        <span className="flex items-center gap-1 text-slate-400 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          Synthetic Demonstration Model — Prototype model, not clinically validated.
        </span>
        <span className="font-mono text-slate-400">Non-Clinical Decision Support</span>
      </div>
    </div>
  );
};
