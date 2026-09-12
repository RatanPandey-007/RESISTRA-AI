import { AMRAlert, OrganismRisk, MedicalReport, ResistanceTrendPoint, MatrixData, DemoSampleReport } from '../types';
import { generateAMRAlerts } from '../intelligence/alertGenerator';

export const DEMO_SUMMARY_STATS = {
  totalReportsAnalyzed: 14280,
  activeAlertsCount: 6,
  avgResistanceRate: 34.8, // percentage
  criticalOrganismsCount: 4,
  monthlyReportIncrease: '+14.2%',
  alertChangeVsLastMonth: '+3'
};

export const DEMO_ALERTS: AMRAlert[] = generateAMRAlerts();

export const DEMO_HIGH_RISK_ORGANISMS: OrganismRisk[] = [
  {
    name: 'Klebsiella pneumoniae',
    code: 'KPN',
    category: 'Critical',
    resistanceRate: 48.2,
    percentagePointChange: 18.0,
    trend: 'up',
    sampleCount: 3420,
    primaryResistance: 'Carbapenems / 3rd Gen Cephalosporins'
  },
  {
    name: 'Acinetobacter baumannii',
    code: 'ABA',
    category: 'Critical',
    resistanceRate: 61.8,
    percentagePointChange: 10.5,
    trend: 'up',
    sampleCount: 1890,
    primaryResistance: 'Multidrug-Resistant (MDR / XDR)'
  },
  {
    name: 'Pseudomonas aeruginosa',
    code: 'PAE',
    category: 'Critical',
    resistanceRate: 38.5,
    percentagePointChange: 7.1,
    trend: 'stable',
    sampleCount: 2450,
    primaryResistance: 'Fluoroquinolones & Aminoglycosides'
  },
  {
    name: 'Escherichia coli',
    code: 'ECO',
    category: 'High',
    resistanceRate: 54.0,
    percentagePointChange: 17.0,
    trend: 'up',
    sampleCount: 5210,
    primaryResistance: 'Ampicillin & Fluoroquinolones (ESBL)'
  },
  {
    name: 'Staphylococcus aureus (MRSA)',
    code: 'SAU',
    category: 'High',
    resistanceRate: 42.1,
    percentagePointChange: -1.2,
    trend: 'down',
    sampleCount: 4120,
    primaryResistance: 'Methicillin / Oxacillin'
  }
];

export const DEMO_RESISTANCE_TRENDS: ResistanceTrendPoint[] = [
  { month: 'Oct 2025', overallResistance: 28.4, eColi: 46.2, kPneumoniae: 36.1, sAureus: 45.0, pAeruginosa: 34.0, aBaumannii: 52.0 },
  { month: 'Nov 2025', overallResistance: 29.1, eColi: 47.5, kPneumoniae: 37.5, sAureus: 44.2, pAeruginosa: 34.8, aBaumannii: 53.1 },
  { month: 'Dec 2025', overallResistance: 30.5, eColi: 49.0, kPneumoniae: 39.0, sAureus: 43.8, pAeruginosa: 35.5, aBaumannii: 54.5 },
  { month: 'Jan 2026', overallResistance: 31.2, eColi: 50.1, kPneumoniae: 41.2, sAureus: 43.0, pAeruginosa: 36.0, aBaumannii: 56.0 },
  { month: 'Feb 2026', overallResistance: 32.0, eColi: 51.5, kPneumoniae: 43.0, sAureus: 42.6, pAeruginosa: 37.1, aBaumannii: 57.2 },
  { month: 'Mar 2026', overallResistance: 32.8, eColi: 52.0, kPneumoniae: 44.5, sAureus: 42.5, pAeruginosa: 37.0, aBaumannii: 58.0 },
  { month: 'Apr 2026', overallResistance: 33.5, eColi: 52.8, kPneumoniae: 45.8, sAureus: 42.1, pAeruginosa: 37.8, aBaumannii: 59.1 },
  { month: 'May 2026', overallResistance: 33.9, eColi: 53.2, kPneumoniae: 46.5, sAureus: 42.2, pAeruginosa: 38.0, aBaumannii: 59.8 },
  { month: 'Jun 2026', overallResistance: 34.2, eColi: 53.6, kPneumoniae: 47.0, sAureus: 42.0, pAeruginosa: 38.2, aBaumannii: 60.5 },
  { month: 'Jul 2026', overallResistance: 34.5, eColi: 53.8, kPneumoniae: 47.5, sAureus: 42.1, pAeruginosa: 38.4, aBaumannii: 61.0 },
  { month: 'Aug 2026', overallResistance: 34.6, eColi: 53.9, kPneumoniae: 47.8, sAureus: 42.1, pAeruginosa: 38.5, aBaumannii: 61.5 },
  { 
    month: 'Sep 2026', 
    overallResistance: 34.8, 
    eColi: 54.0, 
    kPneumoniae: 48.2, 
    sAureus: 42.1, 
    pAeruginosa: 38.5, 
    aBaumannii: 61.8,
    anomalyDetected: true,
    anomalyNote: 'Rapid +18.0% point carbapenem spike in K. pneumoniae isolates'
  }
];

export const DEMO_ORGANISMS_LIST = [
  'Klebsiella pneumoniae',
  'Escherichia coli',
  'Pseudomonas aeruginosa',
  'Staphylococcus aureus',
  'Acinetobacter baumannii',
  'Enterococcus faecium'
];

export const DEMO_ANTIBIOTICS_LIST = [
  'Ampicillin',
  'Cefotaxime',
  'Ceftriaxone',
  'Meropenem',
  'Ciprofloxacin',
  'Gentamicin',
  'Vancomycin',
  'Colistin'
];

export const DEMO_RESISTANCE_MATRIX: MatrixData[] = [
  // Klebsiella pneumoniae
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Ampicillin', resistanceRate: 94.2, previousPeriodRate: 93.5, percentagePointChange: 0.7, sampleSize: 3420, alertStatus: 'critical' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Cefotaxime', resistanceRate: 68.5, previousPeriodRate: 64.0, percentagePointChange: 4.5, sampleSize: 3420, alertStatus: 'high' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Ceftriaxone', resistanceRate: 64.1, previousPeriodRate: 60.2, percentagePointChange: 3.9, sampleSize: 3420, alertStatus: 'high' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Meropenem', resistanceRate: 48.2, previousPeriodRate: 30.2, percentagePointChange: 18.0, sampleSize: 3420, alertStatus: 'critical' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Ciprofloxacin', resistanceRate: 58.7, previousPeriodRate: 52.1, percentagePointChange: 6.6, sampleSize: 3420, alertStatus: 'high' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Gentamicin', resistanceRate: 35.4, previousPeriodRate: 34.0, percentagePointChange: 1.4, sampleSize: 3420, alertStatus: 'moderate' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Vancomycin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' },
  { organism: 'Klebsiella pneumoniae', antibiotic: 'Colistin', resistanceRate: 6.8, previousPeriodRate: 4.1, percentagePointChange: 2.7, sampleSize: 3420, alertStatus: 'watch' },

  // Escherichia coli
  { organism: 'Escherichia coli', antibiotic: 'Ampicillin', resistanceRate: 78.4, previousPeriodRate: 77.0, percentagePointChange: 1.4, sampleSize: 5210, alertStatus: 'high' },
  { organism: 'Escherichia coli', antibiotic: 'Cefotaxime', resistanceRate: 42.1, previousPeriodRate: 38.5, percentagePointChange: 3.6, sampleSize: 5210, alertStatus: 'moderate' },
  { organism: 'Escherichia coli', antibiotic: 'Ceftriaxone', resistanceRate: 39.8, previousPeriodRate: 35.2, percentagePointChange: 4.6, sampleSize: 5210, alertStatus: 'moderate' },
  { organism: 'Escherichia coli', antibiotic: 'Meropenem', resistanceRate: 3.2, previousPeriodRate: 2.8, percentagePointChange: 0.4, sampleSize: 5210, alertStatus: 'normal' },
  { organism: 'Escherichia coli', antibiotic: 'Ciprofloxacin', resistanceRate: 64.5, previousPeriodRate: 47.5, percentagePointChange: 17.0, sampleSize: 5210, alertStatus: 'high' },
  { organism: 'Escherichia coli', antibiotic: 'Gentamicin', resistanceRate: 21.0, previousPeriodRate: 20.1, percentagePointChange: 0.9, sampleSize: 5210, alertStatus: 'watch' },
  { organism: 'Escherichia coli', antibiotic: 'Vancomycin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' },
  { organism: 'Escherichia coli', antibiotic: 'Colistin', resistanceRate: 1.5, previousPeriodRate: 1.2, percentagePointChange: 0.3, sampleSize: 5210, alertStatus: 'normal' },

  // Pseudomonas aeruginosa
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Ampicillin', resistanceRate: 99.0, previousPeriodRate: 99.0, percentagePointChange: 0.0, sampleSize: 2450, alertStatus: 'critical' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Cefotaxime', resistanceRate: 85.0, previousPeriodRate: 84.1, percentagePointChange: 0.9, sampleSize: 2450, alertStatus: 'high' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Ceftriaxone', resistanceRate: 82.3, previousPeriodRate: 81.5, percentagePointChange: 0.8, sampleSize: 2450, alertStatus: 'high' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Meropenem', resistanceRate: 38.5, previousPeriodRate: 28.0, percentagePointChange: 10.5, sampleSize: 2450, alertStatus: 'high' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Ciprofloxacin', resistanceRate: 41.2, previousPeriodRate: 39.0, percentagePointChange: 2.2, sampleSize: 2450, alertStatus: 'moderate' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Gentamicin', resistanceRate: 29.8, previousPeriodRate: 28.5, percentagePointChange: 1.3, sampleSize: 2450, alertStatus: 'moderate' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Vancomycin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' },
  { organism: 'Pseudomonas aeruginosa', antibiotic: 'Colistin', resistanceRate: 4.1, previousPeriodRate: 3.5, percentagePointChange: 0.6, sampleSize: 2450, alertStatus: 'watch' },

  // Staphylococcus aureus
  { organism: 'Staphylococcus aureus', antibiotic: 'Ampicillin', resistanceRate: 88.5, previousPeriodRate: 88.0, percentagePointChange: 0.5, sampleSize: 4120, alertStatus: 'high' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Cefotaxime', resistanceRate: 42.1, previousPeriodRate: 43.5, percentagePointChange: -1.4, sampleSize: 4120, alertStatus: 'moderate' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Ceftriaxone', resistanceRate: 42.1, previousPeriodRate: 43.5, percentagePointChange: -1.4, sampleSize: 4120, alertStatus: 'moderate' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Meropenem', resistanceRate: 12.0, previousPeriodRate: 11.5, percentagePointChange: 0.5, sampleSize: 4120, alertStatus: 'watch' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Ciprofloxacin', resistanceRate: 34.2, previousPeriodRate: 35.0, percentagePointChange: -0.8, sampleSize: 4120, alertStatus: 'moderate' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Gentamicin', resistanceRate: 18.6, previousPeriodRate: 19.1, percentagePointChange: -0.5, sampleSize: 4120, alertStatus: 'watch' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Vancomycin', resistanceRate: 8.4, previousPeriodRate: 4.2, percentagePointChange: 4.2, sampleSize: 4120, alertStatus: 'moderate' },
  { organism: 'Staphylococcus aureus', antibiotic: 'Colistin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' },

  // Acinetobacter baumannii
  { organism: 'Acinetobacter baumannii', antibiotic: 'Ampicillin', resistanceRate: 98.2, previousPeriodRate: 98.0, percentagePointChange: 0.2, sampleSize: 1890, alertStatus: 'critical' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Cefotaxime', resistanceRate: 89.4, previousPeriodRate: 88.2, percentagePointChange: 1.2, sampleSize: 1890, alertStatus: 'high' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Ceftriaxone', resistanceRate: 87.6, previousPeriodRate: 86.5, percentagePointChange: 1.1, sampleSize: 1890, alertStatus: 'high' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Meropenem', resistanceRate: 61.8, previousPeriodRate: 56.0, percentagePointChange: 5.8, sampleSize: 1890, alertStatus: 'critical' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Ciprofloxacin', resistanceRate: 74.3, previousPeriodRate: 72.0, percentagePointChange: 2.3, sampleSize: 1890, alertStatus: 'high' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Gentamicin', resistanceRate: 59.0, previousPeriodRate: 57.5, percentagePointChange: 1.5, sampleSize: 1890, alertStatus: 'high' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Vancomycin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' },
  { organism: 'Acinetobacter baumannii', antibiotic: 'Colistin', resistanceRate: 22.0, previousPeriodRate: 11.5, percentagePointChange: 10.5, sampleSize: 1890, alertStatus: 'high' },

  // Enterococcus faecium
  { organism: 'Enterococcus faecium', antibiotic: 'Ampicillin', resistanceRate: 89.1, previousPeriodRate: 88.5, percentagePointChange: 0.6, sampleSize: 1200, alertStatus: 'high' },
  { organism: 'Enterococcus faecium', antibiotic: 'Cefotaxime', resistanceRate: 99.0, previousPeriodRate: 99.0, percentagePointChange: 0.0, sampleSize: 1200, alertStatus: 'critical' },
  { organism: 'Enterococcus faecium', antibiotic: 'Ceftriaxone', resistanceRate: 99.0, previousPeriodRate: 99.0, percentagePointChange: 0.0, sampleSize: 1200, alertStatus: 'critical' },
  { organism: 'Enterococcus faecium', antibiotic: 'Meropenem', resistanceRate: 95.0, previousPeriodRate: 95.0, percentagePointChange: 0.0, sampleSize: 1200, alertStatus: 'critical' },
  { organism: 'Enterococcus faecium', antibiotic: 'Ciprofloxacin', resistanceRate: 68.2, previousPeriodRate: 67.0, percentagePointChange: 1.2, sampleSize: 1200, alertStatus: 'high' },
  { organism: 'Enterococcus faecium', antibiotic: 'Gentamicin', resistanceRate: 51.4, previousPeriodRate: 50.1, percentagePointChange: 1.3, sampleSize: 1200, alertStatus: 'high' },
  { organism: 'Enterococcus faecium', antibiotic: 'Vancomycin', resistanceRate: 56.3, previousPeriodRate: 54.0, percentagePointChange: 2.3, sampleSize: 1200, alertStatus: 'high' },
  { organism: 'Enterococcus faecium', antibiotic: 'Colistin', resistanceRate: 0.0, previousPeriodRate: 0.0, percentagePointChange: 0.0, sampleSize: 0, alertStatus: 'normal' }
];

export const DEMO_RECENT_REPORTS: MedicalReport[] = [
  {
    id: 'REP-9081',
    reportNumber: 'LAB-2026-9812',
    patientId: 'PT-88219',
    collectionDate: '2026-09-11',
    facility: 'St. Jude General Hospital',
    department: 'ICU Ward B',
    sampleType: 'Sputum Culture',
    organismIdentified: 'Klebsiella pneumoniae',
    antibioticsTested: [
      { antibiotic: 'Meropenem', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
      { antibiotic: 'Gentamicin', susceptibility: 'Intermediate', micValue: '4 ug/mL' },
      { antibiotic: 'Colistin', susceptibility: 'Susceptible', micValue: '0.5 ug/mL' }
    ],
    status: 'Flagged',
    riskLevel: 'Critical',
    confidenceScore: 98.4,
    dataSource: 'DEMO_SYNTHETIC'
  },
  {
    id: 'REP-9080',
    reportNumber: 'LAB-2026-9811',
    patientId: 'PT-44120',
    collectionDate: '2026-09-11',
    facility: 'Metro Health Outpatient Center',
    department: 'Outpatient Clinic 3',
    sampleType: 'Urine Culture',
    organismIdentified: 'Escherichia coli',
    antibioticsTested: [
      { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '4 ug/mL' },
      { antibiotic: 'Nitrofurantoin', susceptibility: 'Susceptible', micValue: '16 ug/mL' },
      { antibiotic: 'Fosfomycin', susceptibility: 'Susceptible', micValue: '8 ug/mL' }
    ],
    status: 'Analyzed',
    riskLevel: 'Moderate',
    confidenceScore: 96.1,
    dataSource: 'DEMO_SYNTHETIC'
  },
  {
    id: 'REP-9079',
    reportNumber: 'LAB-2026-9809',
    patientId: 'PT-10943',
    collectionDate: '2026-09-10',
    facility: 'University Hospital Center',
    department: 'Burn & Trauma ICU',
    sampleType: 'Blood Culture',
    organismIdentified: 'Acinetobacter baumannii',
    antibioticsTested: [
      { antibiotic: 'Meropenem', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
      { antibiotic: 'Imipenem', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
      { antibiotic: 'Colistin', susceptibility: 'Resistant', micValue: '4 ug/mL' },
      { antibiotic: 'Tigecycline', susceptibility: 'Intermediate', micValue: '2 ug/mL' }
    ],
    status: 'Flagged',
    riskLevel: 'Critical',
    confidenceScore: 99.1,
    dataSource: 'DEMO_SYNTHETIC'
  },
  {
    id: 'REP-9078',
    reportNumber: 'LAB-2026-9808',
    patientId: 'PT-55109',
    collectionDate: '2026-09-10',
    facility: 'Eastside Medical Center',
    department: 'Surgical Ward A',
    sampleType: 'Wound Swab',
    organismIdentified: 'Staphylococcus aureus',
    antibioticsTested: [
      { antibiotic: 'Oxacillin', susceptibility: 'Resistant', micValue: '>4 ug/mL' },
      { antibiotic: 'Vancomycin', susceptibility: 'Susceptible', micValue: '1 ug/mL' },
      { antibiotic: 'Linezolid', susceptibility: 'Susceptible', micValue: '1 ug/mL' }
    ],
    status: 'Analyzed',
    riskLevel: 'Moderate',
    confidenceScore: 97.5,
    dataSource: 'DEMO_SYNTHETIC'
  },
  {
    id: 'REP-9077',
    reportNumber: 'LAB-2026-9805',
    patientId: 'PT-33291',
    collectionDate: '2026-09-09',
    facility: 'North Suburbs Health Zone',
    department: 'General Medical Ward',
    sampleType: 'Urine Culture',
    organismIdentified: 'Enterococcus faecalis',
    antibioticsTested: [
      { antibiotic: 'Ampicillin', susceptibility: 'Susceptible', micValue: '2 ug/mL' },
      { antibiotic: 'Vancomycin', susceptibility: 'Susceptible', micValue: '1 ug/mL' }
    ],
    status: 'Analyzed',
    riskLevel: 'Watch',
    confidenceScore: 95.8,
    dataSource: 'DEMO_SYNTHETIC'
  }
];

export const DEMO_SAMPLE_REPORTS_FOR_ANALYSIS: DemoSampleReport[] = [
  {
    id: 'SAMPLE-01',
    title: 'Hospital ICU Sputum Culture - Carbapenem Resistant K. pneumoniae',
    description: 'High-risk sample isolated from a ventilated ICU patient showing multi-drug resistance.',
    facility: 'St. Jude General Hospital',
    department: 'ICU Ward B',
    sampleType: 'Endotracheal Aspirate / Sputum',
    organism: 'Klebsiella pneumoniae',
    date: '2026-09-12',
    patientId: 'PT-ICU-882',
    findings: [
      { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
      { antibiotic: 'Cefotaxime', susceptibility: 'Resistant', micValue: '>64 ug/mL' },
      { antibiotic: 'Ceftriaxone', susceptibility: 'Resistant', micValue: '>64 ug/mL' },
      { antibiotic: 'Meropenem', susceptibility: 'Resistant', micValue: '16 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
      { antibiotic: 'Gentamicin', susceptibility: 'Intermediate', micValue: '4 ug/mL' },
      { antibiotic: 'Colistin', susceptibility: 'Susceptible', micValue: '0.5 ug/mL' }
    ],
    aiAssessment: {
      summary: 'Critical early warning alert profile detected. Isolate exhibits CRE phenotypic pattern with concurrent fluoroquinolone non-susceptibility.',
      riskScore: 92,
      confidenceScore: 98,
      anomalyScore: 85,
      criticalAlerts: [
        'Carbapenem-Resistant Enterobacteriaceae (CRE) phenotype confirmed',
        'Potential cluster case in St. Jude General Hospital ICU Ward B',
        'Sustained +18.0 percentage-point carbapenem rate spike'
      ],
      surveillanceActions: [
        'Consider active infection-control surveillance and contact precautions audit in ICU Ward B.',
        'Perform confirmatory molecular resistance gene testing (PCR for blaKPC / blaNDM).',
        'Review local hospital antibiogram for carbapenem class susceptibility.',
        'Escalate findings to the appropriate antimicrobial stewardship team.'
      ],
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Resistance increased by 18.0 percentage points (from 30.2% to 48.2%)',
        factors: [
          'Sustained rate increase observed across 3 consecutive 5-day observation windows',
          'Clustered geographically within St. Jude General Hospital ICU Ward B',
          'Phenotypic profile matches KPC / NDM carbapenemase expression',
          'High sample density (n=3,420 isolates) confirming statistical significance'
        ],
        observedLocations: ['St. Jude General Hospital - ICU Ward B'],
        timeWindow: '14-Day Observation Window',
        severityRationale: 'Exceeds critical 15 percentage-point threshold for carbapenem class antibiotics.'
      }
    }
  },
  {
    id: 'SAMPLE-02',
    title: 'Outpatient Urine Culture - ESBL E. coli Pattern',
    description: 'Community-acquired urinary infection report showing extended-spectrum beta-lactamase indicators.',
    facility: 'Metro Health Community Care Clinic',
    department: 'Outpatient Clinic 1',
    sampleType: 'Clean Catch Midstream Urine',
    organism: 'Escherichia coli',
    date: '2026-09-11',
    patientId: 'PT-OUT-441',
    findings: [
      { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
      { antibiotic: 'Cefotaxime', susceptibility: 'Resistant', micValue: '16 ug/mL' },
      { antibiotic: 'Ceftriaxone', susceptibility: 'Resistant', micValue: '32 ug/mL' },
      { antibiotic: 'Meropenem', susceptibility: 'Susceptible', micValue: '<0.25 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>4 ug/mL' },
      { antibiotic: 'Nitrofurantoin', susceptibility: 'Susceptible', micValue: '16 ug/mL' }
    ],
    aiAssessment: {
      summary: 'ESBL-producing E. coli pattern identified. Resistant to standard oral cephalosporins and fluoroquinolones.',
      riskScore: 68,
      confidenceScore: 96,
      anomalyScore: 45,
      criticalAlerts: [
        'ESBL Phenotype confirmed',
        'Outpatient fluoroquinolone resistance failure risk (+17.0 percentage points)'
      ],
      surveillanceActions: [
        'Consider confirmatory laboratory review of outpatient urine culture isolates.',
        'Review local outpatient antibiogram for community-acquired UTI surveillance.',
        'Escalate to the local antimicrobial stewardship team.'
      ],
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Ciprofloxacin resistance increased by 17.0 percentage points in community clinics',
        factors: [
          'Community outpatient urinary isolate resistance crossed the 60% empirical threshold',
          'Observed across 8 contributing outpatient health facilities in North Suburbs'
        ],
        observedLocations: ['Metro Health Community Care Clinic'],
        timeWindow: '30-Day Window',
        severityRationale: 'Elevated prevalence jeopardizes empirical first-line oral outpatient regimens.'
      }
    }
  },
  {
    id: 'SAMPLE-03',
    title: 'Surgical Wound Swab - MRSA Identification',
    description: 'Post-operative surgical wound site isolation testing positive for Methicillin resistance.',
    facility: 'Eastside Surgical Center',
    department: 'Surgical Unit 2',
    sampleType: 'Superficial Wound Swab',
    organism: 'Staphylococcus aureus',
    date: '2026-09-10',
    patientId: 'PT-SURG-551',
    findings: [
      { antibiotic: 'Penicillin', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
      { antibiotic: 'Oxacillin / Cefoxitin', susceptibility: 'Resistant', micValue: '>4 ug/mL' },
      { antibiotic: 'Erythromycin', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
      { antibiotic: 'Clindamycin', susceptibility: 'Resistant', micValue: '>4 ug/mL' },
      { antibiotic: 'Vancomycin', susceptibility: 'Susceptible', micValue: '1 ug/mL' },
      { antibiotic: 'Trimethoprim/Sulfa', susceptibility: 'Susceptible', micValue: '<1 ug/mL' }
    ],
    aiAssessment: {
      summary: 'Methicillin-Resistant Staphylococcus aureus (MRSA) confirmed with macrolide/lincosamide resistance.',
      riskScore: 74,
      confidenceScore: 97,
      anomalyScore: 35,
      criticalAlerts: [
        'MRSA post-surgical wound profile',
        'Vancomycin MIC within acceptable baseline (1 ug/mL)'
      ],
      surveillanceActions: [
        'Consider infection-control surveillance and surgical site infection audit.',
        'Review local hospital antibiogram for surgical ward isolates.',
        'Escalate to the antimicrobial stewardship team.'
      ],
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'MRSA rate stable at 42.1% across surgical units',
        factors: [
          'Confirmed oxacillin / cefoxitin resistance',
          'Vancomycin MIC acceptable (1 ug/mL)'
        ],
        observedLocations: ['Eastside Surgical Center'],
        timeWindow: 'Routine Surveillance',
        severityRationale: 'Standard MRSA surveillance protocol item.'
      }
    }
  }
];
