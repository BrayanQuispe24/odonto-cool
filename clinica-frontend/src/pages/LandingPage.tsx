import React, { useState } from 'react';
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

export const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize IntersectionObserver scroll reveal animations
  useScrollReveal();

  const handleOpenModal = () => {
    window.open('https://wa.me/59178494110?text=Hola,%20quisiera%20agendar%20una%20cita%20diagn%C3%B3stica.', '_blank');
  };

  const handleToggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans antialiased overflow-x-hidden">
      {/* Sticky Header with embedded TopAnnouncementBar */}
      <Navbar
        onOpenModal={handleOpenModal}
        onToggleMobileMenu={handleToggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        onOpenModal={handleOpenModal}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection onOpenModal={handleOpenModal} />
        <SpecialtiesSection onOpenModal={handleOpenModal} />

        <DoctorsShowcaseSection onOpenModal={handleOpenModal} />
        <FacilitiesSection />
        <ArticlesSection onOpenModal={handleOpenModal} />

        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />
    </div>
  );
};