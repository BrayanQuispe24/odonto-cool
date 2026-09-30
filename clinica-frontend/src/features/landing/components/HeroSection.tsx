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
          {/* Mint Badge */}
          <div className="reveal mb-4 sm:mb-5">
            <Badge variant="mint">
              ✦ Odontología Digital & Estética Dental de Vanguardia
            </Badge>
          </div>

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
          
          {/* Floating Glass Badge 1 - Top Right */}
          <div className="hidden md:flex absolute top-6 right-6 z-10 bg-white/95 dark:bg-[#002D5E]/95 backdrop-blur-md border border-[#00C2E0]/30 p-3.5 px-5 rounded-2xl shadow-[0_16px_36px_rgba(0,45,94,0.2)] items-center gap-3 animate-float hover:scale-105 transition-all">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              ✦
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-white leading-tight">
                99.5% Éxito Clínico
              </div>
              <div className="text-xs font-bold text-[#002D5E] dark:text-[#E5F7FF]">
                Implantes & Ortodoncia Digital
              </div>
            </div>
          </div>

          {/* Floating Glass Badge 2 - Bottom Left */}
          <div className="hidden md:flex absolute bottom-6 left-6 z-10 bg-white/95 dark:bg-[#002D5E]/95 backdrop-blur-md border border-[#00C2E0]/30 p-3.5 px-5 rounded-2xl shadow-[0_16px_36px_rgba(0,45,94,0.2)] items-center gap-3 animate-float-reverse hover:scale-105 transition-all">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-[#0077D4] to-[#00C2E0] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              ★
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-white leading-tight">
                4.9 / 5.0 en Google
              </div>
              <div className="text-xs font-bold text-[#002D5E] dark:text-[#E5F7FF]">
                +520 Pacientes Satisfechos
              </div>
            </div>
          </div>

          {/* Floating Glass Badge 3 - Bottom Right */}
          <div className="hidden md:flex absolute bottom-6 right-6 z-10 bg-white/95 dark:bg-[#002D5E]/95 backdrop-blur-md border border-[#00C2E0]/30 p-3.5 px-5 rounded-2xl shadow-[0_16px_36px_rgba(0,45,94,0.2)] items-center gap-3 animate-float hover:scale-105 transition-all">
            <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-[#0840A8] to-[#0077D4] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              ✓
            </div>
            <div className="text-left">
              <div className="text-sm font-extrabold text-white leading-tight">
                0% Dolor Garantizado
              </div>
              <div className="text-xs font-bold text-[#002D5E] dark:text-[#E5F7FF]">
                Anestesia Computarizada
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="w-full max-w-[1000px] h-[260px] sm:h-[360px] md:h-[460px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(8,64,168,0.18)] border border-[#00C2E0]/30">
            <img
              src="/assets/images/fondolanding.jpeg"
              alt="Instalaciones de ODONTO COOL"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Hero Stats Grid */}
        <div
          ref={metricsRef}
          className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 bg-[#002D5E] p-5 sm:p-8 px-6 sm:px-10 rounded-2xl sm:rounded-3xl shadow-[0_12px_32px_rgba(8,64,168,0.12)] border border-[#00C2E0]/30 mt-8 sm:mt-12 w-full text-left transition-colors duration-300"
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0077D4]/15 text-[#00C2E0] flex items-center justify-center text-lg sm:text-xl shrink-0 font-bold">
              🏥
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {patientsCount.toLocaleString()}+
              </div>
              <div className="text-xs font-bold text-[#00C2E0] dark:text-[#E5F7FF]">
                Pacientes Atendidos
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0077D4]/15 text-[#00C2E0] flex items-center justify-center text-lg sm:text-xl shrink-0 font-bold">
              ⭐
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {satisfactionCount}%
              </div>
              <div className="text-xs font-bold text-[#00C2E0] dark:text-[#E5F7FF]">
                Satisfacción Clínicamente Comprobada
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0077D4]/15 text-[#00C2E0] flex items-center justify-center text-lg sm:text-xl shrink-0 font-bold">
              👨‍⚕️
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {yearsCount}+ Años
              </div>
              <div className="text-xs font-bold text-[#00C2E0] dark:text-[#E5F7FF]">
                Especialistas de Nivel Internacional
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0077D4]/15 text-[#00C2E0] flex items-center justify-center text-lg sm:text-xl shrink-0 font-bold">
              ✨
            </div>
            <div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                0% Dolor
              </div>
              <div className="text-xs font-bold text-[#00C2E0] dark:text-[#E5F7FF]">
                Sedación & Anestesia Digital
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
