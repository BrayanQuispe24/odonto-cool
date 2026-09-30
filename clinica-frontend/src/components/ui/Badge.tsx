import React from 'react';

export interface BadgeProps {
  variant?: 'mint' | 'teal' | 'dark' | 'light' | 'emerald' | 'amber' | 'rose' | 'sky';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'mint',
  children,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide w-fit transition-all duration-200 shadow-2xs';

  const variantStyles = {
    mint: 'bg-[#E5F7FF] dark:bg-[#002D5E] text-[#0840A8] dark:text-[#00C2E0] border border-[#0840A8]/15 dark:border-[#00C2E0]/40',
    teal: 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-xs border border-[#0840A8]/15 dark:border-[#00C2E0]/40',
    dark: 'bg-white text-[#0840A8] dark:text-white border border-[#0840A8]/15 dark:border-[#00C2E0]/30 dark:bg-[#001C3D]',
    light: 'bg-white/95 dark:bg-[#002D5E] text-[#0840A8] dark:text-white shadow-xs border border-[#0840A8]/15 dark:border-[#00C2E0]/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50',
    amber: 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700/50',
    rose: 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-700/50',
    sky: 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-700/50',
  }[variant];

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};

