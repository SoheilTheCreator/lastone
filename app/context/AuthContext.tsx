'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

type AuthData = {
  token: string;
  userId: string;
  screenName: string;
};

type AuthContextType = {
  auth: AuthData | null;
  screenName: string | null;
  isReady: boolean;               // <<< hydration finished
  login: (data: AuthData) => void;
  logout: () => void;
};

const STORAGE_KEY = "auth_v1";    // versioned key is safer for future changes

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Load from localStorage on first mount (client only)
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined"
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;

      if (saved) {
        const parsed = JSON.parse(saved) as AuthData;
        // basic sanity check
        if (parsed?.token && parsed?.userId) {
          setAuth(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to parse auth from localStorage", e);
    } finally {
      setIsReady(true);
    }
  }, []);

  const login = (data: AuthData) => {
    setAuth(data);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save auth to localStorage", e);
    }
  };

  const logout = () => {
    setAuth(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear auth from localStorage", e);
    }
  };

  const value = useMemo(
    () => ({
      auth,
      screenName: auth?.screenName ?? null,
      isReady,
      login,
      logout,
    }),
    [auth, isReady]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
