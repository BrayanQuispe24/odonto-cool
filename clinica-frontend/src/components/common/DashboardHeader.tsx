import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles,
  Clock,
  Sun,
  Moon,
} from 'lucide-react';
import { useSidebarStore } from '../../features/dashboard/store/useSidebarStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { AppointmentModal } from '../../features/landing/components/AppointmentModal';
import { toast } from 'sonner';

export const DashboardHeader: React.FC = () => {
  const { setMobileOpen, toggleCollapse, isCollapsed } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const openSettingsModal = useSettingsStore((state) => state.openSettingsModal);
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Nueva Cita Confirmada',
      desc: 'María Fernández confirmó su cita de Limpieza Ultrasónica a las 4:00 PM.',
      time: 'Hace 5 min',
      unread: true,
    },
    {
      id: 2,
      title: 'Radiografía 3D lista',
      desc: 'El estudio Tomográfico de Juan Pérez fue procesado correctamente.',
      time: 'Hace 30 min',
      unread: true,
    },
    {
      id: 3,
      title: 'Recordatorio de Stock',
      desc: 'Resina Fotocurable A2 está por debajo del nivel mínimo.',
      time: 'Hace 2 horas',
      unread: false,
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
  };

  return (
    <>
      <header className="h-16 shrink-0 px-4 sm:px-8 bg-white/95 dark:bg-[#0840A8]/95 backdrop-blur-md border-b border-primary-dark/10 dark:border-secondary/20 flex items-center justify-between gap-4 sticky top-0 z-40 shadow-xs transition-colors duration-300">
        {/* LEFT SECTION: MOBILE TOGGLE & SEARCH */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-light-surface dark:bg-dark-surface text-primary-dark dark:text-white hover:bg-white transition-colors active:scale-95 cursor-pointer border border-primary-dark/20 dark:border-secondary/30"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>

          {/* DESKTOP QUICK RETRACT SIDEBAR TOGGLE ICON */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-light-surface dark:bg-dark-surface text-primary-dark dark:text-white hover:bg-white text-xs font-semibold border border-primary-dark/15 dark:border-secondary/30 transition-all active:scale-95 cursor-pointer"
            title={isCollapsed ? 'Expandir Sidebar' : 'Contraer Sidebar'}
          >
            <span className="w-2 h-2 rounded-full bg-[#00C2E0] animate-pulse" />
            <span className="text-small font-display font-extrabold text-primary-dark dark:text-white">
              {isCollapsed ? 'Sidebar Retraído' : 'Modo Expandido'}
            </span>
          </button>

          {/* SEARCH BAR */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary dark:text-secondary"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar paciente, expediente, cita o doctor... (Presiona ⌘K)"
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-light-surface dark:bg-dark-surface border border-primary-dark/15 dark:border-secondary/30 text-xs font-semibold text-primary-dark dark:text-white placeholder-[#0077D4]/60 dark:placeholder-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/dashboard/patients?search=${encodeURIComponent(e.currentTarget.value)}`);
                }
              }}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white dark:bg-dark-bg border border-primary-dark/15 dark:border-secondary/30 text-tiny font-mono font-bold text-primary-dark dark:text-secondary shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* RIGHT SECTION: ACTIONS & PROFILE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* QUICK ACTION BUTTON */}
          {user?.rol?.nombre === 'Doctor' && (
            <button
              onClick={() => navigate('/dashboard/appointments')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-[#00C2E0] hover:to-[#0077D4] text-white text-xs font-extrabold shadow-md shadow-[#0077D4]/25 hover:shadow-lg active:scale-97 transition-all cursor-pointer border border-secondary/40"
            >
              <Plus size={16} className="text-white" />
              <span className="hidden md:inline">Nueva Cita</span>
            </button>
          )}

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={() => {
              const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              setTheme(isDark ? 'light' : 'dark');
            }}
            className="p-2 rounded-xl bg-light-surface dark:bg-dark-surface hover:bg-white dark:hover:bg-[#0840A8] text-primary-dark dark:text-secondary transition-all active:scale-95 cursor-pointer border border-primary-dark/15 dark:border-secondary/30"
            title={theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
              ? <Sun size={18} />
              : <Moon size={18} />
            }
          </button>

          {/* THEME TOGGLE BUTTON */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              aria-expanded={showUserDropdown}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-light-surface dark:hover:bg-dark-surface transition-colors active:scale-97 cursor-pointer border border-transparent hover:border-primary-dark/15 dark:hover:border-secondary/30"
            >
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
                alt="Avatar doctor"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-extrabold text-primary-dark dark:text-white leading-tight">
                  {user?.email || 'Dr. Carlos Arispe'}
                </span>
                <span className="text-tiny text-primary dark:text-secondary font-semibold">
                  {user?.rol?.nombre || 'Administrador'}
                </span>
              </div>
              <ChevronDown size={14} className="text-primary-dark dark:text-secondary hidden sm:block" />
            </button>

            {/* USER MENU */}
            {showUserDropdown ? (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-primary-dark/15 dark:border-secondary/30 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 bg-light-surface dark:bg-[#0840A8]/40 rounded-xl mb-2 border border-primary-dark/15 dark:border-secondary/20">
                  <p className="text-xs font-extrabold text-primary-dark dark:text-white truncate">{user?.email}</p>
                  <p className="text-small text-primary dark:text-secondary truncate font-semibold">{user?.rol?.nombre || 'Usuario'}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-primary-dark dark:text-white hover:bg-light-surface dark:hover:bg-[#0840A8]/50 transition-colors cursor-pointer"
                  >
                    <User size={15} className="text-primary dark:text-secondary" />
                    Mi Perfil Profesional
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      openSettingsModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-primary-dark dark:text-white hover:bg-light-surface dark:hover:bg-[#0840A8]/50 transition-colors cursor-pointer"
                  >
                    <Settings size={15} className="text-primary dark:text-secondary" />
                    Ajustes de Clínica
                  </button>
                  <div className="h-px bg-[#0840A8]/15 dark:bg-[#00C2E0]/20 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* APPOINTMENT MODAL */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </>
  );
};

