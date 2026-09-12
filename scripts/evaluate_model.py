#!/usr/bin/env python3
"""
RESISTRA AI — Model Evaluation Script
Evaluates the trained models on the held-out test split.
Calculates Accuracy, Precision, Recall, F1 Score, and ROC-AUC.
Saves genuine evaluation metrics to models/evaluation_metrics.json.

IMPORTANT:
Never hard-code metrics.
Never invent performance numbers.
All metrics are derived strictly from the held-out test dataset.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from features import (
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    ANOMALY_FEATURE_NAMES,
    add_derived_features,
    get_anomaly_features
)

def evaluate_models(test_data_path="data/test_split.csv", models_dir="models"):
    print("=================================================================")
    print("       RESISTRA AI — PROTOTYPE MODEL EVALUATION REPORT           ")
    print("=================================================================")
    print("Status: Evaluating held-out test split...")
    
    if not os.path.exists(test_data_path):
        raise FileNotFoundError(f"Test split not found at {test_data_path}. Run train_models.py first.")
        
    test_df = pd.read_csv(test_data_path)
    test_df = add_derived_features(test_df)
    
    X_test = test_df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES]
    y_test = test_df['target_risk'].astype(int)
    
    # Load model artifacts
    preprocessor = joblib.load(os.path.join(models_dir, "preprocessor.pkl"))
    xgb_model = joblib.load(os.path.join(models_dir, "resistance_risk_model.pkl"))
    iso_model = joblib.load(os.path.join(models_dir, "isolation_forest_model.pkl"))
    
    # -------------------------------------------------------------
    # 1. EVALUATE MODEL 1: XGBoost Resistance Risk Classifier
    # -------------------------------------------------------------
    X_test_trans = preprocessor.transform(X_test)
    y_pred = xgb_model.predict(X_test_trans)
    y_prob = xgb_model.predict_proba(X_test_trans)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_prob))
    
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    # -------------------------------------------------------------
    # 2. EVALUATE MODEL 2: Isolation Forest Anomaly Detector
    # -------------------------------------------------------------
    X_test_anomaly = get_anomaly_features(test_df)
    iso_scores = iso_model.decision_function(X_test_anomaly)
    iso_preds = iso_model.predict(X_test_anomaly) # -1 = anomaly, 1 = normal
    
    # Transform raw decision score to 0 - 100 anomaly scale
    # Lower decision function means higher anomaly
    norm_scores = np.clip((0.25 - iso_scores) / 0.5 * 100, 0, 100)
    anomaly_flagged_count = int(np.sum(iso_preds == -1))
    anomaly_flagged_pct = float(round((anomaly_flagged_count / len(X_test_anomaly)) * 100, 1))
    
    # -------------------------------------------------------------
    # 3. VERIFY WITH TEST SCENARIO: E. coli x Ciprofloxacin
    # -------------------------------------------------------------
    # Baseline: 31%, Current: 48% (+17 pp), rolling_mean: 31.0, rolling_std: 1.2,
    # trend_slope: 5.6, facility_count: 4, reporting_volume: 1800, threshold_dist: +8.0
    test_scenario_row = pd.DataFrame([{
        'organism': 'Escherichia coli',
        'antibiotic': 'Ciprofloxacin',
        'facility': 'North Suburbs Health Zone',
        'region': 'Metro North',
        'tested_isolates': 450,
        'resistance_rate': 48.0,
        'previous_resistance_rate': 31.0,
        'resistance_change': 17.0,
        'rolling_mean': 31.0,
        'rolling_std': 1.2,
        'trend_slope': 5.67,
        'facility_count': 4,
        'reporting_volume': 1800,
        'threshold_distance': 8.0
    }])
    test_scenario_row = add_derived_features(test_scenario_row)
    
    scenario_trans = preprocessor.transform(test_scenario_row[NUMERICAL_FEATURES + CATEGORICAL_FEATURES])
    scenario_pred = int(xgb_model.predict(scenario_trans)[0])
    scenario_prob = float(round(xgb_model.predict_proba(scenario_trans)[0][1], 4))
    
    scenario_anomaly_feat = get_anomaly_features(test_scenario_row)
    scenario_iso_score = float(iso_model.decision_function(scenario_anomaly_feat)[0])
    scenario_norm_anomaly = float(round(np.clip((0.25 - scenario_iso_score) / 0.5 * 100, 0, 100), 1))
    scenario_is_anomaly = bool(scenario_norm_anomaly > 60.0)
    
    # Compile complete metrics package
    metrics_payload = {
        "dataset_metadata": {
            "test_set_size": len(test_df),
            "test_positive_ratio": float(round(np.mean(y_test), 4)),
            "evaluation_timestamp": pd.Timestamp.now().isoformat()
        },
        "classification_metrics": {
            "model_name": "XGBoost Classifier",
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            }
        },
        "anomaly_detection_metrics": {
            "model_name": "Isolation Forest",
            "test_anomaly_rate_percent": anomaly_flagged_pct,
            "mean_anomaly_score": round(float(np.mean(norm_scores)), 2),
            "median_anomaly_score": round(float(np.median(norm_scores)), 2),
            "p95_anomaly_score": round(float(np.percentile(norm_scores, 95)), 2)
        },
        "demo_scenario_verification": {
            "organism": "Escherichia coli",
            "antibiotic": "Ciprofloxacin",
            "prevalence_shift": "31% -> 48% (+17 percentage points)",
            "model_predicted_risk": "HIGH_RISK" if scenario_pred == 1 else "LOW_RISK",
            "model_risk_probability": scenario_prob,
            "anomaly_detected": scenario_is_anomaly,
            "anomaly_score": scenario_norm_anomaly
        },
        "disclaimer": "Synthetic Demonstration Model — Evaluated on held-out synthetic test set. Not clinically validated."
    }
    
    out_path = os.path.join(models_dir, "evaluation_metrics.json")
    with open(out_path, "w") as f:
        json.dump(metrics_payload, f, indent=2)
        
    # Terminal Display
    print(f"\n--- Model 1: XGBoost Classification Metrics (Test n={len(test_df)}) ---")
    print(f"  * Accuracy:   {acc * 100:.2f}%")
    print(f"  * Precision:  {prec * 100:.2f}%")
    print(f"  * Recall:     {rec * 100:.2f}%")
    print(f"  * F1 Score:   {f1 * 100:.2f}%")
    print(f"  * ROC-AUC:    {roc_auc:.4f}")
    print(f"  * Confusion Matrix: TN={cm[0][0]}, FP={cm[0][1]}, FN={cm[1][0]}, TP={cm[1][1]}")
    
    print(f"\n--- Model 2: Isolation Forest Anomaly Detection ---")
    print(f"  * Flagged Anomalies in Test Set: {anomaly_flagged_pct}%")
    print(f"  * Mean Score:   {np.mean(norm_scores):.1f}/100")
    print(f"  * 95th Pct:     {np.percentile(norm_scores, 95):.1f}/100")
    
    print(f"\n--- Demo Scenario Verification (E. coli x Ciprofloxacin 31% -> 48%) ---")
    print(f"  * Predicted Risk:        {'HIGH_RISK' if scenario_pred == 1 else 'LOW_RISK'}")
    print(f"  * Risk Probability:      {scenario_prob * 100:.2f}%")
    print(f"  * Anomaly Flag:          {scenario_is_anomaly} (Score: {scenario_norm_anomaly}/100)")
    
    print(f"\nSaved evaluation metrics to {out_path}")
    print("=================================================================\n")
    return metrics_payload

if __name__ == "__main__":
    evaluate_models()
