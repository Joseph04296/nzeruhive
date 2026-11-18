import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthDialogContext = createContext({
  mode: null,
  openAuth: () => {},
  closeAuth: () => {},
  switchAuth: () => {},
});

const normalise = (mode) => (mode === 'register' ? 'register' : 'login');

export function AuthDialogProvider({ children }) {
  const [mode, setMode] = useState(null);

  const openAuth = useCallback((next) => setMode(normalise(next)), []);
  const closeAuth = useCallback(() => setMode(null), []);
  const switchAuth = useCallback((next) => setMode(normalise(next)), []);

  const value = useMemo(
    () => ({ mode, openAuth, closeAuth, switchAuth }),
    [mode, openAuth, closeAuth, switchAuth],
  );

  return <AuthDialogContext.Provider value={value}>{children}</AuthDialogContext.Provider>;
}

export function useAuthDialog() {
  return useContext(AuthDialogContext).openAuth;
}

export function useAuthDialogState() {
  return useContext(AuthDialogContext);
}
