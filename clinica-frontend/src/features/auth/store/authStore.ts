import { create } from 'zustand';

export interface UserRole {
  id: number;
  nombre: string;
}

export interface User {
  id: number | string;
  codigo_usuario?: string;
  email: string;
  rol_id?: number;
  rol?: UserRole;
  name?: string;
  foto_perfil?: string | null;
  sucursal_id?: number;
  doctor?: {
    id: number;
    usuario_id?: number;
    sucursal_id?: number;
    nombre: string;
    apellido: string;
    telefonos?: string[];
    especialidades?: string[];
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedToken = localStorage.getItem('access_token');
  const savedUserJson = localStorage.getItem('user_data');
  let savedUser: User | null = null;
  try {
    savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;
  } catch (e) {
    savedUser = null;
  }

  return {
    user: savedUser,
    token: savedToken,
    isAuthenticated: Boolean(savedToken),
    setAuth: (user, token) => {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },
    updateUser: (updatedUser) => {
      set((state) => {
        if (!state.user) return state;
        const merged = { ...state.user, ...updatedUser };
        localStorage.setItem('user_data', JSON.stringify(merged));
        return { user: merged };
      });
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});
