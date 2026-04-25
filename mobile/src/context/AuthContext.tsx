import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiRequest } from "../api/client";
import { User } from "../types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function isJwtExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function logout() {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user");
  }

  async function loadStoredAuth() {
    try {
      const savedToken = await SecureStore.getItemAsync("token");
      const savedUser = await SecureStore.getItemAsync("user");

      if (savedToken && savedUser) {
        if (isJwtExpired(savedToken)) {
          await logout();
          return;
        }

        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      if (isJwtExpired(token)) logout();
    }, 30000);

    return () => clearInterval(timer);
  }, [token]);

  async function login(email: string, password: string) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(data.token);
    setUser(data.user);

    await SecureStore.setItemAsync("token", data.token);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
  }

  async function register(name: string, email: string, password: string) {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role: "customer" }),
    });

    await login(email, password);
  }

  async function forgotPassword(email: string) {
    await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, forgotPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);