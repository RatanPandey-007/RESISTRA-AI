#!/usr/bin/env python3
"""
RESISTRA AI — Python Isolation Forest Anomaly Detection Model
Scikit-learn Isolation Forest algorithm for AMR surveillance trend analysis.
"""

import sys
import json
import numpy as np
from sklearn.ensemble import IsolationForest

def train_and_predict(features_list):
    """
    Features vector per observation:
    [0]: current_rate (0-100)
    [1]: previous_rate (0-100)
    [2]: absolute_change (percentage points)
    [3]: rolling_mean (0-100)
    [4]: rolling_std (0-50)
    [5]: consecutive_increases (int >= 0)
    [6]: sample_volume (int > 0)
    """
    X = np.array(features_list)
    
    if len(X) == 0:
        return []

    # Initialize Isolation Forest with contamination=0.15 for surveillance spike detection
    model = IsolationForest(
        n_estimators=100,
        contamination=0.15,
        random_state=42
    )
    
    model.fit(X)
    
    # decision_function returns lower scores for anomalies
    scores = model.decision_function(X)
    predictions = model.predict(X) # -1 for anomaly, 1 for normal
    
    results = []
    for i, (pred, score) in enumerate(zip(predictions, scores)):
        # Normalize score to 0 - 100 anomaly scale where 100 is highly anomalous
        # decision_function ranges roughly from -0.3 to 0.3
        normalized_anomaly_score = float(np.clip((0.3 - score) / 0.6 * 100, 0, 100))
        is_anomaly = bool(pred == -1 or normalized_anomaly_score > 65.0)
        
        results.append({
            "index": i,
            "is_anomaly": is_anomaly,
            "anomaly_score": round(normalized_anomaly_score, 1),
            "isolation_score": float(round(score, 4)),
            "model": "PYTHON_ISOLATION_FOREST_SKLEARN"
        })
        
    return results

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        # Test sample features:
        # 1. Normal baseline (30%, prev 29%, change +1, mean 30, std 1, consec 0, vol 1000)
        # 2. Critical Spike (48%, prev 31%, change +17, mean 33, std 4, consec 3, vol 3500)
        sample = [
            [30.0, 29.0, 1.0, 30.0, 1.2, 0, 1000],
            [48.0, 31.0, 17.0, 33.5, 4.8, 3, 3500],
            [22.0, 11.5, 10.5, 13.0, 2.5, 2, 1800],
            [42.0, 43.0, -1.0, 42.5, 0.8, 0, 4000]
        ]
        out = train_and_predict(sample)
        print(json.dumps(out, indent=2))
    elif not sys.stdin.isatty():
        input_data = json.load(sys.stdin)
        out = train_and_predict(input_data)
        print(json.dumps(out))
    else:
        print("Usage: python anomaly_detector.py [--test]")
