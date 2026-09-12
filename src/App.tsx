import { useState, useEffect } from 'react';
import { PageId, MedicalReport, SurveillanceRecord } from './types';
import { Sidebar, Header } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { ReportAnalysisPage } from './pages/ReportAnalysisPage';
import { AMRTrendsPage } from './pages/AMRTrendsPage';
import { ResistanceMatrixPage } from './pages/ResistanceMatrixPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { BASELINE_SURVEILLANCE_DATASET } from './data/surveillanceData';
import { DEMO_RECENT_REPORTS } from './data/demoData';
import { generateAMRAlerts } from './intelligence/alertGenerator';
import { ingestReportIntoDataset } from './intelligence/reportIngestionEngine';
import { runValidationSuite } from './intelligence/validationEngine';
import { executeJudgeDemo, INITIAL_DEMO_STEPS, DemoStepStatus, DemoRunResult } from './intelligence/demoEngine';
import { LiveDemoModal } from './components/LiveDemoModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DataClinicalStatusModal } from './components/DataClinicalStatusModal';
import { StartupSequence } from './components/StartupSequence';

export function App() {
  const [showStartup, setShowStartup] = useState<boolean>(() => {
    // Show startup sequence on first session load
    return !sessionStorage.getItem('resistra_booted');
  });
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [surveillanceDataset, setSurveillanceDataset] = useState<SurveillanceRecord[]>([...BASELINE_SURVEILLANCE_DATASET]);
  const [reports, setReports] = useState<MedicalReport[]>(DEMO_RECENT_REPORTS);

  // Live Judge Demo State
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [demoSteps, setDemoSteps] = useState<DemoStepStatus[]>(INITIAL_DEMO_STEPS);
  const [demoResult, setDemoResult] = useState<DemoRunResult | null>(null);

  // Hardening Modal & Mobile States
  const [isDataStatusModalOpen, setIsDataStatusModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const activeAlertsCount = generateAMRAlerts().filter(a => a.status === 'active').length;

  const handleIngestReport = (newReport: MedicalReport) => {
    const { updatedDataset } = ingestReportIntoDataset(surveillanceDataset, newReport);
    setSurveillanceDataset(updatedDataset);
    setReports(prev => [newReport, ...prev]);
  };

  const handleRunLiveDemo = async () => {
    setIsDemoModalOpen(true);
    setIsDemoRunning(true);
    setDemoStepIndex(0);
    setDemoSteps(INITIAL_DEMO_STEPS.map(s => ({ ...s, active: false, completed: false })));

    try {
      const result = await executeJudgeDemo(
        (stepIdx) => {
          setDemoStepIndex(stepIdx);
          setDemoSteps(prev => prev.map((s, idx) => ({
            ...s,
            active: idx === stepIdx,
            completed: idx < stepIdx
          })));
        },
        (datasetUpdate) => {
          setSurveillanceDataset(datasetUpdate);
          setIsDemoActive(true);
        }
      );

      setDemoSteps(prev => prev.map(s => ({ ...s, active: false, completed: true })));
      setDemoResult(result);
      setSurveillanceDataset(result.updatedDataset);
      setIsDemoActive(true);

      // Add a newly ingested demo report to reports registry
      const newIngestedReport: MedicalReport = {
        id: 'REP-2026-0912-DEMO',
        reportNumber: 'LAB-2026-0912',
        patientId: 'PT-DEMO-991',
        collectionDate: '2026-09-12',
        facility: 'North Suburbs Health Zone',
        department: 'Outpatient Community Clinics',
        sampleType: 'Urine Culture',
        organismIdentified: 'Escherichia coli',
        antibioticsTested: [
          { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
          { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
          { antibiotic: 'Ceftriaxone', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
          { antibiotic: 'Meropenem', susceptibility: 'Susceptible', micValue: '0.25 ug/mL' },
          { antibiotic: 'Gentamicin', susceptibility: 'Susceptible', micValue: '1 ug/mL' }
        ],
        status: 'Flagged',
        riskLevel: 'High',
        confidenceScore: 96,
        dataSource: 'DEMO_SYNTHETIC'
      };
      setReports(prev => [newIngestedReport, ...prev]);
    } catch (err) {
      console.error('Demo execution error:', err);
    } finally {
      setIsDemoRunning(false);
    }
  };

  const handleResetDemo = () => {
    setSurveillanceDataset([...BASELINE_SURVEILLANCE_DATASET]);
    setIsDemoActive(false);
    setDemoResult(null);
    setDemoStepIndex(0);
    setDemoSteps(INITIAL_DEMO_STEPS);
    setIsDemoModalOpen(false);
    setReports(DEMO_RECENT_REPORTS);
  };

  useEffect(() => {
    const testResults = runValidationSuite();
    console.log('[RESISTRA AI Intelligence Validation Suite]:', testResults);
  }, []);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardPage 
            onNavigate={setActivePage} 
            dataset={surveillanceDataset} 
            isDemoActive={isDemoActive}
            onRunDemo={handleRunLiveDemo}
          />
        );
      case 'analysis':
        return (
          <ReportAnalysisPage 
            dataset={surveillanceDataset} 
            onIngestReport={handleIngestReport}
            isDemoActive={isDemoActive}
            onRunDemo={handleRunLiveDemo}
            onResetDemo={handleResetDemo}
            onNavigate={setActivePage}
          />
        );
      case 'trends':
        return <AMRTrendsPage dataset={surveillanceDataset} onNavigate={setActivePage} />;
      case 'matrix':
        return <ResistanceMatrixPage dataset={surveillanceDataset} onNavigate={setActivePage} />;
      case 'alerts':
        return <AlertsPage onNavigate={setActivePage} />;
      case 'reports':
        return <ReportsPage reports={reports} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage 
            onNavigate={setActivePage} 
            dataset={surveillanceDataset} 
            isDemoActive={isDemoActive}
          />
        );
    }
  };

  const handleStartupComplete = () => {
    setShowStartup(false);
    sessionStorage.setItem('resistra_booted', 'true');
  };

  return (
    <ErrorBoundary>
      {showStartup && <StartupSequence onComplete={handleStartupComplete} />}

      <div className="min-h-screen bg-[#020406] text-slate-100 flex font-sans antialiased relative selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Subtle Spatial Telemetry Background */}
        <div className="fixed inset-0 technical-grid pointer-events-none opacity-25 z-0" />

        {/* Sidebar Navigation (Desktop sticky + Mobile drawer) */}
        <Sidebar 
          activePage={activePage} 
          onNavigate={setActivePage} 
          activeAlertsCount={activeAlertsCount}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenDataStatus={() => setIsDataStatusModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 bg-[#020406]">
          <Header 
            activePage={activePage} 
            activeAlertsCount={activeAlertsCount}
            isDemoActive={isDemoActive}
            onRunDemo={handleRunLiveDemo}
            onResetDemo={handleResetDemo}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onOpenDataStatus={() => setIsDataStatusModalOpen(true)}
          />
          
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 bg-[#020406]">
            {renderActivePage()}
          </main>
        </div>

        {/* Live Judge Demo Modal */}
        {isDemoModalOpen && (
          <LiveDemoModal 
            isRunning={isDemoRunning}
            currentStepIndex={demoStepIndex}
            steps={demoSteps}
            result={demoResult}
            onClose={() => setIsDemoModalOpen(false)}
            onReset={handleResetDemo}
            onNavigate={(page) => {
              setActivePage(page);
              setIsDemoModalOpen(false);
            }}
          />
        )}

        {/* Data Transparency & Clinical Status Modal */}
        <DataClinicalStatusModal 
          isOpen={isDataStatusModalOpen}
          onClose={() => setIsDataStatusModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
