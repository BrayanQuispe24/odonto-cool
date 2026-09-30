import React, { useRef } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { FACILITIES } from '../data/landingData';

export const FacilitiesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="tecnologia" className="py-16 sm:py-24 bg-[#0840A8] text-white relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="reveal flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div>
            <Badge variant="mint" className="mb-3">
              🏥 Tour Virtual
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white mb-2 tracking-tight leading-tight">
              Nuestras Instalaciones & Tecnología Odontológica
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-100">
              Espacios ergonómicos diseñados para brindar la máxima tranquilidad y confort.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0840A8] text-white border border-[#00C2E0]/25 flex items-center justify-center text-base sm:text-lg cursor-pointer hover:bg-[#0077D4] hover:border-[#0077D4] transition-all"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0840A8] text-white border border-[#00C2E0]/25 flex items-center justify-center text-base sm:text-lg cursor-pointer hover:bg-[#0077D4] hover:border-[#0077D4] transition-all"
              aria-label="Siguiente"
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="reveal relative mt-6 sm:mt-8">
          <div
            ref={trackRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-5 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="group min-w-[260px] sm:min-w-[320px] max-w-[320px] bg-[#002D5E] rounded-2xl overflow-hidden border border-[#00C2E0]/20 hover:-translate-y-1 hover:border-[#00C2E0] hover:shadow-lg transition-all duration-300 shrink-0"
              >
                <div className="h-[180px] sm:h-[220px] overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
