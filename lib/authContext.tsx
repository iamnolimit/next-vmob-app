'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getUser, saveUser, clearUser, login as doLogin, getSessions, switchSession as doSwitchSession, removeSession as doRemoveSession, type UserProfile } from './auth';

interface AuthContextValue {
  user: UserProfile | null;
  sessions: UserProfile[];
  loading: boolean;
  login: (domain: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchSession: (profile: UserProfile) => void;
  removeSession: (username: string, domain: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  sessions: [],
  loading: true,
  login: async () => false,
  logout: () => {},
  switchSession: () => {},
  removeSession: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    const storedSessions = getSessions();
    // Use setTimeout to avoid synchronous state update during render
    setTimeout(() => {
      setUser(stored);
      setSessions(storedSessions);
      setLoading(false);
    }, 0);
  }, []);

  const login = useCallback(
    async (domain: string, username: string, password: string): Promise<boolean> => {
      const profile = await doLogin(domain, username, password);
      if (profile) {
        setUser(profile);
        setSessions(getSessions());
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
    setSessions([]);
  }, []);

  const switchSession = useCallback((profile: UserProfile) => {
    doSwitchSession(profile);
    setUser(profile);
  }, []);

  const removeSession = useCallback((username: string, domain: string) => {
    doRemoveSession(username, domain);
    setUser(getUser());
    setSessions(getSessions());
  }, []);

  return (
    <AuthContext.Provider value={{ user, sessions, loading, login, logout, switchSession, removeSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
