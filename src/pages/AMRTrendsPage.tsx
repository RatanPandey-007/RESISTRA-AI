import React, { useState } from 'react';
import { DEMO_ORGANISMS_LIST, DEMO_ANTIBIOTICS_LIST } from '../data/demoData';
import { INITIAL_SURVEILLANCE_DATASET } from '../data/surveillanceData';
import { PageId, SurveillanceRecord } from '../types';
import { calculateTemporalTrend } from '../intelligence/trendEngine';
import { detectAnomaly } from '../intelligence/anomalyEngine';
import { AnomalyMarkerModal } from '../components/AnomalyMarkerModal';
import { formatPercentagePointChange } from '../utils/formatters';
import { 
  Filter, 
  Info,
  AlertTriangle,
  Zap,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';

interface AMRTrendsPageProps {
  dataset?: SurveillanceRecord[];
  onNavigate?: (page: PageId) => void;
}

export const AMRTrendsPage: React.FC<AMRTrendsPageProps> = ({ 
  dataset = INITIAL_SURVEILLANCE_DATASET,
  onNavigate
}) => {
  const [selectedOrganism, setSelectedOrganism] = useState<string>('Escherichia coli');
  const [selectedAntibiotic, setSelectedAntibiotic] = useState<string>('Ciprofloxacin');
  const [selectedFacility, setSelectedFacility] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | '24m'>('12m');

  const [selectedAnomaly, setSelectedAnomaly] = useState<any | null>(null);

  // Filter records by facility if specified
  const filteredDataset = selectedFacility === 'All' 
    ? dataset 
    : dataset.filter(r => r.facility.toLowerCase().includes(selectedFacility.toLowerCase()));

  // Calculate live trend from engine
  const trend = calculateTemporalTrend(filteredDataset, selectedOrganism, selectedAntibiotic);
  const anomaly = detectAnomaly(trend);

  // Filter trend series by time range
  const fullSeries = trend.historicalSeries;
  const series = timeRange === '6m' 
    ? fullSeries.slice(-6) 
    : fullSeries;

  return (
    <div className="space-y-6">
      {/* Controls and Filter Bar */}
      <div className="bg-[#07111D] p-4 rounded-2xl border border-white/[0.08] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl shadow-glow-cyan">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Interactive Intelligence Trend Filters</h3>
            <p className="text-xs font-mono text-white font-semibold">Filtering {filteredDataset.length.toLocaleString()} Surveillance Records</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
          {/* Pathogen Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Pathogen:</label>
            <select
              value={selectedOrganism}
              onChange={(e) => setSelectedOrganism(e.target.value)}
              className="bg-[#040814] border border-white/[0.14] text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-inner"
              style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
            >
              {DEMO_ORGANISMS_LIST.map((org) => (
                <option key={org} value={org} className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>
                  {org}
                </option>
              ))}
            </select>
          </div>

          {/* Antibiotic Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Antibiotic:</label>
            <select
              value={selectedAntibiotic}
              onChange={(e) => setSelectedAntibiotic(e.target.value)}
              className="bg-[#040814] border border-white/[0.14] text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-inner"
              style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
            >
              {DEMO_ANTIBIOTICS_LIST.map((ab) => (
                <option key={ab} value={ab} className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>
                  {ab}
                </option>
              ))}
            </select>
          </div>

          {/* Facility Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Facility:</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="bg-[#040814] border border-white/[0.14] text-white rounded-lg px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-inner"
              style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
            >
              <option value="All" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>All Regional Facilities</option>
              <option value="St. Jude General Hospital" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>St. Jude General Hospital</option>
              <option value="University Hospital Center" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>University Hospital Center</option>
              <option value="Eastside Medical Center" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>Eastside Medical Center</option>
              <option value="North Suburbs Health Zone" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>North Suburbs Health Zone</option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-medium">Period:</label>
            <div className="inline-flex rounded-lg border border-white/[0.12] p-0.5 bg-[#040814]">
              {(['6m', '12m', '24m'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                    timeRange === range ? 'bg-cyan-600 text-white shadow-glow-cyan font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Population Shift Callout */}
      <div className="bg-space-900/65 backdrop-blur-xl p-4 rounded-2xl border border-cyan-500/30 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-xl shrink-0 shadow-glow-rose">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-mono font-extrabold uppercase tracking-wider text-white">
              Calculated Resistance Shift: {selectedOrganism} × {selectedAntibiotic}
            </h4>
            <p className="text-slate-300 mt-0.5 font-mono">
              Previous: <strong className="text-slate-200">{trend.previousRate}%</strong> → Current: <strong className={trend.currentRate > 40 ? 'text-rose-400' : 'text-cyan-300'}>{trend.currentRate}%</strong> ({formatPercentagePointChange(trend.absoluteChange)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {anomaly.isAnomaly && (
            <button 
              onClick={() => setSelectedAnomaly({
                month: series[series.length - 1]?.month || 'Current Period',
                organism: selectedOrganism,
                antibiotic: selectedAntibiotic,
                observedValue: trend.currentRate,
                baselineValue: trend.rollingBaseline,
                deviation: anomaly.deviationFromBaseline,
                anomalyScore: anomaly.anomalyScore,
                explanation: anomaly.explanation
              })}
              className="px-3 py-1.5 bg-rose-600 text-white font-mono font-bold rounded-xl shadow-glow-rose hover:bg-rose-500 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Inspect Anomaly Marker ({anomaly.anomalyScore}/100)
            </button>
          )}
        </div>
      </div>

      {/* Main Area Chart: Resistance Percentage Over Time */}
      <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-mono font-bold text-white">Calculated Resistance Rate % ({selectedOrganism} × {selectedAntibiotic})</h3>
            <p className="text-xs text-slate-400 font-mono">Live temporal series computed from {filteredDataset.length} isolate records</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap font-mono">
            <span className="text-[10px] bg-white/[0.04] text-slate-300 border border-white/[0.08] font-semibold px-2 py-0.5 rounded">
              Demo / Synthetic Data
            </span>
            {trend.currentRate > 40 ? (
              <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-glow-rose">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                THRESHOLD EXCEEDED ({trend.currentRate}% &gt; 40%)
              </span>
            ) : (
              <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                Threshold: 40% (Within Baseline)
              </span>
            )}
          </div>
        </div>

        {series.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-space-950/60 rounded-xl border border-white/[0.06] space-y-2 font-mono">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-white">No surveillance records found for this combination</p>
            <p className="text-xs text-slate-400">Please select an alternative pathogen or clear facility filters.</p>
          </div>
        ) : (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 80]} unit="%" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b111a', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
                <ReferenceLine y={40} label={{ value: '40% Surveillance Cutoff', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} stroke="#f43f5e" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="rate" name={`${selectedOrganism} Resistance %`} stroke="#00f0ff" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2.5} dot={{ r: 4, fill: '#00f0ff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {onNavigate && (
          <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Surveillance Step: Trend Analysis & Threshold Crossing Confirmed</span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-space-800 hover:bg-space-700 border border-white/[0.08] rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Return to Dashboard
              </button>
              <button
                onClick={() => onNavigate('alerts')}
                className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-glow-cyan"
              >
                View Early Warning Alerts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two Grid Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organism Resistance Comparison */}
        <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass space-y-3">
          <div>
            <h3 className="text-base font-mono font-bold text-white">Organism Resistance Rates Comparison</h3>
            <p className="text-xs text-slate-400 font-mono">Comparative resistance proportions across target species</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series.slice(-6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#334155" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 80]} unit="%" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0b111a', 
                    borderColor: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px', 
                    color: '#fff', 
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Bar dataKey="rate" name="Selected Isolate Rate %" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Antibiotic Class Specific Resistance */}
        <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-mono font-bold text-white">Calculated Antibiotic Class Shifts</h3>
            <p className="text-xs text-slate-400 font-mono">Surveillance trends across key antibiotic classes with percentage point increases</p>
          </div>

          <div className="space-y-3.5">
            {[
              { class: 'Penicillins & Aminopenicillins', rate: 86.4, change: '+1.2 percentage pts', color: 'bg-rose-500' },
              { class: '3rd/4th Gen Cephalosporins', rate: 61.2, change: '+3.4 percentage pts', color: 'bg-amber-500' },
              { class: 'Fluoroquinolones (Ciprofloxacin)', rate: trend.currentRate, change: formatPercentagePointChange(trend.absoluteChange), color: 'bg-rose-500 shadow-glow-rose' },
              { class: 'Carbapenems (Meropenem)', rate: 48.2, change: '+18.0 percentage pts (CRITICAL)', color: 'bg-rose-600' },
              { class: 'Polymyxins (Colistin)', rate: 22.0, change: '+10.5 percentage pts (WATCH)', color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.class}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-extrabold text-[11px]">{item.change}</span>
                    <span className="text-white font-bold">{item.rate}%</span>
                  </div>
                </div>
                <div className="w-full bg-space-950/80 h-2 rounded-full overflow-hidden border border-white/[0.05]">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.rate}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Carbapenem & Fluoroquinolone spikes require hospital stewardship audit
            </span>
            <span className="font-mono text-[11px]">Updated live</span>
          </div>
        </div>
      </div>

      {/* Anomaly Marker Detail Modal */}
      {selectedAnomaly && (
        <AnomalyMarkerModal 
          anomalyDetails={selectedAnomaly}
          onClose={() => setSelectedAnomaly(null)}
        />
      )}
    </div>
  );
};
