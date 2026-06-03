import { IUser } from "@/services/auth.service";
import { create } from "zustand";

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  updateUser: (user: Partial<IUser>) => void;
  resetUser: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
  updateUser: (user) => {
    const newUser = structuredClone(get().user || {});
    set({
      user: {
        ...newUser,
        ...user,
      } as any,
    });
  },
}));
