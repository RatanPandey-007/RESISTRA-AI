#!/usr/bin/env python3
"""
RESISTRA AI — Synthetic Surveillance Dataset Generator
Generates a reproducible synthetic AMR surveillance dataset for machine learning prototype evaluation.

IMPORTANT MEDICAL SAFETY:
This dataset is completely SYNTHETIC and generated using deterministic mathematical rules.
It does NOT represent real patient health records or clinical hospital data.
"""

import os
import random
import numpy as np
import pandas as pd

# Enforce deterministic reproducibility
RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

ORGANISMS = [
    'Escherichia coli',
    'Klebsiella pneumoniae',
    'Pseudomonas aeruginosa',
    'Staphylococcus aureus',
    'Acinetobacter baumannii',
    'Enterococcus faecium'
]

ANTIBIOTICS = [
    'Ciprofloxacin',
    'Meropenem',
    'Colistin',
    'Ampicillin',
    'Ceftriaxone',
    'Gentamicin',
    'Vancomycin'
]

FACILITIES = [
    'St. Jude General Hospital',
    'University Hospital Center',
    'Eastside Medical Center',
    'North Suburbs Health Zone',
    'Metro West Community Clinic',
    'Valley Health District'
]

REGIONS = [
    'Metro Central',
    'Metro North',
    'East District',
    'West District'
]

MONTHS = [
    f"2025-{m:02d}" for m in range(10, 13)
] + [
    f"2026-{m:02d}" for m in range(1, 10)
]

# Clinical surveillance thresholds per pathogen (empirical high-risk cutoffs)
SURVEILLANCE_THRESHOLDS = {
    'Escherichia coli': 40.0,
    'Klebsiella pneumoniae': 35.0,
    'Pseudomonas aeruginosa': 30.0,
    'Staphylococcus aureus': 40.0,
    'Acinetobacter baumannii': 25.0,
    'Enterococcus faecium': 30.0
}

def generate_synthetic_surveillance_dataset(n_samples=2500, output_path="data/synthetic_surveillance_data.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    records = []
    
    for i in range(n_samples):
        org = random.choice(ORGANISMS)
        ab = random.choice(ANTIBIOTICS)
        facility = random.choice(FACILITIES)
        region = random.choice(REGIONS)
        month = random.choice(MONTHS)
        
        # Realistic baseline range per organism
        if org in ['Klebsiella pneumoniae', 'Acinetobacter baumannii']:
            base_rate = np.random.normal(38.0, 10.0)
        elif org == 'Escherichia coli':
            base_rate = np.random.normal(32.0, 8.0)
        elif org == 'Staphylococcus aureus':
            base_rate = np.random.normal(30.0, 12.0)
        else:
            base_rate = np.random.normal(25.0, 8.0)
            
        prev_rate = float(np.clip(base_rate, 2.0, 85.0))
        
        # Sample volume and facility count
        facility_count = random.randint(1, 8)
        tested_isolates = random.randint(40, 600)
        reporting_volume = tested_isolates * facility_count + random.randint(50, 400)
        
        # Simulate shift: 80% stable/normal drift, 20% significant spike or shift
        is_spike = (random.random() < 0.20)
        if is_spike:
            change = np.random.uniform(12.0, 26.0)
            if random.random() < 0.15:
                change = -change # downward shift
        else:
            change = np.random.normal(0.2, 3.5)
            
        current_rate = float(np.clip(prev_rate + change, 1.0, 96.0))
        resistance_change = round(current_rate - prev_rate, 1)
        
        # Rolling stats
        rolling_mean = round(float(np.clip(prev_rate * 0.8 + current_rate * 0.2 + np.random.normal(0, 1.5), 2.0, 90.0)), 1)
        rolling_std = round(float(np.clip(abs(resistance_change) * 0.35 + np.random.uniform(0.8, 3.5), 0.5, 15.0)), 1)
        trend_slope = round(resistance_change / 3.0 + np.random.normal(0, 0.4), 2)
        
        cutoff = SURVEILLANCE_THRESHOLDS.get(org, 35.0)
        threshold_distance = round(current_rate - cutoff, 1)
        
        resistant_isolates = int(round((current_rate / 100.0) * tested_isolates))
        
        # Target Risk Formulation (Ground Truth Synthetic Rule):
        # High surveillance risk if:
        # 1. Rapid spike (>= 14.0 pp increase) OR
        # 2. Elevated resistance rate above threshold with positive slope OR
        # 3. Crossing threshold across multiple facilities with sustained volume
        high_risk_condition = (
            (resistance_change >= 14.0) or
            (current_rate >= cutoff and trend_slope > 1.2) or
            (threshold_distance >= 5.0 and facility_count >= 3 and resistance_change >= 6.0)
        )
        
        # Introduce small realistic boundary noise (4% label noise)
        if random.random() < 0.04:
            target_risk = 0 if high_risk_condition else 1
        else:
            target_risk = 1 if high_risk_condition else 0
            
        records.append({
            "observation_id": f"OBS-{i+1:05d}",
            "organism": org,
            "antibiotic": ab,
            "facility": facility,
            "region": region,
            "month": month,
            "tested_isolates": tested_isolates,
            "resistant_isolates": resistant_isolates,
            "resistance_rate": round(current_rate, 1),
            "previous_resistance_rate": round(prev_rate, 1),
            "resistance_change": resistance_change,
            "rolling_mean": rolling_mean,
            "rolling_std": rolling_std,
            "trend_slope": trend_slope,
            "facility_count": facility_count,
            "reporting_volume": reporting_volume,
            "threshold_distance": threshold_distance,
            "target_risk": target_risk
        })
        
    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} synthetic surveillance observations -> {output_path}")
    print(f"Target distribution: {df['target_risk'].value_counts(normalize=True).to_dict()}")
    return df

if __name__ == "__main__":
    generate_synthetic_surveillance_dataset()
