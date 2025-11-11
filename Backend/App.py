from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load model
model_path = os.path.join(os.path.dirname(__file__), "Model", "crop_model.pkl")
model = pickle.load(open(model_path, "rb"))

@app.route('/')
def home():
    return jsonify({"message": "Crop Prediction API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        features = np.array([[  
            float(data['N']),
            float(data['P']),
            float(data['K']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]])

        # Get probability for each crop
        proba = model.predict_proba(features)[0]
        classes = model.classes_

        # Top 3 crops (highest probability)
        top3_idx = np.argsort(proba)[-3:][::-1]
        prediction = [classes[i] for i in top3_idx]

        return jsonify({"prediction": prediction})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)