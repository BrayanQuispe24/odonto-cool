import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-ocean-deep dark:text-teal-100 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-teal-400 flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={`w-full py-2.5 rounded-xl border bg-bg-primary dark:bg-white/5 text-sm font-medium text-ocean-deep dark:text-teal-50 transition-all duration-200 focus-visible:outline-none ${
              icon ? 'pl-10 pr-4' : 'px-4'
            } ${
              error
                ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20'
                : 'border-ocean-deep/15 dark:border-white/15 focus-visible:border-teal-main focus-visible:ring-2 focus-visible:ring-teal-main/25'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

