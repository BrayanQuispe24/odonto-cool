import React from 'react';

interface TopAnnouncementBarProps {
  isScrolled?: boolean;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ isScrolled = false }) => {
  return (
    <div
      className={`hidden md:block bg-[#000D21] text-[#0840A8] dark:text-white text-xs border-b border-[#0840A8]/15 dark:border-[#00C2E0]/20 shadow-sm relative z-[1001] transition-all duration-300 ease-in-out ${
        isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden border-none' : 'max-h-12 py-2 opacity-100'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#00C2E0] animate-pulse"></span>
          <span>Clínica Abierta Hoy • Emergencias Médicas & Atenciones en 30 min</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="tel:+59322948500"
            className="text-[#0077D4] dark:text-[#00C2E0] font-semibold hover:text-[#0840A8] dark:text-white transition-colors flex items-center gap-1.5"
          >
            📞 Directo: (02) 294-8500
          </a>
          <a
            href="https://wa.me/593991234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0077D4] dark:text-[#00C2E0] font-semibold hover:text-[#0840A8] dark:text-white transition-colors flex items-center gap-1.5"
          >
            💬 WhatsApp Citas
          </a>
        </div>
      </div>
    </div>
  );
};
