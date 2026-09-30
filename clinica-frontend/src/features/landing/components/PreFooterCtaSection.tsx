import React from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface PreFooterCtaSectionProps {
  onOpenModal: () => void;
}

export const PreFooterCtaSection: React.FC<PreFooterCtaSectionProps> = ({
  onOpenModal,
}) => {
  return (
    <section id="cta-prefooter" className="py-12 sm:py-20 bg-[#001433] text-white border-b border-[#00C2E0]/15 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="reveal bg-gradient-to-br from-[#002D5E] via-[#0840A8] to-[#0077D4] rounded-2xl sm:rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center text-white border border-[#00C2E0]/25 shadow-xl">
          <div className="reveal-left p-6 sm:p-10 md:p-14">
            <Badge variant="mint" className="mb-4 sm:mb-5">
              🎁 Promoción de Bienvenida
            </Badge>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-[3rem] font-extrabold text-white mb-3 sm:mb-4 leading-tight">
              Tu consulta diagnóstica + Evaluación Digital con 50% OFF
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-cyan-100 mb-6 sm:mb-8 leading-relaxed">
              Incluye valoración clínica completa por especialista, radiografía digital panorámica y plan de tratamiento personalizado sin compromiso.
            </p>
            <Button variant="teal" size="lg" onClick={onOpenModal} className="w-full sm:w-auto">
              Agendar Cita Diagnóstica ➔
            </Button>
          </div>

          <div className="reveal-right h-full">
            <img
              src="/assets/images/dental_reception.png"
              alt="Recepción confortable de ODONTO COOL"
              className="w-full h-full min-h-[240px] sm:min-h-[340px] lg:min-h-[440px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
