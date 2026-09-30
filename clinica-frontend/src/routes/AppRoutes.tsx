import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { UsersPage } from '../features/users/pages/UsersPage';
import { DashboardSubPage } from '../features/dashboard/pages/DashboardSubPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SettingsModal } from '../components/common/SettingsModal';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from './routes';

import { DoctorsPage } from '../features/doctors/pages/DoctorsPage';
import { PatientsPage } from '../features/patients/pages/PatientsPage';
import { OdontogramPage } from '../features/odontogram/pages/OdontogramPage';
import { SucursalesPage } from '../features/sucursales/pages/SucursalesPage';
import { CitasPage } from '../features/citas/pages/CitasPage';
import { ServiciosPage } from '../features/services/pages/ServiciosPage';
import { BoletasPage } from '../features/boletas/pages/BoletasPage';
import { ReportesPage } from '../features/reportes/pages/ReportesPage';
import { ExpedientesPage } from '../features/expedientes/pages/ExpedientesPage';
import { BackupsPage } from '../features/backups/pages/BackupsPage';
import { SupportPage } from '../features/support/pages/SupportPage';
import { useSettingsStore } from '../store/useSettingsStore';

export const AppRoutes: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);
  const toasterTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors theme={toasterTheme} />
      <SettingsModal />
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
            <Route path="/dashboard/doctors" element={<DoctorsPage />} />
            <Route path="/dashboard/branches" element={<SucursalesPage />} />
            <Route path="/dashboard/billing" element={<BoletasPage />} />
            <Route path="/dashboard/boletas" element={<BoletasPage />} />
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
    </BrowserRouter>
  );
};
