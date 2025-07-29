import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import shap
import os

# Download and load the dataset
df = pd.read_excel('backend\model\default of credit card clients.xls', header=1)

# Preprocessing
df = df.rename(columns=lambda x: x.strip())
df = df.dropna()
X = df.drop(['ID', 'default payment next month'], axis=1)
y = df['default payment next month']

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

feature_names = list(X.columns)
joblib.dump(feature_names, 'backend/model/feature_names.pkl')

# Save model, scaler, and SHAP explainer
os.makedirs('backend/model', exist_ok=True)
joblib.dump(clf, 'backend/model/credit_model.pkl')
joblib.dump(scaler, 'backend/model/scaler.pkl')

# SHAP for feature importance
explainer = shap.TreeExplainer(clf)
joblib.dump(explainer, 'backend/model/explainer.pkl')

print("Model, scaler, and explainer saved in backend/model/")