import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000E24] text-white pt-20 pb-24 border-t border-[#00C2E0]/20 relative" id="faq">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Brand Logo & Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="p-2 bg-white/10 rounded-2xl border border-[#00C2E0]/30 backdrop-blur-md">
            <img 
              src="/assets/images/image.png" 
              alt="ODONTO COOL Logo" 
              className="h-12 w-auto object-contain rounded-xl"
            />
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-white block">ODONTO COOL</span>
            <span className="text-xs text-[#00C2E0] font-medium">Excelencia & Tecnología Odontológica</span>
          </div>
        </div>

        {/* Massive Brand Title */}
        <div className="font-display text-[clamp(3.5rem,8vw,7.5rem)] font-extrabold text-white/10 leading-none select-none tracking-tight">
          ODONTO COOL
        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-white/15 pt-6 mt-8 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-slate-200 gap-4">
          <div>
            © 2026 ODONTO COOL Clínica Odontológica. Todos los derechos reservados. Excelencia en salud oral.
          </div>
          <div className="flex gap-5 font-medium">
            <a href="#" className="hover:text-[#00C2E0] transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-[#00C2E0] transition-colors">
              Términos Médicos
            </a>
            <a href="#" className="hover:text-[#00C2E0] transition-colors">
              Soporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
