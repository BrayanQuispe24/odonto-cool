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
      { name: 'Agenda & Citas', path: '/dashboard/appointments', icon: CalendarDays, badge: '14', badgeColor: 'bg-teal-main text-white' },
      { name: 'Pacientes', path: '/dashboard/patients', icon: Users, badge: 'Nuevo', badgeColor: 'bg-mint-light text-ocean-deep font-bold' },
      { name: 'Expedientes', path: '/dashboard/records', icon: FileText },
    ],
  },
  {
    title: 'Clínica & 3D',
    items: [
      { name: 'Odontograma 3D', path: '/dashboard/odontogram', icon: Activity, badge: '3D', badgeColor: 'bg-emerald-500 text-white font-extrabold' },
      { name: 'Servicios & Precios', path: '/dashboard/servicios', icon: Stethoscope },
      { name: 'Doctores', path: '/dashboard/doctors', icon: UserCheck, roles: ['Administrador'] },
    ],
  },
  {
    title: 'Administración',
    items: [
      { name: 'Sucursales', path: '/dashboard/branches', icon: Building2, badge: 'Tenant', badgeColor: 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white font-bold' },
      { name: 'Facturación', path: '/dashboard/billing', icon: CreditCard },
      { name: 'Reportes & Analítica', path: '/dashboard/reportes', icon: BarChart3, badge: 'PDF/Excel', badgeColor: 'bg-[#002D5E] text-[#00C2E0] font-extrabold', roles: ['Administrador'] },
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
          flex flex-col bg-[#0840A8] text-white overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          border-r border-[#00C2E0]/20 shadow-2xl lg:shadow-none
          ${isCollapsed ? 'lg:w-[88px]' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* SIDEBAR HEADER */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/15 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden pl-1">
            <div className="p-1 rounded-xl bg-white/15 border border-[#00C2E0]/30 shrink-0">
              <img 
                src="/assets/images/image.png" 
                alt="ODONTO COOL Logo" 
                className="h-7 w-auto object-contain rounded-lg"
              />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col transition-all duration-200">
                <span className="font-display text-base font-black tracking-tight leading-none text-white flex items-center gap-1.5">
                  ODONTO COOL
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-[#00C2E0] font-bold">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-[#00C2E0] font-medium mt-0.5">
                  Clínica Odontológica
                </span>
              </div>
            )}
          </div>

          {/* TOGGLE BUTTON (DESKTOP) */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-[#00C2E0] hover:text-white items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ring-1 ring-white/10"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* CLOSE BUTTON (MOBILE) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex lg:hidden w-8 h-8 rounded-lg bg-white/10 text-white items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION LINKS CONTAINER (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* GROUP TITLE */}
              {(!isCollapsed || isMobileOpen) ? (
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#00C2E0] mb-1.5 font-display">
                  {group.title}
                </h3>
              ) : (
                <div className="h-3 border-b border-white/10 my-1.5" />
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
                      relative group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold
                      transition-all duration-200 active:scale-97 cursor-pointer
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0077D4] to-[#00C2E0] text-white shadow-md shadow-[#0077D4]/30 ring-1 ring-white/20'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent
                          size={18}
                          className={`shrink-0 transition-transform duration-200 ${
                            isActive ? 'text-white scale-110' : 'group-hover:scale-110 text-[#00C2E0]'
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
                                className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                                  item.badgeColor || 'bg-white/20 text-white'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {/* RETRACTED TOOLTIP (DESKTOP COLLAPSED ONLY) */}
                        {isCollapsed && !isMobileOpen && (
                          <div className="pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 absolute left-full ml-3 px-3 py-1.5 bg-[#002D5E] text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-2xl border border-[#00C2E0]/30 z-[120] flex items-center gap-2">
                            <span>
                              {item.name === 'Usuarios & Perfil' && user?.rol?.nombre !== 'Administrador' ? 'Mi Perfil' : item.name}
                            </span>
                            {item.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${item.badgeColor || 'bg-white/20'}`}>
                                {item.badge}
                              </span>
                            )}
                            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#002D5E] border-l border-b border-[#00C2E0]/30 rotate-45" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* RETRACTABLE PROMO BANNER (INSIDE SCROLLABLE AREA) */}
          {(!isCollapsed || isMobileOpen) && (
            <div className="p-3 mt-4 rounded-xl bg-gradient-to-br from-[#002D5E] to-[#0840A8] border border-[#00C2E0]/30 relative overflow-hidden hidden sm:block">
              <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-[#00C2E0]/20 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 text-[#00C2E0] text-xs font-bold mb-1">
                <Sparkles size={14} className="animate-pulse text-amber-300" />
                Sillones 100% Libres
              </div>
              <p className="text-[11px] text-slate-100 leading-tight">
                Próximo turno: 03:30 PM • Ortodoncia con Dr. Arispe
              </p>
            </div>
          )}
        </div>

        {/* FOOTER USER CARD & LOGOUT BUTTON (FIXED AT BOTTOM) */}
        <div className="p-3 border-t border-white/15 bg-[#001C3D]/60 shrink-0">
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
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-[#00C2E0]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00C2E0] border-2 border-[#0840A8] rounded-full" />
              </div>

              {(!isCollapsed || isMobileOpen) && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                    {user?.email || user?.codigo_usuario || 'Administrador'}
                    <ShieldCheck size={12} className="text-[#00C2E0] shrink-0" />
                  </span>
                  <span className="text-[10px] text-[#00C2E0] truncate font-medium">
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
                rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-500/30
                flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0
                ${isCollapsed && !isMobileOpen ? 'w-9 h-9' : 'px-2.5 py-1.5 text-xs font-semibold gap-1.5'}
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
