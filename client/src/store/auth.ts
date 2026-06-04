import { TOKEN_PREFIX } from "@/constants/common";
import { apiInstance } from "@/services/_base";
import type { ICurrentUser } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user: ICurrentUser | null;
  sessionActive: boolean;
  setUser: (user: ICurrentUser | null) => void;
  activateSession: (token: string) => void;
  resetUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionActive: Boolean(localStorage.getItem(TOKEN_PREFIX)),
  setUser: (user) => set({ user }),
  activateSession: (token) => {
    localStorage.setItem(TOKEN_PREFIX, token);
    apiInstance.defaults.headers.Authorization = `Bearer ${token}`;
    set({ sessionActive: true });
  },
  resetUser: () => {
    localStorage.removeItem(TOKEN_PREFIX);
    delete apiInstance.defaults.headers.Authorization;
    set({ user: null, sessionActive: false });
  },
}));
