import React from 'react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/593991234567"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-7 right-7 w-[60px] h-[60px] rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.4)] flex items-center justify-center z-[1500] hover:scale-110 hover:shadow-[0_14px_36px_rgba(37,211,102,0.6)] transition-all duration-300"
      aria-label="Contactar por WhatsApp"
    >
      <span className="absolute top-[2px] right-[2px] w-[14px] h-[14px] bg-[#10B981] border-2 border-white rounded-full" />
      <span className="absolute right-[72px] bg-[#0840A8] text-white border border-[#00C2E0]/30 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md opacity-0 pointer-events-none translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        💬 ¿Consultas? Habla con un especialista
      </span>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.156 4.221 4.299-1.127z" />
      </svg>
    </a>
  );
};
