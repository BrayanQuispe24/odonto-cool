import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/landingData';

export const FAQSection: React.FC = () => {
  const [activeFaqId, setActiveFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setActiveFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 bg-[#001026] text-white border-b border-[#00C2E0]/15 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="reveal grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left info column */}
          <div className="reveal-left lg:col-span-5">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
              Resolvemos tus dudas habituales sobre nuestros tratamientos, garantías y facilidades de pago.
            </p>

            <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-[#002D5E] rounded-2xl border border-[#00C2E0]/20 shadow-md">
              <div className="font-bold text-white mb-2 flex items-center gap-2 text-sm sm:text-base">
                📍 Ubicación & Contacto
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Av. Principal 1230, Centro Médico Lux, Piso 4<br />
                📞 Teléfono Directo: (02) 294-8500<br />
                💬 WhatsApp Citas: +593 99 123 4567<br />
                ⏰ Horario: Lun - Sáb de 8:00 AM a 8:00 PM
              </div>
            </div>
          </div>

          {/* Right accordion column */}
          <div className="reveal-right lg:col-span-7 flex flex-col">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border-b border-white/15 py-4 sm:py-5 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base md:text-lg font-semibold text-white cursor-pointer group"
                  >
                    <span className="group-hover:text-[#00C2E0] transition-colors pr-2">
                      {faq.question}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-[#00C2E0] ml-2 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
                  >
                    <div className="overflow-hidden text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
