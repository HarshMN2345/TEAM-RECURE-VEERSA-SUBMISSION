"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ThemeToggleWrapper } from "../theme-toggle-wrapper";
import { RiskAssessmentModal } from "./risk-assessment-modal";
import { FormDemo } from "./form-demo";
import { HeartCrack } from "lucide-react";

export function HeroSectionOne() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormDemoOpen, setIsFormDemoOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* Grid and Dot Background Pattern */}
      <div className="absolute left-0 top-0 h-full w-64 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Dots Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '8px 8px'
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-white dark:via-neutral-900/50 dark:to-neutral-900" />
      </div>

      <Navbar onAnalyzeClick={openModal} />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Predict Heart Failure Readmissions with Precision"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Recure uses advanced machine learning to help clinicians identify patients at risk for readmission. 
          Make data-driven decisions and improve patient outcomes with our predictive analytics.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button 
            onClick={openModal}
            className="w-60 transform rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
          >
            Predict Readmission
          </button>
          
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Patient Dashboard
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-12 grid grid-cols-1 gap-6 rounded-3xl border border-neutral-200 bg-neutral-100 p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-2"
        >
          <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Patient Risk Factors</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Age</span>
                <input type="number" className="w-20 rounded border border-gray-300 px-2 text-center dark:border-gray-600 dark:bg-neutral-700" placeholder="65" />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Previous Admissions</span>
                <input type="number" className="w-20 rounded border border-gray-300 px-2 text-center dark:border-gray-600 dark:bg-neutral-700" placeholder="2" />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Length of Stay (days)</span>
                <input type="number" className="w-20 rounded border border-gray-300 px-2 text-center dark:border-gray-600 dark:bg-neutral-700" placeholder="7" />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ejection Fraction (%)</span>
                <input type="number" className="w-20 rounded border border-gray-300 px-2 text-center dark:border-gray-600 dark:bg-neutral-700" placeholder="40" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-neutral-800">
            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Readmission Risk</h3>
            <div className="flex h-[calc(100%-32px)] flex-col items-center justify-center">
              <div className="relative mb-3 h-36 w-36">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">65%</span>
                </div>
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                    className="dark:stroke-gray-700"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset="99"
                    className="transform -rotate-90 origin-center"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                This patient has a moderate to high risk of readmission within 30 days
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risk Assessment Modal */}
      <RiskAssessmentModal isOpen={isModalOpen} onClose={closeModal} />
      
      {/* Form Components Demo */}
      <FormDemo 
        isOpen={isFormDemoOpen} 
        onClose={() => setIsFormDemoOpen(false)} 
      />
    </div>
  );
}

interface NavbarProps {
  onAnalyzeClick: () => void;
}

const Navbar = ({ onAnalyzeClick }: NavbarProps) => {
  const HeartFailureIcon = () => (
    <div className="size-9 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-600 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-red-500/50 hover:scale-110 relative">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md" />
      {/* Inner highlight */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-red-400/10 to-white/20" />
      {/* Icon container with enhanced contrast */}
      <div className="relative z-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full p-1.5">
        <HeartCrack className="h-5 w-5 text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.5)] animate-pulse" />
      </div>
    </div>
  );

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <HeartFailureIcon />
        <h1 className="text-lg md:text-3xl lg:text-4xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-blue-400 drop-shadow-sm">
          Recure
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden transform text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 md:block">Documentation</button>
        <button className="hidden transform text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 md:block">About</button>
        {/* <ThemeToggleWrapper /> */}
        <button 
          onClick={onAnalyzeClick}
          className="w-24 transform rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 md:w-28 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Analyze
        </button>
      </div>
    </nav>
  );
};
