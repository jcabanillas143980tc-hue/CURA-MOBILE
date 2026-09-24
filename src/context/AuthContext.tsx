import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../api/auth';

type User = { id: string; name: string; email: string } | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDevPreviewUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('cura_token');
      if (token) {
        try {
          setUser(await authApi.getCurrentUser());
        } catch {
          await AsyncStorage.removeItem('cura_token');
        }
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => setUser(await authApi.login(email, password));
  const register = async (name: string, email: string, phone: string, password: string) =>
    setUser(await authApi.register(name, email, phone, password));
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  // TEMPORARY: lets you preview Home/Queue/Records/etc. screens before the
  // Laravel backend exists. Sets a fake user with no real token, so any
  // screen that calls the API will still fail — only useful for looking at
  // static UI. Remove this once /login actually works against your backend.
  const loginAsDevPreviewUser = () => {
    setUser({ id: 'dev-preview', name: 'Juan Dela Cruz', email: 'preview@cura.dev' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginAsDevPreviewUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}