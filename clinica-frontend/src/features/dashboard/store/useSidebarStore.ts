import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activePath: string;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  setActivePath: (path: string) => void;
}

const STORAGE_KEY = 'novadental_sidebar_collapsed';

const getInitialCollapsed = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: getInitialCollapsed(),
  isMobileOpen: false,
  activePath: '/dashboard',
  toggleCollapse: () =>
    set((state) => {
      const next = !state.isCollapsed;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Error saving sidebar state', e);
      }
      return { isCollapsed: next };
    }),
  setCollapsed: (collapsed) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch (e) {
      console.error('Error saving sidebar state', e);
    }
    set({ isCollapsed: collapsed });
  },
  setMobileOpen: (open) => set({ isMobileOpen: open }),
  setActivePath: (path) => set({ activePath: path }),
}));
