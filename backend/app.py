from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_bundle = joblib.load("best_clf.pkl")
model = model_bundle["model"]
feature_order = model_bundle["features"]
print(feature_order)


@app.route("/predict-risk", methods=["POST"])
def predict_risk():
    try:
        data = request.json
        step = data.get("step")
        inputs = data.get("inputs", {})

        input_dict = {feature: 0 for feature in feature_order}

        # Gender (M/F)
        input_dict['age_at_admission'] = inputs.get("age", "")
        gender_val = inputs.get("gender", "")
        if gender_val=="M":
            input_dict[f"gender_M"] = 1
        else:
            input_dict[f"gender_M"] = 0
        
        if step>1:
            adm_type = inputs.get("admission_type", "")
            if adm_type!="Elective":
                input_dict[f"admission_type_{adm_type}"] = 1
            input_dict['total_diagnoses'] = inputs.get("total_diagnoses", "")
            prev_adm = inputs.get("no_prev_adm", "")
            length_of_stay = inputs.get("length_of_stay", "")
            input_dict['chronicity_index'] = prev_adm * length_of_stay
            input_dict['days_since_last_adm'] = inputs.get("days_since_last_adm", "")

            if step>2:
                input_dict['total_procedures'] = inputs.get("total_procedures", "")
                input_dict['total_lab_tests'] = inputs.get("total_lab_tests", "")
                input_dict['unique_lab_tests'] = inputs.get("unique_lab_tests", "")

                if step>3:
                    input_dict['drg_mortality'] = inputs.get("drg_mortality", "")
                    input_dict['drg_severity'] = inputs.get("drg_severity", "")
                    input_dict['criticality_score'] = input_dict['drg_mortality'] * input_dict['drg_severity']


                    if step>4:
                        discharge_location = inputs.get("discharge_location", "")
                        insurance = inputs.get("insurance", "")
                        if discharge_location!="Disc-tran_Cancer" or insurance!="Government":
                            input_dict[f"discharge_location_{discharge_location}"] = 1
                            input_dict[f"insurance_{insurance}"] = 1
                    

        print(input_dict)
        X = np.array([[input_dict.get(feature, 0) for feature in feature_order]])
        # === Predict ===
        risk_score = (model.predict_proba(X)[0][1])*100
        print(risk_score)
        return jsonify({
            "step": step,
            "risk_score": round(risk_score, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
