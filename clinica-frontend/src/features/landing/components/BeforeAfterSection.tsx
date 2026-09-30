import React, { useState, useRef, useCallback } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PILL_BULLETS } from '../data/landingData';

interface BeforeAfterSectionProps {
  onOpenModal: () => void;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  onOpenModal,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;
    const percentage = (offsetX / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <section id="simulador" className="py-16 sm:py-24 bg-[#0840A8] text-white relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="reveal text-center max-w-[720px] mx-auto mb-8 sm:mb-10">
          <Badge variant="mint" className="mx-auto mb-3 sm:mb-4">
            ✦ Resultados Reales
          </Badge>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white mt-2 sm:mt-3 mb-3 sm:mb-4 tracking-tight leading-tight">
            Casos Clínicos Antes y Después
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-cyan-100 leading-relaxed">
            Arrastra el controlador central de izquierda a derecha para comparar el estado inicial con el resultado estético alcanzado.
          </p>
        </div>

        {/* Before / After Drag Slider Widget */}
        <div className="reveal bg-[#002D5E] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#00C2E0]/20 shadow-xl">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="relative w-full h-[220px] sm:h-[320px] md:h-[380px] rounded-xl sm:rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize shadow-2xl"
          >
            {/* Labels */}
            <span className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold z-[5] tracking-wider uppercase bg-black/65 text-white backdrop-blur-md">
              Antes (Inicial)
            </span>
            <span className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold z-[5] tracking-wider uppercase bg-[#0077D4] text-white">
              Después (ODONTO COOL)
            </span>

            {/* After Image (Full background) */}
            <img
              src="/assets/images/dental_smile.png"
              alt="Resultado Sonrisa ODONTO COOL"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden z-[2] border-r-3 sm:border-r-4 border-white"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/assets/images/dental_hero.png"
                alt="Estado inicial dental del paciente"
                className="absolute top-0 left-0 h-full max-w-none object-cover"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '1000px',
                }}
              />
            </div>

            {/* Drag Handle */}
            <div
              className="absolute top-0 bottom-0 z-10 w-1 bg-white -translate-x-1/2 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-[#0840A8] shadow-[0_4px_16px_rgba(0,0,0,0.4)] flex items-center justify-center font-bold text-sm sm:text-lg">
                ↔
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[#00C2E0] font-semibold text-xs sm:text-sm md:text-base text-center sm:text-left">
              ✨ Casos reales de diseño de carillas cerámicas biocompatibles y alineadores Invisalign®.
            </div>
            <Button variant="teal" size="md" onClick={onOpenModal} className="w-full sm:w-auto">
              Quiero mi Valoración ➔
            </Button>
          </div>
        </div>

        {/* 6 Pill Bullet Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-12">
          {PILL_BULLETS.map((bullet, idx) => (
            <div
              key={idx}
              className={`reveal stagger-${idx + 1} bg-[#002D5E] rounded-full px-5 sm:px-6 py-3 sm:py-3.5 flex items-center gap-3 shadow-sm border border-[#0077D4]/30 hover:-translate-y-1 hover:border-[#00C2E0] hover:shadow-md transition-all duration-300`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0077D4]/15 dark:bg-[#00C2E0]/20 text-[#00C2E0] flex items-center justify-center text-xs font-bold shrink-0">
                ✓
              </div>
              <span className="text-xs sm:text-sm font-bold text-white">
                {bullet.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
