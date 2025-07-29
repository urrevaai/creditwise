import joblib
import numpy as np
import os
import pandas as pd

# Load model, scaler, and explainer only once (for efficiency)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/credit_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../model/scaler.pkl')
EXPLAINER_PATH = os.path.join(os.path.dirname(__file__), '../model/explainer.pkl')

clf = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
explainer = joblib.load(EXPLAINER_PATH)

FEATURE_NAMES_PATH = os.path.join(os.path.dirname(__file__), '../model/feature_names.pkl')
feature_names = joblib.load(FEATURE_NAMES_PATH)

def risk_label(prob):
    if prob < 0.33:
        return "Low"
    elif prob < 0.66:
        return "Medium"
    else:
        return "High"

def predict_single(data_dict):
    # Create a DataFrame with a single row and correct columns
    X = pd.DataFrame([data_dict], columns=feature_names)
    X_scaled = scaler.transform(X)
    proba = clf.predict_proba(X_scaled)[0][1]  # Probability of default
    label = risk_label(proba)
    shap_values = explainer.shap_values(X_scaled)
    # Handle SHAP output shape for binary classification
    if isinstance(shap_values, list) and len(shap_values) == 2:
        shap_arr = shap_values[1][0]
    else:
        shap_arr = shap_values[0]
    def to_float(val):
        if hasattr(val, "flatten"):
            return float(val.flatten()[0])
        return float(val)
    feature_importance = {k: to_float(v) for k, v in zip(feature_names, shap_arr)}
    return {
        "risk": label,
        "probability": float(proba),
        "feature_importance": feature_importance
    }