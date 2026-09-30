import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../features/auth/store/authStore';

interface NavbarProps {
  onOpenModal: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenModal,
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setIsScrolled(scrollTop > 30);

      const sections = ['hero', 'especialidades', 'simulador', 'tecnologia', 'especialistas', 'faq'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Inicio', id: 'hero' },
    { href: '#especialidades', label: 'Tratamientos', id: 'especialidades' },
    { href: '#simulador', label: 'Casos Clínicos', id: 'simulador' },
    { href: '#tecnologia', label: 'Tecnología', id: 'tecnologia' },
    { href: '#especialistas', label: 'Especialistas', id: 'especialistas' },
    { href: '#faq', label: 'Preguntas', id: 'faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1000] bg-[#001433]/90 dark:bg-[#001026]/90 backdrop-blur-xl border-b border-[#00C2E0]/30 transition-all duration-300 ${
        isScrolled ? 'shadow-[0_12px_40px_rgba(0,10,36,0.6)] bg-[#000E24]/95 border-b border-[#00C2E0]/45' : 'shadow-[0_8px_32px_rgba(0,16,41,0.4)]'
      }`}
    >

      <div
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#0077D4] to-[#00C2E0] transition-[width] duration-100 ease-linear z-[1001]"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 font-display text-2xl font-extrabold text-white shrink-0">
          <div className="p-1 rounded-xl bg-white/10 shadow-sm border border-[#00C2E0]/30 backdrop-blur-xs">
            <img 
              src="/assets/images/image.png" 
              alt="ODONTO COOL Logo" 
              className="h-9 w-auto object-contain rounded-lg"
            />
          </div>
          <span>ODONTO COOL</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-8 xl:ml-14">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`text-sm whitespace-nowrap py-1.5 relative transition-colors duration-200 ${
                  isActive
                    ? 'text-[#00C2E0] font-extrabold'
                    : 'text-slate-200 hover:text-[#00C2E0] font-bold'
                }`}
              >
                {link.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00C2E0] rounded-full shadow-[0_0_8px_#00C2E0]" />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-3.5 shrink-0 ml-auto">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="light" size="md" className="border-2 border-[#00C2E0]/40 font-extrabold text-white bg-white/10 hover:bg-white/20 hover:border-[#00C2E0]">
                  Dashboard 👤
                </Button>
              </Link>
              <Button variant="dark" size="md" onClick={logout}>
                Salir
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="light" size="md" className="border-2 border-[#00C2E0]/40 font-extrabold text-white bg-white/10 hover:bg-white/20 hover:border-[#00C2E0]">
                Acceso 🔑
              </Button>
            </Link>
          )}

          <Button
            variant="teal"
            size="md"
            onClick={onOpenModal}
            className="shadow-lg shadow-[#0077D4]/40 hover:shadow-xl hover:shadow-[#00C2E0]/50 hover:-translate-y-0.5 transition-all ring-2 ring-[#0077D4]/30"
          >
            Agendar Cita ➔
          </Button>
        </div>

        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden flex flex-col justify-between w-[26px] h-[18px] bg-transparent cursor-pointer z-[1002]"
          aria-label="Abrir menú de navegación"
        >
          <span
            className={`block w-full h-[2px] bg-[#0840A8] dark:bg-white rounded-sm transition-all duration-300 ${
              isMobileMenuOpen ? 'translate-y-[8px] rotate-45' : ''
            }`}
          />
          <span
            className={`block w-full h-[2px] bg-[#0840A8] dark:bg-white rounded-sm transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-full h-[2px] bg-[#0840A8] dark:bg-white rounded-sm transition-all duration-300 ${
              isMobileMenuOpen ? '-translate-y-[8px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>
    </header>

  );
};
