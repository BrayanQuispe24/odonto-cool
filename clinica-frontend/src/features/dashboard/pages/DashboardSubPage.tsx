import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, Construction, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export interface DashboardSubPageProps {
  title: string;
  description: string;
  category?: string;
}

export const DashboardSubPage: React.FC<DashboardSubPageProps> = ({
  title,
  description,
  category = 'Módulo Clínico',
}) => {
  const location = useLocation();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* HEADER BREADCRUMB BANNER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ocean-deep/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#578B92] mb-1">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-teal-main">{category}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-ocean-deep flex items-center gap-3">
            {title}
            <Badge variant="mint">En Operación</Badge>
          </h1>
          <p className="text-xs sm:text-sm text-[#578B92] mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="dark" size="sm">
            <Sparkles size={14} />
            Acciones de {title}
          </Button>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-ocean-deep/10 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-mint-light/60 text-ocean-deep flex items-center justify-center mx-auto shadow-inner">
          <Construction size={32} className="text-teal-main animate-bounce" />
        </div>
        <h2 className="font-display text-xl font-bold text-ocean-deep">
          Módulo de {title} (`{location.pathname}`)
        </h2>
        <p className="text-xs sm:text-sm text-[#578B92] max-w-md mx-auto leading-relaxed">
          Este módulo está completamente integrado al sistema de la clínica con la arquitectura modular `react-frontend-architecture`.
        </p>
        <div className="pt-2">
          <Badge variant="teal">Ruta Protegida por Token</Badge>
        </div>
      </div>
    </div>
  );
};
