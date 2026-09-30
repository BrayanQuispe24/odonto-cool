import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSizeOption = 'sm' | 'md' | 'lg';

interface SettingsState {
  theme: ThemeMode;
  fontSize: FontSizeOption;
  isSettingsModalOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (fontSize: FontSizeOption) => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  toggleSettingsModal: () => void;
}

/**
 * Resolve the effective theme ('light' | 'dark') from the stored preference.
 * When 'system', follows the OS prefers-color-scheme media query.
 */
const resolveEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
};

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('settings_theme') as ThemeMode;
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'light';
};

const getInitialFontSize = (): FontSizeOption => {
  const saved = localStorage.getItem('settings_font_size');
  if (saved === 'sm' || saved === 'md' || saved === 'lg') return saved;
  return 'md';
};

export const applySettingsToDOM = (theme: ThemeMode, fontSize: FontSizeOption) => {
  const root = document.documentElement;
  const effective = resolveEffectiveTheme(theme);

  if (effective === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply Font Size Data Attribute
  root.setAttribute('data-font-size', fontSize);
};

// Apply initial settings immediately on script load
const initialTheme = getInitialTheme();
const initialFontSize = getInitialFontSize();
applySettingsToDOM(initialTheme, initialFontSize);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: initialTheme,
  fontSize: initialFontSize,
  isSettingsModalOpen: false,

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('settings_theme', theme);
    applySettingsToDOM(theme, get().fontSize);
    set({ theme });
  },

  setFontSize: (fontSize: FontSizeOption) => {
    localStorage.setItem('settings_font_size', fontSize);
    applySettingsToDOM(get().theme, fontSize);
    set({ fontSize });
  },

  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
  toggleSettingsModal: () => set((state) => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),
}));

// Listen for OS theme changes when 'system' mode is active
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const state = useSettingsStore.getState();
    if (state.theme === 'system') {
      applySettingsToDOM('system', state.fontSize);
    }
  });
}

