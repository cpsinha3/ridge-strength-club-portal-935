import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import auth from '@/lib/shared/kliv-auth.js';

interface User {
  userUuid: string;
  email: string;
  firstName: string;
  lastName: string;
  groups: Array<{ key: string; name: string }>;
  isPrimaryTeam: boolean;
  userMetadata: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isStaff: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const u = await auth.getUser();
      setUser(u as User | null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const signIn = async (email: string, password: string): Promise<User> => {
    const u = await auth.signIn(email, password);
    setUser(u as User);
    return u as User;
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const isStaff = user?.groups?.some(g => g.key === 'staff') ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, isStaff, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
