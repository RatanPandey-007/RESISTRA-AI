import React, { useState, useRef } from 'react';
import { DEMO_PRESET_REPORTS } from '../data/demoReports';
import { DemoSampleReport, MedicalReport, SurveillanceRecord, PageId } from '../types';
import { parseUploadedReportFile, parseDemoSampleReport, ParsedReportData } from '../intelligence/reportParser';
import { calculateReportProfileAssessment } from '../intelligence/amrEngine';
import { ExplainableAIPanel } from '../components/ExplainableAIPanel';
import { SurveillanceFlowDiagram } from '../components/SurveillanceFlowDiagram';
import { 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  BrainCircuit, 
  Sparkles, 
  ShieldAlert,
  Building2,
  Tag,
  UserCheck,
  Zap,
  RotateCcw,
  Play,
  ArrowRight,
  ArrowLeft,
  Database
} from 'lucide-react';

interface ReportAnalysisPageProps {
  dataset?: SurveillanceRecord[];
  onIngestReport?: (report: MedicalReport) => void;
  isDemoActive?: boolean;
  onRunDemo?: () => void;
  onResetDemo?: () => void;
  onNavigate?: (page: PageId) => void;
}

export const ReportAnalysisPage: React.FC<ReportAnalysisPageProps> = ({ 
  onIngestReport,
  isDemoActive = false,
  onRunDemo,
  onResetDemo,
  onNavigate
}) => {
  const [selectedDemo, setSelectedDemo] = useState<DemoSampleReport>(DEMO_PRESET_REPORTS[0]);
  const [currentParsedData, setCurrentParsedData] = useState<ParsedReportData>(
    parseDemoSampleReport(DEMO_PRESET_REPORTS[0])
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ingestionComplete, setIngestionComplete] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processIngestion = (parsed: ParsedReportData) => {
    setIsAnalyzing(true);
    setIngestionComplete(false);

    setTimeout(() => {
      setCurrentParsedData(parsed);
      setIsAnalyzing(false);
      setIngestionComplete(true);

      if (onIngestReport) {
        const assessment = calculateReportProfileAssessment(
          parsed.organismIdentified,
          parsed.facility,
          parsed.department,
          parsed.collectionDate,
          parsed.antibioticsTested
        );

        onIngestReport({
          id: parsed.reportNumber,
          reportNumber: parsed.reportNumber,
          patientId: parsed.patientId,
          collectionDate: parsed.collectionDate,
          facility: parsed.facility,
          department: parsed.department,
          sampleType: parsed.sampleType,
          organismIdentified: parsed.organismIdentified,
          antibioticsTested: parsed.antibioticsTested,
          status: assessment.riskCategory === 'Critical' || assessment.riskCategory === 'High' ? 'Flagged' : 'Analyzed',
          riskLevel: assessment.riskCategory,
          confidenceScore: assessment.confidenceScore,
          dataSource: parsed.dataSource
        });
      }
    }, 600);
  };

  const handleSelectDemo = (sample: DemoSampleReport) => {
    setSelectedDemo(sample);
    const parsed = parseDemoSampleReport(sample);
    processIngestion(parsed);
  };

  const handleFileUpload = (file: File) => {
    const parsed = parseUploadedReportFile(file);
    processIngestion(parsed);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const assessment = calculateReportProfileAssessment(
    currentParsedData.organismIdentified,
    currentParsedData.facility,
    currentParsedData.department,
    currentParsedData.collectionDate,
    currentParsedData.antibioticsTested
  );

  const explainableRationale = selectedDemo.aiAssessment.explainableRationale || {
    title: 'WHY WAS THIS ALERT GENERATED?',
    primaryMetricChange: `Extracted ${assessment.resistantCount} resistant antimicrobial markers in specimen culture.`,
    factors: [
      `Organism identified: ${currentParsedData.organismIdentified}`,
      ...assessment.phenotypeMarkers,
      `Calculated resistance prevalence: ${assessment.resistancePercentage}%`
    ],
    observedLocations: [`${currentParsedData.facility} - ${currentParsedData.department}`],
    timeWindow: `Ingested ${currentParsedData.collectionDate}`,
    severityRationale: 'Extracted from laboratory specimen testing.'
  };

  const surveillanceActions = selectedDemo.aiAssessment.surveillanceActions || [
    'Review local laboratory data for extracted pathogen.',
    'Consider confirmatory laboratory review of culture MIC values.',
    'Consider infection-control surveillance audit in facility ward.',
    'Escalate to the antimicrobial stewardship team.'
  ];

  return (
    <div className="space-y-6">
      {/* Hackathon Judge Live Demo Hero Card */}
      <div className="bg-[#06090e] text-white rounded-xl p-6 border border-white/[0.06] shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
                Judge Demonstration Workflow
              </span>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" /> Demo / Synthetic Feed
              </span>
              {isDemoActive ? (
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  Active Spike: 48.0% (+17 pp)
                </span>
              ) : (
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Baseline: 31.0%
                </span>
              )}
            </div>
            <h2 className="text-xl font-mono font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400 shadow-glow-cyan" />
              Automated AMR Intelligence Pipeline
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Demonstrate the complete closed-loop cycle: Ingest microbiology report batch → Recalculate population resistance (<em>E. coli</em> × Ciprofloxacin) → Trigger longitudinal trend shift from <strong>31% → 48% (+17 percentage points)</strong> → Flag statistical anomaly → Generate explainable early warning signal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onRunDemo && (
              <button
                onClick={onRunDemo}
                className="px-5 py-2.5 text-xs font-mono font-extrabold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-glow-cyan flex items-center gap-2 transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" /> RUN LIVE DEMO
              </button>
            )}
            {isDemoActive && onResetDemo && (
              <button
                onClick={onResetDemo}
                className="px-4 py-2.5 text-xs font-mono font-bold text-slate-300 bg-space-800 hover:bg-space-700 border border-white/[0.08] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
              </button>
            )}
          </div>
        </div>

        {/* 7 Pipeline Micro-steps Visual Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2 border-t border-white/[0.06] text-[10px]">
          {[
            { step: '1', title: 'Lab Report' },
            { step: '2', title: 'Data Extraction' },
            { step: '3', title: 'AMR Profile' },
            { step: '4', title: 'Population Recalc' },
            { step: '5', title: 'Trend (+17 pp)' },
            { step: '6', title: 'Anomaly Score' },
            { step: '7', title: 'Early Warning' }
          ].map((item, idx) => (
            <div key={idx} className="bg-space-950/60 rounded-xl p-2 border border-white/[0.05] flex flex-col items-center text-center">
              <span className="font-mono text-cyan-400 font-bold text-[9px]">STEP {item.step}</span>
              <span className="text-slate-200 font-medium mt-0.5">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Step Visual Surveillance Flow Diagram */}
      <SurveillanceFlowDiagram isDemoActive={isDemoActive} />

      {ingestionComplete && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 rounded-xl p-3 px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Report Extracted & Aggregated into Surveillance Dataset</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 uppercase">
            Recalculated Community Signals
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload & Preset Selector (1 Col) */}
        <div className="space-y-5">
          {/* File Upload Box */}
          <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass">
            <h3 className="text-sm font-mono font-bold text-white mb-1 uppercase tracking-wider">Ingest Microbiology Report</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">Supports PDF, JPG, PNG microbiology lab test results</p>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileInputChange} 
              accept=".pdf,.png,.jpg,.jpeg" 
              className="hidden" 
            />

            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/[0.12] bg-space-950/40 hover:bg-space-950/60'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-200">Drag & drop report file here</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">or browse from your computer</p>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-1.5 text-xs font-mono font-medium bg-space-800 hover:bg-space-700 text-slate-200 border border-white/[0.08] rounded-lg shadow-sm cursor-pointer"
              >
                Select File
              </button>
            </div>
          </div>

          {/* Preset Demo Reports */}
          <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Select Demo Surveillance Preset</h3>
            </div>

            <div className="space-y-2.5">
              {DEMO_PRESET_REPORTS.map((sample) => {
                const isSelected = selectedDemo.id === sample.id && currentParsedData.dataSource === 'DEMO_SYNTHETIC';
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectDemo(sample)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500/50 shadow-glow-cyan'
                        : 'border-white/[0.06] hover:border-white/[0.15] bg-space-950/40 hover:bg-space-950/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-white mb-1 font-mono">
                      <span>{sample.organism}</span>
                      <span className="text-[10px] text-slate-400">{sample.id}</span>
                    </div>
                    <p className="text-slate-300 font-medium line-clamp-1">{sample.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{sample.facility}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Extracted Analysis & Pipeline Execution (2 Cols) */}
        <div className="lg:col-span-2 space-y-5">
          {isAnalyzing ? (
            <div className="bg-space-900/60 backdrop-blur-xl p-12 rounded-2xl border border-white/[0.08] shadow-glass text-center flex flex-col items-center justify-center min-h-[400px]">
              <BrainCircuit className="w-10 h-10 text-cyan-400 animate-spin mb-3 shadow-glow-cyan" />
              <h3 className="text-base font-mono font-bold text-white">Executing Intelligence Pipeline...</h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">Extracting record → Aggregating dataset → Calculating trend & anomaly → Generating Early Warning</p>
            </div>
          ) : (
            <>
              {/* Report Header Card */}
              <div className="bg-space-900/65 backdrop-blur-xl p-5 rounded-2xl border border-white/[0.08] shadow-glass space-y-4">
                <div className="flex flex-wrap items-start justify-between border-b border-white/[0.06] pb-4 gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-space-800 text-white rounded-md border border-white/[0.1]">
                        #{currentParsedData.reportNumber}
                      </span>
                      {currentParsedData.dataSource === 'USER_UPLOADED' ? (
                        <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md">
                          REAL USER DATA ({currentParsedData.rawFileName})
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md">
                          SYNTHETIC DEMO DATA
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-mono font-bold text-white mt-2">{currentParsedData.organismIdentified}</h2>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap font-mono">
                      <span><Building2 className="w-3.5 h-3.5 inline mr-1 text-slate-400" />{currentParsedData.facility} ({currentParsedData.department})</span>
                      <span>•</span>
                      <span><Tag className="w-3.5 h-3.5 inline mr-1 text-slate-400" />{currentParsedData.sampleType}</span>
                      <span>•</span>
                      <span><UserCheck className="w-3.5 h-3.5 inline mr-1 text-slate-400" />Patient ID: {currentParsedData.patientId}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Surveillance Risk Category
                    </span>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono font-bold text-sm ${
                      assessment.riskCategory === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose' :
                      assessment.riskCategory === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      <ShieldAlert className="w-4 h-4" />
                      <span>{assessment.riskCategory} Risk</span>
                    </div>
                    <span className="block text-[10px] font-mono text-slate-400 mt-1">Confidence: {assessment.confidenceScore}%</span>
                  </div>
                </div>

                {/* Surveillance Intelligence Summary Grid (Task 3) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-space-950/60 border border-white/[0.06] rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Detected Resistance Phenotype</span>
                    <strong className="text-white font-bold block mt-0.5">
                      {assessment.phenotypeMarkers.length > 0 
                        ? assessment.phenotypeMarkers.join(' • ') 
                        : 'Standard Clinical Susceptibility Pattern'}
                    </strong>
                    <span className="text-[10px] text-cyan-400 block mt-0.5 font-mono">CLSI Guidance Benchmark</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Resistance Pattern Summary</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-rose-400 font-extrabold text-sm font-mono">
                        {assessment.resistantCount} of {currentParsedData.antibioticsTested.length} Resistant
                      </span>
                      <span className="text-slate-400 font-mono text-xs">({assessment.resistancePercentage}%)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">In vitro culture antimicrobial panel</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">AI Surveillance Risk Score</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded font-extrabold font-mono text-xs">
                        {assessment.confidenceScore}/100
                      </span>
                      <span className="text-slate-300 font-semibold text-xs font-mono">{assessment.riskCategory} Early Warning</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Surveillance intelligence index</span>
                  </div>
                </div>

                {/* Mandatory Decision-Support & Non-Diagnostic Notice (Task 3) */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="font-medium">
                    <strong className="text-white font-mono">Decision-Support Notice:</strong> This platform generates surveillance intelligence for infection prevention and public-health monitoring; it does <strong>not replace clinical diagnosis or individual patient treatment</strong>. All findings <strong>require clinical and laboratory confirmation</strong>.
                  </p>
                </div>

                {/* Structured Susceptibility Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Extracted Susceptibility Profile</h3>
                  <div className="overflow-x-auto border border-white/[0.08] rounded-xl bg-space-950/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-space-950/80 border-b border-white/[0.08] text-slate-400 font-mono font-bold">
                          <th className="py-2.5 px-3">Antibiotic Tested</th>
                          <th className="py-2.5 px-3">Susceptibility Profile</th>
                          <th className="py-2.5 px-3">MIC Value</th>
                          <th className="py-2.5 px-3">CLSI Benchmark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {currentParsedData.antibioticsTested.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-white font-mono">{item.antibiotic}</td>
                            <td className="py-2.5 px-3">
                              <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                item.susceptibility === 'Resistant' 
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                                  : item.susceptibility === 'Intermediate' 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}>
                                {item.susceptibility === 'Resistant' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                                {item.susceptibility === 'Susceptible' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                {item.susceptibility}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-cyan-300">{item.micValue || 'N/A'}</td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">CLSI / EUCAST 2026</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Explainable AI Component */}
              <ExplainableAIPanel 
                rationale={explainableRationale}
                surveillanceActions={surveillanceActions}
                riskScore={assessment.confidenceScore}
                riskLevel={assessment.riskCategory}
                severity={assessment.riskCategory === 'Critical' ? 'critical' : assessment.riskCategory === 'High' ? 'high' : 'moderate'}
              />

              {/* Guided Judge Navigation Buttons */}
              {onNavigate && (
                <div className="bg-space-900/60 backdrop-blur-xl p-4 rounded-2xl border border-white/[0.08] shadow-glass flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-semibold text-slate-300 bg-space-800 hover:bg-space-700 border border-white/[0.08] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate('trends')}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl flex items-center justify-center gap-1.5 shadow-glow-cyan transition-all cursor-pointer"
                  >
                    <span>Proceed to AMR Trends</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
