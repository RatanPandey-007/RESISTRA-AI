#!/usr/bin/env python3
"""
RESISTRA AI — Feature Engineering Module
Defines, documents, and transforms feature vectors for:
1. Model 1 (Resistance Risk XGBoost Classification)
2. Model 2 (Multivariate Isolation Forest Anomaly Detection)
"""

import json
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer

# Numerical features used for XGBoost classification
NUMERICAL_FEATURES = [
    'resistance_rate',          # Current non-susceptibility percentage (0 - 100%)
    'previous_resistance_rate', # Preceding observation period rate (0 - 100%)
    'resistance_change',        # Absolute percentage point shift (e.g. +17.0 pp)
    'rolling_mean',             # 6-month historical moving average
    'rolling_std',              # 6-month historical volatility/standard deviation
    'trend_slope',              # Linear trend rate of change across observation window
    'facility_count',           # Number of distinct facilities observing this signal
    'reporting_volume',         # Total isolate testing volume within health zone
    'threshold_distance',       # Distance between current rate and pathogen alert cutoff
    'rolling_deviation'         # Z-Score deviation: (rate - rolling_mean) / rolling_std
]

# Categorical features
CATEGORICAL_FEATURES = [
    'organism',
    'antibiotic',
    'region'
]

# Isolation Forest features (multivariate anomaly detection)
ANOMALY_FEATURE_NAMES = [
    'resistance_change',
    'trend_slope',
    'threshold_distance',
    'rolling_deviation',
    'reporting_volume'
]

FEATURE_DOCS = {
    'resistance_rate': 'Current measured AMR prevalence percentage [0.0 - 100.0%].',
    'previous_resistance_rate': 'Preceding surveillance period resistance rate [0.0 - 100.0%].',
    'resistance_change': 'Absolute percentage point change between periods (e.g. +17.0 percentage points).',
    'rolling_mean': 'Rolling 6-month baseline resistance mean.',
    'rolling_std': 'Rolling 6-month standard deviation measuring natural epidemiological drift.',
    'trend_slope': 'Directional gradient of the longitudinal regression line.',
    'facility_count': 'Number of reporting laboratories or clinics contributing to this cluster.',
    'reporting_volume': 'Total antimicrobial susceptibility tests performed across the region.',
    'threshold_distance': 'Observed rate minus critical WHO/CLSI surveillance cutoff threshold.',
    'rolling_deviation': 'Normalized Z-Score deviation from the rolling baseline.'
}

def add_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    """Calculates derived features such as rolling_deviation."""
    df_copy = df.copy()
    
    # Ensure numeric types
    for col in ['resistance_rate', 'rolling_mean', 'rolling_std', 'resistance_change']:
        if col in df_copy.columns:
            df_copy[col] = pd.to_numeric(df_copy[col], errors='coerce').fillna(0.0)
            
    # Calculate Z-score rolling deviation: (rate - mean) / (std + 1e-4)
    if 'rolling_deviation' not in df_copy.columns:
        std_safe = df_copy['rolling_std'].replace(0, 1.0)
        df_copy['rolling_deviation'] = (df_copy['resistance_rate'] - df_copy['rolling_mean']) / (std_safe + 1e-4)
        df_copy['rolling_deviation'] = df_copy['rolling_deviation'].round(2)
        
    return df_copy

def create_feature_preprocessor(categorical_categories=None):
    """
    Creates a scikit-learn ColumnTransformer for categorical and numerical features.
    """
    categorical_transformer = OneHotEncoder(
        handle_unknown='ignore',
        sparse_output=False
    )
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', 'passthrough', NUMERICAL_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )
    return preprocessor

def get_anomaly_features(df: pd.DataFrame) -> np.ndarray:
    """Extracts features for Isolation Forest anomaly detection."""
    df_proc = add_derived_features(df)
    return df_proc[ANOMALY_FEATURE_NAMES].to_numpy(dtype=np.float32)

if __name__ == "__main__":
    print("Feature Engineering Module initialized.")
    print("Numerical features:", NUMERICAL_FEATURES)
    print("Anomaly features:", ANOMALY_FEATURE_NAMES)
