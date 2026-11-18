import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('u') || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = ({ token, user: nextUser }) => {
    localStorage.setItem('t', token);
    localStorage.setItem('u', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
