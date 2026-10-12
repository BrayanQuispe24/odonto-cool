import React from 'react';
import { LifeBuoy, Mail, MessageCircle, Code2, ArrowRight, Phone } from 'lucide-react';

export const SupportPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-dark-surface p-6 sm:p-8 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-sm bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center">
              <LifeBuoy size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                Ayuda & Soporte Técnico
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
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
          className="group flex flex-col items-center text-center bg-white dark:bg-dark-surface p-8 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-sm bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 transition-transform duration-300">
            <Mail size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Correo Electrónico</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Envía tus consultas detalladas, requerimientos de sistema o reportes de errores.</p>
          <div className="mt-auto flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            Enviar Email <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* WhatsApp Card */}
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center text-center bg-white dark:bg-dark-surface p-8 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 transition-transform duration-300">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">WhatsApp Directo</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Para asistencia urgente, capacitaciones rápidas o soporte en tiempo real.</p>
          <div className="mt-auto flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            Chatear ahora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>

        {/* GitHub Card */}
        <a 
          href="https://github.com/tu-usuario" 
          target="_blank" 
          rel="noreferrer"
          className="group flex flex-col items-center text-center bg-white dark:bg-dark-surface p-8 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 md:col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center mb-6 transition-transform duration-300 border border-slate-200 dark:border-slate-700">
            <Code2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Portafolio / GitHub</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">Revisa las actualizaciones del código fuente, historial de versiones y otros proyectos.</p>
          <div className="mt-auto flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
            Ver GitHub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      </div>

    </div>
  );
};
