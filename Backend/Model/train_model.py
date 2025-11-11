# backend/model/train_model.py

import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

# 1. Dataset load karo
df = pd.read_csv(r"D:\CropRecommendation\Dataset\Crop_recommendation.csv")


# 2. Features (X) aur Target (y) split karo
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# 3. Train-test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Model train karo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Model ko save karo (.pkl file)
# 5. Model ko save karo (.pkl file) Model folder ke andar
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_model.pkl")

with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

print(f"✅ Model trained successfully and saved at: {MODEL_PATH}")

print("✅ Model trained successfully and saved as crop_model.pkl")
