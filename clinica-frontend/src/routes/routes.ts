export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;

export interface RouteConfig {
  path: string;
  isPublic: boolean;
  label: string;
}

export const PUBLIC_ROUTES: string[] = [ROUTES.HOME, ROUTES.LOGIN];

export const ROUTE_CONFIGS: RouteConfig[] = [
  { path: ROUTES.HOME, isPublic: true, label: 'Inicio' },
  { path: ROUTES.LOGIN, isPublic: true, label: 'Iniciar Sesión' },
  { path: ROUTES.DASHBOARD, isPublic: false, label: 'Dashboard Clínico' },
];
