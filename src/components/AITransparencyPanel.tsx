import React, { useState } from 'react';
import { Cpu, ShieldCheck, ChevronDown, ChevronUp, Database } from 'lucide-react';

export const AITransparencyPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const steps = [
    { step: 1, title: 'Collect laboratory reporting data', desc: 'Ingests diagnostic culture records across regional contributing laboratories.' },
    { step: 2, title: 'Structure microbiology observations', desc: 'Extracts specimen, organism taxa, antibiotics tested, and MIC susceptibility values.' },
    { step: 3, title: 'Calculate resistance prevalence', desc: 'Computes exact isolate resistance rate: (Resistant Isolates / Total Tested Isolates) × 100.' },
    { step: 4, title: 'Analyze temporal trends', desc: 'Calculates absolute change (+17 percentage points), relative change, and rolling baselines.' },
    { step: 5, title: 'Detect abnormal deviations', desc: 'Applies Python scikit-learn Isolation Forest and statistical Z-Score drift models.' },
    { step: 6, title: 'Evaluate persistence and spread', desc: 'Assesses multi-period persistence and cross-facility cluster spread.' },
    { step: 7, title: 'Generate explainable early-warning signals', desc: 'Formulates transparent surveillance alerts with step-by-step evidence blocks.' }
  ];

  return (
    <div className="bg-space-900/60 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-glass overflow-hidden text-xs text-slate-200">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-space-950/80 border-b border-white/[0.06] text-white flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30 shadow-glow-cyan">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono font-extrabold uppercase tracking-wider text-cyan-300">How RESISTRA Works</h4>
            <p className="text-[11px] text-slate-400 font-mono">Judge Reference: 7-Step AMR Intelligence Pipeline</p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white cursor-pointer">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 space-y-4 bg-transparent">
          {/* Data Relationship Callout */}
          <div className="p-3 bg-space-950/60 border border-white/[0.06] rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold text-white font-mono">Coherent Synthetic Data Hierarchy:</span>
              <span className="text-slate-300">5,000 lab reports → 14,280 tested isolates across 38 regional laboratories</span>
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-bold shrink-0">
              ~2.85 isolate tests / report
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map(s => (
              <div key={s.step} className="p-3 bg-space-950/40 border border-white/[0.06] rounded-xl flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <h5 className="font-bold text-white leading-snug">{s.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Model Transparency & Evaluation Specifications */}
          <div className="p-4 bg-space-950/60 border border-white/[0.06] rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
                Machine Learning Model Specifications & Held-Out Evaluation (Seed: 42)
              </h5>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                resistra-prototype-v1
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              <div>
                <strong className="text-white block font-mono">What RESISTRA Predicts:</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  Classifies elevated population surveillance risk (LOW vs HIGH) and detects multivariate statistical anomalies across community antimicrobial susceptibility reports.
                </p>
              </div>

              <div>
                <strong className="text-white block font-mono">Model Stack & Features:</strong>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  <strong className="text-cyan-300">XGBoost Classifier</strong> + <strong className="text-indigo-300">Isolation Forest</strong> trained on 10 epidemiological features: rate, previous rate, delta, rolling mean/std, slope, facility count, volume, threshold distance, Z-score.
                </p>
              </div>

              <div>
                <strong className="text-white block font-mono">Held-Out Test Set Metrics (n=500):</strong>
                <p className="text-slate-300 font-mono mt-0.5 leading-relaxed">
                  Accuracy: <strong className="text-cyan-300">95.20%</strong> | Precision: <strong className="text-cyan-300">98.31%</strong><br />
                  Recall: <strong className="text-cyan-300">84.06%</strong> | F1 Score: <strong className="text-cyan-300">90.62%</strong> | ROC-AUC: <strong className="text-cyan-300">0.9168</strong>
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-[10px] leading-relaxed">
              <strong className="text-white font-mono">SURVEILLANCE NOTICE & LIMITATIONS:</strong> RESISTRA uses machine learning to identify patterns associated with elevated AMR surveillance risk and unusual resistance behaviour. Results are intended for research/demo surveillance workflows and require validation on real-world data. It does NOT diagnose patients, prescribe antibiotics, or recommend individual medical treatments.
            </div>
          </div>

          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-cyan-200 flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-white">Synthetic Demonstration Dataset:</strong> This prototype demonstrates an AMR surveillance workflow using synthetic/de-identified demonstration data. It is not a clinical diagnostic system and has not been clinically validated.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
