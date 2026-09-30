import React, { useRef, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { SPECIALTY_CARDS } from '../data/landingData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SpecialtiesSectionProps {
  onOpenModal: () => void;
}

export const SpecialtiesSection: React.FC<SpecialtiesSectionProps> = ({
  onOpenModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsQueue, setCardsQueue] = useState([...SPECIALTY_CARDS]);
  const [isHovered, setIsHovered] = useState(false);
  
  // States for fluid animation
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transformOffset, setTransformOffset] = useState(0);
  const isAnimating = useRef(false);

  const getCardWidth = () => {
    const cardElement = containerRef.current?.firstElementChild as HTMLElement;
    return cardElement ? cardElement.offsetWidth + (window.innerWidth >= 640 ? 32 : 24) : 350;
  };

  const rotateLeft = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const shiftAmount = getCardWidth();

    // 1. Instantly rotate the queue and offset the container to hide the change
    flushSync(() => {
      setCardsQueue((prevQueue) => {
        const newQueue = [...prevQueue];
        const last = newQueue.pop();
        if (last) newQueue.unshift(last);
        return newQueue;
      });
      setIsTransitioning(false);
      setTransformOffset(-shiftAmount);
    });

    // 2. Animate the container back to 0 smoothly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
        setTransformOffset(0);
      });
    });

    setTimeout(() => {
      isAnimating.current = false;
    }, 600); // 600ms matches transition duration
  };

  const rotateRight = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const shiftAmount = getCardWidth();

    // 1. Smoothly slide the container to the left by one card
    flushSync(() => {
      setIsTransitioning(true);
      setTransformOffset(-shiftAmount);
    });

    // 2. After animation, instantly reset offset and rotate the queue
    setTimeout(() => {
      flushSync(() => {
        setIsTransitioning(false);
        setTransformOffset(0);
        setCardsQueue((prevQueue) => {
          const newQueue = [...prevQueue];
          const first = newQueue.shift();
          if (first) newQueue.push(first);
          return newQueue;
        });
      });
      isAnimating.current = false;
    }, 600); // 600ms matches transition duration
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered) return;
    
    const intervalId = setInterval(() => {
      rotateRight();
    }, 3500);

    return () => clearInterval(intervalId);
  }, [isHovered]);

  return (
    <section id="especialidades" className="py-16 sm:py-24 relative bg-[#001C3D] text-white border-b border-[#00C2E0]/15 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="reveal text-center max-w-[720px] mx-auto mb-8 sm:mb-12">
          <Badge variant="mint" className="mx-auto mb-3 sm:mb-4">
            ✨ Catálogo Clínico
          </Badge>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white mt-2 sm:mt-3 mb-3 sm:mb-4 tracking-tight leading-tight">
            Tratamientos Odontológicos de Alta Gama
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-bold text-slate-200 leading-relaxed">
            Explora todas nuestras especialidades clínicas. Soluciones personalizadas para tu salud dental.
          </p>
        </div>

        {/* Carousel Navigation Buttons (Desktop) */}
        <div className="hidden md:flex justify-end gap-3 mb-4 pr-2">
          <button
            onClick={rotateLeft}
            className="w-12 h-12 rounded-full bg-[#002D5E] hover:bg-[#0077D4] text-white border border-[#0077D4]/30 flex items-center justify-center transition-all shadow-lg hover:shadow-cyan-500/20"
            aria-label="Ver tratamientos anteriores"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={rotateRight}
            className="w-12 h-12 rounded-full bg-[#002D5E] hover:bg-[#0077D4] text-white border border-[#0077D4]/30 flex items-center justify-center transition-all shadow-lg hover:shadow-cyan-500/20"
            aria-label="Ver siguientes tratamientos"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Viewport (Hides overflowing cards) */}
        <div 
          className="overflow-hidden pb-8 relative z-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated Track */}
          <div 
            ref={containerRef}
            className="flex gap-6 sm:gap-8 w-max"
            style={{ 
              transform: `translateX(${transformOffset}px)`,
              transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              willChange: 'transform'
            }}
          >
            {cardsQueue.map((card, idx) => {
              const isDark = card.cardVariant === 'dark';
              return (
                <div
                  key={card.id}
                  className={`shrink-0 w-[85vw] md:w-[45vw] lg:w-[350px] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:-translate-y-2 relative group ${
                    isDark
                      ? 'bg-[#002D5E] text-white border border-[#00C2E0]/20 shadow-xl shadow-black/20'
                      : 'bg-gradient-to-br from-[#0840A8] to-[#0077D4] text-white shadow-xl shadow-[#0840A8]/30'
                  }`}
                >
                  <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    <Badge
                      variant={card.badgeType === 'teal' ? 'teal' : 'dark'}
                      className="mb-4 sm:mb-5"
                    >
                      {card.badge}
                    </Badge>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-3">
                      {card.title}
                    </h3>
                    <p
                      className={`text-sm mt-3 leading-relaxed ${
                        isDark ? 'text-cyan-100/90' : 'text-white/90'
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 mt-8 pt-5 border-t border-white/15">
                    <span className="text-[#00C2E0] font-semibold text-sm">
                      {card.feature}
                    </span>
                    <Button
                      variant={isDark ? 'teal' : 'dark'}
                      size="sm"
                      onClick={onOpenModal}
                      className="w-full mt-2"
                    >
                      {card.btnText}
                    </Button>
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
