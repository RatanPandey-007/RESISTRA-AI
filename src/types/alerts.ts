import { RiskCategory, ExplainableSignal, MLEvidence } from './intelligence';

export interface EarlyWarningAlert {
  alertId: string;
  severity: RiskCategory;
  organism: string;
  antibiotic: string;
  facility: string;
  region: string;
  detectedAt: string; // YYYY-MM-DD
  resistanceChange: {
    previousRate: number;
    currentRate: number;
    absoluteChange: number; // percentage points e.g. +17.0
    relativeChange: number; // percentage e.g. +54.8%
  };
  anomalyScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  reasons: string[];
  explainableSignal: ExplainableSignal;
  mlEvidence?: MLEvidence;
  recommendedSurveillanceAction: string[];
  status: 'active' | 'under_review' | 'resolved';
}
