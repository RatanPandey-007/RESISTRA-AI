import React, { useState } from 'react';
import { Activity, ShieldAlert, Info, X } from 'lucide-react';

export const DataTransparencyBanner: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-cyan-200 shadow-glass backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-cyan-300">
                SYNTHETIC DEMONSTRATION DATA
              </h4>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-mono font-bold px-2 py-0.5 rounded">
                Surveillance Intelligence MVP
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 text-xs font-mono text-cyan-300 hover:text-white font-bold flex items-center gap-1 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <Info className="w-3.5 h-3.5" /> Data & Clinical Status
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-space-900/95 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150 text-slate-200 backdrop-blur-xl">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">SYNTHETIC DEMONSTRATION DATA</h3>
                  <p className="text-xs text-slate-400 font-mono">RESISTRA AI Public Health Surveillance Prototype</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-medium">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 font-semibold">
                This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
              </div>

              <h4 className="font-bold text-white text-xs uppercase tracking-wider pt-1 font-mono">
                Surveillance Scope & System Boundaries
              </h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-300">
                <li><strong className="text-white">AMR Surveillance & Early Warning:</strong> Designed for epidemiological trend tracking, population-level cluster detection, and antimicrobial stewardship decision support.</li>
                <li><strong className="text-white">Non-Prescriptive Design:</strong> RESISTRA does NOT provide autonomous diagnosis or drug prescriptions. All recommendations focus on infection control audits, confirmatory laboratory testing, antibiogram reviews, and stewardship escalations.</li>
                <li><strong className="text-white">Data Privacy:</strong> All sample records in the demonstration dataset are de-identified synthetic placeholders.</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-glow-cyan transition-all cursor-pointer font-mono"
              >
                Acknowledge Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
