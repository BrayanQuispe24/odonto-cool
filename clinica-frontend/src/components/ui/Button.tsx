import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'teal' | 'dark' | 'light' | 'mint' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'teal',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 relative select-none cursor-pointer text-center whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-main/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-xs';

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs sm:text-sm font-extrabold',
    md: 'px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold tracking-wide',
    lg: 'px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold tracking-wide',
  }[size];

  const variantStyles = {
    teal: 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] hover:from-[#00C2E0] hover:to-[#0077D4] text-white shadow-md shadow-[#002D5E]/20 border border-[#0840A8]/15 dark:border-[#00C2E0]/40 hover:shadow-lg hover:shadow-[#00C2E0]/30 transition-all duration-300',
    danger: 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-md shadow-rose-950/30 border border-rose-500/40 hover:shadow-lg hover:shadow-rose-950/40',
    secondary: 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-teal-100 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-300/80 dark:border-[#00C2E0]/30',
    dark: 'bg-[#0840A8] text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 hover:bg-white dark:hover:bg-[#002D5E] shadow-md shadow-[#002D5E]/30',
    light: 'bg-white text-[#0840A8] border border-slate-200/80 shadow-xs hover:bg-[#F4F9FF] dark:bg-[#002D5E] dark:text-white dark:border-[#00C2E0]/30 dark:hover:bg-[#0840A8]',
    mint: 'bg-[#E5F7FF] text-[#0840A8] border border-[#0840A8]/15 dark:border-[#00C2E0]/40 hover:bg-white dark:bg-[#0840A8]/70 dark:text-white dark:border-[#00C2E0]/40 dark:hover:bg-[#0840A8]',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

