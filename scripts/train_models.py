#!/usr/bin/env python3
"""
RESISTRA AI — Model Training Script
Trains:
1. Model 1 (Resistance Risk Classification): XGBoost Classifier
2. Model 2 (Multivariate Anomaly Detection): Scikit-Learn Isolation Forest

Saves reproducible models and feature metadata to models/
"""

import os
import json
import joblib
from datetime import datetime, timezone
import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.ensemble import IsolationForest

from features import (
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    ANOMALY_FEATURE_NAMES,
    FEATURE_DOCS,
    add_derived_features,
    create_feature_preprocessor,
    get_anomaly_features
)

RANDOM_SEED = 42
MODEL_VERSION = "resistra-prototype-v1"
DATASET_VERSION = "v2.0-synthetic"

def train_and_export_models(data_path="data/synthetic_surveillance_data.csv", models_dir="models"):
    os.makedirs(models_dir, exist_ok=True)
    
    print(f"Loading synthetic dataset from {data_path}...")
    df = pd.read_csv(data_path)
    df = add_derived_features(df)
    
    X = df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y = df['target_risk'].astype(int)
    
    # Stratified 80/20 train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=y
    )
    
    print(f"Training set: {len(X_train)} rows | Test set: {len(X_test)} rows")
    
    # Save held-out test split for evaluate_model.py
    test_df = X_test.copy()
    test_df['target_risk'] = y_test
    test_df.to_csv("data/test_split.csv", index=False)
    
    # 1. Fit Preprocessor on Train Set
    preprocessor = create_feature_preprocessor()
    X_train_trans = preprocessor.fit_transform(X_train)
    
    # Extract transformed feature names
    cat_feature_names = list(preprocessor.named_transformers_['cat'].get_feature_names_out(CATEGORICAL_FEATURES))
    all_feature_names = NUMERICAL_FEATURES + cat_feature_names
    
    # 2. Train Model 1: XGBoost Classifier
    print("Training XGBoost Classifier for AMR Resistance Risk...")
    xgb_model = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=RANDOM_SEED,
        eval_metric='logloss'
    )
    xgb_model.fit(X_train_trans, y_train)
    
    # 3. Train Model 2: Isolation Forest Anomaly Detector
    print("Training Isolation Forest Anomaly Detector...")
    X_train_anomaly = get_anomaly_features(X_train)
    iso_model = IsolationForest(
        n_estimators=100,
        contamination=0.15,
        random_state=RANDOM_SEED
    )
    iso_model.fit(X_train_anomaly)
    
    # 4. Save Trained Model Artifacts
    joblib.dump(preprocessor, os.path.join(models_dir, "preprocessor.pkl"))
    joblib.dump(xgb_model, os.path.join(models_dir, "resistance_risk_model.pkl"))
    joblib.dump(iso_model, os.path.join(models_dir, "isolation_forest_model.pkl"))
    
    # 5. Save Feature & Model Metadata
    feature_importances = {
        name: float(round(imp, 4))
        for name, imp in zip(all_feature_names, xgb_model.feature_importances_)
    }
    
    # Sort top features by importance
    sorted_importances = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)
    
    metadata = {
        "model_version": MODEL_VERSION,
        "dataset_version": DATASET_VERSION,
        "random_seed": RANDOM_SEED,
        "training_timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "model_type_risk": "XGBClassifier",
        "model_type_anomaly": "IsolationForest",
        "numerical_features": NUMERICAL_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "anomaly_features": ANOMALY_FEATURE_NAMES,
        "all_transformed_features": all_feature_names,
        "top_feature_importances": dict(sorted_importances[:10]),
        "feature_descriptions": FEATURE_DOCS,
        "label_mapping": {
            "0": "LOW_RISK",
            "1": "HIGH_RISK"
        },
        "disclaimer": "Synthetic Demonstration Model — Prototype model, not clinically validated."
    }
    
    metadata_path = os.path.join(models_dir, "feature_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Artifacts successfully saved to {models_dir}/:")
    print(f"  - preprocessor.pkl")
    print(f"  - resistance_risk_model.pkl")
    print(f"  - isolation_forest_model.pkl")
    print(f"  - feature_metadata.json")
    print(f"Top 5 most influential features in risk model:")
    for name, imp in sorted_importances[:5]:
        print(f"  * {name}: {imp:.4f}")

if __name__ == "__main__":
    train_and_export_models()
