import React from 'react';
import { 
  FileSpreadsheet, 
  Binary, 
  Dna, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';

interface SurveillanceFlowDiagramProps {
  isDemoActive?: boolean;
  className?: string;
}

export const SurveillanceFlowDiagram: React.FC<SurveillanceFlowDiagramProps> = ({ 
  isDemoActive = false,
  className = ''
}) => {
  const steps = [
    {
      num: '1',
      title: 'Medical Reports',
      desc: 'Microbiology & Culture',
      icon: FileSpreadsheet,
      activeColor: 'text-sky-400 bg-sky-950/60 border-sky-800'
    },
    {
      num: '2',
      title: 'Data Extraction',
      desc: 'OCR & Parser Structuring',
      icon: Binary,
      activeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800'
    },
    {
      num: '3',
      title: 'AMR Pattern Analysis',
      desc: 'CLSI Phenotype Profiling',
      icon: Dna,
      activeColor: 'text-purple-400 bg-purple-950/60 border-purple-800'
    },
    {
      num: '4',
      title: 'AI Risk / Trend Detection',
      desc: 'XGBoost & Isolation Forest',
      icon: BrainCircuit,
      activeColor: 'text-amber-400 bg-amber-950/60 border-amber-800'
    },
    {
      num: '5',
      title: 'Population Aggregation',
      desc: 'Community Trend (+17 pp)',
      icon: TrendingUp,
      activeColor: 'text-rose-400 bg-rose-950/60 border-rose-800'
    },
    {
      num: '6',
      title: 'Early Warning',
      desc: 'Threshold Alert (48% > 40%)',
      icon: AlertTriangle,
      activeColor: 'text-rose-400 bg-rose-950/60 border-rose-800'
    },
    {
      num: '7',
      title: 'Public Health Action',
      desc: 'Stewardship & Control Audit',
      icon: ShieldCheck,
      activeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
    }
  ];

  return (
    <div className={`relative bg-space-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] shadow-glass ${className}`}>
      <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan"></span>
          <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-cyan-300">
            End-to-End AMR Surveillance Intelligence Pipeline
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Problem: "Medical reporting data needs to be analyzed to identify community health trends"
          </span>
          {isDemoActive && (
            <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shadow-sm">
              Spike Propagated (48%)
            </span>
          )}
        </div>
      </div>

      {/* Responsive Horizontal Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isHighlighted = isDemoActive && (idx >= 3);

          return (
            <div 
              key={step.num}
              className={`relative p-2.5 rounded-xl border text-center flex flex-col items-center justify-between transition-all ${
                isHighlighted 
                  ? `${step.activeColor} ring-1 ring-rose-500/40 shadow-glass` 
                  : 'bg-space-950/40 border-white/[0.05] hover:border-cyan-500/30 hover:bg-space-800/40'
              }`}
            >
              <div className="w-full flex items-center justify-between mb-1.5 text-[9px] font-mono text-slate-400">
                <span className="font-extrabold text-cyan-400">0{step.num}</span>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 hidden lg:block -mr-1" />
                )}
              </div>

              <div className={`p-2 rounded-lg mb-1.5 ${
                isHighlighted ? 'bg-rose-950/60 text-rose-300' : 'bg-white/[0.04] text-cyan-400 border border-white/[0.06]'
              }`}>
                <Icon className="w-4 h-4" />
              </div>

              <strong className="text-[11px] font-bold text-slate-100 block leading-tight">
                {step.title}
              </strong>
              <span className="text-[9px] text-slate-400 mt-1 block font-medium leading-tight">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
