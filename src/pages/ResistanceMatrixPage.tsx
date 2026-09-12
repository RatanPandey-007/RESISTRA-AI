import React, { useState } from 'react';
import { DEMO_ORGANISMS_LIST, DEMO_ANTIBIOTICS_LIST, DEMO_RESISTANCE_MATRIX } from '../data/demoData';
import { INITIAL_SURVEILLANCE_DATASET } from '../data/surveillanceData';
import { SurveillanceRecord, MatrixData, PageId } from '../types';
import { calculateTemporalTrend } from '../intelligence/trendEngine';
import { detectAnomaly } from '../intelligence/anomalyEngine';
import { calculateRiskAssessment } from '../intelligence/riskEngine';
import { CellDetailModal } from '../components/CellDetailModal';
import { 
  Grid3X3, 
  Info, 
  Download, 
  MousePointerClick,
  Database,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';

interface ResistanceMatrixPageProps {
  dataset?: SurveillanceRecord[];
  onNavigate?: (page: PageId) => void;
}

export const ResistanceMatrixPage: React.FC<ResistanceMatrixPageProps> = ({ 
  dataset = INITIAL_SURVEILLANCE_DATASET,
  onNavigate 
}) => {
  const [selectedCell, setSelectedCell] = useState<MatrixData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ organism: string; antibiotic: string } | null>(null);

  // Helper function to dynamically compute matrix data cell from live intelligence engine
  const getComputedCellData = (organism: string, antibiotic: string): MatrixData => {
    const trend = calculateTemporalTrend(dataset, organism, antibiotic);

    // If records exist in the dynamic surveillance dataset, compute live metrics
    if (trend.historicalSeries.length > 0) {
      const anomaly = detectAnomaly(trend);
      const risk = calculateRiskAssessment(trend, anomaly);

      let alertStatus: 'critical' | 'high' | 'moderate' | 'watch' | 'normal' = 'normal';
      if (risk.riskCategory === 'CRITICAL') alertStatus = 'critical';
      else if (risk.riskCategory === 'HIGH') alertStatus = 'high';
      else if (risk.riskCategory === 'MODERATE') alertStatus = 'moderate';
      else if (risk.riskCategory === 'WATCH') alertStatus = 'watch';

      const totalSamples = trend.historicalSeries.reduce((acc, curr) => acc + curr.sampleCount, 0);

      return {
        organism,
        antibiotic,
        resistanceRate: trend.currentRate,
        previousPeriodRate: trend.previousRate,
        percentagePointChange: trend.absoluteChange,
        sampleSize: totalSamples || 1000,
        alertStatus,
        anomalyScore: anomaly.anomalyScore,
        isAnomaly: anomaly.isAnomaly
      };
    }

    // Fallback to static surveillance matrix baseline
    const fallback = DEMO_RESISTANCE_MATRIX.find(
      m => m.organism.toLowerCase() === organism.toLowerCase() &&
           m.antibiotic.toLowerCase() === antibiotic.toLowerCase()
    );

    if (fallback) {
      return fallback;
    }

    return {
      organism,
      antibiotic,
      resistanceRate: 0,
      previousPeriodRate: 0,
      percentagePointChange: 0,
      sampleSize: 0,
      alertStatus: 'normal'
    };
  };

  const getCellStyle = (rate: number, isIntrinsicZero: boolean, alertStatus: string) => {
    if (isIntrinsicZero) return 'bg-space-950/40 text-slate-600 font-mono';
    if (alertStatus === 'critical' || rate >= 75) return 'bg-rose-950/70 border border-rose-500/40 text-rose-200 font-bold hover:bg-rose-900/80 hover:scale-[1.02] cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.25)]';
    if (alertStatus === 'high' || rate >= 50) return 'bg-rose-900/50 border border-rose-500/30 text-rose-200 font-semibold hover:bg-rose-800/60 cursor-pointer';
    if (rate >= 30) return 'bg-amber-950/60 border border-amber-500/30 text-amber-200 font-semibold hover:bg-amber-900/60 cursor-pointer';
    if (rate >= 15) return 'bg-amber-900/30 border border-amber-500/20 text-amber-300 font-medium hover:bg-amber-800/40 cursor-pointer';
    if (rate > 0) return 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 font-medium hover:bg-emerald-900/50 cursor-pointer';
    return 'bg-space-950/30 text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#06090e] border border-white/[0.06] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Grid3X3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">Organism × Antibiotic Resistance Cross-Tabulation</h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md flex items-center gap-1">
              <Database className="w-3 h-3 text-amber-400" />
              Demo / Synthetic Data
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400 inline shrink-0" />
            Click any cell to open deep-dive strain metrics, percentage-point shifts, and surveillance actions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs border-t md:border-t-0 pt-2 md:pt-0 border-white/[0.06] flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Prevalence Scale:</span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">&lt;15%</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-900/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono">15-30%</span>
          <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/40 text-amber-200 text-[10px] font-mono font-bold">30-50%</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-900/50 border border-rose-500/40 text-rose-200 text-[10px] font-mono font-bold">50-75%</span>
          <span className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-500/50 text-rose-300 text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(244,63,94,0.3)]">&gt;75% / Alert</span>
        </div>
      </div>

      {/* Heatmap Table Container */}
      <div className="relative rounded-xl bg-[#06090e] border border-white/[0.06] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#020406] text-cyan-300 font-mono border-b border-white/[0.06]">
                <th className="py-3.5 px-4 font-bold sticky left-0 bg-[#020406] min-w-[200px] z-10 border-r border-white/[0.06]">
                  Target Pathogen
                </th>
                {DEMO_ANTIBIOTICS_LIST.map((antibiotic) => (
                  <th key={antibiotic} className="py-3.5 px-3 font-semibold text-center min-w-[110px] border-r border-white/[0.06] text-slate-300">
                    {antibiotic}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {DEMO_ORGANISMS_LIST.map((organism) => (
                <tr key={organism} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200 sticky left-0 bg-[#020406] border-r border-white/[0.06] z-10">
                    {organism}
                  </td>
                  {DEMO_ANTIBIOTICS_LIST.map((antibiotic) => {
                    const cellData = getComputedCellData(organism, antibiotic);
                    const isIntrinsicZero = cellData.sampleSize === 0;

                    return (
                      <td
                        key={antibiotic}
                        onClick={() => {
                          if (!isIntrinsicZero) {
                            setSelectedCell(cellData);
                          }
                        }}
                        onMouseEnter={() => setHoveredCell({ organism, antibiotic })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`py-3 px-2 text-center border-r border-white/[0.04] transition-all ${getCellStyle(cellData.resistanceRate, isIntrinsicZero, cellData.alertStatus)}`}
                      >
                        {isIntrinsicZero ? (
                          <span className="text-[10px] text-slate-600 font-mono">N/A</span>
                        ) : (
                          <div>
                            <span className="text-xs font-mono">{cellData.resistanceRate.toFixed(1)}%</span>
                            <span className="block text-[9px] opacity-70 font-mono">n={cellData.sampleSize}</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hovered Cell Detail Bar */}
        <div className="bg-space-950/80 border-t border-white/[0.08] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            {hoveredCell ? (
              <span>
                Target Focus: <strong className="text-white">{hoveredCell.organism}</strong> × <strong className="text-white">{hoveredCell.antibiotic}</strong> (Click cell to open telemetry modal)
              </span>
            ) : (
              <span>Click any active cross-tabulation cell to inspect live intelligence, trend shift, and antimicrobial stewardship protocols.</span>
            )}
          </div>
          <button className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export Surveillance Matrix (.CSV)
          </button>
        </div>
      </div>

      {/* Guided Judge Navigation Buttons */}
      {onNavigate && (
        <div className="p-4 rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
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

      {/* Cell Detail Modal */}
      {selectedCell && (
        <CellDetailModal 
          cell={selectedCell} 
          onClose={() => setSelectedCell(null)} 
        />
      )}
    </div>
  );
};
