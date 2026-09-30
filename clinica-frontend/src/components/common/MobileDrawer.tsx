import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../features/auth/store/authStore';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenModal: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenModal,
}) => {
  const { isAuthenticated, logout } = useAuthStore();

  const navLinks = [
    { href: '#hero', label: 'Inicio' },
    { href: '#especialidades', label: 'Especialidades' },
    { href: '#simulador', label: 'Antes & Después' },
    { href: '#tecnologia', label: 'Tecnología' },
    { href: '#especialistas', label: 'Especialistas' },
    { href: '#faq', label: 'Preguntas' },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#002D5E]/80 backdrop-blur-xs z-[1001] lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Slide-over drawer */}
      <div
        className={`fixed top-0 right-0 w-[85%] max-w-[320px] h-full bg-[#0840A8] text-white z-[1002] p-6 pt-20 flex flex-col justify-between shadow-[-10px_0_30px_rgba(0,0,0,0.4)] border-l border-[#00C2E0]/20 transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#00C2E0]/20">
          <div className="p-1 bg-white/10 rounded-xl border border-[#00C2E0]/30">
            <img 
              src="/assets/images/image.png" 
              alt="ODONTO COOL Logo" 
              className="h-8 w-auto object-contain rounded-lg"
            />
          </div>
          <span className="font-display text-xl font-extrabold text-white">ODONTO COOL</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center text-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Cerrar menú"
        >
          ✕
        </button>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 mt-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-[#00C2E0] text-base sm:text-lg font-semibold hover:text-white transition-colors py-1 border-b border-[#00C2E0]/15"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-mint-light/15 mt-auto flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={onClose}>
                <Button variant="light" size="md" className="w-full justify-center">
                  Dashboard 👤
                </Button>
              </Link>
              <Button
                variant="dark"
                size="md"
                className="w-full justify-center"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link to="/login" onClick={onClose}>
              <Button variant="light" size="md" className="w-full justify-center">
                Iniciar Sesión 🔑
              </Button>
            </Link>
          )}

          <Button
            variant="teal"
            size="md"
            className="w-full justify-center py-3.5"
            onClick={() => {
              onClose();
              onOpenModal();
            }}
          >
            Agendar Cita ➔
          </Button>
        </div>
      </div>
    </>
  );
};
