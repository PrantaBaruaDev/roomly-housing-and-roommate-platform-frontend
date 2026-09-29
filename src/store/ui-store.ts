import { create } from "zustand";

interface UIState {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
}));
