import type { ICurrentUser } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user: ICurrentUser | null;
  setUser: (user: ICurrentUser | null) => void;
  resetUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
