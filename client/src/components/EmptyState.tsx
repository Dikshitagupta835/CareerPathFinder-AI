import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  illustration: React.ReactNode;
  heading: string;
  subtext: string;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonDisabled?: boolean;
  buttonTooltip?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  illustration,
  heading,
  subtext,
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  buttonTooltip
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] h-full w-full p-6">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col items-center justify-center gap-5 transition-all"
      >
        {/* Illustration Wrapper */}
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
          {illustration}
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {heading}
          </h2>
          <p className="font-body text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            {subtext}
          </p>
        </div>

        {/* Call to Action Button */}
        {buttonText && onButtonClick && (
          <div className="relative group w-full mt-2">
            <button
              onClick={onButtonClick}
              disabled={buttonDisabled}
              className={`w-full py-3 px-6 rounded-xl font-bold text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                buttonDisabled 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-550 hover:to-indigo-500 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {buttonText}
            </button>
            {buttonDisabled && buttonTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-[10px] py-1.5 px-3 rounded shadow-lg whitespace-nowrap z-50">
                {buttonTooltip}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
