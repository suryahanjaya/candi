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
      // Check if email is in deleted emails list
      const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
      if (deletedEmails.includes(email)) {
        setAuthError('Akun dengan email ini telah dihapus. Silakan daftar ulang.');
        return false;
      }

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
      // Remove email from deleted emails list if user re-registers
      const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
      const updatedDeletedEmails = deletedEmails.filter(deletedEmail => deletedEmail !== email);
      localStorage.setItem('deletedEmails', JSON.stringify(updatedDeletedEmails));

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

  const deleteAccount = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('notes');
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    localStorage.removeItem('user');
    
    // Add deleted email to prevent re-login
    const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
    if (user?.email && !deletedEmails.includes(user.email)) {
      deletedEmails.push(user.email);
      localStorage.setItem('deletedEmails', JSON.stringify(deletedEmails));
    }
    
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
    deleteAccount,
    isAuthenticated: Boolean(user),
  }), [user, initializing, authLoading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


