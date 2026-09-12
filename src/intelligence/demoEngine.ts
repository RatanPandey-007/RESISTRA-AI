import { 
  SurveillanceRecord, 
  EarlyWarningAlert, 
  TemporalTrend, 
  AnomalyResult, 
  RiskAssessment,
  ExplainableSignal,
  MLEvidence
} from '../types';
import { BASELINE_SURVEILLANCE_DATASET, DEMO_INGESTION_BATCH } from '../data/surveillanceData';
import { DEMO_PRESET_REPORTS } from '../data/demoReports';
import { parseDemoSampleReport } from './reportParser';
import { calculateReportProfileAssessment } from './amrEngine';
import { calculateTemporalTrend } from './trendEngine';
import { detectAnomaly } from './anomalyEngine';
import { calculateRiskAssessment } from './riskEngine';
import { getMLSurveillancePrediction } from './mlClient';

export interface DemoStepStatus {
  step: number;
  label: string;
  description: string;
  active: boolean;
  completed: boolean;
}

export interface DemoRunResult {
  updatedDataset: SurveillanceRecord[];
  trend: TemporalTrend;
  anomaly: AnomalyResult;
  risk: RiskAssessment;
  alert: EarlyWarningAlert;
  mlEvidence: MLEvidence;
}

export const INITIAL_DEMO_STEPS: DemoStepStatus[] = [
  { step: 1, label: 'STEP 1', description: 'Ingest sample reports', active: false, completed: false },
  { step: 2, label: 'STEP 2', description: 'Analyze resistance patterns', active: false, completed: false },
  { step: 3, label: 'STEP 3', description: 'Detect population trend', active: false, completed: false },
  { step: 4, label: 'STEP 4', description: 'Detect threshold crossing', active: false, completed: false },
  { step: 5, label: 'STEP 5', description: 'Generate early warning', active: false, completed: false },
  { step: 6, label: 'STEP 6', description: 'Show explainable evidence', active: false, completed: false },
  { step: 7, label: 'STEP 7', description: 'Show recommended surveillance action', active: false, completed: false }
];

/**
 * Executes the deterministic 7-step Judge Demo Pipeline.
 * Each step calls real intelligence engine functions and invokes onProgress.
 */
export async function executeJudgeDemo(
  onStepChange: (stepIndex: number) => void,
  onDatasetUpdate?: (dataset: SurveillanceRecord[]) => void
): Promise<DemoRunResult> {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // STEP 1: Ingest sample reports
  onStepChange(0);
  const sampleReport = DEMO_PRESET_REPORTS[0];
  const parsedData = parseDemoSampleReport(sampleReport);
  await delay(450);

  // STEP 2: Analyze resistance patterns
  onStepChange(1);
  calculateReportProfileAssessment(
    parsedData.organismIdentified,
    parsedData.facility,
    parsedData.department,
    parsedData.collectionDate,
    parsedData.antibioticsTested
  );
  await delay(450);

  // STEP 3: Detect population trend (E. coli + Ciprofloxacin: 31% -> 48%, +17 percentage points)
  onStepChange(2);
  const updatedDataset = [...DEMO_INGESTION_BATCH, ...BASELINE_SURVEILLANCE_DATASET];
  if (onDatasetUpdate) {
    onDatasetUpdate(updatedDataset);
  }
  const trend = calculateTemporalTrend(updatedDataset, 'Escherichia coli', 'Ciprofloxacin');
  await delay(500);

  // STEP 4: Detect threshold crossing (48% > 40% alert threshold)
  onStepChange(3);
  const anomaly = detectAnomaly(trend);
  await delay(450);

  // STEP 5: Generate early warning
  onStepChange(4);
  const risk = calculateRiskAssessment(trend, anomaly, 4);
  await delay(450);

  // STEP 6: Show explainable evidence & ML model inference
  onStepChange(5);
  const mlEvidence = await getMLSurveillancePrediction({
    organism: 'Escherichia coli',
    antibiotic: 'Ciprofloxacin',
    facility: 'North Suburbs Health Zone',
    region: 'Metro Health Region',
    resistanceRate: 48.0,
    previousResistanceRate: 31.0,
    resistanceChange: 17.0,
    rollingMean: 31.0,
    rollingStd: 1.2,
    trendSlope: 5.67,
    facilityCount: 4,
    reportingVolume: 1800,
    thresholdDistance: 8.0
  });
  await delay(450);

  // STEP 7: Show recommended surveillance action
  onStepChange(6);

  const explainableSignal: ExplainableSignal = {
    title: 'WHY WAS THIS SIGNAL GENERATED?',
    primaryMetricChange: 'E. coli resistance to Ciprofloxacin increased from 31% to 48% (+17 percentage-point increase)',
    factors: [
      'Resistance increased over the selected surveillance window (from 31% to 48%)',
      'Observed increase (+17 percentage points) exceeded the configured 15 percentage-point threshold',
      'Persistent upward trend detected across consecutive reporting periods',
      'Signal observed across multiple outpatient reporting sources (4 community clinics)',
      'Deviation from historical baseline detected (Z-score > 2.5 against rolling mean)'
    ],
    observedLocations: ['North Suburbs Health Zone (4 Community Outpatient Clinics)'],
    timeWindow: '30-Day Surveillance Observation Window',
    severityRationale: 'Evaluated as HIGH priority surveillance signal.',
    confidenceScore: 96
  };

  const alert: EarlyWarningAlert = {
    alertId: 'ALT-DEMO-2026-091',
    severity: 'HIGH',
    organism: 'Escherichia coli',
    antibiotic: 'Ciprofloxacin',
    facility: 'North Suburbs Health Zone',
    region: 'Metro Health Region',
    detectedAt: '2026-09-12',
    resistanceChange: {
      previousRate: 31.0,
      currentRate: 48.0,
      absoluteChange: 17.0,
      relativeChange: 54.8
    },
    anomalyScore: 78.0,
    confidenceScore: 96.0,
    reasons: [
      '+17 percentage-point increase over surveillance window',
      '3 consecutive increasing reporting periods',
      'Detected across 4 outpatient community facilities',
      'Statistical anomaly score (78/100) above alert threshold'
    ],
    explainableSignal,
    mlEvidence,
    recommendedSurveillanceAction: [
      'Review local laboratory data.',
      'Consider confirmatory laboratory review of outpatient urine culture isolates.',
      'Consider infection-control surveillance across outpatient clinic networks.',
      'Review the local antibiogram for community-acquired UTI surveillance.',
      'Escalate to the appropriate antimicrobial stewardship/public-health team.'
    ],
    status: 'active'
  };

  await delay(350);

  return {
    updatedDataset,
    trend,
    anomaly,
    risk,
    alert,
    mlEvidence
  };
}
