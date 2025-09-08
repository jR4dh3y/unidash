
'use client';

import { createContext, useContext, ReactNode } from 'react';

// Deprecated Firebase Auth context. No-op to keep legacy imports compiling.
type DeprecatedAuthUser = { uid: string } | null;
interface AuthContextType {
  user: DeprecatedAuthUser;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
