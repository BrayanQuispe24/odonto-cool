import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

import { Navbar } from '../components/common/Navbar';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Footer } from '../components/common/Footer';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';

import { HeroSection } from '../features/landing/components/HeroSection';
import { SpecialtiesSection } from '../features/landing/components/SpecialtiesSection';
import { DoctorsShowcaseSection } from '../features/landing/components/DoctorsShowcaseSection';
import { FacilitiesSection } from '../features/landing/components/FacilitiesSection';
import { ArticlesSection } from '../features/landing/components/ArticlesSection';
import { FAQSection } from '../features/landing/components/FAQSection';

import { getPublicLandingSettingsApi } from '../features/landing-config/services/landingConfigService';
import type { LandingSettingsData } from '../features/landing-config/types/landingConfig';

export const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<LandingSettingsData | null>(null);

  // Initialize IntersectionObserver scroll reveal animations
  useScrollReveal();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicLandingSettingsApi();
        setSettings(data);
      } catch (e) {
        console.error('Error al cargar la configuración de la landing page', e);
      }
    };
    loadSettings();
  }, []);

  const handleOpenModal = () => {
    const whatsappNum = settings?.contacto?.whatsapp || '59178494110';
    const whatsappMsg = encodeURIComponent(
      settings?.contacto?.whatsapp_mensaje || 'Hola, quisiera agendar una cita diagnóstica.'
    );
    window.open(`https://wa.me/${whatsappNum}?text=${whatsappMsg}`, '_blank');
  };

  const handleToggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans antialiased overflow-x-hidden">
      {/* Sticky Header with dynamic announcement banner */}
      <Navbar
        onOpenModal={handleOpenModal}
        onToggleMobileMenu={handleToggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        anuncio={settings?.anuncio_top}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        onOpenModal={handleOpenModal}
      />

      {/* Main Content Sections with visibility switches */}
      <main>
        {(!settings || settings.secciones_visibles?.hero) && (
          <HeroSection config={settings?.hero} onOpenModal={handleOpenModal} />
        )}

        {(!settings || settings.secciones_visibles?.especialidades) && (
          <SpecialtiesSection onOpenModal={handleOpenModal} />
        )}

        {(!settings || settings.secciones_visibles?.doctores) && (
          <DoctorsShowcaseSection onOpenModal={handleOpenModal} />
        )}

        {(!settings || settings.secciones_visibles?.instalaciones) && (
          <FacilitiesSection />
        )}

        {(!settings || settings.secciones_visibles?.articulos) && (
          <ArticlesSection onOpenModal={handleOpenModal} />
        )}

        {(!settings || settings.secciones_visibles?.faqs) && (
          <FAQSection contacto={settings?.contacto} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget with dynamic number & message */}
      <FloatingWhatsApp
        whatsapp={settings?.contacto?.whatsapp}
        mensaje={settings?.contacto?.whatsapp_mensaje}
      />
    </div>
  );
};