import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/authService';
import { userRepository } from '../repositories/userRepository';
import { AppUser } from '../types/models';
import { auth } from '../firebase/firebase';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isRoot: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadAppUser(user: User | null) {
    if (!user) { setAppUser(null); return; }
    const data = await userRepository.getById(user.uid);
    setAppUser(data);
  }

  async function signIn() {
    await authService.signInGoogle();
    const current = auth.currentUser;
    setFirebaseUser(current);
    await loadAppUser(current);
  }

  useEffect(() => {
    const off = authService.onChanged(async (u) => {
      try {
        setFirebaseUser(u);
        await loadAppUser(u);
      } catch (error) {
        console.error('Load app user failed:', error);
        setAppUser(null);
      } finally {
        setLoading(false);
      }
    });
    return off;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    firebaseUser,
    appUser,
    loading,
    isApproved: appUser?.status === 'approved',
    isAdmin: appUser?.role === 'root' || appUser?.role === 'admin',
    isRoot: appUser?.role === 'root',
    signIn,
    logout: authService.signOut,
    refreshUser: () => loadAppUser(firebaseUser),
  }), [firebaseUser, appUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
