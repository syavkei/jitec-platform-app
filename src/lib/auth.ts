"use client";

import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  admin: User | null;
  userToken: string | null;
  adminToken: string | null;
  setUserAuth: (user: User, token: string) => void;
  setAdminAuth: (admin: User, token: string) => void;
  logoutUser: () => void;
  logoutAdmin: () => void;
  initAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  admin: null,
  userToken: null,
  adminToken: null,

  setUserAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jitec_user", JSON.stringify(user));
      localStorage.setItem("jitec_user_token", token);
    }
    set({ user, userToken: token });
  },

  setAdminAuth: (admin, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jitec_admin", JSON.stringify(admin));
      localStorage.setItem("jitec_admin_token", token);
    }
    set({ admin, adminToken: token });
  },

  logoutUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jitec_user");
      localStorage.removeItem("jitec_user_token");
    }
    set({ user: null, userToken: null });
  },

  logoutAdmin: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jitec_admin");
      localStorage.removeItem("jitec_admin_token");
    }
    set({ admin: null, adminToken: null });
  },

  initAuthFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const savedUser = localStorage.getItem("jitec_user");
      const savedUserToken = localStorage.getItem("jitec_user_token");
      if (savedUser && savedUserToken) {
        set({ user: JSON.parse(savedUser), userToken: savedUserToken });
      }

      const savedAdmin = localStorage.getItem("jitec_admin");
      const savedAdminToken = localStorage.getItem("jitec_admin_token");
      if (savedAdmin && savedAdminToken) {
        set({ admin: JSON.parse(savedAdmin), adminToken: savedAdminToken });
      }
    } catch (err) {
      console.error("Failed to load auth from storage", err);
    }
  },
}));
