import { AMRAlert } from '../types';

/**
 * Generates transparent rule-based early warning alerts with Explainable AI rationale.
 */
export function generateAMRAlerts(): AMRAlert[] {
  return [
    {
      id: 'ALT-2026-089',
      severity: 'critical',
      date: '2026-09-11',
      affectedOrganism: 'Klebsiella pneumoniae',
      antibiotic: 'Meropenem',
      facility: 'St. Jude General Hospital',
      department: 'ICU Ward B',
      previousPeriodRate: 30.2,
      currentPeriodRate: 48.2,
      percentagePointChange: 18.0,
      sampleCount: 3420,
      timeWindow: 'Last 14 reporting days',
      reason: 'Rapid 18.0 percentage-point carbapenem resistance spike detected across ICU isolates.',
      confidenceScore: 98,
      status: 'active',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Resistance increased by 18.0 percentage points (from 30.2% to 48.2%)',
        factors: [
          'Sustained rate increase observed across 3 consecutive 5-day observation windows',
          'Clustered geographically within St. Jude General Hospital ICU Ward B',
          'Phenotypic profile matches KPC / NDM carbapenemase expression',
          'High sample density (n=3,420 isolates) confirming statistical significance'
        ],
        observedLocations: ['St. Jude General Hospital - ICU Ward B', 'Metro Central District'],
        timeWindow: '14-Day Rolling Window (Aug 28 - Sep 11, 2026)',
        severityRationale: 'Exceeds critical 15 percentage-point threshold for carbapenem class antibiotics.'
      },
      surveillanceAction: [
        'Consider infection-control surveillance and environmental audit in ICU Ward B.',
        'Perform confirmatory molecular resistance gene testing (PCR for blaKPC / blaNDM).',
        'Review local hospital antibiogram for carbapenem class susceptibility.',
        'Escalate findings to the appropriate antimicrobial stewardship team.'
      ]
    },
    {
      id: 'ALT-2026-088',
      severity: 'high',
      date: '2026-09-10',
      affectedOrganism: 'Escherichia coli',
      antibiotic: 'Ciprofloxacin',
      facility: 'North Suburbs Health Zone',
      department: 'Outpatient Community Clinics',
      previousPeriodRate: 47.5,
      currentPeriodRate: 64.5,
      percentagePointChange: 17.0,
      sampleCount: 5210,
      timeWindow: 'Last 30 reporting days',
      reason: 'Persistent fluoroquinolone resistance spike (+17.0 percentage points) exceeding 60% threshold in community clinics.',
      confidenceScore: 96,
      status: 'active',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Resistance increased by 17.0 percentage points (from 47.5% to 64.5%)',
        factors: [
          'Community outpatient urinary isolate resistance crossed the 60% empirical threshold',
          'Observed across 8 contributing outpatient health facilities in North Suburbs',
          'Concurrent 3rd gen cephalosporin co-resistance noted in 42% of isolates'
        ],
        observedLocations: ['North Suburbs Health Zone (8 Outpatient Clinics)'],
        timeWindow: '30-Day Surveillance Window',
        severityRationale: 'Elevated prevalence jeopardizes empirical first-line oral outpatient regimens.'
      },
      surveillanceAction: [
        'Consider confirmatory laboratory review of outpatient urine culture isolates.',
        'Distribute updated community antibiogram guidance to regional primary care networks.',
        'Review local outpatient empirical treatment guidelines with stewardship officers.',
        'Escalate to regional public health surveillance coordinator.'
      ]
    },
    {
      id: 'ALT-2026-085',
      severity: 'high',
      date: '2026-09-08',
      affectedOrganism: 'Acinetobacter baumannii',
      antibiotic: 'Colistin',
      facility: 'University Hospital Center',
      department: 'Burn & Trauma ICU',
      previousPeriodRate: 11.5,
      currentPeriodRate: 22.0,
      percentagePointChange: 10.5,
      sampleCount: 1890,
      timeWindow: 'Last 14 reporting days',
      reason: 'Emerging polymyxin (colistin) non-susceptibility (+10.5 percentage points) in multi-drug resistant isolates.',
      confidenceScore: 94,
      status: 'under_review',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Colistin resistance increased by 10.5 percentage points (from 11.5% to 22.0%)',
        factors: [
          'Unusual emergence of colistin MIC > 2 ug/mL in pan-drug resistant background isolates',
          'Suspected plasmid-mediated mcr gene transfer profile',
          'High impact last-resort antibiotic vulnerability'
        ],
        observedLocations: ['University Hospital Burn & Trauma Unit'],
        timeWindow: '14-Day Surveillance Window',
        severityRationale: 'Colistin is a reserve agent; any rapid drift triggers high-level surveillance.'
      },
      surveillanceAction: [
        'Consider active infection-control surveillance and contact barrier isolation audit.',
        'Conduct rapid PCR screening for plasmid-mediated mcr-1 to mcr-5 gene markers.',
        'Review local hospital antibiogram and isolate repository for epidemiological mapping.',
        'Escalate to the hospital infection control committee.'
      ]
    },
    {
      id: 'ALT-2026-081',
      severity: 'moderate',
      date: '2026-09-05',
      affectedOrganism: 'Staphylococcus aureus (MRSA)',
      antibiotic: 'Vancomycin',
      facility: 'Eastside Medical Center',
      department: 'Orthopedic Surgical Ward',
      previousPeriodRate: 4.2,
      currentPeriodRate: 8.4,
      percentagePointChange: 4.2,
      sampleCount: 4120,
      timeWindow: 'Last 30 reporting days',
      reason: 'Moderate MIC drift towards intermediate susceptibility (VISA phenotype watch).',
      confidenceScore: 92,
      status: 'active',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Vancomycin non-susceptibility increased by 4.2 percentage points (from 4.2% to 8.4%)',
        factors: [
          'Gradual upward creep of vancomycin MIC values from 1.0 ug/mL to 2.0 ug/mL',
          'Detected in routine post-surgical surveillance wound swabs'
        ],
        observedLocations: ['Eastside Medical Center - Surgical Wards'],
        timeWindow: '30-Day Surveillance Window',
        severityRationale: 'Early warning indicator for potential vancomycin intermediate resistance (VISA).'
      },
      surveillanceAction: [
        'Consider confirmatory E-test or broth microdilution MIC re-testing.',
        'Review local antibiogram for surgical prophylaxis monitoring.',
        'Escalate to antimicrobial stewardship committee for routine monitoring.'
      ]
    },
    {
      id: 'ALT-2026-079',
      severity: 'moderate',
      date: '2026-09-02',
      affectedOrganism: 'Pseudomonas aeruginosa',
      antibiotic: 'Ceftazidime/Avibactam',
      facility: 'Regional Burn & Trauma Unit',
      department: 'Sub-Acute Burn Unit',
      previousPeriodRate: 8.0,
      currentPeriodRate: 15.1,
      percentagePointChange: 7.1,
      sampleCount: 2450,
      timeWindow: 'Last 30 reporting days',
      reason: 'Unusual novelty resistance pattern observed in post-operative burn unit isolates.',
      confidenceScore: 89,
      status: 'active',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Ceftazidime/Avibactam resistance increased by 7.1 percentage points (from 8.0% to 15.1%)',
        factors: [
          'Emergence of metallo-beta-lactamase (MBL) co-resistance pattern in burn unit isolates',
          'Observed across 5 patients in sub-acute burn unit'
        ],
        observedLocations: ['Regional Burn Unit'],
        timeWindow: '30-Day Window',
        severityRationale: 'Requires monitoring to prevent spread of MBL producing strains.'
      },
      surveillanceAction: [
        'Consider infection-control surveillance and hydrotherapy equipment screening.',
        'Perform phenotypic synergy testing (EDTA-Ceftazidime disc test).',
        'Escalate to the appropriate antimicrobial stewardship team.'
      ]
    },
    {
      id: 'ALT-2026-074',
      severity: 'watch',
      date: '2026-08-28',
      affectedOrganism: 'Enterococcus faecium (VRE)',
      antibiotic: 'Linezolid',
      facility: 'Pine Crest Rehabilitation Center',
      department: 'Long-Term Care Unit',
      previousPeriodRate: 1.5,
      currentPeriodRate: 4.2,
      percentagePointChange: 2.7,
      sampleCount: 1200,
      timeWindow: 'Last 60 reporting days',
      reason: 'Watchlist: Isolated case of linezolid non-susceptibility noted in long-term care batch analysis.',
      confidenceScore: 88,
      status: 'resolved',
      explainableRationale: {
        title: 'WHY THIS ALERT WAS GENERATED',
        primaryMetricChange: 'Linezolid resistance increased by 2.7 percentage points (from 1.5% to 4.2%)',
        factors: [
          'Detection of cfr gene suspect strain in long-term care facility batch audit'
        ],
        observedLocations: ['Pine Crest Rehabilitation Center'],
        timeWindow: '60-Day Surveillance Window',
        severityRationale: 'Low prevalence watchlist item for long-term care monitoring.'
      },
      surveillanceAction: [
        'Consider confirmatory laboratory review of long-term care surveillance isolates.',
        'Review infection control sanitation routines in rehabilitation wings.'
      ]
    }
  ];
}
