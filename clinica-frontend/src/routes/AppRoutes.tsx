import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SettingsModal } from '../components/common/SettingsModal';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';
import { useSettingsStore } from '../store/useSettingsStore';

// Carga perezosa (Lazy loading) para aislar Three.js, React-PDF, XLSX y páginas del bundle inicial
const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage })));
const DashboardSubPage = lazy(() => import('../features/dashboard/pages/DashboardSubPage').then((m) => ({ default: m.DashboardSubPage })));
const DoctorsPage = lazy(() => import('../features/doctors/pages/DoctorsPage').then((m) => ({ default: m.DoctorsPage })));
const PatientsPage = lazy(() => import('../features/patients/pages/PatientsPage').then((m) => ({ default: m.PatientsPage })));
const OdontogramPage = lazy(() => import('../features/odontogram/pages/OdontogramPage').then((m) => ({ default: m.OdontogramPage })));
const SucursalesPage = lazy(() => import('../features/sucursales/pages/SucursalesPage').then((m) => ({ default: m.SucursalesPage })));
const CitasPage = lazy(() => import('../features/citas/pages/CitasPage').then((m) => ({ default: m.CitasPage })));
const ServiciosPage = lazy(() => import('../features/services/pages/ServiciosPage').then((m) => ({ default: m.ServiciosPage })));
const PiezasDentalesPage = lazy(() => import('../features/dientes/pages/PiezasDentalesPage').then((m) => ({ default: m.PiezasDentalesPage })));
const BoletasPage = lazy(() => import('../features/boletas/pages/BoletasPage').then((m) => ({ default: m.BoletasPage })));
const ReportesPage = lazy(() => import('../features/reportes/pages/ReportesPage').then((m) => ({ default: m.ReportesPage })));
const ExpedientesPage = lazy(() => import('../features/expedientes/pages/ExpedientesPage').then((m) => ({ default: m.ExpedientesPage })));
const ConsejosPage = lazy(() => import('../features/consejos/pages/ConsejosPage').then((m) => ({ default: m.ConsejosPage })));
const LandingConfigPage = lazy(() => import('../features/landing-config/pages/LandingConfigPage').then((m) => ({ default: m.LandingConfigPage })));
const LandingFaqsPage = lazy(() => import('../features/landing-faqs/pages/LandingFaqsPage').then((m) => ({ default: m.LandingFaqsPage })));
const LandingDestacadosPage = lazy(() => import('../features/landing-destacados/pages/LandingDestacadosPage').then((m) => ({ default: m.LandingDestacadosPage })));
const ProformasPage = lazy(() => import('../features/proformas/pages/ProformasPage').then((m) => ({ default: m.ProformasPage })));
const BackupsPage = lazy(() => import('../features/backups/pages/BackupsPage').then((m) => ({ default: m.BackupsPage })));
const SupportPage = lazy(() => import('../features/support/pages/SupportPage').then((m) => ({ default: m.SupportPage })));

const RouteFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] w-full py-16 text-slate-400">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
      Cargando módulo...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const toasterTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors theme={toasterTheme} />
      <SettingsModal />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* PUBLIC ROUTES (ONLY Landing Page & Login) */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* PROTECTED PRIVATE DASHBOARD ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path="/dashboard/appointments" element={<CitasPage />} />
              <Route path="/dashboard/patients" element={<PatientsPage />} />
              <Route path="/dashboard/records" element={<ExpedientesPage />} />
              <Route path="/dashboard/odontogram" element={<OdontogramPage />} />
              <Route path="/dashboard/treatments" element={<ServiciosPage />} />
              <Route path="/dashboard/servicios" element={<ServiciosPage />} />
              <Route path="/dashboard/piezas-dentales" element={<PiezasDentalesPage />} />
              <Route path="/dashboard/landing/ajustes" element={<LandingConfigPage />} />
              <Route path="/dashboard/landing/articulos" element={<ConsejosPage />} />
              <Route path="/dashboard/landing/faqs" element={<LandingFaqsPage />} />
              <Route path="/dashboard/landing/destacados" element={<LandingDestacadosPage />} />
              <Route path="/dashboard/consejos" element={<ConsejosPage />} />
              <Route path="/dashboard/doctors" element={<DoctorsPage />} />
              <Route path="/dashboard/branches" element={<SucursalesPage />} />
              <Route path="/dashboard/billing" element={<BoletasPage />} />
              <Route path="/dashboard/boletas" element={<BoletasPage />} />
              <Route path="/dashboard/proformas" element={<ProformasPage />} />
              <Route path="/dashboard/presupuestos" element={<ProformasPage />} />
              <Route path="/dashboard/analytics" element={<ReportesPage />} />
              <Route path="/dashboard/reportes" element={<ReportesPage />} />
              <Route path="/dashboard/users" element={<UsersPage />} />
              <Route path="/dashboard/backups" element={<BackupsPage />} />
              <Route
                path="/dashboard/settings"
                element={
                  <DashboardSubPage
                    title="Configuración de Sistema"
                    description="Ajustes de clínica, permisos de usuarios, notificaciones y backups."
                    category="Sistema"
                  />
                }
              />
              <Route path="/dashboard/support" element={<SupportPage />} />
            </Route>
          </Route>

          {/* FALLBACK REDIRECT FOR UNMATCHED ROUTES */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

