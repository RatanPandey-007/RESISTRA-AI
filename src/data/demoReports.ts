import { DemoSampleReport } from '../types';

export const DEMO_PRESET_REPORTS: DemoSampleReport[] = [
  {
    id: 'DEMO-INC-01',
    title: 'Outpatient Urine Culture Batch — E. coli Ciprofloxacin Resistance Shift',
    description: 'Surveillance batch from 8 outpatient community care clinics indicating elevated fluoroquinolone non-susceptibility.',
    facility: 'North Suburbs Health Zone',
    department: 'Outpatient Community Clinics',
    sampleType: 'Clean Catch Urine Culture',
    organism: 'Escherichia coli',
    date: '2026-09-12',
    patientId: 'PT-OUT-8891',
    findings: [
      { antibiotic: 'Ampicillin', susceptibility: 'Resistant', micValue: '>32 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>4 ug/mL' },
      { antibiotic: 'Cefotaxime', susceptibility: 'Resistant', micValue: '16 ug/mL' },
      { antibiotic: 'Nitrofurantoin', susceptibility: 'Susceptible', micValue: '16 ug/mL' }
    ],
    aiAssessment: {
      summary: 'High-level community surveillance signal. Isolate profile demonstrates elevated outpatient Ciprofloxacin resistance (31% → 48%).',
      riskScore: 82,
      confidenceScore: 96,
      anomalyScore: 78,
      criticalAlerts: [
        'Outpatient Ciprofloxacin resistance spike (+17.0 percentage points)',
        'Exceeds 40% empirical surveillance threshold'
      ],
      surveillanceActions: [
        'Review local outpatient laboratory surveillance data.',
        'Consider confirmatory laboratory review of outpatient isolates.',
        'Review local antibiogram with community stewardship coordinator.'
      ],
      explainableRationale: {
        title: 'WHY WAS THIS ALERT GENERATED?',
        primaryMetricChange: 'E. coli resistance to Ciprofloxacin increased from 31% to 48% (+17.0 percentage points)',
        factors: [
          'Sustained rate increase observed across consecutive 30-day reporting periods',
          'Observed across 8 contributing outpatient health facilities in North Suburbs'
        ],
        observedLocations: ['North Suburbs Health Zone - Outpatient Network'],
        timeWindow: '30-Day Window (Aug 13 - Sep 12, 2026)',
        severityRationale: 'Elevated outpatient resistance jeopardizes first-line oral empirical guidelines.'
      }
    }
  },
  {
    id: 'DEMO-INC-02',
    title: 'Hospital ICU Sputum Batch — Carbapenem Resistant K. pneumoniae Cluster',
    description: 'Ventilated ICU patient culture isolation displaying carbapenemase phenotypic pattern.',
    facility: 'St. Jude General Hospital',
    department: 'ICU Ward B',
    sampleType: 'Endotracheal Aspirate',
    organism: 'Klebsiella pneumoniae',
    date: '2026-09-11',
    patientId: 'PT-ICU-4412',
    findings: [
      { antibiotic: 'Meropenem', susceptibility: 'Resistant', micValue: '16 ug/mL' },
      { antibiotic: 'Imipenem', susceptibility: 'Resistant', micValue: '>16 ug/mL' },
      { antibiotic: 'Ciprofloxacin', susceptibility: 'Resistant', micValue: '>8 ug/mL' },
      { antibiotic: 'Colistin', susceptibility: 'Susceptible', micValue: '0.5 ug/mL' }
    ],
    aiAssessment: {
      summary: 'Critical ICU surveillance alert. CRE strain cluster isolated in St. Jude ICU Ward B with +18.0 percentage-point carbapenem drift.',
      riskScore: 94,
      confidenceScore: 98,
      anomalyScore: 88,
      criticalAlerts: [
        'Carbapenem-Resistant Enterobacteriaceae (CRE) cluster detected',
        'Sustained +18.0 percentage-point carbapenem rate spike'
      ],
      surveillanceActions: [
        'Consider active infection-control surveillance and environmental audit in ICU Ward B.',
        'Perform confirmatory molecular resistance gene testing (PCR for blaKPC / blaNDM).',
        'Escalate to the hospital antimicrobial stewardship team.'
      ],
      explainableRationale: {
        title: 'WHY WAS THIS ALERT GENERATED?',
        primaryMetricChange: 'K. pneumoniae resistance to Meropenem increased from 30.2% to 48.2% (+18.0 percentage points)',
        factors: [
          'Carbapenem resistance spike observed in ICU Ward B isolates',
          'Phenotypic pattern matches blaKPC gene expression'
        ],
        observedLocations: ['St. Jude General Hospital - ICU Ward B'],
        timeWindow: '14-Day Observation Window',
        severityRationale: 'High severity due to last-resort carbapenem non-susceptibility.'
      }
    }
  }
];
