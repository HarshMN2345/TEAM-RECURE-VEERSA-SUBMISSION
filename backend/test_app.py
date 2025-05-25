import unittest
import json
from app import app

class FlaskAppTests(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_predict_risk_step_1(self):
        payload = {
            "step": 1,
            "inputs": {
                "age": 50,
                "gender": "M"
            }
        }
        response = self.app.post('/predict-risk',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertIn("step", data)
        self.assertIn("risk_score", data)
        self.assertEqual(data["step"], 1)

    def test_predict_risk_full_payload(self):
        payload = {
            "step": 5,
            "inputs": {
                "age": 65,
                "gender": "F",
                "admission_type": "Emergency",
                "total_diagnoses": 5,
                "no_prev_adm": 2,
                "length_of_stay": 7,
                "days_since_last_adm": 30,
                "total_procedures": 3,
                "total_lab_tests": 10,
                "unique_lab_tests": 5,
                "drg_mortality": 0.1,
                "drg_severity": 0.5,
                "discharge_location": "Home",
                "insurance": "Private"
            }
        }
        response = self.app.post('/predict-risk',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertIn("step", data)
        self.assertIn("risk_score", data)
        self.assertEqual(data["step"], 5)

    def test_predict_risk_invalid_payload(self):
        payload = {
            "step": 1,
            "inputs": {} # Missing required 'age' and 'gender'
        }
        response = self.app.post('/predict-risk',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        # Expecting an error due to missing/invalid data leading to issues in processing
        # or potentially a default value behavior in the app not explicitly defined
        # For now, let's check if it returns an error or a 200 with potentially default/zero values
        # Based on current app.py, it will likely try to process and might error or use defaults.
        # If it errors out due to .get("age", "") returning "" which can't be used in calculations directly
        # or if gender is not "M", it defaults to gender_M = 0, which is fine.
        # The key issue would be operations like `prev_adm * length_of_stay` if values are strings.
        # Let's assume it should gracefully handle and return a 500 if types are not right.
        # The current app.py doesn't have explicit type checking/conversion for all inputs.
        # For example, int(inputs.get("age","")) would be better.
        # Given `input_dict['age_at_admission'] = inputs.get("age", "")`, if age is "", this will cause issues later.
        # Let's assert for a 500 due to potential type errors with empty strings.
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.get_data(as_text=True))
        self.assertIn("error", data)


if __name__ == '__main__':
    unittest.main() 