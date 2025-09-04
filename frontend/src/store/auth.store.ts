import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import CryptoJS from "crypto-js";

type AuthState = {
  loginId: string | null;
  isSignedIn: boolean;
  data: UserData | null;
  setLogin: (loginId: string) => void;
  signOut: () => void;
  setData: (data: UserData | null) => void;
};

const encryptedStorage: PersistStorage<AuthState> = {
  getItem: (name) => {
    const data = localStorage.getItem(name);
    if (!data) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(
        data,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY
      );
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    console.log(typeof value);

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name) => localStorage.removeItem(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loginId: null,
      isSignedIn: false,
      data: null,
      setLogin: (loginId: string) => set({ loginId, isSignedIn: true }),
      setData: (data: UserData | null) => set({ data: data }),
      signOut: () => set({ loginId: null, isSignedIn: false, data: null }),
    }),
    {
      name: "auth-storage",
      storage: encryptedStorage, // 🔐 use encrypted storage
    }
  )
);
