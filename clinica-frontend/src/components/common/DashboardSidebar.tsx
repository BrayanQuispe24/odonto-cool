import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  Activity,
  Stethoscope,
  UserCheck,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  X,
  Database,
} from 'lucide-react';
import { useSidebarStore } from '../../features/dashboard/store/useSidebarStore';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { logoutApi } from '../../features/auth/services/authService';
import { toast } from 'sonner';

export interface NavGroup {
  title: string;
  items: {
    name: string;
    path: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    roles?: string[]; // Si se define, solo los roles en el array lo pueden ver
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Agenda & Citas', path: '/dashboard/appointments', icon: CalendarDays, badge: '14' },
      { name: 'Pacientes', path: '/dashboard/patients', icon: Users, badge: 'Nuevo' },
    ],
  },
  {
    title: 'Clínica & 3D',
    items: [
      { name: 'Odontograma 3D', path: '/dashboard/odontogram', icon: Activity, badge: '3D', roles: ['Doctor'] },
      { name: 'Servicios & Precios', path: '/dashboard/servicios', icon: Stethoscope },
      { name: 'Piezas Dentales', path: '/dashboard/piezas-dentales', icon: Activity, roles: ['Administrador'] },
      { name: 'Doctores', path: '/dashboard/doctors', icon: UserCheck, roles: ['Administrador'] },
      { name: 'Consejos & Artículos', path: '/dashboard/consejos', icon: FileText, roles: ['Administrador'] },
    ],
  },
  {
    title: 'Administración',
    items: [
      { name: 'Sucursales', path: '/dashboard/branches', icon: Building2, badge: 'Tenant' },
      { name: 'Facturación', path: '/dashboard/billing', icon: CreditCard },
      { name: 'Reportes & Analítica', path: '/dashboard/reportes', icon: BarChart3, badge: 'PDF/Excel', roles: ['Administrador'] },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { name: 'Usuarios & Perfil', path: '/dashboard/users', icon: ShieldCheck },
      { name: 'Respaldos', path: '/dashboard/backups', icon: Database, roles: ['Administrador'] },
      { name: 'Configuración', path: '/dashboard/settings', icon: Settings },
      { name: 'Ayuda & Soporte', path: '/dashboard/support', icon: LifeBuoy },
    ],
  },
];

export const DashboardSidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const openSettingsModal = useSettingsStore((state) => state.openSettingsModal);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Safe fallback
    } finally {
      logout();
      toast.success('Sesión cerrada correctamente');
      navigate('/login');
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-ocean-deep/60 backdrop-blur-xs z-[90] lg:hidden transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen max-h-screen z-[100]
          flex flex-col bg-[#0840A8] text-blue-50 overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          border-r border-[#062F7D] shadow-2xl lg:shadow-none
          ${isCollapsed ? 'lg:w-[88px]' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#062F7D] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden pl-1">
            <div className="p-1 rounded bg-[#062F7D] border border-[#05286B] shrink-0">
              <img 
                src="/assets/images/image.png" 
                alt="ODONTO COOL Logo" 
                className="h-7 w-auto object-contain rounded-sm"
              />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col transition-all duration-200">
                <span className="text-small font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  ODONTO COOL
                  <span className="text-tiny px-1.5 py-0.5 rounded-sm bg-[#062F7D] text-[#00C2E0] font-bold">
                    PRO
                  </span>
                </span>
                <span className="text-tiny text-blue-200/70 font-medium mt-0.5">
                  Clínica Odontológica
                </span>
              </div>
            )}
          </div>

          {/* TOGGLE BUTTON (DESKTOP) */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
            className="hidden lg:flex w-7 h-7 rounded-sm bg-[#062F7D] hover:bg-[#05286B] text-blue-200 hover:text-white items-center justify-center transition-colors cursor-pointer border border-[#05286B]"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* CLOSE BUTTON (MOBILE) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex lg:hidden w-8 h-8 rounded-sm bg-[#062F7D] text-blue-200 hover:text-white items-center justify-center border border-[#05286B]"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION LINKS CONTAINER (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-blue-800 scroll-smooth">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* GROUP TITLE */}
              {(!isCollapsed || isMobileOpen) ? (
                <h3 className="px-3 text-tiny font-bold uppercase tracking-widest text-blue-300/70 mb-2">
                  {group.title}
                </h3>
              ) : (
                <div className="h-0 border-b border-[#062F7D] mx-2 my-4" />
              )}

              {/* ITEMS */}
              {group.items.filter(item => !item.roles || (user?.rol && item.roles.includes(user.rol.nombre))).map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (item.path === '/dashboard/settings') {
                        e.preventDefault();
                        openSettingsModal();
                      }
                    }}
                    className={({ isActive }) => `
                      relative group flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-medium
                      transition-colors cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#062F7D] text-white shadow-none before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-[#00C2E0] before:rounded-r-sm'
                          : 'text-blue-100/80 hover:text-white hover:bg-[#062F7D]/60'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent
                          size={18}
                          className={`shrink-0 transition-colors ${
                            isActive ? 'text-[#00C2E0]' : 'group-hover:text-blue-200'
                          }`}
                        />

                        {/* TEXT & BADGE (EXPANDED OR MOBILE) */}
                        {(!isCollapsed || isMobileOpen) && (
                          <div className="flex items-center justify-between flex-1 overflow-hidden">
                            <span className="truncate">
                              {item.name === 'Usuarios & Perfil' && user?.rol?.nombre !== 'Administrador' ? 'Mi Perfil' : item.name}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-tiny px-1.5 py-0.5 rounded-sm font-bold bg-[#062F7D] border border-[#05286B] text-blue-200`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* RETRACTED TOOLTIP (DESKTOP COLLAPSED ONLY) */}
                        {isCollapsed && !isMobileOpen && (
                          <div className="pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 absolute left-full ml-3 px-2 py-1.5 bg-[#05286B] text-white text-xs font-semibold rounded-sm whitespace-nowrap shadow-lg border border-[#041F54] z-[120] flex items-center gap-2">
                            <span>
                              {item.name === 'Usuarios & Perfil' && user?.rol?.nombre !== 'Administrador' ? 'Mi Perfil' : item.name}
                            </span>
                            {item.badge && (
                              <span className={`text-tiny px-1.5 py-0.5 rounded-sm bg-[#041F54] border border-[#031842] text-blue-200`}>
                                {item.badge}
                              </span>
                            )}
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#05286B] border-l border-b border-[#041F54] rotate-45" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}


        </div>

        {/* FOOTER USER CARD & LOGOUT BUTTON (FIXED AT BOTTOM) */}
        <div className="p-3 border-t border-[#062F7D] bg-[#05286B] shrink-0">
          <div
            className={`flex items-center ${
              isCollapsed && !isMobileOpen ? 'flex-col gap-2 justify-center' : 'justify-between gap-2.5'
            }`}
          >
            {/* AVATAR + INFO */}
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop"
                  alt={user?.email || 'Usuario'}
                  className="w-9 h-9 rounded-sm object-cover border border-[#041F54]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00C2E0] border-2 border-[#05286B] rounded-full" />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {user?.email || user?.codigo_usuario || 'Administrador'}
                    <ShieldCheck size={12} className="text-blue-300 shrink-0" />
                  </span>
                  <span className="text-tiny text-blue-200/80 truncate font-medium">
                    {user?.rol?.nombre || 'Administrador'}
                  </span>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className={`
                rounded-sm bg-[#041F54] hover:bg-rose-500/20 text-blue-200 hover:text-rose-200 border border-[#041F54] hover:border-rose-500/30
                flex items-center justify-center transition-colors cursor-pointer shrink-0
                ${isCollapsed && !isMobileOpen ? 'w-9 h-9' : 'px-2.5 py-1.5 text-xs font-medium gap-1.5'}
              `}
            >
              <LogOut size={15} />
              {(!isCollapsed || isMobileOpen) && <span>Salir</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
