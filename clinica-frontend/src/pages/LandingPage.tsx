import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

import { Navbar } from '../components/common/Navbar';
import { MobileDrawer } from '../components/common/MobileDrawer';
import { Footer } from '../components/common/Footer';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';

import { HeroSection } from '../features/landing/components/HeroSection';
import { SpecialtiesSection } from '../features/landing/components/SpecialtiesSection';
import { BeforeAfterSection } from '../features/landing/components/BeforeAfterSection';
import { DoctorsShowcaseSection } from '../features/landing/components/DoctorsShowcaseSection';
import { FacilitiesSection } from '../features/landing/components/FacilitiesSection';
import { ArticlesSection } from '../features/landing/components/ArticlesSection';
import { PreFooterCtaSection } from '../features/landing/components/PreFooterCtaSection';
import { FAQSection } from '../features/landing/components/FAQSection';
import { AppointmentModal } from '../features/landing/components/AppointmentModal';

export const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize IntersectionObserver scroll reveal animations
  useScrollReveal();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleToggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#001C3D] text-white font-sans antialiased overflow-x-hidden">
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
        <BeforeAfterSection onOpenModal={handleOpenModal} />
        <DoctorsShowcaseSection onOpenModal={handleOpenModal} />
        <FacilitiesSection />
        <ArticlesSection onOpenModal={handleOpenModal} />
        <PreFooterCtaSection onOpenModal={handleOpenModal} />
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Booking Appointment Modal */}
      <AppointmentModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};