from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import sklearn
from model_loader import load_model_with_compatibility

app = Flask(__name__)
CORS(app)

print(f"Scikit-learn version: {sklearn.__version__}")

# Use the compatibility loader
model, feature_order = load_model_with_compatibility("best_clf.pkl")

@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        if model is None:
            return jsonify({
                "error": "Model not loaded. Please check scikit-learn version compatibility.",
                "suggestion": "Run: pip install --upgrade scikit-learn"
            }), 500

        data = request.json
        print("data",data)
        step = data.get("step")
        inputs = data.get("inputs", {})

        input_dict = {feature: 0 for feature in feature_order}

        # Gender (M/F)
        input_dict['age_at_admission'] = inputs.get("age", 0)
        gender_val = inputs.get("gender", "")
        if gender_val=="M":
            input_dict[f"gender_M"] = 1
        else:
            input_dict[f"gender_M"] = 0
        
        if step>1:
            adm_type = inputs.get("admission_type", "")
            input_dict[f"admission_type_{adm_type}"] = 1
            input_dict['total_diagnoses'] = inputs.get("total_diagnoses", 0)
            prev_adm = inputs.get("no_prev_adm", 0)
            length_of_stay = inputs.get("length_of_stay", 0)
            input_dict['chronicity_index'] = prev_adm * length_of_stay
            input_dict['days_since_last_adm'] = inputs.get("days_since_last_adm", 0)

            if step>2:
                input_dict['total_procedures'] = inputs.get("total_procedures", 0)
                input_dict['total_lab_tests'] = inputs.get("total_lab_tests", 0)
                input_dict['unique_lab_tests'] = inputs.get("unique_lab_tests", 0)

                if step>3:
                    input_dict['drg_mortality'] = inputs.get("drg_mortality", 0)
                    input_dict['drg_severity'] = inputs.get("drg_severity", 0)
                    input_dict['criticality_score'] = input_dict['drg_mortality'] * input_dict['drg_severity']


                    if step>4:
                        discharge_location = inputs.get("discharge_location", "")
                        insurance = inputs.get("insurance", "")
                        input_dict[f"discharge_location_{discharge_location}"] = 1
                        input_dict[f"insurance_{insurance}"] = 1
                    


        X = np.array([[input_dict.get(feature, 0) for feature in feature_order]])
        print(X)
        
        # === Predict ===
        risk_score = (model.predict_proba(X)[0][1])*100

        return jsonify({
            "step": step,
            "risk_score": round(risk_score, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
