"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, Heart, Activity, AlertTriangle, FileText, Clock, Search, X } from "lucide-react";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormSection,
  FormDateInput,
  FormSearchInput
} from "./form-components";

interface FormDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormDemo({ isOpen, onClose }: FormDemoModalProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "Male",
    dateOfBirth: "",
    
    // Medical Information
    previousConditions: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
    
    // Preferences
    newsletter: false,
    smsAlerts: false,
    emailReminders: true,
    
    // Notes
    additionalNotes: "",
    
    // Search
    searchQuery: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  const conditionOptions = [
    { value: "diabetes", label: "Diabetes" },
    { value: "hypertension", label: "Hypertension" },
    { value: "heart-disease", label: "Heart Disease" },
    { value: "kidney-disease", label: "Kidney Disease" },
    { value: "none", label: "None" }
  ];

  if (!isOpen) return null;

  return (
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
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 rounded-t-3xl">
            <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
            <div className="relative flex items-center justify-between text-white">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  Form Components Demo
                </h2>
                <p className="text-blue-100 text-sm">
                  Comprehensive form library with Recure theme styling
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

          {/* Content */}
          <div className="p-8 space-y-12">
            {/* Personal Information Section */}
            <FormSection
              title="Personal Information"
              description="Basic demographic and contact information"
              icon={<User className="h-8 w-8 text-white" />}
              gradient="from-blue-500 to-purple-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(value) => handleInputChange("fullName", value)}
                  required
                  helperText="First and last name as they appear on official documents"
                />
                
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  required
                  helperText="We'll use this for important notifications"
                />
                
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(value) => handleInputChange("password", value)}
                  required
                  helperText="Must be at least 8 characters long"
                  helperIcon="warning"
                />
                
                <FormInput
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(value) => handleInputChange("phone", value)}
                  helperText="Include country code for international numbers"
                />
                
                <FormInput
                  label="Age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(value) => handleInputChange("age", value)}
                  unit="years"
                  min="0"
                  max="120"
                  helperText="Range: 0-120 years"
                  helperIcon="info"
                />
                
                <FormSelect
                  label="Gender"
                  value={formData.gender}
                  onChange={(value) => handleInputChange("gender", value)}
                  options={genderOptions}
                  helperText="This information helps us provide better care"
                />
                
                <FormDateInput
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(value) => handleInputChange("dateOfBirth", value)}
                  required
                  helperText="Used for age verification and medical history"
                />
                
                <FormSearchInput
                  label="Search Medical Records"
                  placeholder="Search by patient ID, name, or condition..."
                  value={formData.searchQuery}
                  onChange={(value) => handleInputChange("searchQuery", value)}
                  helperText="Use keywords to find specific records quickly"
                />
              </div>
            </FormSection>

            {/* Medical Information Section */}
            <FormSection
              title="Medical History"
              description="Previous conditions, medications, and medical information"
              icon={<Heart className="h-8 w-8 text-white" />}
              gradient="from-red-500 to-pink-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Previous Conditions"
                  value={formData.previousConditions}
                  onChange={(value) => handleInputChange("previousConditions", value)}
                  options={conditionOptions}
                  placeholder="Select a condition"
                  helperText="Select your primary medical condition"
                  helperIcon="warning"
                />
                
                <FormInput
                  label="Emergency Contact"
                  placeholder="Name and phone number"
                  value={formData.emergencyContact}
                  onChange={(value) => handleInputChange("emergencyContact", value)}
                  required
                  helperText="Person to contact in case of emergency"
                  helperIcon="warning"
                />
              </div>
              
              <FormTextarea
                label="Known Allergies"
                placeholder="List any known allergies, medications to avoid, etc."
                value={formData.allergies}
                onChange={(value) => handleInputChange("allergies", value)}
                rows={3}
                maxLength={500}
                helperText="Include drug allergies, food allergies, and environmental triggers"
                helperIcon="warning"
              />
              
              <FormTextarea
                label="Current Medications"
                placeholder="List all current medications, dosages, and frequency"
                value={formData.medications}
                onChange={(value) => handleInputChange("medications", value)}
                rows={4}
                maxLength={1000}
                helperText="Include prescription drugs, over-the-counter medications, and supplements"
              />
            </FormSection>

            {/* Preferences Section */}
            <FormSection
              title="Communication Preferences"
              description="How you'd like to receive updates and notifications"
              icon={<Activity className="h-8 w-8 text-white" />}
              gradient="from-green-500 to-teal-600"
            >
              <div className="space-y-4">
                <FormCheckbox
                  label="Email Newsletter"
                  description="Receive monthly health tips and updates via email"
                  checked={formData.newsletter}
                  onChange={(checked) => handleInputChange("newsletter", checked)}
                />
                
                <FormCheckbox
                  label="SMS Alerts"
                  description="Get appointment reminders and urgent notifications via text"
                  checked={formData.smsAlerts}
                  onChange={(checked) => handleInputChange("smsAlerts", checked)}
                />
                
                <FormCheckbox
                  label="Email Reminders"
                  description="Receive email reminders for appointments and medication"
                  checked={formData.emailReminders}
                  onChange={(checked) => handleInputChange("emailReminders", checked)}
                />
              </div>
            </FormSection>

            {/* Additional Notes Section */}
            <FormSection
              title="Additional Information"
              description="Any other relevant information or special notes"
              icon={<FileText className="h-8 w-8 text-white" />}
              gradient="from-amber-500 to-orange-600"
            >
              <FormTextarea
                label="Additional Notes"
                placeholder="Any additional information, concerns, or special requirements..."
                value={formData.additionalNotes}
                onChange={(value) => handleInputChange("additionalNotes", value)}
                rows={6}
                maxLength={2000}
                helperText="Share any other relevant information that might help with your care"
                helperIcon="info"
              />
            </FormSection>

            {/* Form Validation Examples */}
            <FormSection
              title="Form Validation Examples"
              description="Different validation states and helper text styles"
              icon={<AlertTriangle className="h-8 w-8 text-white" />}
              gradient="from-purple-500 to-indigo-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  label="Success State"
                  placeholder="Valid input"
                  value="john@example.com"
                  onChange={() => {}}
                  helperText="Email format is valid"
                  helperIcon="success"
                />
                
                <FormInput
                  label="Warning State"
                  placeholder="Needs attention"
                  value="john@"
                  onChange={() => {}}
                  helperText="Please complete the email address"
                  helperIcon="warning"
                />
                
                <FormInput
                  label="Disabled State"
                  placeholder="Cannot edit"
                  value="Read-only value"
                  onChange={() => {}}
                  disabled
                  helperText="This field cannot be modified"
                />
              </div>
            </FormSection>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-neutral-800 rounded-b-3xl">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                All form components are built with accessibility and dark mode support
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 dark:bg-neutral-700 dark:text-white dark:border-gray-600 dark:hover:bg-neutral-600"
                >
                  Close Demo
                </button>
                <button className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                  Save Form Data
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 