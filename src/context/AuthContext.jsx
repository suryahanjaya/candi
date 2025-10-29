import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAccessToken, putAccessToken, login as apiLogin, register as apiRegister, getUserLogged, addNote as apiAddNote } from '../utils/network-data';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const { t } = useLanguage();

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
        setAuthError(t('accountNotFound'));
        return false;
      }

      const { error, data } = await apiLogin({ email, password });
      if (error || !data?.accessToken) {
        setAuthError(t('accountNotFound'));
        return false;
      }
      putAccessToken(data.accessToken);
      const me = await getUserLogged();
      if (!me.error) {
        setUser(me.data);
        return true;
      }
      setAuthError(t('failedGetUserData'));
      return false;
    } catch (e) {
      setAuthError(t('networkError'));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      // Check if email is in deleted emails list first
      const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
      if (deletedEmails.includes(email)) {
        // Use special re-registration handler for deleted emails
        return await handleReRegistration({ name, email, password });
      }

      const { error } = await apiRegister({ name, email, password });
      if (error) {
        // Check if it's an email already exists error
        if (error.message && error.message.includes('email')) {
          setAuthError(t('emailAlreadyUsed'));
        } else {
          setAuthError(t('registrationFailed'));
        }
        return false;
      }
      
      // Auto-login after successful register
      const loginResult = await apiLogin({ email, password });
      if (!loginResult.error && loginResult.data?.accessToken) {
        putAccessToken(loginResult.data.accessToken);
        const me = await getUserLogged();
        if (!me.error) {
          setUser(me.data);
          // Mark this user as fresh to skip backend sync on first load
          if (me.data?.email) {
            localStorage.setItem(`freshUser:${me.data.email}`, '1');
            // Also block backend sync for this user to prevent old data from returning
            localStorage.setItem(`blockBackendSync:${me.data.email}`, '1');
          }
          // Create welcome note fresh DB for this user
          await createFreshDatabase();
          return true;
        }
      }
      // Fallback: stay on login if auto-login fails
      return true;
    } catch (e) {
      setAuthError(t('networkError'));
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
    // Remove namespaced notes keys
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key === 'notes' || key.startsWith('notes:'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (_) {}
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    localStorage.removeItem('user');
    // Remove freshUser flag for this email
    if (user?.email) {
      localStorage.removeItem(`freshUser:${user.email}`);
    }
    
    // Add deleted email to prevent re-login
    const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
    if (user?.email && !deletedEmails.includes(user.email)) {
      deletedEmails.push(user.email);
      localStorage.setItem('deletedEmails', JSON.stringify(deletedEmails));
      // Block backend sync permanently for this email unless user opts in
      localStorage.setItem(`blockBackendSync:${user.email}`, '1');
    }
    
    setUser(null);
  };

  // Function to handle re-registration of deleted emails
  const handleReRegistration = async ({ name, email, password }) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      // Remove email from deleted emails list
      const deletedEmails = JSON.parse(localStorage.getItem('deletedEmails') || '[]');
      const updatedDeletedEmails = deletedEmails.filter(deletedEmail => deletedEmail !== email);
      localStorage.setItem('deletedEmails', JSON.stringify(updatedDeletedEmails));
      
      // Clear all existing data to ensure fresh start
      localStorage.removeItem('notes');
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
      localStorage.removeItem('user');
      
      // Try to login with existing credentials (since backend still has the account)
      const loginResult = await apiLogin({ email, password });
      if (!loginResult.error && loginResult.data?.accessToken) {
        putAccessToken(loginResult.data.accessToken);
        const me = await getUserLogged();
        if (!me.error) {
          setUser(me.data);
          
          // Create fresh database with greeting note
          await createFreshDatabase();
          return true;
        }
      }
      
      // If login fails, try registration
      const { error } = await apiRegister({ name, email, password });
      if (error) {
        setAuthError(t('registrationFailed'));
        return false;
      }
      
      // Create fresh database with greeting note for new registration
      await createFreshDatabase();
      return true;
    } catch (e) {
      setAuthError(t('networkError'));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Function to create fresh database with greeting note
  const createFreshDatabase = async () => {
    try {
      // Clear existing notes first to ensure fresh start
      // Clear namespaced notes for this user
      if (user?.email) {
        localStorage.removeItem(`notes:${user.email}`);
        localStorage.setItem(`freshUser:${user.email}`, '1');
      } else {
        localStorage.removeItem('notes');
      }
      
      // Create a welcome note
      const welcomeNote = {
        title: t('welcomeNoteTitle'),
        body: t('welcomeNoteBody'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archived: false
      };
      
      // Add the welcome note to localStorage
      const newNote = {
        id: Date.now().toString(),
        ...welcomeNote
      };
      
      if (user?.email) {
        localStorage.setItem(`notes:${user.email}`, JSON.stringify([newNote]));
      } else {
        localStorage.setItem('notes', JSON.stringify([newNote]));
      }
      
      // Also try to add to backend if possible
      try {
        await apiAddNote({ title: welcomeNote.title, body: welcomeNote.body });
      } catch (e) {
        // If backend fails, that's okay - we have it in localStorage
        console.log('Welcome note saved locally only');
      }
    } catch (e) {
      console.log('Error creating fresh database:', e);
    }
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
    handleReRegistration,
    isAuthenticated: Boolean(user),
  }), [user, initializing, authLoading, authError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


