import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getActiveNotes as apiGetActiveNotes,
  getArchivedNotes as apiGetArchivedNotes,
  addNote as apiAddNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  unarchiveNote as apiUnarchiveNote,
  getNote as apiGetNote,
} from '../utils/network-data';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeNotes, setActiveNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadNotes = async () => {
    if (!isAuthenticated) {
      setActiveNotes([]);
      setArchivedNotes([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [act, arc] = await Promise.all([
        apiGetActiveNotes(),
        apiGetArchivedNotes(),
      ]);
      if (!act.error && Array.isArray(act.data)) setActiveNotes(act.data);
      if (!arc.error && Array.isArray(arc.data)) setArchivedNotes(arc.data);
    } catch (e) {
      setError('Gagal memuat catatan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [isAuthenticated]);

  const addNote = async ({ title, body }) => {
    setLoading(true);
    try {
      const res = await apiAddNote({ title, body });
      if (!res.error && res.data) {
        setActiveNotes(prev => [res.data, ...prev]);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiDeleteNote(id);
      if (!res.error) {
        setActiveNotes(prev => prev.filter(n => n.id !== id));
        setArchivedNotes(prev => prev.filter(n => n.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  const archiveNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiArchiveNote(id);
      if (!res.error) {
        const note = activeNotes.find(n => n.id === id);
        if (note) {
          setActiveNotes(prev => prev.filter(n => n.id !== id));
          setArchivedNotes(prev => [{ ...note, archived: true }, ...prev]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const unarchiveNote = async (id) => {
    setLoading(true);
    try {
      const res = await apiUnarchiveNote(id);
      if (!res.error) {
        const note = archivedNotes.find(n => n.id === id);
        if (note) {
          setArchivedNotes(prev => prev.filter(n => n.id !== id));
          setActiveNotes(prev => [{ ...note, archived: false }, ...prev]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getNote = async (id) => {
    return apiGetNote(id);
  };

  const editNote = async (id, { title, body }) => {
    setLoading(true);
    try {
      // Update the note in the local state
      const updatedNote = { id, title, body, updatedAt: new Date().toISOString() };
      
      // Update active notes
      setActiveNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      ));
      
      // Update archived notes if it exists there
      setArchivedNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      ));
      
      // Save to localStorage for persistence
      const allNotes = [...activeNotes, ...archivedNotes];
      const updatedNotes = allNotes.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      );
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      
      return { success: true };
    } catch (error) {
      console.error('Error editing note:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateNoteDate = async (id, newDate) => {
    setLoading(true);
    try {
      const updatedNote = { 
        id, 
        createdAt: newDate, 
        updatedAt: new Date().toISOString() 
      };
      
      // Update active notes
      setActiveNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      ));
      
      // Update archived notes if it exists there
      setArchivedNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      ));
      
      // Save to localStorage for persistence
      const allNotes = [...activeNotes, ...archivedNotes];
      const updatedNotes = allNotes.map(note => 
        note.id === id ? { ...note, ...updatedNote } : note
      );
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating note date:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    loading,
    error,
    getActive: () => activeNotes,
    getArchived: () => archivedNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    getNote,
    editNote,
    updateNoteDate,
  }), [loading, error, activeNotes, archivedNotes]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
