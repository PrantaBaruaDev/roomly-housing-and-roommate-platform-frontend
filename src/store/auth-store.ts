import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";
import { clearRoleCookie, setRoleCookie } from "@/lib/auth-cookie";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => {
        set({ user, accessToken });        
        setRoleCookie(user.role);
      },
      clearSession: () => {
        set({ user: null, accessToken: null });
        clearRoleCookie();
      },
    }),
    { 
      name: "roomly-auth",
      
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),

      onRehydrateStorage: () => (state) => {
        if (state?.user) setRoleCookie(state.user.role);
      },

    }
  )
);
