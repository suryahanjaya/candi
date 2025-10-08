import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const messages = {
  id: {
    appTitle: 'CANDI',
    appSubtitle: 'Catatan Digital',
    home: 'Beranda',
    add: 'Tambah',
    archive: 'Arsip',
    searchPlaceholder: 'Cari catatan...',
    empty: 'Tidak ada catatan',
    archivedEmptyTitle: 'Arsip Kosong',
    archivedEmptyDesc: 'Belum ada catatan yang diarsipkan. Arsipkan catatan untuk menyimpannya di sini.',
    back: '← Kembali',
    noteNotFound: 'Catatan tidak ditemukan',
    created: 'Dibuat',
    updated: 'Diperbarui',
    edit: 'Edit',
    changeDate: 'Ubah Tanggal',
    updating: 'Memperbarui...',
    delete: 'Hapus',
    unarchive: 'Batal Arsip',
    archiveAction: 'Arsipkan',
    addTitle: 'Tambah Catatan Baru',
    title: 'Judul',
    body: 'Isi Catatan',
    save: 'Simpan',
    cancel: 'Batal',
    loading: 'Memuat...',
    login: 'Masuk',
    register: 'Daftar',
    name: 'Nama',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi Password',
    logout: 'Keluar',
    welcome: 'SELAMAT DATANG',
    headline: 'CANDI - CATATAN DIGITAL',
    description: '',
    signIn: 'Masuk',
    signUp: 'Daftar',
    userName: 'Nama Pengguna',
    fullName: 'Nama Lengkap',
    createPassword: 'Buat Password',
    confirmPasswordLabel: 'Konfirmasi Password',
    rememberMe: 'Ingat Saya',
    forgotPassword: 'Lupa Password?',
    createAccount: 'Buat Akun',
    signInButton: 'Masuk',
    signUpButton: 'Daftar',
    alreadyHaveAccount: 'Sudah punya akun? Masuk',
    dontHaveAccount: 'Belum punya akun? Daftar',
    passwordStrength: 'Kekuatan Password',
    showPassword: 'TAMPILKAN',
  },
  en: {
    appTitle: 'CANDI',
    appSubtitle: 'Digital Notes',
    home: 'Home',
    add: 'Add',
    archive: 'Archive',
    searchPlaceholder: 'Search notes...',
    empty: 'No notes',
    archivedEmptyTitle: 'Empty Archive',
    archivedEmptyDesc: 'No archived notes yet. Archive notes to keep them here.',
    back: '← Back',
    noteNotFound: 'Note not found',
    created: 'Created',
    updated: 'Updated',
    edit: 'Edit',
    changeDate: 'Change Date',
    updating: 'Updating...',
    delete: 'Delete',
    unarchive: 'Unarchive',
    archiveAction: 'Archive',
    addTitle: 'Add New Note',
    title: 'Title',
    body: 'Note Body',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    login: 'Login',
    register: 'Register',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    logout: 'Logout',
    welcome: 'WELCOME',
    headline: 'CANDI - DIGITAL NOTES',
    description: '',
    signIn: 'Sign in',
    signUp: 'Sign up',
    userName: 'User name',
    fullName: 'Full name',
    createPassword: 'Create password',
    confirmPasswordLabel: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create account',
    signInButton: 'Sign in',
    signUpButton: 'Sign up',
    alreadyHaveAccount: 'Already have an account? Sign in',
    dontHaveAccount: "Don't have an account? Sign up",
    passwordStrength: 'Password strength',
    showPassword: 'SHOW',
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'id');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(prev => (prev === 'id' ? 'en' : 'id'));

  const t = (key) => messages[lang][key] || key;

  const value = useMemo(() => ({ lang, toggleLang, t }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


