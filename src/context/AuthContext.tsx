'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  userId: number;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  showLoginModal: boolean;
  loginMode: 'login' | 'register';
  openLoginModal: (mode?: 'login' | 'register', redirect?: string) => void;
  closeLoginModal: () => void;
  login: (username: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [loginRedirect, setLoginRedirect] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((r) => r.json())
      .then(({ user }) => {
        setUser(user ?? null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.user);
    setShowLoginModal(false);
    if (loginRedirect) {
      router.push(loginRedirect);
      setLoginRedirect(null);
    }
    return {};
  };

  const register = async (username: string, password: string) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    setUser(data.user);
    setShowLoginModal(false);
    if (loginRedirect) {
      router.push(loginRedirect);
      setLoginRedirect(null);
    }
    return {};
  };

  const logout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const openLoginModal = (
    mode: 'login' | 'register' = 'login',
    redirect?: string
  ) => {
    setLoginMode(mode);
    setLoginRedirect(redirect ?? null);
    setShowLoginModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        showLoginModal,
        loginMode,
        openLoginModal,
        closeLoginModal: () => setShowLoginModal(false),
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
