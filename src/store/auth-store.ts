import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";
import { clearRoleCookie, setRoleCookie } from "@/lib/auth-cookie";

const ACCESS_COOKIE = "accessToken";
const MAX_AGE = 60 * 60 * 24 * 7; 

function writeAccessCookie(token: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${ACCESS_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${MAX_AGE}; samesite=lax${secure}`;
}

function clearAccessCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

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
        writeAccessCookie(accessToken);
      },
      clearSession: () => {
        set({ user: null, accessToken: null });
        clearAccessCookie();
      },
    }),
    { 
      name: "roomly-auth",

      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) writeAccessCookie(state.accessToken);
      },

    }
  )
);
