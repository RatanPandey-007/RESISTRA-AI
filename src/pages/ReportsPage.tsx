import React, { useState } from 'react';
import { DEMO_RECENT_REPORTS } from '../data/demoData';
import { MedicalReport } from '../types';
import { 
  Database, 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ReportsPageProps {
  reports?: MedicalReport[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ reports = DEMO_RECENT_REPORTS }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [originFilter, setOriginFilter] = useState<string>('All');

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.organismIdentified.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.facility.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    const matchesOrigin = originFilter === 'All' || 
      (originFilter === 'User' ? report.dataSource === 'USER_UPLOADED' : report.dataSource === 'DEMO_SYNTHETIC');

    return matchesSearch && matchesStatus && matchesOrigin;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-wide">Surveillance Reports Database</h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-md">
                Demo / Synthetic Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Centralized repository of ingested diagnostic microbiology reports and AST profiles</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search report #, organism, ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#040814] border border-white/[0.14] rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 font-mono"
              style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
            />
          </div>

          {/* Data Origin Filter */}
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="bg-[#040814] border border-white/[0.14] text-slate-300 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 cursor-pointer shadow-inner"
            style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
          >
            <option value="All" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>All Data Origins</option>
            <option value="Demo" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>Synthetic Demo Data</option>
            <option value="User" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>User Uploaded Data</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#040814] border border-white/[0.14] text-slate-300 text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 cursor-pointer shadow-inner"
            style={{ colorScheme: 'dark', backgroundColor: '#040814', color: '#f4f8fc' }}
          >
            <option value="All" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>All Statuses</option>
            <option value="Analyzed" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>Analyzed</option>
            <option value="Flagged" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>Flagged</option>
            <option value="Pending" className="bg-[#07111D] text-white" style={{ backgroundColor: '#07111D', color: '#ffffff' }}>Pending</option>
          </select>

          <button className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export DB (.CSV)
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="relative rounded-2xl bg-space-900/65 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-space-950/90 border-b border-white/[0.08] text-cyan-300 font-mono">
                <th className="py-3 px-4">Report Number</th>
                <th className="py-3 px-4">Data Source</th>
                <th className="py-3 px-4">Collection Date</th>
                <th className="py-3 px-4">Facility / Ward</th>
                <th className="py-3 px-4">Sample Type</th>
                <th className="py-3 px-4">Organism Identified</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold font-mono text-white">{report.reportNumber}</td>
                  <td className="py-3 px-4">
                    {report.dataSource === 'USER_UPLOADED' ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                        USER DATA
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md bg-cyan-950/50 text-cyan-300 border border-cyan-500/20">
                        DEMO DATA
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{report.collectionDate}</td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{report.facility} ({report.department})</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{report.sampleType}</td>
                  <td className="py-3 px-4 font-semibold text-slate-200">{report.organismIdentified}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border ${
                      report.riskLevel === 'Critical' || report.riskLevel === 'High' 
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.2)]' 
                        : report.riskLevel === 'Moderate'
                        ? 'bg-amber-950/50 border-amber-500/30 text-amber-300'
                        : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                    }`}>
                      {report.riskLevel} Risk
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 font-mono font-semibold text-[11px] ${
                      report.status === 'Flagged' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {report.status === 'Flagged' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-space-950/80 border-t border-white/[0.08] px-4 py-3 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredReports.length} surveillance records</span>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-300">Page 1 of 1</span>
            <button className="p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
