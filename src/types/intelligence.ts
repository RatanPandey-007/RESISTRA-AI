export type TrendDirection = 'INCREASING' | 'DECREASING' | 'STABLE';
export type RiskCategory = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'WATCH';

export interface ResistanceMetric {
  organism: string;
  antibiotic: string;
  facility?: string;
  region?: string;
  totalTestedIsolates: number;
  resistantIsolates: number;
  resistanceRate: number; // percentage 0 - 100
}

export interface PopulationTrendSummary {
  organism: string;
  antibiotic: string;
  previousRate: number;
  currentRate: number;
  percentagePointIncrease: number;
  sampleCount: number;
  statusText: string;
  alertSeverity: RiskCategory;
}

export interface TemporalTrend {
  organism: string;
  antibiotic: string;
  currentRate: number;
  previousRate: number;
  absoluteChange: number; // percentage points (e.g. +17.0)
  relativeChange: number; // percentage change (e.g. +54.8%)
  rollingBaseline: number;
  rollingStdDev: number;
  trendDirection: TrendDirection;
  consecutiveIncreasingPeriods: number;
  observationPeriodCount: number;
  historicalSeries: { month: string; rate: number; sampleCount: number }[];
}

export interface AnomalyResult {
  organism: string;
  antibiotic: string;
  anomalyScore: number; // 0 to 100
  isAnomaly: boolean;
  anomalyType?: 'SPIKE' | 'DRIFT' | 'CLUSTER';
  deviationFromBaseline: number; // percentage points
  explanation: string;
  modelUsed: 'PYTHON_ISOLATION_FOREST' | 'STATISTICAL_ZSCORE';
}

export interface RiskAssessment {
  organism: string;
  antibiotic: string;
  facility?: string;
  riskCategory: RiskCategory;
  riskScore: number; // 0 to 100
  contributingFactors: string[];
  explanation: string;
}

export interface ExplainableSignal {
  title: string;
  primaryMetricChange: string;
  factors: string[];
  observedLocations: string[];
  timeWindow: string;
  severityRationale: string;
  confidenceScore: number;
}

export interface ContributingSignal {
  feature: string;
  impact: string;
  direction: 'up' | 'down' | 'neutral';
}

export interface MLClassificationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
}

export interface MLEvidence {
  modelName: string; // e.g. "XGBoost Classifier"
  anomalyModelName: string; // e.g. "Isolation Forest"
  modelVersion: string; // e.g. "resistra-prototype-v1"
  predictedRisk: 'LOW_RISK' | 'HIGH_RISK';
  riskProbability: number; // 0.0 to 1.0 (e.g. 0.8861 -> 88.6%)
  isAnomaly: boolean;
  anomalyScore: number; // 0 to 100
  contributingSignals: ContributingSignal[];
  evaluationMetrics: MLClassificationMetrics;
  disclaimer: string;
}

export interface MLModelInfo {
  modelVersion: string;
  datasetVersion: string;
  randomSeed: number;
  trainingTimestampUtc: string;
  modelTypeRisk: string;
  modelTypeAnomaly: string;
  classificationMetrics: MLClassificationMetrics;
  topFeatureImportances: Record<string, number>;
  featureDescriptions: Record<string, string>;
  disclaimer: string;
}
