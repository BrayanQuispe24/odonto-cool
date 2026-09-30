import React from 'react';
import { ARTICLES } from '../data/landingData';

interface ArticlesSectionProps {
  onOpenModal: () => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  onOpenModal,
}) => {
  return (
    <section id="historias" className="py-16 sm:py-24 bg-[#001C3D] text-white border-b border-[#00C2E0]/15 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="reveal text-center max-w-[720px] mx-auto mb-8 sm:mb-12">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white mb-3 sm:mb-4 tracking-tight leading-tight">
            Consejos y Salud Oral
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-bold text-slate-200 leading-relaxed">
            Artículos y guías redactados por nuestros especialistas para cuidar la salud de tu boca.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {ARTICLES.map((article, idx) => (
            <article
              key={article.id}
              className={`reveal stagger-${idx + 1} group bg-[#002D5E] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#0077D4]/30 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:border-[#0077D4] transition-all duration-300 flex flex-col`}
            >
              <div className="h-[180px] sm:h-[200px] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#00C2E0] mb-2">
                  {article.tag}
                </span>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-white mb-2 sm:mb-3 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-200 mb-4 sm:mb-5 leading-relaxed">
                  {article.description}
                </p>
                <button
                  onClick={onOpenModal}
                  className="mt-auto text-xs sm:text-sm font-bold text-[#00C2E0] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Leer artículo ➔
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
