export type SusceptibilityStatus = 'Resistant' | 'Intermediate' | 'Susceptible';

export interface AntibioticResult {
  antibiotic: string;
  susceptibility: SusceptibilityStatus;
  micValue?: string;
}

export type SpecimenType = 
  | 'Urine Culture'
  | 'Blood Culture'
  | 'Sputum Culture'
  | 'Wound Swab'
  | 'Tracheal Aspirate'
  | 'Stool Culture';

export interface PatientContext {
  patientId: string;
  age?: number;
  gender?: 'M' | 'F' | 'Other';
  inpatientStatus?: 'ICU' | 'Inpatient' | 'Outpatient';
}

export interface SurveillanceRecord {
  id: string;
  reportId: string;
  date: string; // YYYY-MM-DD
  facility: string;
  department: string;
  region: string;
  specimenType: SpecimenType;
  organism: string;
  antibiotic: string;
  susceptibility: SusceptibilityStatus;
  micValue?: string;
  resistant: boolean;
  sampleCount: number;
  patientContext?: PatientContext;
  dataSource: 'DEMO_SYNTHETIC' | 'USER_UPLOADED';
}

export interface FilterOptions {
  organism?: string;
  antibiotic?: string;
  facility?: string;
  department?: string;
  region?: string;
  timeRange?: '6m' | '12m' | '24m';
}
