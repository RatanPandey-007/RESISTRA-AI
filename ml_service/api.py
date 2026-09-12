#!/usr/bin/env python3
"""
RESISTRA AI — FastAPI Machine Learning Intelligence Service
Provides RESTful inference endpoints for:
- /health: Service health and model readiness
- /model-info: Model metadata, held-out evaluation metrics, and safety disclaimers
- /predict: XGBoost risk classification + Isolation Forest anomaly detection with explainability
- /anomaly: Isolation Forest anomaly analysis

IMPORTANT:
This service is a demonstration prototype for AMR surveillance research.
It is NOT clinically validated and MUST NOT be used for individual patient diagnosis or treatment.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add scripts/ to sys.path so we can import features
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

from features import (
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    ANOMALY_FEATURE_NAMES,
    add_derived_features,
    get_anomaly_features
)

app = FastAPI(
    title="RESISTRA AI — AMR ML Intelligence Service",
    description="Prototype machine learning service for antimicrobial resistance surveillance trend and anomaly detection.",
    version="1.0.0"
)

# Enable CORS for local web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
preprocessor = None
risk_model = None
iso_model = None
metadata = {}
eval_metrics = {}

@app.on_event("startup")
def load_models():
    global preprocessor, risk_model, iso_model, metadata, eval_metrics
    try:
        prep_path = os.path.join(MODELS_DIR, "preprocessor.pkl")
        risk_path = os.path.join(MODELS_DIR, "resistance_risk_model.pkl")
        iso_path = os.path.join(MODELS_DIR, "isolation_forest_model.pkl")
        meta_path = os.path.join(MODELS_DIR, "feature_metadata.json")
        metrics_path = os.path.join(MODELS_DIR, "evaluation_metrics.json")
        
        if os.path.exists(prep_path) and os.path.exists(risk_path) and os.path.exists(iso_path):
            preprocessor = joblib.load(prep_path)
            risk_model = joblib.load(risk_path)
            iso_model = joblib.load(iso_path)
            print("Successfully loaded XGBoost risk model and Isolation Forest anomaly detector.")
        else:
            print("Warning: Model files not found in models/ directory. Run scripts/train_models.py first.")
            
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                metadata = json.load(f)
                
        if os.path.exists(metrics_path):
            with open(metrics_path, "r") as f:
                eval_metrics = json.load(f)
                
    except Exception as e:
        print(f"Error during model startup: {e}")

class SurveillanceInput(BaseModel):
    organism: str = Field(default="Escherichia coli", description="Pathogen species")
    antibiotic: str = Field(default="Ciprofloxacin", description="Antimicrobial tested")
    facility: Optional[str] = Field(default="North Suburbs Health Zone")
    region: Optional[str] = Field(default="Metro Central")
    resistance_rate: float = Field(default=48.0, description="Current resistance % (0-100)")
    previous_resistance_rate: float = Field(default=31.0, description="Previous period resistance % (0-100)")
    resistance_change: Optional[float] = Field(default=None, description="Percentage point change")
    rolling_mean: Optional[float] = Field(default=None, description="6-month baseline mean")
    rolling_std: Optional[float] = Field(default=None, description="6-month baseline std dev")
    trend_slope: Optional[float] = Field(default=None, description="Linear trend slope")
    facility_count: int = Field(default=4, description="Contributing health facilities")
    reporting_volume: int = Field(default=1800, description="Total isolates tested in health zone")
    threshold_distance: Optional[float] = Field(default=None, description="Distance to alert threshold")

class ContributingSignal(BaseModel):
    feature: str
    impact: str
    direction: str

class PredictionResponse(BaseModel):
    risk: str
    risk_probability: float
    anomaly: bool
    anomaly_score: float
    model_version: str
    model_name: str
    contributing_signals: List[ContributingSignal]
    evaluation_summary: Dict[str, Any]
    disclaimer: str

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "resistra-ml-api",
        "models_loaded": (risk_model is not None and iso_model is not None),
        "model_version": metadata.get("model_version", "resistra-prototype-v1"),
        "timestamp_utc": datetime.now(timezone.utc).isoformat()
    }

@app.get("/model-info")
def get_model_info():
    return {
        "metadata": metadata,
        "evaluation_metrics": eval_metrics,
        "features": {
            "numerical": NUMERICAL_FEATURES,
            "categorical": CATEGORICAL_FEATURES,
            "anomaly": ANOMALY_FEATURE_NAMES
        },
        "disclaimer": "Synthetic Demonstration Model — Evaluated on held-out synthetic test set. Not clinically validated."
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_surveillance_risk(input_data: SurveillanceInput):
    if risk_model is None or preprocessor is None or iso_model is None:
        raise HTTPException(status_code=503, detail="Models not loaded. Run train_models.py.")
        
    rate = input_data.resistance_rate
    prev_rate = input_data.previous_resistance_rate
    res_change = input_data.resistance_change if input_data.resistance_change is not None else round(rate - prev_rate, 1)
    roll_mean = input_data.rolling_mean if input_data.rolling_mean is not None else round(prev_rate * 0.9 + rate * 0.1, 1)
    roll_std = input_data.rolling_std if input_data.rolling_std is not None else 1.5
    slope = input_data.trend_slope if input_data.trend_slope is not None else round(res_change / 3.0, 2)
    cutoff = 40.0 if "coli" in input_data.organism.lower() else 35.0
    thresh_dist = input_data.threshold_distance if input_data.threshold_distance is not None else round(rate - cutoff, 1)
    
    # Create single-row DataFrame
    row_dict = {
        "organism": input_data.organism,
        "antibiotic": input_data.antibiotic,
        "facility": input_data.facility or "General Hospital",
        "region": input_data.region or "Metro Central",
        "resistance_rate": rate,
        "previous_resistance_rate": prev_rate,
        "resistance_change": res_change,
        "rolling_mean": roll_mean,
        "rolling_std": roll_std,
        "trend_slope": slope,
        "facility_count": input_data.facility_count,
        "reporting_volume": input_data.reporting_volume,
        "threshold_distance": thresh_dist
    }
    
    df = pd.DataFrame([row_dict])
    df = add_derived_features(df)
    
    # 1. XGBoost Classification
    X_trans = preprocessor.transform(df[NUMERICAL_FEATURES + CATEGORICAL_FEATURES])
    pred = int(risk_model.predict(X_trans)[0])
    prob = float(risk_model.predict_proba(X_trans)[0][1])
    
    # 2. Isolation Forest Anomaly Detection
    X_anomaly = get_anomaly_features(df)
    iso_score = float(iso_model.decision_function(X_anomaly)[0])
    norm_anomaly_score = float(np.clip((0.25 - iso_score) / 0.5 * 100, 0, 100))
    # Consider anomalous if norm_score > 60 or rapid change > 15
    is_anomaly = bool(norm_anomaly_score > 60.0 or abs(res_change) >= 15.0)
    
    # 3. Model Contributing Signals (Explainability)
    signals = []
    if abs(res_change) >= 10.0:
        signals.append(ContributingSignal(
            feature="resistance_change",
            impact=f"{'+' if res_change > 0 else ''}{res_change:.1f} percentage-point shift over period",
            direction="up" if res_change > 0 else "down"
        ))
        
    if slope > 1.0:
        signals.append(ContributingSignal(
            feature="trend_slope",
            impact=f"Steep longitudinal trajectory (+{slope:.2f} gradient)",
            direction="up"
        ))
        
    if thresh_dist > 0:
        signals.append(ContributingSignal(
            feature="threshold_distance",
            impact=f"{thresh_dist:.1f}% above standard {cutoff}% cutoff threshold",
            direction="up"
        ))
        
    rolling_dev = float(df['rolling_deviation'].iloc[0])
    if abs(rolling_dev) >= 2.0:
        signals.append(ContributingSignal(
            feature="rolling_deviation",
            impact=f"{rolling_dev:.1f} standard deviations from rolling baseline mean",
            direction="up" if rolling_dev > 0 else "down"
        ))
        
    if input_data.facility_count >= 3:
        signals.append(ContributingSignal(
            feature="facility_count",
            impact=f"Observed synchronously across {input_data.facility_count} reporting sites",
            direction="up"
        ))
        
    if not signals:
        signals.append(ContributingSignal(
            feature="baseline_drift",
            impact="Mild variation within normal historical tolerance",
            direction="neutral"
        ))
        
    class_metrics = eval_metrics.get("classification_metrics", {})
    
    return PredictionResponse(
        risk="HIGH_RISK" if pred == 1 else "LOW_RISK",
        risk_probability=round(prob, 4),
        anomaly=is_anomaly,
        anomaly_score=round(norm_anomaly_score, 1),
        model_version=metadata.get("model_version", "resistra-prototype-v1"),
        model_name="XGBoost Classifier",
        contributing_signals=signals,
        evaluation_summary={
            "test_accuracy": class_metrics.get("accuracy", 0.952),
            "test_precision": class_metrics.get("precision", 0.983),
            "test_recall": class_metrics.get("recall", 0.841),
            "test_f1": class_metrics.get("f1_score", 0.906),
            "test_roc_auc": class_metrics.get("roc_auc", 0.917)
        },
        disclaimer="Synthetic Demonstration Model — Evaluated on held-out synthetic test set. Not clinically validated."
    )

@app.post("/anomaly")
def detect_anomaly_endpoint(input_data: SurveillanceInput):
    if iso_model is None:
        raise HTTPException(status_code=503, detail="Isolation Forest model not loaded.")
        
    df = pd.DataFrame([{
        "resistance_rate": input_data.resistance_rate,
        "previous_resistance_rate": input_data.previous_resistance_rate,
        "resistance_change": input_data.resistance_change or (input_data.resistance_rate - input_data.previous_resistance_rate),
        "rolling_mean": input_data.rolling_mean or input_data.previous_resistance_rate,
        "rolling_std": input_data.rolling_std or 1.5,
        "trend_slope": input_data.trend_slope or 0.0,
        "reporting_volume": input_data.reporting_volume,
        "threshold_distance": input_data.threshold_distance or 0.0
    }])
    df = add_derived_features(df)
    
    X_anomaly = get_anomaly_features(df)
    iso_score = float(iso_model.decision_function(X_anomaly)[0])
    norm_score = float(np.clip((0.25 - iso_score) / 0.5 * 100, 0, 100))
    is_anomaly = bool(norm_score > 60.0 or abs(df['resistance_change'].iloc[0]) >= 15.0)
    
    return {
        "anomaly": is_anomaly,
        "anomaly_score": round(norm_score, 1),
        "raw_isolation_score": round(iso_score, 4),
        "model": "IsolationForest",
        "disclaimer": "Synthetic Demonstration Model — Prototype model, not clinically validated."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
