export * from './surveillance';
export * from './intelligence';
export * from './alerts';

export type PageId = 
  | 'dashboard'
  | 'analysis'
  | 'trends'
  | 'matrix'
  | 'alerts'
  | 'reports'
  | 'settings';

export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'watch';

export interface MedicalReport {
  id: string;
  reportNumber: string;
  patientId: string;
  collectionDate: string;
  facility: string;
  department: string;
  sampleType: string;
  organismIdentified: string;
  antibioticsTested: {
    antibiotic: string;
    susceptibility: 'Resistant' | 'Intermediate' | 'Susceptible';
    micValue?: string;
  }[];
  status: 'Analyzed' | 'Pending' | 'Flagged';
  riskLevel: 'Critical' | 'High' | 'Moderate' | 'Watch' | 'Low';
  confidenceScore: number;
  dataSource: 'DEMO_SYNTHETIC' | 'USER_UPLOADED';
}

export interface OrganismRisk {
  name: string;
  code: string;
  category: 'Critical' | 'High' | 'Moderate';
  resistanceRate: number;
  percentagePointChange: number;
  trend: 'up' | 'down' | 'stable';
  sampleCount: number;
  primaryResistance: string;
}

export interface ResistanceTrendPoint {
  month: string;
  overallResistance: number;
  eColi: number;
  kPneumoniae: number;
  sAureus: number;
  pAeruginosa: number;
  aBaumannii?: number;
  anomalyDetected?: boolean;
  anomalyNote?: string;
  anomalyDetails?: {
    observedValue: number;
    baselineValue: number;
    deviation: number;
    anomalyScore: number;
    explanation: string;
  };
}

export interface MatrixData {
  organism: string;
  antibiotic: string;
  resistanceRate: number;
  previousPeriodRate: number;
  percentagePointChange: number;
  sampleSize: number;
  alertStatus: 'critical' | 'high' | 'moderate' | 'watch' | 'normal';
  anomalyScore?: number;
  isAnomaly?: boolean;
}

export interface ExplainableRationale {
  title: string;
  primaryMetricChange: string;
  factors: string[];
  observedLocations: string[];
  timeWindow: string;
  severityRationale: string;
}

export interface AMRAlert {
  id: string;
  severity: 'critical' | 'high' | 'moderate' | 'watch';
  date: string;
  affectedOrganism: string;
  antibiotic: string;
  facility: string;
  department: string;
  previousPeriodRate: number;
  currentPeriodRate: number;
  percentagePointChange: number;
  sampleCount: number;
  timeWindow: string;
  reason: string;
  confidenceScore: number;
  explainableRationale: ExplainableRationale;
  mlEvidence?: import('./intelligence').MLEvidence;
  surveillanceAction: string[];
  status: 'active' | 'under_review' | 'resolved';
}

export interface DemoSampleReport {
  id: string;
  title: string;
  description: string;
  facility: string;
  department: string;
  sampleType: string;
  organism: string;
  date: string;
  patientId: string;
  findings: {
    antibiotic: string;
    susceptibility: 'Resistant' | 'Intermediate' | 'Susceptible';
    micValue?: string;
  }[];
  aiAssessment: {
    summary: string;
    riskScore: number;
    confidenceScore: number;
    anomalyScore: number;
    criticalAlerts: string[];
    surveillanceActions: string[];
    explainableRationale: ExplainableRationale;
  };
}
