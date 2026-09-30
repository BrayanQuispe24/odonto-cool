import React, { useState, useEffect } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DOCTORS } from '../data/landingData';

interface DoctorsShowcaseSectionProps {
  onOpenModal: () => void;
}

export const DoctorsShowcaseSection: React.FC<DoctorsShowcaseSectionProps> = ({
  onOpenModal,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentDoctor = DOCTORS.find((doc) => doc.id === selectedDoctorId) || DOCTORS[0];

  const handleSelectDoctor = (id: string) => {
    if (id === selectedDoctorId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedDoctorId(id);
      setIsTransitioning(false);
    }, 500); // Aumentado para dar tiempo a desvanecer
  };

  // Efecto de carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = DOCTORS.findIndex((doc) => doc.id === selectedDoctorId);
      const nextIndex = (currentIndex + 1) % DOCTORS.length;
      handleSelectDoctor(DOCTORS[nextIndex].id);
    }, 6000); // 6 segundos para que lean con calma

    return () => clearInterval(timer);
  }, [selectedDoctorId]);

  return (
    <section id="especialistas" className="py-16 sm:py-24 bg-[#0840A8] text-white relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="reveal text-center max-w-[720px] mx-auto mb-8 sm:mb-10">
          <Badge variant="mint" className="mx-auto mb-3 sm:mb-4">
            👨‍⚕️ Cuerpo Médico de Excelencia
          </Badge>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white mt-2 sm:mt-3 mb-3 sm:mb-4 tracking-tight leading-tight">
            Especialistas reconocidos. Atención personalizada.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed">
            Haz clic en los avatares para conocer el perfil, trayectoria y disponibilidad de cada especialista.
          </p>
        </div>

        {/* Doctor Character Showcase Container */}
        <div className="reveal bg-[#002D5E] rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 border border-[#00C2E0]/20 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center min-h-[360px] sm:min-h-[400px]">
            {/* Doctor Info */}
            <div className={`flex flex-col justify-center text-center lg:text-left items-center lg:items-start transition-all duration-700 ease-in-out ${
              isTransitioning ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'
            }`}>
              <Badge variant="teal" className="mb-3 sm:mb-4">
                {currentDoctor.tag}
              </Badge>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-2 mb-2">
                {currentDoctor.name}
              </h3>
              <div className="text-sm sm:text-base md:text-lg text-[#00C2E0] font-semibold mb-4 sm:mb-5">
                {currentDoctor.role}
              </div>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6 sm:mb-7 italic max-w-[540px]">
                {currentDoctor.bio}
              </p>
              <div className="w-full sm:w-auto">
                <Button variant="teal" size="md" onClick={onOpenModal} className="w-full sm:w-auto">
                  Reservar Cita con este Especialista ➔
                </Button>
              </div>
            </div>

            {/* Doctor Image Frame */}
            <div className="reveal-right relative w-full h-[260px] sm:h-[340px] md:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-[#00C2E0]/25">
              <img
                src={currentDoctor.image}
                alt={currentDoctor.name}
                className={`w-full h-full object-cover object-top transition-all duration-700 ease-in-out ${
                  isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'
                }`}
              />
            </div>
          </div>

          {/* Avatar Selector Strip */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-[#00C2E0]/20 flex-wrap pb-4">
            {DOCTORS.map((doc) => {
              const isActive = doc.id === selectedDoctorId;
              return (
                <button
                  key={doc.id}
                  onClick={() => handleSelectDoctor(doc.id)}
                  className={`flex flex-col items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-500 ${
                    isActive ? 'opacity-100 -translate-y-2' : 'opacity-60 hover:opacity-100 hover:-translate-y-1'
                  }`}
                >
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 sm:border-3 transition-all duration-300 ${
                      isActive
                        ? 'border-[#0077D4] shadow-[0_0_20px_rgba(0,194,224,0.5)]'
                        : 'border-transparent shadow-md'
                    }`}
                  />
                  <span
                    className={`text-[11px] sm:text-xs font-semibold ${
                      isActive ? 'text-white font-bold' : 'text-[#00C2E0]'
                    }`}
                  >
                    {doc.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
