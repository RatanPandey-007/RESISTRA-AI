import React from 'react';
import { ShieldCheck, ShieldAlert, X, Database, Lock, Stethoscope, FileCheck } from 'lucide-react';

interface DataClinicalStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataClinicalStatusModal: React.FC<DataClinicalStatusModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative overflow-hidden bg-space-900/95 rounded-2xl max-w-xl w-full p-6 border border-white/10 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-md">
                  TRANSPARENCY DISCLOSURE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2.0 Synthetic Benchmark</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-wide mt-0.5">Data & Clinical Status Specification</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Core Pillars */}
        <div className="space-y-3 text-xs leading-relaxed">
          {/* Item 1: Synthetic Data */}
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl flex items-start gap-3">
            <Database className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono block">1. SYNTHETIC DEMONSTRATION DATA</strong>
              <p className="text-slate-300 mt-0.5">
                This prototype demonstrates the analytical workflow using synthetic surveillance data. Clinical deployment requires validated datasets, expert evaluation, regulatory review and prospective validation.
              </p>
            </div>
          </div>

          {/* Item 2: Privacy */}
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono block">2. Privacy & Patient Anonymity</strong>
              <p className="text-slate-300 mt-0.5">
                No real patient-identifiable information (PII) or protected health information (PHI) is collected, stored, or processed. All patient and report identifiers (e.g. PT-9921, LAB-2026) are non-existent synthetic tokens.
              </p>
            </div>
          </div>

          {/* Item 3: Demonstration Purpose */}
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl flex items-start gap-3">
            <Stethoscope className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono block">3. Research & Demonstration Purpose</strong>
              <p className="text-slate-300 mt-0.5">
                Risk classifications, anomaly detection scores, and epidemiological predictions are provided strictly for public-health research and technical demonstration workflows.
              </p>
            </div>
          </div>

          {/* Item 4: Real-world Requirement */}
          <div className="p-3.5 bg-space-950/60 border border-white/[0.08] rounded-xl flex items-start gap-3">
            <FileCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono block">4. Deployment Prerequisites</strong>
              <p className="text-slate-300 mt-0.5">
                Any future clinical implementation or institutional hospital deployment will strictly require prospective multicenter clinical validation, regulatory review, and local institutional review board (IRB) approval.
              </p>
            </div>
          </div>
        </div>

        {/* Highlighted Medical Boundary Box */}
        <div className="p-3.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-100 font-mono">Non-Diagnostic Boundary:</strong> RESISTRA AI is an analytical decision-support tool designed for epidemiologists and antimicrobial stewardship committees. It does <strong>not</strong> make autonomous diagnoses, does <strong>not</strong> prescribe medication, and does <strong>not</strong> substitute for licensed physician judgement.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">
            CLSI / EUCAST 2026 Reference Alignment
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
