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
    { key: 'sm', label: 'Pequeña', px: '14px' },
    { key: 'md', label: 'Normal', px: '16px' },
    { key: 'lg', label: 'Grande', px: '18px' },
  ];

  const handleReset = () => {
    setTheme('light');
    setFontSize('md');
    toast.info('Configuración restablecida a valores por defecto');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ocean-deep/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#002D5E] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-teal-soft/20 dark:border-[#00C2E0]/30 relative space-y-6 transition-colors duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#00C2E0]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-main/10 dark:bg-[#0077D4]/30 text-teal-main dark:text-[#00C2E0] flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-ocean-deep dark:text-white">
                Configuración de Apariencia
              </h2>
              <p className="text-xs text-gray-500 dark:text-blue-200/70">
                Personalice el tema visual y el tamaño de letra del sistema.
              </p>
            </div>
          </div>

          <button
            onClick={closeSettingsModal}
            className="text-gray-400 dark:text-blue-200/60 hover:text-gray-600 dark:hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* SECTION 1: TEMA VISUAL */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ocean-deep dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Moon size={16} className="text-teal-main dark:text-[#00C2E0]" />
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
                  className={`relative p-4 rounded-xl border text-center transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-teal-main dark:border-[#00C2E0] bg-gradient-to-b from-[#0077D4] to-[#0840A8] text-white shadow-lg shadow-[#0077D4]/30'
                      : 'border-gray-200 dark:border-[#0077D4]/30 bg-gray-50 dark:bg-[#001C3D] hover:bg-gray-100 dark:hover:bg-[#0840A8]/30 text-ocean-deep dark:text-blue-100'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check size={14} className="text-[#00C2E0]" />
                    </div>
                  )}
                  <Icon size={24} className={`mx-auto mb-2 ${isSelected ? 'text-[#00C2E0]' : 'text-[#0077D4] dark:text-[#00C2E0]'}`} />
                  <div className="text-xs font-bold">{opt.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5 leading-tight">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: TAMAÑO DE FUENTE */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-ocean-deep dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Type size={16} className="text-teal-main dark:text-[#00C2E0]" />
            Tamaño de Letra
          </label>

          <div className="grid grid-cols-3 gap-3">
            {fontOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFontSize(opt.key)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  fontSize === opt.key
                    ? 'border-teal-main dark:border-[#00C2E0] bg-teal-main text-white font-bold shadow-sm'
                    : 'border-gray-200 dark:border-[#0077D4]/30 bg-gray-50 dark:bg-[#001C3D] hover:bg-gray-100 dark:hover:bg-[#0840A8]/30 text-ocean-deep dark:text-blue-100 font-semibold'
                }`}
              >
                <div className="text-xs">{opt.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5">{opt.px}</div>
              </button>
            ))}
          </div>
        </div>

        {/* LIVE PREVIEW BOX */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#001C3D] border border-gray-200 dark:border-[#0077D4]/30 space-y-1 transition-colors duration-300">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-dark dark:text-[#00C2E0]">
            Vista Previa de Texto
          </span>
          <p className="text-xs text-ocean-deep dark:text-blue-100 leading-relaxed">
            ODONTO COOL PRO • Agenda Médica, Odontograma 3D y Control de Pacientes.
          </p>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#00C2E0]/20">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-gray-500 dark:text-blue-200/60 hover:text-ocean-deep dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Restablecer</span>
          </button>

          <Button variant="teal" size="md" onClick={() => {
            toast.success('Preferencias guardadas correctamente');
            closeSettingsModal();
          }}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};
