import React from 'react';
import { X, Moon, Sun, Monitor, Type, Sparkles, Check, RotateCcw } from 'lucide-react';
import { useSettingsStore, type FontSizeOption, type ThemeMode } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

export const SettingsModal: React.FC = () => {
  const {
    theme,
    fontSize,
    isSettingsModalOpen,
    closeSettingsModal,
    setTheme,
    setFontSize,
  } = useSettingsStore();

  if (!isSettingsModalOpen) return null;

  const themeOptions: { key: ThemeMode; label: string; desc: string; icon: React.ElementType }[] = [
    { key: 'light', label: 'Modo Claro', desc: 'Fondo claro, ideal para ambientes iluminados', icon: Sun },
    { key: 'dark', label: 'Modo Oscuro', desc: 'Reduce fatiga visual en entornos oscuros', icon: Moon },
    { key: 'system', label: 'Sistema', desc: 'Sigue la preferencia de tu sistema operativo', icon: Monitor },
  ];

  const fontOptions: { key: FontSizeOption; label: string; px: string }[] = [
    { key: 'sm', label: 'Pequeña', px: '16px' },
    { key: 'md', label: 'Normal', px: '18px' },
    { key: 'lg', label: 'Grande', px: '22px' },
  ];

  const handleReset = () => {
    setTheme('light');
    setFontSize('md');
    toast.info('Configuración restablecida a valores por defecto');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-sm max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative space-y-6 transition-colors duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#0077D4]/10 text-[#0077D4] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-200">
                Configuración de Apariencia
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personalice el tema visual y el tamaño de letra del sistema.
              </p>
            </div>
          </div>

          <button
            onClick={closeSettingsModal}
            className="text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm p-1.5 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* SECTION 1: TEMA VISUAL */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Moon size={16} className="text-slate-400" />
            Tema Visual del Sistema
          </label>

          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setTheme(opt.key)}
                  className={`relative p-4 rounded-sm border text-center transition-all cursor-pointer group shadow-sm ${
                    isSelected
                      ? 'border-[#0077D4] bg-[#0077D4]/10 dark:bg-[#0077D4]/20 text-[#0077D4] dark:text-[#0077D4]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check size={14} className="text-[#0077D4]" />
                    </div>
                  )}
                  <Icon size={24} className={`mx-auto mb-2 ${isSelected ? 'text-[#0077D4]' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-tiny opacity-80 mt-0.5 leading-tight text-slate-500 dark:text-slate-400">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: TAMAÑO DE FUENTE */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Type size={16} className="text-slate-400" />
            Tamaño de Letra
          </label>

          <div className="grid grid-cols-3 gap-3">
            {fontOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFontSize(opt.key)}
                className={`p-3 rounded-sm border text-center transition-all cursor-pointer shadow-sm ${
                  fontSize === opt.key
                    ? 'border-[#0077D4] bg-[#0077D4] text-white font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold'
                }`}
              >
                <div className="text-xs">{opt.label}</div>
                <div className="text-tiny opacity-80 mt-0.5">{opt.px}</div>
              </button>
            ))}
          </div>
        </div>

        {/* LIVE PREVIEW BOX */}
        <div className="p-4 rounded-sm bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 space-y-1 transition-colors duration-300">
          <span className="text-tiny font-bold uppercase tracking-wider text-slate-500">
            Vista Previa de Texto
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            ODONTO COOL PRO • Agenda Médica, Odontograma 3D y Control de Pacientes.
          </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Restablecer</span>
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded-sm bg-[#0077D4] hover:bg-[#0840A8] text-white text-small font-semibold shadow-sm transition-colors cursor-pointer"
            onClick={() => {
              toast.success('Preferencias guardadas correctamente');
              closeSettingsModal();
            }}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
