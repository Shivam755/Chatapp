import { create } from "zustand";

type AuthState = {
  loginId: string | null;
  isSignedIn: boolean;
  setLogin: (loginId: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  loginId: null,
  isSignedIn: false,
  setLogin: (loginId: string) =>
    set({ loginId, isSignedIn: true }),
  signOut: () =>
    set({ loginId: null, isSignedIn: false }),
}));