"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, User, Heart, Activity, AlertTriangle, Calendar, ChevronRight, Check } from "lucide-react";

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RiskAssessmentModal({ isOpen, onClose }: RiskAssessmentModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 - Patient Demographics
    age: "",
    gender: "M",
    
    // Step 2 - Clinical History
    admissionType: "Urgent",
    totalDiagnoses: "",
    numberOfPreviousAdmissions: "",
    lengthOfStay: "",
    daysSinceLastAdmission: "",
    
    // Step 3 - Current Admission
    totalProcedures: "",
    totalLabTests: "",
    uniqueLabTests: "",
    
    // Step 4 - Severity Assessment
    drgMortalityRisk: "",
    drgSeverity: "",
    
    // Step 5 - Discharge Planning
    dischargeType: "Home",
    insurance: "Self pay"
  });

  const [riskScore, setRiskScore] = useState(34.0);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Simple risk calculation for demo
    const newScore = calculateRisk({ ...formData, [field]: value });
    setRiskScore(newScore);
  };

  const calculateRisk = (data: typeof formData) => {
    let score = 0;
    if (parseInt(data.age) > 65) score += 15;
    if (parseInt(data.age) > 75) score += 10;
    if (parseInt(data.numberOfPreviousAdmissions) > 2) score += 20;
    if (parseInt(data.lengthOfStay) > 7) score += 15;
    if (parseInt(data.totalProcedures) > 2) score += 10;
    if (parseInt(data.totalLabTests) > 2) score += 10;
    if (parseInt(data.drgMortalityRisk) > 2) score += 10;
    return Math.min(score, 95);
  };

  // Helper functions for dynamic calculations
  const getChronicityIndex = () => {
    const previousAdmissions = parseInt(formData.numberOfPreviousAdmissions) || 0;
    const lengthOfStay = parseInt(formData.lengthOfStay) || 0;
    return previousAdmissions * lengthOfStay;
  };

  const getCriticalityScore = () => {
    const mortalityRisk = parseInt(formData.drgMortalityRisk) || 0;
    const severity = parseInt(formData.drgSeverity) || 0;
    return mortalityRisk * severity;
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
                Patient Demographics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Let's start with basic patient information</p>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Age at Admission
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    placeholder="Enter age (e.g., 65)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">years</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                  Range: 0-120 years
                </p>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 2:
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
                  <option value="Elective">Elective</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Total Diagnoses
                </label>
                <input
                  type="number"
                  value={formData.totalDiagnoses}
                  onChange={(e) => handleInputChange("totalDiagnoses", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Total number of diagnoses"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Number of Previous Admissions
                </label>
                <input
                  type="number"
                  value={formData.numberOfPreviousAdmissions}
                  onChange={(e) => handleInputChange("numberOfPreviousAdmissions", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Number of previous admissions"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Length of Current Stay
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.lengthOfStay}
                    onChange={(e) => handleInputChange("lengthOfStay", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    placeholder="Duration of stay (e.g., 5)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Days Since Last Admission
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.daysSinceLastAdmission}
                    onChange={(e) => handleInputChange("daysSinceLastAdmission", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                    placeholder="Days since last admission"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">days</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
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
                  value={formData.totalProcedures}
                  onChange={(e) => handleInputChange("totalProcedures", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Total number of procedures"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Total Lab Tests
                </label>
                <input
                  type="number"
                  value={formData.totalLabTests}
                  onChange={(e) => handleInputChange("totalLabTests", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Total number of lab tests"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Unique Lab Tests
                </label>
                <input
                  type="number"
                  value={formData.uniqueLabTests}
                  onChange={(e) => handleInputChange("uniqueLabTests", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 dark:bg-neutral-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400"
                  placeholder="Number of unique lab tests"
                />
              </div>
            </div>
          </motion.div>
        );
      case 4:
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
              <div className="space-y-4">
                <div className="group">
                  <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 dark:border-gray-600 dark:hover:border-blue-500">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.drgMortalityRisk !== "0" && formData.drgMortalityRisk !== ""}
                        onChange={(e) => handleInputChange("drgMortalityRisk", e.target.checked ? "1" : "0")}
                        className="sr-only"
                      />
                      <div 
                        className={`w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer ${
                          formData.drgMortalityRisk !== "0" && formData.drgMortalityRisk !== "" ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange("drgMortalityRisk", formData.drgMortalityRisk === "1" ? "0" : "1");
                        }}
                      >
                        {(formData.drgMortalityRisk !== "0" && formData.drgMortalityRisk !== "") && (
                          <Check className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        DRG Mortality Risk
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Higher risk of mortality</p>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 dark:border-gray-600 dark:hover:border-blue-500">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.drgSeverity !== "0" && formData.drgSeverity !== ""}
                        onChange={(e) => handleInputChange("drgSeverity", e.target.checked ? "1" : "0")}
                        className="sr-only"
                      />
                      <div 
                        className={`w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer ${
                          formData.drgSeverity !== "0" && formData.drgSeverity !== "" ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange("drgSeverity", formData.drgSeverity === "1" ? "0" : "1");
                        }}
                      >
                        {(formData.drgSeverity !== "0" && formData.drgSeverity !== "") && (
                          <Check className="w-3 h-3 text-white m-0.5" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                        DRG Severity
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Higher severity of illness</p>
                    </div>
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
              <p className="text-gray-600 dark:text-gray-400 mt-2">Risk evaluation summary</p>
            </div>
            
            <div className="text-center space-y-6">
              <div className={`p-8 ${riskLevel.bgColor} ${riskLevel.borderColor} border-2 rounded-2xl shadow-lg dark:bg-neutral-800 dark:border-gray-600`}>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  30-day readmission probability
                </p>
                <div className="relative">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${riskLevel.gradient} bg-clip-text text-transparent mb-2`}>
                    {riskScore.toFixed(1)}%
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(riskScore, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-2 bg-gradient-to-r ${riskLevel.gradient} rounded-full mx-auto mb-4`}
                    style={{ maxWidth: '200px' }}
                  />
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${riskLevel.color} ${riskLevel.bgColor} border ${riskLevel.borderColor}`}>
                  {getRiskLevel(riskScore).level}
                </div>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Based on the provided clinical data, this patient has a <span className={`font-semibold ${riskLevel.color}`}>
                  {getRiskLevel(riskScore).level.toLowerCase()}</span> of readmission within 30 days. 
                  {riskScore < 20 && " Consider standard discharge planning with routine follow-up."}
                  {riskScore >= 20 && riskScore < 40 && " Enhanced monitoring and targeted interventions may be beneficial."}
                  {riskScore >= 40 && " Intensive care coordination and close follow-up are strongly recommended."}
                </p>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

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
                    <div className="text-center">
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
                        onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r bg-blue-500 shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-200"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={onClose}
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