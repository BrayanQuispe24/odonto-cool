# Directivas y Reglas Obligatorias del Proyecto (Clinica Dental Frontend)

Las siguientes reglas y habilidades (*skills*) son de aplicación estricta e incondicional en todas las tareas, generaciones de código, refactorizaciones y auditorías de este proyecto:

## 1. Arquitectura Frontend Estricta (`react-frontend-architecture`)
- **Estructura Modular por Feature (`src/features/`)**: Todo el código de negocio debe vivir dentro de su feature correspondiente (`auth`, `landing`, `users`, `patients`, `appointments`, `dashboard`, etc.). Ninguna feature debe importar archivos internos privados de otra feature.
- **Componentes UI vs Common**:
  - `src/components/ui/`: Componentes puramente visuales y genéricos (`Button.tsx`, `Badge.tsx`, `Input.tsx`, `Modal.tsx`, `Table.tsx`, etc.).
  - `src/components/common/`: Componentes reutilizables globales a nivel de UI de aplicación (`Navbar.tsx`, `MobileDrawer.tsx`, `Footer.tsx`, `TopAnnouncementBar.tsx`).
- **Gestión de Estado Servidor vs Cliente**:
  - **TanStack Query (v5)** para todo el estado proveniente del servidor / peticiones API.
  - **Zustand** únicamente para estado global del cliente (usuario autenticado, token, tema visual, modales globales). PROHIBIDO duplicar datos obtenidos de la API dentro de Zustand.
- **Servicios e Interceptores**: Instancia centralizada de Axios en `src/services/api.ts` consumida por los servicios de cada feature (`features/{feature}/services/`).
- **Formularios & Validación**: Formularios construidos obligatoriamente con **React Hook Form** + **Zod**.

## 2. Calidad Estética y Anti-Slop (`design-taste-frontend`, `high-end-visual-design`)
- **Estilos con Tailwind CSS v4**: Uso obligatorio de `@import "tailwindcss";` y definición de tokens en `@theme` en `src/index.css`.
- **Paleta de Colores Bloqueada**:
  - Deep Ocean: `#0C3B45` (`bg-ocean-deep`, `text-ocean-deep`)
  - Medium Teal: `#3E9B94` (`bg-teal-main`, `text-teal-main`)
  - Soft Teal: `#88C9C4` (`bg-teal-soft`, `text-teal-soft`)
  - Ice Mint: `#CFF0EA` (`bg-mint-light`, `text-mint-light`)
  - Soft Tint Primary: `#F3FAF9` (`bg-bg-primary`)
- **Tipografía**: Combinación de `Outfit` para títulos display y `Plus Jakarta Sans` para lectura de cuerpo.
- **Sin Elementos Genéricos ni Placeholders**: Toda imagen debe ser un asset real o una ilustración 3D de alta calidad generada ad-hoc.

## 3. Ingeniería de Animaciones y Micro-interacciones (`emil-design-eng`, `ask-sonner`, `mobile-native`)
- **Tactile Feedback**: Presionado reactivo en botones y elementos interactivos (`active:scale-97`).
- **Duración y Easing**: Animaciones de UI bajo los 300ms con curvas personalizadas `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Toast Notifications**: Uso de **Sonner** (`toast.success()`, `toast.error()`) montado en la raíz para notificaciones.
- **Responsividad Nativa**: Menús colapsables con drawer lateral, soporte de gestos táctiles y reemplazo de `h-screen` por `min-h-[100dvh]`.
