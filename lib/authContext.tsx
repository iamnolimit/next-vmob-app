'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getUser, saveUser, clearUser, login as doLogin, type UserProfile } from './auth';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (domain: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    // Use setTimeout to avoid synchronous state update during render
    setTimeout(() => {
      setUser(stored);
      setLoading(false);
    }, 0);
  }, []);

  const login = useCallback(
    async (domain: string, username: string, password: string): Promise<boolean> => {
      const profile = await doLogin(domain, username, password);
      if (profile) {
        setUser(profile);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
