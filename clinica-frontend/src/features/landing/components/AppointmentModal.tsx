import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState('Hoy (Prioridad)');
  const [specialty, setSpecialty] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success('¡Cita Diagnóstica Reservada!', {
      description: 'Enviamos la confirmación instantánea a tu WhatsApp y correo.',
    });
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setSpecialty('');
    setName('');
    setPhone('');
    setSelectedDate('Hoy (Prioridad)');
    onClose();
  };

  return (
    <div
      onClick={handleResetAndClose}
      className="fixed inset-0 bg-[#002D5E]/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-3 sm:p-6 transition-all duration-300 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#002D5E] w-full max-w-[580px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(8,64,168,0.3)] border border-[#00C2E0]/20 relative animate-in fade-in zoom-in-95 duration-300 my-auto"
      >
        {/* Header */}
        <div className="bg-[#0840A8] text-white p-5 sm:p-7 px-6 sm:px-8 flex items-center justify-between border-b border-[#00C2E0]/20">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/10 rounded-xl border border-[#00C2E0]/30 shrink-0">
              <img 
                src="/assets/images/image.png" 
                alt="ODONTO COOL Logo" 
                className="h-8 w-auto object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                Agendar Cita Diagnóstica
              </div>
              <div className="text-xs text-[#00C2E0] mt-0.5 font-medium">
                ODONTO COOL • Valoración Clínica + Radiografía
              </div>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-white/15 text-white flex items-center justify-center text-base sm:text-lg hover:bg-white/30 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Cerrar ventana modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-6 sm:py-10 px-2 sm:px-4">
              <div className="w-14 h-14 sm:w-[70px] sm:h-[70px] bg-[#0077D4]/15 text-[#00C2E0] rounded-full flex items-center justify-center text-2xl sm:text-3xl mx-auto mb-4 sm:mb-5">
                ✓
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                ¡Cita Diagnóstica Reservada!
              </h3>
              <p className="text-xs sm:text-base text-slate-200 mb-5 sm:mb-6 leading-relaxed">
                Hemos enviado una confirmación instantánea a tu correo y WhatsApp. Te esperamos en ODONTO COOL.
              </p>
              <Button variant="teal" size="md" onClick={handleResetAndClose} className="w-full sm:w-auto">
                Cerrar y Continuar ➔
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              {/* Specialty */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-white mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Especialidad de Interés
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-[#F4F9FF] dark:bg-[#0840A8]/30 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-[#0077D4] focus:ring-2 focus:ring-[#0077D4]/20 transition-all cursor-pointer"
                >
                  <option value="" className="text-slate-900 bg-white">Selecciona el motivo de tu consulta...</option>
                  <option value="ortodoncia" className="text-slate-900 bg-white">Ortodoncia Invisible (Invisalign®)</option>
                  <option value="implantes" className="text-slate-900 bg-white">Implantes Dentales Especializados</option>
                  <option value="sonrisa" className="text-slate-900 bg-white">Diseño de Sonrisa & Carillas</option>
                  <option value="blanqueamiento" className="text-slate-900 bg-white">Blanqueamiento Láser</option>
                  <option value="general" className="text-slate-900 bg-white">Limpieza / Odontología General</option>
                </select>
              </div>

              {/* Date Chips */}
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-white mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Selecciona el Día Conveniente
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Hoy (Prioridad)', 'Mañana', 'Esta Semana'].map((chip) => {
                    const isActive = selectedDate === chip;
                    return (
                      <button
                        type="button"
                        key={chip}
                        onClick={() => setSelectedDate(chip)}
                        className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold border text-center transition-all cursor-pointer truncate ${
                          isActive
                            ? 'bg-[#0077D4] text-white border-[#0077D4]'
                            : 'bg-[#F4F9FF] dark:bg-[#0840A8]/30 text-[#0840A8] dark:text-slate-200 border-[#0840A8]/15 hover:border-[#0077D4]'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-white mb-1.5 sm:mb-2 uppercase tracking-wide">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María García"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-[#F4F9FF] dark:bg-[#0840A8]/30 text-xs sm:text-sm text-white focus:outline-none focus:border-[#0077D4] focus:ring-2 focus:ring-[#0077D4]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-white mb-1.5 sm:mb-2 uppercase tracking-wide">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: +593 99 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-[#0840A8]/20 dark:border-[#00C2E0]/30 bg-[#F4F9FF] dark:bg-[#0840A8]/30 text-xs sm:text-sm text-white focus:outline-none focus:border-[#0077D4] focus:ring-2 focus:ring-[#0077D4]/20 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="lg"
                className="w-full justify-center mt-2 sm:mt-3 py-3.5 sm:py-4"
              >
                Confirmar Reserva Diagnóstica ➔
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
