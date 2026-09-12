import React, { useState } from 'react';
import { DEMO_ALERTS } from '../data/demoData';
import { AMRAlert, PageId } from '../types';
import { ExplainableAIPanel } from '../components/ExplainableAIPanel';
import { formatPercentagePointChange, getSeverityBadgeStyle } from '../utils/formatters';
import { ShieldAlert, Database, ArrowLeft, TrendingUp } from 'lucide-react';

interface AlertsPageProps {
  onNavigate?: (page: PageId) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ onNavigate }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<AMRAlert | null>(DEMO_ALERTS[0]);
  const [investigatingStatus, setInvestigatingStatus] = useState<Record<string, string>>({});

  const filteredAlerts = DEMO_ALERTS.filter(alert => {
    if (filterSeverity === 'all') return true;
    return alert.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const handleStatusChange = (alertId: string, status: string) => {
    setInvestigatingStatus(prev => ({ ...prev, [alertId]: status }));
  };

  return (
    <div className="space-y-6">
      {/* Alert Header and Filter Controls */}
      <div className="relative overflow-hidden rounded-xl bg-[#06090e] border border-white/[0.06] p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-wide">AMR Early Warning Signal Registry</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" />
                Demo / Synthetic Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Automated spatial & temporal cluster detection signals with Explainable AI transparency</p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#020406] p-1 rounded-xl border border-white/[0.06] text-xs">
          {['all', 'critical', 'high', 'moderate', 'watch'].map((severity) => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold capitalize transition-all cursor-pointer ${
                filterSeverity === severity
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alert List & Detail Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List Column (1 Col) */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;

            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40 backdrop-blur-md'
                    : 'border-white/[0.08] bg-space-900/60 hover:bg-space-800/60 hover:border-white/[0.15] backdrop-blur-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${getSeverityBadgeStyle(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{alert.date}</span>
                </div>

                <h4 className="text-xs font-bold text-white tracking-wide">{alert.affectedOrganism}</h4>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">Drug: {alert.antibiotic}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06] text-[11px]">
                  <span className="text-rose-400 font-mono font-bold">
                    {formatPercentagePointChange(alert.percentagePointChange)}
                  </span>
                  <span className="text-slate-500 font-mono">n={alert.sampleCount}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Alert Detailed View (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          {selectedAlert ? (
            <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-6 shadow-2xl space-y-5">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
              <div className="flex flex-wrap items-start justify-between border-b border-white/[0.08] pb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${getSeverityBadgeStyle(selectedAlert.severity)}`}>
                      {selectedAlert.severity} Priority Alert
                    </span>
                    <span className="text-xs font-mono text-slate-500">{selectedAlert.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-wide mt-2">{selectedAlert.affectedOrganism}</h2>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">Target Antibiotic: {selectedAlert.antibiotic}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Detection Time Window</span>
                  <span className="text-xs font-mono font-bold text-slate-200">{selectedAlert.timeWindow}</span>
                  <span className="block text-[10px] font-mono text-cyan-400 mt-1">Confidence Score: {selectedAlert.confidenceScore}%</span>
                </div>
              </div>

              {/* Statistical Shift Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-space-950/60 border border-white/[0.08] rounded-xl">
                  <span className="text-slate-400 block text-[11px] font-mono">Previous Baseline Rate</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">{selectedAlert.previousPeriodRate}%</strong>
                </div>

                <div className="p-3 bg-space-950/60 border border-white/[0.08] rounded-xl">
                  <span className="text-slate-400 block text-[11px] font-mono">Current Period Rate</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">{selectedAlert.currentPeriodRate}%</strong>
                </div>

                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                  <span className="text-rose-300 block text-[11px] font-mono font-semibold">Percentage Point Shift</span>
                  <strong className="text-rose-300 text-sm font-mono font-extrabold block mt-0.5">
                    {formatPercentagePointChange(selectedAlert.percentagePointChange)}
                  </strong>
                </div>
              </div>

              {/* Explainable AI Panel Component */}
              <ExplainableAIPanel 
                rationale={selectedAlert.explainableRationale}
                surveillanceActions={selectedAlert.surveillanceAction}
                severity={selectedAlert.severity}
                riskScore={selectedAlert.confidenceScore}
                riskLevel={selectedAlert.severity.toUpperCase()}
              />

              {/* Status Update Button Simulation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-white/[0.08] gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  Investigation Status: <strong className="text-cyan-400 uppercase font-bold">{investigatingStatus[selectedAlert.id] || selectedAlert.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleStatusChange(selectedAlert.id, 'under_review')}
                    className="px-3.5 py-2 text-xs font-mono font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                  >
                    Mark Under Review
                  </button>
                  <button 
                    onClick={() => handleStatusChange(selectedAlert.id, 'resolved')}
                    className="px-3.5 py-2 text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
                  >
                    Acknowledge Alert
                  </button>
                </div>
              </div>

              {/* Guided Judge Navigation Buttons */}
              {onNavigate && (
                <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> Return to AMR Intelligence Center
                  </button>
                  <button
                    onClick={() => onNavigate('trends')}
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Longitudinal AMR Trend Analysis →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-12 text-center text-slate-500 font-mono text-xs">
              Select an alert from the signal registry to inspect deep Explainable AI attribution and containment actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
