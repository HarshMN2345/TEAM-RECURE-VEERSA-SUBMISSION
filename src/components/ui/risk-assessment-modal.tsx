"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, User, Heart, Activity, AlertTriangle, Calendar, ChevronRight, Check, Loader2 } from "lucide-react";
import { predictRisk, testApiConnection, RiskAssessmentInput } from "../../services/riskAssessmentApi";

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RiskAssessmentModal({ isOpen, onClose }: RiskAssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RiskAssessmentInput>({
    age: "",
    gender: "M",
    admissionType: "Urgent",
    totalDiagnoses: "",
    numberOfPreviousAdmissions: "",
    lengthOfStay: "",
    daysSinceLastAdmission: "",
    totalProcedures: "",
    totalLabTests: "",
    uniqueLabTests: "",
    drgMortalityRisk: "0",
    drgSeverity: "0",
    dischargeType: "Home",
    insurance: "Self pay"
  });

  const [riskScore, setRiskScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [ageError, setAgeError] = useState<string | null>(null);
  const [previousAdmissionsError, setPreviousAdmissionsError] = useState<string | null>(null);
  const [lengthOfStayError, setLengthOfStayError] = useState<string | null>(null);
  const [daysSinceLastAdmissionError, setDaysSinceLastAdmissionError] = useState<string | null>(null);
  const [totalProceduresError, setTotalProceduresError] = useState<string | null>(null);
  const [totalLabTestsError, setTotalLabTestsError] = useState<string | null>(null);
  const [uniqueLabTestsError, setUniqueLabTestsError] = useState<string | null>(null);

  // Test API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const connected = await testApiConnection();
        setIsApiConnected(connected);
        if (!connected) {
          setApiError("Unable to connect to risk assessment API. Please ensure the backend server is running.");
        }
      } catch (error) {
        setIsApiConnected(false);
        setApiError("Failed to connect to API");
      }
    };
    
    if (isOpen) {
      checkApiConnection();
      setIsAssessmentComplete(false);
    }
  }, [isOpen]);

  const steps = [
    { id: 1, title: "Patient Demographics", icon: User, description: "Basic patient information" },
    { id: 2, title: "Clinical History", icon: Heart, description: "Admission type & medical history" },
    { id: 3, title: "Current Admission", icon: Activity, description: "Procedures & lab tests" },
    { id: 4, title: "Severity Assessment", icon: AlertTriangle, description: "DRG risk & severity scores" },
    { id: 5, title: "Discharge Planning", icon: Calendar, description: "Discharge & insurance planning" },
  ];

  const getRiskLevel = (score: number) => {
    if (score < 20) return { 
      level: "Low Risk", 
      color: "text-emerald-600", 
      bgColor: "bg-emerald-50", 
      borderColor: "border-emerald-200",
      gradient: "from-emerald-400 to-emerald-600"
    };
    if (score < 40) return { 
      level: "Moderate Risk", 
      color: "text-amber-600", 
      bgColor: "bg-amber-50", 
      borderColor: "border-amber-200",
      gradient: "from-amber-400 to-orange-600"
    };
    return { 
      level: "High Risk", 
      color: "text-red-600", 
      bgColor: "bg-red-50", 
      borderColor: "border-red-200",
      gradient: "from-red-400 to-red-600"
    };
  };

  const updateRiskScore = async (updatedFormData: RiskAssessmentInput) => {
    if (!isApiConnected) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const response = await predictRisk(currentStep, updatedFormData);
      setRiskScore(response.risk_score);
      console.log(response);
    } catch (error) {
      console.error('Risk prediction error:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to calculate risk score');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RiskAssessmentInput, value: string | boolean) => {
    if (field === "age") {
      const ageNum = parseInt(value as string);
      if (isNaN(ageNum)) {
        setAgeError("Please enter a valid number");
      } else if (ageNum < 0) {
        setAgeError("Age cannot be negative");
        value = "0";
      } else if (ageNum > 150) {
        setAgeError("Age cannot exceed 150");
        value = "150";
      } else {
        setAgeError(null);
      }
    } else if (field === "numberOfPreviousAdmissions") {
      const num = parseInt(value as string);
      if (isNaN(num)) {
        setPreviousAdmissionsError("Please enter a valid number");
      } else if (num < 0) {
        setPreviousAdmissionsError("Number of previous admissions must be greater than or equal to 0");
        value = "0";
      } else {
        setPreviousAdmissionsError(null);
      }
    } else if (field === "lengthOfStay") {
      const num = parseInt(value as string);
      if (isNaN(num)) {
        setLengthOfStayError("Please enter a valid number");
      } else if (num < 0) {
        setLengthOfStayError("Length of stay must be greater than or equal to 0");
        value = "0";
      } else {
        setLengthOfStayError(null);
      }
    } else if (field === "daysSinceLastAdmission") {
      const num = parseInt(value as string);
      if (isNaN(num)) {
        setDaysSinceLastAdmissionError("Please enter a valid number");
      } else if (num < 0) {
        setDaysSinceLastAdmissionError("Days since last admission must be greater than or equal to 0");
        value = "0";
      } else {
        setDaysSinceLastAdmissionError(null);
      }
    } else if (field === "totalProcedures") {
      const num = parseInt(value as string);
      if (isNaN(num)) {
        setTotalProceduresError("Please enter a valid number");
      } else if (num < 0) {
        setTotalProceduresError("Total procedures must be greater than or equal to 0");
        value = "0";
      } else {
        setTotalProceduresError(null);
      }
    } else if (field === "totalLabTests") {
      const num = parseInt(value as string);
      if (isNaN(num)) {
        setTotalLabTestsError("Please enter a valid number");
      } else if (num < 0) {
        setTotalLabTestsError("Total lab tests must be greater than or equal to 0");
        value = "0";
      } else {
        setTotalLabTestsError(null);
      }
    } else if (field === "uniqueLabTests") {
      const num = parseInt(value as string);
      const totalTests = parseInt(formData.totalLabTests) || 0;
      if (isNaN(num)) {
        setUniqueLabTestsError("Please enter a valid number");
      } else if (num < 0) {
        setUniqueLabTestsError("Unique lab tests must be greater than or equal to 0");
        value = "0";
      } else if (num > totalTests) {
        setUniqueLabTestsError("Unique lab tests cannot exceed total lab tests");
        value = totalTests.toString();
      } else {
        setUniqueLabTestsError(null);
      }
    }
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    if (isApiConnected) {
      updateRiskScore(updatedFormData);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Patient Demographics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Basic patient information</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Age at Admission
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                      ageError 
                        ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                        : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                    }`}
                    placeholder="Enter age (0-150)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">years</span>
                  </div>
                </div>
                {ageError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {ageError}
                  </motion.div>
                )}
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  Range: 0-150 years
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange("gender", "M")}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                      formData.gender === "M"
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:border-blue-400"
                        : "border-gray-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("gender", "F")}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-xl transition-all duration-200 ${
                      formData.gender === "F"
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:border-blue-400"
                        : "border-gray-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500"
                    }`}
                  >
                    Female
                  </button>
              </div>
              </div>

              {/* Age Distribution Bar Graph */}
              {formData.age && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 border-2 border-gray-200 rounded-xl dark:border-gray-600"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age Distribution</h4>
                    
                    {/* Gender Indicator */}
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        formData.gender === "M" 
                          ? "bg-blue-500 shadow-lg shadow-blue-500/30" 
                          : "bg-pink-500 shadow-lg shadow-pink-500/30"
                      }`} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {formData.gender === "M" ? "Male" : "Female"}
                      </span>
                    </motion.div>
                  </div>
                  
                  {/* Graph Container */}
                  <div className="relative h-48 mt-6">
                    {/* Y-axis */}
                    <div className="absolute left-12 top-0 h-full w-px bg-gray-200 dark:bg-gray-700">
                      {/* Y-axis labels and grid lines */}
                      {[0, 25, 50, 75, 100].map((value) => (
                        <div key={value} className="absolute w-full" style={{ bottom: `${value}%` }}>
                          <div className="absolute right-4 transform -translate-y-1/2 text-xs text-gray-500">
                            {value}%
                          </div>
                          <div className="absolute left-0 w-2 h-px bg-gray-200 dark:bg-gray-700" />
                          <div className="absolute left-0 w-[calc(100%+24px)] h-px border-t border-dashed border-gray-200 dark:border-gray-700 opacity-50" />
                        </div>
                      ))}
                    </div>

                    {/* X-axis */}
                    <div className="absolute left-12 bottom-0 right-0 h-px bg-gray-200 dark:bg-gray-700">
                      {/* X-axis labels and grid lines */}
                      {[0, 30, 60, 90, 120].map((value) => (
                        <div 
                          key={value} 
                          className="absolute"
                          style={{ left: `${(value / 120) * 100}%` }}
                        >
                          <div className="absolute transform -translate-x-1/2 top-2 text-xs text-gray-500">
                            {value}
                          </div>
                          <div className="absolute transform -translate-x-1/2 -top-2 w-px h-2 bg-gray-200 dark:bg-gray-700" />
                          <div className="absolute transform -translate-x-1/2 bottom-0 w-px h-40 border-l border-dashed border-gray-200 dark:border-gray-700 opacity-50" />
                        </div>
                      ))}
                    </div>

                    {/* Bar */}
                    <div className="absolute left-12 bottom-8 right-4 h-40">
                      <motion.div
                        initial={{ width: 0, height: "40%" }}
                        animate={{ 
                          width: `${(parseInt(formData.age) / 120) * 100}%`,
                          height: "40%"
                        }}
                        transition={{ duration: 0.5 }}
                        className="absolute bottom-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"
                        style={{ 
                          minWidth: '2px',
                          maxWidth: '100%'
                        }}
                      >
                        {/* Value Label */}
                        <div className="absolute -top-6 right-0 transform translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {formData.age} years
                        </div>
                      </motion.div>
                    </div>

                    {/* Axis Labels */}
                    <div className="absolute bottom-0 left-0 transform -rotate-90 -translate-x-8 translate-y-8 text-xs text-gray-500">
                      Percentage
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-xs text-gray-500 mt-4">
                      Age (years)
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 2:
        const chronicityIndex = (parseInt(formData.numberOfPreviousAdmissions) || 0) * (parseInt(formData.lengthOfStay) || 0);
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Clinical History
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Previous admissions and hospital stay information</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Admission Type
                </label>
                <select
                  value={formData.admissionType}
                  onChange={(e) => handleInputChange("admissionType", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Total Diagnoses (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.totalDiagnoses}
                  onChange={(e) => handleInputChange("totalDiagnoses", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Total number of diagnoses"
                />
                 <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  Range: 0-10
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-3">Chronicity Index</h4>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Number of Previous Admissions
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.numberOfPreviousAdmissions}
                    onChange={(e) => handleInputChange("numberOfPreviousAdmissions", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                      previousAdmissionsError 
                        ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                        : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                    }`}
                    placeholder="Number of previous admissions"
                  />
                  {previousAdmissionsError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                      {previousAdmissionsError}
                    </motion.div>
                  )}
                </div>

                <div className="group mt-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Length of Current Stay
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={formData.lengthOfStay}
                      onChange={(e) => handleInputChange("lengthOfStay", e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                        lengthOfStayError 
                          ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                          : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                      }`}
                      placeholder="Duration of stay"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">days</span>
                    </div>
                  </div>
                  {lengthOfStayError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-500 flex items-center"
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                      {lengthOfStayError}
                    </motion.div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Calculated Chronicity Index: <span className="font-semibold text-blue-500">{chronicityIndex}</span>
                </p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Days Since Last Admission
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={formData.daysSinceLastAdmission}
                    onChange={(e) => handleInputChange("daysSinceLastAdmission", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                      daysSinceLastAdmissionError 
                        ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                        : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                    }`}
                    placeholder="Days since last admission"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>
                {daysSinceLastAdmissionError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {daysSinceLastAdmissionError}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        const maxValue = Math.max(
          parseInt(formData.totalProcedures) || 0,
          parseInt(formData.totalLabTests) || 0,
          parseInt(formData.uniqueLabTests) || 0
        );

        // Check if any data has been entered
        const hasData = formData.totalProcedures || formData.totalLabTests || formData.uniqueLabTests;

        // Data points for the curve
        const dataPoints = [
          { label: 'Procedures', value: parseInt(formData.totalProcedures) || 0 },
          { label: 'Total Tests', value: parseInt(formData.totalLabTests) || 0 },
          { label: 'Unique Tests', value: parseInt(formData.uniqueLabTests) || 0 }
        ];

        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Current Admission
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Key clinical measurements and lab values</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Total Procedures
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalProcedures}
                  onChange={(e) => handleInputChange("totalProcedures", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                    totalProceduresError 
                      ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                      : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                  }`}
                  placeholder="Total number of procedures"
                />
                {totalProceduresError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {totalProceduresError}
                  </motion.div>
                )}
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Total Lab Tests
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.totalLabTests}
                  onChange={(e) => handleInputChange("totalLabTests", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                    totalLabTestsError 
                      ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                      : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                  }`}
                  placeholder="Total number of lab tests"
                />
                {totalLabTestsError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {totalLabTestsError}
                  </motion.div>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Unique Lab Tests
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.uniqueLabTests}
                  onChange={(e) => handleInputChange("uniqueLabTests", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 dark:bg-neutral-800 dark:text-white ${
                    uniqueLabTestsError 
                      ? "border-red-300 focus:border-red-500 dark:border-red-800" 
                      : "border-gray-200 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-400"
                  }`}
                  placeholder="Number of unique lab tests"
                />
                {uniqueLabTestsError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 flex items-center"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                    {uniqueLabTestsError}
                  </motion.div>
                )}
              </div>

              {/* Curved Line Graph - Only shows after data entry */}
              {hasData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 border-2 border-gray-200 rounded-xl dark:border-gray-700"
                >
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">Clinical Metrics Trend</h4>
                  
                  <div className="relative h-64">
                    {/* Y-axis */}
                    <div className="absolute left-12 top-0 h-full w-px bg-gray-200 dark:bg-gray-700">
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <div key={percent} className="absolute w-full" style={{ bottom: `${percent}%` }}>
                          <div className="absolute -left-12 transform -translate-y-1/2 text-xs text-gray-500 w-8 text-right">
                            {Math.round((maxValue * percent) / 100)}
                          </div>
                          <div className="absolute left-0 w-2 h-px bg-gray-200 dark:bg-gray-700" />
                          <div className="absolute left-0 w-full h-px border-t border-dashed border-gray-200 dark:border-gray-700 opacity-30" />
                        </div>
                      ))}
                    </div>

                    {/* X-axis */}
                    <div className="absolute left-12 bottom-0 right-0 h-px bg-gray-200 dark:bg-gray-700">
                      {dataPoints.map((point, index) => (
                        <div 
                          key={index}
                          className="absolute transform -translate-x-1/2"
                          style={{ left: `${(index / (dataPoints.length - 1)) * 100}%` }}
                        >
                          <div className="absolute top-2 text-xs text-gray-500 text-center w-20 -ml-10">
                            {point.label}
                          </div>
                          <div className="absolute -top-2 w-px h-2 bg-gray-200 dark:bg-gray-700" />
                        </div>
                      ))}
                    </div>

                    {/* Curved Line */}
                    <div className="absolute left-12 bottom-8 right-4 h-48">
                      <svg className="w-full h-full">
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                          d={`M ${dataPoints.map((point, index) => {
                            const x = (index / (dataPoints.length - 1)) * 100;
                            const y = 100 - ((point.value / maxValue) * 100);
                            return `${x}% ${y}%`;
                          }).join(' C ')}`}
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="drop-shadow-md"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="50%" stopColor="#0EA5E9" />
                            <stop offset="100%" stopColor="#6366F1" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* Data Points */}
                      {dataPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 + (index * 0.1) }}
                          className="absolute w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500 shadow-lg transform -translate-x-2 -translate-y-2"
                          style={{
                            left: `${(index / (dataPoints.length - 1)) * 100}%`,
                            top: `${100 - ((point.value / maxValue) * 100)}%`
                          }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                            {point.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      case 4:
        const criticalityScore = (parseFloat(formData.drgMortalityRisk) || 0) * (parseFloat(formData.drgSeverity) || 0);
        const maxCriticalityScore = 16; // Maximum possible score (4 * 4)
        const criticalityPercentage = (criticalityScore / maxCriticalityScore) * 100;
        
        const getCriticalityLevel = (score: number) => {
          if (score < 4) return { 
            level: "Low", 
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            gradient: "from-emerald-500 to-emerald-600",
            borderColor: "border-emerald-200"
          };
          if (score < 9) return { 
            level: "Moderate", 
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            gradient: "from-amber-500 to-amber-600",
            borderColor: "border-amber-200"
          };
          return { 
            level: "High", 
            color: "text-red-500",
            bgColor: "bg-red-50",
            gradient: "from-red-500 to-red-600",
            borderColor: "border-red-200"
          };
        };

        const criticalityStyle = getCriticalityLevel(criticalityScore);

        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Severity Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Comorbidities and additional risk factors</p>
            </div>
            
            <div className="space-y-6">
              {/* Criticality Score Card */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-2xl border-2 ${criticalityStyle.borderColor} ${criticalityStyle.bgColor} dark:bg-opacity-10`}
              >
                <div className="text-center space-y-4">
                  {/* Circular Gauge */}
                  <div className="relative w-48 h-48 mx-auto">
                    {/* Background Circle */}
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
                    
                    {/* Progress Circle */}
                    <motion.div 
                      className="absolute inset-0"
                      initial={{ rotate: -90 }}
                      animate={{ rotate: -90 + (criticalityPercentage * 3.6) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <div 
                        className={`w-full h-full rounded-full border-8 border-transparent border-t-8 border-r-8 bg-gradient-to-r ${criticalityStyle.gradient}`}
                        style={{ 
                          clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                          transform: 'rotate(-45deg)'
                        }}
                      ></div>
                    </motion.div>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center"
                      >
                        <div className={`text-4xl font-bold ${criticalityStyle.color}`}>
                          {criticalityScore.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Criticality Score
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Level Indicator */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center"
                  >
                    <div className={`px-4 py-2 rounded-full ${criticalityStyle.bgColor} ${criticalityStyle.color} font-semibold text-sm border ${criticalityStyle.borderColor}`}>
                      {criticalityStyle.level} Criticality
                    </div>
                  </motion.div>

                  {/* Score Breakdown */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="grid grid-cols-2 gap-4 mt-6"
                  >
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-900 dark:text-gray-400">Mortality Risk</div>
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {formData.drgMortalityRisk}/4
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500 dark:text-gray-400">DRG Severity</div>
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {formData.drgSeverity}/4
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <div className="space-y-4">
                <div className="group">
                  <div className="flex flex-col p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 dark:border-gray-600 dark:hover:border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        DRG Mortality Risk
                      </label>
                      <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">{formData.drgMortalityRisk}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={formData.drgMortalityRisk}
                      onChange={(e) => handleInputChange("drgMortalityRisk", e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">Higher risk of mortality (0-4 scale)</p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex flex-col p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 dark:border-gray-600 dark:hover:border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        DRG Severity
                      </label>
                      <span className="text-sm font-semibold text-blue-500 dark:text-blue-400">{formData.drgSeverity}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      value={formData.drgSeverity}
                      onChange={(e) => handleInputChange("drgSeverity", e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-2">Higher severity of illness (0-4 scale)</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 5:
        const riskLevel = getRiskLevel(riskScore);
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Discharge Planning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Provide discharge details and complete the assessment.</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Discharge Destination
                </label>
                <select
                  value={formData.dischargeType}
                  onChange={(e) => handleInputChange("dischargeType", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="Home">Home</option>
                  <option value="Rehabilitation part of hospital">Rehabilitation part of hospital</option>
                  <option value="Skilled Nursing Facility (SNF)">Skilled Nursing Facility (SNF)</option>
                  <option value="Home Health Care">Home Health Care</option>
                  <option value="Long Term Care in Hospital">Long Term Care in Hospital</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Insurance
                </label>
                <select
                  value={formData.insurance}
                  onChange={(e) => handleInputChange("insurance", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="Self pay">Self pay</option>
                  <option value="Private">Private</option>
                  <option value="Medicaid">Medicaid</option>
                  <option value="Medicare">Medicare</option>
                  <option value="Government">Government</option>
                </select>
              </div>
            </div>

            {isAssessmentComplete && (
              <div className="text-center space-y-6 mt-8">
                {/* Main Risk Score Card */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-2xl border-2 ${riskLevel.borderColor} ${riskLevel.bgColor} relative overflow-hidden dark:bg-opacity-10`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                    <div className="w-full h-full" style={{ 
                      backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                      backgroundSize: '24px 24px'
                    }}></div>
                    </div>

                  <div className="relative">
                    {/* Title */}
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                        30-Day Readmission Risk Assessment
                      </p>
                    </motion.div>

                    {/* Percentage Display */}
                    <div className="relative w-64 h-64 mx-auto mb-8">
                      {/* Outer Ring with Gradient */}
                      <motion.div 
                        initial={{ rotate: -90 }}
                        animate={{ 
                          rotate: -90 + (riskScore * 3.6),
                          boxShadow: [
                            `0 0 20px 0px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`,
                            `0 0 40px 10px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`,
                            `0 0 20px 0px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`
                          ]
                        }}
                        transition={{ 
                          rotate: { duration: 2, ease: "easeOut" },
                          boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                        }}
                        className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"
                      >
                        <div 
                          className={`absolute inset-0 rounded-full border-8 border-transparent border-t-8 border-r-8 bg-gradient-to-r ${riskLevel.gradient}`}
                          style={{ 
                            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                            transform: 'rotate(-45deg)'
                          }}
                        />
                      </motion.div>

                      {/* Decorative Dots */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`absolute w-2 h-2 rounded-full ${riskLevel.color}`}
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 30}deg) translateY(-30px)`
                          }}
                        />
                      ))}

                      {/* Center Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: 0.5 
                          }}
                          className="text-center"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="relative"
                          >
                            <div className={`text-7xl font-bold ${riskLevel.color} mb-2`}>
                              {riskScore.toFixed(1)}
                            </div>
                            <div className={`text-2xl font-semibold ${riskLevel.color} opacity-90`}>
                              %
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Risk Level Badge */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-full ${riskLevel.bgColor} ${riskLevel.color} font-semibold text-xl border-2 ${riskLevel.borderColor} shadow-lg`}
                  >
                    {riskLevel.level}
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  const CompletionPopup = ({ riskScore, onClose }: { riskScore: number; onClose: () => void }) => {
    const riskLevel = getRiskLevel(riskScore);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl p-6 w-[500px] aspect-square shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col justify-between h-full">
            <div className={`flex-1 p-6 rounded-2xl border-2 ${riskLevel.borderColor} ${riskLevel.bgColor} relative overflow-hidden dark:bg-opacity-10`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                <div className="w-full h-full" style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}></div>
              </div>

              <div className="relative flex flex-col justify-between h-full space-y-4">
                <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                  30-Day Readmission Risk Assessment
                </h3>

                <div className="relative w-40 h-40 mx-auto">
                  <motion.div 
                    initial={{ rotate: -90 }}
                    animate={{ 
                      rotate: -90 + (riskScore * 3.6),
                      boxShadow: [
                        `0 0 20px 0px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`,
                        `0 0 40px 10px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`,
                        `0 0 20px 0px ${riskScore < 20 ? '#10B981' : riskScore < 40 ? '#F59E0B' : '#EF4444'}`
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 2, ease: "easeOut" },
                      boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                    }}
                    className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"
                  >
                    <div 
                      className={`absolute inset-0 rounded-full border-8 border-transparent border-t-8 border-r-8 bg-gradient-to-r ${riskLevel.gradient}`}
                      style={{ 
                        clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                        transform: 'rotate(-45deg)'
                      }}
                    />
                  </motion.div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <div className={`text-5xl font-bold ${riskLevel.color}`}>
                        {riskScore.toFixed(1)}
                      </div>
                      <div className={`text-lg font-semibold ${riskLevel.color} opacity-90`}>
                        %
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className={`inline-flex px-6 py-2 rounded-full ${riskLevel.bgColor} ${riskLevel.color} font-semibold text-xl border-2 ${riskLevel.borderColor} shadow-lg mx-auto`}
                >
                  {riskLevel.level}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${riskLevel.bgColor}`}>
                      <AlertTriangle className={`w-5 h-5 ${riskLevel.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold ${riskLevel.color} mb-1`}>
                        Clinical Recommendation
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {riskScore < 20 && "Consider standard discharge protocols with routine follow-up."}
                        {riskScore >= 20 && riskScore < 40 && "Enhanced monitoring and targeted interventions recommended."}
                        {riskScore >= 40 && "Urgent care coordination and comprehensive follow-up required."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Complete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (isAssessmentComplete) {
    return <CompletionPopup 
      riskScore={riskScore} 
      onClose={() => {
        window.location.href = '/';
      }}
    />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r bg-blue-500 p-6 sm:p-8 rounded-t-3xl">
                <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between text-white">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      Heart Failure Risk Assessment
                    </h2>
                    <p className="text-blue-100 text-sm">
                      AI-powered 30-day readmission prediction system
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Step indicators */}
              <div className="px-4 sm:px-8 py-6 bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    return (
                      <div key={step.id} className="flex items-center flex-shrink-0">
                        <motion.div 
                          className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                            isActive ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30' :
                            isCompleted ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' :
                            'border-gray-300 text-gray-400 bg-white dark:bg-neutral-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isCompleted ? (
                            <Check className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </motion.div>
                        {index < steps.length - 1 && (
                          <div className={`w-8 sm:w-16 h-1 mx-2 sm:mx-3 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {steps[currentStep - 1].title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>

              {/* Content area */}
              <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[500px]">
                {/* Current Risk Score - Left sidebar */}
                <div className="w-full md:w-80 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">Current Risk Score</h4>
                    
                    {/* API Connection Status */}
                    {!isApiConnected && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm font-medium">API Disconnected</p>
                        <p className="text-red-500 text-xs mt-1">Ensure Flask server is running on port 5000</p>
                      </div>
                    )}
                    
                    {/* API Error */}
                    {apiError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm font-medium">Error</p>
                        <p className="text-red-500 text-xs mt-1">{apiError}</p>
                      </div>
                    )}
                    
                    <div className="text-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                          <div className="text-sm text-gray-500">Calculating risk...</div>
                        </div>
                      ) : (
                        <>
                          <motion.div
                            key={riskScore}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-4xl font-bold ${getRiskLevel(riskScore).color} mb-3`}
                          >
                            {riskScore.toFixed(1)}%
                          </motion.div>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevel(riskScore).color} ${getRiskLevel(riskScore).bgColor} border ${getRiskLevel(riskScore).borderColor}`}>
                            {getRiskLevel(riskScore).level}
                          </div>
                        </>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-3">30-day readmission probability</p>
                      
                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-neutral-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(riskScore, 100)}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className={`h-2 rounded-full bg-gradient-to-r ${getRiskLevel(riskScore).gradient}`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      {/* Data completeness indicator */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-gray-500 mb-2">Step {currentStep} of 5</p>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form content - Right side */}
                <div className="flex-1 p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {renderStepContent()}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 sm:px-8 py-6 bg-gray-50 dark:bg-neutral-800 rounded-b-3xl">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 dark:bg-neutral-700 dark:text-white dark:border-gray-600 dark:hover:bg-neutral-600 mb-3 sm:mb-0"
                  >
                    Previous
                  </button>
                  
                  <div className="hidden sm:flex items-center space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index + 1 === currentStep ? 'bg-blue-500 w-8' :
                          index + 1 < currentStep ? 'bg-emerald-500' :
                          'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="w-full sm:w-auto flex space-x-3">
                    {currentStep < 5 ? (
                      <button
                        onClick={async () => {
                          await updateRiskScore(formData);
                          setCurrentStep(currentStep + 1);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await updateRiskScore(formData);
                          setIsAssessmentComplete(true);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Complete Assessment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}