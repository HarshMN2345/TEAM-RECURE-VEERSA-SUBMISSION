"use client";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Calendar, Clock, Search, AlertCircle, Info, CheckCircle } from "lucide-react";
import { useState, forwardRef } from "react";

// Base Input Component
interface BaseInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email" | "password" | "tel";
  unit?: string;
  helperText?: string;
  helperIcon?: "info" | "warning" | "success";
  required?: boolean;
  disabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
  className?: string;
}

export const FormInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  unit,
  helperText,
  helperIcon = "info",
  required = false,
  disabled = false,
  step,
  min,
  max,
  className = ""
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getHelperIconColor = () => {
    switch (helperIcon) {
      case "warning": return "bg-amber-400";
      case "success": return "bg-emerald-400";
      default: return "bg-blue-400";
    }
  };

  const getHelperIcon = () => {
    switch (helperIcon) {
      case "warning": return <AlertCircle className="h-3 w-3 text-amber-500" />;
      case "success": return <CheckCircle className="h-3 w-3 text-emerald-500" />;
      default: return <Info className="h-3 w-3 text-blue-500" />;
    }
  };

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={ref}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 
            ${isFocused 
              ? 'ring-4 ring-blue-500/20 border-blue-500 dark:border-blue-400' 
              : 'border-gray-200 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-neutral-700' 
              : 'hover:border-gray-300 dark:hover:border-gray-500'
            }
            dark:bg-neutral-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400`}
          placeholder={placeholder}
        />
        
        {/* Unit indicator */}
        {unit && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{unit}</span>
          </div>
        )}
        
        {/* Password toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      
      {/* Helper text */}
      {helperText && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-2 flex items-center"
        >
          <div className={`w-1 h-1 ${getHelperIconColor()} rounded-full mr-2`}></div>
          {helperText}
        </motion.p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

// Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  helperIcon?: "info" | "warning" | "success";
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  helperText,
  helperIcon = "info",
  required = false,
  disabled = false,
  className = ""
}: FormSelectProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getHelperIconColor = () => {
    switch (helperIcon) {
      case "warning": return "bg-amber-400";
      case "success": return "bg-emerald-400";
      default: return "bg-blue-400";
    }
  };

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 
          ${isFocused 
            ? 'ring-4 ring-blue-500/20 border-blue-500 dark:border-blue-400' 
            : 'border-gray-200 dark:border-gray-600'
          }
          ${disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-neutral-700' 
            : 'hover:border-gray-300 dark:hover:border-gray-500'
          }
          dark:bg-neutral-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {helperText && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-2 flex items-center"
        >
          <div className={`w-1 h-1 ${getHelperIconColor()} rounded-full mr-2`}></div>
          {helperText}
        </motion.p>
      )}
    </div>
  );
};

// Checkbox Component
interface FormCheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const FormCheckbox = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  className = ""
}: FormCheckboxProps) => {
  return (
    <div className={`group ${className}`}>
      <div className={`flex items-center p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer
        ${checked 
          ? 'border-blue-300 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30' 
          : 'border-gray-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <motion.div 
            className={`w-5 h-5 border-2 rounded transition-all duration-200 cursor-pointer ${
              checked 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300 hover:border-blue-400 dark:border-gray-500'
            }`}
            onClick={() => !disabled && onChange(!checked)}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
          >
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Check className="w-3 h-3 text-white m-0.5" />
              </motion.div>
            )}
          </motion.div>
        </div>
        <div className="ml-4 flex-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Textarea Component
interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  helperIcon?: "info" | "warning" | "success";
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const FormTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  helperIcon = "info",
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = ""
}: FormTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const getHelperIconColor = () => {
    switch (helperIcon) {
      case "warning": return "bg-amber-400";
      case "success": return "bg-emerald-400";
      default: return "bg-blue-400";
    }
  };

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 resize-none
            ${isFocused 
              ? 'ring-4 ring-blue-500/20 border-blue-500 dark:border-blue-400' 
              : 'border-gray-200 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-neutral-700' 
              : 'hover:border-gray-300 dark:hover:border-gray-500'
            }
            dark:bg-neutral-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400`}
          placeholder={placeholder}
        />
        
        {/* Character count */}
        {maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      
      {helperText && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-2 flex items-center"
        >
          <div className={`w-1 h-1 ${getHelperIconColor()} rounded-full mr-2`}></div>
          {helperText}
        </motion.p>
      )}
    </div>
  );
};

// Form Section Component
interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  gradient?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({
  title,
  description,
  icon,
  gradient = "from-blue-500 to-purple-600",
  children,
  className = ""
}: FormSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-8 ${className}`}
    >
      <div className="text-center">
        {icon && (
          <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-400">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
};

// Date Input Component
interface FormDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export const FormDateInput = ({
  label,
  value,
  onChange,
  helperText,
  required = false,
  disabled = false,
  min,
  max,
  className = ""
}: FormDateInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 
            ${isFocused 
              ? 'ring-4 ring-blue-500/20 border-blue-500 dark:border-blue-400' 
              : 'border-gray-200 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-neutral-700' 
              : 'hover:border-gray-300 dark:hover:border-gray-500'
            }
            dark:bg-neutral-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400`}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {helperText && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-2 flex items-center"
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
          {helperText}
        </motion.p>
      )}
    </div>
  );
};

// Search Input Component
interface FormSearchInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export const FormSearchInput = ({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  disabled = false,
  className = ""
}: FormSearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`group ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 
            ${isFocused 
              ? 'ring-4 ring-blue-500/20 border-blue-500 dark:border-blue-400' 
              : 'border-gray-200 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-neutral-700' 
              : 'hover:border-gray-300 dark:hover:border-gray-500'
            }
            dark:bg-neutral-800 dark:text-white focus:border-blue-500 dark:focus:border-blue-400`}
          placeholder={placeholder}
        />
      </div>
      
      {helperText && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-500 mt-2 flex items-center"
        >
          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
          {helperText}
        </motion.p>
      )}
    </div>
  );
}; 