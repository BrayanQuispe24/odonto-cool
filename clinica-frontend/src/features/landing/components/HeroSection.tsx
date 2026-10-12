import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface HeroSectionProps {
  onOpenModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  const [patientsCount, setPatientsCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);
  const [yearsCount, setYearsCount] = useState(0);
  const metricsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateMetrics();
          }
        });
      },
      { threshold: 0.15 }
    );

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateMetrics = () => {
    const duration = 2000;
    const frames = 60;
    const intervalTime = duration / frames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / frames;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setPatientsCount(Math.floor(3000 * easeOut));
      setSatisfactionCount(parseFloat((99.5 * easeOut).toFixed(1)));
      setYearsCount(Math.floor(4 * easeOut));

      if (frame >= frames) {
        clearInterval(timer);
        setPatientsCount(3000);
        setSatisfactionCount(99.5);
        setYearsCount(4);
      }
    }, intervalTime);
  };

  return (
    <section
      id="hero"
      className="relative bg-cover bg-center transition-colors duration-300 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(8, 64, 168, 0.85), rgba(0, 28, 61, 0.94)), url('/assets/images/fondolanding.jpeg')`
      }}
    >
      {/* Centered 3D Animated Hero Header Container */}
      <div className="min-h-[calc(100vh-70px)] pt-24 pb-12 flex flex-col items-center justify-center relative z-10">
        <div className="reveal reveal-3d max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center my-auto">
          {/* Hero Title */}
          <h1 className="reveal font-display text-2xl sm:text-4xl md:text-5xl lg:text-[4.4rem] font-extrabold text-white max-w-[880px] mb-4 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tight drop-shadow-md">
            Diseñamos tu mejor sonrisa con precisión digital y sin dolor
          </h1>

          {/* Hero Subtitle */}
          <p className="reveal stagger-1 text-sm sm:text-base md:text-lg font-bold text-[#E5F7FF] max-w-[640px] mb-8 sm:mb-10 leading-relaxed drop-shadow-sm">
            Tratamientos odontológicos integrales, ortodoncia invisible, implantes de carga inmediata y diseño de sonrisa digital con tecnología clínica de nivel internacional.
          </p>

          {/* CTA Buttons */}
          <div className="reveal stagger-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button variant="teal" size="lg" onClick={onOpenModal} className="w-full sm:w-auto">
              Agendar Cita Diagnóstica ➔
            </Button>
            <a href="#simulador" className="w-full sm:w-auto">
              <Button variant="light" size="lg" className="w-full sm:w-auto">
                Ver Casos Clínicos ➔
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Hero Showcase Frame & Stats Grid below the fold */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-24 relative z-10">
        {/* Hero Frame with Floating Glass Badges & Radial Glow */}
        <div className="reveal relative w-full max-w-[1020px] mx-auto">
          {/* Radial Cyan Glow Aura */}
          <div className="absolute -inset-4 w-full h-full glow-cyan rounded-3xl blur-3xl opacity-80 pointer-events-none -z-10" />
          

          {/* Image Container */}
          <div className="w-full max-w-[1000px] h-[260px] sm:h-[360px] md:h-[460px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(8,64,168,0.18)] border border-secondary/30">
            <img
              src="/assets/images/fondolanding.jpeg"
              alt="Instalaciones de ODONTO COOL"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Hero Stats Grid - Enterprise Professional Redesign */}
        <div
          ref={metricsRef}
          className="reveal mt-12 sm:mt-16 w-full max-w-[1020px] mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-secondary/20 border-y border-secondary/20 py-8">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-2 tracking-tight">
                {patientsCount.toLocaleString()}+
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#E5F7FF] opacity-80">
                Pacientes Atendidos
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-2 tracking-tight">
                {satisfactionCount}%
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#E5F7FF] opacity-80">
                Satisfacción Clínica
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-2 tracking-tight">
                {yearsCount}+
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#E5F7FF] opacity-80">
                Años Experiencia
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center text-center px-4">
              <div className="font-display text-3xl sm:text-4xl font-light text-white mb-2 tracking-tight">
                0%
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium text-[#E5F7FF] opacity-80">
                Dolor & Sedación
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
