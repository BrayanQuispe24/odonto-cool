import React from 'react';
import { LifeBuoy, Mail, MessageCircle, Code2, ArrowRight, Phone } from 'lucide-react';

export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-[#002D5E] p-6 sm:p-8 rounded-3xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-xl shadow-[#0077D4]/5 dark:shadow-[#001C3D]/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00C2E0]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0840A8] to-[#0077D4] flex items-center justify-center shadow-lg shadow-[#0077D4]/40 text-white">
              <LifeBuoy size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#0840A8] dark:text-white tracking-tight">
                Ayuda & Soporte Técnico
              </h1>
              <p className="text-sm font-medium text-[#0077D4] dark:text-[#00C2E0]/80 mt-1 max-w-xl">
                ¿Necesitas asistencia técnica o tienes consultas sobre el sistema? Contáctame a través de los siguientes medios oficiales.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gmail Card */}
        <a 
          href="mailto:tu-correo@gmail.com" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center text-center bg-white dark:bg-[#002D5E] p-8 rounded-3xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 hover:shadow-2xl hover:shadow-[#0077D4]/15 dark:hover:shadow-[#001C3D]/60 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#0840A8] dark:text-white mb-2">Correo Electrónico</h3>
          <p className="text-sm text-[#0077D4] dark:text-blue-200/70 font-medium mb-4">Envía tus consultas detalladas, requerimientos de sistema o reportes de errores.</p>
          <div className="mt-auto flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            Enviar Email <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* WhatsApp Card */}
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center text-center bg-white dark:bg-[#002D5E] p-8 rounded-3xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 hover:shadow-2xl hover:shadow-[#0077D4]/15 dark:hover:shadow-[#001C3D]/60 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#0840A8] dark:text-white mb-2">WhatsApp Directo</h3>
          <p className="text-sm text-[#0077D4] dark:text-blue-200/70 font-medium mb-4">Para asistencia urgente, capacitaciones rápidas o soporte en tiempo real.</p>
          <div className="mt-auto flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            Chatear ahora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* GitHub Card */}
        <a 
          href="https://github.com/tu-usuario" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center text-center bg-white dark:bg-[#002D5E] p-8 rounded-3xl border border-[#0840A8]/15 dark:border-[#00C2E0]/30 shadow-lg shadow-[#0077D4]/5 hover:shadow-2xl hover:shadow-[#0077D4]/15 dark:hover:shadow-[#001C3D]/60 hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-200 dark:border-slate-700">
            <Code2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-[#0840A8] dark:text-white mb-2">Portafolio / GitHub</h3>
          <p className="text-sm text-[#0077D4] dark:text-blue-200/70 font-medium mb-4">Revisa las actualizaciones del código fuente, historial de versiones y otros proyectos.</p>
          <div className="mt-auto flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
            Ver GitHub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      </div>

    </div>
  );
};
