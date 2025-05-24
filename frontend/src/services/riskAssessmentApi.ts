export interface RiskAssessmentInput {
  age: string;
  gender: string;
  admissionType: string;
  totalDiagnoses: string;
  numberOfPreviousAdmissions: string;
  lengthOfStay: string;
  daysSinceLastAdmission: string;
  totalProcedures: string;
  totalLabTests: string;
  uniqueLabTests: string;
  drgMortalityRisk: string;
  drgSeverity: string;
  dischargeType: string;
  insurance: string;
}

export interface RiskAssessmentResponse {
  step: number;
  risk_score: number;
}

export interface RiskAssessmentError {
  error: string;
  suggestion?: string;
}

// Base API URL - adjust this to match your Flask server
const API_BASE_URL = 'https://c0ea-103-46-200-236.ngrok-free.app';

// Map frontend field names to backend field names
const mapFormDataToApiInputs = (formData: RiskAssessmentInput) => {
  return {
    age: parseInt(formData.age) || 0,
    gender: formData.gender,
    admission_type: formData.admissionType,
    total_diagnoses: parseInt(formData.totalDiagnoses) || 0,
    no_prev_adm: parseInt(formData.numberOfPreviousAdmissions) || 0,
    length_of_stay: parseInt(formData.lengthOfStay) || 0,
    days_since_last_adm: parseInt(formData.daysSinceLastAdmission) || 0,
    total_procedures: parseInt(formData.totalProcedures) || 0,
    total_lab_tests: parseInt(formData.totalLabTests) || 0,
    unique_lab_tests: parseInt(formData.uniqueLabTests) || 0,
    drg_mortality: parseFloat(formData.drgMortalityRisk) || 0,
    drg_severity: parseFloat(formData.drgSeverity) || 0,
    discharge_location: formData.dischargeType,
    insurance: formData.insurance
  };
};

export const predictRisk = async (
  step: number, 
  formData: RiskAssessmentInput
): Promise<RiskAssessmentResponse> => {
  try {
    const apiInputs = mapFormDataToApiInputs(formData);
    
    const response = await fetch(`${API_BASE_URL}/predict-risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        step: step,
        inputs: apiInputs
      })
    });

    if (!response.ok) {
      const errorData: RiskAssessmentError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: RiskAssessmentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Risk assessment API error:', error);
    throw error;
  }
};

// Test API connection
export const testApiConnection = async (): Promise<boolean> => {
  try {
    const testData: RiskAssessmentInput = {
      age: "65",
      gender: "M",
      admissionType: "Emergency",
      totalDiagnoses: "3",
      numberOfPreviousAdmissions: "2",
      lengthOfStay: "5",
      daysSinceLastAdmission: "30",
      totalProcedures: "8",
      totalLabTests: "15",
      uniqueLabTests: "12",
      drgMortalityRisk: "0.8",
      drgSeverity: "2.5",
      dischargeType: "Home",
      insurance: "Medicare"
    };

    await predictRisk(5, testData);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}; 