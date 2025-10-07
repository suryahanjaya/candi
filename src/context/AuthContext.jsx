import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAccessToken, putAccessToken, login as apiLogin, register as apiRegister, getUserLogged } from '../utils/network-data';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          setInitializing(false);
          return;
        }
        const { error, data } = await getUserLogged();
        if (!error) {
          setUser(data);
        } else {
          setUser(null);
        }
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, []);

  const handleLogin = async ({ email, password }) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error, data } = await apiLogin({ email, password });
      if (error || !data?.accessToken) {
        setAuthError('Login gagal');
        return false;
      }
      putAccessToken(data.accessToken);
      const me = await getUserLogged();
      if (!me.error) {
        setUser(me.data);
        return true;
      }
      setAuthError('Gagal mengambil data pengguna');
      return false;
    } catch (e) {
      setAuthError('Terjadi kesalahan jaringan');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await apiRegister({ name, email, password });
      if (error) {
        setAuthError('Registrasi gagal');
        return false;
      }
      return true;
    } catch (e) {
      setAuthError('Terjadi kesalahan jaringan');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    initializing,
    authLoading,
    authError,
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated: Boolean(user),
  }), [user, initializing, authLoading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


