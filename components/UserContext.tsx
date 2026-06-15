"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface UserCtx {
  user: PublicUser | null;
  loading: boolean;
  setUser: (u: PublicUser | null) => void;
  logout: () => Promise<void>;
  authOpen: boolean;
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;
  authTab: "login" | "register";
}

export const UserContext = createContext<UserCtx>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: async () => {},
  authOpen: false,
  openAuth: () => {},
  closeAuth: () => {},
  authTab: "login",
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { setUser(d.user ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const openAuth = useCallback((tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout, authOpen, openAuth, closeAuth: () => setAuthOpen(false), authTab }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
